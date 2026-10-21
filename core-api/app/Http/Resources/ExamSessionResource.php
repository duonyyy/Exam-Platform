<?php

namespace App\Http\Resources;

use App\Models\ExamSession;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ExamSession */
class ExamSessionResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'exam_id' => $this->exam_id,
            'title' => $this->title,
            'status' => $this->status->value,
            'start_at' => $this->start_at->toIso8601String(),
            'end_at' => $this->end_at->toIso8601String(),
            'allow_late_minutes' => $this->allow_late_minutes,
            'max_attempts' => $this->max_attempts,
            'assigned_students_count' => $this->whenCounted('assignments'),
            'teachers_count' => $this->whenCounted('sessionTeachers'),
            'exam' => $this->whenLoaded('exam', fn () => new ExamResource($this->exam)),
            'created_by' => $this->created_by,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
