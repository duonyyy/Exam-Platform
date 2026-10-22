# 📱 Đặc Tả Chi Tiết 17 Màn Hình Hệ Thống (Frontend Screen Specifications)

**Dự án**: ThiSmart (Exam Platform)  
**Tài liệu**: `docs/05-frontend/SCREEN_SPECIFICATIONS.md`  
**Thương hiệu & Bản sắc**: **ThiSmart Concept 03 — Minimal Tech / Modern EdTech** (Chi tiết: [`THISMART_BRAND_GUIDELINES.md`](THISMART_BRAND_GUIDELINES.md))  
**Slogan**: *Thi thông minh. Đánh giá chính xác.*  
**Căn cứ thiết kế**:
- **Backend Architecture & APIs**: `docs/03-architecture-api/12-API_DESIGN.md`
- **Cơ sở dữ liệu 14 bảng**: `docs/02-domain-database/09-DATABASE_DESIGN.md` & `07-STATE_MACHINES.md`
- **Use Cases & Business Rules**: `docs/01-requirements/04-USE_CASES.md` & `05-BUSINESS_RULES.md`
- **Frontend Architecture**: `docs/05-frontend/17-FRONTEND_DESIGN.md`
- **Brand Guidelines & Tokens**: `docs/05-frontend/THISMART_BRAND_GUIDELINES.md` (`web-client/public/brand/`)
**Stack triển khai**: Next.js 15+ (App Router), React 19, TypeScript Strict Mode, Tailwind CSS, TanStack Query v5, Zod, Lucide React.

**Tài liệu Wireframe Tách Riêng (Modular Wireframe Specs)**: Toàn bộ wireframe chi tiết và bản xem trước HTML tương tác đã được phân tách thành các tệp độc lập tại thư mục **[`docs/05-frontend/wireframe/`](wireframe/)**:
- Phân hệ Xác thực: [`01-AUTH-WIREFRAMES.md`](wireframe/01-AUTH-WIREFRAMES.md)
- Phân hệ Thí sinh: [`02-STUDENT-WIREFRAMES.md`](wireframe/02-STUDENT-WIREFRAMES.md)
- Phân hệ Giảng viên: [`03-TEACHER-WIREFRAMES.md`](wireframe/03-TEACHER-WIREFRAMES.md)
- Phân hệ Quản trị viên: [`04-ADMIN-WIREFRAMES.md`](wireframe/04-ADMIN-WIREFRAMES.md)
- Đặc tả Phòng thi Focus Mode: [`05-FOCUS-EXAM-ROOM-SPEC.md`](wireframe/05-FOCUS-EXAM-ROOM-SPEC.md)
- Trình xem trước tương tác: [`wireframe-preview.html`](wireframe/wireframe-preview.html)

---

## 🗺️ Ma Trận Tổng Quan: Actor — Use Case — Màn Hình — CSDL — API

| Mã màn hình | Tên màn hình | Route Path | Actor | Use Case liên kết | Bảng CSDL chính | Endpoint API tương ứng |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **`SCR-AUTH-01`** | Đăng nhập hệ thống | `/login` | Public | Xác thực | `users`, `personal_access_tokens` | `POST /api/v1/auth/login` |
| **`SCR-AUTH-02`** | Đăng ký tài khoản Sinh viên | `/register` | Public | Xác thực | `users` | `POST /api/v1/auth/register` |
| **`SCR-STU-01`** | Danh sách ca thi của tôi | `/student/exams` | Student | `UC-STUDENT-01` | `session_assignments`, `exam_sessions`, `exams`, `subjects` | `GET /api/v1/student/assigned-sessions` |
| **`SCR-STU-02`** | Chi tiết ca thi & Kiểm tra điều kiện | `/student/exams/[id]/instructions` | Student | `UC-ATTEMPT-START` | `exam_sessions`, `session_assignments`, `exam_attempts` | `POST /api/v1/exam-sessions/{id}/attempts` |
| **`SCR-STU-03`** | **Phòng thi tập trung (Focus Exam Room)** | `/exam/[attemptId]` | Student | `UC-ATTEMPT-SAVE-ANSWER`, `UC-STUDENT-05` | `exam_attempts`, `attempt_answers`, `questions`, `exam_questions`, `proctoring_events` | `GET /api/v1/exam-attempts/{id}`<br>`PATCH /api/v1/exam-attempts/{id}/answers`<br>`POST /api/v1/exam-attempts/{id}/proctoring-events` |
| **`SCR-STU-04`** | Hộp thoại xác nhận & Biên nhận nộp bài | Modal / `/exam/[attemptId]/receipt` | Student | `UC-ATTEMPT-SUBMIT` | `exam_attempts`, `attempt_answers` | `POST /api/v1/exam-attempts/{id}/submit` |
| **`SCR-STU-05`** | Tra cứu kết quả & Chi tiết bài làm | `/student/results/[attemptId]` | Student | `UC-ATTEMPT-SUBMIT` | `exam_attempts`, `attempt_answers`, `exam_questions`, `questions` | `GET /api/v1/exam-attempts/{id}/result` |
| **`SCR-TEA-01`** | Bảng điều khiển Giảng viên | `/teacher` | Teacher | Tổng quan | `subjects`, `exams`, `exam_sessions`, `exam_attempts` | `GET /api/v1/auth/me`, `/subjects`, `/exam-sessions` |
| **`SCR-TEA-02`** | Quản lý Môn học & Chủ đề | `/teacher/subjects` | Teacher, Admin | `UC-TEACHER-01` | `subjects`, `topics`, `users` | `GET/POST/PATCH /api/v1/subjects`<br>`GET/POST /api/v1/subjects/{id}/topics` |
| **`SCR-TEA-03`** | Ngân hàng Câu hỏi | `/teacher/questions` | Teacher, Admin | `UC-TEACHER-02`, `UC-TEACHER-03` | `questions`, `topics`, `subjects` | `GET /api/v1/questions`<br>`PATCH /api/v1/questions/{id}/status` |
| **`SCR-TEA-04`** | Soạn thảo & Biên tập Câu hỏi | `/teacher/questions/new` & `[id]/edit` | Teacher, Admin | `UC-TEACHER-02`, `UC-TEACHER-03` | `questions`, `topics` | `POST /api/v1/questions`<br>`PUT /api/v1/questions/{id}` |
| **`SCR-TEA-05`** | Soạn & Thiết kế Đề thi Mẫu | `/teacher/exams` & `[id]/edit` | Teacher, Admin | `UC-TEACHER-04` | `exams`, `exam_questions`, `questions`, `subjects` | `GET/POST /api/v1/exams`<br>`POST /api/v1/exams/{id}/questions` |
| **`SCR-TEA-06`** | Quản lý Ca thi & Phân công Thí sinh | `/teacher/sessions` & `[id]/edit` | Teacher, Admin | `UC-TEACHER-05`, `UC-SESSION-PUBLISH` | `exam_sessions`, `session_assignments`, `session_teachers`, `exams` | `GET/POST /api/v1/exam-sessions`<br>`POST /api/v1/exam-sessions/{id}/assign-students`<br>`POST /api/v1/exam-sessions/{id}/publish` |
| **`SCR-TEA-07`** | Giám sát Phòng thi Trực tiếp (Live Proctoring) | `/teacher/sessions/[id]/monitor` | Teacher, Admin | `UC-TEACHER-07` | `exam_sessions`, `session_assignments`, `exam_attempts`, `proctoring_events` | `GET /api/v1/exam-sessions/{id}/monitor-stream`<br>`POST /api/v1/exam-sessions/{id}/close` |
| **`SCR-TEA-08`** | Báo cáo Điểm số & Phổ điểm Ca thi | `/teacher/sessions/[id]/results` | Teacher, Admin | `UC-TEACHER-07` | `exam_sessions`, `exam_attempts`, `attempt_answers`, `questions` | `GET /api/v1/exam-sessions/{id}/results` |
| **`SCR-ADM-01`** | Bảng điều khiển Quản trị Toàn diện | `/admin` | Admin | `UC-ADMIN-02` | `users`, `subjects`, `exam_sessions`, `exam_attempts` | Tổng hợp thống kê toàn hệ thống |
| **`SCR-ADM-02`** | Quản trị Tài khoản & Phân quyền | `/admin/users` | Admin | `UC-ADMIN-01` | `users` | `GET/POST/PATCH /api/v1/users` |
| **`SCR-ADM-03`** | Nhật ký Kiểm toán & Thanh tra | `/admin/audit-logs` | Admin | `UC-ADMIN-02` | `proctoring_events`, system audit logs | `GET /api/v1/admin/audit-logs` |

---

## 🔐 PHÂN HỆ 1: XÁC THỰC & CHUNG (AUTH SHELL)

### 1. `SCR-AUTH-01`: Màn hình Đăng nhập (Login Screen)
- **Route**: `app/(auth)/login/page.tsx` $\rightarrow$ `/login`
- **Actor**: Thí sinh (`student`), Giảng viên (`teacher`), Quản trị viên (`admin`).
- **CSDL & API**: `users(email, password, role, is_active)` $\rightarrow$ `POST /api/v1/auth/login`. Trả về `token`, `role`, thông tin user.
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            THISMART                                         │
│       ┌─────────────────────────────────────────────────────────────┐       │
│       │ [Logo Mark] ThiSmart                                        │       │
│       │ Cổng Khảo Thí & Đánh Giá Trực Tuyến                         │       │
│       │                                                             │       │
│       │ Email / Mã sinh viên:                                       │       │
│       │ [ nguyenvana@university.edu.vn                            ] │       │
│       │                                                             │       │
│       │ Mật khẩu:                                                   │       │
│       │ [ •••••••••••••••••••••••••••••                      [👁] ] │       │
│       │                                                             │       │
│       │ [ ] Ghi nhớ đăng nhập             Quên mật khẩu?            │       │
│       │                                                             │       │
│       │ [           ĐĂNG NHẬP VÀO HỆ THỐNG (Primary)              ] │       │
│       │                                                             │       │
│       │ Chưa có tài khoản? Đăng ký dự thi dành cho sinh viên        │       │
│       └─────────────────────────────────────────────────────────────┘       │
│                    © 2026 Đại học Quốc Gia • Phòng Khảo Thí                  │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Xử lý UX/Logic**:
  - Chống Brute-force: Rate limiting qua Laravel Middleware.
  - Sau khi đăng nhập thành công, điều hướng dựa vào `role`:
    - `student` $\rightarrow$ `/student/exams`
    - `teacher` $\rightarrow$ `/teacher`
    - `admin` $\rightarrow$ `/admin`
  - Token lưu trữ qua Next.js Route Handler HttpOnly cookie hoặc in-memory Bearer header, tránh rò rỉ XSS.

---

## 🎓 PHÂN HỆ 2: THÍ SINH (STUDENT EXPERIENCE)

### 2. `SCR-STU-01`: Danh sách Ca thi của tôi (My Assigned Exams)
- **Route**: `app/(workspace)/student/exams/page.tsx` $\rightarrow$ `/student/exams`
- **Actor**: `student`
- **Use Case**: `UC-STUDENT-01` (Xem danh sách ca thi được gán).
- **CSDL liên quan**: `session_assignments` INNER JOIN `exam_sessions` INNER JOIN `exams` INNER JOIN `subjects`.
- **API Endpoint**: `GET /api/v1/student/assigned-sessions`
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo Mark] ThiSmart | Sinh viên        [🔔 2] [Avatar] Nguyễn Văn A (SV101)│
├─────────────┬───────────────────────────────────────────────────────────────┤
│ ❖ Tổng quan │ Workspace / Ca thi của tôi                                    │
│ 📅 Ca thi   │                                                               │
│ 📊 Kết quả  │ ╔═══════════════════════════════════════════════════════════╗ │
│ ⚙ Cài đặt   │ ║ CA THI TIẾP THEO: Lập trình Web - K21 (Giữa kỳ)           ║ │
│             │ ║ Giờ thi: 08:00 - 09:30 (Hôm nay) • Thời lượng: 60 phút    ║ │
│             │ ║ [ VÀO THI NGAY (Mở sau 05:12) ]                           ║ │
│             │ ╚═══════════════════════════════════════════════════════════╝ │
│             │                                                               │
│             │ [ Tab: Sắp diễn ra (2) ] [ Đang mở (1) ] [ Đã kết thúc (5) ]  │
│             │                                                               │
│             │ ┌─ CARD CA THI ─────────────────────────────────────────────┐ │
│             │ │ Môn: Cấu trúc Dữ liệu & Giải thuật (CS201)   [Badge: Sắp thi]│
│             │ │ Ca thi: Đợt 1 - Học kỳ II • Thời lượng: 90 phút           │
│             │ │ Khung giờ: 14:00 - 15:45, Ngày 20/10/2026                 │
│             │ │ Giảng viên: TS. Trần Minh Khoa • Hình thức: Trắc nghiệm 50c │
│             │ │ [ Xem hướng dẫn phòng thi ]                               │ │
│             │ └───────────────────────────────────────────────────────────┘ │
│             │ ┌─ CARD CA THI ─────────────────────────────────────────────┐ │
│             │ │ Môn: Cơ sở Dữ liệu Nâng cao (DB301)         [Badge: Đã nộp]│
│             │ │ Nộp bài lúc: 10:15 Ngày 12/10/2026 • Điểm: 8.5/10.0       │
│             │ │ [ Xem lại kết quả & Phản hồi ]                            │ │
│             │ └───────────────────────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────────────────────┘
```
- **Quy tắc nghiệp vụ**:
  - Ca thi chỉ cho phép click `VÀO THI` khi `now >= start_at` và `now <= start_at + allow_late_minutes`.
  - Nếu đến muộn quá `allow_late_minutes`, nút bị vô hiệu hóa kèm nhãn cảnh báo đỏ `Đã quá giờ vào thi`.

---

### 3. `SCR-STU-02`: Chi tiết Ca thi & Kiểm tra Điều kiện (Pre-flight Checklist)
- **Route**: `app/(workspace)/student/exams/[id]/instructions/page.tsx`
- **Actor**: `student`
- **Use Case**: `UC-ATTEMPT-START` (Bắt đầu lượt thi).
- **CSDL & API**: `exam_sessions`, `exams`, `session_assignments` $\rightarrow$ Gọi `POST /api/v1/exam-sessions/{id}/attempts`.
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ ← Quay lại ]                                        Nguyễn Văn A (SV101)  │
├─────────────────────────────────────────────────────────────────────────────┤
│                           HƯỚNG DẪN & ĐIỀU KIỆN DỰ THI                      │
│                Môn thi: Lập trình Web nâng cao (IT4409)                     │
│                                                                             │
│ ┌─ THÔNG TIN BÀI THI ──────────────────┐ ┌─ KIỂM TRA ĐIỀU KIỆN THI ───────┐ │
│ │ • Thời lượng: 60 phút                │ │ [✓] Kết nối Internet: Ổn định  │ │
│ │ • Số lượng câu hỏi: 40 câu           │ │ [✓] Trình duyệt hỗ trợ: Tốt    │ │
│ │ • Điểm sàn đạt: 5.0 / 10.0           │ │ [✓] Độ phân giải màn hình: Đạt │ │
│ │ • Cho phép vào muộn: 15 phút         │ │ [!] Cảnh báo: Chế độ Toàn màn  │ │
│ │ • Số lần làm bài: 01 lần duy nhất    │ │     hình sẽ được bật khi thi.  │ │
│ └──────────────────────────────────────┘ └────────────────────────────────┘ │
│                                                                             │
│ ┌─ QUY CHẾ & CẢNH BÁO GIÁM SÁT TRỰC TUYẾN (PROCTORING RULES) ─────────────┐ │
│ │ 1. Thí sinh KHÔNG được rời khỏi toàn màn hình hoặc chuyển sang tab khác. │ │
│ │ 2. Mọi thao tác Alt+Tab, mở DevTools, chia sẻ màn hình sẽ được ghi nhận. │ │
│ │ 3. Hệ thống tự động nộp bài khi hết giờ (Server-Authoritative Clock).    │ │
│ │ 4. Đáp án được tự động lưu sau mỗi lần chọn (Autosave).                  │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [X] Tôi đã đọc kỹ quy chế và cam kết làm bài trung thực, không gian lận.     │
│                                                                             │
│                     [ BẮT ĐẦU LÀM BÀI THI (Primary CTA) ]                   │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Hành vi kỹ thuật**:
  - Khi click `BẮT ĐẦU LÀM BÀI THI`, frontend gọi API `POST /api/v1/exam-sessions/{id}/attempts`.
  - Backend mở Database Transaction, tạo bản ghi `exam_attempts` với `status = in_progress`, `started_at = now()`, sinh `attempt_id`.
  - Frontend chuyển sang Fullscreen Mode và chuyển hướng sang `/exam/[attemptId]`.

---

### 4. `SCR-STU-03`: Phòng thi Tập trung (Focus Exam Room — Core Screen)
- **Route**: `app/(focus)/exam/[attemptId]/page.tsx`
- **Actor**: `student`
- **Use Cases**: `UC-ATTEMPT-SAVE-ANSWER`, `UC-STUDENT-05` (Proctoring events), `UC-ATTEMPT-SUBMIT`.
- **CSDL liên quan**: `exam_attempts`, `attempt_answers`, `questions`, `exam_questions`, `proctoring_events`.
- **API Endpoints**:
  - `GET /api/v1/exam-attempts/{id}` (Lấy danh sách câu hỏi sạch `QuestionStudentResource` — Tuyệt đối không rò rỉ `correct_answer`).
  - `PATCH /api/v1/exam-attempts/{id}/answers` (Autosave câu trả lời, idempotent upsert).
  - `POST /api/v1/exam-attempts/{id}/proctoring-events` (Gửi nhật ký chuyển tab/mất focus).
- **Wireframe Bố cục Chi tiết (1440px Desktop)**:
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Logo Mark] ThiSmart | Lập trình Web - K21              Nguyễn Văn A • SV101 │
│                       ⏱ 45:12 còn lại  •  ✓ Đã lưu thay đổi (Cloud Icon)   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Tiến độ: 28/40 câu [████████████████████░░░░░░░░░] 70%  • Tự động lưu đáp án │
├────────────────────────────────────────────────┬─────────────────────────────┤
│ ┌─ KHUNG NỘI DUNG CÂU HỎI (70%) ──────────────┐│ ┌─ QUESTION PALETTE (30%) ┐│
│ │ CÂU 15 / 40          [0.25 điểm] [⚑ Đánh dấu]││ Đã làm: 28  •  Chưa làm: 12│
│ │                                             ││                             │
│ │ Trong kiến trúc RESTful API, phương thức    ││ [01][02][03][04][05] (Blue) │
│ │ HTTP nào có tính chất Idempotent và thường  ││ [06][07][08][09][10]        │
│ │ được sử dụng để cập nhật toàn bộ tài nguyên?││ [11][12][13][14][(15)](Ring)│
│ │                                             ││ [16][17][18][19][20]        │
│ │ [ ] A. POST                                 ││ ...                         │
│ │ [●] B. PUT            (Selected Highlight)  ││ [36][37][38][39][40] (Gray) │
│ │ [ ] C. PATCH                                ││                             │
│ │ [ ] D. DELETE                               ││ Ghi chú:                    │
│ │                                             ││ ■ Đã làm  □ Chưa làm        │
│ │ ℹ Chọn một đáp án. Thay đổi được lưu tự động││ ⚑ Đã đánh dấu xem lại: 3    │
│ │                             [ Bỏ chọn ]     ││                             │
│ └─────────────────────────────────────────────┘│ [ 📤 NỘP BÀI THI (Danger) ] │
├────────────────────────────────────────────────┴─────────────────────────────┤
│ [ ← Câu trước (Phím ←) ]                                [ Câu tiếp theo → ] │
└──────────────────────────────────────────────────────────────────────────────┘
```
- **Trạng thái Đặc biệt & Phòng vệ An ninh**:
  - **Banner Mất kết nối (Offline Banner)**: Nếu mất mạng, thanh màu cam xuất hiện trên cùng: `⚠ Mất kết nối mạng. Đáp án mới đang được xếp hàng đợi đồng bộ lại...`. Nút nộp bài bị khóa cho đến khi mạng hồi phục và đồng bộ xong.
  - **Sensors / Proctoring Collector**: Bắt các sự kiện `visibilitychange` (rời tab), `blur` (click ra ngoài cửa sổ), `fullscreenchange` (thoát toàn màn hình). Khi xảy ra:
    - Hiển thị Toast cảnh báo: *"Cảnh báo: Bạn vừa rời khỏi màn hình thi. Sự kiện đã được ghi nhận vào nhật ký giám sát!"*
    - Gửi ngầm `POST /api/v1/exam-attempts/{id}/proctoring-events` với payload: `{ event_type: 'tab_hidden', severity: 'medium', occurred_at: timestamp }`.
  - **Debounced Autosave (500ms)**: Thí sinh click đáp án $\rightarrow$ Cập nhật UI ngay lập tức (Optimistic UI) $\rightarrow$ Debounce 500ms $\rightarrow$ Gọi `PATCH /answers` $\rightarrow$ Chuyển trạng thái icon từ `Đang lưu...` $\rightarrow$ `✓ Đã lưu tất cả thay đổi`.

---

### 5. `SCR-STU-04`: Xác nhận Nộp bài & Biên nhận Điện tử (Submit Modal & Receipt)
- **Route**: Modal hiển thị tại `/exam/[attemptId]`
- **Actor**: `student`
- **Use Case**: `UC-ATTEMPT-SUBMIT` (Nộp bài thi & kích hoạt chấm điểm).
- **CSDL & API**: `exam_attempts(status = submitted, submitted_at = now, score)` $\rightarrow$ `POST /api/v1/exam-attempts/{id}/submit` kèm `Idempotency-Key` header.
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────┐
│                   XÁC NHẬN NỘP BÀI THI                      │
│                                                             │
│  Bạn có chắc chắn muốn kết thúc và nộp bài thi ngay bây giờ?│
│  Sau khi nộp, bạn sẽ không thể thay đổi bất kỳ đáp án nào.  │
│                                                             │
│  ┌─ TỔNG KẾT TIẾN ĐỘ ─────────────────────────────────────┐ │
│  │    [ 38 ] Đã trả lời   •   [ 02 ] Chưa làm   •  [ 03 ] ⚑│ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ⚠ Cảnh báo: Bạn vẫn còn 2 câu hỏi chưa hoàn thành!         │
│                                                             │
│  [ Quay lại làm tiếp ]            [ XÁC NHẬN NỘP BÀI (Xanh) ]│
└─────────────────────────────────────────────────────────────┘
                            ↓↓↓ (Sau khi Backend xác nhận thành công)
┌─────────────────────────────────────────────────────────────┐
│                    BIÊN NHẬN NỘP BÀI THÀNH CÔNG             │
│                     [ Icon Check Xanh Lá ]                  │
│                                                             │
│  Bài thi của bạn đã được ghi nhận an toàn vào máy chủ!      │
│                                                             │
│  • Mã biên nhận: REC-20261017-SV101-0982                    │
│  • Thời điểm nộp: 08:52:14 - 17/10/2026                     │
│  • Số câu hoàn thành: 38 / 40 câu                           │
│  • Điểm số: 8.75 / 10.0 (Công bố điểm tức thì)              │
│                                                             │
│            [ QUAY VỀ DANH SÁCH BÀI THI (Primary) ]          │
└─────────────────────────────────────────────────────────────┘
```
- **Kỹ thuật Backend gắn kết**:
  - Thực thi trong `DB::transaction` với `ExamAttempt::lockForUpdate()`.
  - Khóa bi quan chống Double-submit (nếu bấm liên tục 2 lần, request thứ hai trả về `409 Conflict`).
  - Gọi Service `AttemptScorer` chấm điểm chính xác và chốt trạng thái `submitted`.

---

### 6. `SCR-STU-05`: Tra cứu Kết quả & Xem lại Bài thi (Results & Review)
- **Route**: `app/(workspace)/student/results/[attemptId]/page.tsx`
- **Actor**: `student`
- **Use Case**: Xem điểm số và giải thích (nếu ca thi cho phép công bố).
- **CSDL & API**: `exam_attempts`, `attempt_answers`, `exam_questions`, `questions`.
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ ← Quay lại Kết quả ]                                 Nguyễn Văn A (SV101) │
├─────────────────────────────────────────────────────────────────────────────┤
│ KẾT QUẢ BÀI THI: LẬP TRÌNH WEB (GIỮA KỲ) • ĐỢT 1                            │
│ ┌─ KẾT QUẢ TỔNG QUAN ─────────────────────────────────────────────────────┐ │
│ │ Điểm số: 8.75 / 10.0   •   Xếp loại: ĐẠT (Pass)    •   Thời gian: 52 phút│ │
│ │ Trả lời đúng: 35 / 40 câu   •   Sai: 3 câu   •   Bỏ qua: 2 câu           │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [ Chi tiết từng câu hỏi ] (Chỉ hiển thị khi ca thi bật 'show_explanation') │
│                                                                             │
│ ┌─ CÂU 01: [✓ Đúng] (+0.25đ) ─────────────────────────────────────────────┐ │
│ │ Trong HTTP, phương thức nào dùng để lấy biểu diễn tài nguyên?           │ │
│ │ [●] A. GET (Bạn đã chọn)                                                │ │
│ │ [ ] B. POST                                                             │ │
│ │ Giải thích: Phương thức GET dùng để truy xuất dữ liệu an toàn và idempotent│
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ CÂU 14: [✗ Sai] (0đ) ──────────────────────────────────────────────────┐ │
│ │ Giao thức truyền dữ liệu an toàn giữa trình duyệt và máy chủ?           │ │
│ │ [●] A. FTP (Bạn đã chọn)                                                │ │
│ │ [✓] B. HTTPS (Đáp án đúng)                                              │ │
│ │ Giải thích: HTTPS sử dụng chứng chỉ TLS/SSL để mã hóa lưu lượng mạng.   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 👨‍🏫 PHÂN HỆ 3: GIẢNG VIÊN (TEACHER WORKSPACE)

### 7. `SCR-TEA-01`: Tổng quan Giảng viên (Teacher Dashboard)
- **Route**: `app/(workspace)/teacher/page.tsx` $\rightarrow$ `/teacher`
- **Actor**: `teacher`
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo Mark] ThiSmart | Giảng viên                 [🔔 3] TS. Trần Minh Khoa │
├─────────────┬───────────────────────────────────────────────────────────────┤
│ ❖ Tổng quan │ Bảng điều khiển Giảng viên phụ trách                          │
│ 📚 Môn học  │                                                               │
│ ❓ Câu hỏi  │ ┌─ THỐNG KÊ NHANH ──────────────────────────────────────────┐ │
│ 📝 Đề thi   │ │ [ 03 ] Môn phụ trách   │ [ 420 ] Câu hỏi ngân hàng        │ │
│ 📅 Ca thi   │ │ [ 02 ] Ca thi đang mở  │ [ 128 ] Thí sinh đang thi        │ │
│ 👥 Giám sát │ └────────────────────────┴──────────────────────────────────┘ │
│ 📊 Bảng điểm│                                                               │
│             │ ┌─ CA THI ĐANG DIỄN RA (LIVE NOW) ──────────────────────────┐ │
│             │ │ Lập trình Web - K21 • Ca 08:00 - 09:30 [Badge: Đang thi]  │ │
│             │ │ Tiến độ: 42/45 thí sinh đã vào phòng • 12 cảnh báo        │ │
│             │ │ [ 🔴 VÀO PHÒNG GIÁM SÁT TRỰC TIẾP (SCR-TEA-07) ]          │ │
│             │ └───────────────────────────────────────────────────────────┘ │
│             │                                                               │
│             │ ┌─ HOẠT ĐỘNG GẦN ĐÂY ───────────────────────────────────────┐ │
│             │ │ • Đề thi "Giữa kỳ CSDL 2026" vừa được tạo bởi bạn.         │ │
│             │ │ • Ca thi "Lập trình C - K22" vừa kết thúc (Nộp 100%).     │ │
│             │ └───────────────────────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────────────────────┘
```

---

### 8. `SCR-TEA-02`: Quản lý Môn học & Chủ đề (Subjects & Topics)
- **Route**: `app/(workspace)/teacher/subjects/page.tsx`
- **Actor**: `teacher` (chỉ xem/sửa môn mình phụ trách `owner_teacher_id`), `admin` (toàn quyền).
- **Use Case**: `UC-TEACHER-01`
- **CSDL liên quan**: `subjects`, `topics`, `users`.
- **API Endpoints**:
  - `GET /api/v1/subjects` (kèm `topics_count`)
  - `POST /api/v1/subjects/{id}/topics` (Tạo chủ đề kiến thức)
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Quản lý Môn học & Chủ đề               [ + Tạo Môn học mới ]    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🔍 [ Tìm theo mã, tên môn...              ] [ Lọc: Môn tôi phụ trách ▼ ]    │
│                                                                             │
│ ┌─ MÔN HỌC: IT4409 — Lập trình Web [Giảng viên: TS. Trần Minh Khoa] ──────┐ │
│ │ Mô tả: Kiến trúc RESTful, Laravel, Next.js, CSDL và Bảo mật web.        │
│ │ Thống kê: 06 Chủ đề • 240 Câu hỏi • 03 Đề thi mẫu                       │
│ │                                                                         │
│ │ Danh sách Chủ đề kiến thức (Topics):                                    │
│ │   ├─ 1. Giao thức HTTP & REST Architecture (45 câu)   [Sửa] [Thêm câu]  │
│ │   ├─ 2. Cơ sở dữ liệu quan hệ & Eloquent ORM (60 câu) [Sửa] [Thêm câu]  │
│ │   ├─ 3. Xác thực Sanctum & Phân quyền RBAC (35 câu)   [Sửa] [Thêm câu]  │
│ │   └─ 4. Tối ưu hiệu năng & Caching Redis (30 câu)     [Sửa] [Thêm câu]  │
│ │                                                                         │
│ │ [ + Thêm Chủ đề mới cho Môn này ]               [ Sửa thông tin môn ]   │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 9. `SCR-TEA-03`: Ngân hàng Câu hỏi (Question Bank)
- **Route**: `app/(workspace)/teacher/questions/page.tsx`
- **Actor**: `teacher`, `admin`
- **Use Cases**: `UC-TEACHER-02`, `UC-TEACHER-03`
- **CSDL liên quan**: `questions`, `topics`, `subjects`.
- **API Endpoints**:
  - `GET /api/v1/questions?topic_id=&status=&type=&difficulty=`
  - `PATCH /api/v1/questions/{id}/status` (`{ status: 'ready' | 'disabled' }`)
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Ngân hàng Câu hỏi                      [ + Soạn câu hỏi mới ]   │
├─────────────────────────────────────────────────────────────────────────────┤
│ BỘ LỌC ĐA CHIỀU:                                                            │
│ Môn: [ Lập trình Web ▼ ] Chủ đề: [ Tất cả chủ đề ▼ ] Loại: [ Trắc nghiệm ▼ ]│
│ Độ khó: [ Tất cả ▼ ]     Trạng thái: [ Ready ▼ ]     🔍 [ Tìm từ khóa...  ] │
├─────────────────────────────────────────────────────────────────────────────┤
│ DANH SÁCH CÂU HỎI (Tổng: 240 câu • Đang hiển thị 1-20):                     │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [✓] CÂU HỎI #1042 • Môn: Lập trình Web • Chủ đề: HTTP/REST              │ │
│ │ "Trong HTTP, mã trạng thái 204 No Content có ý nghĩa gì?"               │ │
│ │ Loại: single_choice | Độ khó: Dễ | Trạng thái: [Badge: READY (Xanh)]    │ │
│ │ Đáp án đúng: A. Thành công nhưng không có body dữ liệu trả về           │ │
│ │ Hành động: [ Xem trước ] [ ✏ Sửa ] [ 🚫 Vô hiệu hóa (Tắt) ]            │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ [ ] CÂU HỎI #1043 • Môn: Lập trình Web • Chủ đề: Security               │ │
│ │ "Kể tên 3 nguy cơ bảo mật hàng đầu trong OWASP API Security Top 10?"    │ │
│ │ Loại: short_answer  | Độ khó: Khó | Trạng thái: [Badge: READY]          │ │
│ │ Hành động: [ Xem trước ] [ ✏ Sửa ] [ 🚫 Vô hiệu hóa ]                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ [ ◀ Trang trước ]                Trang 1 / 12                [ Trang sau ▶ ]│
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Ràng buộc FSM cốt lõi**:
  - Nếu câu hỏi đã được gắn vào Đề thi (`exam_questions.count > 0`), nút `Sửa` và `Vô hiệu hóa` sẽ hiển thị tooltip bị khóa: *"Câu hỏi đã nằm trong đề thi, không thể sửa/tắt nhằm bảo toàn kết quả lịch sử."* (Tuân thủ `BR-011`).

---

### 10. `SCR-TEA-04`: Soạn thảo & Biên tập Câu hỏi (Question Editor)
- **Route**: `app/(workspace)/teacher/questions/new/page.tsx` & `[id]/edit/page.tsx`
- **Actor**: `teacher`, `admin`
- **Use Cases**: `UC-TEACHER-02`, `UC-TEACHER-03`
- **CSDL & API**: `POST /api/v1/questions` hoặc `PUT /api/v1/questions/{id}`
- **Wireframe Bố cục (Chia 2 cột: Form nhập liệu & Live Preview)**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ ← Quay lại ] Soạn thảo Câu hỏi Mới                      [ Lưu câu hỏi ]   │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ ┌─ CẤU HÌNH CÂU HỎI ────────────────┐│ ┌─ XEM TRƯỚC HIỂN THỊ (PREVIEW) ────┐│
│ │ Môn học: [ Lập trình Web        ▼]││                                      │
│ │ Chủ đề:  [ HTTP & REST API      ▼]││ CÂU HỎI TRẮC NGHIỆM                  │
│ │ Độ khó:  (●) Dễ  ( ) Trung bình ( )Khó│ "Trong giao thức HTTP/1.1, phương │
│ │ Loại:    [ Trắc nghiệm 1 đáp án ▼]││ thức nào sau đây mang tính an toàn   │
│ │                                   ││ (Safe Method)?"                      │
│ │ Nội dung câu hỏi (Markdown/LaTeX):││                                      │
│ │ [ Trong giao thức HTTP/1.1,     ] ││ ( ) A. POST                          │
│ │ [ phương thức nào sau đây mang  ] ││ (●) B. GET [Đáp án đúng - Giáo viên] │
│ │ [ tính an toàn (Safe Method)?   ] ││ ( ) C. PUT                           │
│ │                                   ││ ( ) D. DELETE                        │
│ │ Danh sách Phương án (Options):    ││                                      │
│ │ [●] A. [ POST                   ] ││ 💡 Giải thích đáp án:                │
│ │ [●] B. [ GET                    ] ││ Phương thức GET chỉ đọc dữ liệu và   │
│ │ [ ] C. [ PUT                    ] ││ không làm thay đổi trạng thái server.│
│ │ [ ] D. [ DELETE                 ] ││                                      │
│ │ [ + Thêm phương án E ]            ││                                      │
│ │                                   ││                                      │
│ │ Giải thích đáp án (Explanation):  ││                                      │
│ │ [ Phương thức GET chỉ đọc dữ liệu]││                                      │
│ └───────────────────────────────────┘└──────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Hỗ trợ 4 loại câu hỏi**:
  1. `single_choice`: Radio button, 1 đáp án đúng.
  2. `multiple_choice`: Checkbox, chọn nhiều đáp án đúng.
  3. `true_false`: 2 tùy chọn Đúng / Sai.
  4. `short_answer`: Nhập chuỗi văn bản đối soát (không có options).

---

### 11. `SCR-TEA-05`: Thiết kế Đề thi Mẫu (Exam Template Assembler)
- **Route**: `app/(workspace)/teacher/exams/[id]/edit/page.tsx`
- **Actor**: `teacher`, `admin`
- **Use Case**: `UC-TEACHER-04` (Thiết kế đề thi mẫu & gán câu hỏi).
- **CSDL liên quan**: `exams`, `exam_questions`, `questions`.
- **API Endpoints**: `POST /api/v1/exams`, `POST /api/v1/exams/{id}/questions`
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ ← Danh sách đề ] Thiết kế Đề thi: Giữa kỳ Web 2026      [ Lưu cấu hình ]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─ THÔNG SỐ ĐỀ THI ───────────────────────────────────────────────────────┐ │
│ │ Môn: Lập trình Web • Thời lượng: [ 60 ] phút • Điểm sàn: [ 5.0 ]        │ │
│ │ [X] Xáo trộn thứ tự câu hỏi (Shuffle)  •  [X] Xáo trộn phương án        │ │
│ │ Tổng số câu: 40 câu  •  Tổng điểm tính lũy: 10.0 / 10.0                 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─ BẢNG CÂU HỎI TRONG ĐỀ (Đã chọn 40 câu) ───────────┐ ┌─ NGÂN HÀNG CÂU ──┐ │
│ │ STT | Mã câu | Nội dung tóm tắt          | Điểm số │ │ Lọc theo chủ đề: │ │
│ │ 01  | #1042  | Mã trạng thái 204         | [0.25]  │ │ [ HTTP/REST   ▼] │ │
│ │ 02  | #1045  | Cấu trúc JWT Bearer Token | [0.25]  │ │                  │ │
│ │ 03  | #1089  | CSRF Token hoạt động      | [0.25]  │ │ Câu #1102 (Dễ)   │ │
│ │ ... | ...    | ...                       | ...     │ │ [ + Gán vào đề ] │ │
│ │                                                    │ │ Câu #1105 (Khó)  │ │
│ │ [ Kéo thả đổi thứ tự ]      [ Xóa khỏi đề ]        │ │ [ + Gán vào đề ] │ │
│ └────────────────────────────────────────────────────┘ └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Ràng buộc nghiệp vụ**:
  - Tự động cộng dồn `exams.total_points = SUM(exam_questions.points)`.
  - Cảnh báo trực quan nếu tổng điểm khác 10.0 hoặc chưa đủ câu hỏi.

---

### 12. `SCR-TEA-06`: Quản lý & Lập lịch Ca thi (Exam Session Scheduler)
- **Route**: `app/(workspace)/teacher/sessions/[id]/edit/page.tsx`
- **Actor**: `teacher`, `admin`
- **Use Cases**: `UC-TEACHER-05`, `UC-SESSION-PUBLISH` (Xuất bản ca thi).
- **CSDL liên quan**: `exam_sessions`, `session_assignments`, `session_teachers`, `exams`.
- **API Endpoints**:
  - `POST /api/v1/exam-sessions`
  - `POST /api/v1/exam-sessions/{id}/assign-students` (Nhập danh sách SV / Excel)
  - `POST /api/v1/exam-sessions/{id}/publish` (Đưa ca thi sang `published`)
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Lập lịch Ca thi: IT4409-K21-GK               Trạng thái: [DRAFT]│
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─ THIẾT LẬP THỜI GIAN & ĐỀ THI ──────────────────────────────────────────┐ │
│ │ Tên ca thi: [ Kiểm tra Giữa kỳ - Nhóm 01 - Học kỳ I 2026               ]│ │
│ │ Chọn Đề thi mẫu: [ Đề thi số 1 - Lập trình Web (40 câu - 60 phút)     ▼]│ │
│ │ Bắt đầu (start_at): [ 2026-10-25 08:00 ] • Kết thúc: [ 2026-10-25 09:30]│ │
│ │ Cho phép đến muộn: [ 15 ] phút • Số lần thi tối đa: [ 01 ] lần          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─ PHÂN CÔNG THÍ SINH (ASSIGNED STUDENTS: 45) ────────────────────────────┐ │
│ │ [ 📥 Nhập file Excel danh sách ]  [ + Thêm từng sinh viên ]             │ │
│ │ Danh sách: Nguyễn Văn A (SV101), Trần Thị B (SV102), Lê C (SV103)...     │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─ PHÂN CÔNG GIÁM THỊ (PROCTORS: 02) ─────────────────────────────────────┐ │
│ │ 1. TS. Trần Minh Khoa (Trưởng ca) • 2. ThS. Lê Hoàng (Giám thị 2)       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [ Lưu bản nháp ]                         [ 🚀 XUẤT BẢN CA THI (PUBLISH) ] │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Xử lý sự kiện `UC-SESSION-PUBLISH`**:
  - Kiểm tra `exam.questions_count > 0` và `assigned_students > 0`.
  - Nếu thiếu điều kiện, hiển thị thông báo lỗi 409 Conflict rõ ràng: *"Đề thi chưa có câu hỏi hoặc ca thi chưa gán sinh viên nào."*

---

### 13. `SCR-TEA-07`: Giám sát Phòng thi Trực tiếp (Live Proctoring Console)
- **Route**: `app/(workspace)/teacher/sessions/[id]/monitor/page.tsx`
- **Actor**: `teacher` (Cán bộ coi thi), `admin`
- **Use Case**: `UC-TEACHER-07` (Giám sát phòng thi & thu thập sự kiện bất thường).
- **CSDL liên quan**: `exam_sessions`, `session_assignments`, `exam_attempts`, `proctoring_events`.
- **API Endpoints**: Polling định kỳ hoặc Server-Sent Events (SSE).
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔴 LIVE MONITORING | Ca thi: Lập trình Web - K21       [ Cập nhật: 08:42:15 ]│
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─ CHỈ SỐ CA THI (KPI CARDS) ─────────────────────────────────────────────┐ │
│ │ Được gán: 45 │ Đang làm bài: 38 │ Đã nộp: 05 │ Chưa vào: 02 │ Cảnh báo: 4│ │
│ └──────────────┴──────────────────┴────────────┴──────────────┴────────────┘ │
│                                                                             │
│ ┌─ DANH SÁCH THÍ SINH (70%) ──────────────────┐ ┌─ DÒNG SỰ KIỆN LIVE (30%) ┐│
│ │ Mã SV │ Họ và tên    │ Tiến độ │ T.gian│ T.Thái│ │ 08:41:02 - SV103       ││
│ │ SV101 │ Nguyễn Văn A │ 32/40   │ 18:20 │Đang thi│ │ ⚠ Rời tab màn hình     ││
│ │ SV102 │ Trần Thị B   │ 28/40   │ 18:20 │Đang thi│ │                        ││
│ │ SV103 │ Lê Hoàng C   │ 12/40   │ 18:20 │⚠ Mất KN│ │ 08:40:15 - SV104       ││
│ │ SV104 │ Phạm Minh D  │ 40/40   │ --:-- │✓ Đã nộp│ │ ✓ Nộp bài thành công   ││
│ │ SV105 │ Đỗ Gia H     │ 00/40   │ --:-- │Chưa vào│ │                        ││
│ │                                             │ │ 08:38:50 - SV101       ││
│ │ Hành động: [ Xem chi tiết ] [ Đóng ca thi ] │ │ ⚠ Thoát Fullscreen     ││
│ └─────────────────────────────────────────────┘ └──────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Xử lý An ninh & Proctoring Policy**:
  - Không tự ý hủy bài thi của thí sinh chỉ vì 1 sự kiện `tab_hidden` (có thể do notification hệ điều hành).
  - Giám thị có thể gắn cờ `Flagged for Review` để đối chiếu sau khi ca thi kết thúc.

---

### 14. `SCR-TEA-08`: Báo cáo & Phổ điểm Ca thi (Scoreboard & Analytics)
- **Route**: `app/(workspace)/teacher/sessions/[id]/results/page.tsx`
- **Actor**: `teacher`, `admin`
- **Use Case**: `UC-TEACHER-07`
- **API Endpoint**: `GET /api/v1/exam-sessions/{id}/results`
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ BÁO CÁO KẾT QUẢ & PHỔ ĐIỂM CA THI: IT4409-K21-GK         [ Xuất file Excel ]│
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─ TỔNG QUAN PHỔ ĐIỂM ────────────────────────────────────────────────────┐ │
│ │ Tổng số thí sinh dự thi: 43 / 45 (95.5%)                                │ │
│ │ Điểm trung bình: 7.42  •  Điểm trung vị: 7.50  •  Độ lệch chuẩn: 1.15   │ │
│ │ Điểm cao nhất: 9.75    •  Điểm thấp nhất: 4.25 •  Tỷ lệ Đạt: 93.0%      │ │
│ │                                                                         │ │
│ │ Biểu đồ phổ điểm:                                                       │ │
│ │ [ 0-2đ: 0 ] [ 2-4đ: 0 ] [ 4-6đ: 5 ] [ 6-8đ: 22 ] [ 8-10đ: 16 ]          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─ BẢNG ĐIỂM CHI TIẾT TỪNG THÍ SINH ──────────────────────────────────────┐ │
│ │ STT │ Mã SV │ Họ và tên    │ Điểm số │ T.gian làm │ Số cảnh báo │ Xếp loại│ │
│ │ 01  │ SV101 │ Nguyễn Văn A │ 8.75    │ 52 phút    │ 01          │ Giỏi    │ │
│ │ 02  │ SV104 │ Phạm Minh D  │ 9.50    │ 48 phút    │ 00          │ Xuất sắc│ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ PHÂN HỆ 4: QUẢN TRỊ VIÊN (ADMIN WORKSPACE)

### 15. `SCR-ADM-01`: Tổng quan Quản trị Hệ thống (Admin Overview)
- **Route**: `app/(workspace)/admin/page.tsx` $\rightarrow$ `/admin`
- **Actor**: `admin`
- **Use Case**: `UC-ADMIN-02`
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo Mark] ThiSmart | Quản trị Toàn trường        [🔔] Quản trị viên Cấp cao│
├─────────────┬───────────────────────────────────────────────────────────────┤
│ ❖ Tổng quan │ BẢNG ĐIỀU KHIỂN HỆ THỐNG                                      │
│ 👥 Người dùng│                                                               │
│ 📚 Môn & Đề │ ┌─ CHỈ SỐ TOÀN TRƯỜNG ──────────────────────────────────────┐ │
│ 📅 Ca thi   │ │ [ 1,450 ] Sinh viên    │ [ 85 ] Giảng viên                │ │
│ 📜 Audit Log│ │ [ 32 ] Ca thi tuần này │ [ 99.98% ] Tỷ lệ API Uptime      │ │
│ ⚙ Cài đặt   │ └────────────────────────┴──────────────────────────────────┘ │
│             │                                                               │
│             │ ┌─ CẢNH BÁO TẢI CA THI & HỆ THỐNG ──────────────────────────┐ │
│             │ │ • Khung giờ 08:00 - 10:00 ngày mai có 4 ca thi đồng thời   │ │
│             │ │   (Dự kiến 650 thí sinh truy cập đồng thời).                │ │
│             │ │ • Khuyến nghị: Duy trì tối thiểu 4 PHP-FPM Workers.         │ │
│             │ └───────────────────────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────────────────────┘
```

---

### 16. `SCR-ADM-02`: Quản trị Người dùng & Vai trò (User Management & RBAC)
- **Route**: `app/(workspace)/admin/users/page.tsx`
- **Actor**: `admin`
- **Use Case**: `UC-ADMIN-01`
- **CSDL liên quan**: `users(id, name, email, role, is_active)`.
- **API Endpoints**: `GET /api/v1/users`, `POST /api/v1/users`, `PATCH /api/v1/users/{id}`
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Quản trị Người dùng                 [ + Tạo tài khoản mới ]     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🔍 [ Tìm theo tên, email...         ] Lọc Vai trò: [ Tất cả (Admin/GV/SV) ▼]│
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Tên người dùng        │ Email                  │ Vai trò  │ Trạng thái  │ │
│ │ TS. Trần Minh Khoa    │ khoatm@university.edu  │ Teacher  │ [Hoạt động] │ │
│ │ Nguyễn Văn A          │ sv101@student.edu.vn   │ Student  │ [Hoạt động] │ │
│ │ Lê Hoàng Long         │ longlh@university.edu  │ Admin    │ [Hoạt động] │ │
│ │ Đỗ Gia Hưng           │ sv105@student.edu.vn   │ Student  │ [Tạm khóa]  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ Hành động trên dòng: [ ✏ Phân vai trò ] [ 🔄 Đặt lại MK ] [ 🚫 Khóa/Mở ]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 17. `SCR-ADM-03`: Nhật ký Kiểm toán & Thanh tra An ninh (System Audit Logs)
- **Route**: `app/(workspace)/admin/audit-logs/page.tsx`
- **Actor**: `admin`
- **Use Case**: `UC-ADMIN-02`
- **CSDL & API**: `proctoring_events`, API request audit logs.
- **Wireframe Bố cục**:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Nhật ký Kiểm toán & Giám sát An ninh       [ Xuất Log Audit ]   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🔍 [ Lọc theo IP, Người thao tác, Hành động... ] [ Mức độ: Tất cả ▼ ]       │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Thời gian       │ Tác nhân     │ Hành động        │ Chi tiết / IP       │ │
│ │ 08:52:14 17/10  │ SV101        │ Submit Attempt   │ Attempt #842 (200OK)│ │
│ │ 08:41:02 17/10  │ SV103        │ Sensor Alert     │ tab_hidden (Medium) │ │
│ │ 08:15:30 17/10  │ Teacher_Khoa │ Publish Session  │ Session #12 (200OK) │ │
│ │ 08:00:10 17/10  │ Admin_Long   │ Change User Role │ User #45 -> Teacher │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 HỆ THỐNG THIẾT KẾ & QUY CHUẨN TRẢI NGHIỆM (DESIGN SYSTEM & UX CONSTRAINTS)

### 1. Bảng màu Semantic Tokens (Tailwind Palette)
- **Chủ đạo (Primary)**: `#2563EB` (Blue 600) — Đại diện cho môi trường học thuật, tin cậy.
- **Nền ứng dụng (App Background)**: `#F8FAFC` (Slate 50) — Giảm mỏi mắt khi làm bài thi dài.
- **Thành phần bề mặt (Surfaces)**: `#FFFFFF` (White Card), Border `#E2E8F0` (Slate 200).
- **Trạng thái Thành công (Success/Saved)**: `#15803D` (Green 700), Nền `#F0FDF4`.
- **Cảnh báo (Warning/Caution)**: `#B45309` (Amber 700), Nền `#FFFBEB`.
- **Nguy hiểm / Bất thường (Danger/Expired)**: `#B91C1C` (Red 700), Nền `#FEF2F2`.

### 2. Nguyên tắc An toàn Dữ liệu Phòng thi (Zero-Leakage & Reliability)
1. **Tuyệt đối không rò rỉ đáp án**: Khi thí sinh làm bài tại `SCR-STU-03`, API trả về qua `QuestionStudentResource` tuyệt đối không chứa `correct_answer`, `explanation` hay điểm từng câu.
2. **Đồng hồ chuẩn Server (Server-Authoritative Clock)**:
   - `deadline = min(started_at + duration_minutes, session.end_at)`.
   - Client tính khoảng đếm ngược dựa trên độ lệch giữa `Date.now()` và `serverNow` gửi kèm trong response ban đầu.
3. **Chống mất dữ liệu (Autosave & Offline Queue)**:
   - Mọi thay đổi đáp án được gửi với cơ chế **Debounce 500ms**.
   - Nếu mất mạng, câu trả lời lưu vào hàng đợi in-memory/localStorage tạm thời; hiển thị thanh cảnh báo mất kết nối và tự động đồng bộ lại ngay khi mạng có trở lại trước khi cho phép nộp bài.
4. **Phòng chống Double Submit**:
   - Header `Idempotency-Key` được sinh ngẫu nhiên khi vào trang thi và gửi kèm request Submit.
   - Nút nộp bài tự động disable và hiển thị Spinner ngay khi click.
