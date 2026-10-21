"""Integration tests for the LangGraph 6-node state graph."""

import sqlite3

from langgraph.checkpoint.sqlite import SqliteSaver

from examops.graph import create_examops_graph
from examops.model import MockModelProvider
from examops.platform_client import ExamPlatformClient


def test_full_graph_blueprint_flow() -> None:
    # Use isolated in-memory checkpointer
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    saver = SqliteSaver(conn)

    model = MockModelProvider()
    client = ExamPlatformClient()

    graph = create_examops_graph(checkpointer=saver, model=model, client=client)

    thread_id = "test_thread_01"
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = {
        "task_id": "task_bp_01",
        "thread_id": thread_id,
        "actor_context": {
            "actor_id": "teacher_01",
            "actor_role": "teacher",
            "permissions": ["design_blueprint"],
        },
        "raw_input": "Soạn blueprint đề thi môn CS101 40 câu 60 phút",
        "subject": "CS101",
        "constraints": {"duration_minutes": 60, "total_questions": 40},
        "retry_count": 0,
        "errors": [],
    }

    graph.invoke(initial_state, config=config)

    state_snapshot = graph.get_state(config)
    values = state_snapshot.values

    assert values.get("current_step") == "finalize"
    final_result = values.get("final_result", {})
    assert final_result.get("status") == "COMPLETED"
    assert "blueprint" in values.get("skill_output", {})


def test_full_graph_unauthorized_actor_flow() -> None:
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    saver = SqliteSaver(conn)

    graph = create_examops_graph(checkpointer=saver)

    thread_id = "test_thread_unauth"
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = {
        "task_id": "task_unauth_01",
        "thread_id": thread_id,
        "actor_context": {
            "actor_id": "student_01",
            "actor_role": "student",
            "permissions": [],
        },
        "raw_input": "Tạo đề thi mới",
        "subject": "CS101",
        "constraints": {},
        "retry_count": 0,
        "errors": [],
    }

    graph.invoke(initial_state, config=config)

    state_snapshot = graph.get_state(config)
    values = state_snapshot.values
    final_result = values.get("final_result", {})
    assert final_result.get("status") == "FAILED"
    assert len(final_result.get("errors", [])) > 0
