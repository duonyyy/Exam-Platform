<?php

namespace App\Http\Requests\Exams;

use App\Models\Exam;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class AttachQuestionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();
        /** @var Exam|null $exam */
        $exam = $this->route('exam');

        return $actor !== null && $exam !== null && $actor->can('update', $exam);
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'questions' => ['required', 'array', 'list', 'min:1', 'max:100'],
            'questions.*' => ['required', 'array:question_id,order,points'],
            'questions.*.question_id' => ['required', 'integer', 'min:1', 'distinct:strict'],
            'questions.*.order' => ['required', 'integer', 'min:1', 'distinct:strict'],
            'questions.*.points' => ['required', 'numeric', 'gt:0', 'max:999999.99', 'decimal:0,2'],
            'exam_id' => ['missing'],
            'total_points' => ['missing'],
        ];
    }
}
