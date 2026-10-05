# 08 — System Architecture Specification (C4 Model)

**Dự án**: Exam Platform  
**Tài liệu**: `docs/03-architecture-api/08-ARCHITECTURE.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. C4 Mức 1: Sơ đồ Ngữ cảnh Hệ thống (System Context Diagram)

Sơ đồ thể hiện vị trí của Exam Platform trong mối tương quan với các Actor người dùng và các hệ thống bên ngoài:

```mermaid
C4Context
    title C4 Level 1: System Context Diagram cho Exam Platform

    Person(admin, "Quản trị viên (Admin)", "Quản lý tài khoản, cấu hình hệ thống và giám sát toàn bộ hoạt động.")
    Person(teacher, "Giảng viên (Teacher)", "Soạn câu hỏi, duyệt đề, tạo ca thi, phân công và giám sát phòng thi.")
    Person(student, "Thí sinh (Student)", "Tham gia phòng thi trực tuyến, làm bài, lưu đáp án và xem kết quả.")

    Enterprise_Boundary(b0, "Hệ sinh thái Exam Platform") {
        System(webClient, "Web Client (Next.js)", "Giao diện người dùng Web SPA/SSR hiện đại, phục vụ tương tác cho cả 3 vai trò.")
        System(coreApi, "Core API (Laravel RESTful Backend)", "Nguồn chân lý duy nhất (Single Source of Truth) thực thi toàn bộ logic nghiệp vụ, bảo mật, chấm điểm và quản trị CSDL.")
        System(examOps, "ExamOps Agent (Python FastAPI)", "Lớp Điều phối Trí tuệ (Intelligent Orchestration Layer), hỗ trợ thiết kế khung đề thi và thẩm định tính sẵn sàng của ca thi.")
        SystemDb(postgres, "PostgreSQL Database", "Lưu trữ dữ liệu quan hệ, bảng JSONB, ràng buộc toàn vẹn và giao dịch ACID.")
        SystemDb(redisStore, "Redis In-Memory Store", "Quản lý Token Blacklist, Rate Limiting, Idempotency Cache và Hàng đợi nền.")
    }

    Rel(admin, webClient, "Truy cập giao diện quản trị qua HTTPS", "Browser")
    Rel(teacher, webClient, "Biên soạn đề và giám sát ca thi qua HTTPS", "Browser")
    Rel(student, webClient, "Vào phòng thi và làm bài qua HTTPS", "Browser")

    Rel(webClient, coreApi, "Giao tiếp RESTful API JSON (/api/v1)", "HTTPS / Bearer Token")
    Rel(teacher, examOps, "Yêu cầu thiết kế blueprint / thẩm định đề qua API", "HTTPS / API Key")
    Rel(examOps, coreApi, "Đọc dữ liệu & Gửi đề xuất ghi (/api/v1)", "RESTful HTTPS / Bearer Token")
    Rel(coreApi, postgres, "Đọc/Ghi dữ liệu quan hệ & JSONB", "PostgreSQL TCP / Port 5432")
    Rel(coreApi, redisStore, "Cache, Throttle, Queue Jobs", "Redis Protocol / Port 6379")
```

---

## 2. C4 Mức 2: Sơ đồ Thùng chứa (Container Diagram)

Sơ đồ mô tả chi tiết các khối dịch vụ phần mềm cấu thành hệ thống và công nghệ tương ứng:

```mermaid
C4Container
    title C4 Level 2: Container Diagram cho Exam Platform

    Person(user, "Người dùng (User)", "Admin, Teacher, hoặc Student")

    Container_Boundary(c1, "Kiến trúc Monorepo Exam Platform") {
        Container(browser, "Web Browser", "Chrome, Edge, Firefox, Safari", "Chạy giao diện Next.js, bắt sự kiện chuột/phím và cảm biến Page Visibility.")

        Container(nextApp, "Frontend Service (web-client)", "Next.js 15+, React 19, TypeScript, Tailwind CSS", "Xử lý Route Groups, SSR/Client Components, TanStack Query, React Hook Form và HTTP-only Cookie Proxy.")

        Container(nginxProxy, "API Reverse Proxy (web)", "Nginx 1.25 Alpine", "Điều phối cổng 8000, xử lý SSL/TLS termination, nén Gzip, phục vụ tĩnh và chuyển tiếp PHP-FPM.")

        Container(laravelApp, "Backend API Service (app)", "Laravel 13, PHP 8.3-FPM", "Điều phối HTTP Request qua Form Requests, Role Middleware, Policies, Actions và API Resources.")

        Container(queueWorker, "Queue Worker Service", "PHP 8.3 CLI (artisan queue:work)", "Tiến trình chạy nền xử lý các tác vụ nặng: Gửi email thông báo ca thi, xuất file Excel kết quả, tổng hợp phổ điểm.")

        Container(examOpsApp, "Agentic AI Service (agentic-system)", "Python 3.11+, FastAPI, LangGraph, Pydantic", "Thực thi chu trình điều phối AI 6 bước, quản lý Checkpoint SQLite, Deterministic Verification và Human-in-the-Loop Gate.")

        ContainerDb(database, "Relational Database (postgres)", "PostgreSQL 16 Alpine", "Lưu trữ 14 bảng quan hệ, Composite Unique Constraints, JSONB options/answers và khóa dòng FOR UPDATE.")

        ContainerDb(redis, "In-Memory Store (redis)", "Redis 7 Alpine", "Bộ nhớ đệm tốc độ cao cho Rate Limiting, Idempotency Lock và hàng đợi Jobs.")
    }

    Rel(user, browser, "Tương tác qua màn hình và bàn phím")
    Rel(browser, nextApp, "Yêu cầu trang và gọi API nội bộ", "HTTP / Port 3000")
    Rel(nextApp, nginxProxy, "Gửi REST request gắn Bearer Token", "HTTP / Port 8000 /api/v1")
    Rel(nginxProxy, laravelApp, "Chuyển tiếp yêu cầu xử lý FastCGI", "FastCGI / Port 9000")
    Rel(examOpsApp, nginxProxy, "Gọi REST API /api/v1 đọc dữ liệu & đề xuất ghi", "HTTP / Port 8000 /api/v1")
    Rel(laravelApp, database, "Thực thi truy vấn SQL & Transaction", "PDO pgsql / Port 5432")
    Rel(laravelApp, redis, "Đọc/Ghi Cache & Đẩy tác vụ vào hàng đợi", "PhpRedis / Port 6379")
    Rel(queueWorker, redis, "Lấy tác vụ từ hàng đợi", "PhpRedis / Port 6379")
    Rel(queueWorker, database, "Ghi nhận kết quả xử lý nền", "PDO pgsql / Port 5432")
```

---

## 3. Sơ đồ Triển khai (Deployment Architecture)

### 3.1. Môi trường Phát triển Địa phương (Local Development)
Tất cả các thành phần được đóng gói trong một file `docker-compose.yml` duy nhất trên máy lập trình viên:
- **`app`**: PHP 8.3-FPM gắn volume `./core-api:/var/www/html`.
- **`web`**: Nginx lắng nghe tại `localhost:8000`.
- **`postgres`**: PostgreSQL 16 lắng nghe tại `localhost:5432`, volume `postgres_data`.
- **`redis`**: Redis 7 lắng nghe tại `localhost:6379`.
- **`client`**: Node 20 Next.js lắng nghe tại `localhost:3000`, volume `./web-client:/app`.

### 3.2. Môi trường Production (Sản xuất)

```mermaid
graph TD
    Internet((Người dùng Internet)) --> Cloudflare["Cloudflare Edge (WAF, DDoS Protection, SSL)"]

    subgraph VPC["Mạng Riêng Ảo (Virtual Private Cloud - VPC)"]
        subgraph PublicSubnet["Public Subnet"]
            ALB["Application Load Balancer (ALB / Nginx Ingress)"]
        end

        subgraph PrivateSubnetApp["Private App Subnet"]
            NextCluster["Next.js Node.js Standalone Cluster (Port 3000)"]
            LaravelCluster["Laravel PHP-FPM Cluster (Port 9000)"]
            WorkerCluster["Supervisor Queue Workers Cluster"]
        end

        subgraph PrivateSubnetData["Private Database Subnet"]
            PGPrimary[("PostgreSQL Primary (Read/Write)")]
            PGReplica[("PostgreSQL Replica (Read-Only)")]
            RedisCluster[("Redis Cluster / AWS ElastiCache")]
        end
    end

    Cloudflare --> ALB
    ALB -->|Frontend Routes /| NextCluster
    ALB -->|API Routes /api/v1| LaravelCluster
    NextCluster -->|Server-to-Server API Calls| ALB
    LaravelCluster --> PGPrimary
    LaravelCluster --> PGReplica
    LaravelCluster --> RedisCluster
    WorkerCluster --> RedisCluster
    WorkerCluster --> PGPrimary
```

---

## 4. Ranh giới Bảo mật & Phân vùng Mạng (Security Boundaries)

1. **Ranh giới Trình duyệt $\leftrightarrow$ Web Client**:
   - Trình duyệt chỉ giao tiếp với Next.js qua giao thức HTTPS có gắn HTTP-Only Cookie. Không bao giờ lộ Bearer Token ra môi trường JavaScript máy khách.
2. **Ranh giới Web Client $\leftrightarrow$ Core API**:
   - Giao tiếp qua mạng nội bộ hoặc HTTPS có xác thực Bearer Token.
   - Core API là người gác cổng (Gatekeeper) thực thi kiểm tra phân quyền RBAC/PBAC.
3. **Ranh giới Core API $\leftrightarrow$ Cơ sở dữ liệu**:
   - PostgreSQL và Redis nằm trong Private Subnet, không mở cổng công khai ra Internet.
   - Chỉ có các container trong mạng nội bộ VPC mới có quyền kết nối thông qua tài khoản có mật khẩu mạnh.
4. **Ranh giới ExamOps Agent $\leftrightarrow$ Core API**:
   - ExamOps Agent hoạt động như một REST Client độc lập, giao tiếp với Core API thông qua RESTful API `/api/v1` có xác thực Bearer Token.
   - Tuyệt đối không kết nối trực tiếp đến PostgreSQL của Core API. Checkpoint SQLite được lưu trữ tách biệt hoàn toàn.
   - Mọi hành vi sửa đổi dữ liệu (tạo đề, công bố ca thi...) bắt buộc phải dừng tại cổng Human-in-the-Loop (`WAITING_FOR_APPROVAL`) và tuân thủ các quy tắc Laravel Policy.
