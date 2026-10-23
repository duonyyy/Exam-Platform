"""HTTPX client for Core API with fail-closed safety and mock adapter."""

from __future__ import annotations

import logging
from typing import Any

import httpx

from examops.config import Settings, get_settings

logger = logging.getLogger(__name__)


class ExamPlatformClientError(Exception):
    """Base exception for Exam Platform client errors."""


class ExamPlatformClient:
    """Safe, typed HTTPX client communicating with Exam Platform Core API."""

    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.base_url = self.settings.exam_platform_base_url
        self.is_mock = self.settings.exam_platform_mock
        self.timeout = self.settings.exam_platform_timeout

        headers = {
            "Accept": "application/json",
            "User-Agent": "ExamOps-Agent/0.1.0",
        }
        if self.settings.exam_platform_api_token:
            headers["Authorization"] = f"Bearer {self.settings.exam_platform_api_token}"

        self._client = httpx.Client(
            base_url=self.base_url,
            headers=headers,
            timeout=self.timeout,
            follow_redirects=False,  # Security: reject external redirects
        )

    def close(self) -> None:
        self._client.close()

    def list_subjects(self) -> dict[str, Any]:
        """Fetch list of active subjects."""
        if self.is_mock:
            return {
                "source": "MOCK",
                "data": [
                    {"id": "CS101", "name": "Computer Science 101", "code": "CS101"},
                    {"id": "MATH201", "name": "Calculus II", "code": "MATH201"},
                ],
            }

        try:
            resp = self._client.get("/subjects")
            resp.raise_for_status()
            return {"source": "LIVE", "data": resp.json()}
        except httpx.HTTPError as err:
            logger.error("Failed to fetch subjects: %s", err)
            raise ExamPlatformClientError(f"HTTP error fetching subjects: {err}") from err

    def list_topics(self, subject_id: str) -> dict[str, Any]:
        """Fetch topics for a given subject."""
        if self.is_mock:
            return {
                "source": "MOCK",
                "data": [
                    {"id": "T01", "subject_id": subject_id, "name": "Introduction & Syntax"},
                    {"id": "T02", "subject_id": subject_id, "name": "Control Flow & Loops"},
                    {"id": "T03", "subject_id": subject_id, "name": "Functions & Modules"},
                ],
            }

        try:
            resp = self._client.get(f"/subjects/{subject_id}/topics")
            resp.raise_for_status()
            return {"source": "LIVE", "data": resp.json()}
        except httpx.HTTPError as err:
            logger.error("Failed to fetch topics: %s", err)
            raise ExamPlatformClientError(f"HTTP error fetching topics: {err}") from err

    def list_questions(self, topic_id: str) -> dict[str, Any]:
        """Fetch questions for a given topic."""
        if self.is_mock:
            return {
                "source": "MOCK",
                "data": [
                    {
                        "id": f"Q-{topic_id}-1",
                        "topic_id": topic_id,
                        "type": "single_choice",
                        "status": "ready",
                        "difficulty": "easy",
                        "points": 1.0,
                        "title": f"Question 1 for {topic_id}",
                    },
                    {
                        "id": f"Q-{topic_id}-2",
                        "topic_id": topic_id,
                        "type": "multiple_choice",
                        "status": "ready",
                        "difficulty": "medium",
                        "points": 1.0,
                        "title": f"Question 2 for {topic_id}",
                    },
                ],
            }

        try:
            resp = self._client.get("/questions", params={"topic_id": topic_id})
            resp.raise_for_status()
            return {"source": "LIVE", "data": resp.json()}
        except httpx.HTTPError as err:
            logger.error("Failed to fetch questions: %s", err)
            raise ExamPlatformClientError(f"HTTP error fetching questions: {err}") from err

    def get_exam(self, exam_id: str) -> dict[str, Any]:
        """Fetch exam blueprint metadata and associated questions."""
        if self.is_mock:
            return {
                "source": "MOCK",
                "data": {
                    "id": exam_id,
                    "title": "Mock Final Exam",
                    "subject_id": "CS101",
                    "duration_minutes": 60,
                    "total_questions": 40,
                    "passing_score": 5.0,
                    "questions": [
                        {
                            "id": f"Q-{i}",
                            "topic_id": "T01" if i <= 20 else "T02",
                            "type": "single_choice",
                            "status": "ready",
                            "difficulty": "easy" if i <= 16 else ("medium" if i <= 32 else "hard"),
                            "points": 0.25,
                            "title": f"Exam Question #{i}",
                        }
                        for i in range(1, 41)
                    ],
                },
            }

        try:
            resp = self._client.get(f"/exams/{exam_id}")
            resp.raise_for_status()
            return {"source": "LIVE", "data": resp.json()}
        except httpx.HTTPError as err:
            logger.error("Failed to fetch exam: %s", err)
            raise ExamPlatformClientError(f"HTTP error fetching exam: {err}") from err

    def get_exam_session(self, session_id: str) -> dict[str, Any]:
        """Fetch exam session details."""
        if self.is_mock:
            return {
                "source": "MOCK",
                "data": {
                    "id": session_id,
                    "exam_id": "EXAM-101",
                    "status": "draft",
                    "start_at": "2026-11-01T08:00:00Z",
                    "end_at": "2026-11-01T10:00:00Z",
                },
            }

        try:
            resp = self._client.get(f"/exam-sessions/{session_id}")
            resp.raise_for_status()
            return {"source": "LIVE", "data": resp.json()}
        except httpx.HTTPError as err:
            logger.error("Failed to fetch session: %s", err)
            raise ExamPlatformClientError(f"HTTP error fetching session: {err}") from err

    def create_exam_from_blueprint(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Materialize approved blueprint proposal into Exam Platform Core API."""
        if self.is_mock:
            questions = payload.get("questions", [])
            total_points = sum(float(q.get("points", 1.0)) for q in questions)
            return {
                "source": "MOCK",
                "data": {
                    "id": 101,
                    "title": payload.get("title", "Exam from Blueprint"),
                    "subject_id": payload.get("subject_id", 1),
                    "total_points": total_points,
                    "questions_count": len(questions),
                    "ai_generation_log": {
                        "thread_id": payload.get("thread_id", "mock-thread"),
                        "proposal_hash": payload.get("proposal_hash", "mock-hash"),
                        "status": "applied",
                    },
                },
            }

        try:
            resp = self._client.post("/exams/from-blueprint", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return {"source": "LIVE", "data": data.get("data", data)}
        except httpx.HTTPError as err:
            logger.error("Failed to create exam from blueprint: %s", err)
            raise ExamPlatformClientError(f"HTTP error creating exam from blueprint: {err}") from err

    def get_exam_readiness_review(self, exam_id: str | int) -> dict[str, Any]:
        """Fetch exam readiness review metrics from Core API."""
        if self.is_mock:
            return {
                "source": "MOCK",
                "data": {
                    "exam_id": exam_id,
                    "title": "Mock Exam Readiness",
                    "is_ready_for_session": True,
                    "total_questions": 40,
                    "total_points": 10.0,
                    "pass_score": 5.0,
                    "difficulty_distribution": {
                        "easy": {"count": 16, "percentage": 40.0},
                        "medium": {"count": 16, "percentage": 40.0},
                        "hard": {"count": 8, "percentage": 20.0},
                    },
                    "topics_covered": [
                        {"topic_id": 1, "topic_name": "Core Syntax", "question_count": 20, "percentage": 50.0},
                        {"topic_id": 2, "topic_name": "Algorithms", "question_count": 20, "percentage": 50.0},
                    ],
                    "warnings": [],
                },
            }

        try:
            resp = self._client.get(f"/exams/{exam_id}/readiness-review")
            resp.raise_for_status()
            data = resp.json()
            return {"source": "LIVE", "data": data.get("data", data)}
        except httpx.HTTPError as err:
            logger.error("Failed to fetch exam readiness review: %s", err)
            raise ExamPlatformClientError(f"HTTP error fetching readiness review: {err}") from err
