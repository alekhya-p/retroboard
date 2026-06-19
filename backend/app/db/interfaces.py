from typing import Optional, Dict, Any, List
from abc import ABC, abstractmethod

class DatabaseInterface(ABC):
    @abstractmethod
    async def connect(self):
        pass

    @abstractmethod
    async def close(self):
        pass

    @abstractmethod
    def get_db(self):
        pass

    @abstractmethod
    async def get_collection(self, collection_name: str):
        pass

    @abstractmethod
    async def get_document(self, collection_name: str, document_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def add_document(self, collection_name: str, data: Dict[str, Any]) -> str:
        pass

    @abstractmethod
    async def update_document(self, collection_name: str, document_id: str, data: Dict[str, Any]) -> None:
        pass

    @abstractmethod
    async def delete_document(self, collection_name: str, document_id: str) -> None:
        pass

    @abstractmethod
    async def get_documents(self, collection_name: str, query: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        pass