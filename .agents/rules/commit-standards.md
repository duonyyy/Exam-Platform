# Git Commit Standards Rule (Production-Grade)

Mọi commit được tạo trong dự án này (bởi lập trình viên hoặc AI Agent) BẮT BUỘC phải tuân thủ nghiêm ngặt chuẩn Conventional Commits 1.0.0 và các quy tắc sản xuất dưới đây. Chi tiết đầy đủ xem tại `docs/08-guidelines/COMMIT_STANDARDS.md`.

---

## 1. Cấu Trúc Bắt Buộc

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

- **Header length**: Tối đa 72 ký tự (khuyến nghị <= 50).
- **Subject**: Dùng câu mệnh lệnh (Imperative mood), chữ thường, KHÔNG có dấu chấm cuối câu.
  - Ví dụ: `feat(attempt): add server-authoritative deadline validation`
  - Sai: `Added deadline validation.` hoặc `WIP attempt`
- **Body**: Giải thích **Tại sao** (Why), bối cảnh, giải pháp kiến trúc và đánh đổi kỹ thuật. Ngắt dòng ở 72 ký tự.
- **Footer**: `BREAKING CHANGE:`, `Phase: Phase N`, `Use-Case: UC-XX`, `Closes #XX`, `Security-Impact: none|low|medium|critical`.

---

## 2. Types Hợp Lệ

- `feat`: Tính năng mới hoặc endpoint mới.
- `fix`: Sửa lỗi logic, race condition, crash.
- `security`: Vá lỗ hổng, phòng chống IDOR, ngăn chặn rò rỉ đề/đáp án.
- `perf`: Tối ưu N+1 query, chỉ mục CSDL, cache.
- `refactor`: Tái cấu trúc mã nguồn không đổi hành vi/API.
- `test`: Thêm hoặc cập nhật Feature Tests, Unit Tests.
- `docs`: Chỉnh sửa tài liệu, specs, ADRs, diagrams.
- `style`: Định dạng mã nguồn (Pint, ESLint), không đổi logic.
- `build`: Phụ thuộc Composer, pnpm, Dockerfile.
- `ci`: Cấu hình GitHub Actions, Vercel, Quality Gates.
- `chore`: Tác vụ bảo trì, config repo, git template.
- `revert`: Hoàn tác commit trước đó.

---

## 3. Scopes Chuẩn Hóa Theo Monorepo

- **Backend (`core-api`)**: `auth`, `rbac`, `subject`, `topic`, `question`, `exam`, `session`, `assignment`, `invigilation`, `attempt`, `answer`, `scoring`, `proctoring`, `stats`, `db`, `policy`, `api`, `queue`.
- **Frontend (`web-client`)**: `client`, `web-auth`, `exam-room`, `timer`, `autosave`, `proctoring-collector`, `teacher-portal`, `admin-portal`, `ui`.
- **AI Agent (`agentic-system`)**: `agent`, `langgraph`, `tools`, `prompt`.
- **Chung / Hạ tầng**: `repo`, `docker`, `ci`, `deps`, `docs`.

---

## 4. Năm Nguyên Tắc Vàng Bắt Buộc

1. **Atomic Commits**: Mỗi commit là 1 đơn vị logic hoàn chỉnh, độc lập, có thể build và test pass 100%. Không gộp backend + frontend + config linh tinh.
2. **Zero-Secret Leakage**: Tuyệt đối không commit `.env`, token, private keys, database passwords, đáp án gốc câu hỏi (`correct_answer`), hoặc dữ liệu PII.
3. **Migration Integrity**: Migration CSDL phải có cả `up()` và `down()`, đi kèm cập nhật Model và Feature Test.
4. **Co-located Testing**: Mọi `feat:` và `fix:` bắt buộc phải có tests đi kèm trong cùng commit.
5. **Security & Zero-Leakage Policy**: Endpoint mới phải có Form Request và Policy; sinh viên tuyệt đối không nhận được `correct_answer`.

---

## 5. Pre-Commit Checklist

- Backend: `./vendor/bin/pint --test` + `./vendor/bin/phpstan analyse --level=8` + `php artisan test`
- Frontend: `pnpm lint` + `pnpm typecheck` + `pnpm build`
