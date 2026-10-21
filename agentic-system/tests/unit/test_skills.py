"""Unit tests for domain skills (ExamBlueprintSkill and ExamReadinessReviewSkill)."""

from examops.model import MockModelProvider
from examops.schemas import (
    ExamBlueprint,
    ExamDifficultyDistribution,
    QuestionRecord,
)
from examops.skills import ExamBlueprintSkill, ExamReadinessReviewSkill


def test_exam_blueprint_skill(mock_model: MockModelProvider) -> None:
    skill = ExamBlueprintSkill()
    bp = skill.execute(
        subject_id="CS101",
        constraints={"duration_minutes": 75, "total_questions": 45},
        model=mock_model,
    )
    assert bp.subject_id == "CS101"
    assert bp.duration_minutes == 75
    assert bp.total_questions == 45
    assert (
        bp.difficulty_distribution.easy
        + bp.difficulty_distribution.medium
        + bp.difficulty_distribution.hard
        == 100.0
    )


def test_readiness_review_skill_pass() -> None:
    skill = ExamReadinessReviewSkill()
    bp = ExamBlueprint(
        title="Valid Midterm",
        subject_id="CS101",
        duration_minutes=60,
        total_questions=3,
        total_points=10.0,
        passing_score=5.0,
        difficulty_distribution=ExamDifficultyDistribution(easy=33.33, medium=33.33, hard=33.34),
    )
    questions = [
        QuestionRecord(
            id="Q1",
            topic_id="T1",
            type="single_choice",
            status="ready",
            difficulty="easy",
            points=3.33,
            title="Q1",
        ),
        QuestionRecord(
            id="Q2",
            topic_id="T1",
            type="single_choice",
            status="ready",
            difficulty="medium",
            points=3.33,
            title="Q2",
        ),
        QuestionRecord(
            id="Q3",
            topic_id="T1",
            type="single_choice",
            status="ready",
            difficulty="hard",
            points=3.34,
            title="Q3",
        ),
    ]
    review = skill.execute(blueprint=bp, questions=questions)
    assert review.status in ("PASS", "WARNING")
    assert review.failed_checks == 0
    assert len(review.violations) == 0


def test_readiness_review_skill_fail_when_duplicates_exist() -> None:
    skill = ExamReadinessReviewSkill()
    bp = ExamBlueprint(
        title="Invalid Exam",
        subject_id="CS101",
        duration_minutes=60,
        total_questions=2,
        total_points=10.0,
        passing_score=5.0,
        difficulty_distribution=ExamDifficultyDistribution(easy=50.0, medium=50.0, hard=0.0),
    )
    questions = [
        QuestionRecord(
            id="Q1",
            topic_id="T1",
            type="single_choice",
            status="ready",
            difficulty="easy",
            points=5.0,
            title="Q1",
        ),
        QuestionRecord(
            id="Q1",
            topic_id="T1",
            type="single_choice",
            status="ready",
            difficulty="medium",
            points=5.0,
            title="Q1 Duplicate",
        ),
    ]
    review = skill.execute(blueprint=bp, questions=questions)
    assert review.status == "FAIL"
    assert review.failed_checks > 0
    assert any("Duplicate" in v for v in review.violations)
