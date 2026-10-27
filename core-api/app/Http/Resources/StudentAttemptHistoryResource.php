<?php

namespace App\Http\Resources;

use App\Models\ExamAttempt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ExamAttempt
 */
class StudentAttemptHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $session = $this->session;
        $exam = $session?->exam;
        $subject = $exam?->subject;

        $isPassed = null;
        if ($this->score !== null && $exam) {
            $isPassed = (float) $this->score >= (float) $exam->pass_score;
        }

        return [
            'attempt_id' => $this->id,
            'status' => $this->status->value,
            'started_at' => $this->started_at?->toIso8601String(),
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'score' => $this->score !== null ? (float) $this->score : null,
            'total_points' => $exam ? (float) $exam->total_points : null,
            'pass_score' => $exam ? (float) $exam->pass_score : null,
            'is_passed' => $isPassed,
            'session' => $session ? [
                'id' => $session->id,
                'title' => $session->title,
                'start_at' => $session->start_at?->toIso8601String(),
                'end_at' => $session->end_at?->toIso8601String(),
            ] : null,
            'exam' => $exam ? [
                'id' => $exam->id,
                'title' => $exam->title,
                'duration_minutes' => $exam->duration_minutes,
                'questions_count' => $this->answers_count ?? $this->answers()->count(),
            ] : null,
            'subject' => $subject ? [
                'id' => $subject->id,
                'code' => $subject->code,
                'name' => $subject->name,
            ] : null,
        ];
    }
}
