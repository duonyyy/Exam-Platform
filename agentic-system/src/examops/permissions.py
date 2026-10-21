"""Permission verification and Least-Privilege access control."""

from __future__ import annotations

from examops.schemas import ActorContext

# Allowed intentions per role
ROLE_PERMISSIONS: dict[str, set[str]] = {
    "admin": {
        "design_blueprint",
        "review_readiness",
        "publish_session",
        "list_subjects",
        "list_topics",
        "list_questions",
        "get_exam",
        "get_exam_session",
    },
    "teacher": {
        "design_blueprint",
        "review_readiness",
        "publish_session",
        "list_subjects",
        "list_topics",
        "list_questions",
        "get_exam",
        "get_exam_session",
    },
    "student": {
        "view_assigned_sessions",
    },
}

# Operations that always require human approval before any write execution
ACTIONS_REQUIRING_APPROVAL: set[str] = {
    "publish_session",
    "assign_students",
    "modify_exam",
    "delete_session",
    "create_exam",
}


def check_actor_permission(actor: ActorContext, action_or_intent: str) -> bool:
    """Verify if the caller's role is authorized to perform action/intent (Fail-closed)."""
    allowed = ROLE_PERMISSIONS.get(actor.actor_role, set())
    if action_or_intent in allowed:
        return True
    # Also check explicitly granted permissions in ActorContext
    return action_or_intent in actor.permissions


def is_action_requiring_approval(action: str) -> bool:
    """Check if action is a sensitive write operation requiring human approval."""
    return action in ACTIONS_REQUIRING_APPROVAL
