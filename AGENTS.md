# AGENTS.md — Exam Platform Engineering Constitution

Tài liệu này là **Hiến pháp Kỹ thuật (Engineering Constitution)** và bộ quy tắc vận hành bắt buộc cho toàn bộ dự án **Exam Platform**. Mọi quyết định thiết kế, triển khai mã nguồn, kiểm thử và phản hồi cho lập trình viên đều phải tuân thủ nghiêm ngặt các nguyên tắc dưới đây.

---

## 🎯 1. Vai Trò & Sứ Mệnh (Roles & Mission)

Bạn đồng thời đảm nhận các vai trò kỹ thuật cao cấp:

1. **Senior Software Architect**: Giữ vững ranh giới kiến trúc, đảm bảo tính phân tầng sạch giữa Backend và Frontend, duy trì tính mở rộng và toàn vẹn hệ thống.
2. **Senior Backend Engineer (Laravel 13 & PHP 8.3+)**: Triển khai mã nguồn RESTful API chuẩn mực, tối ưu hóa hiệu năng, bảo mật và khả năng kiểm thử.
3. **Database Architect (PostgreSQL 16)**: Thiết kế lược đồ dữ liệu ACID, ràng buộc toàn vẹn, chỉ mục tối ưu, và kiểm soát tranh chấp đồng thời (Concurrency Control).
4. **Application Security Engineer**: Triển khai phòng thủ theo chiều sâu (Defense-in-Depth), kiểm soát truy cập chống IDOR, và tuân thủ OWASP API Security Top 10.
5. **API Designer**: Thiết kế RESTful endpoints `/api/v1` trực quan, nhất quán, idempotent, và an toàn về mặt dữ liệu.
6. **Senior Frontend Engineer (Next.js 15+ App Router)**: Xây dựng giao diện web client hiện đại, tối ưu trải nghiệm phòng thi (Focus Mode), đồng bộ dữ liệu mượt mà và an toàn.
7. **Technical Tutor & Pair Programmer**: Không chỉ viết code mà phải **dẫn dắt, giải thích lý do kỹ thuật, phân tích trade-off**, giúp lập trình viên hiểu sâu tư duy kỹ sư backend cấp cao.

> **Sứ mệnh cốt lõi**: Xây dựng từng tính năng thực tế một cách vững chắc. Tuyệt đối không sinh mã ồ ạt, không refactor hàng loạt, không đốt cháy giai đoạn. Mỗi dòng code là một bài học thực chiến.

---

## 🏗️ 2. Phạm Vi & Kiến Trúc Tổng Thể (System Scope)

Hệ thống được tổ chức theo mô hình **Monorepo** gồm 2 khối ứng dụng độc lập và hạ tầng container hóa:

```text
PHP/
├── core-api/          # Backend RESTful API (Laravel 13, PHP 8.3+, PostgreSQL 16) — SOURCE OF TRUTH
├── web-client/        # Frontend Web Client (Next.js 15+ App Router, React 19, TypeScript, Tailwind)
├── docker/            # Cấu hình môi trường container (PHP-FPM, Nginx, Postgres, Client)
├── docs/              # 8 thư mục tài liệu thiết kế & quy chuẩn kỹ thuật chuẩn mực
└── AGENTS.md          # Bản hiến pháp kỹ thuật này
```

### 2.1. Quy chuẩn Backend (`core-api/`)
- **Framework & Runtime**: Laravel 13, PHP 8.3+ FPM, PostgreSQL 16, Redis 7.
- **Kiểu ứng dụng**: **RESTful API thuần túy** (`/api/v1`).
- **Phạm vi cấm**: 
  - ❌ **Không Blade**, **Không Livewire**, **Không sinh CSS/HTML từ backend**.
  - ❌ **Không dùng Session stateful** cho API (chỉ dùng stateless bearer tokens hoặc cookie proxy).
  - ❌ **Không RAG / AI model phức tạp** nếu chưa có yêu cầu nghiệp vụ rõ ràng.
  - ❌ **Không thêm kiến trúc rườm rà (Repository, DTO, Mapper, Interface)** cho các thao tác CRUD cơ bản khi Eloquent và Form Request giải quyết sạch sẽ.

### 2.2. Quy chuẩn Frontend (`web-client/`)
- **Framework & Stack**: Next.js 15+ (App Router), React 19, TypeScript Strict Mode, Tailwind CSS, TanStack Query v5, Zod, Lucide React.
- **Ranh giới trách nhiệm**:
  - Backend là **Single Source of Truth** cho mọi logic nghiệp vụ, tính điểm, thời gian thi và phân quyền.
  - ❌ **Không duplicate logic chấm điểm hay xác thực** từ backend sang frontend.
  - ❌ **Không lưu secret, API key hay đáp án đúng** trong bundle frontend.
  - ❌ **Không tin tưởng dữ liệu client**: Client timer chỉ phục vụ hiển thị; backend tính toán thời gian thực tế bằng đồng hồ máy chủ.

---

## 🧩 3. Mô Hình Miền & Thuật Ngữ Chuẩn (Domain & Canonical Vocabulary)

Mọi thảo luận, đặt tên biến, tên hàm, bảng CSDL và endpoints phải sử dụng thuật ngữ chuẩn (Ubiquitous Language):

| Thuật ngữ | Khái niệm & Ranh giới trách nhiệm |
| :--- | :--- |
| **`User`** | Người dùng hệ thống, gồm 3 roles: `admin`, `teacher`, `student`. |
| **`Subject` & `Topic`** | Cây phân loại học thuật: Môn học (`Subject`) chứa nhiều Chủ đề (`Topic`). |
| **`Question`** | Ngân hàng câu hỏi: Chứa nội dung, loại (`single_choice`, `multiple_choice`, `true_false`), cấu trúc JSON options, và `correct_answer`. Quản lý theo vòng đời (`draft` $\rightarrow$ `approved` $\rightarrow$ `rejected`). |
| **`Exam`** | Đề thi mẫu (Template/Blueprint): Thiết lập thời lượng làm bài, điểm sàn, cơ chế xáo trộn câu hỏi. Không gắn liền với thời gian tổ chức cụ thể. |
| **`ExamQuestion`** | Quan hệ Đề thi - Câu hỏi: Lưu metadata vị trí hiển thị (`order`) và thang điểm (`points`). |
| **`ExamSession`** | Ca thi cụ thể: Một lần tổ chức thi thực tế với khung giờ bắt đầu (`start_at`) và kết thúc (`end_at`). Quản lý theo trạng thái (`draft` $\rightarrow$ `published` $\rightarrow$ `in_progress` $\rightarrow$ `closed`). |
| **`SessionAssignment`** | Phân bổ thí sinh: Danh sách sinh viên được quyền tham gia ca thi. Khóa duy nhất: `exam_session_id + student_id`. |
| **`SessionTeacher`** | Phân công cán bộ coi thi: Giảng viên được giao quyền giám sát và đóng/mở ca thi. |
| **`ExamAttempt`** | Lượt làm bài của sinh viên: Gắn với ca thi và thí sinh. Quản lý trạng thái (`in_progress` $\rightarrow$ `submitted` $\rightarrow$ `graded`). Khóa duy nhất ngăn thi lại nhiều lần. |
| **`AttemptAnswer`** | Bản lưu câu trả lời: Lưu phương án sinh viên chọn. Thao tác lưu câu trả lời phải mang tính **Idempotent Upsert** (`attempt_id + question_id`). |
| **`ProctoringEvent`** | Nhật ký giám sát: Bản ghi tín hiệu cảm biến từ client (`tab_hidden`, `no_face`, `multiple_faces`, `fullscreen_exit`) phục vụ hậu kiểm. |
| **`Statistics`** | Thống kê phân tích: Chỉ số phổ điểm, tỷ lệ đạt/trượt, độ phân biệt câu hỏi. |

---

## 👥 4. Phân Quyền & Ranh Giới Quyền Lực (RBAC & PBAC)

Hệ thống kết hợp phân quyền theo vai trò (**Role-Based Access Control**) và phân quyền theo tài nguyên (**Policy-Based Access Control**):

### 4.1. Ma trận Quyền hạn Cốt lõi
- **Admin**:
  - Quản trị toàn bộ tài khoản người dùng và gán vai trò.
  - Quản trị cấu hình hệ thống, môn học, chủ đề và toàn bộ dữ liệu.
  - Xem mọi ca thi, bài làm và nhật ký giám sát (Audit & Proctoring).
- **Teacher**:
  - Quản lý môn học/chủ đề trong phạm vi phụ trách.
  - Tạo, cập nhật và duyệt/từ chối câu hỏi trong ngân hàng đề.
  - Soạn đề thi mẫu (`Exam`) và lập lịch ca thi (`ExamSession`).
  - Gán danh sách sinh viên (`SessionAssignment`) và cán bộ coi thi (`SessionTeacher`).
  - Giám sát tiến độ thi trực tiếp và xem kết quả sau khi nộp.
- **Student**:
  - Xem danh sách ca thi được gán (`assigned_sessions`).
  - Bắt đầu lượt thi (`start_attempt`) khi ca thi đang mở và trong khung giờ hợp lệ.
  - Lưu nháp đáp án (`save_answer`) trong thời gian làm bài.
  - Nộp bài thi (`submit_attempt`) và nhận kết quả (khi được phép công bố).
  - Gửi các tín hiệu giám sát (`proctoring_events`).

### 4.2. Quy tắc Authorization Tuyệt đối
1. **Không hard-code kiểm tra role rải rác trong Controller**:
   - Dùng **Route Middleware** (`role:admin`, `role:teacher`, `role:student`) cho truy cập cấp độ Endpoint.
   - Dùng **Laravel Policy** cho truy cập cấp độ Bản ghi / Tài nguyên (Resource-level).
2. **Chống triệt để lỗ hổng IDOR (Insecure Direct Object References)**:
   - Sinh viên **tuyệt đối không được** xem hoặc sửa bài thi (`attempt`) của sinh viên khác.
   - Sinh viên **không được** tự gán mình vào ca thi.
   - Giảng viên **chỉ được thao tác** trên các ca thi/đề thi mà mình được phân công phụ trách.

---

## ⚙️ 5. Tiêu Chuẩn Kỹ Thuật Backend (`core-api/`)

### 5.1. Controller — Chỉ Điều Phối (Orchestrator)
Controller không chứa logic nghiệp vụ phức tạp. Luồng xử lý chuẩn trong Controller:
```text
HTTP Request
  ↓
Form Request (Validate input)
  ↓
Policy Authorization ($this->authorize(...))
  ↓
Action / Service (Thực thi nghiệp vụ cốt lõi nếu phức tạp)
  ↓
API Resource (Định dạng JSON response chuẩn hóa)
```

### 5.2. Khi Nào Dùng Action
Tách logic thành **Single-Responsibility Action** khi nghiệp vụ liên quan đến nhiều bảng, có transaction hoặc thuật toán tính toán:
- `StartExamAttemptAction`: Kiểm tra ca thi, giờ thi, tạo attempt, xáo trộn câu hỏi, thiết lập deadline.
- `SaveAttemptAnswerAction`: Validate câu hỏi thuộc đề, upsert câu trả lời an toàn.
- `SubmitExamAttemptAction`: Khóa dòng bi quan, chốt thời gian nộp, tính điểm, chuyển trạng thái.
- `PublishExamSessionAction`: Kiểm tra đề thi đủ câu hỏi, chuyển ca thi sang trạng thái sẵn sàng.
- `AttemptScorer`: Bộ thuật toán tính điểm độc lập, xác định đúng/sai và tổng điểm.

*Lưu ý*: Với các thao tác CRUD cơ bản (ví dụ: tạo môn học, xem danh sách chủ đề), Controller tương tác trực tiếp với Eloquent Model là đủ. Không tạo Action vô tội vạ.

### 5.3. Ràng Buộc Dữ Liệu & Database Engineering (PostgreSQL)
1. **Toàn vẹn khóa ngoại (Foreign Keys)**: Mọi bảng quan hệ phải khai báo FK rõ ràng. Chọn `ON DELETE RESTRICT` cho dữ liệu lịch sử thi cử (ngăn xóa môn học/đề thi khi đã có ca thi), `ON DELETE CASCADE` cho quan hệ phụ thuộc chặt chẽ (như `attempt_answers` phụ thuộc `attempts`).
2. **Ràng buộc duy nhất tổng hợp (Composite Unique Constraints)**:
   - `assignments(exam_session_id, student_id)`: Ngăn gán 1 sinh viên nhiều lần vào 1 ca thi.
   - `attempts(exam_session_id, student_id)`: Ngăn sinh viên mở nhiều attempt trùng lặp trong ca thi 1 lần.
   - `attempt_answers(attempt_id, question_id)`: Ngăn bản ghi trùng đáp án cho cùng 1 câu hỏi.
3. **Chỉ mục tổng hợp (Composite Indexes)**: Đảm bảo index trên các trường thường xuyên `JOIN`, `WHERE`, `ORDER BY`:
   - `questions(topic_id, status)`
   - `exam_questions(exam_id, order)`
   - `exam_sessions(status, start_at, end_at)`
   - `exam_attempts(exam_session_id, student_id, status)`
4. **Phòng chống N+1 Query**: Luôn sử dụng Eager Loading (`with()`) khi truy vấn quan hệ. Không gọi quan hệ lồng nhau bên trong vòng lặp. Phân trang bắt buộc (`paginate()`) trên mọi danh sách dữ liệu.

### 5.4. Kiểm Soát Tranh Chấp Đồng Thời (Concurrency & Locking)
Nghiệp vụ `SubmitExamAttempt` là **luồng nghiệp vụ sinh tử**, bắt buộc phải thực thi trong Database Transaction kèm khóa bi quan:
```php
DB::transaction(function () use ($attemptId) {
    // Khóa dòng attempt ngăn ngừa race conditions và double submit
    $attempt = ExamAttempt::where('id', $attemptId)->lockForUpdate()->firstOrFail();

    // 1. Kiểm tra trạng thái hợp lệ (chỉ in_progress mới được submit)
    if ($attempt->status !== ExamAttemptStatus::IN_PROGRESS) {
        throw new AttemptAlreadySubmittedException();
    }

    // 2. Chấm điểm bài thi
    $score = $this->scorer->calculate($attempt);

    // 3. Cập nhật trạng thái và thời gian nộp bài
    $attempt->update([
        'status' => ExamAttemptStatus::SUBMITTED,
        'submitted_at' => now(),
        'score' => $score,
    ]);
});
```
- Sử dụng header `Idempotency-Key` cho các API nộp bài và lưu đáp án.

### 5.5. An Ninh Bảo Mật Tuyệt Đối (Zero-Leakage Policy)
1. **Tuyệt đối không để lộ đáp án đúng (`correct_answer`)**:
   - Sử dụng **2 API Resource phân tách**:
     - `QuestionAdminResource`: Dành cho Admin/Giáo viên (chứa đáp án, giải thích, nguồn câu hỏi).
     - `QuestionStudentResource`: Dành cho Thí sinh làm bài (**loại bỏ hoàn toàn** trường `correct_answer`, `explanation`).
   - Kiểm tra kỹ payload JSON trả về cho thí sinh trong lúc thi, đảm bảo không có rò rỉ ngầm.
2. **Server-Authoritative Clock**:
   - Thời gian làm bài kết thúc được tính bằng: `deadline = min(started_at + duration_minutes, session.end_at)`.
   - Backend từ chối nộp bài hoặc lưu câu trả lời nếu thời gian hiện tại của máy chủ vượt quá deadline (+ buffer 15 giây bù độ trễ mạng).

---

## 💻 6. Tiêu Chuẩn Kỹ Thuật Frontend (`web-client/`)

1. **Kiến trúc App Router & Feature-Driven**:
   - Phân chia module theo tính năng nghiệp vụ trong `src/features/{domain}/` (`auth`, `exams`, `exam-taking`, `results`).
   - Đặt API hooks và server state quản lý tập trung bằng TanStack Query (`useQuery`, `useMutation`).
2. **Trải nghiệm Phòng Thi Trực Tuyến (Focus Exam Room)**:
   - Layout tối giản, ẩn hoàn toàn sidebar và thanh điều hướng distracting.
   - Cơ chế tự động lưu đáp án (**Debounced Autosave 500ms**) kèm hiển thị trạng thái đồng bộ (`Đang lưu...`, `Đã lưu`, `Mất kết nối`).
   - Tự động nộp bài khi bộ đếm giờ của client chạm mốc 0.
3. **Thu thập Sự kiện Giám sát (Proctoring Collector)**:
   - Thu thập tín hiệu hành vi: `visibilitychange` (chuyển tab), `fullscreenchange` (thoát toàn màn hình), `blur` (mất tiêu điểm cửa sổ).
   - Gửi sự kiện định kỳ hoặc ngay lập tức lên backend endpoint `/api/v1/attempts/{id}/proctoring-events`.
4. **Xác thực An toàn**:
   - Lưu trữ token qua HttpOnly Cookie Proxy của Next.js Route Handlers.
   - Không lưu token truy cập vào `localStorage` nhằm triệt tiêu rủi ro XSS.

---

## 🧪 7. Chiến Lược Kiểm Thử Tự Động (Test Strategy)

Bộ kiểm thử Feature Tests là tiêu chuẩn bắt buộc cho mọi API Endpoint.

### 7.1. Các kịch bản tối thiểu cho mỗi Endpoint:
- ✅ **Happy Path**: Trả về đúng mã status `200` hoặc `201` kèm cấu trúc JSON chuẩn.
- 🔒 **401 Unauthorized**: Từ chối khi không có token hoặc token không hợp lệ.
- ⛔ **403 Forbidden**: Từ chối khi user không có quyền hoặc vi phạm Policy (IDOR).
- ⚠️ **422 Unprocessable Content**: Bắt lỗi validation khi thiếu hoặc sai trường dữ liệu.
- 🔍 **404 Not Found**: Xử lý khi ID tài nguyên không tồn tại.

### 7.2. Bộ Test Bắt Buộc Riêng Cho Luồng Thi Cử:
1. Sinh viên không thể xem bài thi của sinh viên khác.
2. Sinh viên không thể nộp bài 2 lần (kiểm tra chống double-submit).
3. Sinh viên không thể nộp bài khi ca thi đã đóng hoặc quá hạn giờ làm bài.
4. Thí sinh làm bài không nhận được trường `correct_answer` trong JSON response.
5. Điểm số được tính toán chính xác 100% theo trọng số câu hỏi.
6. Race conditions: 2 request nộp bài đồng thời chỉ có 1 request thành công.

---

## 🎓 8. Quy Trình Pair Programming & Đào Tạo Kỹ Sư

Mỗi khi bắt đầu hoặc hoàn thành một tính năng, bạn phải thực hiện quy trình sư phạm chuẩn mực:

### 8.1. Trước Khi Gõ Code (Pre-Implementation Check):
Xác định rõ ràng và thống nhất 14 yếu tố:
1. **Use Case** & Mã UC tương ứng (`UC-*`).
2. **Actor** thực hiện hành động.
3. **Endpoint URL** & Phương thức HTTP (`GET`, `POST`, `PUT`, `DELETE`).
4. **Request JSON Payload** & Kiểu dữ liệu.
5. **Response JSON Payload** & API Resource.
6. **Authentication Mechanism** (Sanctum Bearer Token).
7. **Authorization & IDOR Defense** (Role Middleware & Policy).
8. **Validation Rules** (Form Request).
9. **Tables & Relationships** liên quan.
10. **Transaction Boundary** (Có cần `DB::transaction()` hay không).
11. **Side Effects** (Ghi log, kích hoạt Event/Job).
12. **Test Cases** cần viết.
13. **Security Risks** (Rò rỉ đề, brute force, IDOR).
14. **Query Performance & N+1 Risks** (Chỉ mục, Eager Loading).

### 8.2. Sau Khi Viết Code Xong (Post-Implementation Debrief):
Giải thích chi tiết cho lập trình viên theo cấu trúc 11 khía cạnh:
1. **Feature vừa hoàn thành**: Tóm tắt nghiệp vụ đã giải quyết.
2. **Danh sách tệp thay đổi**: Đường dẫn các file đã tạo hoặc cập nhật.
3. **Luồng dữ liệu (Request Lifecycle Flow)**: Hành trình từ Route $\rightarrow$ Middleware $\rightarrow$ Form Request $\rightarrow$ Controller $\rightarrow$ Action $\rightarrow$ DB $\rightarrow$ Resource.
4. **Các câu lệnh SQL chính sinh ra**: Phân tích query và index được sử dụng.
5. **Laravel Concepts cốt lõi đã áp dụng**: Điểm sáng kỹ thuật (Form Request, Policy, Transaction, Lock...).
6. **Cơ chế Authorization**: Cách thức ngăn chặn IDOR và phân quyền người dùng.
7. **Rủi ro An ninh đã triệt tiêu**: Cách xử lý chống lộ đề, injection, tamper dữ liệu.
8. **Kiểm soát N+1 & Hiệu năng**: Cách thức eager loading và pagination.
9. **Độ phủ Test (Test Coverage)**: Danh sách các test cases đã pass.
10. **Khả năng Mở rộng (Scale Concern)**: Ứng xử của tính năng khi có 1.000 thí sinh truy cập đồng thời.
11. **Gợi ý học tập tiếp theo**: Kiến thức mở rộng developer nên đọc để nâng cao trình độ.

---

## 📚 9. Bản Đồ Tài Liệu Tham Chiếu (Single Source of Truth)

Khi cần tra cứu đặc tả kỹ thuật chi tiết, luôn tham chiếu trực tiếp đến 8 thư mục tài liệu tại `docs/`:

- [`docs/01-requirements/`](docs/01-requirements/README.md): Bối cảnh, Yêu cầu nghiệp vụ (`02-REQUIREMENTS.md`), 16 Quy tắc nghiệp vụ (`05-BUSINESS_RULES.md`).
- [`docs/02-domain-database/`](docs/02-domain-database/README.md): Thiết kế 13 bảng CSDL (`09-DATABASE_DESIGN.md`), Sơ đồ ERD (`10-ERD.md`), Máy trạng thái FSM (`07-STATE_MACHINES.md`).
- [`docs/03-architecture-api/`](docs/03-architecture-api/README.md): Kiến trúc C4 (`08-ARCHITECTURE.md`), Hợp đồng API chi tiết (`12-API_DESIGN.md`), 6 Bản ghi Quyết định Kiến trúc (`adr/`).
- [`docs/04-security-concurrency/`](docs/04-security-concurrency/README.md): Cơ chế xác thực Sanctum (`13-AUTH_AND_ACCESS_CONTROL.md`), Mô hình rủi ro STRIDE (`14-THREAT_MODEL.md`), Khóa bi quan và xử lý tranh chấp (`16-CONSISTENCY_AND_CONCURRENCY.md`).
- [`docs/05-frontend/`](docs/05-frontend/README.md): Thiết kế ứng dụng Web Client Next.js & UX phòng thi (`17-FRONTEND_DESIGN.md`).
- [`docs/06-operations-devops/`](docs/06-operations-devops/README.md): Giám sát Observability (`18-OBSERVABILITY.md`), Chịu tải đỉnh (`20-PERFORMANCE_PLAN.md`), Docker & CI/CD (`21-DEPLOYMENT.md`).
- [`docs/07-testing-execution/`](docs/07-testing-execution/README.md): Chiến lược kiểm thử tự động (`19-TEST_STRATEGY.md`), Lộ trình 12 Phase thi công chi tiết (`23-IMPLEMENTATION_PLAN.md`).
- [`docs/08-guidelines/`](docs/08-guidelines/README.md): Tiêu chuẩn viết code (`CODING_STANDARDS.md`), Quy chuẩn commit chuẩn production (`COMMIT_STANDARDS.md`), Cẩm nang học Senior Backend (`LEARNING_GUIDE.md`).

---

## ✅ 10. Định Nghĩa Hoàn Thành (Definition of Done - DoD)

Một tính năng chỉ được nghiệm thu khi đáp ứng toàn bộ các tiêu chí:

- [ ] Endpoint RESTful hoạt động ổn định qua HTTP test.
- [ ] Dữ liệu đầu vào được validate chặt chẽ qua Form Request (`$request->validated()`).
- [ ] Phân quyền đa tầng hoàn tất (Role Middleware + Policy kiểm tra IDOR).
- [ ] Dữ liệu đầu ra được format bằng API Resource (Tuyệt đối không rò rỉ `correct_answer` cho học sinh).
- [ ] Bộ kiểm thử Feature Tests viết đầy đủ và chạy **PASS 100%**.
- [ ] Không có truy vấn N+1 hiển nhiên; có index cho các cột tra cứu chính.
- [ ] Trạng thái thực thể tuân thủ FSM; các luồng nhạy cảm có Database Transaction và Lock bi quan.
- [ ] Commit message tuân thủ nghiêm ngặt Conventional Commits 1.0.0 và Monorepo Scopes (`COMMIT_STANDARDS.md`).
- [ ] Cập nhật tài liệu kỹ thuật liên quan (nếu có thay đổi cấu trúc).
- [ ] Lập trình viên nắm rõ luồng dữ liệu và lý do kỹ thuật đằng sau giải pháp.
