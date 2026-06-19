from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from .base import BaseDBModel
from uuid import uuid4

class Column(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    color: Optional[str] = None
    description: Optional[str] = None
    is_action_column: bool = False

class BoardConfigurations(BaseModel):
    show_all_messages: bool = False
    enable_likes: bool = False
    max_votes_per_user: int = 5

class Board(BaseDBModel):
    name: str
    description: Optional[str] = None
    facilitator_id: Optional[str] = None
    block_id: str = Field(..., index=True)
    columns: List[Column]
    configurations: BoardConfigurations = BoardConfigurations()
    openai_key: Optional[str] = None
    openai_endpoint: str = "https://api.openai.com/v1"
    summary: Optional[str] = None
    end_time: Optional[str] = None
    timer_ends_at: Optional[str] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Sprint 15 Retro",
                "facilitator_id": "msal_567",
                "block_id": "ad_group_789",
                "columns": [
                    {
                        "name": "Went Well",
                        "color": "#4CAF50",
                        "description": "Positive feedback"
                    },
                    {
                        "name": "Action Items",
                        "color": "#F44336",
                        "description": "Actions for future"
                    }
                ],
                "configurations": {
                    "show_all_messages": False,
                    "enable_likes": True
                }
            }
        }
    )
        
    indexes = [
        {
            "fields": ["block_id"],
            "name": "block_id_idx"
        }
    ] 