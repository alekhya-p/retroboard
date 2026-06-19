from datetime import datetime, UTC
from typing import Optional, Dict, Any, ClassVar
from pydantic import BaseModel, Field


class BaseDBModel(BaseModel):
    """
    Auto-generated base model for database entities.
    This model provides common fields and functionality for all database models.
    """
    # Common fields for all database models
    id: Optional[str] = Field(default=None, description="The unique identifier for the document")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        description="Timestamp when the document was created"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        description="Timestamp when the document was last updated"
    )
    version: int = Field(default=1, description="Document version for optimistic locking")

    # Class variables for collection configuration
    collection_name: ClassVar[str] = ""
    indexes: ClassVar[list] = []

    def model_dump(self, **kwargs) -> dict:
        """
        Override model_dump to handle MongoDB-specific serialization.
        """
        data = super().model_dump(**kwargs)
        return data

    def to_db(self) -> dict:
        """
        Convert model instance to a dict suitable for both Firestore and MongoDB.
        Removes 'id' field for insert operations (let DB handle it).
        """
        data = self.model_dump(exclude_none=True)
        data.pop("id", None)
        return data

    @classmethod
    def from_db(cls, data: dict):
        """
        Create a model instance from a DB document (Firestore or MongoDB).
        Handles both 'id' and '_id' fields.
        """
        if not data:
            return None
        if "_id" in data and "id" not in data:
            data["id"] = str(data["_id"])
        return cls(**data)

    @classmethod
    def from_firestore(cls, data: dict) -> "BaseDBModel":
        """
        Create a model instance from Firestore document.
        """
        if not data:
            return None
        return cls(**data)


class UserString(BaseModel):
    user_input: str

