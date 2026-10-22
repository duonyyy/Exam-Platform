# 00 — Bảng Thuật Ngữ Miền (Ubiquitous Language & Domain Glossary)

**Dự án**: Exam Platform  
**Tài liệu**: `docs/02-domain-database/00-GLOSSARY.md`  
**Áp dụng Skill**: `domain-modeling` (Domain-Driven Design)  
**Trạng thái**: Approved Core Reference  

---

## 1. Bản Đồ Ngữ Cảnh Bounded Contexts

Hệ thống Exam Platform được phân định ranh giới thành 4 Bounded Contexts độc lập:

1. **Academic Catalog Context**: Quản lý cây phân cấp học thuật Môn học (`Subject`) và Chủ đề (`Topic`).
2. **Examination & Assessment Context**: Ngân hàng câu hỏi (`Question`), Đề thi mẫu (`Exam`), Ca thi (`ExamSession`), Lượt thi (`ExamAttempt`), và Chấm điểm (`AttemptScorer`).
3. **Proctoring & Audit Context**: Thu thập sự kiện giám sát client (`ProctoringEvent`), Đánh giá rủi ro (`ProctoringSeverityResolver`).
4. **Intelligent Orchestration Context (ExamOps)**: Lập ma trận đề thi (`ExamBlueprint`), Thẩm định độ sẵn sàng (`ReadinessReview`), và Cổng duyệt (`ApprovalProposal`).

---

## 2. Từ Điển Thuật Ngữ Miền Chuẩn (Ubiquitous Language)

| Thuật ngữ Canonical | Định nghĩa nghiệp vụ & Ranh giới trách nhiệm | Ràng buộc bất biến (Invariants) |
| :--- | :--- | :--- |
| **`User`** | Người dùng hệ thống, gồm 3 vai trò: `admin`, `teacher`, `student`. | Không thể tồn tại user không có vai trò; tài khoản `is_active = false` bị thu hồi quyền truy cập tức thì. |
| **`Subject`** | Học phần / Môn học trong chương trình đào tạo. Lưu trữ `owner_teacher_id` (Giảng viên phụ trách) và `created_by` (Người tạo). | Mã môn học (`code`) là duy nhất toàn cục; không thể xóa môn học khi đã có đề thi hoặc ca thi liên kết (`ON DELETE RESTRICT`). |
| **`Topic`** | Chủ đề kiến thức hoặc chương mục thuộc một Môn học. | Thuộc về duy nhất 1 môn học (`subject_id`); câu hỏi gắn với topic. |
| **`Question`** | Câu hỏi trong ngân hàng đề, hỗ trợ 4 định dạng: `single_choice`, `multiple_choice`, `true_false`, `short_answer`. | Trạng thái chuyển đổi trực tiếp `ready ↔ disabled`. Tuyệt đối không cho phép sửa câu hỏi một khi đã được gắn vào đề thi mẫu. |
| **`Exam`** | Đề thi mẫu (Template/Blueprint): Thiết lập thời lượng làm bài (`duration_minutes`), điểm sàn (`pass_score`), và tổng điểm (`total_points`). | Không gắn với thời gian tổ chức cụ thể; tổng điểm bằng tổng điểm các câu hỏi thành phần. |
| **`ExamQuestion`** | Bản ghi trung gian liên kết Đề thi và Câu hỏi: Xác định thứ tự hiển thị (`order`) và thang điểm (`points > 0`). | Khóa duy nhất tổng hợp: `exam_id + question_id`. Điểm số câu hỏi phải là số dương (`points > 0`). |
| **`ExamSession`** | Ca thi cụ thể: Một lần tổ chức thi thực tế với khung giờ bắt đầu (`start_at`) và kết thúc (`end_at`). Vòng đời: `draft` $\rightarrow$ `published` $\rightarrow$ `closed`. | Ràng buộc thời gian: `end_at > start_at`. Chỉ được xuất bản (`publish`) khi đề thi có câu hỏi và ca thi đã có thí sinh gán. |
| **`SessionAssignment`** | Danh sách sinh viên được phân công quyền dự thi trong ca thi. | Khóa duy nhất tổng hợp: `exam_session_id + student_id` (Ngăn gán trùng lặp - Idempotent Assignment). |
| **`SessionTeacher`** | Danh sách cán bộ coi thi được phân công giám sát ca thi. | Khóa duy nhất tổng hợp: `exam_session_id + teacher_id`. |
| **`ExamAttempt`** | Lượt làm bài thực tế của một thí sinh trong ca thi. Vòng đời: `in_progress` $\rightarrow$ `submitted` $\rightarrow$ `graded`. | Khóa duy nhất `exam_session_id + student_id + attempt_number`. Thí sinh chỉ được có 1 attempt `in_progress` tại một thời điểm. |
| **`AttemptAnswer`** | Bản lưu câu trả lời của thí sinh cho một câu hỏi. | Idempotent Atomic Upsert theo cặp `attempt_id + question_id`. Không thể chỉnh sửa sau khi attempt chuyển sang `submitted`. |
| **`ExamBlueprint`** | Bản thiết kế ma trận đề thi do ExamOps Agent hoặc Giảng viên đề xuất: Gồm tỷ lệ độ khó (`easy`, `medium`, `hard`) và số câu hỏi theo từng chủ đề. | Tỷ lệ độ khó bắt buộc: `easy + medium + hard = 100.0%`. Tổng số câu hỏi từng chủ đề phải bằng đúng tổng số câu hỏi đề thi. |
| **`ReadinessReview`** | Báo cáo thẩm định độ sẵn sàng của ma trận đề thi và ngân hàng câu hỏi trước khi tổ chức thi. | Phải đưa ra kết luận rõ ràng: `PASS`, `WARNING`, hoặc `FAIL` dựa trên tính toán số học xác định (deterministic math). |
| **`ApprovalProposal`** | Bản đề xuất ghi dữ liệu vào CSDL Exam Platform do AI Agent phát hành, chứa mã băm bất biến (`proposal_hash`). | Bắt buộc dừng lại ở Cổng Duyệt Human-in-the-Loop; chỉ có Giảng viên phụ trách hoặc Admin mới có quyền phê duyệt (`approve`). |
| **`ServerAuthoritativeClock`** | Cơ chế tính giờ thi độc quyền dựa trên đồng hồ máy chủ. | `deadline = min(started_at + duration_minutes, session.end_at)`. Mọi thao tác lưu đáp án hoặc nộp bài quá deadline (+ 15s-30s buffer mạng) đều bị máy chủ từ chối. |
| **`ZeroLeakagePolicy`** | Quy tắc an ninh tuyệt đối: Không rò rỉ đáp án đúng (`correct_answer`) và giải thích (`explanation`) cho thí sinh trong suốt quá trình làm bài. | Sử dụng 2 API Resource phân tách: `QuestionAdminResource` (Giảng viên) vs `QuestionStudentResource` (Thí sinh). |
