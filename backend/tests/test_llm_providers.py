"""Tests for the swappable LLM provider port (app/services/llm/).

These run fully offline: the schema converter is pure, the factory only builds
provider objects (no network - adapters import their SDKs lazily), and
AIService delegation is exercised through an injected fake provider.
"""

import asyncio
import copy
import inspect

import pytest

from app.core.config import get_settings
from app.services import ai_service
from app.services import llm as llm_pkg
from app.services.llm.base import LLMProvider, vertex_schema_to_json_schema


@pytest.fixture(autouse=True)
def _reset_provider_singleton():
    """Keep the global provider back on the default after each test."""
    yield
    try:
        llm_pkg.get_provider(refresh=True)
    except Exception:
        pass


# ---- schema converter -------------------------------------------------------


def test_converter_lowercases_types_and_keeps_structure():
    out = vertex_schema_to_json_schema(ai_service._TRIVIA_SCHEMA)
    assert out["type"] == "object"
    assert out["properties"]["options"]["type"] == "array"
    assert out["properties"]["options"]["items"]["type"] == "string"
    assert out["properties"]["correct_index"]["type"] == "integer"
    # non-type keys are preserved verbatim
    assert out["required"] == ai_service._TRIVIA_SCHEMA["required"]


def test_converter_handles_array_root():
    out = vertex_schema_to_json_schema(ai_service._STRING_LIST_SCHEMA)
    assert out["type"] == "array"
    assert out["items"]["type"] == "string"


def test_converter_does_not_mutate_input():
    before = copy.deepcopy(ai_service._RETRO_IDEA_SCHEMA)
    vertex_schema_to_json_schema(ai_service._RETRO_IDEA_SCHEMA)
    assert ai_service._RETRO_IDEA_SCHEMA == before  # still uppercase


# ---- factory ----------------------------------------------------------------


def test_default_provider_is_vertex():
    from app.services.llm.vertex import VertexProvider

    provider = llm_pkg.get_provider(refresh=True)
    assert isinstance(provider, VertexProvider)
    assert provider.name == "vertex"


def test_factory_selects_openai(monkeypatch):
    s = get_settings()
    monkeypatch.setattr(s, "AI_PROVIDER", "openai", raising=False)
    monkeypatch.setattr(s, "OPENAI_API_KEY", "sk-test", raising=False)
    provider = llm_pkg.get_provider(refresh=True)
    assert provider.name == "openai"


def test_factory_selects_anthropic(monkeypatch):
    s = get_settings()
    monkeypatch.setattr(s, "AI_PROVIDER", "anthropic", raising=False)
    monkeypatch.setattr(s, "ANTHROPIC_API_KEY", "sk-ant-test", raising=False)
    provider = llm_pkg.get_provider(refresh=True)
    assert provider.name == "anthropic"


def test_openai_requires_key(monkeypatch):
    s = get_settings()
    monkeypatch.setattr(s, "AI_PROVIDER", "openai", raising=False)
    monkeypatch.setattr(s, "OPENAI_API_KEY", None, raising=False)
    with pytest.raises(ValueError):
        llm_pkg.get_provider(refresh=True)


def test_anthropic_requires_key(monkeypatch):
    s = get_settings()
    monkeypatch.setattr(s, "AI_PROVIDER", "anthropic", raising=False)
    monkeypatch.setattr(s, "ANTHROPIC_API_KEY", None, raising=False)
    with pytest.raises(ValueError):
        llm_pkg.get_provider(refresh=True)


def test_unknown_provider_rejected(monkeypatch):
    s = get_settings()
    monkeypatch.setattr(s, "AI_PROVIDER", "bogus", raising=False)
    with pytest.raises(ValueError):
        llm_pkg.get_provider(refresh=True)


# ---- interface contract -----------------------------------------------------


def test_all_adapters_implement_async_port():
    from app.services.llm.vertex import VertexProvider
    from app.services.llm.openai import OpenAIProvider
    from app.services.llm.anthropic import AnthropicProvider

    for cls in (VertexProvider, OpenAIProvider, AnthropicProvider):
        assert issubclass(cls, LLMProvider)
        assert inspect.iscoroutinefunction(cls.call_llm)


# ---- AIService delegation ---------------------------------------------------


class _FakeProvider(LLMProvider):
    name = "fake"

    def __init__(self):
        self.calls = []
        self.next_return = None

    async def call_llm(self, prompt, *, system_instruction=None, temperature=0.2,
                       max_output_tokens=2048, response_schema=None):
        self.calls.append({
            "prompt": prompt,
            "system_instruction": system_instruction,
            "temperature": temperature,
            "max_output_tokens": max_output_tokens,
            "response_schema": response_schema,
        })
        return self.next_return


def test_aiservice_passes_args_through_to_provider():
    fake = _FakeProvider()
    fake.next_return = "hello"
    svc = ai_service.AIService(provider=fake)

    out = asyncio.run(svc.call_llm(
        "hi", system_instruction="sys", temperature=0.5,
        max_output_tokens=64, response_schema={"type": "STRING"},
    ))

    assert out == "hello"
    call = fake.calls[0]
    assert call["prompt"] == "hi"
    assert call["system_instruction"] == "sys"
    assert call["temperature"] == 0.5
    assert call["max_output_tokens"] == 64
    assert call["response_schema"] == {"type": "STRING"}


def test_high_level_method_uses_provider_and_action_schema():
    fake = _FakeProvider()
    fake.next_return = ["Do X", "  Do Y  ", 123, ""]
    svc = ai_service.AIService(provider=fake)

    out = asyncio.run(svc.generate_action_items([]))

    # strings stripped, non-strings/empties dropped
    assert out == ["Do X", "Do Y"]
    # it asked the provider for strict JSON via the action-items schema
    assert fake.calls[0]["response_schema"] is ai_service._ACTION_ITEMS_SCHEMA
