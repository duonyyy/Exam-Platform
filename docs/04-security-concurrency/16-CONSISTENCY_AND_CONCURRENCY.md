# 16 — Consistency & Concurrency Design Specification

**Dự án**: Exam Platform  
**Tài liệu**: `docs/04-security-concurrency/16-CONSISTENCY_AND_CONCURRENCY.md`  
**Trạng thái**: Approved for Architecture Baseline  

---

## 1. Triết lý Quản lý Đồng thời (Concurrency Philosophy)

1. **Ưu tiên Ràng buộc CSDL Tự nhiên (Database-First Guarantees)**: Không vội vàng đưa vào các cơ chế khóa phân tán phức tạp (như Redis Redlock) khi chưa có lý do xác đáng. Một cơ sở dữ liệu quan hệ mạnh mẽ như **PostgreSQL 16** cung cấp đầy đủ các công cụ ACID, Composite Unique Constraints và Khóa dòng (Row-Level Locking) để xử lý triệt để 99% các trường hợp tranh chấp dữ liệu.
2. **Nguyên tắc "Fail-Fast"**: Nếu một thao tác phát hiện xung đột trạng thái (State Conflict), hệ thống lập tức Rollback giao dịch và trả về mã lỗi `409 Conflict` kèm thông báo rõ ràng cho client.

---

## 2. Bảng Ma trận Kiểm soát Tranh chấp Đồng thời (Race Conditions Matrix)

| Kịch bản Tranh chấp | Rủi ro Nghiệp vụ (Business Risk) | Bất biến cần bảo vệ (Invariant) | Giải pháp Cơ sở Dữ liệu (DB Constraint) | Cơ chế Khóa & Giao dịch (Locking Strategy) | Tính lũy thừa (Idempotency) |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **1. Double Assignment** (Gán trùng thí sinh) | Giảng viên click nhanh 2 lần nút "Gán thí sinh" hoặc 2 giám thị cùng import file sinh viên. | Một sinh viên chỉ có đúng 1 bản ghi phân công trong 1 ca thi. | `UNIQUE (exam_session_id, student_id)` | DB Transaction + `ON CONFLICT DO NOTHING` (`insertOrIgnore`) | Có |
| **2. Double Start Attempt** (Mở nhiều lượt thi đồng thời) | Thí sinh mở 2 tab trình duyệt cùng lúc và click "Vào thi" đồng thời. | Thí sinh không được phép có nhiều hơn `max_attempts` lượt làm bài. | `UNIQUE (exam_session_id, student_id, attempt_number)` | DB Transaction. Khi vi phạm unique constraint, DB văng lỗi $\rightarrow$ Controller bắt và trả về attempt hiện có. | Có |
| **3. Double Answer Concurrent Edit** (Ghi đè đáp án đồng thời) | Hai request lưu đáp án của cùng 1 câu hỏi gửi lên sát nhau do lag mạng. | Câu trả lời cuối cùng phản ánh đúng thao tác mới nhất của thí sinh. | `UNIQUE (attempt_id, question_id)` | Câu lệnh Atomic `UPSERT`: `INSERT ... ON CONFLICT (attempt_id, question_id) DO UPDATE SET selected_options = EXCLUDED.selected_options, updated_at = NOW()` | Có |
| **4. Double Submit** (Nộp bài thi đúp) | Thí sinh nộp bài 2 lần liên tiếp hoặc 2 luồng gửi song song gây tính điểm 2 lần. | Một bài thi chỉ được tính điểm và chuyển sang `submitted` duy nhất 1 lần. | Quản lý trạng thái qua FSM (`status = 'submitted'`) | **Khóa dòng Bi quan (Pessimistic Lock)**: `SELECT * FROM exam_attempts WHERE id = ? FOR UPDATE;` trong DB Transaction. | Có (qua `Idempotency-Key`) |
| **5. Session Close vs Submit** (Ca thi đóng trong khi sinh viên nộp) | Giám thị bấm "Đóng ca thi" đúng mili-giây sinh viên bấm "Nộp bài". | Bài thi nộp trong thời gian hợp lệ (+ ân hạn 30s) phải được ghi nhận và tính điểm công bằng. | Kiểm tra thời gian: `submitted_at <= started_at + duration + 30s` | Transaction nộp bài được ưu tiên hoàn tất nếu đã bắt đầu trước khi trạng thái ca thi chuyển sang `closed`. | Có |
| **6. Hai giảng viên cùng sửa một đề thi** | Hai giảng viên cùng thêm/xóa câu hỏi trong cùng một mẫu đề thi. | Tổng điểm đề thi (`exams.total_points`) phải luôn phản ánh đúng tổng điểm thực tế. | Check Constraint `points > 0` | Khóa dòng đề thi: `SELECT * FROM exams WHERE id = ? FOR UPDATE;` khi tính toán lại tổng điểm `total_points`. | Có |

---

## 3. Phân tích Chi tiết Kỹ thuật Khóa Bi quan (Pessimistic Locking `FOR UPDATE`)

Trong quy trình `SubmitExamAttemptAction`, đoạn mã chuẩn hóa xử lý chống Double Submit như sau:

```php
namespace App\Actions\Attempts;

use App\Models\ExamAttempt;
use App\Enums\AttemptStatus;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class SubmitExamAttemptAction
{
    public function execute(int $attemptId, array $finalAnswers): ExamAttempt
    {
        return DB::transaction(function () use ($attemptId, $finalAnswers) {
            // 1. Khóa độc quyền bản ghi lượt làm bài này trong PostgreSQL
            // Nếu có một request song song khác đang giữ khóa, request này sẽ CHỜ cho đến khi request trước commit
            $attempt = ExamAttempt::query()
                ->where('id', $attemptId)
                ->lockForUpdate()
                ->firstOrFail();

            // 2. Kiểm tra điều kiện trạng thái (State Guard)
            // Request thứ hai sau khi chờ xong sẽ thấy status đã là SUBMITTED -> Ném ngoại lệ ngay lập tức!
            if ($attempt->status !== AttemptStatus::IN_PROGRESS) {
                throw new ConflictHttpException('Lượt làm bài này đã được nộp hoặc đã đóng trước đó.');
            }

            // 3. Lưu toàn bộ đáp án cuối cùng
            $this->persistFinalAnswers($attempt, $finalAnswers);

            // 4. Chấm điểm tự động
            $scoreResult = $this->scorer->calculate($attempt);

            // 5. Cập nhật trạng thái và điểm số
            $attempt->update([
                'status' => AttemptStatus::SUBMITTED,
                'submitted_at' => now(),
                'score' => $scoreResult->score,
                'total_points' => $scoreResult->totalPoints,
            ]);

            return $attempt;
        }); // COMMIT TRANSACTION & GIẢI PHÓNG KHÓA DÒNG
    }
}
```

---

## 4. Cơ chế Khóa Lũy thừa qua Header `Idempotency-Key`

Để phòng ngừa trường hợp mạng chập chờn khiến client gửi lại cùng một request nộp bài nhiều lần:
1. Client tạo một chuỗi ngẫu nhiên chuẩn UUID v4 gắn vào header `Idempotency-Key: <uuid>`.
2. Khi request đến, middleware kiểm tra xem key này đã được xử lý trong Redis hay chưa (`SET idempotency:{uuid} "PROCESSING" EX 120 NX`):
   - Nếu key đã tồn tại và trạng thái là `COMPLETED`: Trả về ngay payload kết quả đã lưu trong cache mà không gọi lại DB.
   - Nếu key đang ở trạng thái `PROCESSING`: Trả về `409 Conflict` (yêu cầu đang được xử lý).
   - Nếu key chưa tồn tại: Cho phép request đi tiếp vào Controller; sau khi transaction commit thành công, lưu kết quả vào cache với TTL 24 giờ.
