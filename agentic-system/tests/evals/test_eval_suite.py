"""Evaluation Suite: 6 standard benchmark scenarios from Foundation Design.

Scenarios:
1. Valid blueprint generation -> PASS & COMPLETED
2. Invalid difficulty percentage sum -> Mathematical check FAIL
3. Missing or negative duration -> Schema & math validation FAIL
4. Duplicate question IDs in readiness review -> FAIL with violations
5. Write intent action -> Pauses at Human Review Gate (WAITING_FOR_APPROVAL)
6. Network timeout / transient error -> Bounded retries and graceful error
"""

import sqlite3

import pytest
from langgraph.checkpoint.sqlite import SqliteSaver
from pydantic import ValidationError

from examops.graph import create_examops_graph
from examops.model import MockModelProvider
from examops.schemas import (
    ExamBlueprint,
    ExamDifficultyDistribution,
    QuestionRecord,
)
from examops.skills import ExamBlueprintSkill, ExamReadinessReviewSkill
from examops.verification import verify_blueprint


# ── Scenario 1: Valid Blueprint Generation ───────────────────
def test_eval_scenario_1_valid_blueprint() -> None:
    skill = ExamBlueprintSkill()
    model = MockModelProvider()
    bp = skill.execute(
        subject_id="CS101",
        constraints={"duration_minutes": 90, "total_questions": 50},
        model=model,
    )
    verif = verify_blueprint(bp)
    assert verif.is_valid is True
    assert bp.duration_minutes == 90
    assert bp.total_questions == 50


# ── Scenario 2: Invalid Difficulty Percentage Sum ────────────
def test_eval_scenario_2_invalid_percentage_sum() -> None:
    with pytest.raises(ValidationError) as exc:
        ExamDifficultyDistribution(easy=50.0, medium=50.0, hard=20.0)  # Sums to 120%
    assert "Difficulty percentages must sum to 100.0" in str(exc.value)


# ── Scenario 3: Missing / Negative Duration ───────────────────
def test_eval_scenario_3_negative_duration() -> None:
    with pytest.raises(ValidationError):
        ExamBlueprint(
            title="Broken Exam",
            subject_id="CS101",
            duration_minutes=-15,  # Invalid negative
            total_questions=30,
            total_points=10.0,
            passing_score=5.0,
            difficulty_distribution=ExamDifficultyDistribution(easy=40.0, medium=40.0, hard=20.0),
        )


# ── Scenario 4: Duplicate Question IDs Detection ─────────────
def test_eval_scenario_4_duplicate_questions() -> None:
    skill = ExamReadinessReviewSkill()
    bp = ExamBlueprint(
        title="Midterm",
        subject_id="CS101",
        duration_minutes=60,
        total_questions=2,
        total_points=10.0,
        passing_score=5.0,
        difficulty_distribution=ExamDifficultyDistribution(easy=50.0, medium=50.0, hard=0.0),
    )
    duplicate_pool = [
        QuestionRecord(
            id="DUP-01",
            topic_id="T01",
            type="single_choice",
            status="ready",
            difficulty="easy",
            points=5.0,
            title="Original",
        ),
        QuestionRecord(
            id="DUP-01",
            topic_id="T01",
            type="single_choice",
            status="ready",
            difficulty="easy",
            points=5.0,
            title="Duplicate",
        ),
    ]
    review = skill.execute(blueprint=bp, questions=duplicate_pool)
    assert review.status == "FAIL"
    assert any("Duplicate" in v for v in review.violations)


# ── Scenario 5: Write Intent Action Pauses for Human Approval ──
def test_eval_scenario_5_write_intent_pauses_for_approval() -> None:
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    saver = SqliteSaver(conn)
    graph = create_examops_graph(checkpointer=saver, model=MockModelProvider())

    thread_id = "eval_write_thread_01"
    config = {"configurable": {"thread_id": thread_id}}

    # Prompt containing write intent keyword ("publish")
    initial_state = {
        "task_id": "task_eval_write",
        "thread_id": thread_id,
        "actor_context": {
            "actor_id": "teacher_01",
            "actor_role": "teacher",
            "permissions": ["publish_session"],
        },
        "raw_input": "Publish session ca thi giữa kỳ môn CS101",
        "subject": "CS101",
        "constraints": {"session_id": "SES-101"},
        "retry_count": 0,
        "errors": [],
    }

    graph.invoke(initial_state, config=config)

    # Verify that the graph interrupted at human_review
    state_snapshot = graph.get_state(config)
    assert state_snapshot.next == ("human_review",)
    values = state_snapshot.values
    assert values.get("approval_proposal") is not None
    assert values["approval_proposal"]["action"] == "publish_session"


# ── Scenario 6: Network Timeout / Transient Error Handling ────
def test_eval_scenario_6_network_timeout() -> None:
    import httpx
    import respx

    # Simulate network timeout with respx
    with respx.mock(base_url="http://test-server/api/v1") as mock:
        mock.get("/subjects").mock(side_effect=httpx.TimeoutException("Connection timed out"))

        from examops.config import Settings
        from examops.platform_client import ExamPlatformClient, ExamPlatformClientError

        custom_settings = Settings(
            EXAM_PLATFORM_BASE_URL="http://test-server/api/v1",
            EXAM_PLATFORM_MOCK=False,
            EXAM_PLATFORM_TIMEOUT=1.0,
        )
        client = ExamPlatformClient(custom_settings)

        with pytest.raises(ExamPlatformClientError) as exc_info:
            client.list_subjects()
        assert "HTTP error" in str(exc_info.value)


# ── Scenario 7: Materialize Blueprint via Platform Client ──────
def test_eval_scenario_7_client_create_exam_from_blueprint() -> None:
    from examops.config import Settings
    from examops.platform_client import ExamPlatformClient

    client = ExamPlatformClient(Settings(EXAM_PLATFORM_MOCK=True))
    payload = {
        "thread_id": "thread_eval_07",
        "prompt_hash": "a" * 64,
        "proposal_hash": "b" * 64,
        "subject_id": 1,
        "title": "Evaluated Blueprint Exam",
        "duration_minutes": 60,
        "pass_score": 5.0,
        "shuffle_questions": True,
        "shuffle_options": True,
        "questions": [
            {"question_id": 10, "order": 1, "points": 5.0},
            {"question_id": 11, "order": 2, "points": 5.0},
        ],
    }

    result = client.create_exam_from_blueprint(payload)
    assert result["source"] == "MOCK"
    assert result["data"]["id"] == 101
    assert result["data"]["total_points"] == 10.0
    assert result["data"]["questions_count"] == 2


# ── Scenario 8: Audit Exam Readiness via Platform Client ───────
def test_eval_scenario_8_client_get_exam_readiness_review() -> None:
    from examops.config import Settings
    from examops.platform_client import ExamPlatformClient

    client = ExamPlatformClient(Settings(EXAM_PLATFORM_MOCK=True))
    result = client.get_exam_readiness_review(101)

    assert result["source"] == "MOCK"
    assert result["data"]["is_ready_for_session"] is True
    assert result["data"]["total_questions"] == 40
    assert result["data"]["difficulty_distribution"]["easy"]["percentage"] == 40.0
