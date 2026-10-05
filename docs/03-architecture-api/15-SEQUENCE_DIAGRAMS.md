# 15 — Critical Sequence Diagrams Specification

**Dự án**: Exam Platform  
**Tài liệu**: `docs/03-architecture-api/15-SEQUENCE_DIAGRAMS.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. Luồng Đăng nhập Hệ thống (User Login Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng (Browser)
    participant NextClient as Next.js Web Client (BFF)
    participant Nginx as Nginx Reverse Proxy
    participant Laravel as Laravel Core API (Auth)
    participant DB as PostgreSQL Database

    User->>NextClient: Nhập email, password & Submit Form
    NextClient->>Nginx: POST /api/v1/auth/login {email, password}
    Nginx->>Laravel: Chuyển tiếp request FastCGI
    Laravel->>DB: SELECT * FROM users WHERE email = ? AND is_active = true
    DB-->>Laravel: Trả về bản ghi User (kèm password hash)
    Laravel->>Laravel: Hash::check(password, password_hash)
    alt Mật khẩu sai hoặc không tồn tại
        Laravel-->>Nginx: 401 Unauthorized {"message": "Invalid credentials"}
        Nginx-->>NextClient: 401 Unauthorized
        NextClient-->>User: Hiển thị thông báo lỗi đăng nhập
    else Mật khẩu chính xác
        Laravel->>DB: INSERT INTO personal_access_tokens (tokenable_id, token, ...)
        DB-->>Laravel: Tạo Token thành công
        Laravel-->>Nginx: 200 OK { data: { user, token: "2|plaintext..." } }
        Nginx-->>NextClient: 200 OK { user, token }
        NextClient->>NextClient: Lưu token vào HTTP-Only, Secure, SameSite=Lax Cookie
        NextClient-->>User: Chuyển hướng vào Dashboard theo Role (admin/teacher/student)
    end
```

---

## 2. Luồng Xuất bản Ca thi (Publish Exam Session Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Giảng viên (Teacher)
    participant NextClient as Next.js Web Client
    participant Laravel as Laravel Core API
    participant DB as PostgreSQL Database

    Teacher->>NextClient: Bấm "Xuất bản ca thi"
    NextClient->>Laravel: POST /api/v1/exam-sessions/{id}/publish
    Laravel->>Laravel: Xác thực Sanctum Token & SessionPolicy@publish
    Laravel->>DB: BEGIN TRANSACTION
    Laravel->>DB: SELECT questions_count FROM exams WHERE id = session.exam_id
    DB-->>Laravel: questions_count = 40
    Laravel->>DB: SELECT COUNT(*) FROM session_assignments WHERE exam_session_id = ?
    DB-->>Laravel: assignments_count = 60
    alt Chưa đủ câu hỏi hoặc chưa phân công thí sinh
        Laravel->>DB: ROLLBACK
        Laravel-->>NextClient: 409 Conflict {"message": "Ca thi chưa đủ điều kiện xuất bản"}
        NextClient-->>Teacher: Hiển thị lỗi cảnh báo
    else Đủ điều kiện
        Laravel->>DB: UPDATE exam_sessions SET status = 'published', updated_at = NOW() WHERE id = ?
        DB-->>Laravel: Cập nhật thành công (1 row affected)
        Laravel->>DB: COMMIT
        Laravel-->>NextClient: 200 OK {"data": { "status": "published" }}
        NextClient-->>Teacher: Hiển thị Badge "Đang hoạt động"
    end
```

---

## 3. Luồng Thí sinh Bắt đầu Làm bài (Start Exam Attempt Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Student as Thí sinh (Student)
    participant NextClient as Next.js Web Client
    participant Laravel as Laravel Core API
    participant DB as PostgreSQL Database

    Student->>NextClient: Bấm "Vào phòng thi"
    NextClient->>Laravel: POST /api/v1/exam-sessions/{id}/attempts
    Laravel->>Laravel: Xác thực Token Sanctum (Lấy student_id)
    Laravel->>DB: BEGIN TRANSACTION
    Laravel->>DB: SELECT * FROM session_assignments WHERE exam_session_id = ? AND student_id = ?
    alt Thí sinh chưa được phân công
        Laravel->>DB: ROLLBACK
        Laravel-->>NextClient: 403 Forbidden {"message": "Bạn không được phân công ca thi này"}
    else Đã được phân công
        Laravel->>DB: SELECT status, start_at, end_at, allow_late_minutes FROM exam_sessions WHERE id = ?
        alt Ca thi chưa mở hoặc thí sinh đến quá muộn
            Laravel->>DB: ROLLBACK
            Laravel-->>NextClient: 409 Conflict {"message": "Ngoài khung giờ vào phòng thi"}
        else Hợp lệ
            Laravel->>DB: SELECT COUNT(*) FROM exam_attempts WHERE exam_session_id = ? AND student_id = ?
            alt Đã hết lượt làm bài (count >= max_attempts)
                Laravel->>DB: ROLLBACK
                Laravel-->>NextClient: 409 Conflict {"message": "Đã sử dụng hết số lượt thi"}
            else Còn lượt thi
                Laravel->>DB: INSERT INTO exam_attempts (session_id, student_id, attempt_number, status, started_at) VALUES (?, ?, 1, 'in_progress', NOW())
                DB-->>Laravel: Tạo attempt thành công (ID = 9001)
                Laravel->>DB: COMMIT
                Laravel-->>NextClient: 201 Created { data: { id: 9001, remaining_seconds: 3600 } }
                NextClient-->>Student: Chuyển hướng vào màn hình phòng thi /exam/9001
            end
        end
    end
```

---

## 4. Luồng Tự động Lưu Đáp án (Autosave Answer Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Student as Thí sinh (Student)
    participant NextClient as Next.js Web Client
    participant Laravel as Laravel Core API
    participant DB as PostgreSQL Database

    Student->>NextClient: Click chọn phương án A (Question #501)
    NextClient->>NextClient: Optimistic UI: Đổi màu radio button & hiện "Đang lưu..."
    NextClient->>Laravel: PATCH /api/v1/exam-attempts/9001/answers { question_id: 501, answer: "opt_a" }
    Laravel->>Laravel: Policy Check: attempt.student_id == Auth::id() AND attempt.status == 'in_progress'
    Laravel->>DB: Kiểm tra question_id = 501 có thuộc đề thi của ca thi này không
    DB-->>Laravel: Hợp lệ
    Laravel->>DB: INSERT INTO attempt_answers (attempt_id, question_id, selected_options, updated_at) VALUES (9001, 501, '["opt_a"]', NOW()) ON CONFLICT (attempt_id, question_id) DO UPDATE SET selected_options = EXCLUDED.selected_options, updated_at = NOW()
    DB-->>Laravel: Upsert thành công
    Laravel-->>NextClient: 200 OK { data: { question_id: 501, saved_at: "..." } }
    NextClient-->>Student: Đổi trạng thái sang "Đã lưu" (Saved Badge xanh)
```

---

## 5. Luồng Nộp bài thi & Chấm điểm Toàn vẹn (Submit Exam Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Student as Thí sinh (Student)
    participant NextClient as Next.js Web Client
    participant Laravel as Laravel Core API (SubmitAction)
    participant Scorer as AttemptScorer Engine
    participant DB as PostgreSQL Database

    Student->>NextClient: Bấm "Nộp bài thi" (Xác nhận hộp thoại)
    NextClient->>NextClient: Vô hiệu hóa nút Submit & hiển thị Spinner
    NextClient->>Laravel: POST /api/v1/exam-attempts/9001/submit (kèm Idempotency-Key & final_answers)
    Laravel->>Laravel: Policy Check: Quyền sở hữu lượt thi
    Laravel->>DB: BEGIN TRANSACTION
    Note over Laravel,DB: KHÓA DÒNG ĐỘC QUYỀN CHỐNG DOUBLE SUBMIT
    Laravel->>DB: SELECT * FROM exam_attempts WHERE id = 9001 FOR UPDATE
    DB-->>Laravel: Trả về dòng attempt đang bị khóa
    alt attempt.status != 'in_progress' (Đã nộp trước đó bởi request khác)
        Laravel->>DB: ROLLBACK
        Laravel-->>NextClient: 409 Conflict {"message": "Bài thi đã được nộp hoặc đã đóng"}
    else attempt.status == 'in_progress'
        Laravel->>DB: Lưu các đáp án còn tồn đọng trong final_answers vào attempt_answers
        Laravel->>Scorer: calculate(attempt)
        Scorer->>DB: Tải danh sách câu trả lời của attempt & correct_answer gốc
        DB-->>Scorer: Trả về câu hỏi & đáp án đúng
        Scorer->>Scorer: Đối soát từng câu -> Tính tổng điểm (Ví dụ: 9.25 / 10.0)
        Scorer-->>Laravel: Điểm số = 9.25, Điểm tối đa = 10.0
        Laravel->>DB: UPDATE exam_attempts SET status = 'submitted', submitted_at = NOW(), score = 9.25, total_points = 10.0 WHERE id = 9001
        DB-->>Laravel: Cập nhật thành công
        Laravel->>DB: COMMIT
        Note over Laravel,DB: GIẢI PHÓNG KHÓA DÒNG
        Laravel-->>NextClient: 200 OK { data: { status: "submitted", score: 9.25, is_passed: true } }
        NextClient-->>Student: Hiển thị màn hình kết thúc thi & Điểm số
    end
```
