# Instructions for Coding Agents — ThiSmart

Bạn đang triển khai design system ThiSmart. Mục tiêu: giao diện nhất quán, gọn gàng, chuyên nghiệp, thân thiện, tinh thần EdTech. **KHÔNG** mặc định ảnh poster là UI màn hình hoàn chỉnh: poster chỉ là visual specification.

## Thứ tự ưu tiên

1. Yêu cầu hiện tại của người dùng và codebase hiện có.
2. Ảnh tham chiếu tại `references/01-brand-guideline.png`, `02-background-patterns.png`, `03-motion-system.png`.
3. Thông số ở `docs/BRAND_SPEC.md`, `docs/PATTERN_SPEC.md`, `docs/MOTION_SPEC.md`.
4. Token tại `styles/tokens.css`; checklist `docs/ACCEPTANCE_CRITERIA.md`.

Nếu ảnh và thông số mâu thuẫn, báo rõ và ưu tiên màu hex / timing ghi cụ thể; không bí mật tự tạo guideline mới.

## Quy trình bắt buộc

1. Đọc dự án (framework, router, Tailwind/CSS, thư mục assets, components, lint/test).
2. Kiểm tra logo riêng của dự án đã có `.svg` hoặc `.png` transparent chưa. **Không phỏng đoán logo**, không redraw thương hiệu bằng một SVG đơn giản, không lấy logo có nền trắng từ poster để dùng trên mọi nền. Nếu chưa có, sử dụng text placeholder rõ ràng và yêu cầu cung cấp asset chuẩn.
3. Định nghĩa brand tokens một lần. Không hardcode lặp màu tùy ý.
4. Xây dựng components reusable và responsive. Pattern chủ yếu bằng SVG/CSS (không phóng to ảnh poster), background dùng `pointer-events: none` và `aria-hidden`.
5. Xây dựng motion có thời lượng/easing đúng spec; hỗ trợ `prefers-reduced-motion`; không animation kéo dài gây khó sử dụng.
6. Tạo trang preview hoặc Storybook/route nội bộ thể hiện 6 pattern và 4 motion trên desktop/mobile.
7. Chạy linter/typecheck/build/test phù hợp, kiểm tra 360px/768px/1440px, screenshot visual QA nếu môi trường có thể.
8. Báo cáo file được tạo/sửa, phần đã làm, phần cần asset gốc và các chênh lệch thị giác.

## Ràng buộc

- Ưu tiên code/asset đã có trong repo; đừng tự đổi framework hoặc cài library nặng khi CSS/React đủ.
- Dùng font **Inter** (fallback sans-serif), trừ khi dự án có font thương hiệu được duyệt khác.
- Màu chính: `#2563EB`, accent `#06B6D4`, dark `#0F172A`, light `#F8FAFC`.
- `prefers-reduced-motion: reduce`, keyboard accessibility và focus-visible là bắt buộc.
- Sử dụng pattern nhẹ, không làm giảm contrast của text.
- Không gắn chuyển động ngẫu nhiên vào tất cả thành phần. Chỉ áp dụng có mục đích.
- Không được tuyên bố "giống 100%" nếu thiếu logo vector hoặc source pattern gốc.
