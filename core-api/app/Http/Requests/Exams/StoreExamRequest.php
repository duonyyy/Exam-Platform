<?php

namespace App\Http\Requests\Exams;

use App\Models\Exam;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreExamRequest extends FormRequest
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
            'subject_id' => ['required', 'integer', 'min:1'],
            'title' => ['required', 'string', 'max:255'],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:10080'],
            'pass_score' => ['required', 'numeric', 'min:0', 'max:999999.99', 'decimal:0,2'],
            'shuffle_questions' => ['required', 'boolean'],
            'shuffle_options' => ['required', 'boolean'],
            'created_by' => ['missing'],
            'total_points' => ['missing'],
            'questions' => ['missing'],
        ];
    }
}
