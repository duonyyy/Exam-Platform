<?php

namespace App\Models;

use App\Enums\ProctoringEventType;
use App\Enums\ProctoringSeverity;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $attempt_id
 * @property ProctoringEventType $event_type
 * @property ProctoringSeverity $severity
 * @property CarbonInterface $occurred_at
 * @property array<string, mixed>|null $metadata
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read ExamAttempt|null $attempt
 */
class ProctoringEvent extends Model
{
    protected $fillable = [
        'attempt_id',
        'event_type',
        'severity',
        'occurred_at',
        'metadata',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attempt_id' => 'integer',
            'event_type' => ProctoringEventType::class,
            'severity' => ProctoringSeverity::class,
            'occurred_at' => 'immutable_datetime',
            'metadata' => 'array',
        ];
    }

    /** @return BelongsTo<ExamAttempt, $this> */
    public function attempt(): BelongsTo
    {
        return $this->belongsTo(ExamAttempt::class, 'attempt_id');
    }
}
