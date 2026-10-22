# Sơ đồ Chu trình ExamOps Agent & Cổng Duyệt Human-in-the-Loop

Tài liệu này đặc tả quy trình tương tác giữa **Giảng viên**, **Next.js Web Client**, **FastAPI ExamOps Agent (LangGraph)** và **Core API**, tuân thủ Hiến pháp Kỹ thuật `AGENTS.md` và `ADR-009`.

---

## 1. Sơ Đồ Tuần Tự (Sequence Diagram) — 6-Step Agent Loop

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Giảng viên (Teacher)
    participant Client as Next.js Web Client (/teacher/ai-assistant)
    participant Proxy as Next.js API Route (/api/examops/...)
    participant Agent as ExamOps FastAPI Service (LangGraph)
    participant Checkpoint as SQLite Checkpointer (checkpoints.db)
    participant CoreAPI as Laravel Core API (/api/v1)

    %% Step 1: Intake & Task Submission
    Note over Teacher, Agent: BƯỚC 1: INTAKE & TASK SUBMISSION
    Teacher->>Client: Nhập yêu cầu phân bổ môn học & bật "Requires Write Intent"
    Teacher->>Client: Bấm "Khởi Chạy Chu Trình Agent 6 Bước"
    Client->>Proxy: POST /api/examops/api/v1/tasks (Payload + Actor)
    Proxy->>Agent: POST /api/v1/tasks (Tiêm X-API-Key bí mật)
    
    %% Step 2, 3, 4: Internal Graph Execution
    Note over Agent, Checkpoint: BƯỚC 2 -> 4: PLAN, EXECUTE & VERIFY
    activate Agent
    Agent->>Agent: 1. Intake: Validate Goal, Schema & Teacher Role
    Agent->>Agent: 2. Plan: Chọn kỹ năng "exam-blueprint"
    Agent->>Agent: 3. Execute: Lắp ráp ma trận đề thi từ yêu cầu
    Agent->>Agent: 4. Verify: Thẩm định toán học (Tổng % = 100, số câu dương)
    
    %% Step 5: Human Review Gate (Interrupt)
    Note over Agent, Client: BƯỚC 5: HUMAN-IN-THE-LOOP INTERRUPTION
    Agent->>Agent: Phát hiện "requires_write = True" -> Kích hoạt Cổng Ngắt
    Agent->>Checkpoint: Lưu Snapshot State (status="WAITING_FOR_APPROVAL", proposal_hash)
    Agent-->>Proxy: 201 Created (status="WAITING_FOR_APPROVAL", proposal={...})
    deactivate Agent
    Proxy-->>Client: 201 Created (proposal)
    Client-->>Teacher: Hiển thị Ma trận Đề thi & Hộp thoại Cổng Duyệt Phê duyệt

    %% Teacher Decision
    alt Giảng viên Phê duyệt (Approve)
        Teacher->>Client: Bấm "Phê Duyệt & Xuất Bản (Approve)"
        Client->>Proxy: POST /api/examops/api/v1/tasks/{thread_id}/resume (decision="approve")
        Proxy->>Agent: POST /api/v1/tasks/{thread_id}/resume
        activate Agent
        Agent->>Checkpoint: Tải State từ checkpoint cũ (thread_id)
        Agent->>CoreAPI: Gọi RESTful ghi đề thi (POST /api/v1/exams)
        CoreAPI-->>Agent: 201 Created (Exam Record)
        Agent->>Checkpoint: Cập nhật State (status="COMPLETED")
        Agent-->>Proxy: 200 OK (status="COMPLETED", summary="Đã ghi SoR thành công")
        deactivate Agent
        Proxy-->>Client: 200 OK
        Client-->>Teacher: Thông báo thành công rực rỡ & nút xem Đề thi
    else Giảng viên Từ chối (Reject)
        Teacher->>Client: Bấm "Từ Chối (Reject)"
        Client->>Proxy: POST /api/examops/api/v1/tasks/{thread_id}/resume (decision="reject")
        Proxy->>Agent: POST /api/v1/tasks/{thread_id}/resume
        activate Agent
        Agent->>Checkpoint: Cập nhật State (status="REJECTED")
        Agent-->>Proxy: 200 OK (status="REJECTED", summary="Đề xuất đã bị từ chối")
        deactivate Agent
        Proxy-->>Client: 200 OK
        Client-->>Teacher: Thông báo đã hủy bỏ đề xuất an toàn
    end
```

---

## 2. Sơ Đồ Máy Trạng Thái Tác Vụ (State Machine - FSM)

```mermaid
stateDiagram-v2
    [*] --> Intake : Khởi tạo tác vụ (POST /tasks)
    
    state "1. Intake Validation" as Intake
    state "2. Skill & Tools Planning" as Plan
    state "3. Execution (Blueprint Assembly)" as Execute
    state "4. Deterministic Verification" as Verify
    state "5. Human Review Gate" as Gate
    state "6. Finalized: Completed" as Completed
    state "6. Finalized: Rejected" as Rejected
    state "Failed: Validation/Terminal" as Failed

    Intake --> Plan : Hợp lệ cú pháp & quyền Teacher
    Intake --> Failed : Vi phạm quyền / schema sai

    Plan --> Execute : Chọn "exam-blueprint"
    
    Execute --> Verify : Ma trận sinh hoàn tất
    
    Verify --> Gate : Toán học đạt & Cần ghi CSDL (requires_write)
    Verify --> Completed : Toán học đạt & Chỉ đọc (read-only)
    Verify --> Plan : Lỗi số học (retry < MAX_RETRIES)
    Verify --> Failed : Quá số lần retry tối đa

    Gate --> Completed : Giảng viên gửi decision = 'approve'
    Gate --> Rejected : Giảng viên gửi decision = 'reject'

    Completed --> [*]
    Rejected --> [*]
    Failed --> [*]
```

---

## 3. Kiến Trúc Phân Vùng Mạng (Network Boundaries & Zero-Leakage)

```mermaid
flowchart LR
    subgraph Browser["Trình Duyệt Khách (Browser)"]
        UI["React 19 / Next.js Client<br/>(/teacher/ai-assistant)"]
    end

    subgraph NextServer["Next.js Server (Bảo Mật Tầng 1)"]
        ProxyRoute["Route Handler<br/>/api/examops/[...path]"]
        KeyStore["Env: EXAMOPS_API_KEY<br/>(Giữ kín trên Server)"]
        Simulator["Fallback Simulator<br/>(Mô phỏng khi dev offline)"]
    end

    subgraph AgentService["ExamOps Service (Bảo Mật Tầng 2)"]
        FastAPI["FastAPI App (port 8001)"]
        Graph["LangGraph StateGraph"]
        Checkpointer[("SQLite Checkpoints<br/>(checkpoints.db)")]
    end

    subgraph CoreBackend["Hạ Tầng Dữ Liệu Chân Lý (SoR)"]
        Laravel["Laravel 13 Core API"]
        Postgres[("PostgreSQL 16")]
    end

    UI -->|1. First-Party Request| ProxyRoute
    KeyStore -.-> ProxyRoute
    ProxyRoute -->|2. Tiêm X-API-Key| FastAPI
    ProxyRoute -.->|Offline Fallback| Simulator
    FastAPI --> Graph
    Graph <--> Checkpointer
    Graph -->|3. RESTful API khi được Approve| Laravel
    Laravel <--> Postgres
```
