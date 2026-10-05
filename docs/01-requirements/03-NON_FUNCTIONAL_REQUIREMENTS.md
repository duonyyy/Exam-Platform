# 03 — Non-Functional Requirements (NFR) Specification

**Dự án**: Exam Platform  
**Tài liệu**: `docs/01-requirements/03-NON_FUNCTIONAL_REQUIREMENTS.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. Giới thiệu & Tiêu chí Đo lường (Measurable Criteria)

Tài liệu này xác định các yêu cầu phi chức năng (Non-Functional Requirements — NFR) ràng buộc hiệu năng, bảo mật, độ tin cậy và khả năng mở rộng của hệ thống Exam Platform. Mọi chỉ số NFR đều được lượng hóa (measurable) hoặc gán nhãn `TBD` kèm giả định kỹ thuật rõ ràng.

---

## 2. Danh mục Yêu cầu Phi chức năng

### 2.1. Hiệu năng & Khả năng Đáp ứng (Performance)

- **`NFR-PERF-001` (Thời gian phản hồi API thông thường)**: Các truy vấn đọc danh mục, câu hỏi, đề thi hoặc thông tin cá nhân (`GET /api/v1/*`) phải có thời gian phản hồi (Response Latency) $\le 200\text{ms}$ tại bách phân vị thứ 95 ($P95$) dưới tải thông thường.
- **`NFR-PERF-002` (Độ trễ Lưu đáp án - Autosave)**: Thao tác tự động lưu câu trả lời (`PATCH /exam-attempts/{id}/answers`) là thao tác xảy ra với tần suất cao nhất trong phòng thi; thời gian phản hồi máy chủ phải $\le 100\text{ms}$ tại $P95$ để thí sinh không gặp hiện tượng giật lag khi chuyển câu hỏi.
- **`NFR-PERF-003` (Độ trễ Nộp bài & Chấm điểm - Submit & Score)**: Thao tác nộp bài (`POST /exam-attempts/{id}/submit`) bao gồm khóa dòng CSDL, lưu câu trả lời cuối, chấm điểm trắc nghiệm và ghi nhận kết quả phải hoàn thành trong $\le 500\text{ms}$ tại $P95$.
- **`NFR-PERF-004` (Tải đồng thời khi bắt đầu thi - Peak Concurrency)**:
  - *Hiện trạng yêu cầu*: Chưa có số liệu người dùng đồng thời chính thức từ phía nhà trường $\rightarrow$ **Gán nhãn `TBD`**.
  - *Đề xuất giả định kiến trúc*: Thiết kế chịu tải cho kịch bản tiêu chuẩn gồm **1.000 thí sinh đồng thời** bắt đầu ca thi trong khung thời gian 2 phút đầu tiên (khoảng $\approx 50$ requests/giây cho luồng ghi nhận attempt và tải đề thi).

---

### 2.2. Tính Sẵn sàng & Độ tin cậy (Availability & Reliability)

- **`NFR-AVAIL-001` (Thời gian hoạt động - Uptime)**: Hệ thống phải đạt mức độ sẵn sàng tối thiểu **99.9%** trong các khung giờ diễn ra ca thi đã được lên lịch trước (`published` sessions).
- **`NFR-AVAIL-002` (Bảo trì theo kế hoạch - Maintenance Windows)**: Bất kỳ kế hoạch nâng cấp phần mềm hoặc bảo trì hạ tầng nào chỉ được phép thực hiện ngoài khung giờ có ca thi đang hoạt động, có thông báo trước tối thiểu 24 giờ.
- **`NFR-REL-001` (Bảo toàn dữ liệu khi rớt mạng - Network Fault Tolerance)**: Nếu đường truyền mạng của thí sinh bị gián đoạn tạm thời trong lúc làm bài, các câu trả lời đã lưu thành công trước đó trên máy chủ phải được bảo toàn nguyên vẹn; thí sinh có thể tải lại trang (`F5`) và tiếp tục làm bài mà không mất tiến độ.
- **`NFR-REL-002` (Khoảng ân hạn nộp bài - Late Submission Grace Period)**: Máy chủ tự động áp dụng khoảng ân hạn kỹ thuật **30 giây** đối với thao tác nộp bài để bù đắp độ trễ truyền gói tin qua Internet khi thí sinh bấm nộp vào những giây cuối cùng.
- **`NFR-REL-003` (Tính bất biến của bài thi đã nộp - Immutability)**: Khi lượt thi đã chuyển sang trạng thái `submitted`, cơ sở dữ liệu và mã nguồn ứng dụng phải đảm bảo tuyệt đối không có bất kỳ luồng ghi nào có thể chỉnh sửa đáp án hoặc làm sai lệch điểm số đã chấm.

---

### 2.3. Khả năng Mở rộng (Scalability)

- **`NFR-SCALE-001` (Mở rộng Tầng Ứng dụng - Stateless Backend)**: Tầng Backend Laravel REST API phải hoàn toàn phi trạng thái (Stateless). Mọi phiên làm việc được xác thực qua Sanctum Bearer Token, cho phép nâng cấp mở rộng theo chiều ngang (Horizontal Pod Autoscaling - HPA) qua nhiều container PHP-FPM phía sau bộ cân bằng tải Nginx/ALB mà không cần cấu hình Session dính (Sticky Sessions).
- **`NFR-SCALE-002` (Quản lý Kết nối CSDL - Connection Pooling)**: Cấu hình hệ thống phải hỗ trợ bộ quản lý kết nối CSDL (PostgreSQL Connection Pooler như PgBouncer) nhằm giới hạn số lượng kết nối thực tế tới PostgreSQL dưới 200 connections, ngăn chặn hiện tượng tràn bộ nhớ đệm (Out-of-Memory) khi hàng ngàn thí sinh truy cập đồng thời.

---

### 2.4. An ninh & Bảo mật Thông tin (Security & Compliance)

- **`NFR-SEC-001` (Mã hóa đường truyền - TLS/SSL)**: Toàn bộ lưu lượng mạng giữa Trình duyệt (Client), Web Server (Nginx) và Backend API bắt buộc phải được mã hóa qua giao thức **HTTPS (TLS 1.3)**. Nghiêm cấm truyền token hoặc dữ liệu bài thi qua HTTP không an toàn.
- **`NFR-SEC-002` (Lưu trữ Mật khẩu An toàn - Credential Hashing)**: Mật khẩu người dùng bắt buộc phải được băm bằng thuật toán **Bcrypt** với cost factor tối thiểu là 10 hoặc **Argon2id**. Tuyệt đối không lưu mật khẩu dạng bản rõ (plaintext).
- **`NFR-SEC-003` (Bảo vệ Token chống XSS - HTTP-Only Cookie Proxy)**: Khi triển khai Web Client Next.js, Token xác thực Sanctum phải được lưu trong **HTTP-Only, Secure, SameSite=Lax Cookie** do Next.js Route Handler quản lý, ngăn chặn hoàn toàn mã JavaScript độc hại (XSS) trên trình duyệt đọc trộm token.
- **`NFR-SEC-004` (Ngăn chặn Rò rỉ Đáp án - Zero Leakage Rule)**: Bất kỳ endpoint API nào dành cho vai trò `student` trong thời gian làm bài thi tuyệt đối không được tuần tự hóa (serialize) các trường: `correct_answer`, `explanation`, `grading_rubric`.
- **`NFR-SEC-005` (Chống lỗ hổng IDOR - Insecure Direct Object References)**: Mọi thao tác truy cập vào bài thi (`GET /exam-attempts/{id}`), lưu đáp án (`PATCH /answers`), hoặc nộp bài (`POST /submit`) bắt buộc phải kiểm tra quyền sở hữu qua Laravel Policy: `$attempt->student_id === Auth::id()`.
- **`NFR-SEC-006` (Chống Race Condition & Double Submit)**: Thao tác nộp bài bắt buộc sử dụng khóa dòng CSDL `SELECT ... FOR UPDATE` trong một Database Transaction độc quyền nhằm triệt tiêu hoàn toàn khả năng ghi nhận 2 kết quả nộp bài song song.
- **`NFR-SEC-007` (Chống tấn công Brute-force & DoS - Rate Limiting)**:
  - Endpoint đăng nhập (`POST /auth/login`): Tối đa 5 lần thử sai / 1 phút / 1 địa chỉ IP.
  - Endpoint gửi sự kiện giám sát (`POST /proctoring-events`): Tối đa 30 requests / 1 phút / 1 thí sinh.

---

### 2.5. Tính Nhất quán Dữ liệu (Data Consistency)

- **`NFR-DATA-001` (Toàn vẹn Ràng buộc Khóa ngoại - Relational Constraints)**: 100% các mối quan hệ cha-con trong cơ sở dữ liệu PostgreSQL phải được định nghĩa bằng Foreign Key có quy tắc hành vi rõ ràng (`ON DELETE RESTRICT` đối với các bảng lịch sử thi cử như `questions`, `exams`, `exam_attempts` để ngăn chặn xóa nhầm dữ liệu gốc).
- **`NFR-DATA-002` (Ràng buộc Duy nhất Tổng hợp - Composite Unique Indexes)**: Phải thiết lập ràng buộc duy nhất ở cấp cơ sở dữ liệu để chống dữ liệu rác/trùng lặp:
  - `(exam_session_id, student_id)` trong bảng `session_assignments`.
  - `(exam_session_id, student_id, attempt_number)` trong bảng `exam_attempts`.
  - `(attempt_id, question_id)` trong bảng `attempt_answers`.
  - `(exam_session_id, teacher_id)` trong bảng `session_teachers`.
  - `(exam_id, question_id)` trong bảng `exam_questions`.

---

### 2.6. Khả năng Giám sát & Quan sát (Observability)

- **`NFR-OBS-001` (Định dạng Nhật ký Chuẩn hóa - Structured JSON Logging)**: Toàn bộ log ứng dụng phát sinh từ Laravel và Nginx phải xuất dưới định dạng JSON có cấu trúc, bao gồm ngữ cảnh: `timestamp`, `level`, `request_id`, `user_id`, `route`, `status_code`, `duration_ms`.
- **`NFR-OBS-002` (Mặt nạ Dữ liệu Nhạy cảm - Log Data Masking)**: Cơ chế ghi log bắt buộc phải tự động che giấu (mask) các trường dữ liệu nhạy cảm: `password`, `password_confirmation`, `token`, `correct_answer`.
- **`NFR-OBS-003` (Điểm kiểm tra sức khỏe hệ thống - Health Check)**: Hệ thống phải cung cấp endpoint `/api/v1/health` kiểm tra trạng thái sống (liveness) và độ sẵn sàng (readiness) của kết nối CSDL PostgreSQL và bộ đệm Redis.

---

### 2.7. Sao lưu & Phục hồi Thảm họa (Backup & Disaster Recovery)

- **`NFR-DR-001` (Mục tiêu Điểm Phục hồi - RPO - Recovery Point Objective)**: Dữ liệu bài làm và điểm số của thí sinh không được mất mát quá **5 phút** trong trường hợp xảy ra thảm họa phần cứng máy chủ CSDL (thông qua cơ chế ghi nhật ký giao dịch liên tục PostgreSQL Write-Ahead Logging - WAL Archiving).
- **`NFR-DR-002` (Mục tiêu Thời gian Phục hồi - RTO - Recovery Time Objective)**: Hệ thống phải có khả năng khôi phục toàn bộ hoạt động từ bản sao lưu gần nhất trong vòng tối đa **60 phút**.

---

### 2.8. Khả năng Tương thích Trình duyệt & Thiết bị (Browser Support)

- **`NFR-COMPAT-001` (Trình duyệt hỗ trợ)**: Giao diện Web Client Next.js phải tương thích và hoạt động ổn định trên các trình duyệt máy tính để bàn (Desktop) phiên bản hiện đại:
  - Google Chrome $\ge$ phiên bản 90
  - Microsoft Edge $\ge$ phiên bản 90
  - Mozilla Firefox $\ge$ phiên bản 90
  - Apple Safari $\ge$ phiên bản 14
- **`NFR-COMPAT-002` (Độ phân giải màn hình tối thiểu)**: Giao diện phòng thi trực tuyến được tối ưu cho màn hình máy tính có độ phân giải tối thiểu từ **1280x720 (HD)** trở lên để đảm bảo hiển thị đầy đủ danh sách câu hỏi, đồng hồ đếm ngược và bảng điều hướng. Khuyến cáo không thi trên điện thoại di động màn hình nhỏ.
