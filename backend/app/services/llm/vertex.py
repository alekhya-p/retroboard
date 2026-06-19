"""Google Vertex AI (Gemini) provider - the default backend.

This is the original ``AIService`` LLM logic, moved behind the ``LLMProvider``
port. On Cloud Run the runtime service account is picked up automatically via
Application Default Credentials - no API key or key file required.
"""

from typing import Any, Optional
import json
import logging
import threading

import google.auth
import google.auth.transport.requests
from google import genai
from google.genai import types

from .base import LLMProvider
from ...core.config import get_settings

logger = logging.getLogger(__name__)


class VertexProvider(LLMProvider):
    name = "vertex"

    def __init__(self, model: Optional[str] = None):
        settings = get_settings()
        self.model = model or getattr(settings, "VERTEX_MODEL", None) or "gemini-2.5-flash"
        self.project_id = getattr(settings, "GOOGLE_CLOUD_PROJECT", None)
        self.location = getattr(settings, "VERTEX_AI_LOCATION", None) or "europe-west4"
        self._client: Optional[genai.Client] = None
        self._credentials = None
        self._lock = threading.Lock()

    def _ensure_client(self) -> genai.Client:
        if self._client is not None:
            return self._client
        with self._lock:
            if self._client is not None:
                return self._client
            creds, _ = google.auth.default(
                scopes=["https://www.googleapis.com/auth/cloud-platform"]
            )
            # Pre-fetch the access token so the first user request doesn't pay
            # the metadata-server / OAuth round-trip cost.
            try:
                creds.refresh(google.auth.transport.requests.Request())
            except Exception as exc:  # pragma: no cover - best-effort warm up
                logger.warning("Vertex AI credentials pre-warm failed: %s", exc)
            self._credentials = creds
            self._client = genai.Client(
                vertexai=True,
                project=self.project_id,
                location=self.location,
                credentials=creds,
            )
            logger.info(
                "google-genai client initialised (project=%s, location=%s, model=%s)",
                self.project_id,
                self.location,
                self.model,
            )
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
            config_kwargs: dict[str, Any] = {
                "temperature": temperature,
                "max_output_tokens": max_output_tokens,
            }
            if system_instruction:
                config_kwargs["system_instruction"] = system_instruction
            if response_schema is not None:
                config_kwargs["response_mime_type"] = "application/json"
                config_kwargs["response_schema"] = response_schema

            response = await client.aio.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(**config_kwargs),
            )
            text = response.text
            if response_schema is not None and text:
                return json.loads(text)
            return text
        except Exception as exc:
            logger.error("google-genai call failed: %s", exc)
            return None
