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


def test_exam_blueprint_skill_with_full_constraints(mock_model: MockModelProvider) -> None:
    skill = ExamBlueprintSkill()
    constraints = {
        "title": "Kỳ Thi Cuối Kỳ Lập Trình Web",
        "duration_minutes": 90,
        "total_questions": 50,
        "total_points": 100.0,
        "pass_score": 50.0,
        "difficulty_distribution": {"easy": 50.0, "medium": 30.0, "hard": 20.0},
        "topics": [
            {"topic_id": "T01", "topic_name": "HTTP & REST", "question_count": 25},
            {"topic_id": "T02", "topic_name": "Authentication", "question_count": 25},
        ],
    }
    bp = skill.execute(subject_id="IT4409", constraints=constraints, model=mock_model)
    assert bp.title == "Kỳ Thi Cuối Kỳ Lập Trình Web"
    assert bp.subject_id == "IT4409"
    assert bp.duration_minutes == 90
    assert bp.total_questions == 50
    assert bp.total_points == 100.0
    assert bp.passing_score == 50.0
    assert bp.difficulty_distribution.easy == 50.0
    assert bp.difficulty_distribution.medium == 30.0
    assert bp.difficulty_distribution.hard == 20.0
    assert len(bp.topic_distribution) == 2
    assert bp.topic_distribution[0].topic_id == "T01"
    assert bp.topic_distribution[0].question_count == 25


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
