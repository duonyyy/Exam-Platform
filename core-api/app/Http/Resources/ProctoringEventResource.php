<?php

namespace App\Http\Resources;

use App\Models\ProctoringEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ProctoringEvent
 */
class ProctoringEventResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $student = $this->relationLoaded('attempt') && $this->attempt && $this->attempt->relationLoaded('student')
            ? $this->attempt->student
            : null;

        return [
            'id' => $this->id,
            'attempt_id' => $this->attempt_id,
            'student' => $student ? [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'code' => $student->code,
            ] : null,
            'event_type' => $this->event_type->value,
            'severity' => $this->severity->value,
            'occurred_at' => $this->occurred_at->toISOString(),
            'metadata' => $this->metadata,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
