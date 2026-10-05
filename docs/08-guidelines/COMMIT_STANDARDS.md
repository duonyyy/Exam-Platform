# Quy Chuẩn Commit Chuẩn Production (Production Git Commit Standards)

**Dự án**: Exam Platform Monorepo (Laravel 13 + Next.js 15 + Agentic System)  
**Tài liệu tham chiếu**: `docs/08-guidelines/COMMIT_STANDARDS.md`  
**Chuẩn tuân thủ**: [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) & SemVer 2.0.0  
**Trạng thái**: Approved — Bắt buộc áp dụng cho toàn bộ lập trình viên và AI Agents

---

## 🎯 1. Triết Lý & Tầm Quan Trọng (Philosophy & Motivation)

Trong một hệ thống Monorepo phân tán phục vụ thi cử trực tuyến có tính chất sinh tử (Mission-Critical), lịch sử commit Git không chỉ đơn thuần là nhật ký lưu mã nguồn, mà là:

1. **Tài liệu kiến trúc sống (Living Architecture Document)**: Giải thích lý do kỹ thuật (*Why*), bối cảnh ra quyết định và các đánh đổi (Trade-offs) sau mỗi thay đổi.
2. **Nền tảng Tự động hóa CI/CD & Semantic Release**: Cho phép sinh tự động `CHANGELOG.md`, đánh version ngữ nghĩa (`MAJOR.MINOR.PATCH`) và kích hoạt chính xác các Quality Gates tương ứng theo thư mục thay đổi (Path Filtering).
3. **Công cụ Truy vết Lỗi Cấp tốc (Zero-Downtime Incident Response)**: Hỗ trợ lệnh `git bisect` xác định chính xác commit gây hồi quy (regression) chỉ trong vài phút thay vì phải rà soát hàng ngàn dòng code.
4. **Hồ sơ Kiểm toán An ninh (Audit & Compliance Trail)**: Phục vụ thanh tra an ninh phần mềm, đảm bảo không có mã độc, cửa sau (backdoors) hay rò rỉ bí mật (secrets/tokens) lọt vào môi trường sản xuất.

> **Quy tắc cốt lõi**: Mỗi commit phải là một bước tiến vững chắc, có tính nguyên tử, có thể build độc lập và kiểm thử pass 100%. Tuyệt đối không commit mã dở dang làm gãy pipeline CI!

---

## 📐 2. Cấu Trúc Định Dạng Chuẩn (Commit Message Anatomy)

Mọi commit message trong dự án bắt buộc phải tuân theo cấu trúc 3 phần chuẩn mực:

```text
<type>(<scope>): <subject>

[optional body: Bối cảnh, lý do thay đổi và giải pháp kỹ thuật]

[optional footer(s): BREAKING CHANGE, Liên kết Issue/Phase, Ký duyệt an ninh]
```

### 2.1. Dòng Tiêu đề (Header) — Tối đa 72 ký tự (Khuyến nghị ≤ 50)
- **`<type>`**: Loại thay đổi (chữ thường, bắt buộc, nằm trong danh mục quy định tại Mục 3).
- **`(<scope>)`**: Phân hệ/miền nghiệp vụ bị ảnh hưởng (bắt buộc, nằm trong danh mục tại Mục 4).
- **`:`**: Dấu hai chấm kèm một khoảng trắng ngay sau scope.
- **`<subject>`**: Mô tả ngắn gọn thay đổi bằng **câu mệnh lệnh (Imperative mood)**:
  - ❌ Tránh: `Added question validation`, `Fixes bug in scoring`, `Updating models.`
  - ✅ Chuẩn: `add jsonb validation for question options`, `prevent double submit via pessimistic lock`
  - Bắt đầu bằng chữ thường hoặc chữ hoa nhưng **không có dấu chấm (`.`) ở cuối câu**.

### 2.2. Phần Thân (Body) — Tối đa 72 ký tự mỗi dòng
- Cách dòng tiêu đề bằng **đúng 1 dòng trống**.
- Tập trung trả lời:
  - **Tại sao** (Why): Bối cảnh phát sinh vấn đề hoặc yêu cầu nghiệp vụ là gì?
  - **Như thế nào** (How): Giải pháp kiến trúc/thuật toán được lựa chọn?
  - **Đánh đổi** (Trade-offs): Có ảnh hưởng gì tới hiệu năng, bộ nhớ hay tương thích ngược?

### 2.3. Phần Chân (Footer) — Thông tin truy vết & Phá vỡ tương thích
- **`BREAKING CHANGE:`**: Bắt buộc nếu thay đổi làm gãy API contract hoặc cấu trúc dữ liệu cũ (xem Mục 6).
- **Tham chiếu Use Case / Phase**: `Phase: Phase 4 (Question Bank)`, `Use-Case: UC-06`.
- **Liên kết Quản lý Tác vụ**: `Closes #123`, `Refs #456`, `Fixes #789`.
- **Đánh giá An ninh (Security Impact)**: `Security-Impact: none | low | medium | critical`.

---

## 🏷️ 3. Danh Mục Types Chuẩn Production (Type Taxonomy)

Chỉ sử dụng 12 types chuẩn hóa dưới đây. Tuyệt đối không tự ý thêm các type lạ:

| Type | Ý Nghĩa Nghiệp Vụ | SemVer Impact | Ví Dụ Thực Tế |
| :--- | :--- | :--- | :--- |
| **`feat`** | Tính năng mới cho người dùng hoặc API endpoint mới | `MINOR` | `feat(questions): add jsonb options validation` |
| **`fix`** | Sửa lỗi logic, sửa bug crash, xử lý race condition | `PATCH` | `fix(attempts): lock row for update to prevent double submit` |
| **`security`** | Vá lỗ hổng an ninh, phòng chống IDOR, ngăn rò rỉ dữ liệu | `PATCH` | `security(attempts): hide correct_answer in student resource` |
| **`perf`** | Tối ưu hóa hiệu năng, giảm N+1 query, thêm index CSDL | `PATCH` | `perf(sessions): add composite index on status and dates` |
| **`refactor`** | Tái cấu trúc mã nguồn không làm thay đổi hành vi/API | Không đổi | `refactor(scoring): extract calculation into AttemptScorer action` |
| **`test`** | Thêm mới hoặc cập nhật Feature Tests, Unit Tests | Không đổi | `test(auth): add 403 test for student calling admin route` |
| **`docs`** | Thêm mới hoặc chỉnh sửa tài liệu, specs, ADRs, diagrams | Không đổi | `docs(api): document idempotency header in attempt submit` |
| **`style`** | Format mã nguồn (Pint, ESLint, Prettier), xóa khoảng trắng thừa | Không đổi | `style(core-api): apply laravel pint code style formatting` |
| **`build`** | Thay đổi hệ thống build, thêm gói phụ thuộc Composer/pnpm | Không đổi / `PATCH` | `build(deps): add laravel-sanctum and predis packages` |
| **`ci`** | Cập nhật cấu hình CI/CD, GitHub Actions, Docker workflows | Không đổi | `ci(actions): add postgresql 16 service container to backend ci` |
| **`chore`** | Các tác vụ phụ trợ, cập nhật script bảo trì, cấu hình IDE | Không đổi | `chore(repo): add git commit message template` |
| **`revert`** | Hoàn tác một commit trước đó do lỗi phát sinh | Tuỳ commit cũ | `revert: feat(timer): revert premature websocket implementation` |

---

## 🌐 4. Hệ Thống Monorepo Scopes Chuẩn Miền (Domain Scopes)

Trong cấu trúc Monorepo, scope giúp lập trình viên và reviewer nhận biết ngay lập tức module nào đang được thay đổi. Hãy chọn scope chính xác nhất từ danh mục dưới đây:

### 4.1. Khối Backend API (`core-api/`)
| Scope | Miền Nghiệp Vụ / Module Tương Ứng |
| :--- | :--- |
| **`auth`** | Xác thực người dùng, đăng ký, đăng nhập, cấp/thu hồi Sanctum token. |
| **`rbac`** | Phân quyền vai trò (`admin`, `teacher`, `student`), `RoleMiddleware`. |
| **`subject`** | Danh mục Môn học (`Subject` model, CRUD, Unique code). |
| **`topic`** | Chủ đề kiến thức thuộc môn học (`Topic` model, ràng buộc toàn vẹn). |
| **`question`** | Ngân hàng câu hỏi, loại câu hỏi (`QuestionType`), kiểm duyệt (`draft → approved → rejected`). |
| **`exam`** | Đề thi mẫu (`Exam` blueprint, `ExamQuestion`, thứ tự, tính tổng điểm). |
| **`session`** | Ca thi (`ExamSession`), lập lịch khung giờ, FSM (`draft → published → in_progress → closed`). |
| **`assignment`** | Phân bổ thí sinh vào ca thi (`SessionAssignment`, Unique `exam_session_id + student_id`). |
| **`invigilation`** | Phân công cán bộ coi thi (`SessionTeacher`). |
| **`attempt`** | Lượt làm bài (`ExamAttempt`), FSM attempt, kiểm tra điều kiện mở bài thi. |
| **`answer`** | Lưu câu trả lời (`AttemptAnswer`), Autosave, Idempotent Upsert. |
| **`scoring`** | Thuật toán tính điểm độc lập (`AttemptScorer`), trọng số, xác định đúng/sai. |
| **`proctoring`** | Thu thập nhật ký giám sát (`ProctoringEvent`), sự kiện gian lận thi cử. |
| **`stats`** | Thống kê phân tích phổ điểm, độ phân biệt câu hỏi, tỷ lệ đạt/trượt. |
| **`db`** | Migrations, Seeders, Ràng buộc Foreign Key, Composite Unique & Indexes. |
| **`policy`** | Lớp Laravel Policy kiểm soát tài nguyên, phòng vệ IDOR. |
| **`api`** | Cấu hình Route chung, Global Exception Handling, Base API Resource. |
| **`queue`** | Cấu hình Queue Workers, Jobs xử lý ngầm (chấm điểm hàng loạt, gửi email). |

### 4.2. Khối Frontend Client (`web-client/`)
| Scope | Module Giao Diện Tương Ứng |
| :--- | :--- |
| **`client`** | Cấu hình gốc Next.js, Layout chính, Providers, App Router. |
| **`web-auth`** | Luồng đăng nhập, Route Handlers HttpOnly Cookie Proxy. |
| **`exam-room`** | Giao diện phòng thi trực tuyến tập trung (Focus Mode Exam Room). |
| **`timer`** | Bộ đếm thời gian thi phía client đồng bộ với Server Clock. |
| **`autosave`** | Cơ chế Debounced Autosave (500ms) kèm trạng thái mạng. |
| **`proctoring-collector`** | Lắng nghe cảm biến trình duyệt (`visibilitychange`, `blur`, `fullscreenchange`). |
| **`teacher-portal`** | Giao diện dành cho Giảng viên: soạn đề, duyệt câu hỏi, giám sát ca thi. |
| **`admin-portal`** | Giao diện Quản trị viên: phân quyền, cấu hình hệ thống, audit log. |
| **`ui`** | Reusable UI components (Button, Modal, Toast, Input), Tailwind Design Tokens. |

### 4.3. Khối Hệ Thống AI Agent (`agentic-system/`)
| Scope | Thành Phần AI Agent |
| :--- | :--- |
| **`agent`** | Runtime cốt lõi của ExamOps Agent (FastAPI). |
| **`langgraph`** | Đồ thị trạng thái StateGraph, điều phối luồng suy luận. |
| **`tools`** | Bộ công cụ tương tác an toàn với Exam Platform API. |
| **`prompt`** | Định nghĩa Prompt hệ thống, Few-shot templates và Guardrails. |

### 4.4. Hạ Tầng & Toàn Hệ Thống (Cross-Cutting / Infra)
| Scope | Phạm Vi Ảnh Hưởng |
| :--- | :--- |
| **`repo`** | Cấu hình Monorepo gốc, Root README, Hiến pháp AGENTS.md. |
| **`docker`** | Dockerfiles, Docker Compose cấu hình Nginx, PHP-FPM, Postgres, Redis. |
| **`ci`** | GitHub Actions Workflows (`ci.yml`, Vercel deploy, Quality Gates). |
| **`deps`** | Cập nhật phiên bản thư viện chung (Dependabot, Root configs). |
| **`docs`** | Hệ thống tài liệu đặc tả kỹ thuật trong `docs/`. |

---

## 🛡️ 5. Năm Nguyên Tắc Vàng Commit Chuẩn Production (The 5 Golden Rules)

### 🥇 Nguyên Tắc 1: Tính Nguyên Tử Tuyệt Đối (Atomic Commits)
- **Định nghĩa**: Một commit chỉ làm **đúng 1 việc duy nhất** và làm việc đó hoàn chỉnh.
- **Quy tắc thực hành**:
  - Không bao giờ gộp thay đổi backend migration + frontend UI + docker config vào chung một commit.
  - Mỗi commit khi checkout riêng biệt đều phải build thành công và vượt qua kiểm thử (`git bisect safe`).
  - Nếu một tính năng lớn cần 3 bước (Migration $\rightarrow$ Action/Policy $\rightarrow$ Controller/Resource), hãy tách thành 3 commits nguyên tử nối tiếp nhau.

### 🥈 Nguyên Tắc 2: Không Rò Rỉ Bí Mật & Dữ Liệu Nhạy Cảm (Zero-Secret Leakage)
- **Tuyệt đối nghiêm cấm commit**:
  - Tệp cấu hình môi trường chứa secret thực (`.env`, `.env.production`).
  - Khóa bí mật API, Private Key SSL, Token Sanctum cá nhân.
  - Đáp án câu hỏi thi thật (`correct_answer`) trong các tệp seed hoặc mock data công khai.
  - Thông tin định danh cá nhân thật (PII) của sinh viên hoặc giảng viên.
- **Hành động khi vi phạm**: Nếu vô tình commit secret, **không được** commit đè để xóa; phải lập tức thông báo Lead Engineer để thu hồi/revoke key và dùng `git filter-repo` / BFG để xóa sạch lịch sử git.

### 🥉 Nguyên Tắc 3: Toàn Vẹn CSDL & Khả Năng Rollback (Migration Integrity)
- Mọi commit có migration CSDL phải đảm bảo:
  - Có đầy đủ phương thức `up()` (tạo bảng, thêm cột, tạo index) và `down()` (xóa bảng, drop cột, drop index tương ứng).
  - Không commit migration kiểu phá hủy dữ liệu (Destructive Migration) mà không có cảnh báo rõ ràng.
  - Đi kèm với cập nhật Model tương ứng (`$fillable`, `$casts`, DocBlocks quan hệ).

### 🏅 Nguyên Tắc 4: Code Đi Liền Với Test (Co-located Testing)
- Mọi commit mang type `feat` hoặc `fix` **bắt buộc phải có test đi kèm** trong cùng commit (hoặc commit `test` đi ngay trước trong luồng TDD).
- Không chấp nhận commit `feat(attempt): add submit logic` mà không có Feature Test kiểm tra Happy Path, 401, 403, 422 và chống Double Submit.

### 🎖️ Nguyên Tắc 5: Tuân Thủ Phân Quyền & Zero-Leakage Policy
- Không bao giờ commit một API endpoint mà không có **Form Request** (validate input) và **Policy** (kiểm tra phân quyền, chống IDOR).
- Bắt buộc commit riêng biệt `QuestionAdminResource` và `QuestionStudentResource`. Tuyệt đối không để lọt trường `correct_answer` sang resource của học sinh.

---

## 💥 6. Quy Chuẩn Quản Lý Breaking Changes (Phá Vỡ Tương Thích)

Khi một thay đổi làm thay đổi hợp đồng API hiện tại, xóa/sửa tên cột CSDL, hoặc thay đổi định dạng dữ liệu trả về mà client cũ không thể tương thích:

1. **Thêm dấu chấm than (`!`) ngay sau type/scope**:
   ```text
   feat(api)!: restructure submit attempt payload to accept array format
   ```
2. **Khai báo bắt buộc khối `BREAKING CHANGE:` trong Footer**:
   - Nêu rõ cái gì bị phá vỡ.
   - Hướng dẫn cụ thể cách chuyển đổi (Migration Guide) cho client hoặc dịch vụ phụ thuộc.

**Ví dụ chuẩn mực Breaking Change**:
```text
feat(answer)!: migrate answer payload from key-value map to item array

BREAKING CHANGE: Endpoint `POST /api/v1/attempts/{id}/answers` now requires an array of answer objects instead of a flat key-value dictionary.

Old format:
{"answers": {"1": "A", "2": ["B", "C"]}}

New format:
{"answers": [{"question_id": 1, "selected_options": ["A"]}, {"question_id": 2, "selected_options": ["B", "C"]}]}

Migration Guide: Web client must update `useSaveAnswerMutation` hook to use the new serializer in `features/exam-taking/api`.
Phase: Phase 8 (Exam Taking Flow)
Security-Impact: none
```

---

## 🌿 7. Quy Trình Git Branching & Pull Request (Branch & PR Workflow)

Để bảo vệ nhánh `main` luôn ở trạng thái sẵn sàng triển khai sản xuất (Production-Ready):

### 7.1. Định Danh Nhánh (Branch Naming Convention)
Tên nhánh được đặt theo tiền tố phản ánh mục đích làm việc:
- `feat/phase-<N>-<feature-slug>`: Nhánh làm tính năng theo lộ trình Phase (ví dụ: `feat/phase-2-sanctum-auth`, `feat/phase-6-session-fsm`).
- `fix/<issue-slug>`: Sửa lỗi phát sinh (ví dụ: `fix/attempt-double-submit-lock`, `fix/timer-drift`).
- `security/<vuln-slug>`: Xử lý an ninh, chống IDOR (ví dụ: `security/patch-attempt-idor`).
- `perf/<slug>`: Tối ưu hiệu năng, N+1 query (ví dụ: `perf/index-session-assignments`).
- `refactor/<slug>`: Tái cấu trúc mã nguồn (ví dụ: `refactor/extract-attempt-scorer`).
- `docs/<slug>`: Viết hoặc cập nhật tài liệu (ví dụ: `docs/add-commit-standards`).

### 7.2. Tiêu Chuẩn Pull Request (PR Standards)
- **Tiêu đề PR**: Phải tuân thủ chuẩn Conventional Commits (ví dụ: `feat(questions): implement jsonb validation and review workflow`).
- **Nội dung PR**: Phải hoàn thành checklist 14 yếu tố Pre-Implementation và 11 khía cạnh Post-Implementation quy định tại Hiến pháp `AGENTS.md`.
- **Quality Gates CI**: Bắt buộc vượt qua 100% các jobs CI trên GitHub Actions:
  - Backend CI: Pint (PSR-12), Larastan Level 8, Feature Tests trên PostgreSQL 16 thật.
  - Frontend CI: ESLint, TypeScript Strict, Next.js Build.
- **Chiến lược Merge (Merge Strategy)**:
  - Khuyến nghị: **Squash and Merge** (gộp các commit nháp thành 1 commit duy nhất chuẩn mực mang tên PR trước khi nhập vào `main`).
  - Hoặc **Rebase and Merge** nếu toàn bộ các commit con đều đã được rebase sạch sẽ và đạt chuẩn nguyên tử. Tuyệt đối cấm Merge Commit bẩn (`Merge branch 'main' into feat/...`).

---

## ✅ 8. Bảng Kiểm Tra Trước Khi Commit (Pre-Commit Quality Checklist)

Trước khi thực hiện lệnh `git commit`, kỹ sư hoặc AI Agent bắt buộc phải tự kiểm tra theo bảng sau:

### Cho phần Backend (`core-api/`):
```bash
# 1. Format code tự động theo PSR-12 và chuẩn Laravel
./vendor/bin/pint

# 2. Kiểm tra phân tích tĩnh ở mức nghiêm ngặt nhất (Level 8)
./vendor/bin/phpstan analyse --level=8

# 3. Chạy toàn bộ Feature Tests trên PostgreSQL
php artisan test
```

### Cho phần Frontend (`web-client/`):
```bash
# 1. Kiểm tra linter
pnpm lint

# 2. Kiểm tra chặt chẽ kiểu dữ liệu TypeScript (không được có lỗi any ngầm)
pnpm typecheck

# 3. Kiểm tra biên dịch Next.js production build
pnpm build
```

---

## 📚 9. Thư Viện Mẫu Commit Thực Chiến (Good vs Bad Gallery)

### 9.1. Tính năng mới: Khởi tạo Lượt Thi (Phase 7 - Exam Attempt)
#### ❌ Ví dụ XẤU (Vi phạm chuẩn):
```text
wip attempt code
fixed stuff in exam attempt controller and added some queries. Also updated css.
```
*Lỗi*: Type không rõ ràng, scope thiếu, mô tả cẩu thả, vi phạm tính nguyên tử (gộp cả CSS vào).

#### ✅ Ví dụ CHUẨN PRODUCTION:
```text
feat(attempt): implement start exam attempt action with question shuffling

Ensure that when an assigned student starts an exam attempt:
- The exam session is strictly checked for active time window (start_at <= now <= end_at)
- A single attempt record is created or resumed (idempotent)
- Exam questions are randomized per student if shuffle_questions is enabled
- Attempt deadline is computed authoritatively using server clock

Phase: Phase 7 (Exam Taking)
Use-Case: UC-07
Security-Impact: medium
```

---

### 9.2. Sửa lỗi An ninh: Chống Nộp Đúp Bằng Khóa Bi Quan (Phase 8 - Submission)
#### ❌ Ví dụ XẤU:
```text
fix: fix submit bug
now student cannot submit twice.
```
*Lỗi*: Thiếu scope, không nêu cơ chế kỹ thuật (Locking, Transaction), không có mã Issue.

#### ✅ Ví dụ CHUẨN PRODUCTION:
```text
fix(attempt): prevent double submit race condition via pessimistic lock

Wrap the submission workflow inside a database transaction and apply
`lockForUpdate()` on the `ExamAttempt` row before validating status.
Subsequent concurrent requests will block until the first transaction
commits, then fail gracefully with 409 Conflict.

Closes #142
Use-Case: UC-08
Security-Impact: critical
```

---

### 9.3. An Ninh: Ngăn Chặn Rò Rỉ Đáp Án Sang Thí Sinh (Phase 4 - Question Bank)
#### ✅ Ví dụ CHUẨN PRODUCTION:
```text
security(question): separate student and admin api resource representations

Split question JSON transformation into two distinct resources:
- `QuestionAdminResource`: Exposes `correct_answer`, `explanation`, and author metadata for teachers.
- `QuestionStudentResource`: Completely strips `correct_answer` and `explanation` to prevent inspection via browser devtools.

Phase: Phase 4 (Question Bank)
Security-Impact: critical
```

---

### 9.4. Hiệu Năng: Thêm Chỉ Mục Tổng Hợp Phòng Chống N+1 (Phase 6 - Sessions)
#### ✅ Ví dụ CHUẨN PRODUCTION:
```text
perf(session): add composite index on exam_sessions status and schedule dates

Create composite B-tree index `idx_exam_sessions_status_dates` on
`(status, start_at, end_at)` to optimize frequent candidate lookup
queries during peak session check-ins. Reduces index scan cost from
245ms to 8ms under 1,000 concurrent student load.

Phase: Phase 6 (Exam Sessions)
Refs #88
Security-Impact: none
```

---

### 9.5. Frontend: Bộ Đếm Giờ Phòng Thi và Debounce Autosave (Phase 8 - Web Client)
#### ✅ Ví dụ CHUẨN PRODUCTION:
```text
feat(exam-room): implement server-authoritative timer and debounced autosave

- Compute client remaining time based on server deadline timestamp
- Add 500ms debounced autosave hook on radio/checkbox answer change
- Render visual indicators for sync states: saving, saved, and offline
- Automatically trigger submit mutation when timer reaches 0

Phase: Phase 8 (Web Client Exam Room)
Use-Case: UC-08
Security-Impact: medium
```

---

## ⚙️ 10. Tự Động Hóa & Thiết Lập Công Cụ (Tooling & Automation)

Để hỗ trợ lập trình viên luôn tuân thủ chuẩn mà không cần nhớ thuộc lòng từng quy tắc:

### 10.1. Mẫu Commit Mặc Định Cho Git CLI (`.gitmessage`)
Kích hoạt mẫu commit tương tác trong terminal của bạn bằng lệnh:
```bash
git config --local commit.template .gitmessage
```
Khi bạn chạy `git commit`, trình soạn thảo (VS Code, Nano, Vim) sẽ tự động mở mẫu khung kèm hướng dẫn chi tiết các types và scopes hợp lệ.

### 10.2. Tích Hợp Kiểm Tra Tự Động Với Commitlint
Dự án sử dụng tệp cấu hình `commitlint.config.mjs` tại thư mục gốc. Khi thiết lập Git Hook `commit-msg`, mọi thông điệp commit không tuân thủ cú pháp hoặc sai scope sẽ bị từ chối ngay lập tức trước khi được lưu vào Git.

### 10.3. Kiểm Soát Tại CI Pipeline
Workflow GitHub Actions `.github/workflows/ci.yml` được cấu hình để kiểm tra tính hợp lệ của toàn bộ commit trong Pull Request, đảm bảo không có bất kỳ commit rác nào có thể lọt vào nhánh `main`.

---

> **Lời kết**: *"Mỗi dòng code viết ra phản ánh trình độ lập trình; mỗi commit message phản ánh tư duy kiến trúc và tính chuyên nghiệp của người kỹ sư."* Hãy cùng duy trì một lịch sử mã nguồn đẳng cấp chuẩn Enterprise!
