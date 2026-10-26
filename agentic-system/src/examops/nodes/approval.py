"""Node 5a & 5b: Proposal Preparation & Human-in-the-Loop Interrupt Gate."""

from __future__ import annotations

import hashlib
import json
import logging
from typing import Any

from langgraph.types import interrupt

from examops.schemas import ActorContext, ApprovalProposal
from examops.state import AgentState
from examops.telemetry import record_audit_event

logger = logging.getLogger(__name__)


def node_prepare_approval(state: AgentState) -> dict[str, Any]:
    """Node 5a: Prepare approval proposal and save into state."""
    task_id = state.get("task_id", "task-unknown")
    thread_id = state.get("thread_id", "thread-unknown")
    actor = ActorContext.model_validate(state.get("actor_context", {}))
    goal = state.get("goal") or {}
    action = goal.get("intent", "write_operation")
    args = state.get("constraints", {})

    serialized_args = json.dumps(args, sort_keys=True)
    proposal_hash = hashlib.sha256(serialized_args.encode()).hexdigest()

    proposal = ApprovalProposal(
        action=action,
        arguments=args,
        proposal_hash=proposal_hash,
        proposed_by=actor.actor_id,
        reason=f"Action '{action}' requires explicit approval before execution.",
    )

    record_audit_event(
        "APPROVAL_REQUESTED",
        task_id,
        thread_id,
        actor.actor_id,
        {"proposal_hash": proposal_hash, "action": action},
    )

    return {
        "current_step": "prepare_approval",
        "approval_status": "WAITING",
        "approval_proposal": proposal.model_dump(),
    }


def node_human_review(state: AgentState) -> dict[str, Any]:
    """Node 5b: Human-in-the-Loop Interrupt Gate."""
    task_id = state.get("task_id", "task-unknown")
    thread_id = state.get("thread_id", "thread-unknown")
    actor = ActorContext.model_validate(state.get("actor_context", {}))
    proposal_dict = state.get("approval_proposal") or {}

    # Trigger interrupt with proposal payload
    decision_data = interrupt({"proposal": proposal_dict})

    # Resumed: decision_data receives the payload passed in Command(resume=...)
    decision = "reject"
    if isinstance(decision_data, dict):
        decision = decision_data.get("decision", "reject")
    elif isinstance(decision_data, str):
        decision = decision_data

    approval_status = "APPROVED" if decision.lower() == "approve" else "REJECTED"
    event_type = "APPROVAL_GRANTED" if approval_status == "APPROVED" else "APPROVAL_REJECTED"

    record_audit_event(
        event_type,  # type: ignore[arg-type]
        task_id,
        thread_id,
        actor.actor_id,
        {"decision": decision, "proposal_hash": proposal_dict.get("proposal_hash", "")},
    )

    return {
        "current_step": "human_review",
        "approval_status": approval_status,
    }
