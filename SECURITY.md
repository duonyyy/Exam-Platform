# Chính Sách Bảo Mật (Security Policy) — Exam Platform

Hệ thống **Exam Platform** là nền tảng quản trị và tổ chức thi trực tuyến có tính chất sinh tử (Mission-Critical). Chúng tôi coi bảo mật dữ liệu thi cử, tính toàn vẹn của kết quả và thông tin cá nhân của thí sinh là ưu tiên hàng đầu.

---

## 🎯 1. Các Phiên Bản Được Hỗ Trợ (Supported Versions)

Chúng tôi chỉ phát hành các bản vá bảo mật cho các nhánh và phiên bản đang hoạt động chính thức:

| Phân hệ / Dịch vụ | Phiên bản hiện hành | Hỗ trợ bảo mật |
| :--- | :--- | :--- |
| **core-api** (Laravel 13 API) | `1.x` (PHP 8.3+) | :white_check_mark: Được hỗ trợ |
| **web-client** (Next.js 15+) | `1.x` (Node 20+) | :white_check_mark: Được hỗ trợ |
| **agentic-system** (FastAPI) | `0.x` (Python 3.11+) | :white_check_mark: Được hỗ trợ |

---

## 🚨 2. Báo Cáo Lỗ Hổng Bảo Mật (Reporting a Vulnerability)

Nếu bạn phát hiện một lỗ hổng bảo mật trong Exam Platform, vui lòng **KHÔNG tạo Issue công khai trên GitHub**. Hãy thực hiện quy trình công bố có trách nhiệm (Responsible Disclosure):

1. **Gửi email bảo mật khẩn cấp**:
   - Địa chỉ liên hệ: `security@examplatform.edu.vn` (hoặc email quản trị viên hệ thống).
   - Tiêu đề email: `[SECURITY VULNERABILITY] - <Mô tả ngắn gọn>`
2. **Nội dung báo cáo**:
   - Mô tả chi tiết lỗ hổng và phạm vi ảnh hưởng (ví dụ: IDOR, rò rỉ đáp án, bypass timer, double submit).
   - Các bước tái hiện cụ thể (Proof of Concept - PoC), bao gồm request cURL hoặc HTTP payload.
   - Đánh giá mức độ nghiêm trọng theo chuẩn CVSS v3.1 hoặc OWASP API Security Top 10.
3. **Cam kết phản hồi (SLA)**:
   - **Xác nhận tiếp nhận**: Trong vòng **24 giờ**.
   - **Đánh giá & Tái hiện**: Trong vòng **48 giờ**.
   - **Bản vá & Triển khai Production**: Trong vòng **7 ngày** đối với lỗ hổng nghiêm trọng (Critical/High) và **14 ngày** đối với các mức độ khác.

---

## 🛡️ 3. Các Nguyên Tắc An Ninh Bắt Buộc Trong Dự Án (Security Standards)

Toàn bộ mã nguồn triển khai phải tuân thủ nghiêm ngặt các nguyên tắc quy định tại [AGENTS.md](file:///c:/Users/Admin/Desktop/PHP/AGENTS.md) và [docs/04-security-concurrency/](file:///c:/Users/Admin/Desktop/PHP/docs/04-security-concurrency/README.md):

1. **Phòng chống BOLA / IDOR (Broken Object Level Authorization)**:
   - Sử dụng Laravel Policy kiểm tra quyền sở hữu trên từng bản ghi. Thí sinh chỉ được xem/sửa bài thi của chính mình.
2. **Chính sách Không Rò Rỉ Đáp Án (Zero-Leakage Policy)**:
   - Phân tách tuyệt đối giữa `QuestionAdminResource` và `QuestionStudentResource`. Tuyệt đối không để trường `correct_answer` hoặc `explanation` lọt vào payload của thí sinh trong thời gian làm bài.
3. **Đồng hồ Máy chủ Tuyệt đối (Server-Authoritative Clock)**:
   - Mọi quyết định về thời gian thi, hạn chót nộp bài đều do Backend máy chủ quyết định. Client timer chỉ phục vụ hiển thị trải nghiệm người dùng.
4. **Kiểm soát Tranh chấp Đồng thời & Chống Nộp Đúp (Pessimistic Locking)**:
   - Luồng nộp bài bắt buộc sử dụng `lockForUpdate()` trong Database Transaction để triệt tiêu Race Conditions.
5. **Bảo vệ Thông tin Xác thực (Credentials & Secrets Protection)**:
   - Token Sanctum chỉ truyền qua HttpOnly Cookie Proxy hoặc Stateless Bearer Header. Cấm lưu token trong `localStorage` để chống tấn công XSS.
   - Nghiêm cấm commit file `.env`, mật khẩu hoặc API secrets vào Git repository.
