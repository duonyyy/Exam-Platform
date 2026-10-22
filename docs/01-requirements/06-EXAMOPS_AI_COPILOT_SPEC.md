# 06 — Đặc Tả Tính Năng: Trợ Lý Soạn Đề & Thẩm Định AI (ExamOps Copilot)

**Dự án**: Exam Platform  
**Tài liệu**: `docs/01-requirements/06-EXAMOPS_AI_COPILOT_SPEC.md`  
**Áp dụng Skill**: `spec-driven-development`  
**Module ID**: `examops-copilot`  
**Trạng thái**: SPEC APPROVED & IMPLEMENTED  

---

## 1. Mục Tiêu (Objective)

Cung cấp cho Giảng viên giao diện trực quan hỗ trợ bởi AI Agent (**ExamOps Copilot**) để:
1. Nhập các ràng buộc sư phạm (tổng số câu hỏi, thời lượng, tỷ lệ độ khó Dễ/Vừa/Khó, phân bổ chủ đề kiến thức).
2. Tự động sinh bản thiết kế ma trận đề thi (**Exam Blueprint**) và thẩm định độ sẵn sàng (**Readiness Review**) qua chu trình LangGraph 6 bước.
3. Thực thi nghiêm ngặt Cổng Duyệt **Human-in-the-Loop** (`WAITING_FOR_APPROVAL`) trước khi ghi bất kỳ dữ liệu nào vào CSDL Exam Platform.

---

## 2. Các Lệnh Vận Hành & Kiểm Định (Executable Commands)

```bash
# Kiểm tra kiểu dữ liệu tĩnh Frontend:
pnpm --prefix web-client typecheck

# Kiểm tra quy chuẩn linter:
pnpm --prefix web-client lint

# Build kiểm tra gói sản xuất:
pnpm --prefix web-client build

# Khởi chạy máy chủ ExamOps Agent (Python 3.12):
cd agentic-system && uv run uvicorn examops.main:app --port 8001

# Chạy toàn bộ Test & Eval suite của Agent:
cd agentic-system && uv run pytest -v
```

---

## 3. Bản Đồ Năng Lực (Capability Map)

| Module ID | Trách nhiệm cốt lõi | Phụ thuộc |
| :--- | :--- | :--- |
| `intake-config` | Thu thập form ràng buộc môn học, validate tổng độ khó = 100%, số câu từng chủ đề | Core API (Subjects/Topics) |
| `agent-loop-stepper` | Trực quan hóa tiến trình 6 bước (Intake $\rightarrow$ Plan $\rightarrow$ Execute $\rightarrow$ Verify $\rightarrow$ Human Review $\rightarrow$ Finalize) | FastAPI Agent hoặc Simulator |
| `blueprint-viewer` | Trực quan hóa ma trận đề thi, phổ điểm, phân bổ chủ đề và xuất file JSON | `intake-config` |
| `readiness-audit` | Hiển thị kết quả kiểm định số học, cảnh báo và khuyến nghị chất lượng đề thi | `blueprint-viewer` |
| `human-in-the-loop-gate` | Hiển thị đề xuất bất biến `ApprovalProposal`, tiếp nhận quyết định Approve/Reject | `agentic-system` State Checkpoint |

---

## 4. Hợp Đồng Dữ Liệu (Data Contracts)

- **Input Payload (`TaskCreateRequest`)**:
  - `goal`: Chuỗi mục tiêu tự nhiên từ giáo viên.
  - `actor`: `{ actor_id: string, actor_role: "teacher" | "admin" }`.
  - `subject`: Mã môn học (ví dụ: `IT4409`).
  - `constraints`:
    - `total_questions`: Số nguyên dương ($5 \le N \le 120$).
    - `duration_minutes`: Số nguyên dương ($10 \le T \le 240$).
    - `total_points`: Điểm tổng đề ($> 0$, mặc định 10.0).
    - `pass_score`: Điểm sàn ($0 \le P \le total\_points$).
    - `difficulty_distribution`: `{ easy: float, medium: float, hard: float }` với $\sum = 100.0\%$.
    - `topics`: Mảng `{ topic_id: string, topic_name: string, question_count: int }` với $\sum question\_count = total\_questions$.
    - `requires_write`: Boolean (Bật = kích hoạt cổng duyệt Human-in-the-Loop).

- **Output State (`TaskResponse`)**:
  - `status`: `"COMPLETED"` | `"WAITING_FOR_APPROVAL"` | `"REJECTED"` | `"FAILED"`.
  - `summary`: Tóm tắt kết luận từ Agent.
  - `result`: Chứa `blueprint` và `readiness_review`.
  - `proposal`: Chứa chi tiết đề xuất ghi CSDL (`action`, `arguments`, `proposal_hash`, `reason`).

---

## 5. Tiêu Chí Nghiệm Thu (Acceptance Criteria - Gherkin)

### Kịch bản 1: Validate tổng độ khó bắt buộc 100%
```gherkin
Given Giảng viên đang ở trang Trợ lý Soạn Đề AI (/teacher/ai-assistant)
When Giảng viên nhập tỷ lệ Dễ: 40%, Vừa: 40%, Khó: 15% (Tổng = 95%)
Then Nút "Khởi Chạy Chu Trình Agent 6 Bước" bị vô hiệu hóa
And Hệ thống hiển thị cảnh báo đỏ "Tổng tỷ lệ độ khó phải bằng chính xác 100%"
```

### Kịch bản 2: Kích hoạt Cổng Duyệt Human-in-the-Loop khi có ý định ghi dữ liệu
```gherkin
Given Giảng viên nhập đầy đủ thông số hợp lệ và bật tùy chọn "Kích hoạt Cổng Duyệt Human-in-the-Loop"
When Giảng viên nhấn nút "Khởi Chạy Chu Trình Agent 6 Bước"
Then Agent thực thi tuần tự từ Bước 1 đến Bước 4
And Tạm dừng ở Bước 5 với trạng thái "WAITING_FOR_APPROVAL"
And Giao diện hiển thị hộp thoại duyệt màu hổ phách với chi tiết Proposal và mã Hash bảo mật
And Không có dữ liệu nào tự ý ghi vào CSDL Exam Platform trước khi Giảng viên bấm nút
```

### Kịch bản 3: Giảng viên Phê duyệt đề xuất
```gherkin
Given Tác vụ đang dừng ở trạng thái "WAITING_FOR_APPROVAL"
When Giảng viên bấm nút "Phê Duyệt & Xuất Bản (Approve)"
Then Hệ thống gửi request resume với decision="approve"
And Tác vụ chuyển sang Bước 6 với trạng thái "COMPLETED"
And Hiển thị thông báo thành công rực rỡ và mã đề thi tương ứng
```

---

## 6. Định Nghĩa Hoàn Thành (Definition of Done - DoD)

- [x] Giao diện hoàn thiện đúng thẩm mỹ cao cấp, responsive trên mobile/tablet/desktop.
- [x] Data contract đồng bộ 100% giữa TypeScript (`web-client`) và Pydantic (`agentic-system`).
- [x] Cơ chế dự phòng (Deterministic Simulator) đảm bảo frontend không bị vỡ khi dịch vụ Python chưa bật.
- [x] Lệnh `pnpm typecheck` đạt 0 lỗi.
- [x] Lệnh `pnpm lint` đạt 0 cảnh báo.
- [x] Lệnh `pnpm build` sinh mã tĩnh thành công 26/26 routes.
- [x] Tuân thủ 100% nguyên tắc ranh giới an toàn của Hiến pháp `AGENTS.md`.
