<?php

namespace App\Actions\ExamSessions;

use App\Enums\ExamSessionStatus;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class AssignTeachersAction
{
    /**
     * @param  array<int, int>  $teacherIds
     * @return array{exam_session_id: int, assigned_count: int, total_teachers: int}
     */
    public function handle(ExamSession $session, array $teacherIds, ?string $roleInSession, User $actor): array
    {
        return DB::transaction(function () use ($session, $teacherIds, $roleInSession, $actor): array {
            /** @var ExamSession $lockedSession */
            $lockedSession = ExamSession::query()->whereKey($session->id)->lockForUpdate()->firstOrFail();
            $lockedSession->load(['exam.subject', 'sessionTeachers']);

            // Recheck policy inside transaction
            Gate::forUser($actor)->authorize('assignTeachers', $lockedSession);

            // FSM Guard: cannot assign teachers if session is closed or cancelled
            if ($lockedSession->status === ExamSessionStatus::CLOSED || $lockedSession->status === ExamSessionStatus::CANCELLED) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Không thể phân công cán bộ coi thi vào ca thi đã kết thúc hoặc đã bị hủy.',
                    'error_code' => 'SESSION_CLOSED_FOR_ASSIGNMENT',
                ], Response::HTTP_CONFLICT));
            }

            $uniqueTeacherIds = array_values(array_unique($teacherIds));
            $now = now();
            $role = $roleInSession ?: 'proctor';

            $records = array_map(fn (int $teacherId) => [
                'exam_session_id' => $lockedSession->id,
                'teacher_id' => $teacherId,
                'role_in_session' => $role,
                'created_at' => $now,
                'updated_at' => $now,
            ], $uniqueTeacherIds);

            // Idempotent batch insertion: ignore duplicates on composite unique (exam_session_id, teacher_id)
            $inserted = DB::table('session_teachers')->insertOrIgnore($records);

            $total = DB::table('session_teachers')
                ->where('exam_session_id', $lockedSession->id)
                ->count();

            return [
                'exam_session_id' => $lockedSession->id,
                'assigned_count' => $inserted,
                'total_teachers' => $total,
            ];
        });
    }
}
