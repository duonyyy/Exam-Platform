# 11 — Cẩm Nang Tối Ưu Hóa PostgreSQL 16 (Table Design & Performance Guide)

**Dự án**: Exam Platform  
**Tài liệu**: `docs/02-domain-database/11-POSTGRESQL_OPTIMIZATION_GUIDE.md`  
**Áp dụng Skill**: `postgresql-table-design`  
**Động cơ CSDL**: PostgreSQL 16 Alpine  
**Trạng thái**: Production Standards Approved  

---

## 1. Nguyên Tắc Thiết Kế Kiểu Dữ Liệu & Khóa (Data Types & Constraints)

1. **Khóa Chính (Primary Keys)**:
   - Sử dụng `BIGINT GENERATED ALWAYS AS IDENTITY` cho toàn bộ các bảng nghiệp vụ (`users`, `exams`, `exam_sessions`, `exam_attempts`, v.v.).
   - Tránh dùng `UUIDv4` ngẫu nhiên làm khóa chính clustered để ngăn ngừa hiện tượng phân mảnh chỉ mục (B-Tree index page fragmentation).
2. **Thời Gian (Timestamp)**:
   - Luôn sử dụng `TIMESTAMPTZ` (Timestamp with time zone). Tuyệt đối tránh `TIMESTAMP` không có múi giờ để bảo vệ tính chính xác của Server-Authoritative Clock.
3. **Tiền tệ & Điểm số (Numeric)**:
   - Sử dụng `NUMERIC(5, 2)` cho thang điểm thi (ví dụ: `10.00`, `9.75`) để triệt tiêu lỗi làm tròn của số thực dấu phẩy động (`FLOAT/DOUBLE`).
4. **Chuỗi Ký Tự**:
   - Sử dụng `TEXT` kết hợp ràng buộc `CHECK (LENGTH(code) <= 50)` thay vì `VARCHAR(n)` hay `CHAR(n)`.
5. **Dữ liệu Bán Cấu Trúc (JSONB)**:
   - Dùng `JSONB` cho cấu trúc các phương án trả lời `options` và `correct_answer` trong bảng `questions`. Không dùng kiểu `JSON` văn bản thuần.

---

## 2. Chiến Lược Chỉ Mục Tối Ưu (Indexing Strategy)

PostgreSQL **không tự động đánh index cho các cột khóa ngoại (Foreign Keys)**. Mọi cột quan hệ phải được khai báo index tường minh:

```sql
-- 1. Index truy vấn ngân hàng câu hỏi theo môn học & trạng thái
CREATE INDEX idx_questions_topic_status ON questions(topic_id, status) WHERE deleted_at IS NULL;

-- 2. Index trung gian lắp ráp đề thi
CREATE UNIQUE INDEX uq_exam_questions_exam_question ON exam_questions(exam_id, question_id);
CREATE INDEX idx_exam_questions_exam_order ON exam_questions(exam_id, "order");

-- 3. Index truy vấn ca thi theo trạng thái và khung giờ
CREATE INDEX idx_exam_sessions_status_dates ON exam_sessions(status, start_at, end_at);

-- 4. Composite Index bảo vệ chống thi trùng lặp & kiểm tra bài thi
CREATE UNIQUE INDEX uq_exam_attempts_session_student_attempt 
    ON exam_attempts(exam_session_id, student_id, attempt_number);

CREATE INDEX idx_exam_attempts_session_status_score 
    ON exam_attempts(exam_session_id, status, score);

-- 5. Index siêu tốc cho lưu câu trả lời (Upsert)
CREATE UNIQUE INDEX uq_attempt_answers_attempt_question 
    ON attempt_answers(attempt_id, question_id);

-- 6. Index sự kiện giám sát lọc theo mức độ vi phạm
CREATE INDEX idx_proctoring_attempt_severity 
    ON proctoring_events(attempt_id, severity, occurred_at);
```

---

## 3. Khóa Bi Quan & Kiểm Soát Tranh Chấp (Pessimistic Locking Patterns)

Để bảo đảm tính nguyên tử của giao dịch nộp bài, câu lệnh SQL sinh ra bởi `lockForUpdate()` của Laravel tương đương:

```sql
BEGIN;

-- Khóa độc quyền dòng attempt ngăn chặn chạy đua nộp bài kép (Double Submit)
SELECT * FROM exam_attempts 
WHERE id = 842 
FOR UPDATE;

-- Kiểm tra trạng thái hiện hành
-- Nếu status <> 'in_progress' -> ROLLBACK và trả lỗi 409 Conflict

-- Cập nhật điểm số và đóng bài thi
UPDATE exam_attempts 
SET status = 'submitted', 
    submitted_at = '2026-10-22 08:30:00+00', 
    score = 9.50, 
    updated_at = NOW() 
WHERE id = 842;

COMMIT;
```

---

## 4. Kế Hoạch Phân Vùng Bảng (Table Partitioning Roadmap)

Khi hệ thống mở rộng đạt trên 1.000.000 lượt làm bài mỗi kỳ:
- Bảng `attempt_answers` và `proctoring_events` nên được chuyển sang mô hình **Declarative Range Partitioning** theo thời gian `occurred_at` (hàng tháng hoặc theo học kỳ).
- Giúp thao tác dọn dẹp hoặc sao lưu dữ liệu cũ thực hiện tức thì bằng `DROP PARTITION` thay vì chạy `DELETE` gây phình dữ liệu (table bloat).

---

## 5. Tinh Chỉnh Tham Số CSDL Cho Tải Đỉnh (PostgreSQL Performance Tuning)

Cấu hình khuyến nghị trong `docker/postgres/postgresql.conf`:
- `max_connections = 300`: Giới hạn kết nối trực tiếp, kết hợp PgBouncer connection pooling.
- `shared_buffers = 2GB`: Tương đương 25% RAM máy chủ chuyên dụng.
- `effective_cache_size = 6GB`: Tương đương 75% RAM máy chủ.
- `work_mem = 16MB`: Đảm bảo các phép sắp xếp (ORDER BY, Median, StdDev) trong `SessionAnalyticsService` chạy hoàn toàn trên RAM (in-memory sort).
- `maintenance_work_mem = 512MB`: Tăng tốc tạo index và autovacuum.
- `autovacuum_vacuum_scale_factor = 0.05`: Kích hoạt vacuum sớm khi có 5% số dòng thay đổi, chống dead tuples ở bảng cập nhật thường xuyên (`attempt_answers`).
