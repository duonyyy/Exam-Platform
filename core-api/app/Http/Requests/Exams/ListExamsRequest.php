<?php

namespace App\Http\Requests\Exams;

use App\Models\Exam;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ListExamsRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->can('viewAny', Exam::class) ?? false;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ];
    }
}
