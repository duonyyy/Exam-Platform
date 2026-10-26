# 🎯 Exam Platform — Core API

> Core Backend RESTful API Service for the **Exam Platform / ThiSmart** online assessment system, engineered with **Laravel 13**, **PHP 8.3-FPM**, **PostgreSQL 16**, **Redis 7**, and **Laravel Sanctum** as the architectural **Single Source of Truth (System of Record - SoR)**.

Detailed engineering specifications and architecture documentation:
- [Database Design & Schemas (docs/02-domain-database/)](../docs/02-domain-database/09-DATABASE_DESIGN.md) & [Mermaid ERD (10-ERD.md)](../docs/02-domain-database/10-ERD.md)
- [Comprehensive REST API Design & Contracts (docs/03-architecture-api/)](../docs/03-architecture-api/12-API_DESIGN.md)
- [Authentication & Access Control (docs/04-security-concurrency/)](../docs/04-security-concurrency/13-AUTH_AND_ACCESS_CONTROL.md) & [STRIDE Threat Model (14-THREAT_MODEL.md)](../docs/04-security-concurrency/14-THREAT_MODEL.md)
- [Consistency, Concurrency & Locking Strategy (docs/04-security-concurrency/)](../docs/04-security-concurrency/16-CONSISTENCY_AND_CONCURRENCY.md)
- [Automated Test Strategy & RTM Matrix (docs/07-testing-execution/)](../docs/07-testing-execution/19-TEST_STRATEGY.md)
- [Production Infrastructure & Deployment (docs/06-operations-devops/)](../docs/06-operations-devops/21-DEPLOYMENT.md)
- [Step-by-Step Implementation Roadmap (docs/07-testing-execution/)](../docs/07-testing-execution/23-IMPLEMENTATION_PLAN.md)

---

## 🏗️ 1. Architectural Principles & Standards

Core API strictly adheres to Senior Backend Engineering standards:
- **Pure Stateless RESTful API**: All communications utilize JSON envelopes. Strictly no Blade, Livewire, or Stateful Sessions on API endpoints.
- **Canonical API Prefix**: `/api/v1`
- **Stateless Authentication**: Laravel Sanctum Personal Access Bearer Tokens (revocable, scoped, token expiration enforced).
- **Defense-in-Depth Access Control (RBAC + PBAC)**:
  - Endpoint Level: Role-Based Access Control via Route Middleware (`role:admin`, `role:teacher`, `role:student`).
  - Resource Level: Policy-Based Access Control via Laravel Policies mitigating Insecure Direct Object References (IDOR / BOLA).
- **Concurrency Control & Data Integrity**:
  - ACID Database Transactions combined with Row-Level Pessimistic Locking (`lockForUpdate()`) on critical submission paths (`SubmitExamAttemptAction`).
  - Relational Database Constraints: Composite Unique Constraints prevent duplicate candidate assignment, duplicate attempts, and duplicate answer submissions.
- **Zero-Leakage Security Policy**: Strict segregation between `QuestionAdminResource` and `QuestionStudentResource`. Test candidates never receive `correct_answer`, `explanation`, or test weights during active exam attempts.
- **Server-Authoritative Clock**: Exam submission deadlines are strictly determined on the server: `deadline = min(started_at + duration_minutes, session.end_at)`.

---

## ⚙️ 2. Core Technology Stack

- **Runtime & Language**: PHP 8.3+, PHP-FPM
- **Framework**: Laravel 13
- **Primary Database**: PostgreSQL 16 (JSONB documents, Composite B-Tree Indexes, Row-level Locking)
- **Cache & Rate Limiting**: Redis 7 Alpine
- **API Authentication**: Laravel Sanctum
- **Automated Testing**: Pest PHP / PHPUnit Feature Tests (170 tests, >1100 assertions PASS)
- **Static Analysis**: Larastan / PHPStan (Level 5/8)
- **Code Style & Formatting**: Laravel Pint (PSR-12 Standard)

---

## 📂 3. Directory Layout (Action-Oriented Domain Structure)

```text
core-api/
├── app/
│   ├── Actions/                         # Single-Responsibility Business Actions
│   │   ├── Attempts/                    # StartExamAttempt, SubmitExamAttempt, SaveAttemptAnswer
│   │   ├── Exams/                       # AttachQuestionsToExam, GenerateExamFromBlueprint
│   │   └── ExamSessions/                # PublishSession, CloseSession, AssignStudents, AssignTeachers
│   ├── Enums/                           # UserRole, QuestionType, DifficultyLevel, ExamAttemptStatus...
│   ├── Http/
│   │   ├── Controllers/Api/V1/          # Orchestrators (FormRequest -> Policy -> Action -> Resource)
│   │   │   ├── AuthController.php
│   │   │   ├── SubjectController.php
│   │   │   ├── TopicController.php
│   │   │   ├── QuestionController.php
│   │   │   ├── QuestionImportController.php # Bulk Excel Question Import (.xlsx)
│   │   │   ├── ExamController.php
│   │   │   ├── ExamExportController.php     # Official PDF/Excel Gradebook & Exam Sheet Export
│   │   │   ├── ExamSessionController.php
│   │   │   ├── ExamAttemptController.php
│   │   │   └── ProctoringEventController.php
│   │   ├── Middleware/                  # RoleMiddleware, EnsureActiveUser, ForceJsonResponse
│   │   ├── Requests/                    # Dedicated Form Requests for input validation
│   │   └── Resources/                   # API Resources (Segregated Admin vs Student responses)
│   ├── Models/                          # Eloquent Models & Relational Associations
│   ├── Policies/                        # ExamAttemptPolicy, QuestionPolicy, SubjectPolicy, ExamSessionPolicy
│   ├── Services/                        # AttemptScorer, Excel/QuestionImportService, Export Services
│   └── Jobs/                            # Asynchronous Background Queue Jobs
├── database/
│   ├── factories/                       # Model Factories for deterministic testing
│   ├── migrations/                      # Relational PostgreSQL Schemas, Foreign Keys & Composite Indexes
│   └── seeders/                         # Database Seeders for Admin, Teacher, and Student baseline accounts
├── routes/
│   └── api.php                          # Canonical /api/v1 RESTful Route Definitions
└── tests/
    ├── Feature/                         # Comprehensive Feature Tests for all API Endpoints
    └── Unit/                            # Isolated Unit Tests for Scoring Engine & Enums
```

---

## 📖 4. Interactive API Documentation (OpenAPI 3.1 & Swagger UI)

Automated OpenAPI 3.1 & Swagger UI integration via `dedoc/scramble` (Zero-Annotation Engine):
- **Interactive Swagger / Stoplight UI**: `http://localhost:8000/docs/api`
- **OpenAPI Schema Specification (JSON)**: `http://localhost:8000/docs/api.json`
- **Access Control Gate**: Protected by `viewApiDocs` Gate (enabled in `local` and `testing` environments, blocked in `production`).
- **Interactive Auth**: Supports Bearer Token injection (`Authorization: Bearer <token>`) for testing authorized endpoints directly in the browser.

---

## 🚀 5. Operations & Docker Compose Commands

```bash
# 1. Start backend services
docker compose up -d app web postgres

# 2. Install composer dependencies
docker compose exec app composer install

# 3. Generate application encryption key
docker compose exec app php artisan key:generate

# 4. Execute database migrations & seed test fixtures
docker compose exec app php artisan migrate --seed

# 5. Run automated Feature Test suite
docker compose exec app php artisan test

# 6. Verify PSR-12 code style compliance
docker compose exec app ./vendor/bin/pint --test

# 7. Run static analysis (PHPStan Level 5)
docker compose exec app ./vendor/bin/phpstan analyse --level=5
```
