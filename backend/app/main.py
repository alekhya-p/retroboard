from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from .core.config import get_settings
from .services.auth_service import AuthService
from .services.board_service import BoardService
from .services.message_service import MessageService
from .services.ai_service import AIService, warmup as warmup_ai
from .services.game_room_service import GameRoomService
from .services.user_service import UserService
from .services.game_history_service import GameHistoryService
from fastapi.requests import Request
from fastapi import status
from fastapi.exception_handlers import http_exception_handler
from fastapi.exceptions import HTTPException
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
# Disable firestore debug logs
logging.getLogger("google.cloud.firestore").setLevel(logging.WARNING)

settings = get_settings()

from .db.firestore import firestore_db
from .db.mongo import mongodb

if settings.CUSTOM_CONFIGURE_DEPLOYMENT:
    db_instance = mongodb
else:
    db_instance = firestore_db

board_service = BoardService(db_instance)
message_service = MessageService(db_instance)
ai_service = AIService()
game_room_service = GameRoomService(db_instance)
user_service = UserService(db_instance)
game_history_service = GameHistoryService(db_instance)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_instance.connect()
    try:
        warmup_ai()
    except Exception as exc:
        logging.getLogger(__name__).warning("Vertex AI warmup failed: %s", exc)
    yield
    await db_instance.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="RetroBoard API - A collaborative retrospective board application",
    version="1.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency injection
def get_auth_service():
    return AuthService()

def get_board_service():
    return board_service

def get_message_service():
    return message_service

def get_ai_service():
    return ai_service

def get_game_room_service():
    return game_room_service

def get_user_service():
    return user_service

def get_game_history_service():
    return game_history_service

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/info")
async def info_check():
    return {"version":settings.VERSION}

# Import and include routers
from .routers import auth, boards, messages, ai, game_rooms

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(boards.router, prefix=settings.API_V1_STR)
app.include_router(messages.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(game_rooms.router, prefix=settings.API_V1_STR)