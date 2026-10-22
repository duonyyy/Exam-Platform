<?php

namespace App\Http\Resources;

use App\Models\ExamAttempt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ExamAttempt
 */
class ExamAttemptSubmitResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $session = $this->session;
        $exam = $session?->exam;
        $showResult = (bool) ($session ? $session->show_result_immediately : true);

        $totalQuestions = $exam ? ($exam->relationLoaded('questions') ? $exam->questions->count() : $exam->questions()->count()) : 0;
        $answers = $this->relationLoaded('answers') ? $this->answers : $this->answers()->get();
        $answeredQuestions = $answers->filter(fn ($ans) => ! empty($ans->selected_options))->count();

        $passScore = $exam ? (float) $exam->pass_score : 0.0;
        $scoreFloat = $this->score !== null ? (float) $this->score : null;
        $isPassed = ($scoreFloat !== null && $passScore > 0) ? ($scoreFloat >= $passScore) : ($scoreFloat !== null);

        return [
            'attempt_id' => $this->id,
            'status' => $this->status->value,
            'started_at' => $this->started_at->toIso8601String(),
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'total_questions' => $totalQuestions,
            'answered_questions' => $answeredQuestions,
            'score' => $showResult ? ($scoreFloat !== null ? round($scoreFloat, 2) : null) : null,
            'total_points' => $showResult ? ($this->total_points !== null ? round((float) $this->total_points, 2) : null) : null,
            'is_passed' => $showResult ? $isPassed : null,
        ];
    }
}
