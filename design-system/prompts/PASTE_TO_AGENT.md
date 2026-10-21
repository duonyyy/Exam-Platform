Bạn là Senior Frontend Engineer + UI Engineer cho dự án ThiSmart.

Hãy đọc `design-system/AGENTS.md` và toàn bộ tài liệu ở `design-system/docs/`, đồng thời **xem trực tiếp** ba ảnh trong `design-system/references/` trước khi code. Đây là nguồn sự thật về brand, patterns và motion.

Mục tiêu: áp dụng bộ thiết kế ThiSmart vào codebase hiện có, không đổi framework và không ảnh hưởng các chức năng đang chạy.

Thứ tự thực hiện:
1. Audit codebase (framework, styles, assets, components); nêu những gì đã có/chưa có, đặc biệt là logo SVG/transparent PNG.
2. Lập kế hoạch ngắn về tokens, components, mapping vị trí dùng pattern, motion và preview route.
3. Xây dựng theme/tokens trung tâm; tạo 6 React/SVG pattern components reusable dựa trên starter code, chỉnh để sát ảnh gốc hơn.
4. Làm motion cho hero logo, CTA, feature card, mobile drawer theo timing/easing của spec.
5. Tạo trang preview `/design-system` hoặc vị trí tương đương để xem trực tiếp 6 pattern, các state của CTA/card, logo entrance và drawer.
6. Soát responsive trên 360px/768px/1440px, accessibility, reduced-motion; chạy typecheck/lint/build.
7. Trả kết quả với danh sách file thay đổi, screenshot/URL preview (nếu có), checklist pass/fail và các chỗ cần asset gốc.

**Ràng buộc:** không dùng các file poster PNG làm background trực tiếp; không lấy logo trong poster làm file logo production; không tự sáng tác lại logo khi thiếu asset gốc. Giữ palette #2563EB / #06B6D4 / #0F172A / #F8FAFC và tinh thần thiết kế tối giản, hiện đại, chuyên nghiệp, EdTech. Ưu tiên SVG/CSS sạch, reuse tốt, không lạm dụng animations. Nếu thiếu logo chuẩn, để placeholder/giữ logo đang có và đánh dấu TODO rõ ràng.

Bắt đầu bằng cách đọc ảnh và tài liệu, sau đó triển khai code thực tế. Không dừng ở việc chỉ mô tả giao diện.
