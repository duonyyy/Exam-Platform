# ADR-006 — Chiến lược Kiểm soát Tranh chấp Đồng thời: Pessimistic Row Locking vs Distributed Lock

**Mã quyết định**: `ADR-006`  
**Ngày quyết định**: 2026-10-05  
**Trạng thái**: `ACCEPTED`  

---

## 1. Bối cảnh (Context)
Tại thời điểm nộp bài thi (`SubmitExamAttempt`), hệ thống phải đối mặt với nguy cơ nộp đúp (Double Submit) do:
- Thí sinh sốt ruột click liên tiếp nhiều lần vào nút Nộp bài.
- Thí sinh mở 2 tab trình duyệt và gửi 2 request song song tại giây cuối cùng.
- Mạng lag khiến client tự động retry request nộp bài.
Nếu không có giải pháp khóa đồng thời, 2 luồng xử lý có thể cùng đọc trạng thái `in_progress`, cùng tính điểm và cùng ghi đè kết quả, gây sai lệch điểm số và làm hỏng tính toàn vẹn của CSDL.

## 2. Quyết định (Decision)
Chúng tôi quyết định lựa chọn **Khóa Dòng Bi quan ở cấp Cơ sở Dữ liệu (PostgreSQL Pessimistic Row-Level Locking via `SELECT ... FOR UPDATE`) kết hợp Header `Idempotency-Key`**:
1. Trong giao dịch nộp bài (`SubmitExamAttemptAction`), câu lệnh đầu tiên là:
   ```sql
   SELECT * FROM exam_attempts WHERE id = ? FOR UPDATE;
   ```
2. Nếu request thứ hai đến, nó buộc phải chờ (Block/Wait) cho đến khi transaction của request thứ nhất commit xong.
3. Khi request thứ hai tiếp cận bản ghi, nó thấy ngay `status = 'submitted'` và bị đẩy ra với mã lỗi `409 Conflict`.
4. Phía client gửi kèm header `Idempotency-Key: <uuid>` để nhận diện các request gửi lại từ mạng và trả về kết quả đã tính mà không thực thi lại logic.

## 3. Các Phương án Thay thế đã Xem xét (Alternatives Considered)
- **Khóa Phân tán bằng Redis (Redis Distributed Lock / Redlock)**: Sử dụng Redis `SET resource_name my_random_value NX PX 30000`. Phương án này hoạt động tốt nhưng tạo thêm một điểm phụ thuộc ngoài CSDL (Redis failover risk), tăng độ phức tạp khi phải xử lý lock expiration trong khi transaction CSDL chưa commit xong.
- **Khóa Lạc quan (Optimistic Locking via version column)**: Thêm cột `version` và cập nhật `WHERE id = ? AND version = ?`. Phương án này khiến request thứ hai bị văng lỗi ngay mà không thể tận dụng cơ chế serialize có trật tự của database, dẫn đến tỷ lệ lỗi cao khi thí sinh nộp bài trong tích tắc cuối.

## 4. Hệ quả & Đánh giá Đánh đổi (Consequences)
- **Tích cực**:
  - Tận dụng 100% tính năng ACID tự nhiên của PostgreSQL Engine, đảm bảo tính nhất quán tuyệt đối.
  - Không cần cài đặt hay duy trì cơ chế giải phóng khóa phân tán phức tạp.
- **Tiêu cực / Rủi ro**:
  - Thời gian giữ khóa dòng (`lock duration`) phải giữ càng ngắn càng tốt (dưới 50ms) bằng cách tối ưu hóa thuật toán tính điểm chạy trên bộ nhớ RAM, tránh thực hiện các tác vụ I/O nặng (như gọi external API hoặc gửi email) bên trong khối khóa `FOR UPDATE`.
