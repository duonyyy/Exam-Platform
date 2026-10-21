<?php

namespace App\Actions\ExamSessions;

use App\Enums\ExamSessionStatus;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class PublishSessionAction
{
    public function handle(ExamSession $session, User $actor): ExamSession
    {
        return DB::transaction(function () use ($session, $actor): ExamSession {
            /** @var ExamSession $lockedSession */
            $lockedSession = ExamSession::query()->whereKey($session->id)->lockForUpdate()->firstOrFail();
            $lockedSession->load(['exam.subject', 'sessionTeachers']);

            // Recheck policy inside transaction to guard against concurrent privilege changes
            Gate::forUser($actor)->authorize('publish', $lockedSession);

            // FSM Guard: only draft can be published
            if ($lockedSession->status !== ExamSessionStatus::DRAFT) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Ca thi không ở trạng thái dự thảo (draft).',
                    'error_code' => 'INVALID_STATE_TRANSITION',
                ], Response::HTTP_CONFLICT));
            }

            // Expiry Guard: now cannot be after end_at
            if (now()->greaterThanOrEqualTo($lockedSession->end_at)) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Thời gian kết thúc ca thi đã trôi qua.',
                    'error_code' => 'SESSION_EXPIRED',
                ], Response::HTTP_UNPROCESSABLE_ENTITY));
            }

            // BR-006 Condition 1: Exam must have at least 1 question
            $questionsCount = DB::table('exam_questions')
                ->where('exam_id', $lockedSession->exam_id)
                ->count();

            if ($questionsCount === 0) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Đề thi chưa có câu hỏi nào, không thể xuất bản ca thi.',
                    'error_code' => 'EXAM_EMPTY',
                ], Response::HTTP_CONFLICT));
            }

            // BR-006 Condition 2: Exam session must have at least 1 assigned student
            $studentsCount = DB::table('session_assignments')
                ->where('exam_session_id', $lockedSession->id)
                ->count();

            if ($studentsCount === 0) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Ca thi chưa phân công thí sinh nào.',
                    'error_code' => 'NO_STUDENTS_ASSIGNED',
                ], Response::HTTP_CONFLICT));
            }

            // Valid transition: draft -> published
            $lockedSession->status = ExamSessionStatus::PUBLISHED;
            $lockedSession->save();

            return $lockedSession->load(['exam'])->loadCount(['assignments', 'sessionTeachers']);
        });
    }
}
