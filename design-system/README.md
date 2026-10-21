# ThiSmart — Coding Agent Handoff Kit

Bộ tài liệu **machine-readable** để Coding Agent triển khai nhận diện, pattern và motion của ThiSmart trong dự án web (ưu tiên React / Next.js).

## Đọc theo thứ tự

1. `AGENTS.md`: nguyên tắc triển khai và thứ tự ưu tiên.
2. `docs/BRAND_SPEC.md`: màu, logo, typography, kích thước.
3. `docs/PATTERN_SPEC.md`: 6 pattern và vị trí sử dụng.
4. `docs/MOTION_SPEC.md`: 4 loại animation và khả năng truy cập.
5. `docs/ACCEPTANCE_CRITERIA.md`: checklist nghiệm thu.
6. `references/`: ảnh gốc để so sánh thị giác.

## Cách đưa vào repo

Sao chép **toàn bộ nội dung thư mục** này vào thư mục `design-system/` trong repo ThiSmart. Có thể copy `AGENTS.md` ra repo root nếu dự án chưa có file này; nếu đã có, **gộp nội dung** chứ không thay thế hướng dẫn cũ.

Dùng `integrations/CLAUDE.md` (copy ra repo root) nếu chạy Claude Code; `integrations/thismart-design.mdc` (copy vào `.cursor/rules/`) nếu chạy Cursor; Codex có thể dùng `AGENTS.md` đặt ở repo root (merge với file có sẵn).

Đưa đoạn lệnh tại `prompts/PASTE_TO_AGENT.md` cho Coding Agent. Agent phải kiểm tra framework hiện có trước khi thay đổi code.

## Starter code

- `styles/tokens.css`: CSS variables chuẩn từ ảnh guideline.
- `styles/motion.css`: animation / tương tác có `prefers-reduced-motion`.
- `components/ThiSmartPatterns.tsx`: 6 mẫu SVG/React minh họa cách code pattern vector, tái sử dụng và scale độc lập.
- `examples/NextjsUsage.tsx`: ví dụ import pattern và CSS.

**Lưu ý:** starter pattern là bản diễn giải dựa trên screenshot, không phải file vector gốc. Logo trong ảnh poster **không phải logo nền trong suốt**. Muốn chính xác tuyệt đối, cần asset logo chính thức (SVG hoặc PNG nền trong suốt) cho mark và wordmark; không trích cắt poster rồi cho là logo chính thức.
