"""Unit tests for multi-tier deterministic verification logic."""

from examops.schemas import (
    ActorContext,
    ExamBlueprint,
    ExamDifficultyDistribution,
)
from examops.verification import (
    verify_actor_and_intent,
    verify_blueprint,
)


def test_verify_actor_valid() -> None:
    actor = ActorContext(actor_id="t1", actor_role="teacher")
    res = verify_actor_and_intent(actor, "design_blueprint")
    assert res.is_valid is True
    assert len(res.checks_failed) == 0


def test_verify_actor_unauthorized_intent() -> None:
    actor = ActorContext(actor_id="s1", actor_role="student")
    # Student cannot design blueprints
    res = verify_actor_and_intent(actor, "design_blueprint")
    assert res.is_valid is False
    assert res.is_terminal is True
    assert any("lacks permission" in f for f in res.checks_failed)


def test_verify_blueprint_valid() -> None:
    bp = ExamBlueprint(
        title="Test Exam",
        subject_id="CS101",
        duration_minutes=60,
        total_questions=30,
        total_points=10.0,
        passing_score=5.0,
        difficulty_distribution=ExamDifficultyDistribution(easy=40.0, medium=40.0, hard=20.0),
    )
    res = verify_blueprint(bp)
    assert res.is_valid is True
    assert len(res.checks_failed) == 0


def test_verify_blueprint_invalid_passing_score() -> None:
    bp = ExamBlueprint(
        title="Test Exam",
        subject_id="CS101",
        duration_minutes=60,
        total_questions=30,
        total_points=10.0,
        passing_score=15.0,  # Passing score > total points
        difficulty_distribution=ExamDifficultyDistribution(easy=40.0, medium=40.0, hard=20.0),
    )
    res = verify_blueprint(bp)
    assert res.is_valid is False
    assert any("Passing score cannot exceed total points" in f for f in res.checks_failed)
