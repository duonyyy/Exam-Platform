# 12 — API Design & Contract Specification

**Dự án**: Exam Platform  
**Tài liệu**: `docs/03-architecture-api/12-API_DESIGN.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. Nguyên tắc Thiết kế Giao diện Lập trình (API Design Principles)

1. **RESTful Architecture**: Áp dụng triệt để các động từ HTTP (`GET`, `POST`, `PATCH`, `DELETE`) trên các danh từ đại diện cho tài nguyên (`/subjects`, `/questions`, `/exams`, `/exam-sessions`, `/exam-attempts`).
2. **Business Action Endpoints**: Với các quy trình nghiệp vụ phức tạp không thuộc CRUD thông thường, thiết kế rõ ràng dưới dạng RPC-style hành động:
   - `POST /questions/{id}/approve` & `POST /questions/{id}/reject`
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
| `/api/v1/subjects/{id}/topics` | `GET` | All | Bearer | Xem các chủ đề của một môn học | `200 OK` |
| `/api/v1/questions` | `GET` | Teacher, Admin | Bearer | Tra cứu ngân hàng câu hỏi | `200 OK` |
| `/api/v1/questions` | `POST` | Teacher, Admin | Bearer | Tạo câu hỏi mới vào ngân hàng đề | `201 Created` |
| `/api/v1/questions/{id}/approve` | `POST` | Teacher, Admin | Bearer | Phê duyệt chất lượng câu hỏi | `200 OK` |
| `/api/v1/questions/{id}/reject` | `POST` | Teacher, Admin | Bearer | Từ chối câu hỏi kèm lý do | `200 OK` |
| `/api/v1/exams` | `GET` | Teacher, Admin | Bearer | Danh sách đề thi mẫu | `200 OK` |
| `/api/v1/exams` | `POST` | Teacher, Admin | Bearer | Tạo mẫu đề thi mới | `201 Created` |
| `/api/v1/exams/{id}/questions` | `POST` | Teacher, Admin | Bearer | Gán câu hỏi vào đề và gán điểm số | `200 OK` |
| `/api/v1/exam-sessions` | `POST` | Teacher, Admin | Bearer | Tạo ca thi cụ thể theo lịch trình | `201 Created` |
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
