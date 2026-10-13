<?php

namespace App\Http\Requests\Subjects;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->can('create', Subject::class) ?? false;
    }

    public function rules(): array
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return [
            'code' => ['required', 'string', 'max:50', Rule::unique('subjects', 'code')],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'created_by' => ['missing'],
            'owner_teacher_id' => $actor?->isAdmin()
                ? ['sometimes', 'nullable', 'integer', Rule::exists('users', 'id')->where('role', 'teacher')->where('is_active', true)]
                : ['missing'],
        ];
    }
}
