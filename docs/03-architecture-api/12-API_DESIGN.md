# 12 — API Design & Contract Specification

**Dự án**: Exam Platform  
**Tài liệu**: `docs/03-architecture-api/12-API_DESIGN.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. Nguyên tắc Thiết kế Giao diện Lập trình (API Design Principles)

1. **RESTful Architecture**: Áp dụng triệt để các động từ HTTP (`GET`, `POST`, `PATCH`, `DELETE`) trên các danh từ đại diện cho tài nguyên (`/subjects`, `/questions`, `/exams`, `/exam-sessions`, `/exam-attempts`).
2. **Business Action Endpoints**: Với các quy trình nghiệp vụ phức tạp không thuộc CRUD thông thường, thiết kế rõ ràng dưới dạng RPC-style hành động:
   - `PUT /questions/{id}` & `PATCH /questions/{id}/status` (chỉnh sửa và bật/tắt câu hỏi trước khi gắn đề)
   - `POST /exam-sessions/{id}/publish` & `POST /exam-sessions/{id}/close`
   - `POST /exam-sessions/{id}/attempts` (Khởi tạo lượt thi)
   - `PATCH /exam-attempts/{id}/answers` (Lưu đáp án)
   - `POST /exam-attempts/{id}/submit` (Nộp bài thi)
3. **Envelope Chuẩn hóa**:
   - Đối tượng đơn: `{"data": { ... }}`
   - Tập hợp phân trang: `{"data": [ ... ], "meta": { "current_page": 1, "per_page": 20, "total": 150 }, "links": { ... }}`
   - Lỗi chuẩn hóa: `{"message": "Validation failed.", "errors": { "field": ["Chi tiết lỗi"] }}`
4. **Không Expose Raw Eloquent Models**: Bắt buộc tuần tự hóa qua Laravel API Resources. Sử dụng `QuestionStudentResource` đối với thí sinh để triệt tiêu nguy cơ rò rỉ trường `correct_answer`.

---

## 2. Bảng Danh mục API Toàn hệ thống (API Inventory)

| Endpoint | HTTP Method | Actor chính | Yêu cầu Auth | Tóm tắt Chức năng | Trạng thái HTTP Thành công |
| :--- | :---: | :--- | :---: | :--- | :---: |
| `/api/v1/auth/register` | `POST` | Public | Không | Đăng ký tài khoản sinh viên mới | `201 Created` |
| `/api/v1/auth/login` | `POST` | Public | Không | Đăng nhập và nhận Sanctum Token | `200 OK` |
| `/api/v1/auth/logout` | `POST` | All | Bearer | Đăng xuất và thu hồi Token hiện tại | `200 OK` |
| `/api/v1/auth/me` | `GET` | All | Bearer | Lấy thông tin tài khoản hiện tại | `200 OK` |
| `/api/v1/users` | `GET` | Admin | Bearer (admin) | Xem danh sách người dùng toàn trường | `200 OK` |
| `/api/v1/users` | `POST` | Admin | Bearer (admin) | Tạo tài khoản người dùng mới | `201 Created` |
| `/api/v1/users/{id}` | `PATCH` | Admin | Bearer (admin) | Cập nhật thông tin/vai trò người dùng | `200 OK` |
| `/api/v1/subjects` | `GET` | All | Bearer | Danh sách môn học có phân trang | `200 OK` |
| `/api/v1/subjects` | `POST` | Teacher, Admin | Bearer | Tạo môn học mới | `201 Created` |
| `/api/v1/subjects/{id}` | `GET` | All | Bearer | Xem chi tiết môn học | `200 OK` |
| `/api/v1/subjects/{id}` | `PATCH` | Admin, teacher phụ trách | Bearer | Cập nhật môn học; chỉ admin được đổi người phụ trách | `200 OK` |
| `/api/v1/subjects/{id}` | `DELETE` | Admin, teacher phụ trách | Bearer | Xóa môn rỗng; `409` nếu đã có chủ đề | `204 No Content` |
| `/api/v1/subjects/{id}/topics` | `GET` | All | Bearer | Xem các chủ đề của một môn học | `200 OK` |
| `/api/v1/subjects/{id}/topics` | `POST` | Admin, teacher phụ trách | Bearer | Tạo chủ đề trong môn học | `201 Created` |
| `/api/v1/questions` | `GET` | Teacher, Admin | Bearer | Tra cứu ngân hàng câu hỏi | `200 OK` |
| `/api/v1/questions` | `POST` | Teacher, Admin | Bearer | Tạo câu hỏi mới vào ngân hàng đề | `201 Created` |
| `/api/v1/questions/{id}` | `PUT` | Admin, teacher phụ trách | Bearer | Thay toàn bộ nội dung câu hỏi chưa gắn đề | `200 OK` |
| `/api/v1/questions/{id}/status` | `PATCH` | Admin, teacher phụ trách | Bearer | Chuyển `ready ↔ disabled` trước khi gắn đề | `200 OK` |

| `/api/v1/exams` | `GET` | Teacher, Admin | Bearer | Danh sách đề thi mẫu | `200 OK` |
| `/api/v1/exams` | `POST` | Teacher, Admin | Bearer | Tạo mẫu đề thi mới | `201 Created` |
| `/api/v1/exams/{id}/questions` | `POST` | Teacher, Admin | Bearer | Gán câu hỏi vào đề và gán điểm số | `200 OK` |
| `/api/v1/exam-sessions` | `GET` | Teacher, Admin | Bearer | Danh sách ca thi có phân trang và lọc theo trạng thái | `200 OK` |
| `/api/v1/exam-sessions` | `POST` | Teacher, Admin | Bearer | Tạo ca thi cụ thể theo lịch trình | `201 Created` |
| `/api/v1/exam-sessions/{id}` | `GET` | Teacher, Admin | Bearer | Xem thông tin chi tiết ca thi | `200 OK` |
| `/api/v1/exam-sessions/{id}/publish` | `POST` | Teacher, Admin | Bearer | Xuất bản ca thi đón thí sinh | `200 OK` |
| `/api/v1/exam-sessions/{id}/close` | `POST` | Teacher, Admin | Bearer | Đóng ca thi khi hết giờ | `200 OK` |
| `/api/v1/exam-sessions/{id}/assign-students` | `POST` | Teacher, Admin | Bearer | Phân công danh sách thí sinh vào ca | `200 OK` |
| `/api/v1/student/assigned-sessions` | `GET` | Student | Bearer (student)| Thí sinh xem danh sách ca thi của mình | `200 OK` |
| `/api/v1/exam-sessions/{id}/attempts` | `POST` | Student | Bearer (student)| Thí sinh bắt đầu vào phòng thi | `201 Created` |
| `/api/v1/exam-attempts/{id}` | `GET` | Student (owner) | Bearer (student)| Tải câu hỏi đề thi (không có đáp án) | `200 OK` |
| `/api/v1/exam-attempts/{id}/answers` | `PATCH` | Student (owner) | Bearer (student)| Tự động lưu câu trả lời (Autosave) | `200 OK` |
| `/api/v1/exam-attempts/{id}/submit` | `POST` | Student (owner) | Bearer (student)| Nộp bài thi và kích hoạt tính điểm | `200 OK` |
| `/api/v1/exam-attempts/{id}/proctoring-events` | `POST` | Student (owner) | Bearer (student)| Gửi tín hiệu vi phạm từ trình duyệt | `201 Created` |
| `/api/v1/exam-sessions/{id}/results` | `GET` | Teacher, Admin | Bearer | Xem bảng điểm và thống kê ca thi | `200 OK` |

---

### Phase 4 Question API hiện thực (2026-10-15)

Các route dùng `auth:sanctum`, `active`, `role:teacher,admin`. `GET /questions` nhận `page` và `per_page` (1–100, mặc định 20), trả `data`, `links`, `meta`; admin xem toàn bộ câu hỏi chưa xóa mềm, teacher chỉ xem câu hỏi thuộc Subject mà mình đang là `owner_teacher_id`. Không có Question API cho student.

`POST /questions` bắt buộc `topic_id` (integer), `question_text` (chuỗi không rỗng, tối đa 10000 ký tự), `question_type` (`single_choice`, `multiple_choice`, `true_false`, `short_answer`), `difficulty` (`easy`, `medium`, `hard`) và `correct_answer`; `explanation` tùy chọn. Ba loại trắc nghiệm yêu cầu `options` là danh sách ít nhất 2 phần tử `{id: string, content: string}` với ID duy nhất; đáp án đơn là một ID, đáp án nhiều là danh sách ID không rỗng/không trùng, mọi ID phải có trong options. `short_answer` nhận đáp án chuỗi không rỗng và không nhận `options`. Teacher chỉ tạo trong Topic thuộc Subject mình phụ trách. Máy chủ ghi `created_by`, `status=ready`, `source=manual`; request chứa `subject_id`, `created_by`, `updated_by`, `status`, `source`, `rejection_reason`, `deleted_at` bị từ chối `422`.

Response `201` và response danh sách dùng `QuestionAdminResource` trong `data`: `id`, `topic_id`, `question_text`, `question_type`, `options`, `correct_answer`, `explanation`, `difficulty`, `status`, `source`, `created_by`, `updated_by`, `created_at`, `updated_at`. `QuestionStudentResource` là lớp tuần tự hóa dự phòng cho Phase thi, chỉ có `id`, `question_text`, `question_type`, `options[{id,content}]`; chưa có endpoint student trả câu hỏi.

`PUT /questions/{id}` nhận đầy đủ các trường nội dung như `POST` và cùng `topic_id` hiện tại. `PATCH /questions/{id}/status` chỉ nhận `{ "status": "ready" | "disabled" }`; gửi lại trạng thái hiện tại là thao tác idempotent. Cả hai khóa dòng Question, kiểm tra lại quyền trên Subject và từ chối `409` với `error_code=QUESTION_ALREADY_IN_EXAM` nếu đã có liên kết trong `exam_questions`. Response `200` dùng `QuestionAdminResource`; thiếu/sai input `422`, không có quyền `403`, không tồn tại `404`, chưa xác thực `401`.

**Ranh giới Phase 5:** Khi triển khai gắn câu hỏi vào đề, Action phải khóa cùng dòng Question, kiểm tra lại `status=ready` trong transaction rồi mới ghi `exam_questions`. Nếu bỏ khóa, thao tác gắn có thể chạy đua với `PATCH /status`. Chưa có endpoint xóa mềm Question; `disabled` là cách rút câu hỏi chưa dùng khỏi tập câu hỏi có thể gắn.

### Hợp đồng Phase 5: Exam Template & Assembly

- `GET /exams`: Admin thấy mọi đề; teacher chỉ thấy đề thuộc Subject mình đang phụ trách. `page`, `per_page` (1–100, mặc định 20), response Resource phân trang gồm `questions_count`, không tải nội dung hoặc đáp án câu hỏi.
- `POST /exams`: body bắt buộc `subject_id`, `title` (tối đa 255), `duration_minutes` (1–10080), `pass_score` (không âm, tối đa 2 chữ số thập phân), `shuffle_questions`, `shuffle_options` (boolean). Teacher chỉ tạo trong Subject đang phụ trách; Admin có thể tạo trong mọi Subject. `created_by` và `total_points` do server ghi. Response `201` dùng `ExamResource`.
- `POST /exams/{exam}/questions`: body `{ "questions": [{ "question_id": 1, "order": 1, "points": 1.25 }] }`, tối đa 100 mục. ID và thứ tự dương, không lặp trong batch; điểm dương, tối đa 2 chữ số thập phân. Chỉ nhận Question còn tồn tại, chưa xóa mềm, `ready`, cùng Subject. Action khóa Exam, các Question theo ID tăng dần, rồi Subject để kiểm tra quyền hiện tại; thao tác ghi và cập nhật `total_points` nằm trong một transaction. Gửi lại cùng ID/thứ tự/điểm là idempotent (`200`); thay đổi mục đã gắn hoặc chiếm thứ tự trả `409 EXAM_QUESTION_CONFLICT`. Câu hỏi không khả dụng trả `422 QUESTION_NOT_AVAILABLE`. Không có API sửa điểm/gỡ câu hỏi trong Phase 5.

### Hợp đồng Phase 6: Ca thi & Lập lịch (Exam Sessions Lifecycle)

- `GET /exam-sessions`: Lấy danh sách ca thi có phân trang. Query parameters: `page`, `per_page` (1–100, mặc định 20), `status` (`draft`, `published`, `closed`, `cancelled`), `exam_id`. Admin thấy toàn bộ ca thi; Teacher chỉ thấy ca thi mình tạo, ca thi thuộc Subject mình phụ trách, hoặc ca thi mình được phân công trong `session_teachers`. Response dạng `ExamSessionResource` tập hợp có `assigned_students_count` và `teachers_count`.
- `POST /exam-sessions`: body bắt buộc `exam_id` (integer), `title` (chuỗi tối đa 255), `start_at` (chuỗi ISO 8601), `end_at` (chuỗi ISO 8601, sau `start_at`). Tùy chọn: `allow_late_minutes` (0–1440, mặc định 15), `max_attempts` (1–10, mặc định 1). Nghiêm cấm gửi `status` hoặc `created_by` (`missing`). Kiểm tra quy tắc `BR-005`: `(end_at - start_at) >= exam.duration_minutes`, vi phạm trả về `422`. Teacher chỉ tạo ca thi cho đề thi thuộc môn mình phụ trách; Admin tạo cho mọi đề thi. Tạo mới luôn ở trạng thái `status=draft`. Response `201 Created` dùng `ExamSessionResource`.
- `GET /exam-sessions/{id}`: Xem thông tin chi tiết ca thi kèm quan hệ `exam`, số lượng thí sinh và giám thị. Trả về `403` nếu Teacher không có quyền truy cập ca thi.
- `POST /exam-sessions/{id}/publish`: Xuất bản ca thi. Action thực thi `DB::transaction()` kèm khóa dòng bi quan `SELECT ... FOR UPDATE`. Kiểm tra FSM: chỉ ca thi đang `draft` mới được publish (`409 INVALID_STATE_TRANSITION` nếu sai). Kiểm tra hạn thi: từ chối nếu `now >= end_at` (`422 SESSION_EXPIRED`). Kiểm tra quy tắc `BR-006`: đề thi phải có ít nhất 01 câu hỏi (`409 EXAM_EMPTY`) và ca thi phải có ít nhất 01 thí sinh được phân công (`409 NO_STUDENTS_ASSIGNED`). Cập nhật `status=published`. Response `200 OK` dùng `ExamSessionResource`.
- `POST /exam-sessions/{id}/close`: Đóng ca thi. Action thực thi `DB::transaction()` kèm khóa dòng bi quan `SELECT ... FOR UPDATE`. Kiểm tra FSM: chỉ ca thi đang `published` mới được đóng (`409 INVALID_STATE_TRANSITION` nếu sai). Cập nhật `status=closed`. Response `200 OK` dùng `ExamSessionResource`.

### Hợp đồng Phase 7: Phân công Thí sinh & Giám thị (Assignments & Invigilation)

- `POST /exam-sessions/{id}/assign-students`: body bắt buộc `student_ids` (mảng integer dương, 1–500 phần tử, distinct). Mọi ID phải thuộc bảng `users` với `role = 'student'` và `is_active = true`; vi phạm trả về `422 Unprocessable`. Thao tác mở `DB::transaction()` kèm khóa dòng bi quan `SELECT ... FOR UPDATE`. Kiểm tra FSM: ca thi ở trạng thái `closed` hoặc `cancelled` sẽ bị từ chối `409 SESSION_CLOSED_FOR_ASSIGNMENT`. Áp dụng `insertOrIgnore` trên `session_assignments` để đảm bảo tính Idempotency (`BR-008`). Response `200 OK`: `{"message": "Phân công thí sinh thành công.", "data": {"exam_session_id": 1, "assigned_count": 3, "total_assigned_students": 15}}`.
- `POST /exam-sessions/{id}/assign-teachers`: body bắt buộc `teacher_ids` (mảng integer dương, 1–50 phần tử, distinct). Tùy chọn: `role_in_session` (string, tối đa 50, mặc định `proctor`). Mọi ID phải thuộc bảng `users` với `role = 'teacher'` và `is_active = true`; vi phạm trả về `422`. Chỉ Admin, người tạo ca thi hoặc giảng viên phụ trách môn học mới được phân công cán bộ coi thi (`ExamSessionPolicy@assignTeachers`). Khóa dòng bi quan, từ chối `409` nếu ca thi đã đóng/hủy. Ghi nhận idempotent qua `insertOrIgnore`. Response `200 OK`: `{"message": "Phân công cán bộ coi thi thành công.", "data": {"exam_session_id": 1, "assigned_count": 2, "total_teachers": 3}}`.
- `GET /student/assigned-sessions`: Endpoint dành riêng cho Thí sinh (`role:student`). Query parameters: `page`, `per_page` (1–100, mặc định 20), `status` (`published`, `closed`). Truy vấn ràng buộc trực tiếp theo `Auth::id()` trên quan hệ `session_assignments`. Ẩn các ca thi `draft` để bảo vệ ranh giới FSM. Response phân trang dạng `StudentAssignedSessionResource` gồm: `id`, `exam_id`, `title`, `status`, `start_at`, `end_at`, `allow_late_minutes`, `max_attempts`, `assigned_at`, `exam` (`id`, `title`, `duration_minutes`, `total_points`, `pass_score`, `subject` (`id`, `code`, `name`)). Tuyệt đối không trả về `questions` hay `correct_answer` (Zero-Leakage Policy).

### Quyền và dữ liệu Subject

- `POST /subjects`: body bắt buộc `code` (chuỗi tối đa 50, duy nhất), `name` (chuỗi tối đa 255); `description` tùy chọn. Admin có thể gửi `owner_teacher_id` là ID của teacher đang hoạt động hoặc `null`. Teacher luôn tự nhận phụ trách; không thể tự chỉ định người khác.
- `PATCH /subjects/{id}`: các trường `code`, `name`, `description` là tùy chọn; chỉ admin có thể gửi `owner_teacher_id` để phân công lại hoặc bỏ phân công. `created_by` luôn do máy chủ ghi, không nhận từ client.
- `GET /subjects`: `search` (tên/mã), `page`, `per_page` (1–100, mặc định 20); mọi vai trò đã đăng nhập được đọc. Response chứa `data`, `meta`, `links` và `topics_count`.
- Môn chưa phân công chỉ admin được sửa/xóa. Khi admin chuyển quyền phụ trách, teacher cũ mất quyền ngay từ giao dịch tiếp theo. Quyền ghi được kiểm tra lại trên bản ghi khóa bằng `SELECT ... FOR UPDATE`.

### Quyền và dữ liệu Topic

- `GET /subjects/{id}/topics`: `page`, `per_page` (1–100, mặc định 20); mọi vai trò đã đăng nhập được đọc theo quyền xem Subject. Response phân trang có `data`, `meta`, `links`; mỗi Topic có `id`, `subject_id`, `name`, `description`, `questions_count`, `created_at`, `updated_at`.
- `POST /subjects/{id}/topics`: body bắt buộc `name` (chuỗi tối đa 255), `description` tùy chọn; `subject_id` chỉ lấy từ URL, không nhận trong body. Admin tạo trong mọi Subject; teacher chỉ tạo trong Subject đang phụ trách. Quyền được kiểm tra lại trên Subject đã khóa trước khi ghi. Response `201` có `data` cùng các trường Topic và `questions_count: 0`.
- Sau migration Phase 4, `questions_count` dùng quan hệ `Topic.questions()` để đếm câu hỏi chưa xóa mềm trong bảng thật mà không tải toàn bộ câu hỏi.
- Quyền và hợp đồng `PATCH`/`DELETE` Topic chưa được đặc tả đủ; hai endpoint này chưa được mở.

---

## 3. Đặc tả Request / Response Schema Mẫu

### 3.1. Nộp bài thi: `POST /api/v1/exam-attempts/{attemptId}/submit`
- **Request Headers**:
  ```http
  Authorization: Bearer 2|S4nctumT0k3n...
  Content-Type: application/json
  Accept: application/json
  Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
  ```
- **Request Body**:
  ```json
  {
    "final_answers": [
      {
        "question_id": 501,
        "answer": ["opt_a", "opt_c"]
      },
      {
        "question_id": 502,
        "answer": "opt_b"
      }
    ]
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "data": {
      "attempt_id": 9001,
      "status": "submitted",
      "started_at": "2026-10-06T01:05:00Z",
      "submitted_at": "2026-10-06T01:55:00Z",
      "total_questions": 40,
      "answered_questions": 40,
      "score": 9.25,
      "total_points": 10.0,
      "is_passed": true
    },
    "message": "Exam submitted successfully."
  }
  ```

---

## 4. Định nghĩa Mã trạng thái HTTP (HTTP Status Codes)

| Mã HTTP | Tên chuẩn RFC | Ý nghĩa trong ngữ cảnh Exam Platform |
| :---: | :--- | :--- |
| **`200 OK`** | Thành công | Truy vấn đọc, cập nhật thông tin, nộp bài thi thành công. |
| **`201 Created`** | Tạo mới thành công | Khởi tạo tài khoản, tạo đề thi, bắt đầu attempt, ghi nhận vi phạm. |
| **`204 No Content`** | Xóa thành công | Gỡ câu hỏi khỏi đề thi, xóa môn học rỗng. |
| **`401 Unauthorized`** | Chưa xác thực | Thiếu Token, Token không hợp lệ, hoặc Token đã hết hạn. |
| **`403 Forbidden`** | Bị từ chối truy cập (IDOR/Role) | Sinh viên gọi endpoint của Giảng viên; sinh viên xem attempt của người khác. |
| **`404 Not Found`** | Không tìm thấy | ID câu hỏi, ca thi, hoặc attempt không tồn tại. |
| **`409 Conflict`** | Xung đột trạng thái | Nộp bài lần hai, bắt đầu attempt khi ca thi đã đóng hoặc đã nộp bài. |
| **`422 Unprocessable`** | Lỗi dữ liệu nhập | Email trùng, điểm âm, câu trả lời không khớp với các lựa chọn phương án. |
| **`429 Too Many Req`** | Giới hạn tần suất | Gửi tín hiệu proctoring quá 30 lần/phút, thử mật khẩu sai quá 5 lần. |
| **`500 Server Error`** | Lỗi máy chủ nội bộ | Lỗi mất kết nối CSDL, crash ứng dụng (được che giấu và log chi tiết). |

---

## 5. Đặc tả OpenAPI 3.1 & Swagger Documentation (dedoc/scramble)

Hệ thống tích hợp công cụ tự động sinh tài liệu chuẩn hóa **OpenAPI 3.1** qua gói `dedoc/scramble` (Zero-Annotation architecture):

### 5.1. Endpoints Tài liệu
- **Interactive UI**: `GET /docs/api` (Giao diện Stoplight Elements / Swagger trực quan).
- **OpenAPI Schema JSON**: `GET /docs/api.json` (Xuất file OpenAPI 3.1 spec phục vụ code generation và automation tests).

### 5.2. Chính sách Bảo mật Tài liệu (Documentation Security Gate)
- Được bảo vệ bởi Gate `viewApiDocs` trong `AppServiceProvider`:
  ```php
  Gate::define('viewApiDocs', function ($user = null): bool {
      return app()->environment('local', 'testing');
  });
  ```
- **Môi trường `local` & `testing`**: Cho phép truy cập tự do phục vụ phát triển frontend và testing nội bộ.
- **Môi trường `production`**: Tự động từ chối (`403 Forbidden`) đối với người dùng thông thường nhằm ngăn ngừa rò rỉ bề mặt tấn công (OWASP API Security Top 10 - API8:2023 Security Misconfiguration).

### 5.3. Xác thực Trực tiếp trên UI (Try-It-Out)
- Cấu hình Security Scheme kiểu HTTP Bearer:
  ```http
  Authorization: Bearer <sanctum_token>
  ```
- Lập trình viên có thể copy token nhận được từ `POST /api/v1/auth/login`, paste vào nút **Authorize** trên giao diện để test toàn bộ các endpoint được bảo vệ bởi middleware `auth:sanctum` và `role:*`.

### 5.4. Tự động sinh TypeScript Types cho Frontend (Next.js)
Frontend (`web-client`) có thể trích xuất schema tự động mà không cần định nghĩa type thủ công:
```bash
npx openapi-typescript http://localhost:8000/docs/api.json -o src/types/api-schema.d.ts
```

