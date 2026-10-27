"""Model provider protocol and multi-provider adapters (Mock, Gemini, OpenAI-compatible)."""

from __future__ import annotations

import json
import logging
from typing import Any, Protocol, TypeVar, runtime_checkable

import httpx
from pydantic import BaseModel

from examops.config import Settings, get_settings
from examops.schemas import (
    ActorContext,
    AgentGoal,
    AgentPlan,
    ExamBlueprint,
    ExamDifficultyDistribution,
    GeneratedQuestionItem,
    GeneratedQuestionOption,
    GeneratedQuestionsProposal,
    ReadinessCheckItem,
    ReadinessReview,
    TopicDistributionItem,
)

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


@runtime_checkable
class ModelProvider(Protocol):
    """Protocol for model providers to decouple graph logic from vendor APIs."""

    def generate_text(self, prompt: str, system_prompt: str | None = None) -> str:
        """Generate unstructured text response."""
        ...

    def generate_structured(
        self, prompt: str, schema: type[T], system_prompt: str | None = None
    ) -> T:
        """Generate structured response conforming to a Pydantic schema."""
        ...


class MockModelProvider:
    """Hermetic deterministic provider for offline development and test suites."""

    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()

    def generate_text(self, prompt: str, system_prompt: str | None = None) -> str:
        return f"[MOCK TEXT RESPONSE] {prompt[:50]}..."

    def generate_structured(
        self, prompt: str, schema: type[T], system_prompt: str | None = None
    ) -> T:
        prompt_lower = prompt.lower()

        if schema is AgentGoal:
            requires_write = any(w in prompt_lower for w in ["publish", "delete", "create", "gán", "lưu", "ghi", "tạo", "thêm"])
            requires_approval = requires_write
            intent = "design_blueprint"
            if (
                "readiness" in prompt_lower
                or "thẩm định" in prompt_lower
                or "kiểm tra" in prompt_lower
            ):
                intent = "review_readiness"
            elif "publish" in prompt_lower or "công bố" in prompt_lower:
                intent = "publish_session"

            mock_goal = AgentGoal(
                actor=ActorContext(actor_id="mock_user_1", actor_role="teacher", permissions=[]),
                intent=intent,  # type: ignore[arg-type]
                subject="CS101",
                constraints={},
                requested_action=prompt[:80],
                requires_write=requires_write,
                requires_approval=requires_approval,
            )
            return mock_goal  # type: ignore[return-value]

        if schema is AgentPlan:
            if "readiness" in prompt_lower or "thẩm định" in prompt_lower:
                plan = AgentPlan(
                    skill_name="exam-readiness-review",
                    permitted_tools=["get_exam", "list_questions"],
                    steps=["fetch_exam", "fetch_questions", "verify_readiness"],
                )
            else:
                plan = AgentPlan(
                    skill_name="exam-blueprint",
                    permitted_tools=["list_subjects", "list_topics"],
                    steps=["parse_constraints", "calculate_distribution", "format_blueprint"],
                )
            return plan  # type: ignore[return-value]

        if schema is ExamBlueprint:
            blueprint = ExamBlueprint(
                title="Mock Midterm Exam",
                subject_id="CS101",
                duration_minutes=60,
                total_questions=40,
                total_points=10.0,
                passing_score=5.0,
                difficulty_distribution=ExamDifficultyDistribution(
                    easy=40.0,
                    medium=40.0,
                    hard=20.0,
                ),
                topic_distribution=[
                    TopicDistributionItem(
                        topic_id="T01",
                        topic_name="Introduction",
                        question_count=10,
                    ),
                    TopicDistributionItem(
                        topic_id="T02",
                        topic_name="Control Flow",
                        question_count=30,
                    ),
                ],
            )
            return blueprint  # type: ignore[return-value]

        if schema is ReadinessReview:
            review = ReadinessReview(
                status="PASS",
                total_checks=4,
                passed_checks=4,
                failed_checks=0,
                checks=[
                    ReadinessCheckItem(
                        check_name="total_questions",
                        status="PASS",
                        message="Exam has exactly 40 questions.",
                    ),
                    ReadinessCheckItem(
                        check_name="approved_status",
                        status="PASS",
                        message="All questions are in ready status.",
                    ),
                    ReadinessCheckItem(
                        check_name="deduplication",
                        status="PASS",
                        message="No duplicate question IDs detected.",
                    ),
                    ReadinessCheckItem(
                        check_name="difficulty_distribution",
                        status="PASS",
                        message="Distribution matches blueprint targets.",
                    ),
                ],
                violations=[],
                recommendations=["Ready for session publishing."],
            )
            return review  # type: ignore[return-value]

        if schema is GeneratedQuestionsProposal:
            import re
            count_match = re.search(r"Generate (\d+) academic", prompt)
            requested_count = int(count_match.group(1)) if count_match else 5
            requested_count = max(1, min(requested_count, 10))

            topic_match = re.search(r"topic '([^']+)'", prompt)
            requested_topic = topic_match.group(1) if topic_match else "Kiến trúc RESTful API & HTTP Methods"

            subject_match = re.search(r"subject '([^']*)'", prompt)
            requested_subject = subject_match.group(1) if subject_match else "IT4409"

            pool = [
                GeneratedQuestionItem(
                    question_text=f"Trong kiến trúc RESTful API ({requested_topic}), phương thức HTTP nào có tính chất Idempotent và dùng để xóa tài nguyên?",
                    question_type="single_choice",
                    difficulty="easy",
                    options=[
                        GeneratedQuestionOption(id="opt_a", content="GET"),
                        GeneratedQuestionOption(id="opt_b", content="POST"),
                        GeneratedQuestionOption(id="opt_c", content="DELETE"),
                        GeneratedQuestionOption(id="opt_d", content="PATCH"),
                    ],
                    correct_answer="opt_c",
                    explanation="DELETE theo chuẩn RFC 7231 là một phương thức idempotent: gọi nhiều lần cho cùng một resource đều đem lại kết quả xóa tương đương trên server.",
                ),
                GeneratedQuestionItem(
                    question_text=f"Mã trạng thái HTTP 201 Created được trả về phù hợp nhất trong trường hợp nào khi thao tác với {requested_topic}?",
                    question_type="single_choice",
                    difficulty="easy",
                    options=[
                        GeneratedQuestionOption(id="opt_a", content="Tài nguyên mới được tạo thành công trên máy chủ"),
                        GeneratedQuestionOption(id="opt_b", content="Yêu cầu bị từ chối do thiếu token"),
                        GeneratedQuestionOption(id="opt_c", content="Máy chủ đang quá tải"),
                        GeneratedQuestionOption(id="opt_d", content="Dữ liệu không có thay đổi"),
                    ],
                    correct_answer="opt_a",
                    explanation="201 Created biểu thị tài nguyên mới đã được khởi tạo thành công trên máy chủ.",
                ),
                GeneratedQuestionItem(
                    question_text=f"Những phương thức HTTP nào sau đây là Idempotent theo đặc tả chuẩn RFC 7231 áp dụng trong {requested_topic}? (Chọn nhiều đáp án)",
                    question_type="multiple_choice",
                    difficulty="medium",
                    options=[
                        GeneratedQuestionOption(id="opt_a", content="GET"),
                        GeneratedQuestionOption(id="opt_b", content="PUT"),
                        GeneratedQuestionOption(id="opt_c", content="DELETE"),
                        GeneratedQuestionOption(id="opt_d", content="POST"),
                    ],
                    correct_answer=["opt_a", "opt_b", "opt_c"],
                    explanation="GET, PUT, DELETE là các phương thức idempotent. POST không phải idempotent vì mỗi lần gọi thường tạo ra một tài nguyên mới.",
                ),
                GeneratedQuestionItem(
                    question_text=f"Trong thiết kế {requested_topic}, việc sử dụng Pessimistic Locking (Khóa bi quan FOR UPDATE) giúp triệt tiêu hoàn toàn race condition trong lúc nộp bài.",
                    question_type="true_false",
                    difficulty="medium",
                    options=[
                        GeneratedQuestionOption(id="opt_a", content="Đúng"),
                        GeneratedQuestionOption(id="opt_b", content="Sai"),
                    ],
                    correct_answer="opt_a",
                    explanation="Pessimistic locking khóa trực tiếp dòng dữ liệu trong database transaction, ngăn các giao dịch đồng thời can thiệp vào tài nguyên.",
                ),
                GeneratedQuestionItem(
                    question_text=f"Lỗ hổng bảo mật phổ biến nhất trong OWASP API Security khi thiếu sót kiểm tra quyền truy cập tài nguyên của người dùng theo ID là gì?",
                    question_type="short_answer",
                    difficulty="hard",
                    options=[],
                    correct_answer="BOLA / IDOR",
                    explanation="BOLA (Broken Object Level Authorization) hay IDOR (Insecure Direct Object Reference) là lỗ hổng đứng đầu OWASP API Security.",
                ),
                GeneratedQuestionItem(
                    question_text=f"Chuẩn JWT (JSON Web Token) bao gồm 3 phần được phân tách bằng dấu chấm. Đó là những phần nào?",
                    question_type="single_choice",
                    difficulty="easy",
                    options=[
                        GeneratedQuestionOption(id="opt_a", content="Header, Payload, Signature"),
                        GeneratedQuestionOption(id="opt_b", content="Header, Body, Hash"),
                        GeneratedQuestionOption(id="opt_c", content="Secret, Data, Checksum"),
                        GeneratedQuestionOption(id="opt_d", content="Prefix, Content, Key"),
                    ],
                    correct_answer="opt_a",
                    explanation="Cấu trúc của JSON Web Token gồm Header (loại token và thuật toán ký), Payload (claims/dữ liệu), và Signature (chữ ký xác thực).",
                ),
                GeneratedQuestionItem(
                    question_text=f"Mã HTTP Status Code nào là phù hợp nhất để phản hồi lỗi cú pháp JSON payload từ client gửi lên?",
                    question_type="single_choice",
                    difficulty="medium",
                    options=[
                        GeneratedQuestionOption(id="opt_a", content="400 Bad Request"),
                        GeneratedQuestionOption(id="opt_b", content="401 Unauthorized"),
                        GeneratedQuestionOption(id="opt_c", content="403 Forbidden"),
                        GeneratedQuestionOption(id="opt_d", content="422 Unprocessable Content"),
                    ],
                    correct_answer="opt_a",
                    explanation="400 Bad Request được dùng khi máy chủ không thể hiểu yêu cầu do cú pháp bị hỏng (malformed request syntax/invalid JSON).",
                ),
            ]

            selected_questions = pool[:requested_count]
            proposal = GeneratedQuestionsProposal(
                topic_name=requested_topic,
                subject_name=requested_subject,
                questions=selected_questions,
            )
            return proposal  # type: ignore[return-value]

        # Generic fallback
        return schema.model_validate({})


class OpenAICompatibleProvider:
    """HTTP client adapter for any OpenAI-compatible API endpoint."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.client = httpx.Client(
            base_url=settings.model_base_url or "https://api.openai.com/v1",
            headers={"Authorization": f"Bearer {settings.model_api_key}"},
            timeout=30.0,
        )

    def generate_text(self, prompt: str, system_prompt: str | None = None) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = self.client.post(
            "/chat/completions",
            json={"model": self.settings.model_name, "messages": messages},
        )
        response.raise_for_status()
        data = response.json()
        return str(data["choices"][0]["message"]["content"])

    def generate_structured(
        self, prompt: str, schema: type[T], system_prompt: str | None = None
    ) -> T:
        schema_json = schema.model_json_schema()
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append(
            {
                "role": "user",
                "content": f"{prompt}\n\nRespond ONLY with JSON matching schema:\n{json.dumps(schema_json)}",
            }
        )

        response = self.client.post(
            "/chat/completions",
            json={
                "model": self.settings.model_name,
                "messages": messages,
                "response_format": {"type": "json_object"},
            },
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        data = json.loads(content)
        return schema.model_validate(data)


class GeminiProvider:
    """HTTP client adapter for Google Gemini API."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        base_url = (
            settings.model_base_url or "https://generativelanguage.googleapis.com/v1beta"
        ).rstrip("/")
        self.base_url = base_url
        self.client = httpx.Client(timeout=30.0)

    def generate_text(self, prompt: str, system_prompt: str | None = None) -> str:
        model = self.settings.model_name
        url = f"{self.base_url}/models/{model}:generateContent"
        params = {"key": self.settings.model_api_key}
        payload: dict[str, Any] = {
            "contents": [{"parts": [{"text": prompt}]}],
        }
        if system_prompt:
            payload["systemInstruction"] = {"parts": [{"text": system_prompt}]}

        response = self.client.post(url, params=params, json=payload)
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            return ""
        parts = candidates[0].get("content", {}).get("parts", [])
        return str(parts[0].get("text", "") if parts else "")

    def generate_structured(
        self, prompt: str, schema: type[T], system_prompt: str | None = None
    ) -> T:
        model = self.settings.model_name
        url = f"{self.base_url}/models/{model}:generateContent"
        params = {"key": self.settings.model_api_key}
        schema_json = schema.model_json_schema()
        payload: dict[str, Any] = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": (
                                f"{prompt}\n\nRespond ONLY with valid JSON conforming to schema:\n"
                                f"{json.dumps(schema_json)}"
                            )
                        }
                    ]
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json",
            },
        }
        if system_prompt:
            payload["systemInstruction"] = {"parts": [{"text": system_prompt}]}

        response = self.client.post(url, params=params, json=payload)
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            raise ValueError("No candidates returned from Gemini API")
        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "{}")
        parsed = json.loads(text)
        return schema.model_validate(parsed)


def get_model_provider(settings: Settings | None = None) -> ModelProvider:
    """Factory creating configured ModelProvider instance."""
    cfg = settings or get_settings()
    if cfg.app_env == "testing":
        return MockModelProvider(cfg)

    provider_type = cfg.model_provider.lower().strip()

    if provider_type == "openai_compatible":
        return OpenAICompatibleProvider(cfg)
    if provider_type == "gemini":
        return GeminiProvider(cfg)
    # Default to hermetic mock provider
    return MockModelProvider(cfg)
