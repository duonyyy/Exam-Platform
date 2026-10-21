<?php

namespace App\Http\Resources;

use App\Models\AttemptAnswer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin AttemptAnswer */
class AttemptAnswerResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'attempt_id' => $this->attempt_id,
            'question_id' => $this->question_id,
            'selected_options' => $this->selected_options,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
