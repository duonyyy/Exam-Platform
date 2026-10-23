# 23 — Step-by-Step Implementation Roadmap & Plan

**Dự án**: Exam Platform  
**Tài liệu**: `docs/07-testing-execution/23-IMPLEMENTATION_PLAN.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. Nguyên tắc Thực thi (Implementation Principles)

1. **Tuân thủ Tuyệt đối Quy chuẩn Senior**: Không tạo code hàng loạt; triển khai từng tính năng hoàn chỉnh từ Migration $\rightarrow$ Model $\rightarrow$ Policy $\rightarrow$ Request $\rightarrow$ Action $\rightarrow$ Resource $\rightarrow$ Feature Test.
2. **Definition of Done (DoD) Bắt buộc**: Một phase chỉ được coi là hoàn thành khi:
   - 100% Feature Tests của phase đó PASS trên PostgreSQL thật.
   - Mã nguồn được chuẩn hóa qua Laravel Pint (`./vendor/bin/pint`).
   - Phân tích tĩnh Larastan đạt Level 8 không có lỗi (`./vendor/bin/phpstan analyse --level=8`).
   - Đảm bảo an ninh (chống IDOR, không rò rỉ đáp án).

---

## 2. Chi tiết 14 Giai đoạn Triển khai (Phase-by-Phase Roadmap)

---

### Phase 1 — Nền tảng Dự án (Foundation & Scaffolding)
- **Mục tiêu**: Khởi tạo khung dự án Laravel 13 trong `core-api/` và Next.js 15+ trong `web-client/`, tích hợp hạ tầng Docker Compose, thiết lập tự động hóa tài liệu OpenAPI 3.1 / Swagger UI qua `dedoc/scramble`.
- **Phụ thuộc**: Docker Desktop sẵn sàng.
- **Tệp tin ảnh hưởng**: `core-api/*`, `web-client/*`, `docker-compose.yml`.
- **Thay đổi CSDL**: Kết nối PostgreSQL 16 và chạy migration bảng `users`, `personal_access_tokens`.
- **Endpoints**: `GET /api/v1/health`, `GET /docs/api` (Swagger UI), `GET /docs/api.json` (OpenAPI Spec).
- **Kiểm soát An ninh**: Cấu hình CORS chặt chẽ, kiểm tra kết nối DB an toàn, bảo vệ Swagger UI qua Gate `viewApiDocs` (chỉ mở trên `local`/`testing`).
- **Tests**: `tests/Feature/HealthCheckTest.php`, `tests/Feature/RoleMiddlewareTest.php`, `tests/Feature/SwaggerDocumentationTest.php`, `tests/Unit/RoleEnumTest.php`, `tests/Unit/UserTest.php`.
- **DoD**: Containers `app`, `web`, `postgres`, `client` khởi động bình thường; `php artisan test` chạy thành công 100%; Swagger UI truy cập được tại `/docs/api`.


---

### Phase 2 — Xác thực & Phân quyền Vai trò (Auth & RBAC)
- **Mục tiêu**: Hoàn thiện đăng ký, đăng nhập, đăng xuất, lấy thông tin cá nhân và phân quyền Role Middleware.
- **Phụ thuộc**: Phase 1.
- **Tệp tin ảnh hưởng**: `app/Http/Controllers/Api/V1/AuthController.php`, `app/Http/Requests/Auth/RegisterRequest.php`, `app/Http/Requests/Auth/LoginRequest.php`, `app/Http/Resources/UserResource.php`, `app/Http/Middleware/RoleMiddleware.php`, `app/Http/Middleware/EnsureActiveUser.php`, `config/sanctum.php`, `routes/api.php`.
- **Thay đổi CSDL**: Sử dụng bảng `users` (`role`, `is_active`, `code`) và `personal_access_tokens`.
- **Endpoints**:
  - `POST /api/v1/auth/register` (Tạo tài khoản thí sinh)
  - `POST /api/v1/auth/login` (Xác thực & cấp Bearer token)
  - `POST /api/v1/auth/logout` (Thu hồi token hiện tại)
  - `GET /api/v1/auth/me` (Lấy thông tin cá nhân & role)
- **Kiểm soát An ninh**: Băm mật khẩu bằng Bcrypt/Hash, Rate Limiting 5 lần/phút cho login (`throttle:5,1`), thời hạn Bearer token 480 phút, thu hồi token khi logout; middleware `active` chặn cả token đã cấp nếu tài khoản bị vô hiệu hóa (`is_active = false`).
- **Tests**: `tests/Feature/Auth/RegisterTest.php`, `tests/Feature/Auth/LoginTest.php`, `tests/Feature/Auth/LogoutTest.php`, `tests/Feature/Auth/MeTest.php`, `tests/Feature/Auth/InactiveTokenTest.php`, `tests/Feature/RoleMiddlewareTest.php`.
- **DoD**: Đăng nhập/đăng xuất hoạt động; cấp Sanctum token; phân quyền chặn đúng mã `403` khi thí sinh gọi route quản trị; 100% Feature Tests pass.

---

### Phase 3 — Quản lý Môn học & Chủ đề (Subjects & Topics)
- **Tiến độ**: Đã triển khai Subject API và Topic `GET`/`POST` có kiểm thử. Quyền và hợp đồng sửa/xóa Topic cần quyết định nghiệp vụ trước khi triển khai; chưa coi toàn bộ CRUD Topic đã hoàn tất.
- **Mục tiêu**: Quản lý danh mục Môn học và Chủ đề kiến thức.
- **Phụ thuộc**: Phase 2.
- **Tệp tin ảnh hưởng**: `app/Models/Subject.php`, `app/Models/Topic.php`, `app/Models/Question.php` (quan hệ đếm; schema Phase 4), `app/Policies/SubjectPolicy.php`, `app/Http/Controllers/Api/V1/SubjectController.php`, `app/Http/Controllers/Api/V1/TopicController.php`, Form Requests và API Resources tương ứng.
- **Thay đổi CSDL**: Tạo bảng `subjects` (Unique `code`, `created_by` truy vết, `owner_teacher_id` chỉ giảng viên phụ trách hiện tại), `topics` (FK `subject_id` với `ON DELETE RESTRICT`).
- **Endpoints**: `GET/POST/PATCH/DELETE /api/v1/subjects`, `GET/POST /api/v1/subjects/{id}/topics`.
- **Kiểm soát An ninh**: Admin quản lý mọi môn và phân công lại; teacher tạo môn tự phụ trách và chỉ sửa/xóa môn được phân công; sinh viên chỉ đọc. Mọi vai trò đã đăng nhập được xem danh sách Topic. Admin tạo Topic ở mọi Subject, teacher chỉ tạo ở Subject đang phụ trách; kiểm tra lại Policy khi đã khóa Subject.
- **Tests**: `tests/Feature/Subjects/SubjectCrudTest.php`, `tests/Feature/Topics/TopicApiTest.php`.
- **DoD hiện tại**: Subject CRUD và Topic `GET`/`POST` hoạt động; danh sách phân trang, có `questions_count` (bằng 0 trước migration Phase 4). Topic `PATCH`/`DELETE` chờ đặc tả về quyền và quy tắc xóa.

---

### Phase 4 — Ngân hàng Câu hỏi (Question Bank)
- **Mục tiêu**: Quản lý ngân hàng câu hỏi 4 định dạng, lưu trữ options/correct_answer dạng JSONB; câu hỏi hợp lệ được tạo `ready` ngay.
- **Phụ thuộc**: Phase 3.
- **Tệp tin ảnh hưởng**: `app/Models/Question.php`, `app/Enums/QuestionType.php`, `app/Http/Resources/QuestionAdminResource.php`, `app/Http/Resources/QuestionStudentResource.php`.
- **Thay đổi CSDL**: Tạo bảng `questions` với các cột JSONB và Soft Deletes (`deleted_at`).
- **Endpoints**:
  - `GET/POST /api/v1/questions`
  - `PUT /api/v1/questions/{id}`
  - `PATCH /api/v1/questions/{id}/status`
- **Kiểm soát An ninh**: Form Request validate chặt chẽ cấu trúc JSON options và correct_answer; phân tách tuyệt đối giữa `QuestionAdminResource` và `QuestionStudentResource`.
- **Tests**: `tests/Feature/Questions/QuestionApiTest.php` (tạo, sửa, bật/tắt, phân quyền, validation, chống lộ đáp án).
- **DoD**: Tạo câu hỏi `ready`, sửa và bật/tắt trước khi gắn đề; không cho sửa câu hỏi đã gắn; cấm xóa cứng câu hỏi.

**Quyết định 2026-10-15:** Bỏ luồng duyệt, tạo `ready` ngay. Dữ liệu cũ `draft`/`pending`/`rejected` chuyển sang `disabled`; `approved` chuyển sang `ready`. Trạng thái `ready` chỉ khẳng định hình dạng dữ liệu hợp lệ, người soạn chịu trách nhiệm xác minh kiến thức và đáp án. `PUT` thay toàn bộ nội dung trước khi gắn đề; `PATCH /status` chuyển `ready ↔ disabled`. Phase 5 phải dùng cùng khóa dòng Question ở luồng gắn vào đề. Kết quả quality gates phải báo theo lần chạy của thay đổi này.

---

### Phase 5 — Mẫu Đề thi (Exam Template & Questions Assembly)
- **Mục tiêu**: Tạo đề thi mẫu, gán câu hỏi kèm số điểm và thứ tự, tự động cập nhật tổng điểm đề thi.
- **Phụ thuộc**: Phase 4.
- **Tệp tin ảnh hưởng**: `app/Models/Exam.php`, `app/Actions/Exams/AttachQuestionsToExamAction.php`.
- **Thay đổi CSDL**: Tạo bảng `exams`, bảng trung gian `exam_questions` (Unique `exam_id + question_id`, Check `points > 0`).
- **Endpoints**:
  - `POST /api/v1/exams`
  - `POST /api/v1/exams/{id}/questions`
- **Kiểm soát An ninh**: Chỉ cho phép gắn câu hỏi `status = 'ready'`; khóa dòng Question, kiểm tra lại trạng thái trong transaction để chống chạy đua với vô hiệu hóa. Tính tổng điểm tự động trong cùng transaction.
- **Tests**: `tests/Feature/Exams/ExamQuestionAssemblyTest.php`.
- **DoD**: Gắn câu hỏi tính đúng tổng điểm đề thi; chặn `disabled` và kiểm thử chạy đua với cập nhật trạng thái.

---

### Phase 6 — Ca thi & Lập lịch (Exam Sessions Lifecycle)
- **Tiến độ**: Hoàn thành (Completed 2026-10-21).
- **Mục tiêu**: Khởi tạo ca thi có thời gian bắt đầu/kết thúc, quản lý vòng đời `draft` $\rightarrow$ `published` $\rightarrow$ `closed`.
- **Phụ thuộc**: Phase 5.
- **Tệp tin ảnh hưởng**: `app/Models/ExamSession.php`, `app/Models/SessionAssignment.php`, `app/Models/SessionTeacher.php`, `app/Actions/ExamSessions/PublishSessionAction.php`, `app/Actions/ExamSessions/CloseSessionAction.php`, `app/Policies/ExamSessionPolicy.php`, `app/Http/Controllers/Api/V1/ExamSessionController.php`, `app/Http/Requests/ExamSessions/*`, `app/Http/Resources/ExamSessionResource.php`.
- **Thay đổi CSDL**: Tạo bảng `exam_sessions` (Check `end_at > start_at`), `session_assignments` (Unique `exam_session_id + student_id`), `session_teachers`.
- **Endpoints**: `GET/POST /api/v1/exam-sessions`, `GET /api/v1/exam-sessions/{id}`, `POST /api/v1/exam-sessions/{id}/publish`, `POST /api/v1/exam-sessions/{id}/close`.
- **Kiểm soát An ninh**: Bắt buộc kiểm tra điều kiện đề thi có câu hỏi và ca thi có thí sinh mới cho phép publish; khóa bi quan `SELECT ... FOR UPDATE` bảo vệ FSM; Policy chống IDOR.
- **Tests**: `tests/Feature/Sessions/ExamSessionLifecycleTest.php` (12 tests, 73 assertions, 100% PASS).
- **DoD**: Vòng đời ca thi hoạt động đúng FSM; từ chối bước chuyển trạng thái sai; 100% Feature Tests pass; Pint & Larastan level 5 clean.

---

### Phase 7 — Phân công Thí sinh & Giám thị (Assignments & Proctors)
- **Tiến độ**: Hoàn thành (Completed 2026-10-21).
- **Mục tiêu**: Phân bổ thí sinh và gán giám thị coi thi cho ca thi.
- **Phụ thuộc**: Phase 6.
- **Tệp tin ảnh hưởng**: `app/Models/SessionAssignment.php`, `app/Models/SessionTeacher.php`, `app/Actions/ExamSessions/AssignStudentsAction.php`, `app/Actions/ExamSessions/AssignTeachersAction.php`, `app/Policies/ExamSessionPolicy.php`, `app/Http/Controllers/Api/V1/ExamSessionController.php`, `app/Http/Controllers/Api/V1/StudentExamSessionController.php`, `app/Http/Requests/ExamSessions/*`, `app/Http/Requests/Students/*`, `app/Http/Resources/StudentAssignedSessionResource.php`.
- **Thay đổi CSDL**: Bảng `session_assignments` (Unique `exam_session_id + student_id`) và `session_teachers` (Unique `exam_session_id + teacher_id`) từ migration Phase 6.
- **Endpoints**: `POST /api/v1/exam-sessions/{id}/assign-students`, `POST /api/v1/exam-sessions/{id}/assign-teachers`, `GET /api/v1/student/assigned-sessions`.
- **Kiểm soát An ninh**: Chống trùng lặp phân công ở cấp database constraint; khóa dòng bi quan `SELECT ... FOR UPDATE`; Policy chống IDOR; Zero-leakage đáp án và câu hỏi trong resource của thí sinh.
- **Tests**: `tests/Feature/Sessions/AssignmentTest.php` (12 tests, 90 assertions, 100% PASS).
- **DoD**: Sinh viên xem được danh sách ca thi của chính mình; không thể bị gán trùng lặp (Idempotent BR-008); 100% Feature Tests pass; Pint & Larastan level 5 clean.

---

### Phase 8 — Phòng thi Trực tuyến & Lưu Đáp án (Exam Taking & Autosave)
- **Mục tiêu**: Thí sinh vào phòng thi, tải câu hỏi đề thi, lưu câu trả lời tự động (Autosave).
- **Phụ thuộc**: Phase 7.
- **Tệp tin ảnh hưởng**: `app/Models/ExamAttempt.php`, `app/Models/AttemptAnswer.php`, `app/Actions/Attempts/StartExamAttemptAction.php`, `app/Actions/Attempts/SaveAttemptAnswerAction.php`.
- **Thay đổi CSDL**: Tạo bảng `exam_attempts` và `attempt_answers`.
- **Endpoints**:
  - `POST /api/v1/exam-sessions/{id}/attempts`
  - `GET /api/v1/exam-attempts/{id}`
  - `PATCH /api/v1/exam-attempts/{id}/answers`
- **Kiểm soát An ninh**: Chặn IDOR qua Policy; đảm bảo tuyệt đối không trả về `correct_answer`; đồng hồ tính giờ chuẩn Server.
- **Tests**: `tests/Feature/Attempts/StartAttemptSecurityTest.php`, `tests/Feature/Attempts/SaveAnswerTest.php`.
- **DoD**: Thí sinh vào thi nhận đề thi sạch đáp án; thao tác lưu câu trả lời phản hồi dưới 100ms. *(Hoàn thành: 2026-10-21 — 16 Feature Tests PASS, Pint clean, PHPStan Level 5 clean).*

---

### Phase 9 — Nộp bài thi & Chấm điểm Tự động (Submit & Scoring Engine)
- **Mục tiêu**: Hoàn thiện luồng nộp bài có khóa bi quan `SELECT ... FOR UPDATE`, triệt tiêu Double Submit, tính điểm tự động.
- **Phụ thuộc**: Phase 8.
- **Tệp tin ảnh hưởng**: `app/Actions/Attempts/SubmitExamAttemptAction.php`, `app/Services/Scoring/AttemptScorer.php`.
- **Endpoints**: `POST /api/v1/exam-attempts/{id}/submit`.
- **Kiểm soát An ninh**: Khóa dòng CSDL độc quyền, kiểm tra trạng thái `in_progress`, header `Idempotency-Key`.
- **Tests**: `tests/Feature/Attempts/SubmitAttemptTest.php`, `tests/Unit/Scoring/AttemptScorerTest.php`.
- **DoD**: Nộp bài thành công, chấm đúng 100% điểm; gửi 2 request song song bị chặn mã `409 Conflict`.

---

### Phase 10 — Giám sát Phòng thi (Proctoring & Anomaly Detection)
- **Tiến độ**: Hoàn thành (Completed 2026-10-22).
- **Mục tiêu**: Tiếp nhận tín hiệu từ trình duyệt thí sinh, đánh giá rủi ro, cung cấp màn hình giám sát cho giám thị.
- **Phụ thuộc**: Phase 9.
- **Tệp tin ảnh hưởng**: `app/Models/ProctoringEvent.php`, `app/Enums/ProctoringEventType.php`, `app/Enums/ProctoringSeverity.php`, `app/Services/Proctoring/ProctoringSeverityResolver.php`, `app/Actions/Proctoring/RecordProctoringEventAction.php`, `app/Http/Controllers/Api/V1/ProctoringEventController.php`, `app/Http/Requests/Proctoring/RecordProctoringEventRequest.php`, `app/Http/Resources/ProctoringEventResource.php`, `app/Http/Resources/ProctoringSummaryResource.php`.
- **Thay đổi CSDL**: Tạo bảng `proctoring_events` (FK `attempt_id` CASCADE, composite index `idx_proctoring_attempt_severity`).
- **Endpoints**: `POST /api/v1/exam-attempts/{id}/proctoring-events`, `GET /api/v1/exam-sessions/{id}/proctoring-summary`, `GET /api/v1/exam-sessions/{id}/proctoring-events`.
- **Kiểm soát An ninh**: Rate Limiting 30 requests/phút/thí sinh; server tự gán severity; chống IDOR qua ExamAttemptPolicy và ExamSessionPolicy.
- **Tests**: `tests/Unit/Proctoring/ProctoringSeverityResolverTest.php`, `tests/Feature/Proctoring/RecordProctoringEventTest.php`, `tests/Feature/Proctoring/ProctoringSummaryTest.php` (19 tests, 48 assertions, 100% PASS).
- **DoD**: Tín hiệu vi phạm được lưu trữ, server tự tính mức độ nghiêm trọng; hiển thị tóm tắt và chi tiết vi phạm cho giám thị; Frontend tích hợp collector; Pint & Larastan level 5 clean.

---

### Phase 11 — Tối ưu hóa & Báo cáo Điểm số (Optimization & Analytics)
- **Mục tiêu**: Báo cáo phổ điểm, tối ưu hóa chỉ mục CSDL, audit N+1 queries.
- **Phụ thuộc**: Phase 10.
- **Endpoints**: `GET /api/v1/exam-sessions/{id}/results`.
- **Kiểm soát An ninh**: Chỉ giám thị ca thi và admin mới được xem toàn bộ bảng điểm (IDOR defense qua ExamSessionPolicy@viewResults).
- **Tests**: `tests/Feature/Statistics/SessionResultTest.php`, `tests/Unit/Analytics/SessionAnalyticsServiceTest.php` (15 tests, 233 assertions, 100% PASS).
- **DoD**: Đã hoàn thành. Endpoint `GET /api/v1/exam-sessions/{id}/results` cung cấp tổng quan phổ điểm, thống kê điểm số (Min, Max, Avg, Median, StdDev, Tỷ lệ Đạt/Trượt), biểu đồ phân phối điểm 5 buckets, phân tích câu hỏi (tỷ lệ trả lời đúng P và độ phân biệt D), và bảng điểm chi tiết kèm xếp loại học lực; phân quyền chống IDOR; audit N+1 query thành công với chỉ mục tối ưu; Pint & Larastan level 5 clean.

---

### Phase 12 — Chuẩn hóa Production & CI/CD (Production Hardening)
- **Tiến độ**: Hoàn thành (Completed 2026-10-22).
- **Mục tiêu**: Thiết lập pipeline GitHub Actions, tối ưu Dockerfile multi-stage, cấu hình Supervisor worker pool, Nginx Reverse Proxy Production, bảo mật toàn diện.
- **Phụ thuộc**: Phase 11.
- **Tệp tin ảnh hưởng / khởi tạo**:
  - `docker/php/Dockerfile.prod`: Multi-stage PHP 8.3-FPM Alpine với OPcache tuned, non-root user `www-data`, và đầy đủ extensions (PostgreSQL, Redis, PCNTL, BCMath).
  - `docker/php/supervisord.conf`: Quản lý 2 Laravel Queue Workers độc lập với auto-restart và log rotation.
  - `docker/nginx/default.prod.conf`: Nginx reverse proxy với HTTP Security Headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`), Rate Limiting 60r/s (API) và 10r/m (Auth), Gzip compression, fastcgi buffer tuning.
  - `docker/client/Dockerfile.prod`: Multi-stage Next.js 15 Standalone Runner với kích thước tối ưu (~120MB), user unprivileged `nextjs:nodejs`.
  - `docker-compose.prod.yml`: Bộ orchestration 6 dịch vụ hoàn chỉnh (`app`, `queue`, `web`, `client`, `postgres`, `redis`) với network segmentation và volume persistence.
  - `web-client/next.config.ts`: Cấu hình `output: 'standalone'` và reverse proxy `/api/backend/` chống CORS.
  - `.github/workflows/ci.yml`: Bổ sung job `docker-ci` kiểm tra tính hợp lệ của Docker Compose và cú pháp Dockerfiles.
- **Kiểm soát An ninh**:
  - Restrict Scramble/Swagger API docs qua `Gate::define('viewApiDocs')` chỉ cho phép môi trường `local` và `testing`.
  - Giấu hoàn toàn công nghệ backend (`expose_php=Off`, `server_tokens off`, `fastcgi_hide_header X-Powered-By`).
  - Phân vùng mạng (Network Segmentation): Client không thể kết nối trực tiếp đến PostgreSQL hay Redis.
  - Thí sinh không thể truy cập tài nguyên của thí sinh khác (IDOR defense đa tầng).
- **Tests & Quality Assurance**:
  - Backend: 159 Feature & Unit tests PASS 100% (1136 assertions).
  - Code Style: Laravel Pint clean (`pint --test` passed).
  - Phân tích tĩnh: Larastan Level 5 analyzed 87 files (`[OK] No errors`).
  - Frontend: `tsc --noEmit` clean, Next.js 15.5.27 build pass 100% (25/25 static & dynamic pages).
- **DoD**: 100% tests PASS trên cả Backend và Frontend; Container images được cấu hình chuẩn production multi-stage; Docker Compose production hoàn thiện; Sẵn sàng bàn giao vận hành!

---

### Phase 13 — Lớp Điều phối AI ExamOps & Tự động Hóa Soạn Đề (ExamOps AI Copilot & Blueprint Integration)
- **Tiến độ**: Hoàn thành (COMPLETED) — Full-stack Verification Clean.
- **Mục tiêu**: Tích hợp sâu chu trình điều phối AI 6 bước của `agentic-system` với `core-api/` và `web-client/`. Cho phép Giảng viên nhập mục tiêu sư phạm (Bloom, tỷ lệ độ khó, phân bổ chủ đề) $\rightarrow$ Agent sinh ma trận đề thi $\rightarrow$ Thẩm định số học $\rightarrow$ Dừng tại cổng duyệt Human-in-the-Loop (`WAITING_FOR_APPROVAL`) $\rightarrow$ Khi giảng viên Approve, tự động xuất bản đề thi mẫu (`Exam`) và gán câu hỏi trực tiếp vào CSDL `core-api`.
- **Phụ thuộc**: Phase 5, Phase 12, `agentic-system/`.
- **Tệp tin ảnh hưởng**:
  - `agentic-system/src/examops/platform_client.py`, `agentic-system/tests/evals/test_eval_suite.py`
  - `web-client/src/features/examops/*`, `web-client/src/app/(workspace)/teacher/ai-assistant/page.tsx`, `web-client/src/app/api/examops/[...path]/route.ts`
  - `core-api/database/migrations/2026_10_23_000001_create_ai_generation_logs_table.php`, `core-api/app/Models/AiGenerationLog.php`, `core-api/app/Models/Exam.php`
  - `core-api/app/Actions/Exams/GenerateExamFromBlueprintAction.php`, `core-api/app/Http/Controllers/Api/V1/ExamController.php`, `core-api/app/Http/Requests/Exams/StoreExamFromBlueprintRequest.php`, `core-api/app/Http/Resources/ExamResource.php`, `core-api/app/Policies/ExamPolicy.php`, `core-api/routes/api.php`
- **Thay đổi CSDL**: Bổ sung bảng `ai_generation_logs` (`id`, `thread_id`, `actor_id`, `prompt_hash`, `proposal_hash`, `generated_exam_id`, `status`, `metadata` JSONB, index `idx_ai_logs_actor_thread`, unique index `unique_thread_proposal` chống replay).
- **Endpoints**:
  - `POST /api/v1/exams/from-blueprint` (Tiếp nhận proposal đã duyệt từ Human Review Gate để sinh Exam thật trong CSDL)
  - `GET /api/v1/exams/{id}/readiness-review` (Thẩm định độ sẵn sàng của đề thi hiện hữu qua Agent Tool)
- **Kiểm soát An ninh**:
  - Giảng viên chỉ được tạo đề cho môn học mình phụ trách (kiểm tra `SubjectPolicy@createInSubject`).
  - Xác thực chữ ký số học `proposal_hash` SHA-256 bất biến ngăn chặn thay đổi nội dung giữa bước duyệt và bước ghi.
  - Fail-closed: AI tuyệt đối không có quyền truy cập trực tiếp database PostgreSQL, mọi thao tác ghi đều thông qua REST API có xác thực Sanctum Token của Giảng viên.
  - Chống deadlock bằng cách sắp xếp và khóa câu hỏi theo thứ tự ID tăng dần (`Question::whereIn('id', $ids)->orderBy('id')->lockForUpdate()`).
  - Chống replay bằng khóa bi quan `AiGenerationLog` và ràng buộc `unique_thread_proposal` $\rightarrow$ 409 Conflict.
- **Tests**:
  - Backend: `GenerateExamFromBlueprintTest.php` (11 tests pass 100%), tổng 170 feature tests pass (1186 assertions).
  - Agentic System: `test_eval_suite.py` (36 tests pass 100% in 0.75s), mypy strict & ruff clean.
  - Frontend: `tsc --noEmit` clean 0 errors, Next.js production build pass (26/26 pages).
- **DoD**: Giảng viên bấm Approve trên giao diện Next.js $\rightarrow$ Đề thi mới xuất hiện ngay trong CSDL Core API với đầy đủ câu hỏi và thang điểm chính xác; 100% tests PASS; Larastan Level 5 clean.

---

### Phase 14 — Nhập Ngân Hàng Câu Hỏi Hàng Loạt & Xuất Bản Báo Cáo, Bảng Điểm Khảo Thí (Bulk Question Import & Official Reporting)
- **Tiến độ**: Đã phê duyệt đặc tả (SPEC APPROVED) — Tính năng nghiệp vụ khảo thí cốt lõi chuẩn doanh nghiệp.
- **Mục tiêu**:
  1. Cho phép Giảng viên nạp hàng trăm câu hỏi vào ngân hàng đề từ file Excel (`.xlsx`) hoặc tệp chuẩn Aiken/Word: có template chuẩn hóa, validation theo từng dòng, phân loại lỗi chi tiết (dòng nào sai cú pháp, thiếu đáp án, sai loại câu), và nạp an toàn trong Database Transaction.
  2. Cung cấp bộ công cụ xuất bản tài liệu khảo thí chuyên nghiệp cho Phòng Khảo thí & Giảng viên:
     - Xuất Bảng điểm ca thi ra file Excel (`.xlsx`) kèm phân loại xếp loại, điểm số, thời gian làm bài, vi phạm giám sát.
     - Xuất Bảng điểm chính thức & Biên bản coi thi ra file PDF in ấn có tiêu đề trường học và chữ ký cán bộ coi thi.
     - Xuất Đề thi và Phiếu trả lời trắc nghiệm ra PDF (hỗ trợ thi dự phòng trên giấy hoặc lưu trữ học thuật).
     - Xuất Báo cáo Phổ điểm & Phân tích chất lượng câu hỏi (Độ khó $P$, Độ phân biệt $D$) ra Excel phục vụ thẩm định chất lượng đào tạo.
- **Phụ thuộc**: Phase 4 (Ngân hàng câu hỏi), Phase 11 (Báo cáo kết quả ca thi), Phase 12 (Production Container).
- **Tệp tin ảnh hưởng / khởi tạo**:
  - `core-api/app/Services/Excel/QuestionImportService.php`
  - `core-api/app/Services/Export/ExamSessionExcelExport.php`
  - `core-api/app/Services/Export/ExamSessionPdfExport.php`
  - `core-api/app/Http/Controllers/Api/V1/QuestionImportController.php`
  - `core-api/app/Http/Controllers/Api/V1/ExamExportController.php`
  - `web-client/src/features/questions/components/QuestionImportModal.tsx`
  - `web-client/src/features/results/components/ExportReportButtons.tsx`
- **Thay đổi CSDL**: Không phát sinh thêm bảng mới; sử dụng bảng `questions` (ghi nhận `source = 'excel_import'`), `exam_sessions`, `exam_attempts`, `attempt_answers`.
- **Endpoints**:
  - `GET /api/v1/questions/import/template`: Tải về file mẫu Excel chuẩn để giảng viên soạn câu hỏi.
  - `POST /api/v1/questions/import/validate`: Thẩm định file Excel tải lên, kiểm tra cú pháp, trả về preview số dòng hợp lệ và chi tiết các dòng lỗi.
  - `POST /api/v1/questions/import`: Thực thi import toàn bộ câu hỏi hợp lệ trong 1 Transaction.
  - `GET /api/v1/exam-sessions/{id}/export/excel`: Tải về file Excel bảng điểm ca thi đầy đủ.
  - `GET /api/v1/exam-sessions/{id}/export/pdf`: Tải về file PDF biên bản điểm ca thi chính thức chuẩn in ấn.
  - `GET /api/v1/exams/{id}/export/pdf`: Xuất đề thi ra PDF (tùy chọn kèm/không kèm đáp án).
- **Kiểm soát An ninh**:
  - Upload security: Giới hạn dung lượng upload (tối đa 10MB), xác thực MIME type nhị phân (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`), ngăn ngừa Zip Bomb (XML entity expansion) và file độc hại.
  - Phân quyền IDOR: Giảng viên chỉ được import câu hỏi vào Môn học mình phụ trách (`SubjectPolicy@importQuestions`); chỉ được xuất bảng điểm ca thi mà mình phụ trách hoặc được phân công coi thi (`ExamSessionPolicy@exportResults`).
  - Dữ liệu export được lấy từ Snapshot của CSDL có kiểm soát transaction và eager loading chống N+1.
- **Tests**: `tests/Feature/Questions/QuestionImportTest.php`, `tests/Feature/Exams/ExamExportTest.php`.
- **DoD**: Giảng viên tải file Excel 100 câu hỏi $\rightarrow$ preview lỗi trực quan $\rightarrow$ import thành công vào ngân hàng câu hỏi trong CSDL; Xuất bảng điểm ca thi ra file `.xlsx` và `.pdf` mở được trên Excel/Acrobat với định dạng bảng biểu sắc nét; 100% tests PASS; Larastan Level 5 clean.



