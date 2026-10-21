# Definition of Done — ThiSmart visual implementation

## Brand

- [ ] Dùng một tập brand tokens thống nhất; không hardcode màu tuỳ ý tràn lan.
- [ ] Logo có phiên bản light / dark / mark-only bằng asset **đúng nguồn** khi đã được cung cấp.
- [ ] Logo giữ tỷ lệ, clear space, không có nền vuông trắng trên vùng khác màu.
- [ ] Typography là Inter hoặc font tương đương đã được phê duyệt.

## Patterns

- [ ] Có 6 `variant`: dot-grid, answer-choice-grid, folded-ribbon-mesh, academic-network, rounded-arc, soft-wave.
- [ ] Pattern scale tốt (vector), không méo pixel ở 360px, 768px, 1440px.
- [ ] Mỗi pattern có demo preview desktop/mobile và không che text/CTA.
- [ ] Không hydration warning, không dùng ngẫu nhiên lúc render.

## Motion

- [ ] Logo entrance hoàn thành ~600ms; fallback hợp lý khi chỉ có asset full-logo.
- [ ] Button hover/press ~100–200ms, feature hover ~200ms.
- [ ] Mobile drawer mở/đóng ~300ms, đúng hướng phải → trái.
- [ ] Keyboard/focus/Escape/backdrop hoạt động, `prefers-reduced-motion` được tôn trọng.

## Chất lượng

- [ ] Giao diện mobile/tablet/desktop ổn, không horizontal overflow.
- [ ] Text contrast đủ đọc, element interactive có focus-visible.
- [ ] Không thêm package mới nếu không có lý do kỹ thuật rõ ràng.
- [ ] Build/typecheck/lint chạy được trong dự án (nếu project hỗ trợ).
- [ ] Agent cung cấp file list, preview location, kết quả test, phần chưa hoàn thiện.
