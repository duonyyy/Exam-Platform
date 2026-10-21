# 📐 Thư Mục Wireframe Thiết Kế Giao Diện (Wireframe Specifications)

**Dự án**: ThiSmart (Exam Platform)  
**Đường dẫn**: `docs/05-frontend/wireframe/`  
**Thương hiệu & Bản sắc**: **ThiSmart Concept 03 — Minimal Tech / Modern EdTech** (Chi tiết: [`THISMART_BRAND_GUIDELINES.md`](../THISMART_BRAND_GUIDELINES.md))  
**Slogan**: *Thi thông minh. Đánh giá chính xác.*  
**Mục tiêu**: Bộ hồ sơ thiết kế sơ bộ (Wireframe Specifications) phân tách độc lập theo từng phân hệ người dùng, quy chuẩn hóa bố cục giao diện (Layouts), thứ bậc thị giác (Visual Hierarchy), hệ thống trạng thái (UI States) và tương tác người dùng (User Interactions) trước khi lập trình Frontend.

---

## 🗂️ Cấu Trúc Hồ Sơ Wireframe Tách Biệt

Thư mục này được tổ chức thành các tập tin đặc tả độc lập theo từng vai trò (Actor) và màn hình trọng yếu:

| Tệp tin Wireframe | Phân hệ / Vai trò | Số lượng màn hình | Trọng tâm thiết kế & Kỹ thuật |
| :--- | :--- | :---: | :--- |
| **[`01-AUTH-WIREFRAMES.md`](01-AUTH-WIREFRAMES.md)** | Xác thực & Công khai (Auth) | 3 màn hình | Đăng nhập (`/login`), Đăng ký thí sinh (`/register`), Quên mật khẩu (`/forgot-password`). Phân luồng theo vai trò, chống brute-force. |
| **[`02-STUDENT-WIREFRAMES.md`](02-STUDENT-WIREFRAMES.md)** | Phân hệ Thí sinh (Student) | 5 màn hình | Bảng điều khiển sinh viên, Danh sách ca thi, Kiểm tra điều kiện (Pre-flight), Hộp thoại xác nhận nộp bài & Biên nhận nộp, Tra cứu kết quả thi. |
| **[`03-TEACHER-WIREFRAMES.md`](03-TEACHER-WIREFRAMES.md)** | Phân hệ Giảng viên (Teacher) | 8 màn hình | Bảng điều khiển giảng viên, Quản lý Môn học & Chủ đề, Ngân hàng câu hỏi, Soạn thảo câu hỏi (4 loại), Thiết kế đề thi mẫu, Lập lịch ca thi & Gán thí sinh, Giám sát phòng thi trực tiếp, Báo cáo phổ điểm. |
| **[`04-ADMIN-WIREFRAMES.md`](04-ADMIN-WIREFRAMES.md)** | Phân hệ Quản trị viên (Admin) | 4 màn hình | Bảng điều khiển toàn trường, Quản trị tài khoản & phân vai trò (RBAC), Nhật ký kiểm toán (Audit Logs), Cấu hình tham số hệ thống. |
| **[`05-FOCUS-EXAM-ROOM-SPEC.md`](05-FOCUS-EXAM-ROOM-SPEC.md)** | **Phòng thi Tập trung (Focus Room)** | 1 màn hình cốt lõi | Đặc tả chi tiết từng pixel cho `/exam/[attemptId]`: Bố cục Desktop 1440px & Responsive Mobile/Tablet, Bộ đếm giờ chuẩn Server, Autosave Debounce 500ms, Xử lý mất mạng, Cảm biến gian lận (Proctoring). |
| **[`wireframe-preview.html`](wireframe-preview.html)** | **Interactive HTML Viewer** | Toàn bộ 17 màn hình | Trình duyệt xem trước tương tác (HTML/CSS thuần), chuyển đổi linh hoạt giữa các màn hình, mô phỏng phản hồi trạng thái. |

---

## 🎨 Quy Chuẩn Bố Cục & Hệ Thống Thiết Kế (Design System Specs)

### 1. Hệ thống Lưới & Kích thước Màn hình (Grid & Breakpoints)
- **Desktop Tiêu chuẩn**: `1440px` max-width container, 12 cột grid, margin ngang linh hoạt `auto`, gutter `24px`.
- **Tablet / Laptop nhỏ**: `768px – 1024px`, 8 cột grid, gutter `16px`. Bảng điều hướng câu hỏi tự động chuyển thành Drawer hoặc thu gọn.
- **Mobile**: `< 768px`, 4 cột grid, thanh điều hướng dưới đáy (Sticky Bottom Bar), các nút bấm đạt diện tích chạm tối thiểu `44x44px`.

### 2. Quy chuẩn Semantic Tokens (Tailwind Palette)
- **Primary (Chủ đạo)**: `#2563EB` (Blue 600) / Active: `#1D4ED8` (Blue 700) / Soft: `#EFF6FF` (Blue 50).
- **Accent (Điểm nhấn)**: `#06B6D4` (Cyan 500) — Biểu tượng nhận diện Concept 03, thanh tiến độ làm bài, visual highlight.
- **Background (Nền)**: `#F8FAFC` (Slate 50) — Tạo độ dịu mắt tối đa cho thí sinh khi làm bài thi kéo dài.
- **Surface / Card (Bề mặt)**: `#FFFFFF` (White) kèm border viền mỏng `#E2E8F0` (Slate 200).
- **Text Primary**: `#0F172A` (Slate 900) — Đạt độ tương phản WCAG 2.2 AAA trên nền trắng.
- **Text Secondary / Muted**: `#475569` (Slate 600) và `#64748b` (Slate 500).
- **Trạng thái Thành công (Success / Saved)**: `#15803D` (Green 700), Nền mềm `#F0FDF4`.
- **Trạng thái Cảnh báo (Warning / Review Flag)**: `#B45309` (Amber 700), Nền mềm `#FFFBEB`.
- **Trạng thái Nguy hiểm / Lỗi (Danger / Offline)**: `#B91C1C` (Red 700), Nền mềm `#FEF2F2`.

### 3. Quy chuẩn Điều hướng theo Kiến trúc Shell
Mọi giao diện trong hệ thống được phân lập thành 2 loại Shell kiến trúc:
1. **Workspace Shell**:
   - Dành cho các trang quản trị, danh sách, dashboard của Sinh viên, Giảng viên, Quản trị viên.
   - Thành phần: `AppSidebar` (trái, 240px cố định), `TopBar` (header 64px chứa breadcrumb, thông báo, avatar), `MainContent` (khung nội dung cuộn độc lập).
2. **Focus Exam Shell**:
   - Dành riêng cho trải nghiệm làm bài thi `/exam/[attemptId]`.
   - **Tuyệt đối loại bỏ Sidebar, Menu điều hướng, Footer trang web**.
   - Thành phần duy nhất: `ExamHeader` (cố định trên cùng: tên môn, thí sinh, timer, trạng thái lưu), `ExamWorkspace` (khung câu hỏi + Question Navigator), `ExamBottomBar` (nút trước/sau, nộp bài).

---

## 🔗 Liên Kết Tài Liệu Tham Chiếu
- [THISMART_BRAND_GUIDELINES.md](../THISMART_BRAND_GUIDELINES.md): Cẩm nang nhận diện thương hiệu ThiSmart Concept 03 và bộ tài nguyên hình ảnh.
- [17-FRONTEND_DESIGN.md](../17-FRONTEND_DESIGN.md): Đặc tả kiến trúc Next.js App Router, TanStack Query và State Ownership.
- [SCREEN_SPECIFICATIONS.md](../SCREEN_SPECIFICATIONS.md): Danh mục 17 màn hình chi tiết và ma trận logic CSDL/API.
- [12-API_DESIGN.md](../../03-architecture-api/12-API_DESIGN.md): Hợp đồng giao tiếp API RESTful backend `/api/v1`.
- [09-DATABASE_DESIGN.md](../../02-domain-database/09-DATABASE_DESIGN.md): Lược đồ 13 bảng CSDL PostgreSQL.
