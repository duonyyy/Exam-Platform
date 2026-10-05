# 22 — Risk Register & Mitigation Strategy

**Dự án**: Exam Platform  
**Tài liệu**: `docs/06-operations-devops/22-RISK_REGISTER.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. Bảng Đăng ký Rủi ro Hệ thống (Risk Register)

| Mã Rủi ro | Tên Rủi ro & Tình huống (Risk Description) | Phân loại | Xác suất (Probability) | Mức độ Tác động (Impact) | Mức độ Rủi ro Tổng thể | Biện pháp Phòng ngừa & Khắc phục (Mitigation Strategy) | Người chịu trách nhiệm |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| **`RSK-01`** | **Rò rỉ Đáp án Đúng (`correct_answer`)**: Thí sinh xem được đáp án trong payload API hoặc DevTools Network Tab khi đang làm bài thi. | Bảo mật (Security) | High | **Critical** | **CỰC KỲ CAO** | Tách riêng `QuestionStudentResource`; khai báo `$hidden = ['correct_answer']` trên Eloquent model; kiểm thử tự động `assertJsonMissing(['correct_answer'])`. | Backend Lead / Security Eng |
| **`RSK-02`** | **Lỗ hổng Truy cập Trái phép (IDOR)**: Thí sinh đổi `attempt_id` để đọc bài làm hoặc sửa đáp án của thí sinh khác. | Bảo mật (Security) | High | **Critical** | **CỰC KỲ CAO** | Bắt buộc kiểm tra quyền sở hữu tại Laravel Policy: `$attempt->student_id === Auth::id()`; viết Feature Tests kiểm chứng mã `403`. | Backend Lead |
| **`RSK-03`** | **Nộp bài đúp (Double Submit)**: Thí sinh gửi 2 request nộp song song gây tranh chấp ghi đè và tính điểm 2 lần. | Đồng thời (Concurrency) | High | **High** | **CAO** | Khóa dòng độc quyền trong PostgreSQL: `SELECT ... FOR UPDATE` trong Database Transaction; áp dụng Header `Idempotency-Key`. | Database Architect / Backend Lead |
| **`RSK-04`** | **Nghẽn Cơ sở Dữ liệu tại Tải Đỉnh**: 1.000 thí sinh cùng click "Vào thi" hoặc nộp bài khiến PostgreSQL cạn kiệt connection pool. | Hiệu năng (Performance) | Medium | **High** | **CAO** | Cấu hình PgBouncer giới hạn connection $< 200$; tối ưu chỉ mục Composite Index; Eager loading triệt tiêu hoàn toàn N+1 queries. | Database Architect / DevOps |
| **`RSK-05`** | **Làm hỏng Dữ liệu Đề thi Lịch sử**: Giảng viên sửa nội dung câu hỏi sau khi kỳ thi đã diễn ra làm sai lệch nội dung đề cũ. | Toàn vẹn Dữ liệu | Medium | **High** | **TRUNG BÌNH** | Áp dụng Quy tắc Bất biến (`ADR-005`): Khóa sửa câu hỏi khi đã gắn vào ca thi; áp dụng Soft Delete cho bảng `questions`. | Software Architect |
| **`RSK-06`** | **Sai sót trong Thuật toán Chấm điểm**: Câu hỏi nhiều lựa chọn hoặc câu hỏi điểm lẻ tính sai điểm do làm tròn hoặc sai logic. | Nghiệp vụ (Business) | Low | **High** | **TRUNG BÌNH** | Tách riêng module `AttemptScorer` độc lập; viết Unit Tests bao phủ 100% các kịch bản chấm điểm với độ chính xác số thực `Decimal`. | Backend Lead / Tester |
| **`RSK-07`** | **Sự cố Khóa bảng khi Chạy Migration**: Lệnh `migrate` chạy trực tiếp trên Production thêm cột `NOT NULL` gây treo hệ thống giữa giờ thi. | Vận hành (DevOps) | Medium | **Critical** | **CAO** | Áp dụng mô hình Expand-Contract; tạo index với `CONCURRENTLY`; chỉ deploy ngoài khung giờ có ca thi đang mở. | DevOps / DBA |
| **`RSK-08`** | **Sập Máy chủ Phòng thi (Exam Outage)**: Hạ tầng server gặp sự cố phần cứng trong lúc hàng ngàn thí sinh đang làm bài. | Vận hành (DevOps) | Low | **Critical** | **CAO** | Tiến trình Autosave liên tục lưu từng câu vào PostgreSQL; cơ chế PITR (Point-in-Time Recovery) bảo toàn dữ liệu bài làm trong vòng 5 phút. | DevOps / System Admin |
