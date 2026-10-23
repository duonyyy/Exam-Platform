<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $thread_id
 * @property int $actor_id
 * @property string $prompt_hash
 * @property string $proposal_hash
 * @property int|null $generated_exam_id
 * @property string $status
 * @property array<string, mixed>|null $metadata
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read User $actor
 * @property-read Exam|null $generatedExam
 */
class AiGenerationLog extends Model
{
    protected $fillable = [
        'thread_id',
        'actor_id',
        'prompt_hash',
        'proposal_hash',
        'generated_exam_id',
        'status',
        'metadata',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'actor_id' => 'integer',
            'generated_exam_id' => 'integer',
            'metadata' => 'array',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    /** @return BelongsTo<Exam, $this> */
    public function generatedExam(): BelongsTo
    {
        return $this->belongsTo(Exam::class, 'generated_exam_id');
    }
}
