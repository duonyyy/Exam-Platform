# 🏗️ 03 — Nhóm Tài Liệu: Kiến Trúc Hệ Thống & Hợp Đồng API (Architecture & API)

Thư mục này tập hợp các tài liệu mang vai trò **thiết kế kiến trúc hệ thống C4 Model, đặc tả giao diện lập trình ứng dụng RESTful API `/api/v1`, sơ đồ tuần tự các luồng sinh tử, và các quyết định kiến trúc then chốt (ADR)**.

---

## Danh Mục Tài Liệu & Vai Trò Của Từng Tệp Tin

| Tên Tệp Tin / Thư Mục | Vai Trò & Mục Đích Kỹ Thuật |
| :--- | :--- |
| **[`00-DESIGN_REVIEW.md`](00-DESIGN_REVIEW.md)** | Đánh giá cổng thiết kế (Design Review Gate), checklist 22 hạng mục và phán quyết chính thức: **READY FOR IMPLEMENTATION**. |
| **[`08-ARCHITECTURE.md`](08-ARCHITECTURE.md)** | Kiến trúc C4 Model Level 1 (System Context), Level 2 (Container), Deployment Diagram phân tách mạng Public/Private. |
| **[`12-API_DESIGN.md`](12-API_DESIGN.md)** | Đặc tả toàn bộ 28 Endpoints RESTful API `/api/v1`, chuẩn Envelope (`data`, `meta`), Schemas Request/Response, HTTP status codes. |
| **[`15-SEQUENCE_DIAGRAMS.md`](15-SEQUENCE_DIAGRAMS.md)** | 5 sơ đồ tuần tự Mermaid: Login, Publish Session, Start Attempt, Autosave, và Submit có khóa dòng bi quan `FOR UPDATE`. |
| **[`adr/`](adr/ADR-001-LARAVEL_REST_API.md)** | Thư mục 6 Bản ghi Quyết định Kiến trúc: `ADR-001` (Laravel), `ADR-002` (PostgreSQL), `ADR-003` (Next.js), `ADR-004` (Sanctum), `ADR-005` (Immutability), `ADR-006` (Pessimistic Locking). |
