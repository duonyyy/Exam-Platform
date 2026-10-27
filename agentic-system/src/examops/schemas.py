"""Pydantic schemas and typed data contracts for ExamOps Agent."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, model_validator


class ActorContext(BaseModel):
    """Caller identity and role context (untrusted until verified)."""

    actor_id: str
    actor_role: Literal["admin", "teacher", "student"]
    permissions: list[str] = Field(default_factory=list)


class ExamDifficultyDistribution(BaseModel):
    """Percentage distribution of question difficulties."""

    easy: float = Field(..., ge=0.0, le=100.0, description="Easy percentage")
    medium: float = Field(..., ge=0.0, le=100.0, description="Medium percentage")
    hard: float = Field(..., ge=0.0, le=100.0, description="Hard percentage")

    @model_validator(mode="after")
    def validate_sum_100(self) -> ExamDifficultyDistribution:
        total = round(self.easy + self.medium + self.hard, 2)
        if abs(total - 100.0) > 0.01:
            raise ValueError(f"Difficulty percentages must sum to 100.0, got {total}")
        return self


class TopicDistributionItem(BaseModel):
    """Number of questions required per topic."""

    topic_id: str
    topic_name: str
    question_count: int = Field(..., gt=0)


class ExamBlueprint(BaseModel):
    """Structured design of an exam blueprint."""

    title: str
    subject_id: str
    duration_minutes: int = Field(..., gt=0, description="Duration in minutes")
    total_questions: int = Field(..., gt=0, description="Number of questions")
    total_points: float = Field(..., gt=0.0, description="Total points")
    passing_score: float = Field(..., ge=0.0, description="Passing score threshold")
    difficulty_distribution: ExamDifficultyDistribution
    topic_distribution: list[TopicDistributionItem] = Field(default_factory=list)


class QuestionRecord(BaseModel):
    """Question item representation in SoR or mock bank."""

    id: str
    topic_id: str
    type: Literal["single_choice", "multiple_choice", "true_false", "fill_in_the_blank"]
    status: Literal["draft", "ready", "disabled"]
    difficulty: Literal["easy", "medium", "hard"]
    points: float = Field(default=1.0, gt=0.0)
    title: str


class ReadinessCheckItem(BaseModel):
    """Individual verification check result."""

    check_name: str
    status: Literal["PASS", "FAIL", "WARNING"]
    message: str


class ReadinessReview(BaseModel):
    """Overall exam readiness evaluation report."""

    status: Literal["PASS", "FAIL", "WARNING"]
    total_checks: int
    passed_checks: int
    failed_checks: int
    checks: list[ReadinessCheckItem] = Field(default_factory=list)
    violations: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)


class AgentGoal(BaseModel):
    """Parsed structured goal from intake."""

    actor: ActorContext
    intent: Literal["design_blueprint", "review_readiness", "publish_session", "unknown"]
    subject: str
    constraints: dict[str, Any] = Field(default_factory=dict)
    requested_action: str
    requires_write: bool = False
    requires_approval: bool = False


class AgentPlan(BaseModel):
    """Execution plan determined by reasoning."""

    skill_name: Literal["exam-blueprint", "exam-readiness-review", "unsupported"]
    permitted_tools: list[str] = Field(default_factory=list)
    steps: list[str] = Field(default_factory=list)


class ApprovalProposal(BaseModel):
    """Immutable write proposal waiting for human approval."""

    action: str
    arguments: dict[str, Any]
    proposal_hash: str
    proposed_by: str
    reason: str


class VerificationResult(BaseModel):
    """Deterministic mathematical and schema verification result."""

    is_valid: bool
    checks_passed: list[str] = Field(default_factory=list)
    checks_failed: list[str] = Field(default_factory=list)
    is_terminal: bool = False


class FinalResult(BaseModel):
    """Structured terminal output of the agent loop."""

    task_id: str
    thread_id: str
    status: Literal["COMPLETED", "FAILED", "REJECTED", "WAITING_FOR_APPROVAL"]
    summary: str
    blueprint: ExamBlueprint | None = None
    readiness_review: ReadinessReview | None = None
    approval_proposal: ApprovalProposal | None = None
    verification: VerificationResult | None = None
    errors: list[str] = Field(default_factory=list)


# ── API Request / Response Schemas ───────────────────────────


class TaskCreateRequest(BaseModel):
    """Payload to submit a new agent task."""

    goal: str = Field(..., min_length=3, description="Natural language goal or prompt")
    actor: ActorContext
    subject: str = Field(..., description="Subject code or name")
    constraints: dict[str, Any] = Field(default_factory=dict)
    thread_id: str | None = Field(default=None, description="Optional thread/correlation ID")


class TaskResumeRequest(BaseModel):
    """Payload to resume an interrupted task waiting for approval."""

    decision: Literal["approve", "reject"]
    actor: ActorContext
    reason: str | None = None


class TaskResponse(BaseModel):
    """Standardized API response for task state."""

    task_id: str
    thread_id: str
    status: str
    summary: str
    result: dict[str, Any] | None = None
    proposal: ApprovalProposal | None = None
    errors: list[str] = Field(default_factory=list)


class HealthResponse(BaseModel):
    """Health check response schema."""

    status: str
    version: str
    environment: str
    model_provider: str


class GeneratedQuestionOption(BaseModel):
    id: str
    content: str


class GeneratedQuestionItem(BaseModel):
    question_text: str = Field(..., description="Nội dung câu hỏi")
    question_type: Literal["single_choice", "multiple_choice", "true_false", "short_answer"] = Field(
        default="single_choice"
    )
    difficulty: Literal["easy", "medium", "hard"] = Field(default="medium")
    options: list[GeneratedQuestionOption] = Field(
        default_factory=list, description="Danh sách các phương án lựa chọn"
    )
    correct_answer: str | list[str] = Field(..., description="ID phương án đúng hoặc chuỗi đáp án")
    explanation: str = Field(default="", description="Giải thích lý do đáp án đúng")


class GeneratedQuestionsProposal(BaseModel):
    topic_name: str
    subject_name: str = ""
    questions: list[GeneratedQuestionItem] = Field(default_factory=list)


class GenerateQuestionsRequest(BaseModel):
    topic_name: str
    subject_name: str = ""
    count: int = Field(default=5, ge=1, le=20)
    difficulty: Literal["easy", "medium", "hard", "mixed"] = Field(default="mixed")
    question_types: list[Literal["single_choice", "multiple_choice", "true_false", "short_answer"]] = Field(
        default_factory=lambda: ["single_choice", "multiple_choice", "true_false", "short_answer"]
    )
