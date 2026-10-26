<?php

namespace App\Http\Requests\Exams;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ExportExamPdfRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->is_active && ($actor->isAdmin() || $actor->isTeacher());
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'include_answers' => ['nullable', 'boolean'],
        ];
    }
}
