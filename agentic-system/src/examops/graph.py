"""LangGraph 6-node state graph implementing the deterministic ExamOps Agent Loop."""

from __future__ import annotations

import logging
from typing import Any

from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph

from examops.model import ModelProvider, get_model_provider
from examops.nodes import (
    node_execute,
    node_finalize,
    node_human_review,
    node_intake,
    node_plan,
    node_prepare_approval,
    node_verify,
    route_after_intake,
    route_after_verify,
)
from examops.persistence import get_checkpointer
from examops.platform_client import ExamPlatformClient
from examops.state import AgentState
from examops.tools import get_tool_registry

logger = logging.getLogger(__name__)

# Re-export node functions and routers for full backward compatibility
__all__ = [
    "create_examops_graph",
    "node_intake",
    "route_after_intake",
    "node_plan",
    "node_execute",
    "node_verify",
    "route_after_verify",
    "node_prepare_approval",
    "node_human_review",
    "node_finalize",
]


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
