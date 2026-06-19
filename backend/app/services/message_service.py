from typing import List, Optional
from ..models.message import Message

class MessageService:
    def __init__(self,db):
        self.db = db

    async def create_message(self, message: Message) -> Message:
        message_data = message.to_db()
        doc_id = await self.db.add_document("messages", message_data)
        created_message = await self.db.get_document("messages", doc_id)
        if not created_message:
            raise Exception("Failed to create message")
        return Message.from_db(created_message)

    async def get_message(self, message_id: str) -> Optional[Message]:
        message = await self.db.get_document("messages", message_id)
        return Message.from_db(message) if message else None

    async def get_messages_by_board(self, retro_id: str) -> List[Message]:
        messages = await self.db.get_documents("messages", {"retro_id": retro_id})
        return [Message.from_db(message) for message in messages]

    async def get_messages_by_column(self, retro_id: str, column_id: str) -> List[Message]:
        messages = await self.db.get_documents("messages", {
            "retro_id": retro_id,
            "column_id": column_id
        })
        return [Message.from_db(message) for message in messages]

    async def update_message(self, message_id: str, message_update: Message) -> Optional[Message]:
        update_data = message_update.to_db()
        await self.db.update_document("messages", message_id, update_data)
        updated_message = await self.db.get_document("messages", message_id)
        return Message.from_db(updated_message) if updated_message else None

    async def delete_message(self, message_id: str) -> bool:
        await self.db.delete_document("messages", message_id)
        return True
    
    async def delete_messages_by_board(self, retro_id: str) -> bool:
        messages = await self.get_messages_by_board(retro_id)
        for message in messages:
            await self.delete_message(message.id)
        return True

    async def toggle_like(self, message_id: str, user_id: str) -> Optional[Message]:
        message = await self.get_message(message_id)
        if not message:
            return None

        # Initialize likes as a list if it's None
        if message.likes is None:
            message.likes = []

        if user_id in message.likes:
            message.likes.remove(user_id)
        else:
            message.likes.append(user_id)

        return await self.update_message(message_id, message) 