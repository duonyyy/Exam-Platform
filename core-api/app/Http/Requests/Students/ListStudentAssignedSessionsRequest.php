<?php

namespace App\Http\Requests\Students;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ListStudentAssignedSessionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor !== null && $actor->is_active && $actor->isStudent();
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'status' => ['sometimes', 'string', 'in:published,closed'],
        ];
    }
}
