"""Unit tests for tool registry and safe contracts."""

import pytest

from examops.platform_client import ExamPlatformClient
from examops.schemas import ActorContext
from examops.tools import ToolExecutionError, get_tool_registry


def test_tool_registry_default_tools() -> None:
    registry = get_tool_registry()
    subject_tool = registry.get("list_subjects")
    assert subject_tool.contract.name == "list_subjects"
    assert subject_tool.contract.required_permission == "list_subjects"


def test_tool_execution_authorized(mock_platform_client: ExamPlatformClient) -> None:
    registry = get_tool_registry()
    actor = ActorContext(
        actor_id="t1",
        actor_role="teacher",
        permissions=["list_subjects"],
    )
    res = registry.get("list_subjects").run({}, actor, mock_platform_client)
    assert res.get("source") == "MOCK"
    assert "data" in res


def test_tool_execution_unauthorized_raises(mock_platform_client: ExamPlatformClient) -> None:
    registry = get_tool_registry()
    # Student has no list_subjects permission
    actor = ActorContext(actor_id="s1", actor_role="student", permissions=[])
    with pytest.raises(ToolExecutionError) as exc_info:
        registry.get("list_subjects").run({}, actor, mock_platform_client)
    assert "lacks permission" in str(exc_info.value)
