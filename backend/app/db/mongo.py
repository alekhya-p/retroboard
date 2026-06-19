from typing import Optional, Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from bson import ObjectId
from ..core.config import get_settings
from .interfaces import DatabaseInterface

settings = get_settings()

class MongoDB(DatabaseInterface):
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

    async def connect(self):
        if self.client is None:
            try:
                self.client = AsyncIOMotorClient(settings.MONGO_DB_URL)
                default_db = self.client.get_default_database()
                db_name = default_db.name if default_db is not None else "retroboard-db"
                self.db = default_db if default_db is not None else self.client["retroboard-db"]
                await self.db.list_collection_names()
                print(f"Successfully connected to MongoDB database '{db_name}'")
            except Exception as e:
                print(f"Error connecting to MongoDB: {str(e)}")
                raise

    async def close(self):
        if self.client is not None:
            self.client.close()
            self.client = None
            self.db = None

    def get_db(self) -> Optional[AsyncIOMotorDatabase]:
        return self.db

    async def get_collection(self, collection_name: str):
        if self.db is None:
            await self.connect()
        return self.db[collection_name]

    async def get_document(self, collection_name: str, document_id: str) -> Optional[Dict[str, Any]]:
        if self.db is None:
            await self.connect()
        try:
            doc = await self.db[collection_name].find_one({"_id": ObjectId(document_id)})
        except Exception:
            return None
        if doc:
            doc["id"] = str(doc["_id"])
            return doc
        return None

    async def add_document(self, collection_name: str, data: Dict[str, Any]) -> str:
        if self.db is None:
            await self.connect()
        print(f"Adding document to collection '{collection_name}': {data}")
        result = await self.db[collection_name].insert_one(data)
        return str(result.inserted_id)

    async def update_document(self, collection_name: str, document_id: str, data: Dict[str, Any]) -> None:
        if self.db is None:
            await self.connect()
        await self.db[collection_name].update_one({"_id": ObjectId(document_id)}, {"$set": data})

    async def delete_document(self, collection_name: str, document_id: str) -> None:
        if self.db is None:
            await self.connect()
        await self.db[collection_name].delete_one({"_id": ObjectId(document_id)})

    async def get_documents(self, collection_name: str, query: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        if self.db is None:
            await self.connect()
        cursor = self.db[collection_name].find(query or {})
        docs = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            docs.append(doc)
        return docs

mongodb = MongoDB()