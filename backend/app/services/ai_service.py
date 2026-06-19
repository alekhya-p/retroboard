from typing import Any, List, Optional
import logging

from ..models.board import Board
from ..core.config import get_settings
from ..models.message import Message
from .llm import LLMProvider, get_provider

settings = get_settings()
logger = logging.getLogger(__name__)

# Kept for backwards-compatibility / observability. The active model is decided
# by the selected provider (see app/services/llm/). For the default Vertex
# provider this mirrors settings.VERTEX_MODEL.
MODEL_NAME = getattr(settings, "VERTEX_MODEL", None) or "gemini-2.5-flash"


def _avoid_block(items: Optional[List[str]], label: str = "items", limit: int = 40) -> str:
    """Build a prompt fragment telling the model not to reuse already-seen content.

    Games call the generators repeatedly within one session; without this the
    model has no memory and keeps returning the same words/questions. The client
    passes the items it has already shown and we ask the model to avoid them.
    """
    if not items:
        return ""
    cleaned = [str(i).strip() for i in items if str(i).strip()]
    if not cleaned:
        return ""
    recent = cleaned[-limit:]
    joined = "\n".join(f"- {i}" for i in recent)
    return (
        f"\n\nIMPORTANT: do NOT repeat, reuse, or closely paraphrase any of these "
        f"already-used {label} from earlier this session:\n{joined}\n"
        f"Pick something clearly different."
    )


def warmup() -> None:
    """Eagerly initialise the active LLM provider (called from app startup)."""
    try:
        get_provider().warmup()
    except Exception as exc:  # pragma: no cover - best-effort warm up
        logger.warning("LLM provider warmup failed: %s", exc)


# ---- JSON schemas for structured output --------------------------------------
# Vertex / Gemini accepts the OpenAPI 3 subset (uppercase types). Passing
# these via response_schema constrains the model to emit strict JSON, so
# downstream code can json.loads without ```json fence stripping or
# try/except fallback parsing.

_ACTION_ITEMS_SCHEMA = {
    "type": "ARRAY",
    "items": {"type": "STRING"},
}

_STRING_LIST_SCHEMA = {
    "type": "ARRAY",
    "items": {"type": "STRING"},
}

_RETRO_IDEA_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "name": {"type": "STRING"},
        "shortDescription": {"type": "STRING"},
        "description": {"type": "STRING"},
        "columns": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "name": {"type": "STRING"},
                    "color": {"type": "STRING"},
                    "description": {"type": "STRING"},
                    "is_action_column": {"type": "BOOLEAN"},
                },
                "required": ["name", "color", "description", "is_action_column"],
            },
        },
    },
    "required": ["name", "shortDescription", "description", "columns"],
}

_TRIVIA_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "question": {"type": "STRING"},
        "options": {
            "type": "ARRAY",
            "items": {"type": "STRING"},
        },
        "correct_index": {"type": "INTEGER"},
        "explanation": {"type": "STRING"},
    },
    "required": ["question", "options", "correct_index", "explanation"],
}

_TRIVIA_LIST_SCHEMA = {
    "type": "ARRAY",
    "items": _TRIVIA_SCHEMA,
}

_EMOJI_JUDGEMENT_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "winner_index": {"type": "INTEGER"},
        "reason": {"type": "STRING"},
    },
    "required": ["winner_index", "reason"],
}


class AIService:
    def __init__(self, provider: Optional[LLMProvider] = None):
        # The provider is swappable (Vertex / OpenAI / Anthropic) and chosen by
        # settings.AI_PROVIDER. Inject one in tests to avoid real API calls.
        self.provider = provider or get_provider()

    async def call_llm(
        self,
        prompt: str,
        *,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
        max_output_tokens: int = 2048,
        response_schema: Optional[dict] = None,
    ) -> Optional[Any]:
        """Generate a completion via the active LLM provider.

        ``system_instruction`` is sent natively (not glued onto the prompt).
        When ``response_schema`` is provided the model is constrained to emit
        strict JSON matching the schema and the parsed Python object is
        returned; otherwise the raw text is returned. ``None`` on failure.
        """
        return await self.provider.call_llm(
            prompt,
            system_instruction=system_instruction,
            temperature=temperature,
            max_output_tokens=max_output_tokens,
            response_schema=response_schema,
        )

    async def generate_board_summary(
        self, messages: List[Message], board: Board
    ) -> Optional[str]:
        messages_by_column: dict[str, list[Message]] = {}
        for message in messages:
            messages_by_column.setdefault(message.column_id, []).append(message)

        # Build the raw retro data (notes grouped by column) for the model.
        retro_data = (
            f"Retrospective: '{board.name}'"
            + (f" - {board.description}" if board.description else "")
            + "\n"
        )
        for column_id, column_messages in messages_by_column.items():
            column = next((col for col in board.columns if col.id == column_id), None)
            if column:
                retro_data += f"\nColumn: {column.name}\n"
            for msg in column_messages:
                retro_data += f"- {msg.text} (by {msg.user_display_name})\n"

        prompt = (
            "Summarize the sprint retrospective below into a clear report using "
            "EXACTLY the following sections, in this order. Use each heading "
            "verbatim (including the emoji). Omit a section entirely if there is "
            "nothing relevant to say - never pad it. Keep every bullet to a single "
            "concise line, written in plain, specific language about what the team "
            "actually raised. Do not invent anything.\n\n"
            "## 📊 Overall sentiment\n"
            "One or two sentences on the team's mood and how the sprint went.\n\n"
            "## ✅ What went well\n"
            "2-4 bullets of the key positives.\n\n"
            "## ⚠️ What to improve\n"
            "2-4 bullets of the main pain points or risks.\n\n"
            "## 🔁 Key themes\n"
            "1-3 bullets naming patterns that recurred across multiple notes.\n\n"
            "## 🎯 Suggested next steps\n"
            "2-3 concrete, actionable follow-ups the team could take.\n\n"
            "----- RETROSPECTIVE DATA -----\n"
            f"{retro_data}"
        )

        return await self.call_llm(
            prompt,
            system_instruction=(
                "You are a professional agile coach summarizing a team's sprint "
                "retrospective. Respond in GitHub-flavored markdown ONLY - no "
                "preamble, no closing remarks, no code fences. Use '## ' for "
                "section headings and '- ' for bullets. Use **bold** sparingly to "
                "highlight a key term. Keep it tight and scannable."
            ),
            temperature=0.3,
        )

    async def generate_action_items(self, messages: List[Message]) -> List[str]:
        prompt = "Extract specific, actionable items from the following retrospective messages:\n\n"
        for msg in messages:
            prompt += f"- {msg.text}\n"

        data = await self.call_llm(
            prompt,
            system_instruction=(
                "You are a professional agile coach helping to extract "
                "action items from retrospectives. Each item must be a single "
                "SMART action - Specific, Measurable, Assignable, Realistic, "
                "Time-bound."
            ),
            temperature=0.3,
            response_schema=_ACTION_ITEMS_SCHEMA,
        )
        if isinstance(data, list):
            return [str(item).strip() for item in data if isinstance(item, str) and item.strip()]
        return []

    async def generate_retro_idea(self, user_input: str) -> Optional[dict]:
        prompt = (
            f"Design a creative retrospective format based on this user input.\n"
            f"User input: {user_input}\n\n"
            f"The format should include 3-5 columns that work well for team "
            f"retrospectives. Emojis are encouraged in template and column names. "
            f"Use hex colours like '#4CAF50'. Mark at most one column as the "
            f"action-items column."
        )
        data = await self.call_llm(
            prompt,
            system_instruction=(
                "You are a creative agile coach who designs engaging "
                "retrospective formats."
            ),
            temperature=0.85,
            response_schema=_RETRO_IDEA_SCHEMA,
        )
        return data if isinstance(data, dict) else None

    async def generate_icebreaker(
        self, board_context: str = "", avoid: Optional[List[str]] = None
    ) -> Optional[str]:
        prompt = (
            f"Generate a single, fun, and quick icebreaker question for an agile "
            f"team retrospective. Make it creative and engaging. Only return the "
            f"question itself, no intro or outro text. Context: {board_context}"
            f"{_avoid_block(avoid, 'icebreaker questions')}"
        )
        text = await self.call_llm(
            prompt,
            system_instruction="You are a fun agile coach.",
            temperature=0.95,
            max_output_tokens=128,
        )
        if text:
            return text.strip(' "')
        return "If your sprint was a movie title, what would it be?"

    async def generate_drawing_prompt(
        self, theme: str = "general", difficulty: str = "easy",
        avoid: Optional[List[str]] = None,
    ) -> Optional[str]:
        """Generate a single short word or phrase for the Doodle Quest game."""
        prompt = (
            f"Pick ONE fun, drawable word or short phrase (1-3 words) for a "
            f"Pictionary-style game. Theme: {theme}. Difficulty: {difficulty}. "
            f"The word must be a concrete noun, action, or well-known concept that "
            f"is easy to sketch. Avoid anything offensive, political, or NSFW. "
            f"Return ONLY the word or phrase, no quotes, no explanation, no markdown."
            f"{_avoid_block(avoid, 'words')}"
        )
        text = await self.call_llm(
            prompt,
            system_instruction="You generate Pictionary words for distributed agile teams.",
            temperature=1.0,
            max_output_tokens=32,
        )
        if text:
            cleaned = text.strip().strip('"\'`*.').splitlines()[0].strip()
            if cleaned:
                return cleaned
        return "pizza"

    async def generate_drawing_hint(
        self, word: str, previous_hints: Optional[List[str]] = None
    ) -> Optional[str]:
        """Give a single helpful hint that does NOT include the word itself."""
        previous_hints = previous_hints or []
        prev = "\n".join(f"- {h}" for h in previous_hints) or "(none yet)"
        prompt = (
            f"In a Pictionary-style team game, players are guessing this hidden "
            f"word: '{word}'.\n"
            f"Give ONE short hint (under 12 words) that helps guessers without "
            f"revealing the word. Do NOT include the word itself or any obvious "
            f"form of it.\n"
            f"Previous hints already shown:\n{prev}\n"
            f"Return only the hint text."
        )
        text = await self.call_llm(
            prompt,
            system_instruction="You give clever Pictionary hints that nudge but never spoil.",
            temperature=0.7,
            max_output_tokens=64,
        )
        if text:
            hint = text.strip().strip('"\'`*').splitlines()[0].strip()
            if word.lower() in hint.lower():
                return "Think about everyday life - you've seen this often."
            return hint
        return "Picture something you'd find in your kitchen or office."

    async def generate_trivia_question(
        self, category: str = "general", avoid: Optional[List[str]] = None
    ) -> Optional[dict]:
        """Generate a single multiple-choice trivia question."""
        prompt = (
            f"Generate ONE fun multiple-choice trivia question for a team game. "
            f"Category: {category}. Avoid anything offensive or NSFW. "
            f"Provide exactly 4 options. correct_index is the 0-based index of "
            f"the correct answer in the options array."
            f"{_avoid_block(avoid, 'trivia questions', limit=25)}"
        )
        data = await self.call_llm(
            prompt,
            system_instruction=(
                "You are a trivia question writer for distributed agile teams."
            ),
            temperature=0.95,
            response_schema=_TRIVIA_SCHEMA,
        )
        if (
            isinstance(data, dict)
            and isinstance(data.get("question"), str)
            and isinstance(data.get("options"), list)
            and len(data["options"]) == 4
            and isinstance(data.get("correct_index"), int)
            and 0 <= data["correct_index"] < 4
        ):
            return data
        return {
            "question": "What does the 'A' in SCRUM stand for? (Trick question!)",
            "options": ["Agile", "Adaptive", "Nothing - SCRUM isn't an acronym", "Anonymous"],
            "correct_index": 2,
            "explanation": "Scrum isn't an acronym - it's named after the rugby formation.",
        }

    async def generate_trivia_batch(
        self, category: str = "general", count: int = 10,
        avoid: Optional[List[str]] = None,
    ) -> List[dict]:
        """Generate several distinct trivia questions in one call (cheaper + no
        within-session repeats than asking one at a time)."""
        n = max(1, min(int(count), 15))
        prompt = (
            f"Generate EXACTLY {n} fun, DISTINCT multiple-choice trivia questions "
            f"for a team game. Category: {category}. No two questions should cover "
            f"the same fact. Avoid anything offensive or NSFW. Each must have "
            f"exactly 4 options, with correct_index the 0-based index of the "
            f"correct answer."
            f"{_avoid_block(avoid, 'trivia questions', limit=50)}"
        )
        data = await self.call_llm(
            prompt,
            system_instruction="You are a trivia question writer for distributed agile teams.",
            temperature=0.95,
            response_schema=_TRIVIA_LIST_SCHEMA,
        )
        out: List[dict] = []
        if isinstance(data, list):
            for q in data:
                if (
                    isinstance(q, dict)
                    and isinstance(q.get("question"), str)
                    and isinstance(q.get("options"), list)
                    and len(q["options"]) == 4
                    and isinstance(q.get("correct_index"), int)
                    and 0 <= q["correct_index"] < 4
                ):
                    out.append(q)
        if out:
            return out[:n]
        # Fall back to a single generated question so the game can still proceed.
        return [await self.generate_trivia_question(category=category, avoid=avoid)]

    async def generate_drawing_prompts_batch(
        self, theme: str = "general", difficulty: str = "easy", count: int = 10,
        avoid: Optional[List[str]] = None,
    ) -> List[str]:
        """Generate several distinct Pictionary words in one call."""
        n = max(1, min(int(count), 15))
        prompt = (
            f"Pick EXACTLY {n} fun, DISTINCT, drawable words or short phrases (1-3 "
            f"words each) for a Pictionary-style game. Theme: {theme}. Difficulty: "
            f"{difficulty}. Each must be a concrete noun, action, or well-known "
            f"concept that is easy to sketch. No duplicates or close synonyms. "
            f"Avoid anything offensive, political, or NSFW."
            f"{_avoid_block(avoid, 'words', limit=50)}"
        )
        data = await self.call_llm(
            prompt,
            system_instruction="You generate Pictionary words for distributed agile teams.",
            temperature=1.0,
            response_schema=_STRING_LIST_SCHEMA,
        )
        if isinstance(data, list):
            seen = set()
            out = []
            for w in data:
                cleaned = str(w).strip().strip('"\'`*.')
                key = cleaned.lower()
                if cleaned and key not in seen:
                    seen.add(key)
                    out.append(cleaned)
            if out:
                return out[:n]
        return ["pizza", "umbrella", "rocket", "guitar", "lighthouse",
                "cactus", "robot", "snowman", "anchor", "balloon"][:n]

    async def generate_meeting_roulette_questions(
        self,
        num_pairs: int,
        context: str = "general",
        round_label: str = "Round 1",
        avoid: Optional[List[str]] = None,
    ) -> List[str]:
        """Generate one short ice-breaker question per pair for Meeting Roulette."""
        n = max(1, min(int(num_pairs), 20))
        prompt = (
            f"You're hosting a 'Meeting Roulette' round for a remote/hybrid team "
            f"- randomly paired colleagues meet for a few minutes to get to know "
            f"each other. {round_label}.\n"
            f"Context: {context or 'general team mixer'}.\n"
            f"Generate EXACTLY {n} distinct, warm, low-pressure conversation-"
            f"starter questions, one per pair. Each question must:\n"
            f"- be under 18 words\n"
            f"- be open-ended (not yes/no)\n"
            f"- be safe for work, inclusive, and not political/religious/medical\n"
            f"- be inviting for someone who just joined the team"
            f"{_avoid_block(avoid, 'questions')}"
        )
        data = await self.call_llm(
            prompt,
            system_instruction="You write warm icebreakers for new-hire team mixers.",
            temperature=0.9,
            response_schema=_STRING_LIST_SCHEMA,
        )
        fallback = [
            "What's a small thing that made you smile this week?",
            "If you could instantly master one skill, what would it be?",
            "What's a project you're proud of - work or otherwise?",
            "What's your go-to comfort food or comfort show?",
            "Where would you go if you could work from anywhere for a month?",
        ]
        if isinstance(data, list):
            out = [str(q).strip() for q in data if isinstance(q, str) and q.strip()]
            if out:
                while len(out) < n:
                    out.append(fallback[len(out) % len(fallback)])
                return out[:n]
        return [fallback[i % len(fallback)] for i in range(n)]

    async def generate_lie_inspiration(
        self, topic: str = "general", avoid: Optional[List[str]] = None
    ) -> List[str]:
        """Suggest a few plausible-sounding statements a player might use as the 'lie'
        in Two Truths and a Lie. The model is told these are fictional - the player
        still chooses what to actually submit."""
        prompt = (
            f"In a 'Two Truths and a Lie' team game, a player needs inspiration "
            f"for a fake-but-plausible-sounding statement about themselves. "
            f"Topic / context: {topic or 'general life'}.\n"
            f"Return EXACTLY 3 short, first-person statements (under 18 words "
            f"each) that sound believable but are clearly fictional inventions "
            f"for a game. Avoid anything offensive, political, financial, "
            f"medical, or NSFW."
            f"{_avoid_block(avoid, 'statements')}"
        )
        data = await self.call_llm(
            prompt,
            system_instruction=(
                "You write playful, believable fake statements for a party game."
            ),
            temperature=0.95,
            response_schema=_STRING_LIST_SCHEMA,
        )
        if isinstance(data, list):
            out = [str(s).strip() for s in data if isinstance(s, str) and s.strip()]
            if out:
                return out[:3]
        return [
            "I once met a famous actor in an airport lounge.",
            "I can name every country in Africa from memory.",
            "I broke my arm falling out of a tree at age 9.",
        ]

    async def judge_emoji_story(
        self, prompt_text: str, entries: List[dict]
    ) -> Optional[dict]:
        """Pick the most creative emoji-only entry. entries: [{author, story}, ...]."""
        if not entries:
            return None
        entry_lines = "\n".join(
            f"{i + 1}. {e.get('author', 'Player')}: {e.get('story', '')}"
            for i, e in enumerate(entries)
        )
        prompt = (
            f"Players summarised this prompt using ONLY emojis: '{prompt_text}'.\n"
            f"Entries:\n{entry_lines}\n\n"
            f"Pick the single most creative, on-theme entry. winner_index is the "
            f"0-based index of the chosen entry; reason is one short fun sentence."
        )
        data = await self.call_llm(
            prompt,
            system_instruction="You judge emoji storytelling for a team game.",
            temperature=0.4,
            response_schema=_EMOJI_JUDGEMENT_SCHEMA,
        )
        if isinstance(data, dict):
            idx = data.get("winner_index")
            if isinstance(idx, int) and 0 <= idx < len(entries):
                return {
                    "winner_index": idx,
                    "winner": entries[idx].get("author", "Player"),
                    "reason": data.get("reason", "Great storytelling!"),
                }
        return {
            "winner_index": 0,
            "winner": entries[0].get("author", "Player"),
            "reason": "Solid emoji game!",
        }
