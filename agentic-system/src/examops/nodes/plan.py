"""Node 2: Plan Skill Selection & Allowlisted Tools."""

from __future__ import annotations

import logging
from typing import Any

from examops.model import ModelProvider
from examops.schemas import ActorContext, AgentPlan
from examops.state import AgentState
from examops.telemetry import record_audit_event
from examops.tools import ToolRegistry

logger = logging.getLogger(__name__)


def node_plan(
    state: AgentState,
    *,
    model: ModelProvider,
    tool_registry: ToolRegistry,
) -> dict[str, Any]:
    """Node 2: Plan Skill Selection & Allowlisted Tools."""
    task_id = state.get("task_id", "task-unknown")
    thread_id = state.get("thread_id", "thread-unknown")
    actor = ActorContext.model_validate(state.get("actor_context", {}))
    intent = state.get("intent", "")

    plan_obj: AgentPlan = model.generate_structured(f"Plan for intent {intent}", AgentPlan)
    # Restrict tools strictly to caller's allowlist
    authorized_tools = [t.name for t in tool_registry.list_available_for(actor)]
    filtered_tools = [t for t in plan_obj.permitted_tools if t in authorized_tools]
    plan_obj.permitted_tools = filtered_tools

    record_audit_event(
        "PLAN_CREATED",
        task_id,
        thread_id,
        actor.actor_id,
        {"skill": plan_obj.skill_name, "tools": plan_obj.permitted_tools},
    )

    return {
        "current_step": "plan",
        "plan": plan_obj.model_dump(),
    }
