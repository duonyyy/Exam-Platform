<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $attempt_id
 * @property int $question_id
 * @property array<mixed> $selected_options
 * @property string|null $awarded_points
 * @property bool|null $is_correct
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read ExamAttempt|null $attempt
 * @property-read Question|null $question
 */
class AttemptAnswer extends Model
{
    protected $fillable = [
        'attempt_id',
        'question_id',
        'selected_options',
        'awarded_points',
        'is_correct',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'selected_options' => 'array',
            'awarded_points' => 'decimal:2',
            'is_correct' => 'boolean',
        ];
    }

    /** @return BelongsTo<ExamAttempt, $this> */
    public function attempt(): BelongsTo
    {
        return $this->belongsTo(ExamAttempt::class, 'attempt_id');
    }

    /** @return BelongsTo<Question, $this> */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}
