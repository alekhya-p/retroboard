from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from .base import BaseDBModel

class MessageText(BaseModel):
    text: str
    column_id: str

class Message(BaseDBModel):
    retro_id: str = Field(..., index=True)
    column_id: str
    text: str
    user_id: Optional[str] = None
    user_display_name: Optional[str] = None
    likes: List[str] = []
    is_anonymous: bool = False

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "retro_id": "board_123",
                "column_id": "col_001",
                "text": "Daily standups were effective",
                "user_id": "google_111",
                "user_display_name": "Bob",
                "likes": ["msal_567", "google_222"]
            }
        }
    )
        
    indexes = [
        {
            "fields": ["retro_id"],
            "name": "retro_id_idx"
        }
    ]