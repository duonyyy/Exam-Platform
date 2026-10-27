<?php

namespace App\Http\Resources;

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Question */
class QuestionAdminResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'topic_id' => $this->topic_id,
            'question_text' => $this->question_text,
            'question_type' => $this->question_type->value,
            'options' => $this->options,
            'correct_answer' => $this->correct_answer,
            'explanation' => $this->explanation,
            'difficulty' => $this->difficulty,
            'status' => $this->status->value,
            'source' => $this->source,
            'topic' => $this->relationLoaded('topic') && $this->topic ? [
                'id' => $this->topic->id,
                'name' => $this->topic->name,
                'subject_id' => $this->topic->subject_id,
                'subject' => $this->topic->relationLoaded('subject') && $this->topic->subject ? [
                    'id' => $this->topic->subject->id,
                    'code' => $this->topic->subject->code,
                    'name' => $this->topic->subject->name,
                ] : null,
            ] : null,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
