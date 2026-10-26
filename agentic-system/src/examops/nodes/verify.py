"""Node 4: Deterministic Mathematical and Schema Verification."""

from __future__ import annotations

import logging
from typing import Any

from examops.config import get_settings
from examops.schemas import ActorContext, ExamBlueprint, ReadinessReview, VerificationResult
from examops.state import AgentState
from examops.telemetry import record_audit_event
from examops.verification import verify_blueprint, verify_readiness_review

logger = logging.getLogger(__name__)


def node_verify(state: AgentState) -> dict[str, Any]:
    """Node 4: Deterministic Mathematical and Schema Verification."""
    task_id = state.get("task_id", "task-unknown")
    thread_id = state.get("thread_id", "thread-unknown")
    actor = ActorContext.model_validate(state.get("actor_context", {}))
    skill_output = state.get("skill_output") or {}

    verification: VerificationResult
    if "blueprint" in skill_output:
        bp = ExamBlueprint.model_validate(skill_output["blueprint"])
        verification = verify_blueprint(bp)
    elif "readiness_review" in skill_output:
        review = ReadinessReview.model_validate(skill_output["readiness_review"])
        verification = verify_readiness_review(review)
    else:
        verification = VerificationResult(
            is_valid=False,
            checks_passed=[],
            checks_failed=["No skill output found to verify"],
            is_terminal=True,
        )

    retry_count = state.get("retry_count", 0)
    if not verification.is_valid:
        retry_count += 1
        record_audit_event(
            "VERIFICATION_FAILED",
            task_id,
            thread_id,
            actor.actor_id,
            {"failed_checks": verification.checks_failed, "retry_count": retry_count},
        )
    else:
        record_audit_event(
            "VERIFICATION_PASSED",
            task_id,
            thread_id,
            actor.actor_id,
            {"passed_checks": verification.checks_passed},
        )

    return {
        "current_step": "verify",
        "verification": verification.model_dump(),
        "retry_count": retry_count,
    }


def route_after_verify(state: AgentState) -> str:
    verif = state.get("verification")
    settings = get_settings()

    if verif and verif.get("is_valid", False):
        goal = state.get("goal") or {}
        approval_status = state.get("approval_status", "NONE")
        if goal.get("requires_write") and approval_status not in ("APPROVED", "REJECTED"):
            return "prepare_approval"
        return "finalize"

    # Verification failed
    retry_count = state.get("retry_count", 0)
    is_terminal = verif.get("is_terminal", False) if verif else True
    if retry_count < settings.max_retries and not is_terminal:
        return "plan"
    return "finalize"
