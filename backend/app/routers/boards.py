from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
import logging
import json
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)
# Set log level to INFO to reduce noise
logger.setLevel(logging.INFO)

from ..services.message_service import MessageService
from ..models.board import Board
from ..services.board_service import BoardService
from ..core.auth import get_current_user
from ..models.user import UserBase, AnonymousUser, MicrosoftUser
from ..services.auth_service import AuthService
from ..routers.messages import broadcast_board_update, DateTimeEncoder
from ..main import get_board_service,get_message_service

# Custom JSON encoder to handle datetime objects
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

router = APIRouter(prefix="/boards", tags=["boards"])

@router.post("", response_model=Board)
async def create_board(
    board: Board,
    current_user: UserBase = Depends(get_current_user),
    board_service: BoardService = Depends(get_board_service)
):
    if isinstance(current_user, AnonymousUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anonymous users cannot create boards"
        )
    
    board.facilitator_id = current_user.id
    return await board_service.create_board(board)

@router.get("", response_model=List[Board])
async def get_boards(
    current_user: UserBase = Depends(get_current_user),
    board_service: BoardService = Depends(get_board_service)
):
    if isinstance(current_user, AnonymousUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anonymous users cannot list boards"
        )
    
    # For Microsoft AD users, get boards by block
    if isinstance(current_user, MicrosoftUser):
        groups_list = current_user.groups
        groups_list.append(current_user.id)
        return await board_service.get_boards_by_block(groups_list)
    
    # For Google users, get boards by facilitator
    return await board_service.get_boards_by_block([current_user.id])

@router.get("/{board_id}", response_model=Board)
async def get_board(
    board_id: str,
    board_service: BoardService = Depends(get_board_service),
    current_user: UserBase = Depends(get_current_user),
):
    board = await board_service.get_board(board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    return board

@router.patch("/{board_id}", response_model=Board)
async def update_board(
    board_id: str,
    board_update: Board,
    current_user: UserBase = Depends(get_current_user),
    board_service: BoardService = Depends(get_board_service)
):
    board = await board_service.get_board(board_id)
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
    
    if board.facilitator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this board")
    

    updated_board = await board_service.update_board(board_id, board_update)
    
    
    await broadcast_board_update(board_id, "board_updated", updated_board.model_dump())
    return updated_board

@router.delete("/{board_id}")
async def delete_board(
    board_id: str,
    current_user: UserBase = Depends(get_current_user),
    board_service: BoardService = Depends(get_board_service),
    message_service: MessageService = Depends(get_message_service),
):
    board = await board_service.get_board(board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    if board.facilitator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the facilitator can delete the board"
        )
    
    # Delete all messages associated with the board
    await message_service.delete_messages_by_board(board_id)
    
    # Delete the board
    success = await board_service.delete_board(board_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete board"
        )
    
    # Broadcast board deletion to WebSocket connections
    await broadcast_board_update(board_id, "board_deleted", {"id": board_id})
    
    return {"message": "Board deleted successfully"} 