# ThiSmart Motion System — v1.0

Nguồn: `references/03-motion-system.png`.

## Easing mặc định

`cubic-bezier(0.22, 1, 0.36, 1)` — smooth ease-out. Animation ngắn, có mục đích, không nhấp nháy.

## M1. Logo Reveal / Hero Entrance

Ảnh mô tả các mốc **trong timeline ~600ms**, không phải tổng các đoạn cộng thành 1200ms:

- 0ms: icon bị blur nhẹ, scale nhỏ.
- ~200ms: icon hiện rõ (fade + scale).
- ~400ms: wordmark trượt nhẹ từ trái, fade vào.
- ~600ms: logo hoàn chỉnh.

Production **cần mark và wordmark riêng** để animate độc lập; nếu chỉ có full-logo asset, fallback dùng fade+translate cả logo khoảng 600ms, không giả tách bằng crop screenshot.

## M2. CTA Button

- Default: primary blue / gradient, chữ sáng.
- Hover (100–200ms): scale ~1.03, shadow tăng nhẹ, viền/glow blue tinh tế.
- Press (~100ms): scale ~0.97, shadow giảm.
- Release (~100ms): trở về hover/default.
- Focus-visible: viền outline dễ thấy. Nút thật dùng HTML `button` hoặc `a`, không giả nút bằng `div`.

## M3. Feature Card Hover

- Hover (~200ms): dịch lên `-6px`, scale ~1.02, shadow tăng, glow vừa phải.
- Intensified pressed/selected optional (~300ms): dịch lên `-8px`, scale ~1.03, glow mạnh hơn; chỉ dùng nếu có trạng thái tương ứng.
- `:focus-within` nên có phản hồi tương đương hover nếu card chứa action.

## M4. Mobile Menu Slide-in

- Menu đi từ **phải sang trái**.
- Menu state closed: `translateX(100%)`, overlay `opacity:0`.
- Open (~300ms): `translateX(0)`, overlay fade in.
- Backdrop tối nhẹ, có `aria-expanded`, `aria-controls`, xử lý Escape, click overlay, quản lý focus.
- Khóa scroll nền khi mở menu; width `min(88vw, 360px)`.

## Accessibility

- `prefers-reduced-motion: reduce` → giảm tối đa duration, vô hiệu large transform/reveal.
- Không dùng autoplay lặp vô hạn cho các decorative effects.
- Transition chỉ nên áp dụng vào `opacity` và `transform` khi có thể để giữ hiệu suất.
- Không dùng chuyển động làm tín hiệu duy nhất cho trạng thái click/selected.

CSS khởi đầu: `styles/motion.css`.
