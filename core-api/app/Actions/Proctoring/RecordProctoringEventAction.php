<?php

namespace App\Actions\Proctoring;

use App\Enums\ExamAttemptStatus;
use App\Enums\ProctoringEventType;
use App\Models\ExamAttempt;
use App\Models\ProctoringEvent;
use App\Models\User;
use App\Services\Proctoring\ProctoringSeverityResolver;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class RecordProctoringEventAction
{
    public function __construct(
        protected ProctoringSeverityResolver $severityResolver
    ) {}

    /**
     * @param  array<string, mixed>  $payload
     * @return ProctoringEvent|Collection<int, ProctoringEvent>
     */
    public function handle(ExamAttempt $attempt, array $payload, User $student): ProctoringEvent|Collection
    {
        if ($attempt->status !== ExamAttemptStatus::IN_PROGRESS) {
            throw new ConflictHttpException('Không thể ghi nhận sự kiện giám sát cho lượt thi đã kết thúc.');
        }

        if (isset($payload['events']) && is_array($payload['events'])) {
            return DB::transaction(function () use ($attempt, $payload): Collection {
                $created = new Collection;

                foreach ($payload['events'] as $item) {
                    $eventType = ProctoringEventType::from($item['event_type']);
                    /** @var array<string, mixed>|null $metadata */
                    $metadata = $item['metadata'] ?? null;
                    $severity = $this->severityResolver->resolve($eventType, $metadata);
                    $occurredAt = isset($item['occurred_at']) ? Carbon::parse($item['occurred_at']) : now();

                    $event = ProctoringEvent::create([
                        'attempt_id' => $attempt->id,
                        'event_type' => $eventType,
                        'severity' => $severity,
                        'occurred_at' => $occurredAt,
                        'metadata' => $metadata,
                    ]);

                    $created->push($event);
                }

                return $created;
            });
        }

        $eventType = ProctoringEventType::from($payload['event_type']);
        /** @var array<string, mixed>|null $metadata */
        $metadata = $payload['metadata'] ?? null;
        $severity = $this->severityResolver->resolve($eventType, $metadata);
        $occurredAt = isset($payload['occurred_at']) ? Carbon::parse($payload['occurred_at']) : now();

        return ProctoringEvent::create([
            'attempt_id' => $attempt->id,
            'event_type' => $eventType,
            'severity' => $severity,
            'occurred_at' => $occurredAt,
            'metadata' => $metadata,
        ]);
    }
}
