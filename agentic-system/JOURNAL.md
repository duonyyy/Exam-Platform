# Nhật Ký Phát Triển & Học Tập (Weekly Engineering Journal)

> Nhật ký ghi nhận tiến độ kiến trúc, thách thức kỹ thuật, giải pháp thực thi và bài học kinh nghiệm trong quá trình xây dựng hệ thống **ExamOps Agent**.

---

## 📅 Tuần 1: Thiết Lập Nền Tảng Kiến Trúc & LangGraph StateGraph

### Mục tiêu tuần
- [x] Thiết lập cấu trúc dự án chuẩn `agentic-system` (FastAPI + LangGraph + Pydantic v2).
- [x] Hiện thực đồ thị trạng thái 6 bước (Intake $\rightarrow$ Plan $\rightarrow$ Execute $\rightarrow$ Verify $\rightarrow$ Approval $\rightarrow$ Finalize).
- [x] Thiết lập bộ lưu trữ trạng thái bền bỉ bằng SQLite Checkpointer.

### Đã hoàn thành
- Xây dựng `AgentState` schema và phân tách các nodes vào thư mục `src/examops/nodes/`.
- Hiện thực cơ chế `interrupt()` của LangGraph tại nút Human Review Gate.
- Thiết lập bộ kiểm tra ma trận quyền hạn vai trò người dùng trong `permissions.py`.

### Khó khăn & Giải pháp
| Khó khăn | Giải pháp kiến trúc | Kết quả |
|---|---|---|
| Cần lưu trữ trạng thái phiên ngắt quãng khi đợi duyệt | Tích hợp `langgraph-checkpoint-sqlite` độc lập | Trạng thái phiên thi được bảo toàn qua restart server |
| Nguy cơ rò rỉ phân quyền khi gọi công cụ | Triển khai `ToolRegistry` theo chính sách Least-Privilege | Thí sinh và giáo viên chỉ gọi được tools trong allowlist |

---

## 📅 Tuần 2: Tích Hợp Đa Mô Hình (Multi-Provider) & Thẩm Định Số Học

### Mục tiêu tuần
- [x] Xây dựng lớp trừu tượng `ModelProvider` hỗ trợ Mock, Google Gemini và OpenAI-compatible endpoints (Ollama).
- [x] Xây dựng bộ thẩm định toán học tất định `verify_blueprint` và `verify_readiness_review`.
- [x] Thiết kế 2 kỹ năng nghiệp vụ khảo thí cốt lõi: `ExamBlueprintSkill` và `ExamReadinessReviewSkill`.

### Đã hoàn thành
- Triển khai `MockModelProvider` đảm bảo 100% test suites chạy ngoại tuyến (hermetic tests) không phụ thuộc API key ngoài.
- Xây dựng thuật toán kiểm tra tổng tỷ lệ độ khó Bloom (100.0%) và tổng điểm thi (10.0).
- Thiết lập vòng lặp tự sửa sai (**Self-Correction Retry Loop**) khi LLM sinh số liệu không khớp.

---

## 📅 Tuần 3: Tích Hợp Phase 13 — Human-in-the-Loop & Core API Blueprint Materialization

### Mục tiêu tuần
- [x] Kết nối `ExamPlatformClient` với REST API Laravel Core (`/api/v1/exams/from-blueprint`).
- [x] Hiện thực cơ chế chữ ký số học SHA-256 `proposal_hash` chống replay và tampering.
- [x] Đồng bộ luồng duyệt đề thi trên giao diện Next.js Web Client (`teacher/ai-assistant`).

### Đã hoàn thành
- Mở rộng `ExamPlatformClient` hỗ trợ live token và mock sandbox.
- Bổ sung Scenarios 7 và 8 vào bộ lượng giá `test_eval_suite.py` đạt **36/36 tests PASS**.
- Tái cấu trúc phân lớp module (`nodes/`, `tools/`, `api/`, `services/`, `models/`) theo chuẩn công nghiệp.

### Bài học kinh nghiệm
1. **Deterministic Verification trước Human Review**: Luôn thẩm định số học chặt chẽ trước khi trình đề xuất cho con người phê duyệt để tiết kiệm thời gian thẩm định của giảng viên.
2. **Fail-Closed Boundary**: Microservice AI không bao giờ chạm trực tiếp database PostgreSQL, giúp loại trừ hoàn toàn các nguy cơ SQL injection hoặc bypass chính sách RBAC.
