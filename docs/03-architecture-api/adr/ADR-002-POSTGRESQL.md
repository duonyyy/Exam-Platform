# ADR-002 — Lựa chọn PostgreSQL 16 làm Cơ sở Dữ liệu Quan hệ Chính

**Mã quyết định**: `ADR-002`  
**Ngày quyết định**: 2026-10-05  
**Trạng thái**: `ACCEPTED`  

---

## 1. Bối cảnh (Context)
Hệ thống thi trực tuyến đòi hỏi tính toàn vẹn dữ liệu cực kỳ khắt khe:
- Dữ liệu kết hợp giữa mô hình quan hệ chặt chẽ (Users, Subjects, Exams, Attempts) và cấu trúc tài liệu bán có cấu trúc (Các phương án lựa chọn `options` và `correct_answer` dưới dạng mảng JSON đa hình).
- Đòi hỏi các tính năng an toàn giao dịch cấp cao: Transaction Isolation, Pessimistic Row Locking (`SELECT ... FOR UPDATE`), Composite Unique Constraints, Check Constraints.

## 2. Quyết định (Decision)
Lựa chọn **PostgreSQL 16** làm hệ quản trị cơ sở dữ liệu quan hệ duy nhất cho Exam Platform. Khai thác thế mạnh của kiểu dữ liệu **`JSONB`** cho các trường phương án câu hỏi và siêu dữ liệu giám sát phòng thi.

## 3. Các Phương án Thay thế đã Xem xét (Alternatives Considered)
- **MySQL 8.0**: Rất phổ biến nhưng khả năng xử lý JSON functions/indexes kém linh hoạt hơn PostgreSQL. Hành vi xử lý khóa dòng và các câu lệnh `ON CONFLICT DO UPDATE` của PostgreSQL chuẩn mực và dễ dự đoán hơn.
- **MongoDB**: Phù hợp cho cấu trúc tài liệu câu hỏi linh hoạt, nhưng lại yếu về quan hệ bảng, thiếu các ràng buộc khóa ngoại chặt chẽ và giao dịch multi-document nặng nề, dễ dẫn đến hiện tượng dữ liệu mồ côi (Orphan records) giữa ca thi và bài làm.

## 4. Hệ quả & Đánh giá Đánh đổi (Consequences)
- **Tích cực**:
  - Hỗ trợ kiểu dữ liệu `JSONB` với tốc độ truy vấn cao và khả năng đánh chỉ mục GIN.
  - Hỗ trợ đầy đủ các cơ chế khóa dòng bi quan độc quyền (`FOR UPDATE`) giúp chống Double Submit triệt để.
  - Hỗ trợ công cụ phân tích truy vấn `EXPLAIN (ANALYZE, BUFFERS)` mạnh mẽ.
- **Tiêu cực / Rủi ro**:
  - Tiêu tốn RAM hơn so với MySQL trên môi trường cấu hình thấp.
  - Cần tinh chỉnh tham số `shared_buffers`, `work_mem` và cấu hình PgBouncer khi quy mô mở rộng.
