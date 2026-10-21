<?php

namespace App\Actions\Attempts;

use App\Enums\ExamAttemptStatus;
use App\Models\AttemptAnswer;
use App\Models\ExamAttempt;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class SaveAttemptAnswerAction
{
    public function handle(ExamAttempt $attempt, int $questionId, mixed $selectedOptions, User $student): AttemptAnswer
    {
        return DB::transaction(function () use ($attempt, $questionId, $selectedOptions, $student): AttemptAnswer {
            /** @var ExamAttempt $lockedAttempt */
            $lockedAttempt = ExamAttempt::query()->whereKey($attempt->id)->lockForUpdate()->firstOrFail();
            $lockedAttempt->load(['session.exam']);

            // Policy re-check inside transaction
            Gate::forUser($student)->authorize('saveAnswer', $lockedAttempt);

            // BR-002: Immutable submitted attempt
            if ($lockedAttempt->status !== ExamAttemptStatus::IN_PROGRESS) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Bài thi đã nộp hoặc đã kết thúc, không thể lưu đáp án.',
                    'error_code' => 'ATTEMPT_NOT_IN_PROGRESS',
                ], Response::HTTP_CONFLICT));
            }

            // Server-authoritative deadline check
            $session = $lockedAttempt->session;
            if (! $session || ! $session->exam) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Không tìm thấy dữ liệu ca thi hoặc đề thi.',
                    'error_code' => 'SESSION_NOT_FOUND',
                ], Response::HTTP_NOT_FOUND));
            }

            $now = now();
            $durationMinutes = $session->exam->duration_minutes;
            $attemptDeadline = $lockedAttempt->started_at->addMinutes($durationMinutes)->addSeconds(15); // 15s network buffer
            $sessionDeadline = $session->end_at->addSeconds(15);
            $effectiveDeadline = $attemptDeadline->lessThan($sessionDeadline) ? $attemptDeadline : $sessionDeadline;

            if ($now->greaterThan($effectiveDeadline)) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Đã hết thời gian làm bài thi.',
                    'error_code' => 'ATTEMPT_TIME_EXPIRED',
                ], Response::HTTP_CONFLICT));
            }

            // Verify question belongs to exam
            $belongsToExam = DB::table('exam_questions')
                ->where('exam_id', $session->exam_id)
                ->where('question_id', $questionId)
                ->exists();

            if (! $belongsToExam) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Câu hỏi không thuộc đề thi của ca thi này.',
                    'error_code' => 'QUESTION_NOT_IN_EXAM',
                ], Response::HTTP_UNPROCESSABLE_ENTITY));
            }

            // Idempotent Atomic Upsert
            $formattedOptions = is_array($selectedOptions) ? array_values($selectedOptions) : [$selectedOptions];

            /** @var AttemptAnswer $answer */
            $answer = AttemptAnswer::updateOrCreate(
                [
                    'attempt_id' => $lockedAttempt->id,
                    'question_id' => $questionId,
                ],
                [
                    'selected_options' => $formattedOptions,
                    'updated_at' => $now,
                ]
            );

            return $answer;
        });
    }
}
