# ADR-003 — Lựa chọn Next.js 15+ (App Router) làm Giao diện Web Client

**Mã quyết định**: `ADR-003`  
**Ngày quyết định**: 2026-10-05  
**Trạng thái**: `ACCEPTED`  

---

## 1. Bối cảnh (Context)
Ứng dụng Web Client cho Exam Platform cần đáp ứng:
- Giao diện người dùng hiện đại, phản hồi tức thì khi thao tác chọn đáp án.
- Hỗ trợ phân quyền Route Groups rõ ràng cho 3 nhóm đối tượng: Admin, Teacher, Student.
- Khả năng tích hợp máy chủ trung gian (BFF) để quản lý Cookie bảo mật HTTP-Only chống tấn công XSS đánh cắp Token xác thực.
- Tính tương thích cao với nền tảng điện toán đám mây (như Vercel hoặc Docker Standalone).

## 2. Quyết định (Decision)
Lựa chọn **Next.js 15+ (App Router)** kết hợp **React 19**, **TypeScript Strict Mode**, **Tailwind CSS**, và **TanStack Query v5**.
Next.js chỉ đóng vai trò Presentation & BFF Layer. Tuyệt đối không duplicate business logic hay scoring calculation sang Next.js. Nguồn chân lý duy nhất luôn là Laravel Backend.

## 3. Các Phương án Thay thế đã Xem xét (Alternatives Considered)
- **Vite SPA (React thuần)**: Nhẹ nhàng, đơn giản nhưng không có tầng Node.js server phía sau để làm BFF proxy quản lý HTTP-only cookie một cách tự nhiên; buộc phải lưu token vào `localStorage` (rủi ro XSS) hoặc phụ thuộc hoàn toàn vào cấu hình CORS phức tạp của Laravel Sanctum SPA.
- **Next.js Pages Router**: Là mô hình cũ của Next.js, không tận dụng được sức mạnh của React Server Components, Nested Layouts và Route Groups `(auth)`, `(dashboard)`.
- **Vue.js / Nuxt 3**: Rất tốt nhưng không đáp ứng được yêu cầu chuẩn hóa ngăn xếp công nghệ React/Next.js của đội ngũ phát triển.

## 4. Hệ quả & Đánh giá Đánh đổi (Consequences)
- **Tích cực**:
  - Hỗ trợ Route Groups và Nested Layouts giúp phân tách giao diện phòng thi độc lập (Focus Layout) với giao diện Dashboard có Sidebar.
  - Tích hợp TanStack Query quản lý Server State mượt mà (caching, optimistic updates, background refetching).
  - Khả năng kiểm tra kiểu dữ liệu nghiêm ngặt qua TypeScript và Zod Schema.
- **Tiêu cực / Rủi ro**:
  - Cần duy trì kiến trúc Monorepo và 2 quy trình build riêng biệt (PHP và Node.js).
