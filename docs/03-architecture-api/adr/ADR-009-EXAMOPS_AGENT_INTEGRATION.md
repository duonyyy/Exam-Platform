# ADR-009 — Tích hợp ExamOps Agent & Cổng Phê duyệt Human-in-the-Loop

**Ngày quyết định**: 2026-10-22  
**Trạng thái**: `ACCEPTED`  

## Bối cảnh

Hệ thống Exam Platform cần bổ sung trợ lý AI hỗ trợ Giảng viên thiết kế ma trận đề thi mẫu (Blueprint) và kiểm tra độ sẵn sàng (Readiness Review). Dịch vụ AI Agent (`agentic-system`) được viết bằng Python 3.12 (FastAPI, LangGraph), chạy như một microservice độc lập với cổng bảo mật riêng biệt.

Theo Hiến pháp Kỹ thuật `AGENTS.md` và `docs/agentic-ai/00-FOUNDATION_DESIGN.md`:
1. Dịch vụ AI không được phép đọc/ghi trực tiếp vào CSDL PostgreSQL của Exam Platform.
2. Mọi thao tác có ý định ghi dữ liệu vào CSDL (System of Record - SoR) bắt buộc phải dừng lại ở cổng kiểm duyệt của con người (**Human-in-the-Loop** - `WAITING_FOR_APPROVAL`) để Giảng viên phê duyệt hoặc từ chối.
3. Trình duyệt client không được gọi trực tiếp cross-origin sang cổng backend agent để ngăn ngừa rủi ro CORS, lộ API key và tấn công CSRF.
4. Quá trình phát triển và kiểm thử giao diện frontend không được bị gián đoạn nếu dịch vụ Python Agent chưa khởi động.

## Quyết định

- **Thiết lập Reverse Proxy Route Handler First-Party trong Next.js**:
  - Mọi request từ Web Client gọi tới `/api/examops/[...path]` được xử lý bởi Next.js Route Handler.
  - Proxy tự động tiêm `X-API-Key` bí mật của dịch vụ từ biến môi trường máy chủ (`INTERNAL_EXAMOPS_URL`, `EXAMOPS_API_KEY`), tuyệt đối không để lộ key trên client bundle.
- **Tích hợp Bộ Mô phỏng Dự phòng Chuẩn Xác (High-Fidelity Deterministic Fallback)**:
  - Khi dịch vụ Python FastAPI không khả dụng (ví dụ trong môi trường dev cục bộ độc lập), Proxy Route tự động chuyển sang cơ chế mô phỏng chu trình 6 bước với cùng hợp đồng dữ liệu Pydantic/TypeScript, trả về header `X-ExamOps-Mode: simulated`.
  - Khi dịch vụ FastAPI khởi chạy (mặc định port 8001), hệ thống tự động chuyển 100% lưu lượng sang StateGraph live của LangGraph (`X-ExamOps-Mode: live`).
- **Thực thi Cổng Duyệt Human-in-the-Loop**:
  - Khi tác vụ có cờ `requires_write = true`, StateGraph ngắt tại node số 5 (`Human Review Gate`), phát hành bản đề xuất bất biến `ApprovalProposal` kèm `proposal_hash` và lưu checkpoint bền vững vào SQLite.
  - Giao diện giáo viên hiển thị hộp thoại duyệt bắt buộc với 2 lựa chọn: `approve` (xác nhận ghi dữ liệu) hoặc `reject` (hủy bỏ đề xuất).
  - Endpoint `/api/v1/tasks/{thread_id}/resume` xác thực vai trò Giảng viên/Admin trước khi tiếp tục chu trình hoàn tất.

## Hệ quả và giới hạn

- **Hệ quả tích cực**:
  - Đảm bảo ranh giới kiến trúc sạch và tuân thủ nguyên tắc Zero-Leakage: Trình duyệt không biết URL thật hay API key của Python Agent.
  - Trải nghiệm phát triển (DX) liền mạch: Frontend có thể phát triển và kiểm thử giao diện ngay cả khi chưa khởi động môi trường Python.
  - Bảo vệ toàn vẹn dữ liệu: Không có bất kỳ dữ liệu nào được tự động ghi vào ngân hàng đề thi mà không qua mắt Giảng viên.
- **Giới hạn**:
  - Proxy Next.js là tầng trung gian bổ sung một hop mạng nhỏ (~1-2ms), chấp nhận được đối với luồng AI điều phối không đòi hỏi streaming siêu tốc độ.
  - Trạng thái mô phỏng nội bộ của Proxy lưu trên bộ nhớ RAM (Map); khi chuyển sang môi trường phân tán nhiều node chạy Docker, bắt buộc phải kích hoạt dịch vụ `agentic-system` thật.
