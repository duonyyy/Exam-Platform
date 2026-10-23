<?php

namespace App\Http\Requests\Exams;

use App\Models\Exam;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreExamFromBlueprintRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->can('create', Exam::class) ?? false;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'thread_id' => ['required', 'string', 'min:1', 'max:64'],
            'prompt_hash' => ['required', 'string', 'regex:/^[a-f0-9]{64}$/i'],
            'proposal_hash' => ['required', 'string', 'regex:/^[a-f0-9]{64}$/i'],
            'subject_id' => ['required', 'integer', 'min:1'],
            'title' => ['required', 'string', 'min:1', 'max:255'],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:10080'],
            'pass_score' => ['required', 'numeric', 'min:0', 'max:999999.99', 'decimal:0,2'],
            'shuffle_questions' => ['required', 'boolean'],
            'shuffle_options' => ['required', 'boolean'],
            'questions' => ['required', 'array', 'list', 'min:1', 'max:100'],
            'questions.*' => ['required', 'array:question_id,order,points'],
            'questions.*.question_id' => ['required', 'integer', 'min:1', 'distinct:strict'],
            'questions.*.order' => ['required', 'integer', 'min:1', 'distinct:strict'],
            'questions.*.points' => ['required', 'numeric', 'gt:0', 'max:999999.99', 'decimal:0,2'],
            'metadata' => ['nullable', 'array'],
            'created_by' => ['missing'],
            'total_points' => ['missing'],
        ];
    }
}
