# 📐 Quy Chuẩn & Hướng Dẫn Vận Hành Official Draw.io MCP

**Dự án**: Exam Platform Monorepo + ExamOps Agentic AI  
**Tài liệu**: `docs/agents/DRAWIO_MCP_SETUP.md`  
**Gói MCP chính thức**: `@drawio/mcp` (jgraph/drawio-mcp)  
**Phạm vi**: Workspace Scope (`.agents/mcp_config.json`)

---

## 🎯 1. Mục Đích & Phạm Vi Hỗ Trợ Sơ Đồ

Hệ thống cung cấp khả năng tự động sinh, cập nhật và mở các sơ đồ kỹ thuật chuyên nghiệp phục vụ cho **báo cáo kỹ thuật, đồ án tốt nghiệp, thuyết trình kiến trúc, và hồ sơ an ninh**:

- 🏛️ **Kiến trúc hệ thống**: System Context Diagram (C4 Level 1), Container Diagram (C4 Level 2), Component Diagram (C4 Level 3).
- 🗄️ **Cơ sở dữ liệu**: Sơ đồ thực thể quan hệ ERD (13 bảng, PK, FK, Cardinality 1:N / N:N, Ràng buộc).
- 🔄 **Quy trình & Nghiệp vụ**: Use Case Diagram, Sequence Diagram (Luồng sinh tử nộp bài), State Machine (FSM câu hỏi, ca thi, attempt).
- 🤖 **Agentic AI & ExamOps**: Đồ thị luồng Agent Workflow (LangGraph), Tool / Skill Architecture, Vòng lặp phản biện.
- 🚀 **Hạ tầng & Vận hành**: Deployment Diagram (Docker / Production ALB), CI/CD Pipeline Flow, Security / Trust Boundary Diagram, Threat Model.

---

## ⚙️ 2. Cấu Hình MCP Server Trong Workspace (`.agents/mcp_config.json`)

Do môi trường IDE hiện tại sử dụng giao thức chuẩn MCP stdio (không chạy extension MCP Apps dạng webview nhúng của Claude.ai), hệ thống tích hợp gói công cụ chính thức **`@drawio/mcp`**:

```json
{
  "mcpServers": {
    "drawio": {
      "command": "npx",
      "args": ["-y", "@drawio/mcp"]
    }
  }
}
```

### Bộ Tools Được Expose Từ `@drawio/mcp`:
1. `open_drawio_xml`: Mở trực tiếp sơ đồ định dạng XML trong trình soạn thảo draw.io.
2. `open_drawio_mermaid`: Chuyển đổi mã Mermaid sang sơ đồ draw.io nguyên bản để chỉnh sửa trực quan.
3. `open_drawio_csv`: Sinh bảng dữ liệu quan hệ sang sơ đồ tự động.
4. `search_shapes`: Tra cứu thư viện hình khối và icon chuẩn (AWS, Azure, GCP, K8s, UML, Database, Security).
5. `list_pages`, `get_page`, `set_page`: Quản lý sơ đồ đa trang (Multi-page diagrams).

---

## 🎨 3. Quy Chuẩn Thẩm Mỹ & Phong Cách Trực Quan (Visual Style Guidelines)

Mọi sơ đồ kỹ thuật trong dự án phải tuân thủ triết lý: **Professional — Minimal — Modern — Technical**:

### 3.1. Các Nguyên Tắc Cấm Kỵ (What NOT To Do)
- ❌ **Không dùng quá nhiều màu sặc sỡ**: Mỗi sơ đồ chỉ dùng tối đa 3-4 gam màu pastel nhẹ có chủ đích.
- ❌ **Không dùng Emoji trong sơ đồ chính thức**: Dùng text chuẩn hoặc icon vector kỹ thuật.
- ❌ **Không để đường nối (edges) đè chéo hỗn loạn**: Ưu tiên đường vuông góc (`orthogonalEdgeStyle`) có bo góc nhẹ (`rounded=1`).
- ❌ **Không dùng font chữ quá nhỏ**: Cỡ chữ tối thiểu từ 11px - 14px để đảm bảo đọc rõ khi đưa vào báo cáo in hoặc slide.

### 3.2. Bảng Màu & Style Chuẩn Theo Từng Loại Thành Phần

| Loại Thực Thể | Hình Khối & Đường Nét | Mã Màu Nền (Fill) | Màu Viền (Stroke) | Màu Chữ (Font) |
| :--- | :--- | :--- | :--- | :--- |
| **Actor (Người dùng)** | Hình chữ nhật bo tròn dạng Pill (`arcSize=50`) | `#ffffff` | `#64748b` (Slate) | `#0f172a` (Bold 13px) |
| **Frontend (Next.js)** | Hộp bo góc (`arcSize=14`, shadow nhẹ) | `#eff6ff` (Light Blue) | `#3b82f6` (Blue) | `#1e3a8a` |
| **Backend API (Laravel)**| Hộp bo góc (`arcSize=14`, shadow nhẹ) | `#fef2f2` (Light Red) | `#ef4444` (Red) | `#991b1b` |
| **Database (PostgreSQL)**| Khối trụ CSDL (`shape=cylinder3`) | `#f0fdf4` (Light Green) | `#16a34a` (Green) | `#14532d` |
| **Agent / AI System** | Hộp công nghệ có viền kép hoặc phát sáng | `#f5f3ff` (Light Violet) | `#8b5cf6` (Purple) | `#581c87` |
| **Boundary / Vùng bao** | Khung nét đứt (`dashed=1`), tiêu đề góc trên | `#f8fafc` | `#cbd5e1` (Light Slate) | `#64748b` (Italic 12px) |

---

## 📐 4. Quy Chuẩn Thiết Kế Cho Từng Loại Sơ Đồ

### 4.1. Sơ đồ Kiến trúc (Architecture Diagrams)
- Định hướng luồng: Ưu tiên **Top-to-Bottom (Từ trên xuống dưới)** cho luồng Request người dùng, hoặc **Left-to-Right (Từ trái sang phải)** cho luồng xử lý dữ liệu.
- Phân định ranh giới (Grouped Boundaries): Gom các dịch vụ vào vùng bao rõ ràng (`Vercel Edge`, `Docker Host Container`, `AWS VPC`).
- Khoảng cách nhất quán: Khoảng cách giữa các tầng tối thiểu 40px - 60px.

### 4.2. Sơ đồ Cơ sở Dữ liệu (Database ERD)
- Bắt buộc thể hiện rõ:
  - Tên bảng (Table name).
  - Khóa chính (**PK**) và Khóa ngoại (**FK**).
  - Bản số quan hệ (Cardinality): `1 - 1`, `1 - N`, `N - N`.
  - Các ràng buộc then chốt: `UNIQUE`, `NOT NULL`, `CHECK (points > 0)`.

### 4.3. Sơ đồ Tuần Tự (Sequence Diagrams)
- Định danh rõ các đường sinh mệnh (Lifelines): `Actor (Thí sinh)` $\rightarrow$ `Frontend (Next.js Focus Room)` $\rightarrow$ `Backend Controller/Action` $\rightarrow$ `PostgreSQL (lockForUpdate)` $\rightarrow$ `Queue Worker`.
- Thể hiện rõ mũi tên đồng bộ (Synchronous, nét liền) và bất đồng bộ (Asynchronous, nét đứt).

### 4.4. Sơ đồ Hệ thống Agentic AI (ExamOps Agent)
Luôn áp dụng cấu trúc phân tầng chuẩn:
```text
User / Developer
       ↓
ExamOps Supervisor Agent (FastAPI)
       ↓
LangGraph StateGraph Workflow
 ├── Specialized Tools (REST Client, Schema Inspector)
 ├── Domain Skills (Prompt Templates, Few-shots)
 ├── State Memory (Thread ID, Checkpointer)
 ├── Verification Gate (Output Guardrails, JSON Schema)
 ├── Permission / RBAC Boundary
 └── Observability & Structured Tracing
       ↓
Exam Platform Core API (/api/v1)
```

---

## 🔍 5. Tận Dụng Tính Năng `search_shapes` Của MCP

Trước khi vẽ các khối hộp vuông thô sơ, AI Agent sẽ sử dụng tool `search_shapes` để tra cứu các icon thư viện chuyên nghiệp:
- `Database`: PostgreSQL, Redis, Storage buckets.
- `Cloud & Container`: Docker, Kubernetes, Nginx, Linux.
- `Security`: Lock, Shield, Vault, Firewall, SSL Certificate.
- `UML / Network`: Actor, Cloud, Message Queue.

> **Lưu ý**: Chỉ dùng icon khi thực sự làm tăng tính trực quan; không lạm dụng icon gây rối mắt.

---

## 📁 6. Cấu Trúc Thư Mục Lưu Trữ Sơ Đồ Dự Án

Toàn bộ sơ đồ được quản lý tập trung tại `docs/diagrams/`:

```text
docs/diagrams/
├── architecture/         # Sơ đồ C4, Container, Luồng phân tầng
│   └── test_pipeline.drawio   # Sơ đồ mẫu kiểm chứng MCP
├── database/             # Sơ đồ ERD 13 bảng CSDL, quan hệ khóa ngoại
├── workflows/            # Sơ đồ tuần tự nộp bài, FSM ca thi, attempt
├── security/             # Mô hình STRIDE, ranh giới an ninh, chống IDOR
├── deployment/           # Mô hình Docker Compose, hạ tầng production
└── agentic-ai/           # Sơ đồ LangGraph, công cụ Agent, vòng lặp AI
```

### Định Dạng Lưu Trữ Ưu Tiên:
- **Tệp nguồn chính**: Luôn lưu tệp `*.drawio` (XML) để có thể chỉnh sửa lại bất cứ lúc nào trên draw.io.
- **Tệp xuất bản (Export)**: Xuất ra định dạng `.svg` (vector sắc nét cho tài liệu markdown) hoặc `.png` (cho slide).

---

## 🔒 7. Nguyên Tắc An Ninh & Bảo Mật

- **Không đưa thông tin nhạy cảm vào sơ đồ**: Cấm tuyệt đối ghi mật khẩu database, production IP thật, API keys, token trong nhãn sơ đồ.
- **Lợi ích bảo mật của Stdio MCP**: Khi chạy qua local stdio server `@drawio/mcp`, toàn bộ nội dung sơ đồ được xử lý cục bộ trên máy trạm của bạn, không bị truyền ra ngoài Internet, đảm bảo tính bảo mật 100% cho kiến trúc dự án.
