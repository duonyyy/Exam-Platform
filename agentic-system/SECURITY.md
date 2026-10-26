# Chính Sách Bảo Mật ExamOps Agent (Security Policy)

Hệ thống **ExamOps Agent** là dịch vụ điều phối AI thông minh cho Exam Platform, được thiết kế theo nguyên tắc phòng thủ đa tầng (**Defense-in-Depth**) và chính sách cách ly nghiêm ngặt (**Fail-Closed Isolation**).

---

## 🛡️ 1. Ranh Giới An Ninh Cốt Lõi (Security Boundaries)

| Được phép (Allowed) | Nghiêm cấm tuyệt đối (Strictly Forbidden) |
|---|---|
| Đọc siêu dữ liệu môn học, chủ đề, cấu trúc đề qua REST API `/api/v1` | **Không kết nối trực tiếp cơ sở dữ liệu PostgreSQL** của Exam Platform |
| Tạo đề xuất cấu trúc đề thi dạng bất biến (`ApprovalProposal`) | **Không tự ý ghi dữ liệu vào CSDL** khi chưa qua cổng Human-in-the-Loop |
| Xác thực danh tính người dùng thông qua Actor Context & Sanctum Token | **Không lưu trữ mật khẩu, master token hoặc đáp án đúng** trong agent state |
| Lưu checkpoint trạng thái trong file SQLite riêng biệt của Agent | **Không dùng chung Redis hoặc Session state** của hệ sinh thái Exam Platform |

---

## 🚨 2. Xử Lý Khẩn Cấp Khi Lộ Khóa Bí Mật (Incident Response)

Nếu vô tình commit API key, secret token hoặc chứng chỉ vào kho mã nguồn:

1. **Thu hồi và xoay khóa ngay lập tức (Immediate Key Revocation & Rotation)**:
   - Truy cập Google AI Studio (cho Gemini) hoặc nền tảng OpenAI để vô hiệu hóa key cũ và sinh key mới.
   - Thay đổi `EXAMOPS_API_KEY` và cập nhật biến môi trường trên container máy chủ.
2. **Xóa bỏ khỏi lịch sử Git**:
   - Sử dụng `git-filter-repo` để thanh lọc triệt để các commit chứa bí mật trước khi force-push.
3. **Kiểm toán nhật ký OpenTelemetry / Audit Log**:
   - Rà soát các sự kiện `TASK_STARTED`, `APPROVAL_REQUESTED` trong khoảng thời gian bị lộ để phát hiện các request bất thường.

---

## 🔒 3. Quy Tắc Phát Triển An Toàn

- **Kiểm tra trước khi commit**:
  ```bash
  git diff --cached | grep -iE "api[_-]?key|secret|token|password|sk-"
  ```
- **Không bao giờ commit file `.env`**: Chỉ commit `.env.example` với các giá trị placeholder an toàn.
- **Xác thực chữ ký số học đề xuất**: Mọi payload đề thi gửi sang Core API bắt buộc phải kèm mã băm SHA-256 (`proposal_hash`) để chống tấn công Replay Attack và Tampering.
- **Bảo vệ chống rò rỉ đề (Zero-Leakage Policy)**: Tuyệt đối không để lộ trường `correct_answer` trong các phản hồi hướng tới thí sinh.
