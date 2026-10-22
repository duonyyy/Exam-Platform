<?php

namespace App\Http\Resources;

use App\Models\ExamAttempt;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ExamAttempt */
class ExamAttemptDetailResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $session = $this->session;
        $exam = $session?->exam;

        $questionsData = [];
        if ($exam) {
            $questions = $exam->relationLoaded('questions')
                ? $exam->questions
                : $exam->questions()->orderBy('exam_questions.order')->get();

            $questionsData = $questions->map(function (Question $q): array {
                /** @var object{order: int, points: string}|null $pivot */
                $pivot = $q->pivot;

                return [
                    'id' => $q->id,
                    'question_id' => $q->id,
                    'order' => $pivot ? (int) $pivot->order : 1,
                    'points' => $pivot ? (float) $pivot->points : 1.0,
                    'question_text' => $q->question_text,
                    'question_type' => $q->question_type->value,
                    'options' => array_values(array_map(static fn (array $option): array => [
                        'id' => is_string($option['id'] ?? null) ? $option['id'] : '',
                        'content' => is_string($option['content'] ?? null) ? $option['content'] : '',
                    ], array_filter($q->options ?? [], 'is_array'))),
                ];
            })->values()->all();
        }

        $answersData = $this->answers->map(function ($answer): array {
            return [
                'id' => $answer->id,
                'question_id' => $answer->question_id,
                'selected_options' => $answer->selected_options,
                'updated_at' => $answer->updated_at?->toISOString(),
            ];
        })->values()->all();

        $remainingSeconds = $this->calculateRemainingSeconds();
        $showResult = (bool) ($session ? $session->show_result_immediately : true);
        $scoreFloat = $this->score !== null ? (float) $this->score : null;
        $passScore = $exam ? (float) $exam->pass_score : 0.0;
        $isPassed = ($scoreFloat !== null && $passScore > 0) ? ($scoreFloat >= $passScore) : ($scoreFloat !== null);

        return [
            'id' => $this->id,
            'exam_session_id' => $this->exam_session_id,
            'attempt_number' => $this->attempt_number,
            'status' => $this->status->value,
            'started_at' => $this->started_at->toISOString(),
            'submitted_at' => $this->submitted_at?->toISOString(),
            'remaining_seconds' => $remainingSeconds,
            'score' => $showResult ? ($scoreFloat !== null ? round($scoreFloat, 2) : null) : null,
            'total_points' => $showResult ? ($this->total_points !== null ? round((float) $this->total_points, 2) : ($exam ? (float) $exam->total_points : null)) : null,
            'is_passed' => $showResult ? $isPassed : null,
            'attempt' => [
                'id' => $this->id,
                'status' => $this->status->value,
                'started_at' => $this->started_at->toISOString(),
                'remaining_seconds' => $remainingSeconds,
            ],
            'exam' => $exam ? [
                'id' => $exam->id,
                'title' => $exam->title,
                'duration_minutes' => $exam->duration_minutes,
                'total_points' => (float) $exam->total_points,
            ] : null,
            'questions' => $questionsData,
            'answers' => $answersData,
        ];
    }
}
