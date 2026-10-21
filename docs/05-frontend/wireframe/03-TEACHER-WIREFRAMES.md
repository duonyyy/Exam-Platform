# 👨‍🏫 Phân Hệ Giảng Viên: Hồ Sơ Wireframe (03-TEACHER-WIREFRAMES)

**Dự án**: ThiSmart (Exam Platform)  
**Đường dẫn**: `docs/05-frontend/wireframe/03-TEACHER-WIREFRAMES.md`  
**Thương hiệu & Bản sắc**: **ThiSmart Concept 03 — Minimal Tech / Modern EdTech** (Chi tiết: [`THISMART_BRAND_GUIDELINES.md`](../THISMART_BRAND_GUIDELINES.md))  
**Slogan**: *Thi thông minh. Đánh giá chính xác.*  
**Nhóm màn hình**: Nghiệp vụ Quản trị Học thuật, Soạn thảo Đề thi & Giám sát Phòng thi (Teacher Workspace)  
**Tài liệu liên quan**:
- Backend API: [`/api/v1/subjects`](../../03-architecture-api/12-API_DESIGN.md), [`/api/v1/questions`](../../03-architecture-api/12-API_DESIGN.md), [`/api/v1/exams`](../../03-architecture-api/12-API_DESIGN.md), [`/api/v1/exam-sessions`](../../03-architecture-api/12-API_DESIGN.md)
- Cơ sở dữ liệu: [`subjects`](../../02-domain-database/09-DATABASE_DESIGN.md), [`topics`](../../02-domain-database/09-DATABASE_DESIGN.md), [`questions`](../../02-domain-database/09-DATABASE_DESIGN.md), [`exams`](../../02-domain-database/09-DATABASE_DESIGN.md), [`exam_questions`](../../02-domain-database/09-DATABASE_DESIGN.md), [`exam_sessions`](../../02-domain-database/09-DATABASE_DESIGN.md), [`session_assignments`](../../02-domain-database/09-DATABASE_DESIGN.md), [`session_teachers`](../../02-domain-database/09-DATABASE_DESIGN.md)

---

## 1. `SCR-TEA-01`: Bảng Điều Khiển Giảng Viên (Teacher Dashboard)

### 1.1. Thông Tin Chung
- **Đường dẫn URL**: `/teacher` (Tệp: `app/(workspace)/teacher/page.tsx`)
- **Actor sử dụng**: `teacher`, `admin`
- **Mục tiêu**: Cung cấp cái nhìn tổng quan về khối lượng học thuật (môn học, câu hỏi, đề thi) và các ca thi đang diễn ra cần giám sát trực tiếp.

### 1.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo Mark] ThiSmart | Giảng viên                  [🔍 Tìm nhanh...]   [🔔 3] TS. Trần Minh Khoa│
├─────────────┬───────────────────────────────────────────────────────────────────────────────┤
│ ❖ Tổng quan │ Workspace / Tổng quan Giảng viên                                              │
│ 📚 Môn học  │                                                                               │
│ ❓ Câu hỏi  │ ┌─ THỐNG KÊ HỌC THUẬT & CA THI (KPI CARDS) ─────────────────────────────────┐ │
│ 📝 Đề thi   │ │ [ 03 ] Môn học phụ trách   │ [ 240 ] Câu hỏi trong kho                    │ │
│ 📅 Ca thi   │ │ [ 02 ] Ca thi đang mở      │ [ 128 ] Thí sinh đang làm bài                │ │
│ 👥 Giám sát │ └────────────────────────────┴──────────────────────────────────────────────┘ │
│ 📊 Bảng điểm│                                                                               │
│             │ ╔═══════════════════════════════════════════════════════════════════════════╗ │
│             │ ║ 🔴 CA THI ĐANG DIỄN RA TRỰC TIẾP (LIVE MONITORING)                         ║ │
│             │ ║ Ca thi: Kiểm tra Giữa kỳ - Lập trình Web K21 (IT4409)                     ║ │
│             │ ║ Khung giờ: 08:00 - 09:30 • Phòng thi ảo: EX-2026-012 • Giám thị: Bạn       ║ │
│             │ ║ Thí sinh: 42/45 đã vào • Đang làm bài: 38 • Đã nộp: 04 • Cảnh báo: 02      ║ │
│             │ ║                                                                           ║ │
│             │ ║ [  🔴 VÀO BẢNG ĐIỀU KHIỂN GIÁM SÁT TRỰC TIẾP (SCR-TEA-07)  ]              ║ │
│             │ ╚═══════════════════════════════════════════════════════════════════════════╝ │
│             │                                                                               │
│             │ ┌─ HOẠT ĐỘNG HỌC THUẬT GẦN ĐÂY ─────────────────────────────────────────────┐ │
│             │ │ • 10:15 - Bạn vừa thêm 15 câu hỏi mới vào Chủ đề "RESTful Security".      │ │
│             │ │ • 08:00 - Ca thi IT4409 đã tự động mở theo lịch trình xuất bản.            │ │
│             │ │ • Hôm qua - Đề thi mẫu "Cuối kỳ CSDL Phân tán" đã hoàn thành 50 câu.       │ │
│             │ └───────────────────────────────────────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. `SCR-TEA-02`: Quản Lý Môn Học & Chủ Đề (Subjects & Topics)

### 2.1. Thông Tin Chung
- **Đường dẫn URL**: `/teacher/subjects` (Tệp: `app/(workspace)/teacher/subjects/page.tsx`)
- **Use Case liên kết**: `UC-TEACHER-01`
- **CSDL liên quan**: `subjects(code, name, owner_teacher_id)`, `topics(subject_id, name, description)`.
- **API**: `GET/POST/PATCH /api/v1/subjects`, `GET/POST /api/v1/subjects/{id}/topics`.

### 2.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Quản lý Môn học & Chủ đề                         [ + Tạo Môn học mới (Admin/GV) ]│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔍 [ Tìm theo mã môn, tên môn...              ] Lọc: [ Môn tôi phụ trách ▼ ]                │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─ MÔN HỌC #01: IT4409 — LẬP TRÌNH WEB NÂNG CAO [Giảng viên phụ trách: TS. Trần Minh Khoa] ┐│
│ │ Mã môn: IT4409 • Người tạo: KhoaTM • Trạng thái: Đang hoạt động                          │
│ │ Mô tả: Kiến trúc RESTful, Eloquent ORM, Microservices, Bảo mật OWASP và Next.js.         │
│ │ Quy mô: 04 Chủ đề kiến thức • 240 Câu hỏi ngân hàng • 03 Đề thi mẫu                      │
│ │                                                                                          │
│ │ ┌─ DANH SÁCH CHỦ ĐỀ KIẾN THỨC (TOPICS TREE) ───────────────────────────────────────────┐│
│ │ │ 1. Giao thức HTTP/1.1, HTTP/2 & REST Architecture     (52 câu hỏi) [Sửa] [Thêm câu]   ││
│ │ │ 2. Cơ sở dữ liệu PostgreSQL & Eloquent Concurrency    (68 câu hỏi) [Sửa] [Thêm câu]   ││
│ │ │ 3. Xác thực Sanctum Token & Kiểm soát RBAC/PBAC       (45 câu hỏi) [Sửa] [Thêm câu]   ││
│ │ │ 4. Phòng chống OWASP Top 10 & API Security            (75 câu hỏi) [Sửa] [Thêm câu]   ││
│ │ └───────────────────────────────────────────────────────────────────────────────────────┘│
│ │                                                                                          │
│ │ Hành động: [ + Thêm Chủ đề mới vào Môn ]   [ ✏ Sửa thông tin môn ]   [ 🗑 Xóa môn rỗng ] │
│ └──────────────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. `SCR-TEA-03`: Ngân Hàng Câu Hỏi (Question Bank)

### 3.1. Thông Tin Chung
- **Đường dẫn URL**: `/teacher/questions`
- **Use Cases**: `UC-TEACHER-02` (Soạn thảo), `UC-TEACHER-03` (Sửa/Vô hiệu hóa).
- **CSDL liên quan**: `questions(topic_id, question_text, question_type, difficulty, status)`.
- **API**: `GET /api/v1/questions`, `PATCH /api/v1/questions/{id}/status`.

### 3.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Ngân hàng Câu hỏi                                     [ + Soạn câu hỏi mới ]    │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHUNG LỌC ĐA TIÊU CHÍ (MULTI-FILTER BAR):                                                   │
│ Môn: [ Lập trình Web ▼ ]  Chủ đề: [ Tất cả chủ đề ▼ ]  Loại câu: [ Tất cả loại câu ▼ ]     │
│ Độ khó: [ Tất cả ▼ ]      Trạng thái: [ Ready (Sẵn sàng) ▼ ]    🔍 [ Nhập từ khóa câu hỏi...]│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ DANH SÁCH CÂU HỎI (Tổng: 240 câu • Hiển thị 1-20):                                          │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [✓] CÂU HỎI #1042 • Môn: Lập trình Web • Chủ đề: HTTP/REST Architecture                 │ │
│ │ "Trong HTTP, mã trạng thái 204 No Content có ý nghĩa gì đối với Client?"                │ │
│ │ Loại: single_choice | Độ khó: [Dễ] | Trạng thái: [Badge Xanh: READY]                    │ │
│ │ Đáp án đúng: A. Yêu cầu đã thành công nhưng không có nội dung trả về trong Body.        │ │
│ │ Liên kết đề thi: Đã gắn trong 02 Đề thi mẫu [🔒 Khóa sửa nội dung]                      │ │
│ │ Hành động: [ 👁 Xem trước ] [ ✏ Sửa (Disabled) ] [ 🚫 Vô hiệu hóa (Disabled) ]          │ │
│ ├─────────────────────────────────────────────────────────────────────────────────────────┤ │
│ │ [ ] CÂU HỎI #1045 • Môn: Lập trình Web • Chủ đề: CSDL Concurrency                       │ │
│ │ "Câu lệnh nào trong PostgreSQL dùng để khóa độc quyền dòng ngăn chặn Double Submit?"    │ │
│ │ Loại: single_choice | Độ khó: [Khó] | Trạng thái: [Badge Xanh: READY]                   │ │
│ │ Đáp án đúng: B. SELECT ... FOR UPDATE                                                   │ │
│ │ Liên kết đề thi: Chưa gắn vào đề nào [Tự do chỉnh sửa]                                  │ │
│ │ Hành động: [ 👁 Xem trước ] [ ✏ Sửa câu hỏi ] [ 🚫 Tắt (Chuyển sang Disabled) ]          │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│ [ ◀ Trang trước ]                       Trang 1 / 12                        [ Trang sau ▶ ] │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. `SCR-TEA-04`: Soạn Thảo & Biên Tập Câu Hỏi (Question Editor)

### 4.1. Thông Tin Chung
- **Đường dẫn URL**: `/teacher/questions/new` và `/teacher/questions/[id]/edit`
- **Hỗ trợ 4 loại câu hỏi**: `single_choice`, `multiple_choice`, `true_false`, `short_answer`.
- **API**: `POST /api/v1/questions` (Tạo mới), `PUT /api/v1/questions/{id}` (Cập nhật toàn bộ).

### 4.2. Wireframe Bố Cục Desktop (1440px - Chia 2 Cột Đối Xứng)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ ← Quay lại Ngân hàng câu ] Soạn thảo Câu hỏi Mới                  [ 💾 Lưu vào Ngân hàng ]│
├────────────────────────────────────────┬────────────────────────────────────────────────────┤
│ ┌─ THIẾT LẬP DỮ LIỆU ĐẦU VÀO (50%) ───┐│ ┌─ XEM TRƯỚC THỜI GIAN THỰC (LIVE PREVIEW - 50%) ┐│
│ │ Môn học:   [ Lập trình Web        ▼]││                                                    │
│ │ Chủ đề:    [ HTTP & REST          ▼]││ CÂU HỎI TRẮC NGHIỆM ĐƠN LỰA CHỌN                   │
│ │ Độ khó:    (●) Dễ  ( ) T.Bình  ( )Khó││ Độ khó: Dễ  •  Chủ đề: HTTP & REST               │
│ │ Định dạng: [ Trắc nghiệm 1 đáp án ▼]││                                                    │
│ │                                     ││ "Trong giao thức HTTP/1.1, phương thức nào sau     │
│ │ Nội dung câu hỏi (Hỗ trợ Markdown): ││  đây mang tính chất An toàn (Safe Method)?"        │
│ │ [ Trong giao thức HTTP/1.1, phương ]││                                                    │
│ │ [ thức nào sau đây mang tính chất  ]││ ( ) A. POST                                        │
│ │ [ An toàn (Safe Method)?           ]││ (●) B. GET             [✓ Đáp án đúng - Giáo viên] │
│ │                                     ││ ( ) C. PUT                                         │
│ │ Danh sách Phương án Lựa chọn:       ││ ( ) D. DELETE                                      │
│ │ ( ) A. [ POST                     ] ││                                                    │
│ │ (●) B. [ GET                      ] ││ 💡 Lời giải thích:                                 │
│ │ ( ) C. [ PUT                      ] ││ Phương thức GET chỉ đọc tài nguyên và không làm    │
│ │ ( ) D. [ DELETE                   ] ││ thay đổi trạng thái của hệ thống máy chủ.          │
│ │ [ + Thêm phương án E ]              ││                                                    │
│ │                                     ││                                                    │
│ │ Giải thích đáp án (Explanation):    ││                                                    │
│ │ [ Phương thức GET chỉ đọc dữ liệu..]││                                                    │
│ └─────────────────────────────────────┘└────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. `SCR-TEA-05`: Thiết Kế Đề Thi Mẫu & Gán Câu Hỏi (Exam Assembler)

### 5.1. Thông Tin Chung
- **Đường dẫn URL**: `/teacher/exams/[id]/edit`
- **Use Case liên kết**: `UC-TEACHER-04`
- **CSDL liên quan**: `exams(title, duration_minutes, total_points, shuffle_questions)`, `exam_questions(exam_id, question_id, order, points)`.

### 5.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ ← Danh sách đề ] Thiết kế Đề thi: Kiểm tra Giữa kỳ - Web K21        [ 💾 Lưu cấu hình đề ]│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─ THÔNG SỐ ĐỀ THI MẪU (EXAM BLUEPRINT) ──────────────────────────────────────────────────┐ │
│ │ Tên đề: [ Đề thi số 1 - Kiểm tra Giữa kỳ Lập trình Web                      ]           │ │
│ │ Môn: Lập trình Web • Thời lượng: [ 60 ] phút • Điểm sàn đạt: [ 5.0 ] / 10.0             │ │
│ │ [X] Xáo trộn thứ tự câu hỏi (Shuffle Questions)  •  [X] Xáo trộn phương án (Options)    │ │
│ │ TỔNG SỐ CÂU: 40 câu  •  TỔNG ĐIỂM TÍCH LŨY: [ 10.0 / 10.0 ] (Hợp lệ)                    │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ ┌─ CÂU HỎI TRONG ĐỀ THI (40 CÂU) ──────────────────────┐ ┌─ NGÂN HÀNG CÂU HỎI (CHỌN THÊM) ─┐│
│ │ STT │ Mã câu │ Nội dung tóm tắt            │ Điểm số │ │ Lọc chủ đề: [ Tất cả chủ đề  ▼] ││
│ │ 01  │ #1042  │ Mã trạng thái 204 No Content│ [0.25]  │ │                                 ││
│ │ 02  │ #1045  │ SELECT ... FOR UPDATE       │ [0.25]  │ │ Câu #1105: CSRF Token bảo vệ gì?││
│ │ 03  │ #1089  │ Sanctum Bearer Token Auth   │ [0.25]  │ │ [ + Gán vào đề thi (0.25đ) ]    ││
│ │ ... │ ...    │ ...                         │ ...     │ │                                 ││
│ │ 40  │ #1210  │ Thuật toán tính điểm        │ [0.25]  │ │ Câu #1108: So sánh 3NF và BCNF  ││
│ │                                                      │ │ [ + Gán vào đề thi (0.25đ) ]    ││
│ │ [ ↕ Kéo thả đổi thứ tự ]       [ 🗑 Gỡ khỏi đề thi ] │ │                                 ││
│ └──────────────────────────────────────────────────────┘ └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. `SCR-TEA-06`: Quản Lý Ca Thi & Phân Công Thí Sinh (Exam Sessions)

### 6.1. Thông Tin Chung
- **Đường dẫn URL**: `/teacher/sessions/[id]/edit`
- **Use Cases**: `UC-TEACHER-05` (Lập lịch & Gán thí sinh), `UC-SESSION-PUBLISH` (Xuất bản ca thi).
- **CSDL liên quan**: `exam_sessions`, `session_assignments`, `session_teachers`.

### 6.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Lập lịch Ca thi: IT4409-GK-2026                      Trạng thái: [Badge: DRAFT] │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─ CẤU HÌNH KHUNG GIỜ VÀ ĐỀ THI ──────────────────────────────────────────────────────────┐ │
│ │ Tên ca thi: [ Ca thi Đợt 1 - Sáng Thứ Bảy (Lớp K21 CNTT)                               ]│ │
│ │ Chọn đề thi: [ Đề thi số 1 - Kiểm tra Giữa kỳ Web (40 câu - 60 phút)                  ▼]│ │
│ │ Thời gian mở (start_at): [ 2026-10-25 08:00:00 ] • Đóng (end_at): [ 2026-10-25 09:30:00]│ │
│ │ Cho phép đến muộn: [ 15 ] phút • Số lần thi tối đa: [ 01 ] lần                           │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ ┌─ PHÂN CÔNG THÍ SINH (DANH SÁCH: 45 SINH VIÊN) ──────────────────────────────────────────┐ │
│ │ [ 📥 Nhập danh sách từ Excel (.xlsx) ]   [ + Thêm từng sinh viên theo Mã định danh ]     │ │
│ │ Danh sách hiện tại: 21020015 (Nguyễn Văn A), 21020016 (Trần Thị B), 21020017 (Lê C)...  │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ ┌─ CÁN BỘ COI THI (GIÁM THỊ: 02 GIẢNG VIÊN) ──────────────────────────────────────────────┐ │
│ │ 1. TS. Trần Minh Khoa (Trưởng ca thi)    2. ThS. Đỗ Hoàng Long (Cán bộ giám sát)        │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ [ Lưu bản nháp (Draft) ]                           [ 🚀 XUẤT BẢN CA THI (PUBLISH SESSION) ]│
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. `SCR-TEA-07`: Giám Sát Phòng Thi Trực Tiếp (Live Proctoring Console)

### 7.1. Thông Tin Chung
- **Đường dẫn URL**: `/teacher/sessions/[id]/monitor`
- **Use Case**: `UC-TEACHER-07` (Giám sát phòng thi thời gian thực).
- **Mục tiêu**: Theo dõi tiến độ làm bài, tiếp nhận tín hiệu cảm biến trình duyệt (chuyển tab, thoát fullscreen, mất mạng) và đóng ca thi khẩn cấp nếu cần.

### 7.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔴 PHÒNG GIÁM SÁT TRỰC TIẾP | Ca thi: IT4409-GK-2026                 [ Đồng bộ: 08:42:15 ]  │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─ CHỈ SỐ CA THI THỜI GIAN THỰC (REALTIME KPI) ───────────────────────────────────────────┐ │
│ │ Được gán: 45 │ Đang làm bài: 38 │ Đã nộp bài: 05 │ Chưa vào thi: 02 │ CẢNH BÁO BẤT THƯỜNG: 4│ │
│ └──────────────┴──────────────────┴────────────────┴──────────────────┴───────────────────┘ │
│                                                                                             │
│ ┌─ DANH SÁCH THÍ SINH (70%) ──────────────────┐ ┌─ DÒNG TÍN HIỆU SỰ KIỆN LIVE (30%) ───────┐│
│ │ Mã SV │ Họ và tên    │ Tiến độ │ T.gian│ T.Thái│ │ 08:41:02 - SV103 (Lê Hoàng C)          ││
│ │ SV101 │ Nguyễn Văn A │ 32/40   │ 18:20 │Đang thi│ │ ⚠ Rời tab thi (tab_hidden - Medium)    ││
│ │ SV102 │ Trần Thị B   │ 28/40   │ 18:20 │Đang thi│ │                                        ││
│ │ SV103 │ Lê Hoàng C   │ 12/40   │ 18:20 │⚠ Mất KN│ │ 08:40:15 - SV104 (Phạm Minh D)         ││
│ │ SV104 │ Phạm Minh D  │ 40/40   │ --:-- │✓ Đã nộp│ │ ✓ Đã nộp bài (Điểm số: 9.50)           ││
│ │ SV105 │ Đỗ Gia H     │ 00/40   │ --:-- │Chưa vào│ │                                        ││
│ │                                             │ │ 08:38:50 - SV101 (Nguyễn Văn A)        ││
│ │ [ 🔔 Gửi thông báo đến cả phòng thi ]       │ │ ⚠ Thoát Fullscreen (fullscreen_exit)   ││
│ │ [ 🛑 KẾT THÚC VÀ ĐÓNG CA THI NÀY ]          │ │                                        ││
│ └─────────────────────────────────────────────┘ └──────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. `SCR-TEA-08`: Báo Cáo Điểm Số & Phổ Điểm Ca Thi (Session Analytics)

### 8.1. Thông Tin Chung
- **Đường dẫn URL**: `/teacher/sessions/[id]/results`
- **Use Case**: `UC-TEACHER-07`
- **Mục tiêu**: Thống kê phổ điểm, độ lệch chuẩn, câu hỏi phân hóa và xuất bảng điểm chính thức phục vụ phòng đào tạo.

### 8.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Workspace / Báo cáo Kết quả: IT4409-GK-2026                      [ 📥 Xuất bảng điểm Excel ]│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─ CHỈ SỐ THỐNG KÊ TOÀN CA THI ───────────────────────────────────────────────────────────┐ │
│ │ • Tổng số thí sinh dự thi: 43 / 45 (95.5%)     • Điểm trung bình: 7.42 / 10.0           │ │
│ │ • Điểm cao nhất: 9.75  • Điểm thấp nhất: 4.25  • Điểm trung vị:   7.50                  │ │
│ │ • Tỷ lệ Đạt yêu cầu (>= 5.0đ): 40/43 (93.0%)   • Độ lệch chuẩn:   1.15                  │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ ┌─ BIỂU ĐỒ PHỔ ĐIỂM (SCORE DISTRIBUTION HISTOGRAM) ───────────────────────────────────────┐ │
│ │  Số lượng SV                                                                            │ │
│ │   25 ┤                                  ┌─────┐                                         │ │
│ │   20 ┤                                  │     │                                         │ │
│ │   15 ┤                            ┌─────┤     │                                         │ │
│ │   10 ┤                            │     │     │                                         │ │
│ │    5 ┤                      ┌─────┤     │     │                                         │ │
│ │    0 ┴──────────┬───────────┴─────┴─────┴─────┴───────────                              │ │
│ │        0.0 - 2.0   2.1 - 4.0   4.1 - 6.0   6.1 - 8.0   8.1 - 10.0                       │ │
│ │        (0 sinh viên) (0 SV)    (5 SV)      (22 SV)     (16 SV)                          │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ ┌─ BẢNG ĐIỂM CHI TIẾT TỪNG THÍ SINH ──────────────────────────────────────────────────────┐ │
│ │ STT │ Mã SV │ Họ và tên sinh viên │ Điểm số │ Thời gian làm │ Số cảnh báo │ Xếp loại    │ │
│ │ 01  │ SV101 │ Nguyễn Văn A        │ 8.75    │ 52 phút       │ 01          │ Giỏi        │ │
│ │ 02  │ SV104 │ Phạm Minh D         │ 9.50    │ 48 phút       │ 00          │ Xuất sắc    │ │
│ │ 03  │ SV102 │ Trần Thị B          │ 7.25    │ 58 phút       │ 00          │ Khá         │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```
