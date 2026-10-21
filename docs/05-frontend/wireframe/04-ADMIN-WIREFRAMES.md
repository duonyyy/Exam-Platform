# 🛡️ Phân Hệ Quản Trị Viên: Hồ Sơ Wireframe (04-ADMIN-WIREFRAMES)

**Dự án**: ThiSmart (Exam Platform)  
**Đường dẫn**: `docs/05-frontend/wireframe/04-ADMIN-WIREFRAMES.md`  
**Thương hiệu & Bản sắc**: **ThiSmart Concept 03 — Minimal Tech / Modern EdTech** (Chi tiết: [`THISMART_BRAND_GUIDELINES.md`](../THISMART_BRAND_GUIDELINES.md))  
**Slogan**: *Thi thông minh. Đánh giá chính xác.*  
**Nhóm màn hình**: Quản trị Vận hành Hệ thống & An ninh Kiểm toán (Admin Workspace)  
**Tài liệu liên quan**:
- Backend API: [`/api/v1/users`](../../03-architecture-api/12-API_DESIGN.md), [`/api/v1/admin/audit-logs`](../../03-architecture-api/12-API_DESIGN.md)
- Cơ sở dữ liệu: [`users`](../../02-domain-database/09-DATABASE_DESIGN.md), [`proctoring_events`](../../02-domain-database/09-DATABASE_DESIGN.md), [`exam_sessions`](../../02-domain-database/09-DATABASE_DESIGN.md)

---

## 1. `SCR-ADM-01`: Bảng Điều Khiển Quản Trị Toàn Trường (Admin Overview)

### 1.1. Thông Tin Chung
- **Đường dẫn URL**: `/admin` (Tệp: `app/(workspace)/admin/page.tsx`)
- **Actor sử dụng**: `admin`
- **Use Case**: `UC-ADMIN-02` (Giám sát toàn bộ kỳ thi & Audit log).
- **Mục tiêu**: Theo dõi tình trạng vận hành của toàn trường, số lượng ca thi mở đồng thời, tải máy chủ và cảnh báo bảo mật.

### 1.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo Mark] ThiSmart | Quản trị Toàn trường        [🔍 Tìm hệ thống...]  [🔔] Quản trị Cấp cao│
├─────────────┬───────────────────────────────────────────────────────────────────────────────┤
│ ❖ Tổng quan │ Workspace / Bảng điều khiển Quản trị Toàn diện                                │
│ 👥 Người dùng│                                                                               │
│ 📚 Môn & Đề │ ┌─ THỐNG KÊ QUY MÔ TOÀN TRƯỜNG (SYSTEM KPI) ────────────────────────────────┐ │
│ 📅 Ca thi   │ │ [ 1,450 ] Sinh viên     │ [ 85 ] Giảng viên        │ [ 05 ] Quản trị viên   │ │
│ 📜 Audit Log│ │ [ 32 ] Ca thi tuần này  │ [ 142 ] Thí sinh live    │ [ 99.98% ] API Uptime  │ │
│ ⚙ Cài đặt   │ └─────────────────────────┴──────────────────────────┴────────────────────────┘ │
│             │                                                                               │
│             │ ┌─ CẢNH BÁO TẢI ĐỈNH & DỰ BÁO TÀI NGUYÊN (CAPACITY FORECAST) ───────────────┐ │
│             │ │ ⚠ KHUNG GIỜ CAO ĐIỂM SẮP TỚI: 08:00 - 10:00 Sáng mai (18/10/2026)          │ │
│             │ │ • Dự kiến: 04 Ca thi mở đồng thời với hơn 650 thí sinh truy cập cùng lúc.   │ │
│             │ │ • Khuyến nghị kiến trúc: Duy trì tối thiểu 4 PHP-FPM Workers & Redis Cache. │ │
│             │ │ • Kết nối PostgreSQL hiện tại: 18 / 100 Connections (An toàn).              │ │
│             │ └─────────────────────────────────────────────────────────────────────────────┘ │
│             │                                                                               │
│             │ ┌─ TRẠNG THÁI CÁC DỊCH VỤ CỐT LÕI (HEALTH CHECKS) ──────────────────────────┐ │
│             │ │ • PostgreSQL 16 Cluster: [ 🟢 Hoạt động tốt - Latency 1.2ms ]              │ │
│             │ │ • Redis 7 Session/Cache: [ 🟢 Hoạt động tốt - Memory 14% ]                 │ │
│             │ │ • PHP 8.3 FPM Worker:    [ 🟢 04 Workers Idle ]                            │ │
│             │ │ • Queue Worker (Scoring):[ 🟢 Active - 0 Job tồn đọng ]                    │ │
│             │ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. `SCR-ADM-02`: Quản Trị Người Dùng & Phân Vai Trò (User Management & RBAC)

### 2.1. Thông Tin Chung
- **Đường dẫn URL**: `/admin/users`
- **Use Case**: `UC-ADMIN-01` (Quản trị người dùng & gán vai trò).
- **CSDL liên quan**: `users(name, email, role, is_active)`.
- **API**: `GET /api/v1/users`, `POST /api/v1/users`, `PATCH /api/v1/users/{id}`.

### 2.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Quản trị Người dùng & Phân quyền                        [ + Tạo tài khoản mới ] │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔍 [ Nhập tên, email hoặc MSSV...     ] Lọc Vai trò: [ Tất cả vai trò ▼ ]  Trạng thái: [Tất cả]│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ DANH SÁCH TÀI KHOẢN (Tổng cộng: 1,540 tài khoản • Hiển thị trang 1/77):                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Tên tài khoản         │ Email định danh        │ Vai trò  │ Trạng thái   │ Ngày tạo     │ │
│ ├───────────────────────┼────────────────────────┼──────────┼──────────────┼──────────────┤ │
│ │ TS. Trần Minh Khoa    │ khoatm@university.edu  │ [Teacher]│ [🟢 Hoạt động]│ 12/01/2026   │ │
│ │ Nguyễn Văn A (SV101)  │ 21020015@student.edu   │ [Student]│ [🟢 Hoạt động]│ 15/09/2026   │ │
│ │ ThS. Đỗ Hoàng Long    │ longdh@university.edu  │ [Admin]  │ [🟢 Hoạt động]│ 01/01/2026   │ │
│ │ Lê Hoàng C (SV103)    │ 21020017@student.edu   │ [Student]│ [🔴 Tạm khóa] │ 15/09/2026   │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ Thao tác trên từng dòng: [ ✏ Phân vai trò ] [ 🔑 Đặt lại mật khẩu ] [ 🔒 Khóa / Mở tài khoản]│
│ [ ◀ Trang trước ]                        Trang 1 / 77                       [ Trang sau ▶ ] │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. `SCR-ADM-03`: Nhật Ký Kiểm Toán & Thanh Tra An Ninh (System Audit Logs)

### 3.1. Thông Tin Chung
- **Đường dẫn URL**: `/admin/audit-logs`
- **Use Case**: `UC-ADMIN-02`
- **CSDL liên quan**: `proctoring_events`, bản ghi lịch sử thao tác API.
- **Mục tiêu**: Lưu vết append-only bất biến phục vụ thanh tra kỳ thi, điều tra khiếu nại điểm số và phát hiện hành vi truy cập trái phép.

### 3.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Nhật ký Kiểm toán & Thanh tra An ninh (Audit Logs)          [ 📥 Xuất báo cáo CSV]│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ BỘ LỌC KIỂM TOÁN:                                                                           │
│ Từ ngày: [ 2026-10-17 ] Đến: [ 2026-10-17 ]  Mức độ: [ Tất cả ▼ ]  Actor: [ Tất cả ▼ ]     │
│ Hành động: [ Tất cả (Login, Submit, Publish, Sensor...) ▼ ]    🔍 [ IP, ID đối tượng...   ] │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Thời gian       │ Actor          │ Hành động          │ Chi tiết & Đối tượng   │ IP / Agent │ │
│ ├─────────────────┼────────────────┼────────────────────┼────────────────────────┼────────────┤ │
│ │ 08:52:14 17/10  │ SV101 (Student)│ SUBMIT_ATTEMPT     │ Attempt #842 (Score:8.75)│ 14.232.x.x │ │
│ │ 08:41:02 17/10  │ SV103 (Student)│ SENSOR_ALERT       │ tab_hidden (Medium)    │ 118.70.x.x │ │
│ │ 08:15:30 17/10  │ KhoaTM(Teacher)│ PUBLISH_SESSION    │ Session #12 (45 SV)    │ 172.16.x.x │ │
│ │ 08:00:10 17/10  │ LongDH (Admin) │ UPDATE_USER_ROLE   │ User #45 -> Teacher    │ 10.0.0.12  │ │
│ │ 07:45:22 17/10  │ Unknown        │ FAILED_LOGIN_LIMIT │ 5 lần sai pass (Lock)  │ 222.252.x.x│ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│ [ ◀ Trang trước ]                        Trang 1 / 158                      [ Trang sau ▶ ] │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. `SCR-ADM-04`: Cấu Hình Tham Số Toàn Hệ Thống (System Settings)

### 4.1. Thông Tin Chung
- **Đường dẫn URL**: `/admin/settings`
- **Actor sử dụng**: `admin`
- **Mục tiêu**: Điều chỉnh các hạn mức bảo mật, thời gian ân hạn, chính sách lưu trữ nhật ký phòng thi.

### 4.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Cấu hình Tham số Toàn hệ thống                                  [ 💾 Lưu cài đặt]│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─ THAM SỐ THI CỬ MẶC ĐỊNH (EXAMINATION DEFAULTS) ────────────────────────────────────────┐ │
│ │ Thời gian cho phép vào thi muộn mặc định:   [ 15 ] phút                                   │ │
│ │ Khoảng thời gian ân hạn kỹ thuật khi nộp:   [ 30 ] giây (Bù độ trễ mạng)                  │ │
│ │ Thời gian trễ tối đa giữa các lần Autosave: [ 500 ] mili-giây (Debounce)                  │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ ┌─ GIỚI HẠN TẦN SUẤT & BẢO VỆ CHỐNG TẤN CÔNG (RATE LIMITING) ─────────────────────────────┐ │
│ │ Hạn mức gọi API lưu đáp án (/answers):       [ 120 ] requests / phút / thí sinh           │ │
│ │ Hạn mức gửi tín hiệu cảm biến (proctoring):  [ 30 ] requests / phút / thí sinh            │ │
│ │ Khóa tạm thời sau số lần đăng nhập thất bại: [ 05 ] lần trong 15 phút                     │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ ┌─ CHÍNH SÁCH LƯU TRỮ DỮ LIỆU (DATA RETENTION POLICY) ────────────────────────────────────┐ │
│ │ Thời gian lưu trữ Nhật ký cảm biến (Proctoring Events): [ 90 ] ngày                       │ │
│ │ Thời gian lưu trữ Bản ghi Lượt thi (Exam Attempts):     [ Vĩnh viễn (Permanent) ]        │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```
