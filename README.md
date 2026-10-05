# Exam Platform — Online Examination System

Hệ thống quản trị và tổ chức thi trực tuyến (Online Examination Platform) được tổ chức theo mô hình phân tầng:
- **[`core-api/`](core-api/README.md)**: Dịch vụ Backend RESTful API trung tâm xây dựng bằng **Laravel 13**, **PHP 8.3-FPM**, **PostgreSQL 16**, và **Laravel Sanctum**.
- **[`web-client/`](web-client/README.md)**: Ứng dụng Frontend Web Client xây dựng bằng **Next.js / React** và **Tailwind CSS**.

## Đề tài

**Xây dựng RESTful API cho hệ thống thi trực tuyến bằng Laravel**

Tên tiếng Anh:

**Exam Platform API: A Laravel RESTful Backend for Online Examination Management**

## Mục tiêu

Hệ thống quản lý:

- tài khoản và phân quyền
- môn học và chủ đề
- ngân hàng câu hỏi
- duyệt câu hỏi
- đề thi mẫu
- ca thi
- phân công giảng viên
- phân bổ thí sinh
- lượt làm bài
- lưu đáp án
- nộp bài và chấm điểm
- cảnh báo giám sát thi
- thống kê kỳ thi

## Vai trò

```text
Admin
Teacher
Student
```

## Domain chính

```text
Subject
  ↓
Topic
  ↓
Question

Question
   ↓
Exam
   ↓
Exam Session
   ↓
Assignment
   ↓
Exam Attempt
   ↓
Attempt Answers
   ↓
Score
```

## Luồng nghiệp vụ chính

### Giảng viên

```text
Login
  ↓
Create Subject / Topic
  ↓
Create Question
  ↓
Approve Question
  ↓
Create Exam
  ↓
Attach Questions
  ↓
Create Exam Session
  ↓
Assign Students / Teachers
  ↓
Publish Session
  ↓
Monitor Attempts
  ↓
Review Results
```

### Sinh viên

```text
Login
  ↓
View Assigned Exams
  ↓
Start Attempt
  ↓
Load Questions
  ↓
Save Answers
  ↓
Submit Attempt
  ↓
Score / Result
```

## Stack mục tiêu

```text
PHP 8.3+
Laravel 13
PostgreSQL 16
Laravel Sanctum
Redis
Pest / PHPUnit
Docker & Docker Compose
```

## Khởi chạy Môi trường (Docker Compose)

Hệ thống đã cấu hình sẵn môi trường container hóa chuẩn monorepo:
- **Core API** (services `app` & `web`): PHP 8.3-FPM + Nginx lắng nghe tại `http://localhost:8000`, volume gắn vào `./core-api`.
- **Web Client** (service `client`): Node.js 20 Alpine lắng nghe tại `http://localhost:3000`, volume gắn vào `./web-client`.
- **Database** (service `postgres`): PostgreSQL 16 tại cổng `5432`, database `exam_platform`, user `postgres`, password `secret`.

Các lệnh vận hành thường dùng:

```bash
# 1. Khởi động toàn bộ containers (Core API + Web Client + Postgres)
docker compose up -d

# 2. Khởi tạo skeleton Laravel trong core-api (chạy lần đầu)
docker compose exec app composer create-project laravel/laravel .

# 3. Chạy migrations cho Core API
docker compose exec app php artisan migrate

# 4. Chạy bộ kiểm thử tự động cho Core API
docker compose exec app php artisan test
```

## API prefix

```text
/api/v1
```

## Request flow

```text
HTTP Request
    ↓
Route
    ↓
Middleware
    ↓
Authentication
    ↓
Form Request
    ↓
Controller
    ↓
Policy / Authorization
    ↓
Action / Service nếu thực sự cần
    ↓
Eloquent
    ↓
PostgreSQL / Redis / Queue
    ↓
API Resource
    ↓
JSON Response
```

## Tài liệu dự án

Toàn bộ hệ thống tài liệu và đặc tả kiến trúc được tổ chức thành **8 nhóm thư mục theo vai trò chức năng** tại [`docs/`](docs/README.md):

1. **[Quy chuẩn Kỹ thuật Cốt lõi (AGENTS.md)](AGENTS.md)**: Bản quy tắc vàng, tiêu chuẩn kỹ thuật và vai trò Senior Backend Engineer.
2. **[Mục lục Tài liệu Tổng thể (docs/README.md)](docs/README.md)**: Bản đồ tra cứu toàn bộ tài liệu kiến trúc và hướng dẫn kỹ thuật.
3. **[01 — Yêu Cầu & Nghiệp Vụ (docs/01-requirements/)](docs/01-requirements/README.md)**:
   - [Bài toán & Phạm vi Nghiệp vụ (01-PROBLEM_AND_SCOPE.md)](docs/01-requirements/01-PROBLEM_AND_SCOPE.md)
   - [Yêu cầu Chức năng FR-* (02-REQUIREMENTS.md)](docs/01-requirements/02-REQUIREMENTS.md)
   - [Yêu cầu Phi chức năng NFR-* (03-NON_FUNCTIONAL_REQUIREMENTS.md)](docs/01-requirements/03-NON_FUNCTIONAL_REQUIREMENTS.md)
   - [Thiết kế Use Cases & Đặc tả Luồng Cốt lõi (04-USE_CASES.md)](docs/01-requirements/04-USE_CASES.md)
   - [Quy tắc Nghiệp vụ & Tầng Thực thi BR-* (05-BUSINESS_RULES.md)](docs/01-requirements/05-BUSINESS_RULES.md)
4. **[02 — Mô Hình Miền & CSDL (docs/02-domain-database/)](docs/02-domain-database/README.md)**:
   - [Mô hình Miền Nghiệp vụ (06-DOMAIN_MODEL.md)](docs/02-domain-database/06-DOMAIN_MODEL.md)
   - [Máy Trạng thái Question, Session, Attempt (07-STATE_MACHINES.md)](docs/02-domain-database/07-STATE_MACHINES.md)
   - [Thiết kế CSDL Chi tiết, Ràng buộc & Chỉ mục (09-DATABASE_DESIGN.md)](docs/02-domain-database/09-DATABASE_DESIGN.md)
   - [Sơ đồ Mermaid ERD Toàn diện (10-ERD.md)](docs/02-domain-database/10-ERD.md)
   - [Phân loại Dữ liệu & Thanh lọc Nhật ký (11-DATA_CLASSIFICATION.md)](docs/02-domain-database/11-DATA_CLASSIFICATION.md)
5. **[03 — Kiến Trúc & API (docs/03-architecture-api/)](docs/03-architecture-api/README.md)**:
   - [Đánh giá Cổng Thiết kế & Phán quyết READY (00-DESIGN_REVIEW.md)](docs/03-architecture-api/00-DESIGN_REVIEW.md)
   - [Kiến trúc C4 Model Level 1 & Level 2 (08-ARCHITECTURE.md)](docs/03-architecture-api/08-ARCHITECTURE.md)
   - [Đặc tả API Contracts & Schemas /api/v1 (12-API_DESIGN.md)](docs/03-architecture-api/12-API_DESIGN.md)
   - [Sơ đồ Tuần tự Mermaid Luồng Sinh tử (15-SEQUENCE_DIAGRAMS.md)](docs/03-architecture-api/15-SEQUENCE_DIAGRAMS.md)
   - [Bản ghi Quyết định Kiến trúc (adr/)](docs/03-architecture-api/adr/ADR-001-LARAVEL_REST_API.md)
6. **[04 — Bảo Mật & Concurrency (docs/04-security-concurrency/)](docs/04-security-concurrency/README.md)**:
   - [Xác thực Sanctum & Phân quyền Chống IDOR (13-AUTH_AND_ACCESS_CONTROL.md)](docs/04-security-concurrency/13-AUTH_AND_ACCESS_CONTROL.md)
   - [Mô hình Đe dọa STRIDE & 8 Kịch bản Tấn công (14-THREAT_MODEL.md)](docs/04-security-concurrency/14-THREAT_MODEL.md)
   - [Kiểm soát Tranh chấp Đồng thời & Khóa Bi quan (16-CONSISTENCY_AND_CONCURRENCY.md)](docs/04-security-concurrency/16-CONSISTENCY_AND_CONCURRENCY.md)
7. **[05 — Giao Diện Frontend (docs/05-frontend/)](docs/05-frontend/README.md)**:
   - [Kiến trúc Next.js 15+ App Router & Focus Exam Room (17-FRONTEND_DESIGN.md)](docs/05-frontend/17-FRONTEND_DESIGN.md)
8. **[06 — Vận Hành & DevOps (docs/06-operations-devops/)](docs/06-operations-devops/README.md)**:
   - [Khả năng Quan sát, Logs, Metrics & Health Check (18-OBSERVABILITY.md)](docs/06-operations-devops/18-OBSERVABILITY.md)
   - [Kế hoạch Hiệu năng & Tải đỉnh (20-PERFORMANCE_PLAN.md)](docs/06-operations-devops/20-PERFORMANCE_PLAN.md)
   - [Hạ tầng Triển khai & CI/CD Pipeline (21-DEPLOYMENT.md)](docs/06-operations-devops/21-DEPLOYMENT.md)
   - [Bảng Đăng ký Rủi ro Hệ thống (22-RISK_REGISTER.md)](docs/06-operations-devops/22-RISK_REGISTER.md)
9. **[07 — Kiểm Thử & Thực Thi (docs/07-testing-execution/)](docs/07-testing-execution/README.md)**:
   - [Chiến lược Kiểm thử Tự động & RTM Matrix (19-TEST_STRATEGY.md)](docs/07-testing-execution/19-TEST_STRATEGY.md)
   - [Lộ trình Triển khai 12 Phase Chi tiết kèm DoD (23-IMPLEMENTATION_PLAN.md)](docs/07-testing-execution/23-IMPLEMENTATION_PLAN.md)
10. **[08 — Quy Chuẩn & Đào Tạo (docs/08-guidelines/)](docs/08-guidelines/README.md)**:
   - [Tiêu chuẩn Lập trình PHP & TypeScript (CODING_STANDARDS.md)](docs/08-guidelines/CODING_STANDARDS.md)
   - [Quy chuẩn Commit Chuẩn Production (COMMIT_STANDARDS.md)](docs/08-guidelines/COMMIT_STANDARDS.md)
   - [Cẩm nang Học tập Senior Backend (LEARNING_GUIDE.md)](docs/08-guidelines/LEARNING_GUIDE.md)

## Nguyên tắc

> Học Laravel bằng cách xây từng nghiệp vụ thật của hệ thống thi, không generate toàn bộ project một lần.

Không thêm Repository / Service / Interface / DTO / Mapper chỉ để trông giống Clean Architecture.

Chỉ tạo abstraction khi nó giải quyết một vấn đề cụ thể.
