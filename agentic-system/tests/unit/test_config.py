"""Unit tests for configuration loading."""

from examops.config import Settings


def test_settings_default_values() -> None:
    settings = Settings()
    assert settings.app_env in ("development", "testing", "production")
    assert settings.api_port == 8000
    assert settings.model_provider in ("mock", "gemini", "openai_compatible")
    assert settings.max_retries == 2


def test_settings_custom_values() -> None:
    settings = Settings(
        APP_ENV="staging",
        API_PORT=9000,
        MODEL_PROVIDER="openai_compatible",
        MAX_RETRIES=3,
    )
    assert settings.app_env == "staging"
    assert settings.api_port == 9000
    assert settings.model_provider == "openai_compatible"
    assert settings.max_retries == 3
