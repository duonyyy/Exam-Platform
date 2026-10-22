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
            requires_write = any(w in prompt_lower for w in ["publish", "delete", "create", "gán"])
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
            settings.model_base_url
            or "https://generativelanguage.googleapis.com/v1beta"
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
    provider_type = cfg.model_provider.lower().strip()

    if provider_type == "openai_compatible":
        return OpenAICompatibleProvider(cfg)
    if provider_type == "gemini":
        return GeminiProvider(cfg)
    # Default to hermetic mock provider
    return MockModelProvider(cfg)
