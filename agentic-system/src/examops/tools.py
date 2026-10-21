"""Typed tool contracts and ToolRegistry with Least-Privilege enforcement."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from pydantic import BaseModel

from examops.permissions import check_actor_permission
from examops.platform_client import ExamPlatformClient
from examops.schemas import ActorContext


class ToolExecutionError(Exception):
    """Raised when tool execution fails."""


class ToolContract(BaseModel):
    """Immutable metadata and policy contract for an agent tool."""

    name: str
    description: str
    required_permission: str
    is_side_effect: bool = False
    requires_approval: bool = False


class RegisteredTool:
    """Executable wrapper for a ToolContract and its execution callable."""

    def __init__(
        self,
        contract: ToolContract,
        executor: Callable[[dict[str, Any], ExamPlatformClient], dict[str, Any]],
    ) -> None:
        self.contract = contract
        self.executor = executor

    def run(
        self,
        args: dict[str, Any],
        actor: ActorContext,
        client: ExamPlatformClient,
    ) -> dict[str, Any]:
        """Verify actor permissions before executing."""
        if not check_actor_permission(actor, self.contract.required_permission):
            raise ToolExecutionError(
                f"Actor '{actor.actor_id}' ({actor.actor_role}) lacks permission "
                f"'{self.contract.required_permission}' for tool '{self.contract.name}'."
            )
        return self.executor(args, client)


class ToolRegistry:
    """Registry maintaining available tools and enforcement policies."""

    def __init__(self) -> None:
        self._tools: dict[str, RegisteredTool] = {}
        self._register_default_tools()

    def register(
        self,
        contract: ToolContract,
        executor: Callable[[dict[str, Any], ExamPlatformClient], dict[str, Any]],
    ) -> None:
        self._tools[contract.name] = RegisteredTool(contract, executor)

    def get(self, name: str) -> RegisteredTool:
        if name not in self._tools:
            raise KeyError(f"Tool '{name}' is not registered.")
        return self._tools[name]

    def list_available_for(self, actor: ActorContext) -> list[ToolContract]:
        """Return list of tool contracts the actor is authorized to run."""
        return [
            tool.contract
            for tool in self._tools.values()
            if check_actor_permission(actor, tool.contract.required_permission)
        ]

    def _register_default_tools(self) -> None:
        # 1. list_subjects
        self.register(
            ToolContract(
                name="list_subjects",
                description="List all active subjects in the curriculum.",
                required_permission="list_subjects",
            ),
            lambda args, client: client.list_subjects(),
        )

        # 2. list_topics
        self.register(
            ToolContract(
                name="list_topics",
                description="List topics for a given subject_id.",
                required_permission="list_topics",
            ),
            lambda args, client: client.list_topics(args.get("subject_id", "")),
        )

        # 3. list_questions
        self.register(
            ToolContract(
                name="list_questions",
                description="List questions for a given topic_id.",
                required_permission="list_questions",
            ),
            lambda args, client: client.list_questions(args.get("topic_id", "")),
        )

        # 4. get_exam
        self.register(
            ToolContract(
                name="get_exam",
                description="Get exam blueprint metadata and attached questions by exam_id.",
                required_permission="get_exam",
            ),
            lambda args, client: client.get_exam(args.get("exam_id", "")),
        )

        # 5. get_exam_session
        self.register(
            ToolContract(
                name="get_exam_session",
                description="Get exam session details by session_id.",
                required_permission="get_exam_session",
            ),
            lambda args, client: client.get_exam_session(args.get("session_id", "")),
        )


_default_registry = ToolRegistry()


def get_tool_registry() -> ToolRegistry:
    return _default_registry
