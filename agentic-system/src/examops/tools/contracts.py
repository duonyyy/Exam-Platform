"""Tool contracts and error definitions."""

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
