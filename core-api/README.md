# 🎯 Exam Platform — Core API

> Backend RESTful API dịch vụ trung tâm cho hệ thống thi trực tuyến **Exam Platform**, xây dựng trên nền tảng **Laravel 13**, **PHP 8.3-FPM**, **PostgreSQL 16**, và **Laravel Sanctum**.

Tài liệu chi tiết về thiết kế hệ thống xem tại:
- [Thiết kế Cơ sở Dữ liệu & ERD (docs/02-domain-database/)](../docs/02-domain-database/09-DATABASE_DESIGN.md) & [Sơ đồ ERD (10-ERD.md)](../docs/02-domain-database/10-ERD.md)
- [Đặc tả toàn diện API Endpoints (docs/03-architecture-api/)](../docs/03-architecture-api/12-API_DESIGN.md)
- [Kiến trúc An ninh & Chống gian lận (docs/04-security-concurrency/)](../docs/04-security-concurrency/13-AUTH_AND_ACCESS_CONTROL.md) & [Threat Model (14-THREAT_MODEL.md)](../docs/04-security-concurrency/14-THREAT_MODEL.md)
- [Chiến lược Kiểm thử Tự động (docs/07-testing-execution/)](../docs/07-testing-execution/19-TEST_STRATEGY.md)
- [Hạ tầng & Triển khai Production (docs/06-operations-devops/)](../docs/06-operations-devops/21-DEPLOYMENT.md)
- [Lộ trình Triển khai 12 Phase Chi tiết (docs/07-testing-execution/)](../docs/07-testing-execution/23-IMPLEMENTATION_PLAN.md)

---

## 🏗️ 1. Tổng quan Kiến trúc

Core API tuân thủ nghiêm ngặt các nguyên tắc kỹ thuật của Senior Backend Engineer:
- **RESTful API thuần túy:** Toàn bộ request/response giao tiếp qua JSON, không sử dụng Blade, Livewire hay Session stateful.
- **Prefix chuẩn hóa:** `/api/v1`
- **Stateless Authentication:** Sử dụng Laravel Sanctum Bearer Tokens.
- **Phân quyền đa lớp (RBAC + PBAC):**
  - Cấp vai trò: Role Middleware (`role:admin`, `role:teacher`, `role:student`).
  - Cấp tài nguyên: Laravel Policies chống lỗ hổng truy cập trái phép (IDOR).
- **Tính toán toàn vẹn & Chống Race Condition:**
  - Sử dụng Database Transactions và Pessimistic Locking (`lockForUpdate()`) trong các luồng nhạy cảm (`SubmitExamAttempt`).
  - Ràng buộc CSDL (Composite Unique Constraints) chống duplicate assignment, duplicate attempt, duplicate answer.
- **Bảo mật đề thi (Zero-Leakage):** Phân tách tuyệt đối giữa `QuestionAdminResource` và `QuestionStudentResource`. Không bao giờ để lộ `correct_answer` hay `explanation` cho thí sinh trong lúc đang thi.

---

## ⚙️ 2. Công nghệ Cốt lõi (Technology Stack)

- **Ngôn ngữ & Runtime:** PHP 8.3+, PHP-FPM
- **Framework:** Laravel 13
- **Cơ sở dữ liệu:** PostgreSQL 16 (Hỗ trợ JSONB, Partitioning, Composite Indexes)
- **Bộ nhớ đệm & Hàng đợi:** Redis 7
- **Xác thực API:** Laravel Sanctum
- **Kiểm thử tự động:** Pest PHP / PHPUnit Feature Tests
- **Phân tích tĩnh:** Larastan / PHPStan (Level 8)
- **Quy chuẩn Code:** Laravel Pint (PSR-12)

---

## 📂 3. Cấu trúc Thư mục Chuẩn (Action-Oriented Domain Structure)

```text
core-api/
├── app/
│   ├── Actions/                         # Single-responsibility business actions
│   │   ├── Attempts/                    # StartExamAttempt, SubmitExamAttempt, SaveAnswer
│   │   ├── Exams/                       # AttachQuestionsToExam, RecalculateExamPoints
│   │   └── ExamSessions/                # PublishSession, CloseSession, AssignStudents
│   ├── Enums/                           # UserRole, QuestionType, Difficulty, AttemptStatus...
│   ├── Http/
│   │   ├── Controllers/Api/V1/          # Orchestrators (Validation -> Policy -> Action -> Resource)
│   │   │   ├── AuthController.php
│   │   │   ├── SubjectController.php
│   │   │   ├── QuestionController.php
│   │   │   ├── ExamController.php
│   │   │   ├── ExamSessionController.php
│   │   │   ├── ExamAttemptController.php
│   │   │   └── ProctoringEventController.php
│   │   ├── Middleware/                  # RoleMiddleware, CheckExamWindow, VerifyIdempotency
│   │   ├── Requests/                    # Dedicated Form Requests cho validation
│   │   └── Resources/                   # API Resources (QuestionAdminResource, QuestionStudentResource)
│   ├── Models/                          # Eloquent Models & Relationships
│   ├── Policies/                        # ExamAttemptPolicy, QuestionPolicy, SessionPolicy (IDOR protection)
│   ├── Services/                        # AttemptScorer (Thuật toán tính điểm độc lập)
│   └── Jobs/                            # Background jobs (Báo cáo, xuất PDF/Excel)
├── database/
│   ├── factories/                       # Dữ liệu mẫu phục vụ kiểm thử
│   ├── migrations/                      # 14 bảng CSDL chuẩn quan hệ & chỉ mục
│   └── seeders/                         # Seeder tài khoản Admin, Teacher, Student
├── routes/
│   └── api.php                          # Toàn bộ định tuyến /api/v1
└── tests/
    ├── Feature/                         # Feature Tests cho toàn bộ API Endpoints
    └── Unit/                            # Unit Tests cho Scoring Service & Enums
```

---

## 🚀 4. Lệnh Vận hành qua Docker Compose

```bash
# 1. Khởi tạo project (chỉ chạy lần đầu nếu chưa có skeleton)
docker compose exec app composer create-project laravel/laravel .

# 2. Cài đặt các gói phụ thuộc (Sanctum, Pint, Larastan)
docker compose exec app composer require laravel/sanctum
docker compose exec app composer require --dev laravel/pint nunomaduro/larastan pestphp/pest

# 3. Chạy migrations CSDL
docker compose exec app php artisan migrate

# 4. Chạy Seeder dữ liệu mẫu
docker compose exec app php artisan db:seed

# 5. Chạy bộ Feature Tests tự động
docker compose exec app php artisan test

# 6. Kiểm tra quy chuẩn mã nguồn (Code Style)
docker compose exec app ./vendor/bin/pint --test

# 7. Phân tích tĩnh kiểu dữ liệu (Static Analysis)
docker compose exec app ./vendor/bin/phpstan analyse --level=8
```
