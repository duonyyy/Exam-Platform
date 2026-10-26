"""Node 1: Intake & Goal Extraction with Actor Role Validation."""

from __future__ import annotations

import logging
from typing import Any

from examops.model import ModelProvider
from examops.schemas import ActorContext, AgentGoal
from examops.state import AgentState
from examops.telemetry import record_audit_event
from examops.verification import verify_actor_and_intent

logger = logging.getLogger(__name__)


def node_intake(
    state: AgentState,
    *,
    model: ModelProvider,
) -> dict[str, Any]:
    """Node 1: Intake & Goal Extraction with Actor Role Validation."""
    task_id = state.get("task_id", "task-unknown")
    thread_id = state.get("thread_id", "thread-unknown")
    raw_actor = state.get("actor_context", {})
    actor = ActorContext.model_validate(raw_actor)

    record_audit_event(
        "TASK_STARTED",
        task_id,
        thread_id,
        actor.actor_id,
        {"raw_input": state.get("raw_input", "")},
    )

    # Validate intent extraction
    raw_prompt = state.get("raw_input", "")
    goal_obj: AgentGoal = model.generate_structured(raw_prompt, AgentGoal)
    # Ensure actor context matches request
    goal_obj.actor = actor
    if state.get("subject"):
        goal_obj.subject = state["subject"]
    if state.get("constraints"):
        goal_obj.constraints.update(state["constraints"])

    # Verify actor permissions for intent
    auth_verif = verify_actor_and_intent(actor, goal_obj.intent)
    if not auth_verif.is_valid:
        return {
            "current_step": "intake",
            "goal": goal_obj.model_dump(),
            "intent": goal_obj.intent,
            "verification": auth_verif.model_dump(),
            "errors": auth_verif.checks_failed,
        }

    record_audit_event(
        "GOAL_INTAKE_PASSED",
        task_id,
        thread_id,
        actor.actor_id,
        {"intent": goal_obj.intent, "requires_write": goal_obj.requires_write},
    )

    return {
        "current_step": "intake",
        "goal": goal_obj.model_dump(),
        "intent": goal_obj.intent,
        "subject": goal_obj.subject,
        "constraints": goal_obj.constraints,
        "verification": auth_verif.model_dump(),
    }


def route_after_intake(state: AgentState) -> str:
    verif = state.get("verification")
    if verif and not verif.get("is_valid", False):
        return "finalize"
    return "plan"
