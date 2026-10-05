# 02 — Functional Requirements Specification

**Dự án**: Exam Platform  
**Tài liệu**: `docs/01-requirements/02-REQUIREMENTS.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. Danh mục Mã định danh Yêu cầu Chức năng (Requirements Inventory)

Hệ thống yêu cầu chức năng được phân loại theo các module nghiệp vụ độc lập, mỗi yêu cầu có định danh duy nhất (`FR-<MODULE>-<NUMBER>`) để phục vụ ma trận truy xuất nguồn gốc (Traceability Matrix).

---

### 1.1. Module Xác thực & Tài khoản (AUTH & USER)

- **`FR-AUTH-001`**: Hệ thống phải cho phép người dùng đăng ký tài khoản mới với các thông tin: Họ và tên, email hợp lệ (không trùng lặp), mật khẩu tối thiểu 8 ký tự kèm xác nhận mật khẩu. Mặc định gán vai trò `student`.
- **`FR-AUTH-002`**: Hệ thống phải xác thực người dùng qua email và mật khẩu chính xác; cấp phát Sanctum Bearer Token có thời hạn sử dụng khi đăng nhập thành công.
- **`FR-AUTH-003`**: Hệ thống phải từ chối truy cập và trả về mã lỗi `401 Unauthorized` nếu thông tin đăng nhập không khớp hoặc token đã bị thu hồi/hết hạn.
- **`FR-AUTH-004`**: Hệ thống phải cho phép người dùng đăng xuất, ngay lập tức thu hồi và xóa Token truy cập hiện tại khỏi cơ sở dữ liệu.
- **`FR-AUTH-005`**: Hệ thống phải cung cấp endpoint `/auth/me` để trả về thông tin cá nhân và vai trò hiện tại của người dùng đang được xác thực.
- **`FR-USER-001`**: Chỉ người dùng có vai trò `admin` mới được quyền xem danh sách người dùng toàn hệ thống có hỗ trợ phân trang (`page`, `per_page`), lọc theo vai trò (`role`) và tìm kiếm theo tên hoặc email.
- **`FR-USER-002`**: Chỉ người dùng có vai trò `admin` mới được tạo mới, cập nhật thông tin (tên, vai trò, trạng thái kích hoạt) hoặc vô hiệu hóa tài khoản người dùng khác.
- **`FR-USER-003`**: Giảng viên (`teacher`) chỉ được phép xem danh sách thu gọn của các thí sinh (`student`) phục vụ mục đích phân công vào ca thi.

---

### 1.2. Module Môn học & Chủ đề (SUBJECT & TOPIC)

- **`FR-SUBJECT-001`**: Người dùng có vai trò `admin` hoặc `teacher` được phép tạo môn học mới với mã môn học (`code`) là duy nhất trên toàn hệ thống và tên môn học (`name`).
- **`FR-SUBJECT-002`**: Hệ thống phải cho phép xem danh sách môn học có phân trang và tìm kiếm theo tên/mã môn học. Mọi vai trò đã đăng nhập đều có quyền đọc.
- **`FR-SUBJECT-003`**: Chỉ `admin` hoặc `teacher` mới được sửa thông tin môn học hoặc xóa môn học rỗng (chưa chứa chủ đề nào). Nếu môn học đã có chủ đề, hành động xóa phải bị chặn (`RESTRICT`).
- **`FR-TOPIC-001`**: `admin` hoặc `teacher` được phép tạo các chủ đề (`topic`) trực thuộc một môn học cụ thể.
- **`FR-TOPIC-002`**: Hệ thống phải cung cấp danh sách chủ đề theo từng môn học (`GET /subjects/{id}/topics`) kèm số lượng câu hỏi hiện có trong từng chủ đề.

---

### 1.3. Module Ngân hàng Câu hỏi & Kiểm duyệt (QUESTION & REVIEW)

- **`FR-QUESTION-001`**: Hệ thống phải hỗ trợ 4 loại câu hỏi cơ bản:
  1. `single_choice`: Trắc nghiệm 1 đáp án đúng duy nhất.
  2. `multiple_choice`: Trắc nghiệm nhiều đáp án đúng.
  3. `true_false`: Trắc nghiệm Đúng/Sai.
  4. `short_answer`: Điền từ/câu trả lời ngắn chính xác.
- **`FR-QUESTION-002`**: Đối với câu hỏi trắc nghiệm (`single_choice`, `multiple_choice`, `true_false`), hệ thống bắt buộc phải có tối thiểu 2 phương án lựa chọn, mỗi phương án có định danh (`id`) và nội dung (`content`).
- **`FR-QUESTION-003`**: Đáp án đúng (`correct_answer`) phải được kiểm tra tính hợp lệ ngay khi tạo câu hỏi:
  - Với `single_choice` và `true_false`: Giá trị phải khớp với đúng một `id` phương án trong danh sách `options`.
  - Với `multiple_choice`: Giá trị phải là mảng các `id` phương án hợp lệ.
  - Với `short_answer`: Giá trị là chuỗi văn bản mẫu chuẩn.
- **`FR-QUESTION-004`**: Hệ thống phải hỗ trợ phân loại độ khó: `easy`, `medium`, `hard`.
- **`FR-QUESTION-005`**: Khi mới tạo, câu hỏi mặc định ở trạng thái `draft` hoặc `pending`.
- **`FR-REVIEW-001`**: Giảng viên hoặc Admin có thẩm quyền được quyền chuyển trạng thái câu hỏi từ `pending` sang `approved` hoặc `rejected`.
- **`FR-REVIEW-002`**: Khi từ chối (`rejected`), hệ thống bắt buộc phải lưu lý do từ chối (`rejection_reason`) để người soạn biết và chỉnh sửa.
- **`FR-QUESTION-006`**: Khi xóa câu hỏi, hệ thống phải sử dụng cơ chế **Soft Delete** (`deleted_at`), tuyệt đối không xóa cứng (Hard Delete) khỏi database để bảo toàn tính toàn vẹn của các đề thi lịch sử.

---

### 1.4. Module Đề thi Mẫu (EXAM TEMPLATE)

- **`FR-EXAM-001`**: Giảng viên hoặc Admin được phép tạo đề thi mẫu (`Exam`) gắn với một môn học cụ thể, thiết lập thời lượng làm bài (`duration_minutes > 0`), điểm sàn đạt yêu cầu (`pass_score`), và các cờ xáo trộn (`shuffle_questions`, `shuffle_options`).
- **`FR-EXAM-002`**: Hệ thống cho phép gán danh sách câu hỏi vào đề thi mẫu qua bảng trung gian `exam_questions`. Mỗi câu hỏi khi gắn vào đề phải được quy định thứ tự (`order`) và điểm số (`points > 0`).
- **`FR-EXAM-003`**: Hệ thống **chỉ cho phép gán các câu hỏi đã được phê duyệt (`status = 'approved'`)** vào đề thi. Nếu câu hỏi ở trạng thái `draft`, `pending`, hoặc `rejected`, hệ thống phải từ chối với lỗi `422 Unprocessable Content`.
- **`FR-EXAM-004`**: Mỗi khi có câu hỏi được thêm, sửa điểm hoặc gỡ khỏi đề thi, hệ thống phải tự động tính toán lại tổng điểm của đề thi (`total_points = SUM(exam_questions.points)`) trong cùng một Database Transaction.

---

### 1.5. Module Ca thi & Phân công (EXAM SESSION & ASSIGNMENT)

- **`FR-SESSION-001`**: Giảng viên hoặc Admin được phép khởi tạo một ca thi (`ExamSession`) dựa trên một mẫu đề thi (`Exam`), thiết lập tiêu đề, thời gian bắt đầu (`start_at`) và thời gian kết thúc (`end_at`).
- **`FR-SESSION-002`**: Thời gian kết thúc ca thi phải luôn lớn hơn thời gian bắt đầu (`end_at > start_at`). Thời lượng của ca thi (`end_at - start_at`) phải lớn hơn hoặc bằng thời lượng làm bài của đề thi (`duration_minutes`).
- **`FR-SESSION-003`**: Hệ thống cho phép phân công một hoặc nhiều giảng viên làm giám thị cho ca thi (`session_teachers`). Nghiêm cấm trùng lặp một giảng viên nhiều lần trong cùng một ca thi.
- **`FR-ASSIGNMENT-001`**: Hệ thống cho phép phân công danh sách thí sinh vào ca thi (`session_assignments`). Mỗi thí sinh chỉ được phân công duy nhất 01 lần trong cùng một ca thi (ràng buộc duy nhất `exam_session_id + student_id`).
- **`FR-SESSION-004`**: Ca thi được tạo ban đầu ở trạng thái `draft`. Chỉ được phép xuất bản (`publish`) khi:
  1. Đề thi mẫu có ít nhất 01 câu hỏi (`questions_count > 0`).
  2. Ca thi có ít nhất 01 thí sinh được phân công (`assignments_count > 0`).
  3. Thời điểm hiện tại chưa vượt quá thời gian kết thúc ca thi (`now < end_at`).
- **`FR-SESSION-005`**: Khi ca thi đã `published`, hệ thống khóa chỉnh sửa cấu trúc đề thi mẫu để đảm bảo tính đồng nhất.
- **`FR-SESSION-006`**: Khi hết thời gian `end_at`, ca thi tự động hoặc được giám thị chủ động chuyển sang trạng thái `closed`. Khi đã đóng, không thí sinh nào được phép bắt đầu bài thi mới.

---

### 1.6. Module Phòng thi Trực tuyến & Lượt thi (EXAM ATTEMPT)

- **`FR-ATTEMPT-001`**: Thí sinh được phép bắt đầu một lượt làm bài thi (`StartExamAttempt`) khi và chỉ khi thỏa mãn đồng thời 4 điều kiện:
  1. Thí sinh đã được phân công vào ca thi (`session_assignments` tồn tại cặp `session_id + student_id`).
  2. Ca thi đang ở trạng thái `published`.
  3. Thời điểm gọi API nằm trong khung giờ mở ca thi: `start_at <= now <= start_at + allow_late_minutes`.
  4. Số lượt làm bài hiện tại của thí sinh trong ca thi này chưa vượt quá `max_attempts`.
- **`FR-ATTEMPT-002`**: Khi bắt đầu lượt thi, hệ thống ghi nhận `started_at = NOW()`, trạng thái `status = 'in_progress'`, và tính toán chính xác số giây còn lại (`remaining_seconds`) dựa trên đồng hồ máy chủ.
- **`FR-ATTEMPT-003`**: Thí sinh chỉ được quyền xem chi tiết lượt thi của chính mình (`attempt.student_id === authenticated_user.id`). Bất kỳ truy cập vào `attempt_id` của thí sinh khác phải bị chặn với mã lỗi `403 Forbidden` (Chống IDOR).
- **`FR-ATTEMPT-004`**: Khi trả về nội dung đề thi cho thí sinh (`GET /exam-attempts/{id}`), hệ thống **tuyệt đối không bao gồm `correct_answer`, `explanation`, hay tiêu chí chấm điểm**. Chỉ trả về: `question_id`, `question_text`, `question_type`, `points`, `options` (chỉ gồm `id` và `content`), và câu trả lời thí sinh đã lưu trước đó (`saved_answer`).

---

### 1.7. Module Lưu đáp án & Nộp bài (ANSWER & SUBMIT)

- **`FR-ANSWER-001`**: Thí sinh được phép lưu đáp án cho từng câu hỏi (`PATCH /exam-attempts/{id}/answers`) khi lượt thi đang ở trạng thái `in_progress` và thời gian làm bài chưa hết.
- **`FR-ANSWER-002`**: Hệ thống phải kiểm tra tính hợp lệ của câu trả lời:
  - `question_id` phải thuộc danh sách câu hỏi của đề thi trong ca thi này.
  - Các lựa chọn trong câu trả lời phải là tập con của các `id` phương án thuộc câu hỏi đó.
- **`FR-ANSWER-003`**: Đáp án được lưu dạng `upsert` vào bảng `attempt_answers` (cặp `attempt_id + question_id` là duy nhất).
- **`FR-SUBMIT-001`**: Thí sinh được quyền nộp bài thi chính thức (`POST /exam-attempts/{id}/submit`) bất kỳ lúc nào trước khi hết giờ hoặc khi đồng hồ đếm ngược chạm 0.
- **`FR-SUBMIT-002`**: Thao tác nộp bài phải thực thi trong một Database Transaction có cơ chế khóa dòng (`Pessimistic Locking / SELECT ... FOR UPDATE`) để ngăn chặn tuyệt đối lỗi nộp đúp (Double Submit).
- **`FR-SUBMIT-003`**: Nếu lượt thi đã ở trạng thái `submitted` hoặc `closed`, hệ thống phải từ chối yêu cầu nộp tiếp theo với mã lỗi `409 Conflict`.
- **`FR-SUBMIT-004`**: Khi nộp bài thành công, hệ thống cập nhật `status = 'submitted'`, ghi nhận thời điểm nộp `submitted_at = NOW()`, và khóa hoàn toàn khả năng chỉnh sửa đáp án (`FR-ANSWER-001` sẽ từ chối).

---

### 1.8. Module Chấm điểm & Kết quả (SCORING & RESULT)

- **`FR-SCORING-001`**: Ngay sau khi nộp bài thành công, hệ thống tự động kích hoạt tiến trình chấm điểm độc lập (`AttemptScorer`):
  - So sánh từng đáp án đã lưu trong `attempt_answers` với `correct_answer` gốc trong bảng `questions`.
  - Đối với `single_choice` và `true_false`: Khớp chính xác nhận 100% số điểm của câu hỏi (`points`), sai nhận 0 điểm.
  - Đối với `multiple_choice`: Khớp chính xác toàn bộ danh sách lựa chọn đúng nhận 100% số điểm, chọn thiếu hoặc chọn thừa phương án sai nhận 0 điểm (theo quy tắc `A-003`).
- **`FR-SCORING-002`**: Hệ thống cập nhật tổng điểm đạt được (`score`) và tổng điểm tối đa của đề thi (`total_points`) vào bản ghi `exam_attempts`.
- **`FR-RESULT-001`**: Thí sinh chỉ được xem kết quả điểm số sau khi nộp bài nếu ca thi được cấu hình cho phép xem điểm tức thì (`show_result_immediately = true`). Nếu không, chỉ hiển thị trạng thái "Đã nộp bài thành công, điểm số sẽ được công bố sau".

---

### 1.9. Module Giám sát Phòng thi (PROCTORING)

- **`FR-PROCTORING-001`**: Hệ thống phải cung cấp endpoint tiếp nhận tín hiệu giám sát (`POST /exam-attempts/{id}/proctoring-events`) từ trình duyệt của thí sinh.
- **`FR-PROCTORING-002`**: Hệ thống phải xác thực và chỉ chấp nhận các loại sự kiện được định nghĩa trước:
  - `tab_hidden`: Thí sinh chuyển sang tab trình duyệt khác hoặc thu nhỏ cửa sổ.
  - `window_blur`: Cửa sổ làm bài thi bị mất tiêu điểm (focus).
  - `fullscreen_exit`: Thí sinh thoát khỏi chế độ toàn màn hình.
  - `devtools_opened`: Phát hiện mở công cụ kiểm tra phần tử trình duyệt.
  - `copy_paste_attempt`: Thí sinh cố tình sao chép nội dung câu hỏi hoặc dán dữ liệu.
- **`FR-PROCTORING-003`**: Máy chủ tự động gắn mức độ nghiêm trọng (`severity`: `low`, `medium`, `high`, `critical`) dựa trên loại sự kiện và tần suất lặp lại, không cho phép client tự gửi severity giả mạo.
- **`FR-PROCTORING-004`**: Endpoint ghi nhận vi phạm phải được áp dụng giới hạn tần suất (Rate Limiting) tối đa **30 requests/phút/thí sinh** để ngăn chặn tấn công DoS.
- **`FR-PROCTORING-005`**: Giám thị và Admin được quyền xem danh sách tổng hợp và dòng thời gian (Timeline) các sự kiện vi phạm của từng thí sinh trong ca thi.

---

### 1.10. Module Thống kê & Báo cáo (STATISTICS)

- **`FR-STAT-001`**: Hệ thống phải cung cấp báo cáo tổng quan ca thi cho giảng viên: Tổng số thí sinh được gán, số thí sinh đã vào thi, số thí sinh đã nộp bài, số thí sinh vắng thi.
- **`FR-STAT-002`**: Hệ thống cung cấp bảng điểm chi tiết của ca thi kèm điểm trung bình, điểm cao nhất, điểm thấp nhất và phổ điểm theo khoảng (ví dụ: `< 5.0`, `5.0 - 6.5`, `6.5 - 8.0`, `8.0 - 10.0`).
- **`FR-STAT-003`**: Hệ thống hỗ trợ lọc kết quả thi theo trạng thái đạt/chưa đạt (`passed` / `failed`) dựa trên ngưỡng `pass_score` của đề thi.
