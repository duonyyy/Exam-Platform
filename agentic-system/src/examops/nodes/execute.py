"""Node 3: Execute Domain Skill or Read Tool."""

from __future__ import annotations

import logging
from typing import Any

from examops.model import ModelProvider
from examops.platform_client import ExamPlatformClient
from examops.schemas import ActorContext, ExamBlueprint
from examops.skills import ExamBlueprintSkill, ExamReadinessReviewSkill
from examops.state import AgentState
from examops.telemetry import record_audit_event

logger = logging.getLogger(__name__)


def node_execute(
    state: AgentState,
    *,
    model: ModelProvider,
    client: ExamPlatformClient,
) -> dict[str, Any]:
    """Node 3: Execute Domain Skill or Read Tool."""
    task_id = state.get("task_id", "task-unknown")
    thread_id = state.get("thread_id", "thread-unknown")
    actor = ActorContext.model_validate(state.get("actor_context", {}))
    plan = state.get("plan") or {}
    skill_name = plan.get("skill_name")
    subject = state.get("subject", "CS101")
    constraints = state.get("constraints", {})

    output: dict[str, Any] = {}
    if skill_name == "exam-blueprint":
        skill = ExamBlueprintSkill()
        bp = skill.execute(subject_id=subject, constraints=constraints, model=model)
        output = {"blueprint": bp.model_dump()}
    elif skill_name == "exam-readiness-review":
        exam_id = constraints.get("exam_id", "EXAM-101")
        exam_data = client.get_exam(exam_id).get("data", {})
        bp_dict = {
            "title": exam_data.get("title", "Exam"),
            "subject_id": exam_data.get("subject_id", subject),
            "duration_minutes": exam_data.get("duration_minutes", 60),
            "total_questions": exam_data.get("total_questions", 40),
            "total_points": 10.0,
            "passing_score": exam_data.get("passing_score", 5.0),
            "difficulty_distribution": {"easy": 40.0, "medium": 40.0, "hard": 20.0},
        }
        bp = ExamBlueprint.model_validate(bp_dict)
        questions = exam_data.get("questions", [])
        review = ExamReadinessReviewSkill().execute(blueprint=bp, questions=questions)
        output = {"blueprint": bp.model_dump(), "readiness_review": review.model_dump()}

    record_audit_event(
        "SKILL_EXECUTED",
        task_id,
        thread_id,
        actor.actor_id,
        {"skill": skill_name or "unknown"},
    )

    return {
        "current_step": "execute",
        "skill_output": output,
    }
