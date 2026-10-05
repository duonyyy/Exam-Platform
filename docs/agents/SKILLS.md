# Agent Skills & Engineering Workflow — Exam Platform

Tài liệu này định nghĩa danh mục các **Agent Skills** được cài đặt ở cấp độ dự án (workspace scope tại `.agents/skills/`) và quy trình áp dụng (workflow) xuyên suốt các giai đoạn phát triển hệ thống Exam Platform.

---

## 1. Skill to Workflow Mapping

| Development Stage | Skill |
|---|---|
| Requirement / Specification | spec-driven-development |
| Domain / Business Rules | domain-modeling |
| Database / ERD | postgresql-table-design |
| Laravel implementation | laravel-best-practices |
| Security Design | security-guidance |
| API Security Review | api-security-review |
| Security Code Review | code-review-security |
| Next.js | next-best-practices |
| Code Review | code-reviewer |
| CI/CD | ci-cd-and-automation |
| Observability | observability-and-instrumentation |
| Architecture Decisions | documentation-and-adrs |

---

## 2. Standard Development Workflow

Mọi tính năng hoặc thay đổi trong hệ thống Exam Platform phải tuân theo luồng chuẩn sau:

```text
Requirement
   ↓
spec-driven-development

Use Case / Business Rules
   ↓
domain-modeling

Architecture
   ↓
documentation-and-adrs

Database + ERD
   ↓
postgresql-table-design

Security / Threat Model
   ↓
security-guidance

Design Review
   ↓
api-security-review

Implementation
   ↓
laravel-best-practices
or
next-best-practices

Testing / Review
   ↓
code-reviewer
   ↓
code-review-security

Production
   ↓
ci-cd-and-automation
   ↓
observability-and-instrumentation
```

---

## 3. Detailed Skills Directory

### A. Specification / Pre-Coding Design
* **Skill**: `spec-driven-development`
* **Path**: `.agents/skills/spec-driven-development`
* **Source**: `https://github.com/addyosmani/agent-skills`
* **Purpose**: Viết đặc tả có cấu trúc trước khi code (PRD, User Stories, Acceptance Criteria, Scope Gate). Ngăn chặn việc nhảy vào implement khi chưa rõ yêu cầu nghiệp vụ.

### B. Domain Modeling
* **Skill**: `domain-modeling`
* **Path**: `.agents/skills/domain-modeling`
* **Source**: `https://github.com/mattpocock/skills`
* **Purpose**: Xây dựng Ubiquitous Language, Glossary, định nghĩa ranh giới Entity, Value Object, Aggregate Root và state transitions (draft → published → closed, in_progress → submitted → graded).

### C. Architecture Decisions
* **Skill**: `documentation-and-adrs`
* **Path**: `.agents/skills/documentation-and-adrs`
* **Source**: `https://github.com/addyosmani/agent-skills`
* **Purpose**: Ghi lại các quyết định kiến trúc quan trọng (ADR), đánh giá trade-off và lý do lựa chọn giải pháp kỹ thuật cho hệ thống thi trực tuyến.

### D. PostgreSQL Database Design
* **Skill**: `postgresql-table-design`
* **Path**: `.agents/skills/postgresql-table-design`
* **Source**: `https://github.com/wshobson/agents`
* **Purpose**: Thiết kế schema chuẩn PostgreSQL (chuẩn hóa 3NF, PK identity/UUID, khóa ngoại, chỉ mục index trên query access path, constraints, partitioning, xử lý JSONB và migration an toàn không downtime).

### E. Security Design & Guidance
* **Skill**: `security-guidance`
* **Path**: `.agents/skills/security-guidance`
* **Source**: `https://github.com/owasp/secure-agent-playbook`
* **Purpose**: Hướng dẫn phát triển bảo mật chuẩn OWASP ASVS (Application Security Verification Standard), áp dụng cho authentication, authorization, RBAC, input validation, chống race condition và bảo vệ dữ liệu nhạy cảm.

### F. API Security Review
* **Skill**: `api-security-review`
* **Path**: `.agents/skills/api-security-review`
* **Source**: `https://github.com/owasp/secure-agent-playbook`
* **Purpose**: Đánh giá an toàn API theo OWASP API Security Top 10 (2023). Kiểm tra BOLA/IDOR (truy cập attempt của học sinh khác), Broken Auth, Mass Assignment, Rate Limiting, rò rỉ `correct_answer`.

### G. Backend Implementation (Laravel)
* **Skill**: `laravel-best-practices`
* **Path**: `.agents/skills/laravel-best-practices`
* **Source**: `https://github.com/laravel/boost`
* **Purpose**: Chuẩn hóa code Laravel 13 / PHP 8.3+. Ưu tiên tuân thủ convention hiện có của dự án. Áp dụng Form Request, Resource, Action, Policy, Eloquent optimization (chống N+1), Database Transactions.

### H. Frontend Implementation (Next.js)
* **Skill**: `next-best-practices`
* **Path**: `.agents/skills/next-best-practices`
* **Source**: `https://github.com/vercel-labs/openreview`
* **Purpose**: Chuẩn hóa code Next.js frontend (App Router, Server/Client Components, Route Handlers, tối ưu UX phòng thi, quản lý state và xử lý sự kiện proctoring thời gian thực).

### I. General Code Review
* **Skill**: `code-reviewer`
* **Path**: `.agents/skills/code-reviewer`
* **Source**: `https://github.com/google-gemini/gemini-cli`
* **Purpose**: Review tính chính xác (correctness), khả năng bảo trì (maintainability), kiểm tra edge cases, regression và chất lượng diff trước khi merge.

### J. Security Code Review
* **Skill**: `code-review-security`
* **Path**: `.agents/skills/code-review-security`
* **Source**: `https://github.com/owasp/secure-agent-playbook`
* **Purpose**: Kiểm tra mã nguồn chuyên sâu theo OWASP Top 10 và ASVS (Injection, Authorization bypass, IDOR, data leakage trong response/logs, race conditions khi submit bài thi).

### K. CI/CD & Automation
* **Skill**: `ci-cd-and-automation`
* **Path**: `.agents/skills/ci-cd-and-automation`
* **Source**: `https://github.com/addyosmani/agent-skills`
* **Purpose**: Tự động hóa quality gates (Laravel Pint, Larastan / PHPStan, Pest/PHPUnit tests, Next.js typecheck & lint, GitHub Actions workflows).

### L. Observability & Instrumentation
* **Skill**: `observability-and-instrumentation`
* **Path**: `.agents/skills/observability-and-instrumentation`
* **Source**: `https://github.com/addyosmani/agent-skills`
* **Purpose**: Tích hợp structured logging, metrics, tracing, Correlation ID / Request ID, giám sát các sự kiện quan trọng trong kỳ thi (start attempt, submit answer, proctoring alerts, scoring errors).

---

## 4. Usage Instructions for Agents

1. **Workspace Scope**: Mọi kỹ năng nằm trong thư mục `.agents/skills/` được kích hoạt tự động theo bối cảnh tác vụ của Agent.
2. **Safety Guidelines**:
   - Không tự ý thực thi các kịch bản phá hoại hệ thống.
   - Luôn tuân thủ các quy tắc trong `AGENTS.md`.
   - Tuyệt đối không để lộ đáp án câu hỏi (`correct_answer`) cho student trong suốt thời gian diễn ra kỳ thi.
