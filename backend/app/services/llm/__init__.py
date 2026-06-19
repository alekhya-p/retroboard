"""Swappable LLM providers.

``get_provider()`` returns a process-wide singleton chosen by
``settings.AI_PROVIDER`` (``vertex`` by default). Adapter modules import their
SDKs lazily, so only the selected provider's library needs to be installed.
"""

from typing import Optional
import logging
import threading

from .base import LLMProvider, vertex_schema_to_json_schema

logger = logging.getLogger(__name__)

_provider: Optional[LLMProvider] = None
_lock = threading.Lock()


def _build_provider(name: Optional[str] = None) -> LLMProvider:
    from ...core.config import get_settings  # local import avoids import cycles
    settings = get_settings()
    name = (name or getattr(settings, "AI_PROVIDER", None) or "vertex").lower()

    if name == "vertex":
        from .vertex import VertexProvider
        return VertexProvider()

    if name == "openai":
        if not getattr(settings, "OPENAI_API_KEY", None):
            raise ValueError("AI_PROVIDER=openai requires OPENAI_API_KEY to be set")
        from .openai import OpenAIProvider
        return OpenAIProvider()

    if name == "anthropic":
        if not getattr(settings, "ANTHROPIC_API_KEY", None):
            raise ValueError("AI_PROVIDER=anthropic requires ANTHROPIC_API_KEY to be set")
        from .anthropic import AnthropicProvider
        return AnthropicProvider()

    raise ValueError(
        f"Unknown AI_PROVIDER {name!r} - expected 'vertex', 'openai', or 'anthropic'"
    )


def get_provider(refresh: bool = False) -> LLMProvider:
    """Return the active provider singleton (rebuild it when ``refresh=True``)."""
    global _provider
    if _provider is not None and not refresh:
        return _provider
    with _lock:
        if _provider is None or refresh:
            _provider = _build_provider()
            logger.info("LLM provider selected: %s", _provider.name)
        return _provider


__all__ = ["LLMProvider", "vertex_schema_to_json_schema", "get_provider"]
