"""LangGraph 6-node state graph implementing the deterministic ExamOps Agent Loop."""

from __future__ import annotations

import hashlib
import json
import logging
from datetime import UTC, datetime
from typing import Any, Literal

from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import interrupt

from examops.config import get_settings
from examops.model import ModelProvider, get_model_provider
from examops.persistence import get_checkpointer
from examops.platform_client import ExamPlatformClient
from examops.schemas import (
    ActorContext,
    AgentGoal,
    AgentPlan,
    ApprovalProposal,
    ExamBlueprint,
    FinalResult,
    ReadinessReview,
    VerificationResult,
)
from examops.skills import ExamBlueprintSkill, ExamReadinessReviewSkill
from examops.state import AgentState
from examops.telemetry import record_audit_event
from examops.tools import ToolRegistry, get_tool_registry
from examops.verification import (
    verify_actor_and_intent,
    verify_blueprint,
    verify_readiness_review,
)

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


def node_execute(
    state: AgentState,
    *,
    model: ModelProvider,
    client: ExamPlatformClient,
) -> dict[str, Any]:
    """Node 3: Execute Domain Skill or Read Tool."""
    task_id = state.get("task_id", "task-unknown")
    thread_id = state.get("thread_id", "thread-unknown")
    actor = ActorContext.model_validate(state.get("actor_context", {}))
    plan = state.get("plan") or {}
    skill_name = plan.get("skill_name")
    subject = state.get("subject", "CS101")
    constraints = state.get("constraints", {})

    output: dict[str, Any] = {}
    if skill_name == "exam-blueprint":
        skill = ExamBlueprintSkill()
        bp = skill.execute(subject_id=subject, constraints=constraints, model=model)
        output = {"blueprint": bp.model_dump()}
    elif skill_name == "exam-readiness-review":
        exam_id = constraints.get("exam_id", "EXAM-101")
        exam_data = client.get_exam(exam_id).get("data", {})
        bp_dict = {
            "title": exam_data.get("title", "Exam"),
            "subject_id": exam_data.get("subject_id", subject),
            "duration_minutes": exam_data.get("duration_minutes", 60),
            "total_questions": exam_data.get("total_questions", 40),
            "total_points": 10.0,
            "passing_score": exam_data.get("passing_score", 5.0),
            "difficulty_distribution": {"easy": 40.0, "medium": 40.0, "hard": 20.0},
        }
        bp = ExamBlueprint.model_validate(bp_dict)
        questions = exam_data.get("questions", [])
        review = ExamReadinessReviewSkill().execute(blueprint=bp, questions=questions)
        output = {"blueprint": bp.model_dump(), "readiness_review": review.model_dump()}

    record_audit_event(
        "SKILL_EXECUTED",
        task_id,
        thread_id,
        actor.actor_id,
        {"skill": skill_name or "unknown"},
    )

    return {
        "current_step": "execute",
        "skill_output": output,
    }


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


def create_examops_graph(
    checkpointer: BaseCheckpointSaver[Any] | None = None,
    model: ModelProvider | None = None,
    client: ExamPlatformClient | None = None,
) -> Any:
    """Build and compile the 6-node LangGraph StateGraph."""
    resolved_model = model or get_model_provider()
    resolved_client = client or ExamPlatformClient()
    tool_registry = get_tool_registry()

    builder = StateGraph(AgentState)

    builder.add_node("intake", lambda s: node_intake(s, model=resolved_model))
    builder.add_node(
        "plan",
        lambda s: node_plan(s, model=resolved_model, tool_registry=tool_registry),
    )
    builder.add_node(
        "execute",
        lambda s: node_execute(s, model=resolved_model, client=resolved_client),
    )
    builder.add_node("verify", node_verify)
    builder.add_node("prepare_approval", node_prepare_approval)
    builder.add_node("human_review", node_human_review)
    builder.add_node("finalize", node_finalize)

    builder.add_edge(START, "intake")
    builder.add_conditional_edges(
        "intake",
        route_after_intake,
        {"plan": "plan", "finalize": "finalize"},
    )
    builder.add_edge("plan", "execute")
    builder.add_edge("execute", "verify")
    builder.add_conditional_edges(
        "verify",
        route_after_verify,
        {
            "prepare_approval": "prepare_approval",
            "plan": "plan",
            "finalize": "finalize",
        },
    )
    builder.add_edge("prepare_approval", "human_review")
    builder.add_edge("human_review", "finalize")
    builder.add_edge("finalize", END)

    saver = checkpointer or get_checkpointer()
    return builder.compile(checkpointer=saver)
