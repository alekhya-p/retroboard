import json
import logging
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect

from ..models.game_room import GameRoom
from ..models.user import UserBase, AnonymousUser
from ..services.game_room_service import GameRoomService
from ..services.auth_service import AuthService
from ..core.auth import get_current_user
from ..main import get_game_room_service


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/game-rooms", tags=["game-rooms"])


class _DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


# Presence per-room. Separate from the boards websocket store so a board id
# and a game-room id never collide.
active_connections: dict[str, List[dict]] = {}


async def _get_connected_users(room_id: str) -> list:
    return [c["user"] for c in active_connections.get(room_id, []) if c.get("user")]


async def _broadcast(room_id: str, payload: dict, exclude: WebSocket = None) -> None:
    raw = json.dumps(payload, cls=_DateTimeEncoder)
    for conn in active_connections.get(room_id, []):
        if conn["websocket"] is exclude:
            continue
        try:
            await conn["websocket"].send_text(raw)
        except Exception as exc:
            logger.error("game-room broadcast failed: %s", exc)


@router.post("", response_model=GameRoom)
async def create_room(
    room: GameRoom,
    current_user: UserBase = Depends(get_current_user),
    service: GameRoomService = Depends(get_game_room_service),
):
    if isinstance(current_user, AnonymousUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anonymous users cannot create game rooms",
        )
    room.facilitator_id = current_user.id
    return await service.create_room(room)


@router.get("", response_model=List[GameRoom])
async def list_my_rooms(
    current_user: UserBase = Depends(get_current_user),
    service: GameRoomService = Depends(get_game_room_service),
):
    """List the game rooms created by the current user (newest first).

    Guests have no persistent identity, so they get an empty list - this is the
    account feature that stops link-only rooms from getting lost.
    """
    if isinstance(current_user, AnonymousUser):
        return []
    return await service.get_rooms_by_facilitator(current_user.id)


@router.get("/{room_id}", response_model=GameRoom)
async def get_room(
    room_id: str,
    current_user: UserBase = Depends(get_current_user),
    service: GameRoomService = Depends(get_game_room_service),
):
    room = await service.get_room(room_id)
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game room not found")
    return room


@router.delete("/{room_id}")
async def delete_room(
    room_id: str,
    current_user: UserBase = Depends(get_current_user),
    service: GameRoomService = Depends(get_game_room_service),
):
    room = await service.get_room(room_id)
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game room not found")
    if room.facilitator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the facilitator can delete the room",
        )
    await service.delete_room(room_id)
    return {"message": "Game room deleted successfully"}


@router.websocket("/ws/{room_id}")
async def game_room_ws(
    websocket: WebSocket,
    room_id: str,
    service: GameRoomService = Depends(get_game_room_service),
):
    try:
        await websocket.accept()

        auth_data = await websocket.receive_json()
        if not auth_data or auth_data.get("type") != "auth" or "token" not in auth_data:
            await websocket.close(
                code=status.WS_1008_POLICY_VIOLATION,
                reason="Missing or invalid authentication",
            )
            return

        claims = AuthService.verify_access_token(auth_data["token"])
        if not claims:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token")
            return

        room = await service.get_room(room_id)
        if not room:
            await websocket.close(
                code=status.WS_1008_POLICY_VIOLATION,
                reason="Game room not found",
            )
            return

        user = {
            "id": claims["id"],
            "display_name": claims.get("display_name", "Anonymous"),
        }
        connection = {"websocket": websocket, "user": user}
        active_connections.setdefault(room_id, []).append(connection)

        try:
            users = await _get_connected_users(room_id)
            initial = {
                "type": "initial_data",
                "board": room.model_dump(),
                "messages": [],
                "users": users,
            }
            await websocket.send_text(json.dumps(initial, cls=_DateTimeEncoder))

            await _broadcast(
                room_id,
                {"type": "board_update", "action": "user_connected", "data": user},
                exclude=websocket,
            )

            while True:
                data = await websocket.receive_text()
                try:
                    message_data = json.loads(data)
                except json.JSONDecodeError:
                    continue
                if not isinstance(message_data, dict):
                    continue
                # Game rooms only relay game events + presence - every payload
                # gets stamped with the sender and fanned out to all clients
                # (including the sender so they observe their own move).
                if message_data.get("type") in ("game_event", "room_event"):
                    message_data.setdefault("sender", user)
                    await _broadcast(room_id, message_data)
        except WebSocketDisconnect:
            pass
        except Exception as exc:
            logger.error("game-room ws loop error: %s", exc)
        finally:
            conns = active_connections.get(room_id)
            if conns and connection in conns:
                conns.remove(connection)
                await _broadcast(
                    room_id,
                    {"type": "board_update", "action": "user_disconnected", "data": user},
                    exclude=websocket,
                )
                if not conns:
                    active_connections.pop(room_id, None)
    except Exception as exc:
        logger.error("game-room ws fatal: %s", exc)
        try:
            await websocket.close(
                code=status.WS_1011_INTERNAL_ERROR,
                reason="Internal server error",
            )
        except Exception:
            pass
