<?php

namespace App\Http\Requests\Questions;

use App\Enums\QuestionType;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->can('create', Question::class) ?? false;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        $type = $this->input('question_type');
        $choice = in_array($type, [QuestionType::SINGLE_CHOICE->value, QuestionType::MULTIPLE_CHOICE->value, QuestionType::TRUE_FALSE->value], true);

        return [
            'topic_id' => ['required', 'integer', 'min:1'],
            'question_text' => ['required', 'string', 'max:10000'],
            'question_type' => ['required', Rule::enum(QuestionType::class)],
            'options' => $choice ? ['required', 'array', 'min:2'] : ['missing'],
            'options.*' => ['required', 'array:id,content'],
            'options.*.id' => ['required', 'string', 'max:100', 'distinct:strict'],
            'options.*.content' => ['required', 'string', 'max:2000'],
            'correct_answer' => $type === QuestionType::MULTIPLE_CHOICE->value
                ? ['required', 'array', 'min:1'] : ['required', 'string', 'max:2000'],
            'correct_answer.*' => ['required', 'string', 'max:100', 'distinct:strict'],
            'explanation' => ['nullable', 'string', 'max:10000'],
            'difficulty' => ['required', Rule::in(['easy', 'medium', 'hard'])],
            'subject_id' => ['missing'],
            'created_by' => ['missing'],
            'updated_by' => ['missing'],
            'status' => ['missing'],
            'source' => ['missing'],
            'rejection_reason' => ['missing'],
            'deleted_at' => ['missing'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            // ASVS V2.2: check cross-field invariants after shape validation.
            if ($validator->errors()->has('options') || $validator->errors()->has('correct_answer')) {
                return;
            }

            $type = $this->input('question_type');
            if ($type === QuestionType::SHORT_ANSWER->value) {
                return;
            }
            if (! in_array($type, [QuestionType::SINGLE_CHOICE->value, QuestionType::MULTIPLE_CHOICE->value, QuestionType::TRUE_FALSE->value], true)) {
                return;
            }

            $options = $this->input('options');
            if (! is_array($options) || ! array_is_list($options)) {
                $validator->errors()->add('options', 'The options field must be a list.');

                return;
            }

            $ids = [];
            foreach ($options as $option) {
                if (! is_array($option) || ! isset($option['id']) || ! is_string($option['id'])) {
                    return;
                }
                $ids[] = $option['id'];
            }

            $answer = $this->input('correct_answer');
            $answers = $type === QuestionType::MULTIPLE_CHOICE->value ? $answer : [$answer];
            if (! is_array($answers) || ! array_is_list($answers)) {
                $validator->errors()->add('correct_answer', 'The correct answer must be a list of option IDs.');

                return;
            }
            foreach ($answers as $id) {
                if (! is_string($id) || ! in_array($id, $ids, true)) {
                    $validator->errors()->add('correct_answer', 'The correct answer must reference an option ID.');

                    return;
                }
            }
        });
    }
}
