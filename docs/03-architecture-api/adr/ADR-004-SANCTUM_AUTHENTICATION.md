# ADR-004 — Chiến lược Xác thực bằng Laravel Sanctum kết hợp Cookie Proxy

**Mã quyết định**: `ADR-004`  
**Ngày quyết định**: 2026-10-05  
**Trạng thái**: `ACCEPTED`  

---

## 1. Bối cảnh (Context)
Hệ thống giao tiếp giữa Next.js Frontend và Laravel Backend cần một giải pháp xác thực:
- Phi trạng thái (Stateless), dễ dàng scale ngang nhiều container Backend.
- Ngăn chặn hoàn toàn nguy cơ rò rỉ token qua lỗ hổng XSS trên trình duyệt.
- Hỗ trợ thu hồi token tức thì khi người dùng đăng xuất hoặc khi phát hiện tài khoản có hành vi bất thường.

## 2. Quyết định (Decision)
Lựa chọn **Laravel Sanctum Personal Access Tokens** kết hợp mô hình **BFF Cookie Proxy**:
1. Core API chỉ phát hành và xác thực Sanctum Bearer Token qua header `Authorization: Bearer <token>`.
2. Next.js đóng vai trò trung gian nhận Token khi Login thành công và lưu vào **HTTP-Only, Secure, SameSite=Lax Cookie**.
3. Trình duyệt không thể đọc được cookie này bằng JavaScript. Edge Middleware của Next.js tự động đọc Cookie và gắn vào header khi chuyển tiếp request tới Laravel.

## 3. Các Phương án Thay thế đã Xem xét (Alternatives Considered)
- **Sanctum SPA Session / CSRF Cookie**: Sử dụng cookie session mặc định của Laravel. Phương án này đòi hỏi hai domain phải chia sẻ chung root domain (Subdomain sharing), cấu hình CORS phức tạp, và dễ gặp vấn đề khi scale cross-domain hoặc ứng dụng di động trong tương lai.
- **JWT (JSON Web Tokens - tymon/jwt-auth)**: Tự chứa thông tin (Self-contained) không cần truy vấn CSDL để xác thực. Tuy nhiên, JWT rất khó thu hồi tức thì (Revocation/Blacklist) nếu không đưa thêm tầng Redis, tăng độ phức tạp không cần thiết.

## 4. Hệ quả & Đánh giá Đánh đổi (Consequences)
- **Tích cực**:
  - Bảo mật tối đa: Miễn nhiễm với tấn công XSS đọc trộm Token.
  - Thu hồi tức thì: Chỉ cần xóa bản ghi trong bảng `personal_access_tokens` là phiên làm việc bị hủy ngay lập tức.
- **Tiêu cực / Rủi ro**:
  - Mỗi request API đòi hỏi một câu truy vấn nhanh vào CSDL để nạp User từ Token (được tối ưu hóa qua chỉ mục của Sanctum hoặc cache Redis).
