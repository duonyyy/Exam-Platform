<?php

namespace App\Actions\ExamSessions;

use App\Enums\ExamSessionStatus;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class AssignStudentsAction
{
    /**
     * @param  array<int, int>  $studentIds
     * @return array{exam_session_id: int, assigned_count: int, total_assigned_students: int}
     */
    public function handle(ExamSession $session, array $studentIds, User $actor): array
    {
        return DB::transaction(function () use ($session, $studentIds, $actor): array {
            /** @var ExamSession $lockedSession */
            $lockedSession = ExamSession::query()->whereKey($session->id)->lockForUpdate()->firstOrFail();
            $lockedSession->load(['exam.subject', 'sessionTeachers']);

            // Recheck policy inside transaction to guard against concurrent privilege changes
            Gate::forUser($actor)->authorize('assignStudents', $lockedSession);

            // FSM Guard: cannot assign students if session is closed or cancelled
            if ($lockedSession->status === ExamSessionStatus::CLOSED || $lockedSession->status === ExamSessionStatus::CANCELLED) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Không thể phân công thí sinh vào ca thi đã kết thúc hoặc đã bị hủy.',
                    'error_code' => 'SESSION_CLOSED_FOR_ASSIGNMENT',
                ], Response::HTTP_CONFLICT));
            }

            $uniqueStudentIds = array_values(array_unique($studentIds));
            $now = now();

            $records = array_map(fn (int $studentId) => [
                'exam_session_id' => $lockedSession->id,
                'student_id' => $studentId,
                'assigned_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ], $uniqueStudentIds);

            // Idempotent batch insertion: ignore duplicates on composite unique (exam_session_id, student_id)
            $inserted = DB::table('session_assignments')->insertOrIgnore($records);

            $total = DB::table('session_assignments')
                ->where('exam_session_id', $lockedSession->id)
                ->count();

            return [
                'exam_session_id' => $lockedSession->id,
                'assigned_count' => $inserted,
                'total_assigned_students' => $total,
            ];
        });
    }
}
