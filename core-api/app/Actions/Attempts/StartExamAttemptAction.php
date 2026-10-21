<?php

namespace App\Actions\Attempts;

use App\Enums\ExamAttemptStatus;
use App\Enums\ExamSessionStatus;
use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class StartExamAttemptAction
{
    public function handle(ExamSession $session, User $student): ExamAttempt
    {
        return DB::transaction(function () use ($session, $student): ExamAttempt {
            /** @var ExamSession $lockedSession */
            $lockedSession = ExamSession::query()->whereKey($session->id)->lockForUpdate()->firstOrFail();
            $lockedSession->load(['exam']);

            // BR-001: Student must be assigned to this session
            $isAssigned = DB::table('session_assignments')
                ->where('exam_session_id', $lockedSession->id)
                ->where('student_id', $student->id)
                ->exists();

            if (! $isAssigned) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Bạn không được phân công tham gia ca thi này.',
                    'error_code' => 'STUDENT_NOT_ASSIGNED',
                ], Response::HTTP_FORBIDDEN));
            }

            // Session must be published
            if ($lockedSession->status !== ExamSessionStatus::PUBLISHED) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Ca thi chưa được công bố hoặc đã bị khóa.',
                    'error_code' => 'SESSION_NOT_PUBLISHED',
                ], Response::HTTP_CONFLICT));
            }

            $now = now();

            // Time window checks
            if ($now->lessThan($lockedSession->start_at)) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Ca thi chưa bắt đầu.',
                    'error_code' => 'SESSION_NOT_STARTED',
                ], Response::HTTP_CONFLICT));
            }

            if ($now->greaterThanOrEqualTo($lockedSession->end_at)) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Ca thi đã kết thúc thời gian làm bài.',
                    'error_code' => 'SESSION_EXPIRED',
                ], Response::HTTP_CONFLICT));
            }

            // Resume support: check if student has an active attempt in progress
            /** @var ExamAttempt|null $existingInProgress */
            $existingInProgress = ExamAttempt::query()
                ->where('exam_session_id', $lockedSession->id)
                ->where('student_id', $student->id)
                ->where('status', ExamAttemptStatus::IN_PROGRESS)
                ->first();

            if ($existingInProgress) {
                return $existingInProgress->load(['session.exam', 'answers']);
            }

            // BR-014: Late arrival check for new attempt
            $lateDeadline = $lockedSession->start_at->addMinutes($lockedSession->allow_late_minutes);
            if ($now->greaterThan($lateDeadline)) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Bạn đã đến muộn quá thời gian cho phép vào thi.',
                    'error_code' => 'SESSION_LATE_ARRIVAL',
                ], Response::HTTP_CONFLICT));
            }

            // BR-009: Max attempts check
            $attemptCount = ExamAttempt::query()
                ->where('exam_session_id', $lockedSession->id)
                ->where('student_id', $student->id)
                ->count();

            if ($attemptCount >= $lockedSession->max_attempts) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Bạn đã hoàn thành số lượt làm bài tối đa cho ca thi này.',
                    'error_code' => 'MAX_ATTEMPTS_REACHED',
                ], Response::HTTP_CONFLICT));
            }

            // Create new attempt
            $attempt = ExamAttempt::create([
                'exam_session_id' => $lockedSession->id,
                'student_id' => $student->id,
                'attempt_number' => $attemptCount + 1,
                'status' => ExamAttemptStatus::IN_PROGRESS,
                'started_at' => $now,
                'total_points' => $lockedSession->exam?->total_points,
            ]);

            return $attempt->load(['session.exam', 'answers']);
        });
    }
}
