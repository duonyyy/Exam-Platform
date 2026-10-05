# 📚 Exam Platform — Tài Liệu Kiến Trúc & Thiết Kế Hệ Thống

> **Single Source of Truth** cho toàn bộ quá trình phân tích, thiết kế, quy chuẩn kỹ thuật và lộ trình thực thi của hệ thống **Exam Platform** (Monorepo: `core-api` + `web-client`).

---

## 🗂️ 1. Cấu Trúc Thư Mục Phân Định Theo Vai Trò Tài Liệu

Tất cả tài liệu được phân chia thành **8 thư mục chức năng**, mỗi thư mục đại diện cho một vai trò kỹ thuật độc lập trong chu trình phát triển phần mềm:

```text
docs/
├── README.md                           # Tệp điều hướng & bản đồ tra cứu trung tâm
│
├── 01-requirements/                    # [VAI TRÒ: YÊU CẦU & BÀI TOÁN NGHIỆP VỤ]
│   ├── README.md                       # Mục lục & vai trò tài liệu nhóm 01
│   ├── 01-PROBLEM_AND_SCOPE.md         # Bài toán, mục tiêu, phạm vi dự án
│   ├── 02-REQUIREMENTS.md              # Yêu cầu chức năng chi tiết (FR-*)
│   ├── 03-NON_FUNCTIONAL_REQUIREMENTS.md # Yêu cầu phi chức năng (NFR-*)
│   ├── 04-USE_CASES.md                 # Sơ đồ và đặc tả các Use Case cốt lõi (UC-*)
│   └── 05-BUSINESS_RULES.md            # Danh mục 16 quy tắc nghiệp vụ và tầng thực thi (BR-*)
│
├── 02-domain-database/                 # [VAI TRÒ: MÔ HÌNH MIỀN & THIẾT KẾ CSDL]
│   ├── README.md                       # Mục lục & vai trò tài liệu nhóm 02
│   ├── 06-DOMAIN_MODEL.md              # Sơ đồ Domain Model & trách nhiệm thực thể
│   ├── 07-STATE_MACHINES.md            # Máy trạng thái (FSM) Question, Session, Attempt
│   ├── 09-DATABASE_DESIGN.md           # Thiết kế CSDL chi tiết, 13 bảng quan hệ, Migration mẫu
│   ├── 10-ERD.md                       # Sơ đồ Mermaid ERD và bản số quan hệ
│   └── 11-DATA_CLASSIFICATION.md       # Phân loại dữ liệu & quy tắc thanh lọc nhật ký
│
├── 03-architecture-api/                # [VAI TRÒ: KIẾN TRÚC HỆ THỐNG & API CONTRACTS]
│   ├── README.md                       # Mục lục & vai trò tài liệu nhóm 03
│   ├── 00-DESIGN_REVIEW.md             # Đánh giá cổng thiết kế (Gate Verdict: READY)
│   ├── 08-ARCHITECTURE.md              # Kiến trúc C4 Model Level 1 Context & Level 2 Container
│   ├── 12-API_DESIGN.md                # Đặc tả toàn diện API Endpoints /api/v1 & Schemas
│   ├── 15-SEQUENCE_DIAGRAMS.md         # Sơ đồ tuần tự các luồng nghiệp vụ cốt lõi
│   └── adr/                            # 6 Bản ghi Quyết định Kiến trúc (ADR-001 -> ADR-006)
│       ├── ADR-001-LARAVEL_REST_API.md
│       ├── ADR-002-POSTGRESQL.md
│       ├── ADR-003-NEXTJS_FRONTEND.md
│       ├── ADR-004-SANCTUM_AUTHENTICATION.md
│       ├── ADR-005-EXAM_QUESTION_SNAPSHOT_VS_LIVE.md
│       └── ADR-006-ATTEMPT_CONCURRENCY_STRATEGY.md
│
├── 04-security-concurrency/            # [VAI TRÒ: AN NINH BẢO MẬT & TRANH CHẤP ĐỒNG THỜI]
│   ├── README.md                       # Mục lục & vai trò tài liệu nhóm 04
│   ├── 13-AUTH_AND_ACCESS_CONTROL.md   # Xác thực Sanctum Cookie Proxy, Policy chống IDOR
│   ├── 14-THREAT_MODEL.md              # Mô hình đe dọa STRIDE + OWASP Top 10, 8 kịch bản tấn công
│   └── 16-CONSISTENCY_AND_CONCURRENCY.md # Khóa bi quan FOR UPDATE, Race conditions, Idempotency
│
├── 05-frontend/                        # [VAI TRÒ: THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG]
│   ├── README.md                       # Mục lục & vai trò tài liệu nhóm 05
│   └── 17-FRONTEND_DESIGN.md           # Kiến trúc Next.js 15+ App Router, Focus Room, TanStack Query
│
├── 06-operations-devops/               # [VAI TRÒ: VẬN HÀNH, GIÁM SÁT & TRIỂN KHAI]
│   ├── README.md                       # Mục lục & vai trò tài liệu nhóm 06
│   ├── 18-OBSERVABILITY.md             # Khả năng quan sát: Structured JSON logs, Metrics, Health check
│   ├── 20-PERFORMANCE_PLAN.md          # Kế hoạch chịu tải đỉnh (Spikes), PgBouncer, Caching
│   ├── 21-DEPLOYMENT.md                # Ma trận môi trường, CI/CD Actions, Multi-stage Dockerfiles
│   └── 22-RISK_REGISTER.md             # Bảng đăng ký rủi ro (Risk Register) & kế hoạch ứng phó
│
├── 07-testing-execution/               # [VAI TRÒ: KIỂM THỬ TỰ ĐỘNG & KẾ HOẠCH THỰC THI]
│   ├── README.md                       # Mục lục & vai trò tài liệu nhóm 07
│   ├── 19-TEST_STRATEGY.md             # Chiến lược kiểm thử tự động, Feature Tests, Ma trận RTM
│   └── 23-IMPLEMENTATION_PLAN.md       # Lộ trình triển khai 12 Phase kèm Definition of Done (DoD)
│
└── 08-guidelines/                      # [VAI TRÒ: QUY CHUẨN LẬP TRÌNH & ĐÀO TẠO KỸ SƯ]
    ├── README.md                       # Mục lục & vai trò tài liệu nhóm 08
    ├── CODING_STANDARDS.md             # Quy chuẩn viết code: PSR-12, Laravel Pint, Clean Code
    ├── COMMIT_STANDARDS.md             # Quy chuẩn Commit chuẩn Production (Conventional Commits)
    └── LEARNING_GUIDE.md               # Cẩm nang học Senior Backend qua từng feature
```

---

## 🎯 2. Hướng Dẫn Tra Cứu Nhanh Cho Lập Trình Viên

| Mục tiêu tra cứu | Thư mục chức năng | Tài liệu tham chiếu trực tiếp |
| :--- | :--- | :--- |
| **Hiểu bài toán nghiệp vụ & Các Actor** | [`01-requirements/`](01-requirements/README.md) | [01-PROBLEM_AND_SCOPE.md](01-requirements/01-PROBLEM_AND_SCOPE.md) |
| **Quy tắc nghiệp vụ & Bất biến không được vi phạm** | [`01-requirements/`](01-requirements/README.md) | [05-BUSINESS_RULES.md](01-requirements/05-BUSINESS_RULES.md) |
| **Cấu trúc CSDL, Bảng, Khóa ngoại, Composite Index** | [`02-domain-database/`](02-domain-database/README.md) | [09-DATABASE_DESIGN.md](02-domain-database/09-DATABASE_DESIGN.md) & [10-ERD.md](02-domain-database/10-ERD.md) |
| **Kiến trúc C4 & Hợp đồng API /api/v1** | [`03-architecture-api/`](03-architecture-api/README.md) | [08-ARCHITECTURE.md](03-architecture-api/08-ARCHITECTURE.md) & [12-API_DESIGN.md](03-architecture-api/12-API_DESIGN.md) |
| **Bảo mật, Chống IDOR, Cơ chế Khóa nộp bài** | [`04-security-concurrency/`](04-security-concurrency/README.md)| [13-AUTH_AND_ACCESS_CONTROL.md](04-security-concurrency/13-AUTH_AND_ACCESS_CONTROL.md) & [16-CONSISTENCY_AND_CONCURRENCY.md](04-security-concurrency/16-CONSISTENCY_AND_CONCURRENCY.md) |
| **Cấu trúc màn hình Web Client Next.js** | [`05-frontend/`](05-frontend/README.md) | [17-FRONTEND_DESIGN.md](05-frontend/17-FRONTEND_DESIGN.md) |
| **Giám sát Observability & Triển khai Docker** | [`06-operations-devops/`](06-operations-devops/README.md) | [18-OBSERVABILITY.md](06-operations-devops/18-OBSERVABILITY.md) & [21-DEPLOYMENT.md](06-operations-devops/21-DEPLOYMENT.md) |
| **Cách viết Feature Test kiểm chứng** | [`07-testing-execution/`](07-testing-execution/README.md) | [19-TEST_STRATEGY.md](07-testing-execution/19-TEST_STRATEGY.md) |
| **Lộ trình từng bước khi code (Phase 1 $\rightarrow$ 12)** | [`07-testing-execution/`](07-testing-execution/README.md) | [23-IMPLEMENTATION_PLAN.md](07-testing-execution/23-IMPLEMENTATION_PLAN.md) |
| **Quy chuẩn Code PHP, Commit & Cẩm nang học tập** | [`08-guidelines/`](08-guidelines/README.md) | [CODING_STANDARDS.md](08-guidelines/CODING_STANDARDS.md), [COMMIT_STANDARDS.md](08-guidelines/COMMIT_STANDARDS.md) & [LEARNING_GUIDE.md](08-guidelines/LEARNING_GUIDE.md) |
