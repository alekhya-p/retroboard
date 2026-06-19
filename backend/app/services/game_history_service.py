from typing import List, Optional, Dict, Any


class GameHistoryService:
    """Per-user memory of recently-used game content (trivia questions, doodle
    words, ...), so logged-in players don't get the same items across sessions.

    Kept deliberately small (CAP items per kind ≈ the last few games) so the
    text we feed back into the AI prompt stays short. Anonymous guests have
    ephemeral ids, so we only persist for real accounts.
    """

    COLLECTION = "game_history"
    CAP = 60

    def __init__(self, db):
        self.db = db

    async def _get_doc(self, user_id: str) -> Optional[Dict[str, Any]]:
        if not user_id:
            return None
        docs = await self.db.get_documents(self.COLLECTION, {"user_id": user_id})
        return docs[0] if docs else None

    async def get_used(self, user_id: str, kind: str) -> List[str]:
        doc = await self._get_doc(user_id)
        if not doc:
            return []
        items = doc.get(kind, [])
        return [str(i) for i in items if str(i).strip()] if isinstance(items, list) else []

    async def add_used(self, user_id: str, kind: str, items: List[str]) -> None:
        if not user_id:
            return
        clean = [str(i).strip() for i in (items or []) if str(i).strip()]
        if not clean:
            return
        doc = await self._get_doc(user_id)
        if doc:
            existing = doc.get(kind, [])
            existing = existing if isinstance(existing, list) else []
            merged = (existing + clean)[-self.CAP:]
            await self.db.update_document(self.COLLECTION, doc["id"], {kind: merged})
        else:
            await self.db.add_document(self.COLLECTION, {"user_id": user_id, kind: clean[-self.CAP:]})
