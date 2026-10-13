<?php

namespace App\Http\Requests\Subjects;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ListSubjectsRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->can('viewAny', Subject::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'search' => ['sometimes', 'string', 'max:100'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ];
    }
}
