# 🎓 Phân Hệ Thí Sinh: Hồ Sơ Wireframe (02-STUDENT-WIREFRAMES)

**Dự án**: ThiSmart (Exam Platform)  
**Đường dẫn**: `docs/05-frontend/wireframe/02-STUDENT-WIREFRAMES.md`  
**Thương hiệu & Bản sắc**: **ThiSmart Concept 03 — Minimal Tech / Modern EdTech** (Chi tiết: [`THISMART_BRAND_GUIDELINES.md`](../THISMART_BRAND_GUIDELINES.md))  
**Slogan**: *Thi thông minh. Đánh giá chính xác.*  
**Nhóm màn hình**: Trải nghiệm Sinh viên (Student Portal & Exam Workflow)  
**Tài liệu liên quan**:
- Backend API: [`GET /api/v1/student/assigned-sessions`](../../03-architecture-api/12-API_DESIGN.md), `POST /api/v1/exam-sessions/{id}/attempts`, `POST /api/v1/exam-attempts/{id}/submit`
- Cơ sở dữ liệu: [`session_assignments`](../../02-domain-database/09-DATABASE_DESIGN.md), [`exam_sessions`](../../02-domain-database/09-DATABASE_DESIGN.md), [`exams`](../../02-domain-database/09-DATABASE_DESIGN.md), [`exam_attempts`](../../02-domain-database/09-DATABASE_DESIGN.md)

---

## 1. `SCR-STU-01`: Danh Sách Ca Thi Của Tôi (My Assigned Exams)

### 1.1. Thông Tin Chung
- **Đường dẫn URL**: `/student/exams` (Tệp: `app/(workspace)/student/exams/page.tsx`)
- **Actor sử dụng**: `student`
- **Use Case liên kết**: `UC-STUDENT-01` (Xem danh sách ca thi được gán).
- **Mục tiêu**: Cung cấp cái nhìn trực quan về tất cả các ca thi mà thí sinh được quyền tham gia, trạng thái thời gian thực, đồng hồ đếm ngược và cổng vào thi.

### 1.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo Mark] ThiSmart | Sinh viên                         [🔍 Tìm kiếm]  [🔔 2] [Avatar] SV101│
├─────────────┬───────────────────────────────────────────────────────────────────────────────┤
│ ❖ Tổng quan │ Workspace / Ca thi của tôi                                                    │
│ 📅 Ca thi   │                                                                               │
│ 📊 Kết quả  │ ╔═══════════════════════════════════════════════════════════════════════════╗ │
│ ⚙ Cài đặt   │ ║ 🔴 CA THI ĐANG MỞ — BẮT ĐẦU NGAY BÂY GIỜ!                                  ║ │
│             │ ║ Môn: Lập trình Web nâng cao (IT4409) — Giữa kỳ K21                          ║ │
│             │ ║ Khung giờ: 08:00 - 09:30 (Hôm nay) • Thời lượng: 60 phút • Đề thi: 40 câu  ║ │
│             │ ║ Giảng viên phụ trách: TS. Trần Minh Khoa • Hạn chót vào thi: 08:15          ║ │
│             │ ║                                                                             ║ │
│             │ ║ [  🚀 VÀO PHÒNG THI NGAY (Primary CTA)  ]    [ Xem hướng dẫn phòng thi ]    ║ │
│             │ ╚═══════════════════════════════════════════════════════════════════════════╝ │
│             │                                                                               │
│             │ [ Tab: Sắp diễn ra (2) ]  [ Tab: Đang mở (1) ]  [ Tab: Đã hoàn thành (4) ]     │
│             │                                                                               │
│             │ ┌─ CARD CA THI SẮP TỚI ─────────────────────────────────────────────────────┐ │
│             │ │ Môn: Cấu trúc Dữ liệu & Giải thuật (CS201)         [Badge: Mở sau 2 ngày] │ │
│             │ │ Ca thi: Đợt 1 - Học kỳ II 2026 • Đề thi: Trắc nghiệm 50 câu (90 phút)     │ │
│             │ │ Bắt đầu: 14:00, Thứ Tư ngày 20/10/2026 • Kết thúc: 15:45                   │ │
│             │ │ Điểm sàn đạt: 5.0 / 10.0 • Hình thức: Giám sát toàn màn hình              │ │
│             │ │ [ Chi tiết & Điều kiện dự thi ]                                           │ │
│             │ └───────────────────────────────────────────────────────────────────────────┘ │
│             │ ┌─ CARD CA THI ĐÃ HOÀN THÀNH ───────────────────────────────────────────────┐ │
│             │ │ Môn: Cơ sở Dữ liệu Nâng cao (DB301)                [Badge: Đã nộp bài]    │ │
│             │ │ Nộp bài: 10:15 Ngày 12/10/2026 • Điểm số: 8.75 / 10.0 [Xếp loại: Giỏi]    │ │
│             │ │ [ Xem bảng điểm & Chi tiết bài thi ]                                      │ │
│             │ └───────────────────────────────────────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────────────────────────────────────┘
```

### 1.3. Trạng Thái Nút Bấm & Quy Tắc Khung Giờ (Time-Window Rules)
- **Chưa đến giờ thi (`now < start_at`)**: Nút hiển thị `Chưa mở` kèm bộ đếm ngược thời gian: `Mở sau 01 ngày 04 giờ`.
- **Trong giờ vào thi (`start_at <= now <= start_at + allow_late_minutes`)**: Nút chuyển sang màu xanh dương nổi bật `VÀO PHÒNG THI NGAY`.
- **Đến muộn quá hạn (`now > start_at + allow_late_minutes`)**: Nút bị disabled, chuyển sang màu xám kèm nhãn đỏ: `Đã quá thời gian cho phép vào thi`.
- **Đang làm dở (`status === 'in_progress'`)**: Nút hiển thị màu vàng cam `TIẾP TỤC BÀI THI DỞ DANG` (Hỗ trợ phục hồi sau sự cố mất điện/sập trình duyệt).
- **Đã nộp bài (`status === 'submitted'`)**: Nút hiển thị `Xem kết quả thi`.

---

## 2. `SCR-STU-02`: Chi Tiết Ca Thi & Kiểm Tra Điều Kiện (Pre-flight Checklist)

### 2.1. Thông Tin Chung
- **Đường dẫn URL**: `/student/exams/[id]/instructions`
- **Actor sử dụng**: `student`
- **Use Case**: `UC-ATTEMPT-START` (Khởi tạo phiên làm bài).
- **Mục tiêu**: Kiểm tra kỹ thuật thiết bị của thí sinh trước khi cấp phát lượt thi, tránh gián đoạn trong lúc làm bài.

### 2.2. Wireframe Bố Cục Desktop & Tablet
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ ← Quay lại danh sách ]                                              Nguyễn Văn A (SV101)  │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                          HƯỚNG DẪN & ĐIỀU KIỆN DỰ THI TRỰC TUYẾN                            │
│                 Môn thi: Lập trình Web nâng cao (IT4409) — Kỳ thi Giữa kỳ                   │
│                                                                                             │
│ ┌─ THÔNG SỐ CA THI ────────────────────────┐ ┌─ KIỂM TRA THIẾT BỊ DỰ THI (PRE-FLIGHT) ─────┐ │
│ │ • Thời lượng làm bài: 60 phút            │ │ [✓] Kết nối Internet: 25 Mbps (Ổn định)     │ │
│ │ • Số lượng câu hỏi: 40 câu trắc nghiệm   │ │ [✓] Trình duyệt: Chrome 128 (Được hỗ trợ)   │ │
│ │ • Điểm tối đa: 10.0 (Điểm sàn: 5.0)      │ │ [✓] Độ phân giải màn hình: 1920x1080 (Đạt)  │ │
│ │ • Số lần làm bài: 01 lần duy nhất        │ │ [✓] Đồng bộ đồng hồ máy chủ: Khớp (±0.2s)   │ │
│ │ • Hạn nộp bài muộn nhất: 09:30:00        │ │ [!] Lưu ý: Chế độ Toàn màn hình sẽ tự bật   │ │
│ └──────────────────────────────────────────┘ └─────────────────────────────────────────────┘ │
│                                                                                             │
│ ┌─ QUY CHẾ THI & CẢNH BÁO GIÁM SÁT AN NINH (PROCTORING CONSTRAINTS) ────────────────────────┐ │
│ │ 1. Bài thi được thực hiện trong chế độ Toàn màn hình (Fullscreen Focus Mode).             │ │
│ │ 2. Thí sinh KHÔNG ĐƯỢC: Chuyển tab, thu nhỏ trình duyệt, mở DevTools, kết nối màn hình phụ.│ │
│ │ 3. Mọi thao tác rời khỏi màn hình sẽ được hệ thống cảm biến tự động ghi nhận và gửi về   │ │
│ │    bảng giám sát của Giám thị theo thời gian thực (Real-time Audit Trail).                 │ │
│ │ 4. Đáp án được tự động lưu sau mỗi thao tác (Autosave). Khi hết giờ, bài thi sẽ tự nộp.  │ │
│ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ [X] Tôi xác nhận đã kiểm tra thiết bị, đọc kỹ nội quy và cam kết làm bài trung thực.         │
│                                                                                             │
│                   [  🚀 BẮT ĐẦU LÀM BÀI THI (Khởi tạo lượt thi)  ]                          │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.3. Luồng Sự Kiện Khởi Tạo Lượt Thi (Attempt Initialization Flow)
1. Thí sinh tích chọn checkbox cam kết $\rightarrow$ Nút "Bắt đầu làm bài thi" được kích hoạt.
2. Thí sinh click nút $\rightarrow$ Gọi API `POST /api/v1/exam-sessions/{id}/attempts`.
3. Backend kiểm tra điều kiện (xem có vi phạm số lần thi, có đúng sinh viên được phân công không).
4. Backend cấp `attempt_id`, trả về `remaining_seconds` và danh sách câu hỏi sạch (không lộ đáp án).
5. Frontend kích hoạt trình duyệt sang chế độ **Toàn màn hình (Request Fullscreen API)** và chuyển sang màn hình `SCR-STU-03`.

---

## 3. `SCR-STU-04`: Hộp Thoại Xác Nhận Nộp Bài & Biên Nhận (Submit Modal & Receipt)

### 3.1. Thông Tin Chung
- **Đường dẫn**: Hiển thị dưới dạng Modal hộp thoại đè trên màn hình phòng thi `SCR-STU-03`.
- **Actor sử dụng**: `student`
- **Use Case**: `UC-ATTEMPT-SUBMIT` (Nộp bài thi chính thức).

### 3.2. Wireframe Hộp Thoại Xác Nhận (Step 1: Confirmation Modal)
```text
┌─────────────────────────────────────────────────────────────┐
│                 [Icon Gửi Bài] XÁC NHẬN NỘP BÀI THI         │
│                                                             │
│  Bạn có chắc chắn muốn kết thúc và nộp bài thi ngay bây giờ?│
│  Sau khi xác nhận, toàn bộ đáp án sẽ được khóa vĩnh viễn.   │
│                                                             │
│  ┌─ TỔNG KẾT TIẾN ĐỘ LÀM BÀI ─────────────────────────────┐ │
│  │  • Số câu đã trả lời: 38 / 40 câu                      │ │
│  │  • Số câu chưa làm:    02 câu                          │ │
│  │  • Số câu đánh dấu ⚑:  03 câu                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ⚠ CẢNH BÁO: Bạn vẫn còn 2 câu hỏi chưa chọn đáp án!        │
│  Bạn có muốn xem lại các câu chưa làm trước khi nộp?        │
│                                                             │
│  [ ← Tiếp tục làm bài ]          [ ✓ XÁC NHẬN NỘP BÀI THI ] │
└─────────────────────────────────────────────────────────────┘
```

### 3.3. Wireframe Biên Nhận Điện Tử (Step 2: Electronic Exam Receipt)
> Hiển thị sau khi Backend trả về mã thành công `200 OK` từ lệnh khóa dòng `FOR UPDATE` và chấm điểm xong.

```text
┌─────────────────────────────────────────────────────────────┐
│                 [✓] ĐÃ NỘP BÀI THI THÀNH CÔNG!              │
│                                                             │
│  Bài thi của bạn đã được ghi nhận an toàn vào máy chủ.      │
│                                                             │
│  ┌─ BIÊN NHẬN ĐIỆN TỬ (DIGITAL EXAM RECEIPT) ─────────────┐ │
│  │ Mã biên nhận:     REC-20261017-IT4409-SV101            │ │
│  │ Thí sinh:         Nguyễn Văn A (MSSV: 21020015)        │ │
│  │ Môn thi:          Lập trình Web nâng cao - K21         │ │
│  │ Thời điểm nộp:    08:52:14 Ngày 17/10/2026             │ │
│  │ Tổng câu đã làm:  38 / 40 câu                          │ │
│  │ Thời gian làm:    52 phút 14 giây                      │ │
│  │ Điểm số đạt được: 8.75 / 10.0 (Xếp loại: ĐẠT)          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  Biên nhận này là bằng chứng xác thực việc nộp bài hợp lệ.  │
│                                                             │
│           [  QUAY VỀ DANH SÁCH BÀI THI CỦA TÔI  ]           │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. `SCR-STU-05`: Tra Cứu Kết Quả & Chi Tiết Bài Làm (Results & Review)

### 4.1. Thông Tin Chung
- **Đường dẫn URL**: `/student/results/[attemptId]`
- **Actor sử dụng**: `student`
- **Mục tiêu**: Xem lại toàn bộ bảng điểm, phân tích câu đúng/sai và lời giải thích chi tiết (khi ca thi được cấu hình cho phép xem).

### 4.2. Wireframe Bố Cục Desktop (1440px)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ ← Quay lại danh sách kết quả ]                                       Nguyễn Văn A (SV101) │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ KẾT QUẢ THI CHI TIẾT: LẬP TRÌNH WEB NÂNG CAO (IT4409)                                       │
│                                                                                             │
│ ┌─ THẺ TỔNG QUAN KẾT QUẢ ─────────────────────────────────────────────────────────────────┐ │
│ │ ĐIỂM SỐ CHÍNH THỨC:  8.75 / 10.0      XẾP LOẠI: [ ĐẠT - GIỎI ] (Điểm sàn: 5.0)         │ │
│ │ • Đúng: 35 câu (8.75đ)   • Sai: 3 câu (0đ)   • Chưa làm: 2 câu (0đ)  • T.gian: 52 phút  │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ BỘ LỌC CÂU HỎI: [ Tất cả (40) ] [ Chỉ xem câu sai (3) ] [ Chỉ xem câu đúng (35) ]           │
│                                                                                             │
│ ┌─ CÂU HỎI 01: [✓ ĐÚNG] (+0.25 điểm) ─────────────────────────────────────────────────────┐ │
│ │ Trong giao thức HTTP, phương thức nào dùng để lấy biểu diễn hiện tại của tài nguyên?    │ │
│ │                                                                                         │ │
│ │  [●] A. GET          [✓ Lựa chọn của bạn — Chính xác]                                   │ │
│ │  [ ] B. POST                                                                            │ │
│ │  [ ] C. PUT                                                                             │ │
│ │  [ ] D. DELETE                                                                          │ │
│ │                                                                                         │ │
│ │ 💡 LỜI GIẢI THÍCH CHI TIẾT:                                                              │ │
│ │ Phương thức GET là phương thức an toàn (Safe) và Idempotent dùng để truy xuất dữ liệu    │ │
│ │ mà không tạo ra hiệu ứng phụ (Side effect) làm thay đổi trạng thái máy chủ.             │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ ┌─ CÂU HỎI 14: [✗ SAI] (0 điểm) ──────────────────────────────────────────────────────────┐ │
│ │ Giao thức nào thường được dùng để truyền dữ liệu an toàn giữa trình duyệt và máy chủ?   │ │
│ │                                                                                         │ │
│ │  [●] A. FTP          [✗ Lựa chọn của bạn — Chưa chính xác]                              │ │
│ │  [✓] B. HTTPS        [★ Đáp án đúng]                                                    │ │
│ │  [ ] C. SMTP                                                                            │ │
│ │  [ ] D. TELNET                                                                          │ │
│ │                                                                                         │ │
│ │ 💡 LỜI GIẢI THÍCH CHI TIẾT:                                                              │ │
│ │ HTTPS (Hypertext Transfer Protocol Secure) sử dụng chứng chỉ số TLS/SSL để mã hóa       │ │
│ │ toàn bộ kênh truyền tin, ngăn chặn tấn công nghe lén (Eavesdropping/MitM).              │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```
