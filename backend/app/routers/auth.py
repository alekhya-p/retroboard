from fastapi import APIRouter, Depends, HTTPException, status, Request
import uuid

from ..core.auth import get_current_user
from ..models.user import (
    AnonymousAuthRequest, UserBase, MicrosoftUser, AnonymousUser, UserType,
    EmailUser, EmailSignupRequest, EmailLoginRequest, ForgotPasswordRequest, ResetPasswordRequest,
)
from ..services.auth_service import AuthService
from ..services.user_service import UserService
from ..services import email_service
from ..main import get_user_service
from ..core.config import get_settings

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


@router.post("/microsoft", response_model=dict)
async def microsoft_auth(code: str):
    """Handle Microsoft authentication."""
    user = await AuthService.verify_microsoft_token(code)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Microsoft token"
        )
    
    # Create access token
    access_token = AuthService.create_access_token(user.model_dump())
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/google", response_model=dict)
async def google_auth(code: str, request: Request):
    """Handle Google authentication."""
    origin = request.headers.get("Origin")
    user = await AuthService.verify_google_token(code, origin)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    
    # Create access token
    access_token = AuthService.create_access_token(user.model_dump())
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=dict)
async def get_me(current_user: UserBase = Depends(get_current_user),):
    return current_user.model_dump()


@router.post("/anonymous", response_model=dict)
async def anonymous_auth(user: AnonymousAuthRequest):
    """Handle anonymous authentication."""

    # Each anonymous guest is a brand-new, isolated identity.
    # NEVER derive the id from the display name: two different people who
    # pick the same name (e.g. "navin") must not share an account or be
    # able to see each other's boards and messages. A fresh random id per
    # login also makes guest sessions ephemeral - coming back / a new
    # person with the same name starts from scratch.
    user = AnonymousUser(
        id=f"anon_{uuid.uuid4().hex}",
        display_name=user.display_name,
    )
    
    # Create access token
    access_token = AuthService.create_access_token(user.model_dump())
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/signup", response_model=dict)
async def signup(
    payload: EmailSignupRequest,
    user_service: UserService = Depends(get_user_service),
):
    """Create an account with name + email + password."""
    created = await user_service.create_user(
        display_name=payload.display_name,
        email=payload.email,
        password=payload.password,
    )
    if not created:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )

    user = EmailUser(
        id=created["id"],
        display_name=created["display_name"],
        email=created["email"],
    )
    access_token = AuthService.create_access_token(user.model_dump())
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=dict)
async def login(
    payload: EmailLoginRequest,
    user_service: UserService = Depends(get_user_service),
):
    """Sign in with email + password."""
    found = await user_service.authenticate(payload.email, payload.password)
    if not found:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user = EmailUser(
        id=found["id"],
        display_name=found["display_name"],
        email=found["email"],
    )
    access_token = AuthService.create_access_token(user.model_dump())
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/forgot-password", response_model=dict)
async def forgot_password(
    payload: ForgotPasswordRequest,
    user_service: UserService = Depends(get_user_service),
):
    """Email a password-reset link if an account exists for this email."""
    found = await user_service.get_by_email(payload.email)
    if found:
        token = AuthService.create_reset_token(found["id"])
        reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?token={token}"
        await email_service.send_password_reset_email(
            to_email=found["email"],
            reset_url=reset_url,
            display_name=found.get("display_name", ""),
        )

    # Always return the same response so attackers can't probe which emails exist.
    return {"message": "If an account exists for that email, we've sent a password reset link."}


@router.post("/reset-password", response_model=dict)
async def reset_password(
    payload: ResetPasswordRequest,
    user_service: UserService = Depends(get_user_service),
):
    """Set a new password using a valid reset token, then sign the user in."""
    user_id = AuthService.verify_reset_token(payload.token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link is invalid or has expired. Please request a new one.",
        )

    found = await user_service.get_by_id(user_id)
    if not found:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link is invalid or has expired. Please request a new one.",
        )

    await user_service.update_password(user_id, payload.password)

    user = EmailUser(
        id=found["id"],
        display_name=found["display_name"],
        email=found["email"],
    )
    access_token = AuthService.create_access_token(user.model_dump())
    return {"access_token": access_token, "token_type": "bearer", "user": user}