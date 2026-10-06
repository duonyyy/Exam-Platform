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

## 2. Chi tiết 12 Giai đoạn Triển khai (Phase-by-Phase Roadmap)

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
- **Tệp tin ảnh hưởng**: `app/Http/Controllers/Api/V1/AuthController.php`, `app/Http/Requests/Auth/RegisterRequest.php`, `app/Http/Requests/Auth/LoginRequest.php`, `app/Http/Resources/UserResource.php`, `app/Http/Middleware/RoleMiddleware.php`, `routes/api.php`.
- **Thay đổi CSDL**: Sử dụng bảng `users` (`role`, `is_active`, `code`) và `personal_access_tokens`.
- **Endpoints**:
  - `POST /api/v1/auth/register` (Tạo tài khoản thí sinh)
  - `POST /api/v1/auth/login` (Xác thực & cấp Bearer token)
  - `POST /api/v1/auth/logout` (Thu hồi token hiện tại)
  - `GET /api/v1/auth/me` (Lấy thông tin cá nhân & role)
- **Kiểm soát An ninh**: Băm mật khẩu bằng Bcrypt/Hash, Rate Limiting 5 lần/phút cho login (`throttle:5,1`), thu hồi token khi logout, chặn tài khoản bị vô hiệu hóa (`is_active = false`).
- **Tests**: `tests/Feature/Auth/RegisterTest.php`, `tests/Feature/Auth/LoginTest.php`, `tests/Feature/Auth/LogoutTest.php`, `tests/Feature/Auth/MeTest.php`, `tests/Feature/RoleMiddlewareTest.php`.
- **DoD**: Đăng nhập/đăng xuất hoạt động; cấp Sanctum token; phân quyền chặn đúng mã `403` khi thí sinh gọi route quản trị; 100% Feature Tests pass.

---

### Phase 3 — Quản lý Môn học & Chủ đề (Subjects & Topics)
- **Mục tiêu**: Quản lý danh mục Môn học và Chủ đề kiến thức.
- **Phụ thuộc**: Phase 2.
- **Tệp tin ảnh hưởng**: `app/Models/Subject.php`, `app/Models/Topic.php`, `app/Http/Controllers/Api/V1/SubjectController.php`.
- **Thay đổi CSDL**: Tạo bảng `subjects` (Unique `code`), `topics` (FK `subject_id` với `ON DELETE RESTRICT`).
- **Endpoints**: `GET/POST/PATCH/DELETE /api/v1/subjects`, `GET /api/v1/subjects/{id}/topics`.
- **Kiểm soát An ninh**: Chỉ `admin` và `teacher` mới có quyền tạo/sửa/xóa; sinh viên chỉ có quyền đọc.
- **Tests**: `tests/Feature/Subjects/SubjectCrudTest.php`.
- **DoD**: CRUD môn học/chủ đề hoạt động kèm phân trang và tìm kiếm.

---

### Phase 4 — Ngân hàng Câu hỏi & Kiểm duyệt (Question Bank & Review)
- **Mục tiêu**: Quản lý ngân hàng câu hỏi 4 định dạng, lưu trữ options/correct_answer dạng JSONB, quy trình duyệt câu hỏi.
- **Phụ thuộc**: Phase 3.
- **Tệp tin ảnh hưởng**: `app/Models/Question.php`, `app/Enums/QuestionType.php`, `app/Http/Resources/QuestionAdminResource.php`, `app/Http/Resources/QuestionStudentResource.php`.
- **Thay đổi CSDL**: Tạo bảng `questions` với các cột JSONB và Soft Deletes (`deleted_at`).
- **Endpoints**:
  - `GET/POST /api/v1/questions`
  - `POST /api/v1/questions/{id}/approve`
  - `POST /api/v1/questions/{id}/reject`
- **Kiểm soát An ninh**: Form Request validate chặt chẽ cấu trúc JSON options và correct_answer; phân tách tuyệt đối giữa `QuestionAdminResource` và `QuestionStudentResource`.
- **Tests**: `tests/Feature/Questions/QuestionValidationTest.php`, `tests/Feature/Questions/QuestionReviewTest.php`.
- **DoD**: Tạo câu hỏi, duyệt câu hỏi hoạt động chuẩn; cấm xóa cứng câu hỏi.

---

### Phase 5 — Mẫu Đề thi (Exam Template & Questions Assembly)
- **Mục tiêu**: Tạo đề thi mẫu, gán câu hỏi kèm số điểm và thứ tự, tự động cập nhật tổng điểm đề thi.
- **Phụ thuộc**: Phase 4.
- **Tệp tin ảnh hưởng**: `app/Models/Exam.php`, `app/Actions/Exams/AttachQuestionsToExamAction.php`.
- **Thay đổi CSDL**: Tạo bảng `exams`, bảng trung gian `exam_questions` (Unique `exam_id + question_id`, Check `points > 0`).
- **Endpoints**:
  - `POST /api/v1/exams`
  - `POST /api/v1/exams/{id}/questions`
- **Kiểm soát An ninh**: Chỉ cho phép gán câu hỏi có `status = 'approved'`. Tính tổng điểm tự động trong Database Transaction.
- **Tests**: `tests/Feature/Exams/ExamQuestionAssemblyTest.php`.
- **DoD**: Gán câu hỏi tính đúng tổng điểm đề thi; chặn gán câu hỏi chưa duyệt.

---

### Phase 6 — Ca thi & Lập lịch (Exam Sessions Lifecycle)
- **Mục tiêu**: Khởi tạo ca thi có thời gian bắt đầu/kết thúc, quản lý vòng đời `draft` $\rightarrow$ `published` $\rightarrow$ `closed`.
- **Phụ thuộc**: Phase 5.
- **Tệp tin ảnh hưởng**: `app/Models/ExamSession.php`, `app/Actions/ExamSessions/PublishSessionAction.php`.
- **Thay đổi CSDL**: Tạo bảng `exam_sessions` (Check `end_at > start_at`).
- **Endpoints**: `POST /api/v1/exam-sessions`, `POST /api/v1/exam-sessions/{id}/publish`, `POST /api/v1/exam-sessions/{id}/close`.
- **Kiểm soát An ninh**: Bắt buộc kiểm tra điều kiện đề thi có câu hỏi và ca thi có thí sinh mới cho phép publish.
- **Tests**: `tests/Feature/Sessions/ExamSessionLifecycleTest.php`.
- **DoD**: Vòng đời ca thi hoạt động đúng FSM; từ chối bước chuyển trạng thái sai.

---

### Phase 7 — Phân công Thí sinh & Giám thị (Assignments & Proctors)
- **Mục tiêu**: Phân bổ thí sinh và gán giám thị coi thi cho ca thi.
- **Phụ thuộc**: Phase 6.
- **Tệp tin ảnh hưởng**: `app/Models/SessionAssignment.php`, `app/Models/SessionTeacher.php`.
- **Thay đổi CSDL**: Tạo bảng `session_assignments` (Unique `session_id + student_id`) và `session_teachers`.
- **Endpoints**: `POST /api/v1/exam-sessions/{id}/assign-students`, `GET /api/v1/student/assigned-sessions`.
- **Kiểm soát An ninh**: Chống trùng lặp phân công ở cấp database constraint.
- **Tests**: `tests/Feature/Sessions/AssignmentTest.php`.
- **DoD**: Sinh viên xem được danh sách ca thi của chính mình; không thể bị gán trùng lặp.

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
- **DoD**: Thí sinh vào thi nhận đề thi sạch đáp án; thao tác lưu câu trả lời phản hồi dưới 100ms.

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
- **Mục tiêu**: Tiếp nhận tín hiệu từ trình duyệt thí sinh, đánh giá rủi ro, cung cấp màn hình giám sát cho giám thị.
- **Phụ thuộc**: Phase 9.
- **Tệp tin ảnh hưởng**: `app/Models/ProctoringEvent.php`, `app/Http/Controllers/Api/V1/ProctoringEventController.php`.
- **Thay đổi CSDL**: Tạo bảng `proctoring_events`.
- **Endpoints**: `POST /api/v1/exam-attempts/{id}/proctoring-events`, `GET /api/v1/exam-sessions/{id}/proctoring-summary`.
- **Kiểm soát An ninh**: Rate Limiting 30 requests/phút/thí sinh; server tự gán severity.
- **Tests**: `tests/Feature/Proctoring/RecordProctoringEventTest.php`.
- **DoD**: Tín hiệu vi phạm được lưu trữ và hiển thị trên bảng điều khiển giám thị.

---

### Phase 11 — Tối ưu hóa & Báo cáo Điểm số (Optimization & Analytics)
- **Mục tiêu**: Báo cáo phổ điểm, tối ưu hóa chỉ mục CSDL, audit N+1 queries.
- **Phụ thuộc**: Phase 10.
- **Endpoints**: `GET /api/v1/exam-sessions/{id}/results`.
- **Kiểm soát An ninh**: Chỉ giám thị ca thi và admin mới được xem toàn bộ bảng điểm.
- **Tests**: `tests/Feature/Statistics/SessionResultTest.php`.
- **DoD**: Không có câu truy vấn N+1; thời gian tải bảng điểm dưới 200ms cho ca thi 500 sinh viên.

---

### Phase 12 — Chuẩn hóa Production & CI/CD (Production Hardening)
- **Mục tiêu**: Thiết lập pipeline GitHub Actions, tối ưu Dockerfile multi-stage, kiểm tra an ninh toàn diện.
- **Phụ thuộc**: Phase 11.
- **DoD**: 100% tests PASS trên CI; Docker build thành công; bản thiết kế sẵn sàng bàn giao cho người dùng.
