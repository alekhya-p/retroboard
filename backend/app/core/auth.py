from typing import Optional
from fastapi import Request, HTTPException, status
from ..services.auth_service import AuthService
from ..models.user import MicrosoftUser, GoogleUser, AnonymousUser, EmailUser, UserBase, UserType

async def get_current_user(request: Request) -> UserBase:
    """
    Centralized authentication function to extract and validate user from request headers.
    Returns a properly typed UserBase object.
    """
    # Get the authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    # Extract the token
    token = auth_header.split(" ")[1]
    
    # Verify the token and get claims
    claims = AuthService.verify_access_token(token)
    if not claims:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    # Convert claims to appropriate UserBase type based on user_type
    user_type = claims.get("user_type")
    if user_type == UserType.MICROSOFT:
        return MicrosoftUser(
            id=claims.get("id"),  # Changed from id to sub to match JWT standard
            display_name=claims.get("display_name"),
            email=claims.get("email"),
            groups=claims.get("groups", [])
        )
    elif user_type == UserType.GOOGLE:
        return GoogleUser(
            id=claims.get("id"),  # Changed from id to sub to match JWT standard
            display_name=claims.get("display_name"),
            email=claims.get("email")
        )
    elif user_type == UserType.ANONYMOUS:
        return AnonymousUser(
            id=claims.get("id"),  # Changed from id to sub to match JWT standard
            display_name=claims.get("display_name")
        )
    elif user_type == UserType.EMAIL:
        return EmailUser(
            id=claims.get("id"),
            display_name=claims.get("display_name"),
            email=claims.get("email"),
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user type"
        ) 