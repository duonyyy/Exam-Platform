"""Configuration management for ExamOps Agent using Pydantic Settings."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment or .env file."""

    # Application
    app_env: str = Field(default="development", alias="APP_ENV")
    api_host: str = Field(default="127.0.0.1", alias="API_HOST")
    api_port: int = Field(default=8001, alias="API_PORT")
    api_key: str = Field(default="test-agent-key", alias="API_KEY")

    # Model Provider
    model_provider: str = Field(default="mock", alias="MODEL_PROVIDER")
    model_name: str = Field(default="gemini-2.5-flash", alias="MODEL_NAME")
    model_api_key: str = Field(default="", alias="MODEL_API_KEY")
    model_base_url: str = Field(default="", alias="MODEL_BASE_URL")

    # Exam Platform Core API Integration
    exam_platform_base_url: str = Field(
        default="http://localhost:8000/api/v1", alias="EXAM_PLATFORM_BASE_URL"
    )
    exam_platform_api_token: str = Field(default="", alias="EXAM_PLATFORM_API_TOKEN")
    exam_platform_mock: bool = Field(default=True, alias="EXAM_PLATFORM_MOCK")
    exam_platform_timeout: float = Field(default=10.0, alias="EXAM_PLATFORM_TIMEOUT")

    # Agent Workflow
    max_retries: int = Field(default=2, alias="MAX_RETRIES")
    checkpoint_db_path: str = Field(default="data/checkpoints.db", alias="CHECKPOINT_DB_PATH")

    # Observability
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    otel_enabled: bool = Field(default=False, alias="OTEL_ENABLED")
    otel_service_name: str = Field(default="examops-agent", alias="OTEL_SERVICE_NAME")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Singleton getter for cached settings."""
    return Settings()
