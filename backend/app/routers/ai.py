from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from ..models.base import UserString
from ..models.user import UserBase, UserType
from ..services.ai_service import AIService
from ..services.board_service import BoardService
from ..services.message_service import MessageService
from ..services.game_history_service import GameHistoryService
from ..core.config import get_settings
from ..core.auth import get_current_user
from ..routers.messages import broadcast_board_update
from ..main import (
    get_board_service, get_message_service, get_ai_service, get_game_history_service,
)


class DrawingPromptRequest(BaseModel):
    theme: Optional[str] = "general"
    difficulty: Optional[str] = "easy"
    avoid: Optional[List[str]] = None


class DrawingHintRequest(BaseModel):
    word: str
    previous_hints: Optional[List[str]] = None


class TriviaRequest(BaseModel):
    category: Optional[str] = "general"
    avoid: Optional[List[str]] = None


class EmojiEntry(BaseModel):
    author: str
    story: str


class EmojiJudgeRequest(BaseModel):
    prompt: str
    entries: List[EmojiEntry]


class LieInspirationRequest(BaseModel):
    topic: Optional[str] = "general"
    avoid: Optional[List[str]] = None


class RouletteQuestionsRequest(BaseModel):
    num_pairs: int
    context: Optional[str] = "general"
    round_label: Optional[str] = "Round 1"
    avoid: Optional[List[str]] = None


class IcebreakerRequest(BaseModel):
    avoid: Optional[List[str]] = None


class TriviaBatchRequest(BaseModel):
    category: Optional[str] = "general"
    count: Optional[int] = 10
    avoid: Optional[List[str]] = None


class DrawingBatchRequest(BaseModel):
    theme: Optional[str] = "general"
    difficulty: Optional[str] = "easy"
    count: Optional[int] = 10
    avoid: Optional[List[str]] = None


# Cap how much history we feed back into a prompt, so it stays small/cheap.
_HISTORY_PROMPT_LIMIT = 50


def _is_account(user: UserBase) -> bool:
    """Only real accounts get cross-session history (anonymous ids are ephemeral)."""
    return getattr(user, "user_type", None) != UserType.ANONYMOUS

router = APIRouter(prefix="/ai", tags=["ai"])
settings = get_settings()

@router.post("/boards/{board_id}/summary")
async def generate_board_summary(
    board_id: str,
    current_user: UserBase = Depends(get_current_user),
    board_service: BoardService = Depends(get_board_service),
    message_service: MessageService = Depends(get_message_service),
    ai_service: AIService = Depends(get_ai_service)
):
    # Get board and verify access
    board = await board_service.get_board(board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    # Only facilitator can generate summary
    if board.facilitator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the facilitator can generate board summary"
        )
    
    # Get all messages for the board
    messages = await message_service.get_messages_by_board(board_id)
    
    # Generate summary
    summary = await ai_service.generate_board_summary(messages, board)
    if not summary:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate summary"
        )
    
    # Update board with summary
    updated_board = await board_service.update_board_summary(board_id, summary)
    if not updated_board:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update board with summary"
        )
    
    # Broadcast the board update to all WebSocket connections
    board_dict = updated_board.model_dump()
    board_dict["id"] = str(updated_board.id)
    await broadcast_board_update(board_id, "board_updated", board_dict)
    
    return {"summary": summary}

@router.post("/boards/{board_id}/action-items")
async def generate_action_items(
    board_id: str,
    current_user: UserBase = Depends(get_current_user),
    board_service: BoardService = Depends(get_board_service),
    message_service: MessageService = Depends(get_message_service),
    ai_service: AIService = Depends(get_ai_service)
):
    # Get board and verify access
    board = await board_service.get_board(board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    # Only facilitator can generate action items
    if board.facilitator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the facilitator can generate action items"
        )
    
    # Get all messages for the board
    messages = await message_service.get_messages_by_board(board_id)
    
    # Generate action items
    action_items = await ai_service.generate_action_items(messages)
    if not action_items:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate action items"
        )
    
    return {"action_items": action_items}

@router.post("/generate-retro-idea")
async def generate_retro_idea(
    input_request: UserString,
    current_user: UserBase = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Generate a creative retrospective idea based on user input.
    The idea will match the specified JSON schema with name, description, and columns.
    """
    retro_idea = await ai_service.generate_retro_idea(input_request.user_input)
    if not retro_idea:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate retro idea"
        )
    
    return retro_idea

@router.post("/boards/{board_id}/icebreaker")
async def generate_icebreaker(
    board_id: str,
    request: Optional[IcebreakerRequest] = None,
    current_user: UserBase = Depends(get_current_user),
    board_service: BoardService = Depends(get_board_service),
    ai_service: AIService = Depends(get_ai_service)
):
    board = await board_service.get_board(board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )

    context = f"Board Name: {board.name}, Description: {board.description}"
    avoid = request.avoid if request else None
    icebreaker = await ai_service.generate_icebreaker(context, avoid=avoid or [])

    return {"icebreaker": icebreaker}


@router.post("/games/drawing-prompt")
async def games_drawing_prompt(
    request: DrawingPromptRequest,
    current_user: UserBase = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service),
):
    """Doodle Quest: get a fresh AI-picked word to draw."""
    word = await ai_service.generate_drawing_prompt(
        theme=request.theme or "general",
        difficulty=request.difficulty or "easy",
        avoid=request.avoid or [],
    )
    if not word:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate prompt")
    return {"word": word}


@router.post("/games/trivia-batch")
async def games_trivia_batch(
    request: TriviaBatchRequest,
    current_user: UserBase = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service),
    history: GameHistoryService = Depends(get_game_history_service),
):
    """Trivia Race: fetch a batch of distinct questions at once (served one per
    round by the client). Uses the player's recent history to avoid repeats."""
    category = request.category or "general"
    used = await history.get_used(current_user.id, "trivia") if _is_account(current_user) else []
    avoid = (used + (request.avoid or []))[-_HISTORY_PROMPT_LIMIT:]
    questions = await ai_service.generate_trivia_batch(
        category=category, count=request.count or 10, avoid=avoid,
    )
    if _is_account(current_user):
        await history.add_used(
            current_user.id, "trivia",
            [q.get("question", "") for q in questions if isinstance(q, dict)],
        )
    return {"questions": questions}


@router.post("/games/drawing-prompts")
async def games_drawing_prompts(
    request: DrawingBatchRequest,
    current_user: UserBase = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service),
    history: GameHistoryService = Depends(get_game_history_service),
):
    """Doodle Quest: fetch a batch of distinct words at once, avoiding the
    player's recent history."""
    used = await history.get_used(current_user.id, "doodle") if _is_account(current_user) else []
    avoid = (used + (request.avoid or []))[-_HISTORY_PROMPT_LIMIT:]
    words = await ai_service.generate_drawing_prompts_batch(
        theme=request.theme or "general",
        difficulty=request.difficulty or "easy",
        count=request.count or 10,
        avoid=avoid,
    )
    if _is_account(current_user):
        await history.add_used(current_user.id, "doodle", words)
    return {"words": words}


@router.post("/games/drawing-hint")
async def games_drawing_hint(
    request: DrawingHintRequest,
    current_user: UserBase = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service),
):
    """Doodle Quest: ask the AI for a hint that doesn't spoil the word."""
    if not request.word:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="word is required")
    hint = await ai_service.generate_drawing_hint(request.word, request.previous_hints or [])
    return {"hint": hint}


@router.post("/games/trivia")
async def games_trivia(
    request: TriviaRequest,
    current_user: UserBase = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service),
):
    """Trivia Race: get a fresh multiple-choice question."""
    question = await ai_service.generate_trivia_question(
        category=request.category or "general",
        avoid=request.avoid or [],
    )
    if not question:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate trivia")
    return question


@router.post("/games/judge-emoji")
async def games_judge_emoji(
    request: EmojiJudgeRequest,
    current_user: UserBase = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service),
):
    """Emoji Tales: AI picks the most creative entry."""
    if not request.entries:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="entries cannot be empty")
    result = await ai_service.judge_emoji_story(
        request.prompt,
        [e.model_dump() for e in request.entries],
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to judge entries")
    return result


@router.post("/games/lie-inspiration")
async def games_lie_inspiration(
    request: LieInspirationRequest,
    current_user: UserBase = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service),
):
    """Two Truths and a Lie: AI suggests plausible 'lie' statements when a player is stuck."""
    lies = await ai_service.generate_lie_inspiration(
        topic=request.topic or "general",
        avoid=request.avoid or [],
    )
    return {"lies": lies}


@router.post("/games/roulette-questions")
async def games_roulette_questions(
    request: RouletteQuestionsRequest,
    current_user: UserBase = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service),
):
    """Meeting Roulette: AI generates one icebreaker per random pair for this round."""
    if request.num_pairs < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="num_pairs must be >= 1")
    questions = await ai_service.generate_meeting_roulette_questions(
        num_pairs=request.num_pairs,
        context=request.context or "general",
        round_label=request.round_label or "Round 1",
        avoid=request.avoid or [],
    )
    return {"questions": questions}
