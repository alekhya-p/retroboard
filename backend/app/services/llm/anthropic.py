"""Anthropic (Claude) provider.

Claude has no native JSON-Schema response mode, so when a schema is requested
we use a single forced tool call whose ``input_schema`` is the schema - the
reliable way to get strict structured output from Claude. Array-typed schemas
are wrapped in an object (tool inputs must be objects) and unwrapped on return.

The ``anthropic`` SDK is imported lazily so other deployments don't need it.
"""

from typing import Any, Optional
import logging

from .base import LLMProvider, vertex_schema_to_json_schema
from ...core.config import get_settings

logger = logging.getLogger(__name__)

_TOOL_NAME = "emit_result"


class AnthropicProvider(LLMProvider):
    name = "anthropic"

    def __init__(self):
        settings = get_settings()
        self.api_key = getattr(settings, "ANTHROPIC_API_KEY", None)
        self.model = getattr(settings, "ANTHROPIC_MODEL", None) or "claude-haiku-4-5-20251001"
        self.base_url = getattr(settings, "ANTHROPIC_BASE_URL", None)
        self._client = None

    def _ensure_client(self):
        if self._client is None:
            from anthropic import AsyncAnthropic  # lazy import
            kwargs: dict[str, Any] = {"api_key": self.api_key}
            if self.base_url:
                kwargs["base_url"] = self.base_url
            self._client = AsyncAnthropic(**kwargs)
        return self._client

    def warmup(self) -> None:
        self._ensure_client()

    async def call_llm(
        self,
        prompt: str,
        *,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
        max_output_tokens: int = 2048,
        response_schema: Optional[dict] = None,
    ) -> Optional[Any]:
        try:
            client = self._ensure_client()
            kwargs: dict[str, Any] = {
                "model": self.model,
                "max_tokens": max_output_tokens,
                "temperature": min(temperature, 1.0),
                "messages": [{"role": "user", "content": prompt}],
            }
            if system_instruction:
                kwargs["system"] = system_instruction

            if response_schema is not None:
                json_schema = vertex_schema_to_json_schema(response_schema)
                # Tool inputs must be objects; wrap non-object roots (e.g. arrays).
                wrapped = json_schema.get("type") != "object"
                tool_schema = (
                    {"type": "object",
                     "properties": {"result": json_schema},
                     "required": ["result"]}
                    if wrapped else json_schema
                )
                kwargs["tools"] = [{
                    "name": _TOOL_NAME,
                    "description": "Return the structured result.",
                    "input_schema": tool_schema,
                }]
                kwargs["tool_choice"] = {"type": "tool", "name": _TOOL_NAME}

                resp = await client.messages.create(**kwargs)
                for block in resp.content:
                    if getattr(block, "type", None) == "tool_use":
                        data = block.input
                        return data.get("result") if wrapped else data
                return None

            resp = await client.messages.create(**kwargs)
            parts = [b.text for b in resp.content if getattr(b, "type", None) == "text"]
            return "".join(parts) if parts else None
        except Exception as exc:
            logger.error("Anthropic call failed: %s", exc)
            return None
