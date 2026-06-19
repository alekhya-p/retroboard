from typing import List, Optional
from ..models.board import Board

class BoardService:
    def __init__(self,db):
        self.db = db

    async def create_board(self, board: Board) -> Board:
        board_data = board.to_db()
        doc_id = await self.db.add_document("boards", board_data)
        created_board = await self.db.get_document("boards", doc_id)
        if not created_board:
            raise Exception("Failed to create board")
        return Board.from_db(created_board)

    async def get_board(self, board_id: str) -> Optional[Board]:
        board = await self.db.get_document("boards", board_id)
        return Board.from_db(board) if board else None

    async def get_boards_by_block(self, blocks: List[str]) -> List[Board]:
        boards = await self.db.get_documents("boards", {"block_id": {"$in": blocks}})
        return [Board.from_db(board) for board in boards]

    async def update_board(self, board_id: str, board_update: Board) -> Optional[Board]:
        update_data = board_update.to_db()
        await self.db.update_document("boards", board_id, update_data)
        updated_board = await self.db.get_document("boards", board_id)
        return Board.from_db(updated_board) if updated_board else None

    async def delete_board(self, board_id: str) -> bool:
        await self.db.delete_document("boards", board_id)
        return True

    async def update_board_summary(self, board_id: str, summary: str) -> Optional[Board]:
        await self.db.update_document("boards", board_id, {"summary": summary})
        updated_board = await self.db.get_document("boards", board_id)
        return Board.from_db(updated_board) if updated_board else None