"""Multi-tier deterministic verification (Schema -> Permission -> Math -> Business rules)."""

from __future__ import annotations

from examops.permissions import check_actor_permission
from examops.schemas import (
    ActorContext,
    ExamBlueprint,
    ReadinessReview,
    VerificationResult,
)


def verify_actor_and_intent(actor: ActorContext, intent: str) -> VerificationResult:
    """Verify actor role and permissions."""
    passed: list[str] = []
    failed: list[str] = []

    if actor.actor_role not in ("admin", "teacher", "student"):
        failed.append(f"Invalid actor role '{actor.actor_role}'.")
        return VerificationResult(
            is_valid=False, checks_passed=passed, checks_failed=failed, is_terminal=True
        )
    passed.append(f"Valid actor role: {actor.actor_role}")

    if not check_actor_permission(actor, intent):
        failed.append(
            f"Actor '{actor.actor_id}' with role '{actor.actor_role}' lacks permission for intent '{intent}'."
        )
        return VerificationResult(
            is_valid=False, checks_passed=passed, checks_failed=failed, is_terminal=True
        )
    passed.append(f"Authorized for intent: {intent}")

    return VerificationResult(is_valid=True, checks_passed=passed, checks_failed=failed)


def verify_blueprint(blueprint: ExamBlueprint) -> VerificationResult:
    """Deterministic mathematical and schema verification of an ExamBlueprint."""
    passed: list[str] = []
    failed: list[str] = []

    # 1. Positive duration
    if blueprint.duration_minutes <= 0:
        failed.append("Exam duration must be greater than 0 minutes.")
    else:
        passed.append(f"Valid duration: {blueprint.duration_minutes}m")

    # 2. Positive question count
    if blueprint.total_questions <= 0:
        failed.append("Total questions must be greater than 0.")
    else:
        passed.append(f"Valid total questions: {blueprint.total_questions}")

    # 3. Positive points and valid passing score
    if blueprint.total_points <= 0:
        failed.append("Total points must be greater than 0.")
    elif blueprint.passing_score > blueprint.total_points:
        failed.append("Passing score cannot exceed total points.")
    else:
        passed.append(
            f"Valid score scale: passing {blueprint.passing_score}/{blueprint.total_points}"
        )

    # 4. Difficulty distribution sum
    dist = blueprint.difficulty_distribution
    total_pct = round(dist.easy + dist.medium + dist.hard, 2)
    if abs(total_pct - 100.0) > 0.01:
        failed.append(f"Difficulty percentages sum to {total_pct}%, must be exactly 100.0%.")
    else:
        passed.append("Difficulty percentages sum to 100.0%")

    is_valid = len(failed) == 0
    return VerificationResult(
        is_valid=is_valid,
        checks_passed=passed,
        checks_failed=failed,
        is_terminal=not is_valid and blueprint.total_questions <= 0,
    )


def verify_readiness_review(review: ReadinessReview) -> VerificationResult:
    """Validate ReadinessReview integrity."""
    passed: list[str] = []
    failed: list[str] = []

    if review.total_checks != len(review.checks):
        failed.append(
            f"Total checks count mismatch ({review.total_checks} vs {len(review.checks)})."
        )
    else:
        passed.append(f"Audit checks verified ({review.total_checks} checks)")

    if review.failed_checks > 0 and review.status == "PASS":
        failed.append("Readiness review cannot be marked PASS when there are failed checks.")
    else:
        passed.append("Status consistency verified")

    is_valid = len(failed) == 0
    return VerificationResult(
        is_valid=is_valid,
        checks_passed=passed,
        checks_failed=failed,
        is_terminal=False,
    )
