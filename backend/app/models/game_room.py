from typing import Optional
from pydantic import Field, ConfigDict
from .base import BaseDBModel


class GameRoom(BaseDBModel):
    """A standalone room for the team-games hub (/play).

    Game rooms are intentionally distinct from retrospective Boards: they hold
    no columns, no messages, and no AI summary. Keeping them in their own
    collection prevents game rooms from leaking into the My Retro Boards list
    and lets each surface evolve independently.
    """

    name: str
    description: Optional[str] = None
    facilitator_id: Optional[str] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Friday Fun Hour",
                "facilitator_id": "google_123",
            }
        }
    )

    collection_name = "game_rooms"
