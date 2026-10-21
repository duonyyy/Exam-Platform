# Tool & Skill Contracts Specification

## 1. Tools vs Skills

- **Tool**: An atomic operation that interacts with an external service (`core-api/`) or reads data. Examples: `list_subjects`, `get_exam`.
- **Skill**: A reusable composite domain procedure that implements business intelligence without directly writing to SoR. Examples: `exam-blueprint`, `exam-readiness-review`.

## 2. Tool Inventory

| Tool Name | Type | Required Permission | Side Effect | Requires Approval | Description |
| :--- | :---: | :--- | :---: | :---: | :--- |
| `list_subjects` | Read | `list_subjects` | No | No | Returns list of curriculum subjects. |
| `list_topics` | Read | `list_topics` | No | No | Returns topics under a subject. |
| `list_questions`| Read | `list_questions` | No | No | Queries question bank for a topic. |
| `get_exam` | Read | `get_exam` | No | No | Fetches exam blueprint & attached questions. |
| `get_exam_session` | Read | `get_exam_session` | No | No | Fetches session timetable and metadata. |

*Note*: No generic `execute_raw_query` or `call_any_api` tool exists. All tools are strictly allowlisted and bound to pre-configured endpoints.

## 3. Skill Inventory

### `exam-blueprint`
- **Input**: `subject_id`, constraints (`duration_minutes`, `total_questions`, `difficulty_distribution`, `topic_distribution`).
- **Output**: `ExamBlueprint` (Pydantic model).
- **Rule**: Must strictly conform to $\text{easy} + \text{medium} + \text{hard} = 100\%$. Question counts and duration must be positive integers.

### `exam-readiness-review`
- **Input**: `blueprint: ExamBlueprint`, `questions: list[QuestionRecord]`.
- **Output**: `ReadinessReview` (`PASS`, `FAIL`, or `WARNING`).
- **Deterministic Rules**:
  1. Actual questions must equal `blueprint.total_questions`.
  2. Zero duplicate question IDs allowed.
  3. All questions must have status `ready` in Core API.
  4. Difficulty distribution must be within $\pm 10\%$ tolerance of blueprint target.
