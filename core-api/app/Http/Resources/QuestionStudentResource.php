<?php

namespace App\Http\Resources;

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Question */
class QuestionStudentResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        // ASVS V13.4 / BR-004: explicit allow-list for future attempt responses.
        return [
            'id' => $this->id,
            'question_text' => $this->question_text,
            'question_type' => $this->question_type->value,
            'options' => array_values(array_map(static fn (array $option): array => [
                'id' => is_string($option['id'] ?? null) ? $option['id'] : '',
                'content' => is_string($option['content'] ?? null) ? $option['content'] : '',
            ], array_filter($this->options ?? [], 'is_array'))),
        ];
    }
}
