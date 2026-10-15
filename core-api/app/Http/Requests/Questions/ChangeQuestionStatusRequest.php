<?php

namespace App\Http\Requests\Questions;

use App\Enums\QuestionStatus;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeQuestionStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $question = $this->route('question');
        /** @var User|null $actor */
        $actor = $this->user();

        return $question instanceof Question && ($actor?->can('update', $question) ?? false);
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(QuestionStatus::class)],
            'question_text' => ['missing'],
            'correct_answer' => ['missing'],
            'created_by' => ['missing'],
            'updated_by' => ['missing'],
        ];
    }
}
