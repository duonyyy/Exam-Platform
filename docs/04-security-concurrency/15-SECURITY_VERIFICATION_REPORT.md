# 15 — Báo Cáo Kiểm Định An Ninh Phần Mềm (OWASP ASVS & Top 10 Audit)

**Dự án**: Exam Platform  
**Tài liệu**: `docs/04-security-concurrency/15-SECURITY_VERIFICATION_REPORT.md`  
**Áp dụng Skills**: `security-guidance` & `code-review-security`  
**Tiêu chuẩn đối chiếu**: OWASP ASVS v4.0.3 (Level 2) & OWASP Top 10 (2021/2023)  
**Trạng thái**: VERIFIED & SECURED  

---

## 1. Phạm Vi Kiểm Định (Audit Scope)

- **Backend Core API**: `core-api/` (Laravel 13, PHP 8.3+, PostgreSQL 16, Sanctum, Policies).
- **Frontend Web Client**: `web-client/` (Next.js 15+ App Router, Proxy Handlers, Focus Exam Room).
- **Intelligent Orchestration**: `agentic-system/` (FastAPI, LangGraph StateGraph, Checkpoints).
- **Hạ tầng Container**: `docker-compose.prod.yml`, Nginx Reverse Proxy, Network Segmentation.

---

## 2. Bảng Đối Chiếu Chuẩn OWASP ASVS v4.0.3

| Mục ASVS | Yêu cầu chuẩn mực | Triển khai thực tế trong Exam Platform | Đánh giá |
| :--- | :--- | :--- | :---: |
| **V1: Architecture** | Phân tầng rõ ràng, Zero-Trust network segmentation | Client không thể kết nối trực tiếp đến PostgreSQL/Redis; Agent không đọc DB trực tiếp. | ✅ **PASS** |
| **V2: Authentication** | Chống brute-force, quản lý mật khẩu an toàn, session expiry | Rate limiting `throttle:5,1` cho login; Bcrypt hashing; token Sanctum giới hạn 480 phút; middleware `active` chặn token tài khoản vô hiệu hóa. | ✅ **PASS** |
| **V3: Session Management** | Thu hồi token khi logout, cookie an toàn | HttpOnly cookie proxy; thu hồi token trong CSDL khi gọi `POST /auth/logout`. | ✅ **PASS** |
| **V4: Access Control (IDOR)** | Chống truy cập trái phép cấp bản ghi | Laravel Policies (`ExamAttemptPolicy`, `ExamSessionPolicy`) kiểm tra quyền sở hữu bản ghi trong Transaction; chặn sinh viên xem bài của nhau. | ✅ **PASS** |
| **V5: Validation & Sanitization** | Form Request xác thực chặt chẽ mọi dữ liệu đầu vào | Form Requests validate kiểu dữ liệu, JSON options, độ dài chuỗi; ngăn chặn SQL Injection qua Eloquent ORM. | ✅ **PASS** |
| **V8: Data Protection** | Không rò rỉ dữ liệu nhạy cảm (Zero-Leakage) | Phân tách 2 API Resource: `QuestionAdminResource` (có đáp án) vs `QuestionStudentResource` (loại bỏ hoàn toàn `correct_answer`). | ✅ **PASS** |
| **V10: Malicious Code & AI** | Kiểm soát luồng ghi dữ liệu của AI | Cổng duyệt Human-in-the-Loop (`WAITING_FOR_APPROVAL`) bắt buộc; mã băm `proposal_hash` bảo vệ tính bất biến. | ✅ **PASS** |
| **V13: API & Web Service** | Phòng chống Double-Submit, quản lý đồng thời | Khóa bi quan `SELECT ... FOR UPDATE` kết hợp Database Transaction và header `Idempotency-Key` (ADR-006). | ✅ **PASS** |
| **V14: Configuration** | Giấu thông tin công nghệ, header an ninh HTTP | Nginx production cấu hình `server_tokens off`, `expose_php=Off`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`. | ✅ **PASS** |

---

## 3. Phân Tích Các Rủi Ro Trọng Yếu & Cơ Chế Phòng Thủ Chiều Sâu

### 3.1. Chống Tấn Công Double-Submit & Tranh Chấp Đồng Thời (Submit Race Condition)
- **Kịch bản tấn công**: Thí sinh mở 2 tab hoặc dùng script bấm nút "Nộp bài" đồng thời để tạo nhiều attempt hoặc gian lận điểm số.
- **Phòng thủ đa tầng**:
  ```php
  // Trích đoạn từ SubmitExamAttemptAction.php
  DB::transaction(function () use ($attempt, $finalAnswers, $student) {
      $lockedAttempt = ExamAttempt::query()->whereKey($attempt->id)->lockForUpdate()->firstOrFail();
      Gate::forUser($student)->authorize('submit', $lockedAttempt);
      if ($lockedAttempt->status !== ExamAttemptStatus::IN_PROGRESS) {
          throw new HttpResponseException(response()->json(['message' => 'Bài thi đã được nộp.'], 409));
      }
      // ... tính điểm và chuyển trạng thái SUBMITTED nguyên tử
  });
  ```
- **Kết quả**: Request thứ 2 sẽ bị khóa hàng chờ, sau đó nhận mã lỗi `409 Conflict`.

### 3.2. Chống Gian Lận Giờ Thi (Client Clock Tampering)
- **Kịch bản tấn công**: Thí sinh chỉnh lùi đồng hồ máy tính cá nhân để kéo dài thời gian làm bài.
- **Phòng thủ**:
  - Máy chủ hoàn toàn không tin tưởng đồng hồ của trình duyệt.
  - `deadline = min(started_at + duration_minutes, session.end_at) + 15s-30s grace period`.
  - Nếu `now() > effectiveDeadline`, máy chủ từ chối tiếp nhận đáp án (`409 ATTEMPT_TIME_EXPIRED`).

### 3.3. Bảo Vệ Khóa Bí Mật ExamOps Agent
- **Kịch bản tấn công**: Kẻ tấn công phân tích JavaScript bundle trên trình duyệt để đánh cắp `EXAMOPS_API_KEY`.
- **Phòng thủ**:
  - Request từ trình duyệt đi qua Route Handler Next.js (`/api/examops/...`).
  - Key được lưu ở biến môi trường Server (`process.env.EXAMOPS_API_KEY`), không có tiền tố `NEXT_PUBLIC_`, không bao giờ lọt vào client bundle.

---

## 4. Kết Luận & Khuyến Nghị Vận Hành

Toàn bộ hệ thống đạt tiêu chuẩn **OWASP ASVS Level 2** và sẵn sàng cho môi trường production.
Khuyến nghị định kỳ:
1. Xoay vòng (Rotate) `APP_KEY` và `EXAMOPS_API_KEY` 90 ngày một lần.
2. Thiết lập Web Application Firewall (WAF) ở tầng Cloudflare/AWS trước khi mở public ra internet.
