<?php

namespace App\Http\Resources;

use App\Models\ExamSession;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ExamSession */
class StudentAssignedSessionResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $assignment = $this->relationLoaded('assignments') ? $this->assignments->first() : null;

        return [
            'id' => $this->id,
            'exam_id' => $this->exam_id,
            'title' => $this->title,
            'status' => $this->status->value,
            'start_at' => $this->start_at->toIso8601String(),
            'end_at' => $this->end_at->toIso8601String(),
            'allow_late_minutes' => $this->allow_late_minutes,
            'max_attempts' => $this->max_attempts,
            'assigned_at' => $assignment?->assigned_at?->toIso8601String(),
            'exam' => [
                'id' => $this->exam?->id,
                'title' => $this->exam?->title,
                'duration_minutes' => $this->exam?->duration_minutes,
                'total_points' => $this->exam?->total_points,
                'pass_score' => $this->exam?->pass_score,
                'subject' => [
                    'id' => $this->exam?->subject?->id,
                    'code' => $this->exam?->subject?->code,
                    'name' => $this->exam?->subject?->name,
                ],
            ],
        ];
    }
}
