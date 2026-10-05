# ADR-005 — Chiến lược Bảo toàn Lịch sử Đề thi: Live Reference kết hợp Immutability vs Snapshot

**Mã quyết định**: `ADR-005`  
**Ngày quyết định**: 2026-10-05  
**Trạng thái**: `ACCEPTED`  

---

## 1. Bối cảnh (Context)
Trong hệ thống thi trực tuyến, một bài toán kiến trúc sống còn là:
> *"Nếu một câu hỏi trong ngân hàng câu hỏi bị giảng viên chỉnh sửa nội dung sau khi kỳ thi đã kết thúc, kết quả bài làm và nội dung đề thi của các thí sinh trong quá khứ có bị thay đổi không?"*

## 2. Quyết định (Decision)
Ở giai đoạn hiện tại (Phase Baseline), chúng tôi quyết định lựa chọn **Phương án Tham chiếu Sống kết hợp Quy tắc Bất biến Nghiệp vụ (Live Reference with Strict Immutability Rule)**:
1. Bảng `exam_questions` lưu tham chiếu khóa ngoại `question_id` trỏ tới bảng `questions`.
2. **Quy tắc Bất biến (Immutability Enforcement)**:
   - Một khi một câu hỏi đã được gắn vào một Đề thi mẫu đang được sử dụng trong bất kỳ Ca thi nào (`published` hoặc `closed`), câu hỏi đó **BỊ KHÓA HOÀN TOÀN QUYỀN CHỈNH SỬA NỘI DUNG VÀ PHƯƠNG ÁN**.
   - Nếu giảng viên muốn cải tiến hoặc sửa lỗi chính tả của câu hỏi, hệ thống bắt buộc giảng viên phải **TẠO CÂU HỎI MỚI** (Clone/New Question) và gửi duyệt lại.
   - Bảng `questions` áp dụng **Soft Delete** (`deleted_at`); nghiêm cấm xóa cứng (Hard Delete).
3. Đề xuất kiến trúc cho giai đoạn tiếp theo (Future Phase): Nâng cấp lên cơ chế **Question Versioning** (`parent_id`, `version`) hoặc **Exam Snapshot** (sao chép toàn văn câu hỏi vào cột JSONB `exam_snapshots`) khi số lượng câu hỏi và nhu cầu tái sử dụng đề thi tăng cao.

## 3. Các Phương án Thay thế đã Xem xét (Alternatives Considered)
- **Exam Snapshot toàn văn ngay từ đầu (Full JSONB Snapshot)**: Sao chép toàn bộ `question_text`, `options` vào cột JSONB của `exam_sessions` ngay khi xuất bản. Phương án này cách ly hoàn toàn dữ liệu nhưng làm tăng kích thước cơ sở dữ liệu không cần thiết ở giai đoạn MVP và làm phức tạp hóa các câu truy vấn thống kê phổ điểm theo câu hỏi.
- **Tự do chỉnh sửa câu hỏi không khóa**: Rất nguy hiểm vì sẽ làm biến dạng đề thi lịch sử của sinh viên và dẫn đến sai lệch kết quả khi phúc khảo.

## 4. Hệ quả & Đánh giá Đánh đổi (Consequences)
- **Tích cực**:
  - Giữ cơ sở dữ liệu ở trạng thái chuẩn hóa (3NF), đơn giản, dễ bảo trì, dễ viết truy vấn.
  - Ngăn ngừa hoàn toàn nguy cơ làm hỏng dữ liệu bài thi cũ thông qua ràng buộc logic tại Action/Policy.
- **Tiêu cực / Rủi ro**:
  - Giảng viên không thể sửa nhanh câu hỏi đã dùng mà phải tạo bản ghi mới.
