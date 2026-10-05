# Learning Guide

Mỗi feature trong Exam Platform là một bài lab Laravel.

## Quy trình học

```text
Đọc requirement
↓
Vẽ domain relation
↓
Thiết kế endpoint
↓
Trace route
↓
Validation
↓
Authorization
↓
Controller
↓
Business logic
↓
Eloquent
↓
SQL
↓
Resource
↓
Feature test
↓
Security review
```

## Bài 1 — Login

Phải hiểu:

- route
- Form Request/validation
- User
- password hash
- Sanctum
- Bearer token
- middleware

## Bài 2 — Subject / Topic

Phải hiểu:

- migration
- foreign key
- hasMany
- belongsTo
- CRUD
- Resource

## Bài 3 — Question Bank

Phải hiểu:

- Enum
- JSON cast
- validation nested array
- soft delete
- approval flow

## Bài 4 — Exam

Phải hiểu:

- many-to-many
- pivot table
- pivot metadata
- ordering
- points

## Bài 5 — Exam Session

Phải hiểu:

- template vs scheduled instance
- date validation
- role
- lifecycle/state

## Bài 6 — Attempt

Đây là bài quan trọng nhất.

Trace:

```text
POST /exam-sessions/{session}/attempts
 ↓
auth:sanctum
 ↓
role:student
 ↓
assignment check
 ↓
session state/time check
 ↓
create attempt
 ↓
response
```

Sau đó:

```text
PATCH answer
 ↓
ownership
 ↓
attempt status
 ↓
question belongs to exam?
 ↓
validate selected option
 ↓
save
```

Cuối cùng:

```text
POST submit
 ↓
transaction
 ↓
lock/verify attempt
 ↓
calculate score
 ↓
mark submitted
 ↓
return result
```

## Security Questions

Luôn tự hỏi:

```text
Nếu đổi attempt_id sang ID người khác?
Nếu student gọi teacher endpoint?
Nếu gửi correct_answer trong request?
Nếu submit hai lần?
Nếu session đã đóng?
Nếu sửa answer sau submit?
Nếu question không thuộc exam?
Nếu user tự gán mình vào session?
```

## Database Questions

```text
FK nào bảo vệ dữ liệu?
Unique constraint nào cần?
Index nào cần?
Query count bao nhiêu?
Có N+1 không?
Transaction có cần không?
Race condition nằm ở đâu?
```

## Clean Code Questions

```text
Method này có nhiều trách nhiệm không?
Tên có nói đúng domain không?
Có business rule bị duplicate không?
Action có thực sự cần không?
Service có giải quyết vấn đề hay chỉ thêm layer?
```

## Sau mỗi feature

Yêu cầu Antigravity trả lời:

1. Feature summary
2. Files changed
3. Full request flow
4. Eloquent relationships used
5. Queries executed
6. Security checks
7. Possible N+1
8. State rules
9. Tests
10. Scale risks
11. What to learn next

## Milestone cuối

Bạn phải tự giải thích được:

```text
Question được tạo và duyệt thế nào?
Exam lấy Question thế nào?
Exam khác ExamSession thế nào?
Student được assign thế nào?
Attempt được tạo thế nào?
Answer được lưu thế nào?
Submit chống double submit thế nào?
Score được tính ở đâu?
Correct answer được giấu khỏi student thế nào?
Proctoring event được lưu thế nào?
```
