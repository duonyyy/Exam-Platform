<?php

namespace App\Models;

use App\Enums\QuestionStatus;
use App\Enums\QuestionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $topic_id
 * @property int $created_by
 * @property int|null $updated_by
 * @property string $question_text
 * @property QuestionType $question_type
 * @property array<int, array{id: string, content: string}>|null $options
 * @property string|array<int, string> $correct_answer
 * @property string|null $explanation
 * @property string $difficulty
 * @property QuestionStatus $status
 * @property string $source
 * @property string|null $rejection_reason
 * @property-read \Illuminate\Database\Eloquent\Relations\Pivot|null $pivot
 */
class Question extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'topic_id', 'question_text', 'question_type', 'options',
        'correct_answer', 'explanation', 'difficulty',
    ];

    protected function casts(): array
    {
        return [
            'question_type' => QuestionType::class,
            'status' => QuestionStatus::class,
            'options' => 'array',
            'correct_answer' => 'array',
        ];
    }

    /** @return BelongsTo<Topic, $this> */
    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    /** @return BelongsTo<User, $this> */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return BelongsTo<User, $this> */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
