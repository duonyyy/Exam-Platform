# ThiSmart Pattern Spec — 6 patterns

Nguồn: `references/02-background-patterns.png`. Pattern phải độc lập layout, responsive, SVG/CSS sắc nét khi scale. Màu blue/cyan pastel và nền light. Sử dụng 1 pattern chính cho mỗi section để tránh rối.

| ID | Tên trong poster | Mô tả hình học | Vị trí phù hợp | Chú ý |
| --- | --- | --- | --- | --- |
| `dot-grid` | Dot Grid | Ma trận chấm nhỏ pastel, thỉnh thoảng chấm blue/cyan đậm | Login, dashboard, empty state | opacity nhẹ, có thể crop |
| `answer-choice-grid` | Answer Choice Grid | Lưới pill 3 cột × 4 hàng, một số radio được chọn, một số viền rỗng | Hero thi trắc nghiệm, feature testing | chỉ mang tính trang trí; không nhầm với form thật |
| `folded-ribbon-mesh` | Folded Ribbon Mesh | Các dải chéo rộng, giao nhau, phối gradient blue/cyan, góc gấp bo tròn | Hero/landing | dùng ít chữ trực tiếp trên ribbon mạnh |
| `academic-network` | Academic Network | Nodes nối bằng cạnh mảnh pastel, một số nodes đậm/viền | Knowledge graph, analytics, feature | tránh tạo animation chuyển động liên tục quá mức |
| `rounded-arc` | Rounded Arc Pattern | Các cung bo tròn oversized cắt mép khung, line blue/cyan | Dashboard card, auth split pane | dùng crop mềm |
| `soft-wave` | Soft Wave Divider | Lớp sóng mềm trong xanh pastel và đường sóng trắng mảnh | Chân hero, section transition | tốt nhất đặt thấp phía cuối section |

## Kỹ thuật

- Cung cấp interface `variant`, `className` và chuẩn `viewBox` dùng được ở mọi màn hình.
- Component nên `aria-hidden="true"`, `focusable="false"`, `pointer-events: none` nếu trang trí.
- SVG gradients nhẹ, không rasterize screenshot.
- Pattern có background màu transparent/pale tùy component; section quyết định nền tổng thể.
- Không dùng `Math.random()` trong render SSR: tránh hydration mismatch.
- Color palette chỉ xoay quanh tokens; gradients và opacity có thể nội suy.
- Trên mobile: giảm opacity/scale hợp lý, giữ vùng nội dung chính thông thoáng.
- Starter: `components/ThiSmartPatterns.tsx`.

## Quy tắc sử dụng nhanh

- Một hero = tối đa một dominant pattern; các pattern còn lại chỉ là texture rất nhẹ.
- Độ tương phản văn bản tuân thủ WCAG AA cho text thường; pattern phải mờ đi khi nằm dưới text.
- Nếu ảnh chụp poster thiếu độ chính xác tọa độ, tái hiện nguyên lý hình học và cảm giác thương hiệu thay vì pixel tracing.
