# AGENTS.md — Exam Platform Engineering Constitution

Tài liệu này là bộ quy chuẩn kỹ thuật tinh gọn, bắt buộc cho toàn bộ dự án **Exam Platform** (Monorepo: `core-api/`, `web-client/`, `agentic-system/`).

---

## 🎯 1. Ranh Giới Kiến Trúc (Architecture Boundaries)

- **`core-api/` (Laravel 13, PHP 8.3+, PostgreSQL 16)**:
  - **Single Source of Truth (SoR)** cho toàn bộ dữ liệu, logic nghiệp vụ, tính điểm và thời gian thi.
  - **Pure RESTful API (`/api/v1`)**: Tuyệt đối không Blade, không Livewire, không sinh HTML/CSS từ backend.
  - Sử dụng Eloquent + Form Request chuẩn mực. Không tạo thừa Repository / DTO khi CRUD cơ bản giải quyết sạch.

- **`web-client/` (Next.js 15+ App Router, React 19, Tailwind)**:
  - **Zero Trust Client**: Bộ đếm giờ client chỉ phục vụ hiển thị; backend tính toán bằng **Server-Authoritative Clock**.
  - Tuyệt đối **không duplicate logic chấm điểm**, không lưu `correct_answer` hay secret trong state/bundle client.
  - Xác thực qua HttpOnly Cookie Proxy (`/api/auth/*`), gọi backend qua `/api/proxy/*`.

- **`agentic-system/` (Python 3.11+, FastAPI, LangGraph)**:
  - **Fail-Closed**: Tuyệt đối không truy cập trực tiếp DB PostgreSQL của Core API; chỉ giao tiếp qua REST API.
  - Mọi thao tác Ghi (`requires_write = True`) bắt buộc dừng tại cổng duyệt **Human-in-the-Loop** (`WAITING_FOR_APPROVAL`).

---

## 👥 2. Phân Quyền & Bảo Mật (Security & RBAC)

- **Ma trận vai trò**:
  - `Admin`: Toàn quyền tài khoản người dùng, cấu hình hệ thống, môn học, audit logs.
  - `Teacher`: Tạo/quản lý môn học được phân công, quản lý chủ đề, soạn câu hỏi, tạo đề mẫu (`Exam`), lập ca thi (`ExamSession`), giám sát và xem kết quả ca thi.
  - `Student`: Xem ca thi được gán (`assigned_sessions`), làm bài thi, lưu nháp đáp án, nộp bài, xem kết quả được công bố.

- **Nguyên tắc an ninh bắt buộc**:
  - **Chống IDOR / BOLA**: Dùng Route Middleware (`role:*`) cho endpoint và **Laravel Policy** cho từng bản ghi. Thí sinh tuyệt đối không xem/sửa bài của nhau; Giảng viên chỉ thao tác trên môn/ca thi mình phụ trách.
  - **Zero-Leakage**: Tách biệt `QuestionAdminResource` (có đáp án/giải thích) và `QuestionStudentResource` (loại bỏ hoàn toàn `correct_answer`, `explanation`).
  - **Server-Authoritative Clock**: Backend từ chối nộp bài hoặc lưu đáp án khi quá hạn thời gian làm bài (+ buffer 15 giây bù trễ mạng).

---

## ⚙️ 3. Tiêu Chuẩn Kỹ Thuật Backend

- **Luồng xử lý chuẩn trong Controller**:
  `HTTP Request` $\rightarrow$ `Form Request (Validate input)` $\rightarrow$ `Policy ($this->authorize)` $\rightarrow$ `Action (nếu nghiệp vụ phức tạp/transaction) hoặc Eloquent` $\rightarrow$ `API Resource (Format JSON)`.
- **Database & Concurrency**:
  - Mọi quan hệ phải khai báo Khóa ngoại (FK) rõ ràng. Dùng `ON DELETE RESTRICT` cho lịch sử thi cử, `CASCADE` cho dữ liệu phụ thuộc (`attempt_answers`).
  - **Khóa bi quan (Pessimistic Locking)**: Nghiệp vụ Nộp bài thi (`SubmitExamAttemptAction`) bắt buộc bọc trong `DB::transaction()` kết hợp `lockForUpdate()` trên bản ghi `ExamAttempt` để triệt tiêu race condition và double-submit.
  - **Chống N+1**: Luôn Eager Loading (`with()`) khi truy vấn quan hệ. Bắt buộc phân trang (`paginate()`) trên mọi danh sách.

---

## 💻 4. Tiêu Chuẩn Kỹ Thuật Frontend

- **Module hóa theo Feature**: Đặt code theo module nghiệp vụ trong `src/features/{domain}/` (`auth`, `academic`, `exams`, `exam-taking`, `admin`).
- **Quản lý Server State**: Sử dụng TanStack Query (`useQuery`, `useMutation`) tập trung trong `features/*/hooks.ts`.
- **Phòng thi (Focus Room)**:
  - Tối giản, không có sidebar gây phân tâm.
  - Tự động lưu đáp án (**Debounced Autosave 500ms**) kèm trạng thái đồng bộ (`Đang lưu...`, `Đã lưu`, `Mất kết nối`).
  - Tự động nộp bài khi bộ đếm giờ server chạm mốc 0.
  - Phủ lớp **Watermark Canvas định danh thí sinh** xoay góc $-22^\circ$ chống chụp lén màn hình.

---

## 🧪 5. Kiểm Thử & Định Nghĩa Hoàn Thành (DoD)

Một tính năng chỉ được nghiệm thu khi đáp ứng 5 tiêu chuẩn:
1. ✅ **Form Request**: Validate dữ liệu đầu vào chặt chẽ qua `$request->validated()`.
2. ✅ **Phân quyền**: Role Middleware + Policy chống triệt để IDOR.
3. ✅ **Zero-Leakage**: Không rò rỉ `correct_answer` cho thí sinh làm bài.
4. ✅ **Feature Tests**: Viết kiểm thử đầy đủ các kịch bản (`200/201`, `401 Unauthorized`, `403 Forbidden/IDOR`, `422 Validation`) và chạy **PASS 100%**.
5. ✅ **Hiệu năng & An toàn**: Không N+1 query, luồng ghi nhạy cảm có Transaction + Lock bi quan, commit message tuân thủ Conventional Commits.
