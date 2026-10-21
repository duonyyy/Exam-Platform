# Security, Permissions & Verification Architecture

## 1. Zero-Leakage Policy

ExamOps Agent operates under a strict defense-in-depth model:
- **No Token Logging**: Bearer tokens, API keys, and sensitive headers are stripped or redacted in all application logs and OpenTelemetry spans.
- **No Correct Answers in Traces**: State persistence and checkpoints exclude answer keys (`correct_answer`).
- **Audit Masking**: The `sanitize_audit_details` function recursively scrubs any key matching `token`, `secret`, `api_key`, `password`, or `correct_answer`.

## 2. Access Control Model

| Actor Role | Allowed Read Intention | Allowed Write Proposals | Direct SoR Write |
| :--- | :--- | :--- | :---: |
| **Admin** | All subjects, topics, exams, questions, sessions | Publish session, assign student | **Blocked** (Requires Human Approval) |
| **Teacher** | Assigned subjects, topics, exams, readiness review | Publish session proposal | **Blocked** (Requires Human Approval) |
| **Student** | Assigned sessions only | None | **Forbidden** |

## 3. Human-in-the-Loop Gate & Proposal Hashing

Every write intent generates an `ApprovalProposal` containing:
- `action`: Target operation (e.g. `publish_session`)
- `arguments`: Target session / exam IDs
- `proposal_hash`: `SHA-256` of canonical JSON-serialized arguments
- `proposed_by`: Initiating actor ID

When `POST /api/v1/tasks/{thread_id}/resume` is called:
1. Caller role is validated (`teacher` or `admin`).
2. Graph resumes execution from SQLite checkpoint.
3. Decision is recorded in the structured audit trail.
