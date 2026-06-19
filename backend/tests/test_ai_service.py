"""Pin the AIService contract + the google-genai config shapes it builds.

The kinds of regressions these tests catch:

- A public AI method is renamed or removed (router would 500 on next deploy).
- The google-genai SDK changes a kwarg the service relies on
  (e.g. system_instruction, response_schema, response_mime_type).
- A JSON schema dict drifts out of the OpenAPI 3 subset Vertex accepts.
- The cached client stops being a Vertex-mode genai.Client.
"""

import inspect

from google import genai
from google.genai import types

from app.services import ai_service


# ---- module-level constants -------------------------------------------------


def test_model_name_is_set():
    assert ai_service.MODEL_NAME, "MODEL_NAME must be a non-empty string"


def test_warmup_constructs_a_vertex_client():
    from app.services.llm import get_provider

    ai_service.warmup()
    client = get_provider()._client  # default provider is Vertex
    assert isinstance(client, genai.Client)
    assert client.vertexai is True, "Must run in Vertex mode (service-account ADC)"


# ---- public method contract -------------------------------------------------


EXPECTED_METHODS = [
    "call_llm",
    "generate_board_summary",
    "generate_action_items",
    "generate_retro_idea",
    "generate_icebreaker",
    "generate_drawing_prompt",
    "generate_drawing_hint",
    "generate_trivia_question",
    "generate_meeting_roulette_questions",
    "generate_lie_inspiration",
    "judge_emoji_story",
]


def test_ai_service_exposes_expected_methods():
    svc = ai_service.AIService()
    for name in EXPECTED_METHODS:
        method = getattr(svc, name, None)
        assert method is not None, f"AIService.{name} is missing"
        assert inspect.iscoroutinefunction(method), f"AIService.{name} must be async"


# ---- generation config shapes ----------------------------------------------


def test_generate_content_config_accepts_plain_text_shape():
    """Mirrors the call_llm config when no response_schema is set."""
    cfg = types.GenerateContentConfig(
        temperature=0.3,
        max_output_tokens=2048,
        system_instruction="You are a professional agile coach.",
    )
    assert cfg.system_instruction is not None
    assert cfg.response_schema is None


def test_generate_content_config_accepts_object_schema():
    """Trivia / retro-idea / emoji-judge shape."""
    cfg = types.GenerateContentConfig(
        temperature=0.95,
        max_output_tokens=2048,
        system_instruction="You are a trivia writer.",
        response_mime_type="application/json",
        response_schema=ai_service._TRIVIA_SCHEMA,
    )
    assert cfg.response_mime_type == "application/json"
    assert cfg.response_schema is not None


def test_generate_content_config_accepts_array_schema():
    """Roulette / lie-inspiration / action-items shape."""
    cfg = types.GenerateContentConfig(
        temperature=0.9,
        max_output_tokens=2048,
        system_instruction="You write warm icebreakers.",
        response_mime_type="application/json",
        response_schema=ai_service._STRING_LIST_SCHEMA,
    )
    assert cfg.response_mime_type == "application/json"


# ---- schema well-formedness -------------------------------------------------


ALLOWED_TYPES = {"OBJECT", "ARRAY", "STRING", "INTEGER", "BOOLEAN", "NUMBER"}


def _walk_schema(schema):
    """Yield every nested type-bearing node."""
    if not isinstance(schema, dict):
        return
    yield schema
    if schema.get("type") == "OBJECT":
        for sub in (schema.get("properties") or {}).values():
            yield from _walk_schema(sub)
    elif schema.get("type") == "ARRAY":
        if isinstance(schema.get("items"), dict):
            yield from _walk_schema(schema["items"])


ALL_SCHEMAS = [
    ai_service._ACTION_ITEMS_SCHEMA,
    ai_service._STRING_LIST_SCHEMA,
    ai_service._RETRO_IDEA_SCHEMA,
    ai_service._TRIVIA_SCHEMA,
    ai_service._EMOJI_JUDGEMENT_SCHEMA,
]


def test_all_schemas_use_supported_types():
    for schema in ALL_SCHEMAS:
        for node in _walk_schema(schema):
            t = node.get("type")
            assert t in ALLOWED_TYPES, f"Unsupported schema type: {t!r}"


def test_object_schemas_declare_required_fields():
    """Every OBJECT node should list its required fields - Vertex enforces them."""
    for schema in ALL_SCHEMAS:
        for node in _walk_schema(schema):
            if node.get("type") == "OBJECT":
                assert isinstance(node.get("required"), list) and node["required"], (
                    "OBJECT schema is missing a non-empty `required` list"
                )
                # Required keys must be declared in properties.
                props = set((node.get("properties") or {}).keys())
                missing = set(node["required"]) - props
                assert not missing, f"required references unknown properties: {missing}"
