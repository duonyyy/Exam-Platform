# ADR-001 — Lựa chọn Laravel 13 làm Nền tảng RESTful API Trung tâm

**Mã quyết định**: `ADR-001`  
**Ngày quyết định**: 2026-10-05  
**Trạng thái**: `ACCEPTED`  

---

## 1. Bối cảnh (Context)
Hệ thống Exam Platform yêu cầu một tầng máy chủ Backend có khả năng:
- Xử lý các quy trình nghiệp vụ phức tạp: Kiểm soát vòng đời ca thi, phân công, quản lý đề thi, chấm điểm tự động.
- Cung cấp cơ chế xác thực phân quyền đa tầng (RBAC + PBAC), phòng chống tấn công IDOR và Mass Assignment.
- Tích hợp mạnh mẽ với cơ sở dữ liệu quan hệ, hỗ trợ Transaction ACID và các ràng buộc dữ liệu toàn vẹn.
- Phục vụ đồng thời mục tiêu học tập chuyên sâu của developer về kiến trúc backend chuẩn mực.

## 2. Quyết định (Decision)
Chúng tôi quyết định lựa chọn **Laravel 13** trên nền tảng **PHP 8.3-FPM** làm backend dịch vụ trung tâm, chỉ xây dựng **RESTful API thuần túy** (`/api/v1` trả về JSON). Tuyệt đối không dùng Blade templates, Livewire, hay kiến trúc Monolith sinh HTML tại máy chủ.

## 3. Các Phương án Thay thế đã Xem xét (Alternatives Considered)
- **Node.js (NestJS / Express)**: Tốc độ xử lý bất đồng bộ tốt nhưng đòi hỏi cấu hình thủ công nhiều thư viện rời rạc (ORM Prisma/TypeORM, Passport/JWT, Validator), tính đóng gói nghiệp vụ enterprise của hệ sinh thái chưa đồng bộ và chặt chẽ bằng Laravel.
- **Go (Golang - Gin/Fiber)**: Hiệu năng thô (Raw Throughput) và tiêu tốn RAM cực kỳ ấn tượng, nhưng thời gian phát triển các tính năng quan hệ CSDL, Form Validation, Eloquent-style migrations và Policy RBAC tốn nhiều công sức, không tối ưu cho mục tiêu đào tạo Senior Laravel Engineer.
- **Python (FastAPI / Django)**: Django có ORM mạnh nhưng chậm chạp; FastAPI nhanh nhưng thiếu tính năng Enterprise Action/Job/Queue tích hợp sẵn như Laravel.

## 4. Hệ quả & Đánh giá Đánh đổi (Consequences)
- **Tích cực**:
  - Tận dụng sức mạnh tối đa của hệ sinh thái Laravel: Eloquent ORM, Database Transactions, Form Requests, Policies, API Resources, Queue, Pest Testing.
  - Phân tách rõ ràng trách nhiệm giữa Backend (chân lý dữ liệu & nghiệp vụ) và Frontend (trình bày UI).
- **Tiêu cực / Rủi ro**:
  - PHP-FPM là mô hình "share-nothing" (mỗi request khởi động lại vòng đời ứng dụng), tốn bộ nhớ hơn Go.
  - Cần tối ưu OPcache và cấu hình kết nối CSDL (Connection Pooling) cẩn thận khi chịu tải đỉnh.
