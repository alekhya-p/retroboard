from typing import List, Optional
from datetime import datetime, timezone
from ..models.game_room import GameRoom


COLLECTION = "game_rooms"


class GameRoomService:
    def __init__(self, db):
        self.db = db

    async def create_room(self, room: GameRoom) -> GameRoom:
        data = room.to_db()
        doc_id = await self.db.add_document(COLLECTION, data)
        created = await self.db.get_document(COLLECTION, doc_id)
        if not created:
            raise Exception("Failed to create game room")
        return GameRoom.from_db(created)

    async def get_room(self, room_id: str) -> Optional[GameRoom]:
        room = await self.db.get_document(COLLECTION, room_id)
        return GameRoom.from_db(room) if room else None

    async def get_rooms_by_facilitator(self, facilitator_id: str) -> List[GameRoom]:
        """All game rooms created by a given user, newest first."""
        rooms = await self.db.get_documents(COLLECTION, {"facilitator_id": facilitator_id})
        out = [GameRoom.from_db(r) for r in rooms]
        out.sort(
            key=lambda r: r.created_at or datetime.min.replace(tzinfo=timezone.utc),
            reverse=True,
        )
        return out

    async def delete_room(self, room_id: str) -> bool:
        await self.db.delete_document(COLLECTION, room_id)
        return True
