<?php

namespace App\Models;

use App\Enums\ExamAttemptStatus;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $exam_session_id
 * @property int $student_id
 * @property int $attempt_number
 * @property ExamAttemptStatus $status
 * @property CarbonInterface $started_at
 * @property CarbonInterface|null $submitted_at
 * @property string|null $score
 * @property string|null $total_points
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read ExamSession|null $session
 * @property-read User|null $student
 * @property-read Collection<int, AttemptAnswer> $answers
 */
class ExamAttempt extends Model
{
    protected $fillable = [
        'exam_session_id',
        'student_id',
        'attempt_number',
        'status',
        'started_at',
        'submitted_at',
        'score',
        'total_points',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attempt_number' => 'integer',
            'status' => ExamAttemptStatus::class,
            'started_at' => 'immutable_datetime',
            'submitted_at' => 'immutable_datetime',
            'score' => 'decimal:2',
            'total_points' => 'decimal:2',
        ];
    }

    /** @return BelongsTo<ExamSession, $this> */
    public function session(): BelongsTo
    {
        return $this->belongsTo(ExamSession::class, 'exam_session_id');
    }

    /** @return BelongsTo<User, $this> */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /** @return HasMany<AttemptAnswer, $this> */
    public function answers(): HasMany
    {
        return $this->hasMany(AttemptAnswer::class, 'attempt_id');
    }

    public function isInProgress(): bool
    {
        return $this->status === ExamAttemptStatus::IN_PROGRESS;
    }

    public function isSubmitted(): bool
    {
        return $this->status === ExamAttemptStatus::SUBMITTED;
    }

    public function isGraded(): bool
    {
        return $this->status === ExamAttemptStatus::GRADED;
    }

    /**
     * Calculate remaining seconds based on server authoritative clock.
     * deadline = min(started_at + duration_minutes, session.end_at)
     */
    public function calculateRemainingSeconds(?CarbonInterface $now = null): int
    {
        $current = $now ?: now();
        $session = $this->session;

        if (! $session || ! $session->exam) {
            return 0;
        }

        $durationMinutes = $session->exam->duration_minutes;
        $attemptDeadline = $this->started_at->addMinutes($durationMinutes);
        $sessionEnd = $session->end_at;

        $effectiveDeadline = $attemptDeadline->lessThan($sessionEnd) ? $attemptDeadline : $sessionEnd;

        if ($current->greaterThanOrEqualTo($effectiveDeadline)) {
            return 0;
        }

        return (int) $current->diffInSeconds($effectiveDeadline, false);
    }
}
