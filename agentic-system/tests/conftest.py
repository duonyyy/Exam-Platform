"""Shared pytest fixtures for ExamOps Agent tests."""

import pytest
from starlette.testclient import TestClient

from examops.config import Settings
from examops.main import app
from examops.model import MockModelProvider
from examops.platform_client import ExamPlatformClient
from examops.schemas import ActorContext


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


@pytest.fixture
def teacher_actor() -> ActorContext:
    return ActorContext(
        actor_id="teacher_01",
        actor_role="teacher",
        permissions=["design_blueprint", "review_readiness"],
    )


@pytest.fixture
def student_actor() -> ActorContext:
    return ActorContext(
        actor_id="student_01",
        actor_role="student",
        permissions=["view_assigned_sessions"],
    )


@pytest.fixture
def admin_actor() -> ActorContext:
    return ActorContext(
        actor_id="admin_01",
        actor_role="admin",
        permissions=["design_blueprint", "review_readiness", "publish_session"],
    )
