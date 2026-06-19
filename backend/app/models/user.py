from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

class UserType(str, Enum):
    MICROSOFT = "microsoft"
    GOOGLE = "google"
    ANONYMOUS = "anonymous"
    EMAIL = "email"

class UserBase(BaseModel):
    id: str
    display_name: str
    email: Optional[EmailStr] = None
    user_type: UserType
    is_active: bool = True

class MicrosoftUser(UserBase):
    user_type: UserType = UserType.MICROSOFT
    groups: List[str] = []

class GoogleUser(UserBase):
    user_type: UserType = UserType.GOOGLE
    groups: List[str] = ['Self']

class AnonymousUser(UserBase):
    user_type: UserType = UserType.ANONYMOUS

class EmailUser(UserBase):
    """A user who signed up with name + email + password."""
    user_type: UserType = UserType.EMAIL
    groups: List[str] = ['Self']

class AnonymousAuthRequest(BaseModel):
    display_name: str

class EmailSignupRequest(BaseModel):
    display_name: str = Field(..., min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=200)

class EmailLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=200)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(..., min_length=8, max_length=200)
