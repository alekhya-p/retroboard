import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect

from ..services.auth_service import AuthService
from ..models.message import Message, MessageText
from ..services.message_service import MessageService
from ..services.board_service import BoardService
from ..core.auth import get_current_user
from ..models.user import UserBase, AnonymousUser
import json
from datetime import datetime
from ..main import get_board_service,get_message_service

router = APIRouter(prefix="/messages", tags=["messages"])

# Custom JSON encoder to handle datetime objects
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

# WebSocket connections store
active_connections: dict[str, List[WebSocket]] = {}

async def broadcast_message(board_id: str, message_data: dict, action: str = "message_updated"):
    """Helper function to broadcast messages to all WebSocket connections."""
    if board_id in active_connections:
        try:
            # Create a properly formatted message with type
            formatted_message = {
                "type": "message_update",
                "action": action,
                "data": message_data
            }
            
            message_json = json.dumps(formatted_message, cls=DateTimeEncoder)
            for connection in active_connections[board_id]:
                try:
                    await connection["websocket"].send_text(message_json)
                except Exception as e:
                    logging.error(f"Error sending message to connection: {str(e)}")
        except Exception as e:
            logging.error(f"Error broadcasting message: {str(e)}")

async def broadcast_board_update(board_id: str, action: str, data: dict, sender: WebSocket = None):
    """Helper function to broadcast board updates to all WebSocket connections."""
    if board_id in active_connections:
        try:
            update_data = {
                "type": "board_update",
                "action": action,
                "data": data
            }
            update_json = json.dumps(update_data, cls=DateTimeEncoder)
            for connection in active_connections[board_id]:
                if connection["websocket"] != sender:  # Exclude the sender WebSocket
                    try:
                        await connection["websocket"].send_text(update_json)
                    except Exception as e:
                        logging.error(f"Error sending message to connection: {str(e)}")
        except Exception as e:
            logging.error(f"Error broadcasting message: {str(e)}")

async def get_connected_users(board_id: str) -> list:
    """Get all users currently connected to a specific board."""
    connected_users = []
    if board_id in active_connections:
        for websocket in active_connections[board_id]:
            # Assuming you store user information in the WebSocket's state or context
            user = websocket["user"]
            if user:
                connected_users.append(user)
    return connected_users

@router.websocket("/ws/{board_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    board_id: str,
    board_service: BoardService = Depends(get_board_service),
    message_service: MessageService = Depends(get_message_service)
):
    try:
        # Accept the connection first
        await websocket.accept()
        
        # Wait for authentication message
        auth_data = await websocket.receive_json()
        if not auth_data or auth_data.get("type") != "auth" or "token" not in auth_data:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Missing or invalid authentication")
            return
        
        # Extract the token
        token = auth_data["token"]
        
        # Verify the token and get user
        claims = AuthService.verify_access_token(token)
        if not claims:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token")
            return
        # Verify board exists
        board = await board_service.get_board(board_id)
        if not board:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Board not found")
            return
        user = {
            "id": claims["id"],
            "display_name": claims.get("display_name", "Anonymous")
        }

        connection = {
            "websocket": websocket,
            "user": user
        }
        # Add connection to active connections
        if board_id not in active_connections:
            active_connections[board_id] = []
        active_connections[board_id].append(connection)
        
        try:
            # Send initial board data
            board_data = await board_service.get_board(board_id)
            messages_data = await message_service.get_messages_by_board(board_id)
            
           
            
            messages_dict = []
            for msg in messages_data:
                msg_dict = msg.model_dump()
                messages_dict.append(msg_dict)
            users = await get_connected_users(board_id)
            initial_data = {
                "type": "initial_data",
                "board": board_data.model_dump(),
                "messages": messages_dict,
                "users": users,
            }
            
            # Use json.dumps with the custom encoder instead of send_json with cls parameter
            await websocket.send_text(json.dumps(initial_data, cls=DateTimeEncoder))
            await broadcast_board_update(board_id, "user_connected", connection["user"], connection["websocket"])
            # Then start receiving messages
            while True:
                data = await websocket.receive_text()
                message_data = json.loads(data)
                if isinstance(message_data, dict) and message_data.get("type") in ("game_event", "room_event"):
                    # Mini Games / room navigation: stamp the sender and fan out to
                    # every participant (including the sender).
                    message_data.setdefault("sender", connection["user"])
                    fanout = json.dumps(message_data, cls=DateTimeEncoder)
                    for conn in active_connections.get(board_id, []):
                        try:
                            await conn["websocket"].send_text(fanout)
                        except Exception as e:
                            logging.error(f"Error sending game event: {str(e)}")
                else:
                    await broadcast_message(board_id, message_data)
        except WebSocketDisconnect:
            pass
        except Exception:
            pass
        finally:
            # Remove connection when client disconnects
            if board_id in active_connections:
                active_connections[board_id].remove(connection)
                # Broadcast user disconnected event
                await broadcast_board_update(board_id, "user_disconnected",connection["user"], connection["websocket"])
                if not active_connections[board_id]:
                    del active_connections[board_id]
    except Exception:
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR, reason="Internal server error")

@router.post("", response_model=Message)
async def create_message(
    message: Message,
    current_user: UserBase = Depends(get_current_user),
    message_service: MessageService = Depends(get_message_service),
    board_service: BoardService = Depends(get_board_service)
):
    # Verify board exists and user has access
    board = await board_service.get_board(message.retro_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    # Check if column_id exists in board columns
    column_exists = any(column.id == message.column_id for column in board.columns)
    if not column_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid column ID for this board"
        )
    
    # Set user information
    message.user_id = current_user.id
    message.user_display_name = current_user.display_name
    
    # Create message
    created_message = await message_service.create_message(message)
    
    # Broadcast to WebSocket connections
    await broadcast_message(message.retro_id, created_message.model_dump(), "message_created")
    
    return created_message

@router.get("/board/{board_id}", response_model=List[Message])
async def get_board_messages(
    board_id: str,
    message_service: MessageService = Depends(get_message_service),
    board_service: BoardService = Depends(get_board_service),
    current_user: UserBase = Depends(get_current_user),
):
    # Verify board exists and user has access
    board = await board_service.get_board(board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    return await message_service.get_messages_by_board(board_id)

@router.get("/board/{board_id}/column/{column_id}", response_model=List[Message])
async def get_column_messages(
    board_id: str,
    column_id: str,
    message_service: MessageService = Depends(get_message_service),
    board_service: BoardService = Depends(get_board_service),
    current_user: UserBase = Depends(get_current_user),
):
    # Verify board exists and user has access
    board = await board_service.get_board(board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    return await message_service.get_messages_by_column(board_id, column_id)

@router.post("/{message_id}/like", response_model=Message)
async def toggle_message_like(
    message_id: str,
    current_user: UserBase = Depends(get_current_user),
    message_service: MessageService = Depends(get_message_service),
    board_service: BoardService = Depends(get_board_service)
):
    if isinstance(current_user, AnonymousUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anonymous users cannot like messages"
        )
    
    message = await message_service.toggle_like(message_id, current_user.id)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    
    # Broadcast the update to all WebSocket connections
    await broadcast_message(message.retro_id, message.model_dump(), "message_updated")
    
    return message

@router.patch("/{message_id}", response_model=Message)
async def update_message(
    message_id: str,
    message_update: MessageText,
    current_user: UserBase = Depends(get_current_user),
    message_service: MessageService = Depends(get_message_service),
    board_service: BoardService = Depends(get_board_service)
):
    # Get the existing message
    existing_message = await message_service.get_message(message_id)
    if not existing_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Get the board to check if user is facilitator
    board = await board_service.get_board(existing_message.retro_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    # Only allow message creator or board facilitator to update
    if existing_message.user_id != current_user.id and board.facilitator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this message"
        )
    
    # Only allow updating the text field
    existing_message.text = message_update.text
    existing_message.column_id = message_update.column_id

    
    updated_message = await message_service.update_message(message_id, existing_message)
    if not updated_message:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update message"
        )

    
    # Broadcast the update to all WebSocket connections
    await broadcast_message(existing_message.retro_id, updated_message.model_dump(), "message_updated")
    
    return updated_message

@router.delete("/{message_id}")
async def delete_message(
    message_id: str,
    current_user: UserBase = Depends(get_current_user),
    message_service: MessageService = Depends(get_message_service),
    board_service: BoardService = Depends(get_board_service)
):
    message = await message_service.get_message(message_id)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Only allow message creator
    # Get the board to check if user is facilitator
    board = await board_service.get_board(message.retro_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    # Allow deletion if user is message creator or board facilitator
    if message.user_id != current_user.id and board.facilitator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this message"
        )
    
    success = await message_service.delete_message(message_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete message"
        )
    
    # Broadcast deletion to WebSocket connections
    await broadcast_message(message.retro_id, {"id": message_id}, "message_deleted",)
    
    return {"message": "Message deleted successfully"} 