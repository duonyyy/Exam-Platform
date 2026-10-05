## 📝 Mô Tả Thay Đổi (Summary of Changes)

<!-- Tóm tắt ngắn gọn lý do kỹ thuật và nội dung các thay đổi trong PR này -->

- **Phase**: Phase [ ] (theo `docs/07-testing-execution/23-IMPLEMENTATION_PLAN.md`)
- **Use Case ID**: `UC-[ ]`
- **Loại thay đổi**:
  - [ ] 🚀 `feat`: Tính năng mới hoặc endpoint mới
  - [ ] 🐛 `fix`: Sửa lỗi logic, race condition hoặc bug
  - [ ] 🔒 `security`: Vá lỗ hổng bảo mật, phòng vệ IDOR, ngăn rò rỉ đề
  - [ ] ⚡ `perf`: Tối ưu hiệu năng, giảm N+1 query, thêm index
  - [ ] ♻️ `refactor`: Tái cấu trúc mã nguồn không đổi hành vi
  - [ ] 🧪 `test`: Bổ sung hoặc sửa đổi bộ kiểm thử tự động
  - [ ] 📚 `docs`: Cập nhật tài liệu kỹ thuật hoặc ADRs
  - [ ] 💥 `BREAKING CHANGE`: Phá vỡ tương thích API hoặc CSDL

---

## 🔗 Liên Kết Tác Vụ & Tài Liệu (References)

- **Issue liên quan**: Closes #[ ] / Refs #[ ]
- **Tài liệu đặc tả**: `docs/[ ]`
- **ADR tham chiếu**: `docs/03-architecture-api/adr/ADR-[ ]` (nếu có)

---

## 🛡️ Bảng Kiểm Tra An Ninh & Thiết Kế (Pre-Merge Architectural Review)

Vui lòng xác nhận các nguyên tắc theo Hiến pháp kỹ thuật [AGENTS.md](file:///c:/Users/Admin/Desktop/PHP/AGENTS.md):

- [ ] **Chống IDOR & Phân quyền**: Đã kiểm tra `Policy` và `RoleMiddleware` cấp tài nguyên (Thí sinh không thể xem/sửa bài của thí sinh khác).
- [ ] **Zero-Leakage Policy**: Endpoint cho thí sinh (`QuestionStudentResource`) **tuyệt đối không chứa** `correct_answer` hoặc `explanation`.
- [ ] **Đồng hồ Máy chủ (Server Clock)**: Thời gian hết hạn làm bài được tính toán và thực thi tại máy chủ, không phụ thuộc đồng hồ client.
- [ ] **Kiểm soát Tranh chấp Đồng thời**: Các thao tác nhạy cảm (`SubmitExamAttempt`, nộp bài) đã sử dụng `lockForUpdate()` trong `DB::transaction()`.
- [ ] **Phòng chống N+1**: Các truy vấn quan hệ đã được Eager Loading (`with()`) đầy đủ; không có truy vấn lặp trong vòng lặp.
- [ ] **Migration & Rollback**: Nếu có thay đổi CSDL, migration có đầy đủ cả `up()` và `down()`, kèm index cho các cột tra cứu chính.

---

## ✅ Tiêu Chuẩn Hoàn Thành (Definition of Done - DoD)

Đánh dấu khi đã hoàn thành các bước kiểm tra cục bộ:

### Backend Quality Gates (`core-api/`):
- [ ] Code style chuẩn hóa qua Laravel Pint: `./vendor/bin/pint --test`
- [ ] Phân tích tĩnh Larastan đạt Level 8: `./vendor/bin/phpstan analyse --level=8`
- [ ] Toàn bộ Feature Tests PASS 100% trên PostgreSQL: `php artisan test`

### Frontend Quality Gates (`web-client/`):
- [ ] Linter không có cảnh báo: `pnpm lint`
- [ ] TypeScript strict mode không có lỗi type: `pnpm typecheck`
- [ ] Next.js Production Build thành công: `pnpm build`

### Git & Security:
- [ ] Toàn bộ commit tuân thủ chuẩn [COMMIT_STANDARDS.md](file:///c:/Users/Admin/Desktop/PHP/docs/08-guidelines/COMMIT_STANDARDS.md).
- [ ] Không có file `.env`, mật khẩu, token hay dữ liệu bí mật nào bị commit.
