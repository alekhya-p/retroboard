"""OpenAI-compatible provider.

Works with real OpenAI and any OpenAI-compatible endpoint - Azure OpenAI,
OpenRouter, Groq, or a local server (Ollama / LM Studio) - by pointing
``OPENAI_API_BASE`` at the endpoint and supplying its key.

The ``openai`` SDK is imported lazily so a Vertex-only deployment never needs
the package installed.
"""

from typing import Any, Optional
import json
import logging

from .base import LLMProvider, vertex_schema_to_json_schema
from ...core.config import get_settings

logger = logging.getLogger(__name__)


def _strictify(node: Any) -> Any:
    """Make a JSON-Schema node satisfy OpenAI structured-output strict mode:
    every object must set ``additionalProperties: false`` and list all of its
    properties as required."""
    if not isinstance(node, dict):
        return node
    out = dict(node)
    if out.get("type") == "object":
        props = out.get("properties") or {}
        out["properties"] = {k: _strictify(v) for k, v in props.items()}
        out["additionalProperties"] = False
        out["required"] = list(out["properties"].keys())
    elif out.get("type") == "array" and isinstance(out.get("items"), dict):
        out["items"] = _strictify(out["items"])
    return out


class OpenAIProvider(LLMProvider):
    name = "openai"

    def __init__(self):
        settings = get_settings()
        self.api_key = getattr(settings, "OPENAI_API_KEY", None)
        self.base_url = getattr(settings, "OPENAI_API_BASE", None) or "https://api.openai.com/v1"
        self.model = getattr(settings, "OPENAI_MODEL", None) or "gpt-4o-mini"
        self._client = None

    def _ensure_client(self):
        if self._client is None:
            from openai import AsyncOpenAI  # lazy import
            self._client = AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)
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
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})

            kwargs: dict[str, Any] = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_output_tokens,
            }
            if response_schema is not None:
                kwargs["response_format"] = {
                    "type": "json_schema",
                    "json_schema": {
                        "name": "response",
                        "strict": True,
                        "schema": _strictify(vertex_schema_to_json_schema(response_schema)),
                    },
                }

            resp = await client.chat.completions.create(**kwargs)
            text = resp.choices[0].message.content
            if response_schema is not None and text:
                return json.loads(text)
            return text
        except Exception as exc:
            logger.error("OpenAI call failed: %s", exc)
            return None
