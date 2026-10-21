# ExamOps Agent — Architectural Specification

## 1. Context and Architectural Boundaries

ExamOps Agent is an intelligent orchestration service designed to automate exam blueprinting, readiness evaluation, and teacher assistance within the **Exam Platform** ecosystem.

```text
┌────────────────────────────────────────────────────────┐
│                      Client Layer                      │
│             (Web Client / Teacher Portal)              │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP JSON / API Key
                            ▼
┌────────────────────────────────────────────────────────┐
│                   agentic-system/                      │
│                (FastAPI Composition)                   │
├────────────────────────────────────────────────────────┤
│  • REST Endpoints (/health, /tasks, /resume)           │
│  • RBAC & Least-Privilege Gatekeeper                   │
│  • OpenTelemetry & Structured Audit Trail              │
│  • LangGraph Deterministic 6-Node Loop                 │
│  • Domain Skills (exam-blueprint, exam-readiness)      │
│  • SQLite Isolated Checkpointer (data/checkpoints.db)  │
│  • Safe Typed HTTPX Client (ExamPlatformClient)        │
└───────────────────────────┬────────────────────────────┘
                            │ RESTful /api/v1 (Bearer Token)
                            ▼
┌────────────────────────────────────────────────────────┐
│                       core-api/                        │
│            (Laravel 13 & PostgreSQL 16)                │
│                 SYSTEM OF RECORD (SoR)                 │
└────────────────────────────────────────────────────────┘
```

## 2. Key Separation of Concerns

1. **System of Record (SoR) vs Orchestration**:
   - `core-api/` is the authoritative owner of database models, relations, exam sessions, permissions, and question pools.
   - `agentic-system/` is a stateless orchestration engine that interacts with `core-api/` solely through validated API contracts.
2. **Database Boundary**:
   - The Agent **never** connects directly to PostgreSQL.
   - The Agent maintains its own independent SQLite database for LangGraph checkpoints (`data/checkpoints.db`).
3. **Deterministic Harness**:
   - LLMs generate structured Pydantic proposals, but cannot bypass deterministic business rule validators or authorization filters.
   - Write actions (`requires_write=True`) automatically trigger a human approval interrupt.
