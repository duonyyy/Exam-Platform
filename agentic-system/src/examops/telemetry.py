"""Observability, OpenTelemetry tracing setup, and Structured Audit Trail."""

from __future__ import annotations

import json
import logging
from datetime import UTC, datetime
from typing import Any, Literal

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from pydantic import BaseModel, Field

from examops.config import Settings, get_settings

logger = logging.getLogger("examops.audit")

AuditEventType = Literal[
    "TASK_STARTED",
    "GOAL_INTAKE_PASSED",
    "PLAN_CREATED",
    "SKILL_EXECUTED",
    "TOOL_EXECUTED",
    "VERIFICATION_PASSED",
    "VERIFICATION_FAILED",
    "APPROVAL_REQUESTED",
    "APPROVAL_GRANTED",
    "APPROVAL_REJECTED",
    "TASK_TERMINATED",
]


class AuditEvent(BaseModel):
    """Structured immutable audit record for compliance and post-examination forensics."""

    timestamp: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
    event_type: AuditEventType
    task_id: str
    thread_id: str
    actor_id: str
    details: dict[str, Any] = Field(default_factory=dict)


def sanitize_audit_details(details: dict[str, Any]) -> dict[str, Any]:
    """Mask secrets, bearer tokens, and correct answers from audit payloads."""
    sanitized: dict[str, Any] = {}
    sensitive_keys = {
        "token",
        "api_key",
        "password",
        "secret",
        "authorization",
        "correct_answer",
    }

    for key, val in details.items():
        if any(s in key.lower() for s in sensitive_keys):
            sanitized[key] = "[REDACTED]"
        elif isinstance(val, dict):
            sanitized[key] = sanitize_audit_details(val)
        else:
            sanitized[key] = val
    return sanitized


def record_audit_event(
    event_type: AuditEventType,
    task_id: str,
    thread_id: str,
    actor_id: str,
    details: dict[str, Any] | None = None,
) -> AuditEvent:
    """Log structured audit trail separated from general application logs."""
    clean_details = sanitize_audit_details(details or {})
    event = AuditEvent(
        event_type=event_type,
        task_id=task_id,
        thread_id=thread_id,
        actor_id=actor_id,
        details=clean_details,
    )
    logger.info("[AUDIT_TRAIL] %s", json.dumps(event.model_dump()))
    return event


_tracer_initialized = False


def setup_telemetry(settings: Settings | None = None) -> trace.Tracer:
    """Initialize OpenTelemetry tracer provider if enabled."""
    global _tracer_initialized
    cfg = settings or get_settings()

    if not _tracer_initialized and cfg.otel_enabled:
        provider = TracerProvider()
        processor = BatchSpanProcessor(ConsoleSpanExporter())
        provider.add_span_processor(processor)
        trace.set_tracer_provider(provider)
        _tracer_initialized = True

    return trace.get_tracer("examops-agent")
