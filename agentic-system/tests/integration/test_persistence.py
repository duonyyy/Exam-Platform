"""Integration tests for state persistence and recovery across checkpoints."""

import sqlite3

from langgraph.checkpoint.sqlite import SqliteSaver

from examops.graph import create_examops_graph


def test_sqlite_saver_persists_across_invocations() -> None:
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    saver = SqliteSaver(conn)

    graph = create_examops_graph(checkpointer=saver)

    thread_id = "persistent_thread_100"
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = {
        "task_id": "task_persist_01",
        "thread_id": thread_id,
        "actor_context": {
            "actor_id": "teacher_01",
            "actor_role": "teacher",
            "permissions": ["design_blueprint"],
        },
        "raw_input": "Thiết kế blueprint môn CS101",
        "subject": "CS101",
        "constraints": {},
        "retry_count": 0,
        "errors": [],
    }

    graph.invoke(initial_state, config=config)

    # Re-fetch state directly from saver
    snapshot = graph.get_state(config)
    assert snapshot is not None
    assert snapshot.values.get("task_id") == "task_persist_01"
    assert snapshot.values.get("subject") == "CS101"
    assert "skill_output" in snapshot.values
