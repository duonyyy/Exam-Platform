# 11 — Data Classification & Privacy Specification

**Dự án**: Exam Platform  
**Tài liệu**: `docs/02-domain-database/11-DATA_CLASSIFICATION.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. Các Cấp độ Phân loại Dữ liệu (Classification Levels)

Hệ thống Exam Platform thiết lập 4 cấp độ phân loại dữ liệu nghiêm ngặt theo tiêu chuẩn bảo mật thông tin:

1. **`PUBLIC` (Công khai)**: Thông tin không nhạy cảm, có thể cung cấp ra ngoài mà không ảnh hưởng đến an ninh kỳ thi (ví dụ: Danh mục mã môn học, tên môn học).
2. **`INTERNAL` (Nội bộ)**: Thông tin dành cho người dùng đã đăng nhập trong phạm vi tổ chức (ví dụ: Danh sách chủ đề, lịch thi tổng quan, hướng dẫn làm bài).
3. **`SENSITIVE` (Nhạy cảm)**: Thông tin có tác động lớn đến sự công bằng và quyền riêng tư cá nhân (ví dụ: Hồ sơ sinh viên, nội dung đề thi chưa thi, đáp án của sinh viên, điểm số, sự kiện vi phạm giám sát).
4. **`HIGHLY SENSITIVE` (Tối mật)**: Dữ liệu tối thượng của hệ thống; nếu rò rỉ sẽ phá vỡ toàn bộ tính bảo mật của kỳ thi hoặc tài khoản (ví dụ: **Mật khẩu đã băm (Password Hash)**, **Sanctum Access Tokens**, **Đáp án đúng (`correct_answer`)** của đề thi).

---

## 2. Bảng Ma trận Phân loại Dữ liệu Chi tiết

| Tài sản Dữ liệu (Data Asset) | Cấp độ Bảo mật | Quyền Đọc (Who can Read) | Quyền Ghi (Who can Write) | Quyền Xóa (Who can Delete) | Thời hạn Lưu trữ (Retention) | Giới hạn Ghi Nhật ký (Logging Restrictions) |
| :--- | :---: | :--- | :--- | :--- | :---: | :--- |
| **Password Hash** | `HIGHLY SENSITIVE` | Không ai (chỉ dùng để `Hash::check`) | Người dùng (khi đăng ký/đổi mk) | Admin (khi xóa tk) | Theo vòng đời tài khoản | **TUYỆT ĐỐI KHÔNG GHI LOG** |
| **Sanctum Token** | `HIGHLY SENSITIVE` | Server Auth Middleware | Server (khi login) | Server (logout/revoke) | 8 giờ / khi logout | **TUYỆT ĐỐI KHÔNG GHI LOG** |
| **Đáp án đúng (`correct_answer`)** | `HIGHLY SENSITIVE` | Giảng viên, Admin, Chấm thi | Tác giả câu hỏi, Admin | Không (Soft delete) | Vĩnh viễn | **KHÔNG GHI LOG KHI THI ĐANG DIỄN RA** |
| **Nội dung Đề thi (`question_text`)** | `SENSITIVE` | Giảng viên, Thí sinh trong ca thi | Tác giả, Admin | Không (Soft delete) | Vĩnh viễn | Được phép log ID, không log toàn văn |
| **Đáp án của Thí sinh (`attempt_answers`)**| `SENSITIVE` | Thí sinh (bài của mình), Giám khảo | Thí sinh (trong giờ thi) | Không | Tối thiểu 5 năm | Không log nếu chứa dữ liệu tự luận dài |
| **Điểm số (`scores`)** | `SENSITIVE` | Thí sinh (khi công bố), Giảng viên, Admin | Hệ thống tự động chấm | Admin (khi phúc khảo) | Vĩnh viễn | Được phép log với `attempt_id` và `score` |
| **Sự kiện Giám sát (`proctoring_events`)** | `SENSITIVE` | Giám thị ca thi, Admin | Trình duyệt thí sinh | Không | Tối thiểu 1 năm | Log sự kiện tóm tắt, che viewport chi tiết |
| **Hồ sơ Thí sinh (Tên, Email, SĐT)** | `SENSITIVE` | Chủ tài khoản, Admin, Giảng viên ca | Chủ tài khoản, Admin | Admin | Theo vòng đời tài khoản | Mặt nạ email trong log (`ng***@domain`) |
| **Lịch thi & Ca thi (`exam_sessions`)** | `INTERNAL` | Thí sinh được gán, Giảng viên, Admin | Giảng viên ca, Admin | Admin | Tối thiểu 3 năm | Được phép log thông thường |
| **Môn học & Chủ đề (`subjects, topics`)** | `PUBLIC / INTERNAL`| Tất cả người dùng đã đăng nhập | Giảng viên, Admin | Admin (nếu rỗng) | Vĩnh viễn | Được phép log thông thường |

---

## 3. Chính sách Mặt nạ Dữ liệu & Thanh lọc Nhật ký (Data Masking & Sanitization)

Để ngăn chặn việc vô tình làm lộ dữ liệu tối mật qua các công cụ thu thập log tập trung (như ELK Stack, Grafana Loki, CloudWatch), lớp Middleware Logger của Laravel phải tự động lọc bỏ các trường trong danh sách đen:

```php
// config/logging.php hoặc Custom Log Middleware
$blacklistedKeys = [
    'password',
    'password_confirmation',
    'token',
    'bearer_token',
    'authorization',
    'correct_answer',
    'rejection_reason',
];
```

Mọi request body chứa các key này sẽ được tự động thay thế bằng chuỗi `"[REDACTED]"`.
