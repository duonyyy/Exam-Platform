# ThiSmart Brand Spec — v1.0

Nguồn chính: `references/01-brand-guideline.png`.

## Logo

- Primary horizontal: mark chữ **T cách điệu thành dải gấp** kết hợp **tờ bài thi**, phía phải là wordmark `ThiSmart`.
- Mark-only: dùng favicon, avatar, collapsed sidebar.
- Reverse: chữ `Thi` màu trắng khi đặt trên nền navy; `Smart` vẫn phối gradient blue/cyan theo bản tham chiếu.
- Light version: chữ `Thi` màu navy đậm; `Smart` gradient blue → cyan.
- Quy tắc clear space: tối thiểu bằng chiều cao mark unit `X` như ảnh guideline; **không** tự đoán khoảng pixel khi kích thước logo thay đổi.
- Không kéo méo, không thêm shadow / stroke, không đổi gradient, không xoay / thay hình mark.
- Asset production cần tối thiểu `logo-horizontal-light.svg`, `logo-horizontal-dark.svg`, `logo-mark.svg`, hoặc PNG transparent độ phân giải cao tương đương. Ba screenshot hiện tại **không thay thế asset logo gốc**.

## Design tokens

| Token | Hex | Dùng cho |
| --- | --- | --- |
| Primary Blue | `#2563EB` | CTA, interactive, brand emphasis |
| Cyan Accent | `#06B6D4` | Highlight, brand gradient, subtle accents |
| Dark Slate | `#0F172A` | Headings, chữ Thi, dark surfaces |
| Light | `#F8FAFC` | App canvas, card backgrounds |

Màu hỗ trợ **suy diễn từ ảnh** (không phải màu khóa trong guideline): `#DBEAFE` (border nhẹ), `#64748B` (secondary text), `#FFFFFF` (surface). Thực hiện dựa trên token và kiểm tra contrast.

- Gradient hero/logo accent tham khảo: `linear-gradient(110deg, #2563EB 0%, #087CF5 55%, #06B6D4 100%)` (trung gian #087CF5 mang tính xấp xỉ).
- Typography: **Inter** (được khuyến nghị trên poster), fallback `ui-sans-serif, system-ui, sans-serif`.
- Font weights: 400 body, 500 supporting, 600 controls, 700 headings.
- Thẩm mỹ: geometric sans serif, whitespace rộng, bo góc vừa, border xanh nhạt, shadow nhẹ, nền sáng sạch sẽ.
- Thông điệp thương hiệu: "Thi thông minh. Đánh giá chính xác."

## Tài nguyên áp dụng

- Header/navbar: primary horizontal logo trên nền sáng.
- Sidebar gọn: icon mark-only.
- Auth/onboarding/hero: có thể dùng một trong 6 pattern nhẹ ở phía sau, không đè lên text.
- Footer/dark hero: reverse logo **chỉ khi có file phiên bản dark hợp lệ**.
