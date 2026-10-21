"""Unit tests for RBAC and permission checking."""

from examops.permissions import (
    check_actor_permission,
    is_action_requiring_approval,
)
from examops.schemas import ActorContext


def test_admin_has_all_permissions() -> None:
    admin = ActorContext(actor_id="adm", actor_role="admin")
    assert check_actor_permission(admin, "design_blueprint") is True
    assert check_actor_permission(admin, "review_readiness") is True
    assert check_actor_permission(admin, "publish_session") is True


def test_teacher_permissions() -> None:
    teacher = ActorContext(actor_id="t1", actor_role="teacher")
    assert check_actor_permission(teacher, "design_blueprint") is True
    assert check_actor_permission(teacher, "review_readiness") is True
    # Student action not default for teacher unless granted
    assert check_actor_permission(teacher, "view_assigned_sessions") is False


def test_student_restricted() -> None:
    student = ActorContext(actor_id="s1", actor_role="student")
    assert check_actor_permission(student, "view_assigned_sessions") is True
    assert check_actor_permission(student, "design_blueprint") is False
    assert check_actor_permission(student, "publish_session") is False


def test_actions_requiring_approval() -> None:
    assert is_action_requiring_approval("publish_session") is True
    assert is_action_requiring_approval("delete_session") is True
    assert is_action_requiring_approval("design_blueprint") is False
