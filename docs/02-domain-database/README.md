# 🗄️ 02 — Nhóm Tài Liệu: Mô Hình Miền & Cơ Sở Dữ Liệu (Domain & Database)

Thư mục này tập hợp các tài liệu mang vai trò **mô hình hóa thực thể nghiệp vụ, thiết kế máy trạng thái FSM, cấu trúc lược đồ CSDL PostgreSQL, sơ đồ quan hệ ERD và phân loại dữ liệu nhạy cảm**.

---

## Danh Mục Tài Liệu & Vai Trò Của Từng Tệp Tin

| Tên Tệp Tin | Vai Trò & Mục Đích Kỹ Thuật |
| :--- | :--- |
| **[`06-DOMAIN_MODEL.md`](06-DOMAIN_MODEL.md)** | Sơ đồ lớp miền, trách nhiệm từng thực thể và phân biệt rạch ròi: `Exam` vs `ExamSession`, `Assignment` vs `Attempt`. |
| **[`07-STATE_MACHINES.md`](07-STATE_MACHINES.md)** | Máy trạng thái hữu hạn (FSM) cho Question, ExamSession, ExamAttempt; cấm tuyệt đối `submitted` $\rightarrow$ `in_progress`. |
| **[`09-DATABASE_DESIGN.md`](09-DATABASE_DESIGN.md)** | Thiết kế chi tiết 13 bảng PostgreSQL 16, khóa ngoại `RESTRICT`, Composite Uniques, JSONB schema, Migration code mẫu. |
| **[`10-ERD.md`](10-ERD.md)** | Sơ đồ quan hệ thực thể Mermaid ERD hoàn chỉnh với tất cả các bảng, khóa và bản số quan hệ (Cardinality). |
| **[`11-DATA_CLASSIFICATION.md`](11-DATA_CLASSIFICATION.md)** | Phân loại 4 cấp độ dữ liệu (Public, Internal, Sensitive, Highly Sensitive), quy tắc thanh lọc nhật ký (Log Masking). |
