from typing import Optional, Dict, Any

import bcrypt

from ..models.user import UserType


def _hash_password(password: str) -> str:
    # bcrypt only uses the first 72 bytes; truncate explicitly so newer bcrypt
    # versions don't raise on longer inputs. (Using the bcrypt lib directly
    # avoids passlib/bcrypt version-compat issues.)
    pw = password.encode("utf-8")[:72]
    return bcrypt.hashpw(pw, bcrypt.gensalt()).decode("utf-8")


def _verify_password(password: str, password_hash: str) -> bool:
    if not password_hash:
        return False
    try:
        return bcrypt.checkpw(password.encode("utf-8")[:72], password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False


class UserService:
    """Persistence + auth for email/password (sign up) users."""

    COLLECTION = "users"

    def __init__(self, db):
        self.db = db

    @staticmethod
    def _normalize_email(email: str) -> str:
        return (email or "").strip().lower()

    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        docs = await self.db.get_documents(self.COLLECTION, {"email": self._normalize_email(email)})
        return docs[0] if docs else None

    async def get_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        return await self.db.get_document(self.COLLECTION, user_id)

    async def update_password(self, user_id: str, new_password: str) -> None:
        await self.db.update_document(self.COLLECTION, user_id, {"password_hash": _hash_password(new_password)})

    async def create_user(self, display_name: str, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Create a new email/password user. Returns None if the email is taken."""
        email = self._normalize_email(email)
        if await self.get_by_email(email):
            return None

        data = {
            "display_name": display_name.strip(),
            "email": email,
            "password_hash": _hash_password(password),
            "user_type": UserType.EMAIL.value,
            "is_active": True,
        }
        doc_id = await self.db.add_document(self.COLLECTION, data)
        return {"id": doc_id, **data}

    async def authenticate(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Return the stored user dict if the email + password match, else None."""
        user = await self.get_by_email(email)
        if not user:
            return None
        if not _verify_password(password, user.get("password_hash", "")):
            return None
        return user
