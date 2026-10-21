"""Integration tests for FastAPI endpoints."""

from starlette.testclient import TestClient


def test_health_check(api_client: TestClient) -> None:
    response = api_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "0.1.0"
    assert "environment" in data
    assert "model_provider" in data


def test_create_task_unauthorized(api_client: TestClient) -> None:
    # Missing X-API-Key header
    payload = {
        "goal": "Design midterm exam blueprint",
        "actor": {"actor_id": "teacher_01", "actor_role": "teacher", "permissions": []},
        "subject": "CS101",
    }
    response = api_client.post("/api/v1/tasks", json=payload)
    assert response.status_code == 422 or response.status_code == 401


def test_create_task_success(api_client: TestClient, auth_headers: dict[str, str]) -> None:
    payload = {
        "goal": "Thiết kế đề thi giữa kỳ môn CS101 40 câu 60 phút",
        "actor": {
            "actor_id": "teacher_01",
            "actor_role": "teacher",
            "permissions": ["design_blueprint"],
        },
        "subject": "CS101",
        "constraints": {"duration_minutes": 60, "total_questions": 40},
    }
    response = api_client.post("/api/v1/tasks", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert "task_id" in data
    assert "thread_id" in data
    assert data["status"] in ("COMPLETED", "WAITING_FOR_APPROVAL")


def test_get_task_not_found(api_client: TestClient, auth_headers: dict[str, str]) -> None:
    response = api_client.get("/api/v1/tasks/non-existent-thread-id", headers=auth_headers)
    assert response.status_code == 404
