"""Pin the Pydantic model contracts that the routers rely on."""

from app.models.board import Board, Column
from app.models.game_room import GameRoom


def test_board_constructs_with_minimum_fields():
    board = Board(
        name="Sprint 42 Retro",
        block_id="block-1",
        columns=[Column(name="Went Well", color="#22c55e", description="positives")],
    )
    assert board.name == "Sprint 42 Retro"
    assert len(board.columns) == 1


def test_board_to_db_strips_id():
    board = Board(
        name="x",
        block_id="b",
        columns=[Column(name="c", color="#000000", description="d")],
    )
    data = board.to_db()
    assert "id" not in data, "to_db must not leak the document id"


def test_game_room_is_lightweight():
    """Game rooms intentionally don't have columns / block_id / configurations."""
    room = GameRoom(name="Friday Fun Hour", facilitator_id="user-1")
    assert room.name == "Friday Fun Hour"
    # The whole reason for the split: no retro-board fields on a game room.
    for retro_field in ("columns", "block_id", "configurations", "summary"):
        assert not hasattr(room, retro_field) or getattr(room, retro_field, None) in (None, [], {}), (
            f"GameRoom should not carry retro-board field `{retro_field}`"
        )


def test_game_room_uses_separate_collection():
    """The collection name is what prevents game rooms from leaking into /boards."""
    assert GameRoom.collection_name == "game_rooms"
    assert GameRoom.collection_name != getattr(Board, "collection_name", "boards")


def test_game_room_db_roundtrip():
    room = GameRoom(name="Quick Game", facilitator_id="user-1")
    data = room.to_db()
    assert "id" not in data
    rehydrated = GameRoom.from_db({**data, "id": "abc123"})
    assert rehydrated is not None
    assert rehydrated.id == "abc123"
    assert rehydrated.name == "Quick Game"
