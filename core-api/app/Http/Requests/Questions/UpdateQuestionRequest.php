<?php

namespace App\Http\Requests\Questions;

use App\Models\Question;
use App\Models\User;
use Illuminate\Validation\Rule;

class UpdateQuestionRequest extends StoreQuestionRequest
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
        $rules = parent::rules();
        /** @var Question $question */
        $question = $this->route('question');
        // ASVS V2.2: a content edit cannot silently reassign a question to another Topic.
        $rules['topic_id'] = ['required', 'integer', Rule::in([$question->topic_id])];

        return $rules;
    }
}
