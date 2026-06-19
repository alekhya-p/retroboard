from typing import Optional, Dict, Any, List
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from ..core.config import get_settings
from .interfaces import DatabaseInterface

settings = get_settings()

class FirestoreDB(DatabaseInterface):
    client: Optional[firestore.Client] = None
    db: Optional[firestore.Client] = None

    async def connect(self):
        if self.client is None:
            try:
                self.client = firestore.Client(
                    project=settings.GOOGLE_CLOUD_PROJECT,
                    database="retroboard-db-ew4"
                )
                self.db = self.client
                test_collection = self.db.collection("test")
                test_collection.limit(1).get()
                print("Successfully connected to Firestore database 'retroboard-db-ew4'")
            except Exception as e:
                print(f"Error connecting to Firestore: {str(e)}")
                raise

    async def close(self):
        if self.client is not None:
            self.client.close()
            self.client = None
            self.db = None

    def get_db(self) -> Optional[firestore.Client]:
        return self.db

    async def get_collection(self, collection_name: str):
        if self.db is None:
            await self.connect()
        return self.db.collection(collection_name)

    async def get_document(self, collection_name: str, document_id: str) -> Optional[Dict[str, Any]]:
        if self.db is None:
            await self.connect()
        doc_ref = self.db.collection(collection_name).document(document_id)
        doc = doc_ref.get()
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            return data
        return None

    async def add_document(self, collection_name: str, data: Dict[str, Any]) -> str:
        if self.db is None:
            await self.connect()
        doc_ref = self.db.collection(collection_name).document()
        doc_ref.set(data)
        return doc_ref.id

    async def update_document(self, collection_name: str, document_id: str, data: Dict[str, Any]) -> None:
        if self.db is None:
            await self.connect()
        doc_ref = self.db.collection(collection_name).document(document_id)
        doc_ref.update(data)

    async def delete_document(self, collection_name: str, document_id: str) -> None:
        if self.db is None:
            await self.connect()
        doc_ref = self.db.collection(collection_name).document(document_id)
        doc_ref.delete()

    async def get_documents(self, collection_name: str, query: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        if self.db is None:
            await self.connect()
        collection_ref = self.db.collection(collection_name)
        if query:
            for field, value in query.items():
                if isinstance(value, dict) and "$in" in value:
                    collection_ref = collection_ref.where(filter=FieldFilter(field, "in", value["$in"]))
                else:
                    collection_ref = collection_ref.where(filter=FieldFilter(field, '==', value))
        docs = collection_ref.stream()
        return [{"id": doc.id, **doc.to_dict()} for doc in docs]

firestore_db = FirestoreDB()