<?php

namespace App\Http\Requests\Questions;

use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ListQuestionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->can('viewAny', Question::class) ?? false;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'search' => ['sometimes', 'string', 'max:255'],
            'topic_id' => ['sometimes', 'integer'],
            'status' => ['sometimes', 'string'],
            'difficulty' => ['sometimes', 'string'],
        ];
    }
}
