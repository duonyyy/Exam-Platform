"""State definition for the LangGraph agent workflow."""

from __future__ import annotations

from typing import Any, TypedDict


class AgentState(TypedDict, total=False):
    """Explicit 18+ field state container for ExamOps Agent.

    Strict separation between conversation messages and state data.
    Never persists tokens or correct answers.
    """

    task_id: str
    thread_id: str
    actor_context: dict[str, Any]
    raw_input: str
    goal: dict[str, Any] | None
    intent: str
    subject: str
    constraints: dict[str, Any]
    plan: dict[str, Any] | None
    current_step: str
    skill_output: dict[str, Any] | None
    tool_calls: list[dict[str, Any]]
    tool_results: list[dict[str, Any]]
    verification: dict[str, Any] | None
    approval_status: str  # "NONE" | "WAITING" | "APPROVED" | "REJECTED"
    approval_proposal: dict[str, Any] | None
    errors: list[str]
    retry_count: int
    final_result: dict[str, Any] | None
    created_at: str
    updated_at: str
