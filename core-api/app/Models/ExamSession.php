<?php

namespace App\Models;

use App\Enums\ExamSessionStatus;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $exam_id
 * @property int $created_by
 * @property string $title
 * @property ExamSessionStatus $status
 * @property CarbonInterface $start_at
 * @property CarbonInterface $end_at
 * @property int $allow_late_minutes
 * @property int $max_attempts
 * @property bool $show_result_immediately
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read Exam|null $exam
 * @property-read User|null $creator
 */
class ExamSession extends Model
{
    protected $fillable = [
        'exam_id',
        'created_by',
        'title',
        'status',
        'start_at',
        'end_at',
        'allow_late_minutes',
        'max_attempts',
        'show_result_immediately',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ExamSessionStatus::class,
            'start_at' => 'immutable_datetime',
            'end_at' => 'immutable_datetime',
            'allow_late_minutes' => 'integer',
            'max_attempts' => 'integer',
            'show_result_immediately' => 'boolean',
        ];
    }

    /** @return BelongsTo<Exam, $this> */
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<SessionAssignment, $this> */
    public function assignments(): HasMany
    {
        return $this->hasMany(SessionAssignment::class, 'exam_session_id');
    }

    /** @return BelongsToMany<User, $this> */
    public function assignedStudents(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'session_assignments', 'exam_session_id', 'student_id')
            ->withPivot('assigned_at')
            ->withTimestamps();
    }

    /** @return HasMany<SessionTeacher, $this> */
    public function sessionTeachers(): HasMany
    {
        return $this->hasMany(SessionTeacher::class, 'exam_session_id');
    }

    /** @return BelongsToMany<User, $this> */
    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'session_teachers', 'exam_session_id', 'teacher_id')
            ->withPivot('role_in_session')
            ->withTimestamps();
    }

    /** @return HasMany<ExamAttempt, $this> */
    public function attempts(): HasMany
    {
        return $this->hasMany(ExamAttempt::class, 'exam_session_id');
    }

    public function isDraft(): bool
    {
        return $this->status === ExamSessionStatus::DRAFT;
    }

    public function isPublished(): bool
    {
        return $this->status === ExamSessionStatus::PUBLISHED;
    }

    public function isClosed(): bool
    {
        return $this->status === ExamSessionStatus::CLOSED;
    }

    public function isCancelled(): bool
    {
        return $this->status === ExamSessionStatus::CANCELLED;
    }
}
