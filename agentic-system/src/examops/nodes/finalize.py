"""Node 6: Finalize structured result and update terminal state."""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from typing import Any, Literal

from examops.schemas import (
    ActorContext,
    ApprovalProposal,
    ExamBlueprint,
    FinalResult,
    ReadinessReview,
    VerificationResult,
)
from examops.state import AgentState
from examops.telemetry import record_audit_event

logger = logging.getLogger(__name__)


def node_finalize(state: AgentState) -> dict[str, Any]:
    """Node 6: Finalize structured result and update terminal state."""
    task_id = state.get("task_id", "task-unknown")
    thread_id = state.get("thread_id", "thread-unknown")
    actor = ActorContext.model_validate(state.get("actor_context", {}))
    verif_dict = state.get("verification")
    approval_status = state.get("approval_status", "NONE")
    skill_output = state.get("skill_output") or {}
    proposal_dict = state.get("approval_proposal")

    bp = (
        ExamBlueprint.model_validate(skill_output["blueprint"])
        if "blueprint" in skill_output
        else None
    )
    review = (
        ReadinessReview.model_validate(skill_output["readiness_review"])
        if "readiness_review" in skill_output
        else None
    )
    proposal = ApprovalProposal.model_validate(proposal_dict) if proposal_dict else None
    verif = VerificationResult.model_validate(verif_dict) if verif_dict else None

    # Determine terminal status
    status: Literal["COMPLETED", "FAILED", "REJECTED", "WAITING_FOR_APPROVAL"] = "COMPLETED"
    if approval_status == "WAITING":
        status = "WAITING_FOR_APPROVAL"
    elif approval_status == "REJECTED":
        status = "REJECTED"
    elif verif and not verif.is_valid:
        status = "FAILED"

    summary = f"Task '{task_id}' terminated with status {status}."
    final_result = FinalResult(
        task_id=task_id,
        thread_id=thread_id,
        status=status,
        summary=summary,
        blueprint=bp,
        readiness_review=review,
        approval_proposal=proposal,
        verification=verif,
        errors=state.get("errors", []),
    )

    record_audit_event(
        "TASK_TERMINATED",
        task_id,
        thread_id,
        actor.actor_id,
        {"status": status},
    )

    return {
        "current_step": "finalize",
        "final_result": final_result.model_dump(),
        "updated_at": datetime.now(UTC).isoformat(),
    }
