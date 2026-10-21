"""FastAPI Application entrypoint and REST endpoints for ExamOps Agent."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from fastapi import Depends, FastAPI, Header, HTTPException, status
from langgraph.types import Command

from examops import __version__
from examops.config import Settings, get_settings
from examops.graph import create_examops_graph
from examops.schemas import (
    ApprovalProposal,
    HealthResponse,
    TaskCreateRequest,
    TaskResponse,
    TaskResumeRequest,
)
from examops.telemetry import setup_telemetry

app = FastAPI(
    title="ExamOps Agent API",
    description="Intelligent Orchestration Service for Exam Platform",
    version=__version__,
)

# Initialize telemetry and compiled graph at startup
settings = get_settings()
setup_telemetry(settings)
agent_graph = create_examops_graph()


def verify_api_key(
    x_api_key: str = Header(..., description="Service API Key header"),
    cfg: Settings = Depends(get_settings),
) -> str:
    """Verify service-level authentication via X-API-Key."""
    if x_api_key != cfg.api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing X-API-Key",
        )
    return x_api_key


@app.get("/health", response_model=HealthResponse)
def health_check(cfg: Settings = Depends(get_settings)) -> HealthResponse:
    """Health check endpoint exposing runtime configuration status."""
    return HealthResponse(
        status="healthy",
        version=__version__,
        environment=cfg.app_env,
        model_provider=cfg.model_provider,
    )


@app.post("/api/v1/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreateRequest,
    _auth: str = Depends(verify_api_key),
) -> TaskResponse:
    """Intake a new orchestration task, execute workflow, or pause for approval."""
    task_id = f"task_{uuid.uuid4().hex[:12]}"
    thread_id = payload.thread_id or f"thread_{uuid.uuid4().hex[:12]}"

    initial_state = {
        "task_id": task_id,
        "thread_id": thread_id,
        "actor_context": payload.actor.model_dump(),
        "raw_input": payload.goal,
        "subject": payload.subject,
        "constraints": payload.constraints,
        "current_step": "intake",
        "retry_count": 0,
        "errors": [],
        "created_at": datetime.now(UTC).isoformat(),
    }

    config = {"configurable": {"thread_id": thread_id}}

    try:
        agent_graph.invoke(initial_state, config=config)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Workflow execution failed: {exc}",
        ) from exc

    current_state = agent_graph.get_state(config)
    values = current_state.values

    # Check if workflow is interrupted waiting for human approval
    if current_state.next:
        proposal_dict = values.get("approval_proposal")
        proposal = ApprovalProposal.model_validate(proposal_dict) if proposal_dict else None
        return TaskResponse(
            task_id=task_id,
            thread_id=thread_id,
            status="WAITING_FOR_APPROVAL",
            summary="Workflow paused at Human Review Gate waiting for approval.",
            result=values.get("skill_output"),
            proposal=proposal,
            errors=values.get("errors", []),
        )

    final_result = values.get("final_result", {})
    return TaskResponse(
        task_id=task_id,
        thread_id=thread_id,
        status=final_result.get("status", "COMPLETED"),
        summary=final_result.get("summary", "Workflow completed."),
        result=values.get("skill_output"),
        proposal=None,
        errors=final_result.get("errors", []),
    )


@app.get("/api/v1/tasks/{thread_id}", response_model=TaskResponse)
def get_task(
    thread_id: str,
    _auth: str = Depends(verify_api_key),
) -> TaskResponse:
    """Fetch task state and approval status by thread_id."""
    config = {"configurable": {"thread_id": thread_id}}
    state_snapshot = agent_graph.get_state(config)

    if not state_snapshot.values:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with thread_id '{thread_id}' not found.",
        )

    values = state_snapshot.values
    task_id = values.get("task_id", thread_id)

    if state_snapshot.next:
        proposal_dict = values.get("approval_proposal")
        proposal = ApprovalProposal.model_validate(proposal_dict) if proposal_dict else None
        return TaskResponse(
            task_id=task_id,
            thread_id=thread_id,
            status="WAITING_FOR_APPROVAL",
            summary="Workflow paused at Human Review Gate waiting for approval.",
            result=values.get("skill_output"),
            proposal=proposal,
            errors=values.get("errors", []),
        )

    final_result = values.get("final_result", {})
    return TaskResponse(
        task_id=task_id,
        thread_id=thread_id,
        status=final_result.get("status", "COMPLETED"),
        summary=final_result.get("summary", "Task finished."),
        result=values.get("skill_output"),
        proposal=None,
        errors=final_result.get("errors", []),
    )


@app.post("/api/v1/tasks/{thread_id}/resume", response_model=TaskResponse)
def resume_task(
    thread_id: str,
    payload: TaskResumeRequest,
    _auth: str = Depends(verify_api_key),
) -> TaskResponse:
    """Resume an interrupted task with an approval decision (approve/reject)."""
    config = {"configurable": {"thread_id": thread_id}}
    state_snapshot = agent_graph.get_state(config)

    if not state_snapshot.values:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with thread_id '{thread_id}' not found.",
        )

    if not state_snapshot.next:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Task is not waiting for approval; cannot resume.",
        )

    # Actor authorization check: must be teacher or admin to approve/reject
    if payload.actor.actor_role not in ("admin", "teacher"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Teacher or Admin can submit approval decisions.",
        )

    try:
        agent_graph.invoke(
            Command(resume={"decision": payload.decision, "actor_id": payload.actor.actor_id}),
            config=config,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to resume task: {exc}",
        ) from exc

    updated_state = agent_graph.get_state(config)
    values = updated_state.values
    final_result = values.get("final_result", {})

    return TaskResponse(
        task_id=values.get("task_id", thread_id),
        thread_id=thread_id,
        status=final_result.get("status", "COMPLETED"),
        summary=final_result.get("summary", "Workflow completed after decision."),
        result=values.get("skill_output"),
        proposal=None,
        errors=final_result.get("errors", []),
    )
