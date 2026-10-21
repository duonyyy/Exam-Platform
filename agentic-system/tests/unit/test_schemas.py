"""Unit tests for Pydantic schemas and mathematical validations."""

import pytest
from pydantic import ValidationError

from examops.schemas import (
    ExamBlueprint,
    ExamDifficultyDistribution,
    TopicDistributionItem,
)


def test_difficulty_distribution_valid_sum_100() -> None:
    diff = ExamDifficultyDistribution(easy=40.0, medium=40.0, hard=20.0)
    assert diff.easy == 40.0
    assert diff.medium == 40.0
    assert diff.hard == 20.0


def test_difficulty_distribution_invalid_sum_fails() -> None:
    with pytest.raises(ValidationError) as exc_info:
        ExamDifficultyDistribution(easy=50.0, medium=40.0, hard=20.0)
    assert "Difficulty percentages must sum to 100.0" in str(exc_info.value)


def test_exam_blueprint_schema() -> None:
    bp = ExamBlueprint(
        title="Final Test",
        subject_id="CS101",
        duration_minutes=90,
        total_questions=50,
        total_points=10.0,
        passing_score=5.0,
        difficulty_distribution=ExamDifficultyDistribution(easy=30.0, medium=50.0, hard=20.0),
        topic_distribution=[
            TopicDistributionItem(topic_id="T1", topic_name="Basics", question_count=50)
        ],
    )
    assert bp.duration_minutes == 90
    assert bp.total_questions == 50


def test_exam_blueprint_invalid_duration_fails() -> None:
    with pytest.raises(ValidationError):
        ExamBlueprint(
            title="Invalid Exam",
            subject_id="CS101",
            duration_minutes=-10,  # Invalid
            total_questions=50,
            total_points=10.0,
            passing_score=5.0,
            difficulty_distribution=ExamDifficultyDistribution(easy=30.0, medium=50.0, hard=20.0),
        )
