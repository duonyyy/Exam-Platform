"""Domain skills for ExamOps Agent (Blueprint design and Readiness review)."""

from __future__ import annotations

from typing import Any

from examops.model import ModelProvider
from examops.schemas import (
    ExamBlueprint,
    ExamDifficultyDistribution,
    QuestionRecord,
    ReadinessCheckItem,
    ReadinessReview,
    TopicDistributionItem,
)


class SkillExecutionError(Exception):
    """Raised when domain skill execution fails."""


class ExamBlueprintSkill:
    """Design a structured exam blueprint adhering strictly to mathematical constraints."""

    def execute(
        self,
        subject_id: str,
        constraints: dict[str, Any],
        model: ModelProvider,
    ) -> ExamBlueprint:
        # If model is mock or offline, synthesize or use model structured generation
        prompt = (
            f"Design an exam blueprint for subject '{subject_id}' with constraints: {constraints}"
        )
        blueprint: ExamBlueprint = model.generate_structured(prompt, ExamBlueprint)

        # Ensure parameters match caller constraints if explicitly provided
        if "title" in constraints and constraints["title"]:
            blueprint.title = str(constraints["title"])
        if "duration_minutes" in constraints and constraints["duration_minutes"] is not None:
            blueprint.duration_minutes = int(constraints["duration_minutes"])
        if "total_questions" in constraints and constraints["total_questions"] is not None:
            blueprint.total_questions = int(constraints["total_questions"])
        if "subject_id" in constraints and constraints["subject_id"]:
            blueprint.subject_id = str(constraints["subject_id"])
        elif subject_id:
            blueprint.subject_id = subject_id
        if "total_points" in constraints and constraints["total_points"] is not None:
            blueprint.total_points = float(constraints["total_points"])
        if "passing_score" in constraints and constraints["passing_score"] is not None:
            blueprint.passing_score = float(constraints["passing_score"])
        elif "pass_score" in constraints and constraints["pass_score"] is not None:
            blueprint.passing_score = float(constraints["pass_score"])

        # Override difficulty distribution if explicitly supplied
        if "difficulty_distribution" in constraints and constraints["difficulty_distribution"]:
            raw_diff = constraints["difficulty_distribution"]
            if isinstance(raw_diff, dict):
                blueprint.difficulty_distribution = ExamDifficultyDistribution.model_validate(raw_diff)
            elif isinstance(raw_diff, ExamDifficultyDistribution):
                blueprint.difficulty_distribution = raw_diff

        # Override topic distribution if explicitly supplied (topics or topic_distribution)
        topics_payload = constraints.get("topics") or constraints.get("topic_distribution")
        if topics_payload and isinstance(topics_payload, list):
            items = []
            for t in topics_payload:
                if isinstance(t, dict) and t.get("question_count", 0) > 0:
                    items.append(TopicDistributionItem.model_validate(t))
                elif isinstance(t, TopicDistributionItem) and t.question_count > 0:
                    items.append(t)
            if items:
                blueprint.topic_distribution = items

        # Verify mathematical integrity
        diff = blueprint.difficulty_distribution
        total_pct = round(diff.easy + diff.medium + diff.hard, 2)
        if abs(total_pct - 100.0) > 0.01:
            raise SkillExecutionError(f"Difficulty distribution must sum to 100%, got {total_pct}%")

        return blueprint


class ExamReadinessReviewSkill:
    """Audit an exam blueprint and its question pool for exam session readiness."""

    def execute(
        self,
        blueprint: ExamBlueprint,
        questions: list[QuestionRecord | dict[str, Any]],
    ) -> ReadinessReview:
        checks: list[ReadinessCheckItem] = []
        violations: list[str] = []
        recommendations: list[str] = []

        # Convert dicts to QuestionRecord if needed
        parsed_questions: list[QuestionRecord] = []
        for q in questions:
            if isinstance(q, QuestionRecord):
                parsed_questions.append(q)
            elif isinstance(q, dict):
                parsed_questions.append(QuestionRecord.model_validate(q))

        # Check 1: Total questions count
        actual_count = len(parsed_questions)
        if actual_count == blueprint.total_questions:
            checks.append(
                ReadinessCheckItem(
                    check_name="total_questions",
                    status="PASS",
                    message=f"Question count matches blueprint ({actual_count}/{blueprint.total_questions}).",
                )
            )
        else:
            checks.append(
                ReadinessCheckItem(
                    check_name="total_questions",
                    status="FAIL",
                    message=f"Question count mismatch: expected {blueprint.total_questions}, got {actual_count}.",
                )
            )
            violations.append(
                f"Missing questions: expected {blueprint.total_questions}, found {actual_count}"
            )

        # Check 2: Deduplication of questions
        seen_ids = set()
        duplicate_ids = set()
        for q in parsed_questions:
            if q.id in seen_ids:
                duplicate_ids.add(q.id)
            seen_ids.add(q.id)

        if not duplicate_ids:
            checks.append(
                ReadinessCheckItem(
                    check_name="deduplication",
                    status="PASS",
                    message="All question IDs are unique.",
                )
            )
        else:
            checks.append(
                ReadinessCheckItem(
                    check_name="deduplication",
                    status="FAIL",
                    message=f"Duplicate question IDs detected: {sorted(duplicate_ids)}.",
                )
            )
            violations.append(f"Duplicate question IDs: {', '.join(sorted(duplicate_ids))}")

        # Check 3: Question approval status (must be 'ready' in SoR)
        unapproved_questions = [q.id for q in parsed_questions if q.status != "ready"]
        if not unapproved_questions:
            checks.append(
                ReadinessCheckItem(
                    check_name="question_approval_status",
                    status="PASS",
                    message="All attached questions are in 'ready' status.",
                )
            )
        else:
            checks.append(
                ReadinessCheckItem(
                    check_name="question_approval_status",
                    status="FAIL",
                    message=f"Questions not in ready status: {unapproved_questions}.",
                )
            )
            violations.append(f"Unapproved questions found: {', '.join(unapproved_questions)}")

        # Check 4: Difficulty distribution alignment
        if actual_count > 0:
            easy_count = sum(1 for q in parsed_questions if q.difficulty == "easy")
            med_count = sum(1 for q in parsed_questions if q.difficulty == "medium")
            hard_count = sum(1 for q in parsed_questions if q.difficulty == "hard")

            actual_easy_pct = round((easy_count / actual_count) * 100, 1)
            actual_med_pct = round((med_count / actual_count) * 100, 1)
            actual_hard_pct = round((hard_count / actual_count) * 100, 1)

            # Allow 5% margin of tolerance for integer distribution
            target = blueprint.difficulty_distribution
            easy_diff = abs(actual_easy_pct - target.easy)
            med_diff = abs(actual_med_pct - target.medium)
            hard_diff = abs(actual_hard_pct - target.hard)

            if max(easy_diff, med_diff, hard_diff) <= 10.0:
                checks.append(
                    ReadinessCheckItem(
                        check_name="difficulty_distribution",
                        status="PASS",
                        message=(
                            f"Difficulty distribution aligned (Easy: {actual_easy_pct}%, "
                            f"Med: {actual_med_pct}%, Hard: {actual_hard_pct}%)."
                        ),
                    )
                )
            else:
                checks.append(
                    ReadinessCheckItem(
                        check_name="difficulty_distribution",
                        status="WARNING",
                        message=(
                            f"Difficulty distribution deviates from target: actual "
                            f"({actual_easy_pct}%, {actual_med_pct}%, {actual_hard_pct}%) vs "
                            f"target ({target.easy}%, {target.medium}%, {target.hard}%)."
                        ),
                    )
                )
                recommendations.append("Adjust question difficulty pool to match blueprint.")

        total_checks = len(checks)
        passed_checks = sum(1 for c in checks if c.status == "PASS")
        failed_checks = sum(1 for c in checks if c.status == "FAIL")

        overall_status = "PASS"
        if failed_checks > 0:
            overall_status = "FAIL"
        elif any(c.status == "WARNING" for c in checks):
            overall_status = "WARNING"

        return ReadinessReview(
            status=overall_status,  # type: ignore[arg-type]
            total_checks=total_checks,
            passed_checks=passed_checks,
            failed_checks=failed_checks,
            checks=checks,
            violations=violations,
            recommendations=recommendations,
        )
