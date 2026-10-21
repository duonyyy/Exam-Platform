<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $subject_id
 * @property int $created_by
 * @property string $title
 * @property int $duration_minutes
 * @property string $pass_score
 * @property string $total_points
 * @property bool $shuffle_questions
 * @property bool $shuffle_options
 */
class Exam extends Model
{
    protected $fillable = ['title', 'duration_minutes', 'pass_score', 'shuffle_questions', 'shuffle_options'];

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
            'pass_score' => 'decimal:2',
            'total_points' => 'decimal:2',
            'shuffle_questions' => 'boolean',
            'shuffle_options' => 'boolean',
        ];
    }

    /** @return BelongsTo<Subject, $this> */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return BelongsToMany<Question, $this> */
    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'exam_questions')->withPivot(['order', 'points']);
    }

    /** @return HasMany<ExamSession, $this> */
    public function sessions(): HasMany
    {
        return $this->hasMany(ExamSession::class);
    }
}
