# 10 — Entity Relationship Diagram (ERD)

**Dự án**: Exam Platform  
**Tài liệu**: `docs/02-domain-database/10-ERD.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. Sơ đồ Quan hệ Thực thể Toàn diện (Mermaid ERD)

```mermaid
erDiagram
    users ||--o{ subjects : "creates"
    users ||--o{ questions : "creates"
    users ||--o{ exams : "creates"
    users ||--o{ exam_sessions : "creates"
    users ||--o{ session_assignments : "is assigned as student"
    users ||--o{ session_teachers : "is assigned as teacher"
    users ||--o{ exam_attempts : "takes"

    subjects ||--|{ topics : "contains"
    subjects ||--o{ exams : "categorizes"

    topics ||--o{ questions : "contains"

    exams ||--|{ exam_questions : "comprises"
    questions ||--o{ exam_questions : "is included in"

    exams ||--o{ exam_sessions : "is executed as"

    exam_sessions ||--o{ session_assignments : "assigns"
    exam_sessions ||--o{ session_teachers : "monitored by"
    exam_sessions ||--o{ exam_attempts : "hosts"

    exam_attempts ||--|{ attempt_answers : "records"
    questions ||--o{ attempt_answers : "answered for"

    exam_attempts ||--o{ proctoring_events : "triggers"

    users {
        bigint id PK
        varchar name
        varchar email UK
        varchar password
        varchar role "admin, teacher, student"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    subjects {
        bigint id PK
        varchar code UK
        varchar name
        text description
        bigint created_by FK
        timestamp created_at
        timestamp updated_at
    }

    topics {
        bigint id PK
        bigint subject_id FK
        varchar name
        text description
        timestamp created_at
        timestamp updated_at
    }

    questions {
        bigint id PK
        bigint topic_id FK
        text question_text
        varchar question_type "single_choice, multiple_choice, true_false, short_answer"
        jsonb options "array of {id, content}"
        jsonb correct_answer "scalar or array of ids"
        text explanation
        varchar difficulty "easy, medium, hard"
        varchar status "draft, pending, approved, rejected"
        varchar source "manual, import"
        text rejection_reason
        bigint created_by FK
        timestamp deleted_at "soft delete"
        timestamp created_at
        timestamp updated_at
    }

    exams {
        bigint id PK
        bigint subject_id FK
        varchar title
        text description
        integer duration_minutes
        decimal total_points
        decimal pass_score
        boolean shuffle_questions
        boolean shuffle_options
        bigint created_by FK
        timestamp created_at
        timestamp updated_at
    }

    exam_questions {
        bigint id PK
        bigint exam_id FK
        bigint question_id FK
        integer order
        decimal points
        timestamp created_at
        timestamp updated_at
    }

    exam_sessions {
        bigint id PK
        bigint exam_id FK
        varchar title
        varchar status "draft, published, closed, cancelled"
        timestamp start_at
        timestamp end_at
        integer allow_late_minutes
        integer max_attempts
        boolean show_result_immediately
        bigint created_by FK
        timestamp created_at
        timestamp updated_at
    }

    session_assignments {
        bigint id PK
        bigint exam_session_id FK
        bigint student_id FK
        timestamp assigned_at
        timestamp created_at
        timestamp updated_at
    }

    session_teachers {
        bigint id PK
        bigint exam_session_id FK
        bigint teacher_id FK
        varchar role_in_session "primary, proctor"
        timestamp created_at
        timestamp updated_at
    }

    exam_attempts {
        bigint id PK
        bigint exam_session_id FK
        bigint student_id FK
        integer attempt_number
        varchar status "in_progress, submitted, graded"
        timestamp started_at
        timestamp submitted_at
        decimal score
        decimal total_points
        timestamp created_at
        timestamp updated_at
    }

    attempt_answers {
        bigint id PK
        bigint attempt_id FK
        bigint question_id FK
        jsonb selected_options "scalar or array of chosen option ids"
        decimal awarded_points
        boolean is_correct
        timestamp created_at
        timestamp updated_at
    }

    proctoring_events {
        bigint id PK
        bigint attempt_id FK
        varchar event_type "tab_hidden, window_blur, fullscreen_exit, devtools_opened, copy_paste_attempt"
        varchar severity "low, medium, high, critical"
        timestamp occurred_at
        jsonb metadata "client viewport, duration, context"
        timestamp created_at
        timestamp updated_at
    }
```

---

## 2. Bảng Danh mục Cardinality (Bản số Quan hệ)

| Mối quan hệ giữa 2 bảng | Bản số (Cardinality) | Ý nghĩa nghiệp vụ |
| :--- | :---: | :--- |
| `subjects` $\rightarrow$ `topics` | **1 : N** | Một môn học chứa một hoặc nhiều chủ đề; mỗi chủ đề thuộc về duy nhất một môn học. |
| `topics` $\rightarrow$ `questions` | **1 : N** | Một chủ đề chứa nhiều câu hỏi trong ngân hàng; mỗi câu hỏi thuộc về một chủ đề. |
| `exams` $\leftrightarrow$ `questions` | **N : N** | Quan hệ nhiều-nhiều được liên kết qua bảng trung gian `exam_questions`. Một câu hỏi có thể xuất hiện trong nhiều đề thi; một đề thi chứa nhiều câu hỏi. |
| `exams` $\rightarrow$ `exam_sessions` | **1 : N** | Một đề thi mẫu có thể được tổ chức thành nhiều ca thi khác nhau theo thời gian thực. |
| `exam_sessions` $\leftrightarrow$ `users (students)` | **N : N** | Liên kết qua `session_assignments`. Một ca thi phân công nhiều sinh viên; một sinh viên có thể tham gia nhiều ca thi. |
| `exam_sessions` $\leftrightarrow$ `users (teachers)` | **N : N** | Liên kết qua `session_teachers`. Một ca thi có nhiều giám thị coi thi. |
| `exam_sessions` $\rightarrow$ `exam_attempts` | **1 : N** | Một ca thi chứa tất cả các lượt làm bài của các thí sinh tham gia. |
| `exam_attempts` $\rightarrow$ `attempt_answers` | **1 : N** | Mỗi lượt làm bài chứa danh sách các câu trả lời tương ứng với các câu hỏi trong đề. |
| `exam_attempts` $\rightarrow$ `proctoring_events` | **1 : N** | Mỗi lượt làm bài lưu trữ chuỗi các sự kiện vi phạm giám sát do trình duyệt gửi lên. |
