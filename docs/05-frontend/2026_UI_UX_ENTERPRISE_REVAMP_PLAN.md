# 🏛️ ThiSmart — Kế Hoạch Cải Tiến Giao Diện & Trải Nghiệm Khảo Thí 2026
## Thiết Kế Tinh Gọn, Uy Tín, Cứng Cáp — Lấy Người Dùng Làm Trung Tâm (Human-Centered Clarity)

> **Tài liệu chiến lược & kế hoạch thi công giao diện**  
> **Dự án:** ThiSmart (Exam Platform)  
> **Vị trí tệp:** `docs/05-frontend/2026_UI_UX_ENTERPRISE_REVAMP_PLAN.md`  
> **Phiên bản:** 4.0 · Cập nhật: 2026  
> **Nguyên tắc cốt lõi:** **"Công nghệ tàng hình — Thông tin tinh gọn — Trải nghiệm vững chãi"**  
> *(Hạ tầng bảo mật & công nghệ phức tạp chạy ngầm 100%; giao diện chỉ hiển thị đúng những gì người dùng cần biết để hiểu ngay trong 1 giây mà không gây hoang mang hay rối mắt).*

---

## 🎯 1. Nhận Diện Vấn Đề Cốt Lõi: Đơn Giản Hóa Cho Người Dùng Thực Tế

### 1.1. Sai lầm cần tránh: "Bắt người dùng phải hiểu công nghệ của kỹ sư"
Khi thiết kế hệ thống, các kỹ sư thường có xu hướng đưa quá nhiều chi tiết kỹ thuật lên màn hình (như mã băm SHA-256 dài dằng dặc, tên tiến trình worker FPM, độ trễ ping mili-giây, thuật toán khóa bi quan, mã sự kiện thô). 
- **Người dùng không hiểu và không cần hiểu những thứ đó!**
- Học sinh chỉ muốn biết: *Bài làm của em đã được lưu chưa? Còn bao nhiêu phút? Em nộp bài thành công chưa?*
- Giảng viên chỉ muốn biết: *Phòng thi có ai đang gian lận/chuyển tab không? Bao nhiêu em đã nộp bài? Tạo đề thi có dễ và nhanh không?*
- Quản trị viên chỉ muốn biết: *Hệ thống có đang chạy ổn định không? Có ca thi nào gặp sự cố không?*

### 1.2. Vậy "Uy tín" và "Cứng cáp" năm 2026 thực sự đến từ đâu?
"Uy tín" và "Cứng cáp" **không đến từ việc nhồi nhét thuật ngữ công nghệ phức tạp**, mà đến từ:
1. **Sự Chắc Chắn & Rõ Ràng (Clarity & Reliability):** 
   - Thông tin ngắn gọn, mạch lạc, dễ hiểu trong 1 giây.
   - Trạng thái rõ ràng: Đã lưu, Đang kết nối, Đã nộp an toàn. Không có từ ngữ mập mờ.
2. **Hình Khối Kỷ Luật (Disciplined Geometry):** 
   - Bỏ các góc bo tròn xoe như ứng dụng giải trí trẻ em (`rounded-2xl`, `rounded-3xl`).
   - Sử dụng bo góc chuẩn mực công nghiệp (`6px` cho nút/ô nhập, `8px` cho thẻ bài).
   - Đường viền 1px sắc sảo, ngay ngắn, tạo cảm giác một phần mềm khảo thí chuyên nghiệp, chuẩn mực của trường đại học/tổ chức giáo dục.
3. **Màu Sắc Trang Nghiêm & Tương Phản Chuẩn Mực:**
   - Nền xám xi-măng dịu mắt (`#F8FAFC`), mặt thẻ trắng tinh khiết (`#FFFFFF`).
   - Chữ đen than chì sắc nét, độ tương phản cao, dễ đọc liên tục nhiều giờ mà không mỏi mắt.
   - Màu trạng thái dứt khoát: Xanh ngọc lục bảo (Thành công/Đã lưu), Hổ phách (Cảnh báo/Sắp hết giờ), Đỏ thẫm (Vi phạm/Lỗi).
4. **Không Thừa Thãi (Zero-Clutter Focus):**
   - Loại bỏ mọi hình vẽ hoạt hình, 3D trôi nổi, emoji không nghiêm túc.
   - Mọi nút bấm, nhãn chữ xuất hiện trên màn hình đều phải có một lý do phục vụ trực tiếp cho hành động của người dùng.

---

## 🧭 2. Bộ Quy Tắc Chuyển Đổi: Từ "Ngôn Ngữ Kỹ Thuật" Sang "Ngôn Ngữ Người Dùng"

| Giao diện / Tính năng | Cách làm cũ (Khoe công nghệ gây khó hiểu) ❌ | Thiết kế 2026 mới (Tinh gọn, Uy tín, Dễ hiểu) ✅ |
| :--- | :--- | :--- |
| **Lưu bài thi** | Hiển thị: `Debounced Autosave 500ms • HTTP 200 OK • Inode synced` | Hiển thị chấm xanh êm dịu: **"✓ Đã tự động lưu"** |
| **Biên nhận nộp bài** | Dãy mã băm: `SHA-256: 4a8f9b2c3d1e...99fa` | **"Mã xác thực bài thi: TS-2026-8912"** kèm huy hiệu **"Đã niêm phong an toàn"** |
| **Đồng hồ phòng thi** | `Server-Authoritative NTP Sync UTC+7 (Latency: 12ms)` | Đồng hồ đếm ngược rõ ràng: **"Thời gian còn lại: 42:15"** |
| **Giám sát coi thi** | Dòng log: `Event [window_blurred] delta=4.2s target=tab` | Thẻ sinh viên có nhãn vàng: **"Rời màn hình (2 lần)"** |
| **Bảng điều khiển Admin**| `Postgres Connection Pool: 18/100, Lock Contention: 0.02ms` | **"Trạng thái máy chủ: Ổn định • 1,250 thí sinh đang thi"** |
| **Ngân hàng câu hỏi** | `Bloom Taxonomy Cognitive Depth Level 3.2 Analysis` | Thẻ độ khó dễ hiểu: **Dễ • Trung bình • Khó** |

---

## 🎨 3. Tiêu Chuẩn Thiết Kế Giao Diện 2026 (ThiSmart Design System v2)

### 3.1. Thang Bo Góc Chuẩn Mực (Không Bo Tròn Lỏng Lẻo)
- `4px`: Nhãn phân loại nhỏ, phím tắt `[A]`, `[B]`, `[C]`, `[D]`.
- `6px`: Nút bấm (Button), ô nhập dữ liệu (Input), danh sách chọn (Select).
- `8px`: Thẻ nội dung câu hỏi, bảng dữ liệu, hộp thoại thông báo.
- *Loại bỏ hoàn toàn:* `rounded-2xl` (16px), `rounded-3xl` (24px) trên các thành phần làm việc chính.

### 3.2. Đường Viền & Mặt Phẳng Kiến Trúc
- **Viền 1px sắc nét (`border border-slate-200/90`):** Phân chia rõ ràng từng vùng làm việc, không để các khối dính vào nhau mờ ảo.
- **Bóng mờ có điểm tựa:** Bỏ các lớp bóng to mờ ảo (`shadow-2xl`); dùng bóng nông chắc chắn (`shadow-xs: 0 1px 2px rgba(0,0,0,0.05)`).
- **Màu nền chống lóa:** Nền trang xám phấn nhẹ (`#F8FAFC`) giúp bảo vệ thị lực của thí sinh và giám khảo khi nhìn màn hình liên tục 60–120 phút.

### 3.3. Kiểu Chữ Rõ Ràng & Chuẩn Xác (Clear Typography)
- **Văn bản câu hỏi:** Cỡ chữ vừa vặn (16px – 17px), khoảng cách dòng thoáng (1.6), tuyệt đối dễ đọc, đạt chuẩn quốc tế chống mỏi mắt.
- **Con số thi cử:** Số câu, điểm số, thời gian đếm ngược luôn dùng font số cố định (`tabular-nums`) để không bị giật/nhảy vị trí khi thời gian trôi.

---

## 🏛️ 4. Chi Tiết Cải Tiến Từng Màn Hình: Chỉ Giữ Lại Thông Tin Cần Thiết

---

### PHÂN HỆ 1: PHÒNG THI TẬP TRUNG (FOCUS EXAM ROOM)
**Tệp mã nguồn:** `src/app/exam/[attemptId]/page.tsx`, `src/app/exam/demo/page.tsx`

#### 🎯 Mục tiêu: 
Thí sinh bước vào phòng thi cảm nhận ngay **sự trang nghiêm, yên tĩnh và an tâm tuyệt đối**. Không có chi tiết thừa thãi làm phân tâm.

#### 🛠️ Cải tiến cụ thể:
1. **Thanh thông tin đỉnh đầu (Exam Header) — Cực kỳ tinh gọn:**
   - Bên trái: Tên bài thi (ví dụ: *Kiểm tra Giữa kỳ — Cơ sở Dữ liệu*).
   - Ở giữa: **Đồng hồ đếm ngược** to rõ, nền tương phản đậm nét, số hiển thị cố định `45:00`. Khi còn dưới 5 phút, đồng hồ chuyển sang màu hổ phách cảnh báo nhẹ nhàng.
   - Bên phải: Đèn báo nhỏ màu xanh kèm chữ: **"✓ Đã tự động lưu"** (để thí sinh hoàn toàn yên tâm làm bài, không sợ rớt mạng mất bài).
2. **Khung làm bài trung tâm (Question Workspace):**
   - Nội dung câu hỏi nằm gọn gàng ở giữa, độ rộng tối ưu để mắt đọc từ trái sang phải thoải mái nhất.
   - Các phương án chọn: Thiết kế dạng phím dứt khoát `[A]`, `[B]`, `[C]`, `[D]`.
     - Chưa chọn: Viền xám mảnh, nền trắng sạch sẽ.
     - Đã chọn: Viền xanh đậm vững chắc, nền phớt xanh nhẹ, dấu tích chọn rõ ràng.
   - Hỗ trợ bấm phím tắt bàn phím A, B, C, D trực tiếp để thao tác nhanh.
3. **Cột điều hướng danh sách câu hỏi (Bên phải):**
   - Lưới số câu hỏi gọn gàng, chia ô vuông nhỏ sắc nét `32×32px`.
   - 3 trạng thái duy nhất, dễ hiểu:
     - Màu trắng: Chưa làm.
     - Màu xanh: Đã làm.
     - Dấu chấm vàng nhỏ góc trên: Đã đánh dấu để xem lại.
4. **Nút "Nộp bài" cuối cùng:**
   - Đặt ở vị trí cố định, màu xanh đậm trang trọng.
   - Khi bấm, xuất hiện bảng tóm tắt dễ hiểu: *"Bạn đã hoàn thành 38/40 câu. Còn 2 câu chưa làm. Bạn có chắc chắn muốn nộp bài?"* $\rightarrow$ Ngăn chặn hoàn toàn việc nộp nhầm.

---

### PHÂN HỆ 2: BIÊN NHẬN NỘP BÀI & BẢNG KẾT QUẢ
**Tệp mã nguồn:** `src/app/exam/[attemptId]/receipt/page.tsx`, `src/app/(workspace)/student/results/[attemptId]/page.tsx`

#### 🎯 Mục tiêu: 
Tạo cho sinh viên cảm giác **bài thi của mình đã được ghi nhận chính thức, có giá trị bằng chứng và không thể bị thất lạc hay chỉnh sửa**.

#### 🛠️ Cải tiến cụ thể:
1. **Biên nhận nộp bài chính thức (Official Exam Receipt):**
   - Thiết kế như một tấm phiếu chứng nhận trang trọng của Nhà trường:
     - Huy hiệu xanh: **"Nộp bài thành công"**.
     - Tên thí sinh, Mã sinh viên, Tên ca thi.
     - Thời gian nộp chính xác: `14:45:12 — 19/10/2026`.
     - Số câu đã trả lời: `40/40 câu`.
     - **Mã xác thực bài thi (Ngắn gọn, dễ đọc):** Ví dụ `TS-IT4409-9821` (giấu mã băm SHA-256 dài 64 ký tự vào bên dưới mã QR).
     - **Mã QR tra cứu:** Để quét kiểm tra trực tiếp trên điện thoại khi cần.
     - Nút: **"In biên nhận / Tải PDF"** để sinh viên lưu lại làm bằng chứng nếu có thắc mắc phúc khảo.
2. **Bảng kết quả thi (Khi được công bố):**
   - Hiển thị điểm số to, rõ ràng, minh bạch.
   - Đánh giá tổng quan: Đạt / Chưa đạt, xếp loại.
   - Biểu đồ điểm theo từng chủ đề bài học để sinh viên biết mình cần cải thiện phần nào.

---

### PHÂN HỆ 3: BÀN LÀM VIỆC CÁN BỘ COI THI (TEACHER PROCTORING DESK)
**Tệp mã nguồn:** `src/app/(workspace)/teacher/sessions/[id]/monitor/page.tsx`

#### 🎯 Mục tiêu: 
Giảng viên chỉ cần nhìn lướt qua màn hình trong 2 giây là nắm được toàn bộ tình hình phòng thi 50–100 sinh viên.

#### 🛠️ Cải tiến cụ thể:
1. **Thanh chỉ số nhanh đầu trang:**
   - 4 ô số liệu cơ bản, không rườm rà:
     - `Tổng thí sinh`: 60
     - `Đang làm bài`: 58
     - `Đã nộp bài`: 2
     - `Cần chú ý`: 3 (thí sinh có dấu hiệu bất thường)
2. **Danh sách thí sinh trực quan (Thẻ hoặc Bảng):**
   - Mỗi sinh viên là một dòng/thẻ rõ ràng: Họ tên, Mã SV, Tiến độ (ví dụ: `25/40 câu`), Thời gian hoạt động gần nhất.
   - Phân biệt bằng màu trạng thái chuẩn:
     - Xanh lá: Đang làm bài bình thường.
     - Vàng: Đã rời khỏi màn hình hoặc chuyển tab (ghi rõ: *Chuyển tab 2 lần*).
     - Đỏ: Mất kết nối internet quá 1 phút.
3. **Thao tác nhanh cho Giảng viên:**
   - Nút **"Nhắc nhở"**: Gửi tin nhắn ngắn hiện lên màn hình của riêng thí sinh đó.
   - Nút **"Cho phép nộp lại / Gia hạn giờ"**: Xử lý tình huống sinh viên bị sự cố máy tính.

---

### PHÂN HỆ 4: TRÌNH SOẠN THẢO NGÂN HÀNG CÂU HỎI & ĐỀ THI
**Tệp mã nguồn:** `src/components/teacher/QuestionEditorForm.tsx`, `src/app/(workspace)/teacher/questions/page.tsx`

#### 🎯 Mục tiêu: 
Thầy cô tạo câu hỏi dễ dàng như soạn văn bản thông thường, nhìn thấy ngay câu hỏi học sinh sẽ thấy ra sao.

#### 🛠️ Cải tiến cụ thể:
1. **Bố cục chia đôi (Soạn bên trái — Thấy ngay bên phải):**
   - Bên trái: Nhập nội dung câu hỏi, gõ các phương án A, B, C, D, tích chọn đáp án đúng.
   - Bên phải: Khung hiển thị mô phỏng giống 100% giao diện thi của sinh viên. Thầy cô không cần phải tưởng tượng hay bấm nút "Xem trước" rồi chờ tải trang.
2. **Đơn giản hóa phân loại:**
   - Chọn Môn học $\rightarrow$ Chọn Chủ đề $\rightarrow$ Chọn Mức độ: **Dễ / Trung bình / Khó** (không dùng các thuật ngữ hàn lâm phức tạp gây khó khăn cho giáo viên lớn tuổi).

---

### PHÂN HỆ 5: BẢNG ĐIỀU HÀNH HỆ THỐNG CỦA QUẢN TRỊ VIÊN (ADMIN DASHBOARD)
**Tệp mã nguồn:** `src/app/(workspace)/admin/page.tsx`, `src/app/(workspace)/admin/audit-logs/page.tsx`

#### 🎯 Mục tiêu: 
Người quản trị nắm bắt được sức khỏe toàn trường trong một màn hình tổng quát.

#### 🛠️ Cải tiến cụ thể:
1. **Thẻ tình trạng vận hành (System Health):**
   - Chấm xanh lớn: **"Hệ thống hoạt động bình thường"**.
   - Số người dùng đang truy cập trực tiếp: ví dụ `1,420 người`.
   - Số ca thi đang diễn ra đồng thời: `4 ca thi`.
2. **Nhật ký hoạt động quan trọng:**
   - Chỉ lưu và hiển thị các hành vi then chốt: Đăng nhập sai nhiều lần, Bắt đầu thi, Nộp bài, Thay đổi điểm số, Phân công ca thi.
   - Hiển thị theo định dạng dễ đọc: *Thời gian — Ai thực hiện — Hành động cụ thể — Đối tượng tác động*.

---

### PHÂN HỆ 6: TRANG CHỦ & ĐIỀU HƯỚNG CHUNG (LANDING & WORKSPACE SHELL)
**Tệp mã nguồn:** `src/components/workspace/AppSidebar.tsx`, `src/components/landing/HeroSection.tsx`

#### 🛠️ Cải tiến cụ thể:
1. **Thanh điều hướng Sidebar (Cứng cáp, Gọn gàng):**
   - Viền phân tách sắc nét với vùng nội dung.
   - Mục chọn chuyển đổi vai trò (Sinh viên / Giảng viên / Quản trị) làm dạng nút bấm dứt khoát, chuyên nghiệp.
   - Chân Sidebar hiển thị trạng thái ngắn gọn: *ThiSmart v2.6 • Máy chủ ổn định*.
2. **Trang chủ (Landing Page):**
   - Bỏ các hình minh họa 3D trôi nổi không thực tế.
   - Đưa hình ảnh khung thi thật của ThiSmart: Giao diện thi trung thực, biên nhận nộp bài có mã xác thực, bảng giám sát trực quan.
   - Ngôn từ giới thiệu tập trung vào 3 giá trị thiết thực:
     - **Chống gian lận hiệu quả.**
     - **Không lo mất bài khi gặp sự cố mạng.**
     - **Chấm điểm tự động & Xuất báo cáo tức thì.**

---

## 🗺️ 5. Lộ Trình Thi Công 4 Bước Tinh Gọn (Action Plan)

Không làm dàn trải, chúng ta sẽ thực hiện tuần tự từng bước để kiểm tra trực tiếp hiệu quả:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          KẾ HOẠCH TRIỂN KHAI TINH GỌN 2026                            │
├─────────┬───────────────────────────────────────────────────────────┬──────────────────┤
│ Giai đoạn│ Nội dung thực hiện                                        │ Mục tiêu đạt được│
├─────────┼───────────────────────────────────────────────────────────┼──────────────────┤
│ BƯỚC 1  │ Chuẩn hóa Thang bo góc (4-8px), Viền 1px & Màu nền dịu mắt│ Nền tảng vững    │
│ BƯỚC 2  │ Tái thiết kế Phòng thi (Focus Exam Room) & Biên nhận rõ   │ Thí sinh an tâm  │
│ BƯỚC 3  │ Tinh gọn Bảng giám sát ca thi (Teacher Monitor)           │ Giám thị dễ nhìn │
│ BƯỚC 4  │ Tinh chỉnh Ngân hàng đề thi & Bảng điều khiển Admin       │ Thao tác mượt mà │
└─────────┴───────────────────────────────────────────────────────────┴──────────────────┘
```

### Bước 1: Nền Tảng Hình Học & Màu Sắc (Thực hiện trong 1 ngày)
- Chỉnh sửa [`tokens.css`](file:///c:/Users/Admin/Desktop/PHP/web-client/src/styles/tokens.css) và [`tailwind.config.ts`](file:///c:/Users/Admin/Desktop/PHP/web-client/tailwind.config.ts):
  - Đưa bo góc về chuẩn `4px – 6px – 8px`.
  - Thiết lập viền `border-slate-200/90` cứng cáp.
  - Áp dụng font số cố định `tabular-nums` cho đồng hồ và số liệu.

### Bước 2: Phòng Thi & Biên Nhận Khảo Thí (Ưu tiên cao nhất)
- Cập nhật [`src/app/exam/[attemptId]/page.tsx`](file:///c:/Users/Admin/Desktop/PHP/web-client/src/app/exam/[attemptId]/page.tsx):
  - Thanh đỉnh tối giản với đồng hồ rõ nét và thông báo "✓ Đã tự động lưu".
  - Thẻ câu hỏi và phương án A, B, C, D dạng phím cơ học dứt khoát.
  - Lưới số câu hỏi 32×32px sắc nét.
- Cập nhật [`src/app/exam/[attemptId]/receipt/page.tsx`](file:///c:/Users/Admin/Desktop/PHP/web-client/src/app/exam/[attemptId]/receipt/page.tsx):
  - Phiếu nộp bài chính thức, có mã tra cứu ngắn gọn, mã QR và nút in chứng nhận.

### Bước 3: Bàn Làm Việc Cán Bộ Coi Thi
- Cập nhật [`src/app/(workspace)/teacher/sessions/[id]/monitor/page.tsx`](file:///c:/Users/Admin/Desktop/PHP/web-client/src/app/(workspace)/teacher/sessions/[id]/monitor/page.tsx):
  - Chuyển đổi hiển thị sang dạng thẻ/bảng dễ nhìn với nhãn màu cảnh báo rõ ràng (*Chuyển tab, Mất kết nối*).

### Bước 4: Soạn Đề Thi & Quản Trị Hệ Thống
- Nâng cấp [`QuestionEditorForm.tsx`](file:///c:/Users/Admin/Desktop/PHP/web-client/src/components/teacher/QuestionEditorForm.tsx) sang dạng chia đôi màn hình có xem trước tức thì.
- Làm sạch bảng Admin tại [`admin/page.tsx`](file:///c:/Users/Admin/Desktop/PHP/web-client/src/app/(workspace)/admin/page.tsx).

---

## ✅ 6. Tiêu Chí Nghiệm Thu (Definition of Done)

Một màn hình được coi là hoàn thiện chuẩn 2026 khi:
1. **Ai nhìn vào cũng hiểu ngay trong 2 giây:** Không dùng từ ngữ kỹ thuật chuyên ngành nội bộ.
2. **Không có góc bo bong bóng tròn xoe:** Bo góc tối đa 6px–8px, viền 1px sắc nét.
3. **Không làm rối mắt thí sinh:** Vùng làm bài sạch sẽ, chỉ có câu hỏi, phương án và thời gian.
4. **Tạo cảm giác an tâm tuyệt đối:** Trạng thái lưu bài và biên nhận nộp bài rõ ràng, có căn cứ.
5. **Biên dịch sạch sẽ:** Đạt `npm run typecheck` (0 errors) và `npm run build` thành công.
