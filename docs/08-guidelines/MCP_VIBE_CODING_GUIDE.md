# ⚡ Cẩm Nang Thiết Lập & Khai Thác MCP Cho Vibe Coding Đỉnh Cao

**Dự án**: Exam Platform Monorepo  
**Tài liệu**: `docs/08-guidelines/MCP_VIBE_CODING_GUIDE.md`  
**Cấu hình hệ thống**: `C:\Users\Admin\.gemini\config\mcp_config.json`  
**Phương pháp**: **Vibe Coding** kết hợp **Model Context Protocol (MCP)**

---

## 🎯 1. Vibe Coding Là Gì & Tại Sao Cần MCP?

**Vibe Coding** (thuật ngữ do Andrej Karpathy khởi xướng) là phương pháp lập trình thế hệ mới, nơi kỹ sư đóng vai trò **Kiến trúc sư trưởng & Đạo diễn (Architect & Director)**, còn AI đóng vai trò **Cặp lập trình viên siêu tốc độ (Elite Pair Programmer)**.

Trong quy trình Vibe Coding truyền thống, AI thường bị giới hạn bởi:
- Không thấy được trạng thái CSDL thực tế.
- Bị ảo giác (hallucination) với các phiên bản thư viện mới nhất (Next.js 15, Laravel 13).
- Quên ngữ cảnh và các quyết định kiến trúc giữa các phiên làm việc.
- Dễ sinh code vội vã mà thiếu suy luận đa tầng về Race Conditions hay Deadlocks.

👉 **Model Context Protocol (MCP)** phá vỡ hoàn toàn các giới hạn này bằng cách kết nối AI trực tiếp với các dịch vụ bên ngoài (Database, Git, Web Docs, Memory Graph, Deep Thinking Engine).

---

## 🚀 2. Danh Mục 6 MCP Servers Đã Được Tích Hợp Sẵn Sàng

Tệp cấu hình tại `C:\Users\Admin\.gemini\config\mcp_config.json` đã được kích hoạt bộ công cụ:

| Tên MCP Server | Cơ Chế Thực Thi | Siêu Năng Lực Cho Vibe Coding |
| :--- | :--- | :--- |
| 🧠 **`sequential-thinking`** | `npx -y @modelcontextprotocol/server-sequential-thinking` | **Tư duy phản biện đa tầng**: AI tự động chia nhỏ bài toán, kiểm tra giả định, phân tích race conditions (double submit, lock ordering) trước khi gõ code. |
| 🌐 **`fetch`** | `uvx mcp-server-fetch` | **Tra cứu tài liệu trực tuyến**: AI tự kéo nội dung từ các trang tài liệu Next.js 15, Laravel 13, RFC 9110, hoặc GitHub release notes mà không cần rời IDE. |
| 🗄️ **`postgres`** | `npx -y @modelcontextprotocol/server-postgres` | **Kết nối trực tiếp CSDL PostgreSQL**: AI có thể tự inspect schema 13 bảng của Exam Platform, kiểm tra khóa ngoại, chạy `EXPLAIN ANALYZE` và debug truy vấn. |
| 🌿 **`git`** | `uvx mcp-server-git` | **Thao tác Git nguyên bản**: AI kiểm tra `git diff`, xem log, commit chuẩn Conventional Commits mà không làm xáo trộn working tree. |
| 💾 **`memory`** | `npx -y @modelcontextprotocol/server-memory` | **Đồ thị tri thức (Knowledge Graph)**: Ghi nhớ các quyết định kiến trúc, quy tắc miền nghiệp vụ, và phong cách code ưa thích của bạn qua nhiều phiên chat. |
| 📊 **`excel-reader`** | `uvx excel-vision-mcp` | **Trích xuất ngân hàng câu hỏi**: Đọc trực tiếp các tệp đề thi Excel, trích xuất bảng biểu và ảnh để nạp vào ngân hàng câu hỏi tự động. |

---

## 🛠️ 3. Chi Tiết Cấu Hình Trong `mcp_config.json`

```json
{
  "mcpServers": {
    "excel-reader": {
      "command": "uvx",
      "args": ["excel-vision-mcp"],
      "env": {
        "EXCEL_VISION_MCP_ALLOWED_DIRS": "C:\\Users\\Admin\\Desktop\\ExcelMCP"
      }
    },
    "sequential-thinking": {
      "command": "cmd.exe",
      "args": [
        "/c",
        "npx",
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ]
    },
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"]
    },
    "git": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository",
        "c:\\Users\\Admin\\Desktop\\PHP"
      ]
    },
    "memory": {
      "command": "cmd.exe",
      "args": [
        "/c",
        "npx",
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    },
    "postgres": {
      "command": "cmd.exe",
      "args": [
        "/c",
        "npx",
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:secret@localhost:5432/exam_platform"
      ]
    }
  }
}
```

---

## 💡 4. Cách Vibe Coding Thực Chiến Với Từng MCP

### 4.1. Khi Xây Dựng Thuật Toán Tính Điểm & Xử Lý Tranh Chấp (Pessimistic Lock)
- **Lời nhắc Vibe Coding**:
  > *"Hãy dùng sequential-thinking để phân tích mọi kịch bản tranh chấp khi 2 thí sinh cùng nộp bài ở giây cuối cùng, sau đó viết Action `SubmitExamAttemptAction`."*
- **Tác dụng**: AI sẽ kích hoạt công cụ tư duy đa bước, mô phỏng các nhánh rẽ của deadlock, trước khi sinh mã `lockForUpdate()` chuẩn xác 100%.

### 4.2. Khi Kiểm Tra CSDL Thực Tế Sau Khi Chạy Migration
- **Lời nhắc Vibe Coding**:
  > *"Hãy kết nối vào PostgreSQL kiểm tra xem bảng `exam_questions` đã có composite unique constraint `(exam_id, question_id)` chưa và đo latency của query."*
- **Tác dụng**: AI gọi MCP `postgres` để query trực tiếp catalog của PostgreSQL 16 mà không cần bạn phải mở pgAdmin hay DBeaver.

### 4.3. Khi Cần Cập Nhật Công Nghệ Mới Nhất
- **Lời nhắc Vibe Coding**:
  > *"Dùng fetch đọc tài liệu Next.js 15 Server Actions mới nhất về xử lý cookie proxy để viết hook `useExamAuth`."*
- **Tác dụng**: AI không bị phụ thuộc vào kiến thức cũ, mà kéo đúng cú pháp chính xác của Next.js 15 App Router.

---

## 🌟 5. Các MCP Tùy Chọn Mở Rộng Thêm (Optional Add-ons)

Nếu bạn muốn nâng cấp quy trình tự động hóa hơn nữa:

1. **GitHub MCP (`@modelcontextprotocol/server-github`)**:
   - Tự động tạo Issue, mở Pull Request, check CI status và review code.
   - Yêu cầu: Thêm biến môi trường `"GITHUB_PERSONAL_ACCESS_TOKEN"`.
2. **Puppeteer MCP (`@modelcontextprotocol/server-puppeteer`)**:
   - Tự động mở trình duyệt headless, click kiểm thử giao diện Focus Exam Room và chụp ảnh màn hình đối chiếu thiết kế (UI Snapshot testing).

---

> **Tóm lại**: Với bộ 6 MCP này, bạn chỉ cần ra đề bài kiến trúc ở mức cao ("vibe"), AI sẽ tự động tư duy sâu, tra cứu tài liệu mới, kiểm tra CSDL thật và tạo commit hoàn hảo!
