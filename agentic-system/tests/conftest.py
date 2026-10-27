"""Shared pytest fixtures for ExamOps Agent tests."""

import os

import pytest
from starlette.testclient import TestClient

from examops.config import Settings, get_settings
from examops.main import app
from examops.model import MockModelProvider
from examops.platform_client import ExamPlatformClient


def pytest_configure() -> None:
    """Set hermetic test environment before loading modules."""
    os.environ["APP_ENV"] = "testing"
    os.environ["MODEL_PROVIDER"] = "mock"
    get_settings.cache_clear()


@pytest.fixture
def test_settings() -> Settings:
    return Settings(
        APP_ENV="testing",
        API_KEY="test-secret-key",
        MODEL_PROVIDER="mock",
        CHECKPOINT_DB_PATH=":memory:",
        EXAM_PLATFORM_MOCK=True,
    )


@pytest.fixture
def auth_headers(test_settings: Settings) -> dict[str, str]:
    return {"X-API-Key": test_settings.api_key}


@pytest.fixture
def api_client(test_settings: Settings) -> TestClient:
    # Override settings dependency
    from examops.config import get_settings

    app.dependency_overrides[get_settings] = lambda: test_settings
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture
def mock_model(test_settings: Settings) -> MockModelProvider:
    return MockModelProvider(test_settings)


@pytest.fixture
def mock_platform_client(test_settings: Settings) -> ExamPlatformClient:
    return ExamPlatformClient(test_settings)

