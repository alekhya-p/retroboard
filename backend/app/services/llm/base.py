"""The LLM provider port + a small schema converter shared by adapters.

``AIService`` funnels every AI feature through a single ``call_llm`` seam. This
module defines that seam as an abstract port so the backend behind it can be
swapped (Vertex / OpenAI / Anthropic) by configuration alone.
"""

from abc import ABC, abstractmethod
from typing import Any, Optional


class LLMProvider(ABC):
    """A swappable large-language-model backend.

    Implementations translate one provider-agnostic call into their own SDK.
    The contract mirrors what ``AIService`` already relied on:

    * return the parsed JSON object/list when ``response_schema`` is given,
    * otherwise return the raw text,
    * return ``None`` on any failure - callers have their own fallbacks.
    """

    #: Short identifier, handy for logging/tests (overridden per adapter).
    name: str = "base"

    @abstractmethod
    async def call_llm(
        self,
        prompt: str,
        *,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
        max_output_tokens: int = 2048,
        response_schema: Optional[dict] = None,
    ) -> Optional[Any]:
        """Generate a completion. See class docstring for the return contract."""
        raise NotImplementedError

    def warmup(self) -> None:
        """Optional eager initialisation (e.g. build the SDK client). No-op by default."""
        return None


# Vertex/Gemini accepts the OpenAPI-3 subset, which uses UPPERCASE type names
# ("STRING", "ARRAY", ...). OpenAI and Anthropic expect standard JSON Schema
# (lowercase). The canonical schemas in ai_service.py are kept in the Vertex
# format; non-Vertex adapters convert them with the helper below.
_TYPE_MAP = {
    "OBJECT": "object",
    "ARRAY": "array",
    "STRING": "string",
    "INTEGER": "integer",
    "NUMBER": "number",
    "BOOLEAN": "boolean",
}


def vertex_schema_to_json_schema(schema: Any) -> Any:
    """Recursively convert a Vertex (uppercase) schema to standard JSON Schema.

    Pure function - it returns a new structure and never mutates the input, so
    the canonical schema constants stay in their Vertex form.
    """
    if not isinstance(schema, dict):
        return schema

    converted: dict[str, Any] = {}
    for key, value in schema.items():
        if key == "type" and isinstance(value, str):
            converted["type"] = _TYPE_MAP.get(value, value.lower())
        elif key == "properties" and isinstance(value, dict):
            converted["properties"] = {
                prop: vertex_schema_to_json_schema(sub) for prop, sub in value.items()
            }
        elif key == "items":
            converted["items"] = vertex_schema_to_json_schema(value)
        else:
            converted[key] = value
    return converted
