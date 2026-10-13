# ADR-007 — Quyền phụ trách môn học

**Ngày quyết định**: 2026-10-11
**Trạng thái**: `ACCEPTED`

## Bối cảnh

FR-SUBJECT trước đây cho phép mọi teacher sửa/xóa môn, trong khi AGENTS.md giới hạn giảng viên trong phạm vi phụ trách. Chưa có quan hệ dữ liệu xác định người đang phụ trách.

## Quyết định

- `subjects.owner_teacher_id` là một FK nullable đến `users.id`, biểu thị **một** giảng viên đang phụ trách. `created_by` là FK không nullable ghi người tạo để truy vết và không thay đổi khi phân công lại.
- Teacher tạo môn thì máy chủ tự gán mình làm người phụ trách. Admin có thể tạo môn chưa phân công hoặc gán/đổi sang teacher đang hoạt động. Teacher không tự chuyển quyền.
- Admin có quyền quản lý mọi môn; teacher chỉ sửa/xóa môn có `owner_teacher_id` bằng ID của mình. Mọi vai trò đã xác thực có quyền đọc. Môn chưa phân công chỉ admin được ghi.
- Route middleware kiểm tra vai trò; `SubjectPolicy` kiểm tra bản ghi. Sửa/xóa khóa dòng và kiểm tra lại Policy trong giao dịch. Xóa môn có chủ đề trả `409`; FK `RESTRICT` là lớp bảo vệ cuối cùng.
- Topic API khi triển khai phải áp dụng quyền của Subject cha cho thao tác ghi.

## Hệ quả và giới hạn

Một môn chỉ có một người phụ trách tại một thời điểm. Nếu cần đồng phụ trách, phải thiết kế bảng phân công nhiều-nhiều và sửa Policy; không suy diễn quyền từ `created_by`. FK không kiểm tra được vai trò teacher hay trạng thái hoạt động, nên API phải kiểm tra khi phân công và quy trình quản trị user sau này phải bảo toàn bất biến đó. `ILIKE '%search%'` phù hợp danh mục nhỏ; dữ liệu lớn sẽ cần chỉ mục tìm kiếm thích hợp.
