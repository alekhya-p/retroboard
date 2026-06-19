from typing import Optional, Dict, Any
from pydantic_settings import BaseSettings
from functools import lru_cache
from .secrets import get_secret
import logging
import os

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "RetroBoard"
    
    # Security
    SECRET_KEY: Optional[str] = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ALGORITHM: str = "HS256"
    RESET_TOKEN_EXPIRE_MINUTES: int = 30

    # Transactional email (Resend) - used for password reset
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "reAItro <noreply@reaitro.com>"
    FRONTEND_URL: str = "https://reaitro.com"

    # AI provider selection: "vertex" (default) | "openai" | "anthropic"
    AI_PROVIDER: str = "vertex"

    # Google Cloud / Vertex AI
    GOOGLE_CLOUD_PROJECT: str = "your-gcp-project-id"
    VERTEX_AI_LOCATION: str = "europe-west4"
    VERTEX_MODEL: str = "gemini-2.5-flash"
    CUSTOM_CONFIGURE_DEPLOYMENT: bool = False


    #MONGO_DB
    MONGO_DB_URL: Optional[str] = None
    # Redis
    REDIS_URL: Optional[str] = None
    
    #callback url
    CALLBACK_URL: str = "http://localhost:5173/login"
    CALLBACK_URI: str = "/login?provider=google"

    # Authentication
    MICROSOFT_CLIENT_ID: Optional[str] = None
    MICROSOFT_CLIENT_SECRET: Optional[str] = None
    MICROSOFT_TENANT_ID: Optional[str] = None
    
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_CALLBACK_URL: Optional[str] = None
    
    # OpenAI (also covers OpenAI-compatible endpoints - Azure OpenAI, OpenRouter,
    # Groq, Ollama/LM Studio - by pointing OPENAI_API_BASE at the endpoint)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_API_BASE: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Anthropic (Claude)
    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: str = "claude-haiku-4-5-20251001"
    ANTHROPIC_BASE_URL: Optional[str] = None
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["*"]
    VERSION: Optional[str] = None
    
    class Config:
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    custom_config = os.getenv("CUSTOM_CONFIGURE_DEPLOYMENT", "false").lower() == "true"

    
    if custom_config:
        logger.warning("CUSTOM_CONFIGURE_DEPLOYMENT is true: using only environment variables for configuration.")
        return settings
    logger.warning("CUSTOM_CONFIGURE_DEPLOYMENT is false: using google cloud.")
    # Try to get secrets from Google Cloud Secret Manager
    try:
        # Ensure project ID is set
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        if not project_id:
            logger.warning("GOOGLE_CLOUD_PROJECT not set, setting from settings: "+str(settings.GOOGLE_CLOUD_PROJECT))
            os.environ["GOOGLE_CLOUD_PROJECT"] = settings.GOOGLE_CLOUD_PROJECT

        secrets = get_secret("app-secrets")
        for key, value in secrets.items():
            if hasattr(settings, key):
                setattr(settings, key, value)

        # Load Google OAuth credentials from dedicated secret
        try:
            oauth_secrets = get_secret("google-oauth-credentials")
            for key, value in oauth_secrets.items():
                if hasattr(settings, key):
                    setattr(settings, key, value)
        except Exception as e:
            logger.warning(f"Google OAuth secret not found, using app-secrets values: {str(e)}")

    except Exception as e:
        logger.error(f"Error retrieving secrets: {str(e)}")
        logger.info("Continuing with environment variables only")
    return settings