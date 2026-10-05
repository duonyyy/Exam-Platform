# Coding Standards

## General

- PSR-12
- Laravel conventions
- Laravel Pint
- readable naming
- small cohesive methods
- tests for important behavior

## Naming

Ưu tiên domain language:

```php
$examSession
$attempt
$assignedStudents
$approvedQuestion
$totalPoints
```

Tránh:

```php
$data
$item
$temp
$obj
```

nếu scope không rõ.

## Controller

Controller điều phối request.

Không nhét toàn bộ scoring workflow vào controller.

## Form Request

Tách validation phức tạp ra khỏi controller.

## Enum

Các state/type nên dùng Enum khi phù hợp:

```text
UserRole
QuestionType
QuestionStatus
QuestionSource
Difficulty
ExamStatus
ExamAttemptStatus
ProctoringEventType
ProctoringSeverity
```

## Eloquent

Dùng relationships rõ ràng.

Theo dõi N+1.

Dùng `with()` có chủ đích.

## Sensitive Data

Không expose:

```text
password
remember_token
correct_answer cho student
API secret
internal security metadata
```

## Question Options

Nếu lưu options/correct_answer dạng JSON:

- validate structure
- cast array
- validate answer thuộc option hợp lệ
- không cho student sửa question data

## Scoring

Scoring logic phải deterministic và test được.

Không viết scoring inline ở nhiều controller.

Nếu logic đủ lớn, tạo:

```text
AttemptScorer
```

hoặc Action phù hợp.

## Transactions

Dùng transaction cho submit/grading multi-write.

## State Transitions

Không chỉ check role.

Cần check state hiện tại.

Ví dụ:

```text
draft → published
published → closed
```

Không cho:

```text
closed → draft
```

nếu nghiệp vụ không cho phép.

## Race Conditions

Quan tâm:

```text
double submit
double assignment
double attempt
```

Database constraint tốt hơn chỉ check ở PHP.

## Soft Delete

Question bank có thể dùng soft delete để giữ lịch sử.

Không assume rằng soft-deleted question có thể biến mất khỏi exam lịch sử mà không ảnh hưởng audit.

## Logging

Log context:

```text
request_id
user_id
exam_id
exam_session_id
attempt_id
```

Không log đáp án đúng hoặc token nếu không cần.

## Tests

Tên theo behavior:

```text
student_can_start_assigned_exam
student_cannot_start_unassigned_exam
student_cannot_read_correct_answers
submitted_attempt_cannot_be_modified
teacher_can_publish_valid_session
teacher_cannot_publish_empty_exam
```

## No Premature Architecture

Không mặc định tạo:

```text
IExamRepository
ExamRepository
IExamService
ExamService
ExamDTO
ExamMapper
```

cho CRUD thường.

Chỉ abstraction khi có lý do rõ.
