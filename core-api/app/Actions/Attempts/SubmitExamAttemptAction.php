<?php

namespace App\Actions\Attempts;

use App\Enums\ExamAttemptStatus;
use App\Models\AttemptAnswer;
use App\Models\ExamAttempt;
use App\Models\User;
use App\Services\Scoring\AttemptScorer;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class SubmitExamAttemptAction
{
    public function __construct(
        protected AttemptScorer $scorer
    ) {}

    /**
     * @param  array<int, array{question_id: int, selected_options?: mixed, answer?: mixed}>  $finalAnswers
     */
    public function handle(
        ExamAttempt $attempt,
        array $finalAnswers,
        User $student,
        ?string $idempotencyKey = null
    ): ExamAttempt {
        // Idempotency cache lookup (ADR-006)
        $cacheKey = $idempotencyKey ? "idempotency:submit:{$attempt->id}:{$idempotencyKey}" : null;
        if ($cacheKey && Cache::has($cacheKey)) {
            $cachedAttemptId = (int) Cache::get($cacheKey);
            /** @var ExamAttempt $cachedAttempt */
            $cachedAttempt = ExamAttempt::query()
                ->with(['session.exam', 'answers'])
                ->findOrFail($cachedAttemptId);

            return $cachedAttempt;
        }

        return DB::transaction(function () use ($attempt, $finalAnswers, $student, $cacheKey): ExamAttempt {
            /** @var ExamAttempt $lockedAttempt */
            $lockedAttempt = ExamAttempt::query()
                ->whereKey($attempt->id)
                ->lockForUpdate()
                ->firstOrFail();

            $lockedAttempt->load(['session.exam.questions', 'answers']);

            // Policy re-check inside transaction (IDOR prevention)
            Gate::forUser($student)->authorize('submit', $lockedAttempt);

            // BR-002 & BR-007: Reject if already submitted or closed
            if ($lockedAttempt->status !== ExamAttemptStatus::IN_PROGRESS) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Bài thi đã được nộp hoặc đã đóng trước đó.',
                    'error_code' => 'ATTEMPT_ALREADY_SUBMITTED',
                ], Response::HTTP_CONFLICT));
            }

            // Server-authoritative deadline check with 30s grace period (NFR-REL-002)
            $session = $lockedAttempt->session;
            if (! $session || ! $session->exam) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Không tìm thấy dữ liệu ca thi hoặc đề thi.',
                    'error_code' => 'SESSION_NOT_FOUND',
                ], Response::HTTP_NOT_FOUND));
            }

            $now = now();
            $durationMinutes = $session->exam->duration_minutes;
            $attemptDeadline = $lockedAttempt->started_at->addMinutes($durationMinutes)->addSeconds(30);
            $sessionDeadline = $session->end_at->addSeconds(30);
            $effectiveDeadline = $attemptDeadline->lessThan($sessionDeadline) ? $attemptDeadline : $sessionDeadline;

            if ($now->greaterThan($effectiveDeadline)) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Thời gian làm bài đã kết thúc quá hạn cho phép nộp.',
                    'error_code' => 'ATTEMPT_TIME_EXPIRED',
                ], Response::HTTP_CONFLICT));
            }

            // Upsert any final answers provided in submit payload
            if (! empty($finalAnswers)) {
                $examQuestionIds = DB::table('exam_questions')
                    ->where('exam_id', $session->exam_id)
                    ->pluck('question_id')
                    ->all();
                $validQuestionMap = array_flip($examQuestionIds);

                foreach ($finalAnswers as $item) {
                    $questionId = (int) ($item['question_id'] ?? 0);
                    if (! isset($validQuestionMap[$questionId])) {
                        continue;
                    }

                    $rawSelected = $item['selected_options'] ?? $item['answer'] ?? null;
                    if ($rawSelected === null) {
                        continue;
                    }

                    $formatted = is_array($rawSelected) ? array_values($rawSelected) : [$rawSelected];

                    AttemptAnswer::updateOrCreate(
                        [
                            'attempt_id' => $lockedAttempt->id,
                            'question_id' => $questionId,
                        ],
                        [
                            'selected_options' => $formatted,
                            'updated_at' => $now,
                        ]
                    );
                }
            }

            // In-Memory scoring engine
            $scoreResult = $this->scorer->calculate($lockedAttempt);

            // Update attempt with final score and submitted timestamp
            $lockedAttempt->update([
                'status' => ExamAttemptStatus::SUBMITTED,
                'submitted_at' => $now,
                'score' => $scoreResult->score,
                'total_points' => $scoreResult->totalPoints,
            ]);

            // Cache attempt ID for idempotency key if provided
            if ($cacheKey) {
                Cache::put($cacheKey, $lockedAttempt->id, now()->addDay());
            }

            $lockedAttempt->load(['session.exam.questions', 'answers']);

            return $lockedAttempt;
        });
    }
}
