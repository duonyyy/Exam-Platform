# ⚙️ 06 — Nhóm Tài Liệu: Vận Hành, Hạ Tầng & Giám Sát (Operations & DevOps)

Thư mục này tập hợp các tài liệu mang vai trò **thiết kế khả năng quan sát (Logs/Metrics/Health), kế hoạch chịu tải đỉnh (Capacity Planning), hạ tầng triển khai CI/CD và quản trị rủi ro hệ thống**.

---

## Danh Mục Tài Liệu & Vai Trò Của Từng Tệp Tin

| Tên Tệp Tin | Vai Trò & Mục Đích DevOps & Vận Hành |
| :--- | :--- |
| **[`18-OBSERVABILITY.md`](18-OBSERVABILITY.md)** | Định dạng nhật ký JSON có cấu trúc (Monolog), Context `request_id`, danh mục Core Metrics đo lường, endpoint `/api/v1/health`. |
| **[`20-PERFORMANCE_PLAN.md`](20-PERFORMANCE_PLAN.md)** | Phân tích 3 kịch bản tải đỉnh (Start Spike, Autosave, Submit Spike), Connection Pooling PgBouncer, ứng viên Cache/Queue hợp lý. |
| **[`21-DEPLOYMENT.md`](21-DEPLOYMENT.md)** | Ma trận môi trường (Dev/Staging/Prod), CI/CD GitHub Actions, Dockerfile multi-stage, Supervisor queue workers, Zero-downtime migration. |
| **[`22-RISK_REGISTER.md`](22-RISK_REGISTER.md)** | Bảng đăng ký rủi ro (Risk Register) đánh giá 8 rủi ro hệ thống (Lộ đề, IDOR, Double submit, Sập server) kèm phương án khắc phục. |
