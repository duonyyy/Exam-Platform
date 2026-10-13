# ADR-008 — Chặn token khi tài khoản không còn hoạt động

**Ngày quyết định**: 2026-10-11
**Trạng thái**: `ACCEPTED`

## Bối cảnh

Login chỉ kiểm tra `is_active` trước khi cấp Sanctum token. Một token được cấp lúc tài khoản còn hoạt động vẫn xác thực được sau khi tài khoản bị khóa nếu các request tiếp theo không kiểm tra lại trạng thái.

## Quyết định

- Tất cả route được bảo vệ dùng chung nhóm middleware `auth:sanctum` rồi `active`. Ưu tiên middleware `active` trước route model binding để tài khoản bị khóa không nhận `404` khác nhau theo sự tồn tại của tài nguyên. Middleware tra `users.is_active` hiện hành bằng khóa chính trên mỗi request, trước khi chạy logic endpoint.
- Tài khoản bị vô hiệu hóa nhận `403 ACCOUNT_INACTIVE`; thiếu hoặc sai token vẫn nhận `401` từ Sanctum. Không dùng cache cho trạng thái này để thay đổi có hiệu lực ngay sau commit.
- Chưa tự xóa token trong middleware. API admin vô hiệu hóa tài khoản thuộc `FR-USER-002` khi được triển khai phải cập nhật trạng thái và xóa toàn bộ token của user trong cùng transaction.
- Cấu hình Sanctum giới hạn thời hạn Bearer token ở 480 phút, khớp với đặc tả Auth hiện có; mặc định của thư viện trước thay đổi này là không hết hạn.

## Hệ quả và giới hạn

Mỗi request đã xác thực thêm một truy vấn theo khóa chính `users.id`. Token vẫn được lưu cho đến khi hết hạn, logout hoặc quy trình thu hồi token được triển khai; nếu tài khoản được kích hoạt lại trong vòng 480 phút kể từ lúc token được cấp, token cũ có thể hoạt động trở lại. Các request đã qua middleware trước thời điểm thay đổi trạng thái được commit không thể bị hủy ngược. Khi triển khai thao tác vô hiệu hóa, cần kiểm thử việc thu hồi toàn bộ token và hành vi kích hoạt lại.
