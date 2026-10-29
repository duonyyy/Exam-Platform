# AGENTS.md — Exam Platform Engineering Constitution

This document is the streamlined, mandatory engineering constitution for the entire **Exam Platform** repository (Monorepo: `core-api/`, `web-client/`, `agentic-system/`).

---

## 🎯 1. Architectural Boundaries

- **`core-api/` (Laravel 13, PHP 8.3+, PostgreSQL 16)**:
  - **Single Source of Record (SoR)** for all data, business logic, grading/scoring, and exam timing.
  - **Pure RESTful API (`/api/v1`)**: Strictly no Blade, no Livewire, no HTML/CSS generation from backend.
  - Standard Eloquent + Form Requests. Do not introduce redundant Repository / DTO layers for standard CRUD operations.

- **`web-client/` (Next.js 15+ App Router, React 19, Tailwind CSS)**:
  - **Zero-Trust Client**: Client-side timers are strictly display aids; actual deadlines are enforced by the **Server-Authoritative Clock**.
  - **Never duplicate grading logic**, and never store `correct_answer`, secrets, or administrative keys in client state/bundles.
  - Authenticates via HttpOnly Cookie Proxy (`/api/auth/*`) and proxies API calls through `/api/proxy/*`.

- **`agentic-system/` (Python 3.11+, FastAPI, LangGraph)**:
  - **Fail-Closed**: Strictly forbidden from directly accessing the Core API PostgreSQL database; communicates exclusively via authenticated REST APIs.
  - All write operations (`requires_write = True`) must pause at the **Human-in-the-Loop** gate (`WAITING_FOR_APPROVAL`).

---

## 👥 2. Security & Access Control (RBAC & PBAC)

- **Role Matrix**:
  - `Admin`: Full control over user accounts, system configuration, subjects/curricula, and unified audit logs.
  - `Teacher`: Manage assigned subjects, topics, question bank items, create exam blueprints (`Exam`), schedule exam sessions (`ExamSession`), live monitor, and view session analytics.
  - `Student`: View assigned sessions (`assigned_sessions`), take exams, autosave draft answers, submit attempts, and view published score reports.

- **Mandatory Security Rules**:
  - **IDOR / BOLA Prevention**: Enforce Route Middleware (`role:*`) for endpoint-level gates and **Laravel Policies** for resource-level gates. Candidates must never view or modify other candidates' attempts; instructors can only access subjects and sessions assigned to them.
  - **Zero-Leakage Policy**: Strictly segregate `QuestionAdminResource` (includes answers and explanations) from `QuestionStudentResource` (completely strips `correct_answer` and `explanation`).
  - **Server-Authoritative Clock**: Reject submissions and answer saves if the server's current timestamp exceeds the deadline (+ 15-second network latency buffer).

---

## ⚙️ 3. Backend Technical Standards (`core-api/`)

- **Standard Controller Flow**:
  `HTTP Request` $\rightarrow$ `Form Request (Validate input)` $\rightarrow$ `Policy ($this->authorize)` $\rightarrow$ `Action (for complex transactions) or Eloquent` $\rightarrow$ `API Resource (JSON formatting)`.
- **Database & Concurrency**:
  - Explicit foreign keys (FK) on all relationships. Use `ON DELETE RESTRICT` for historical examination records and `CASCADE` for tightly-coupled child records (`attempt_answers`).
  - **Pessimistic Locking**: The exam submission flow (`SubmitExamAttemptAction`) must be wrapped in `DB::transaction()` with `lockForUpdate()` on the `ExamAttempt` row to eliminate race conditions and double-submits.
  - **Prevent N+1 Queries**: Always eager load relationships (`with()`) and paginate (`paginate()`) every collection.

---

## 💻 4. Frontend Technical Standards (`web-client/`)

- **Feature-Driven Architecture**: Organize code into domain modules in `src/features/{domain}/` (`auth`, `academic`, `exams`, `exam-taking`, `admin`).
- **Server State Management**: Centralize data fetching with TanStack Query (`useQuery`, `useMutation`) in `features/*/hooks.ts`.
- **Focus Exam Room**:
  - Distraction-free, minimal layout without sidebars.
  - Automatic debounced answer persistence (**Debounced Autosave 500ms**) with clear sync status indicators (`Saving...`, `Saved`, `Offline`).
  - Auto-submit when the authoritative server timer reaches 0.
  - Dynamic **candidate identity watermark** rendered on a rotated ($-22^\circ$) Canvas overlay to prevent unauthorized screen captures.

---

## 🧪 5. Testing & Definition of Done (DoD)

A feature is accepted only when it meets all 5 criteria:
1. ✅ **Form Request**: Input strictly validated through `$request->validated()`.
2. ✅ **Authorization**: Role Middleware + Policy completely prevents IDOR.
3. ✅ **Zero-Leakage**: No `correct_answer` or `explanation` exposed to test-takers.
4. ✅ **Feature Tests**: Comprehensive tests covering `200/201 (Happy Path)`, `401 (Unauthenticated)`, `403 (Forbidden/IDOR)`, and `422 (Validation)` with **100% PASS** rate.
5. ✅ **Performance & Integrity**: Zero N+1 queries, critical write paths protected by transactions and pessimistic locks, and git commits following Conventional Commits 1.0.0.
