<?php

namespace App\Http\Requests\Subjects;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        $subject = $this->route('subject');
        /** @var User|null $actor */
        $actor = $this->user();

        return $subject instanceof Subject && ($actor?->can('update', $subject) ?? false);
    }

    public function rules(): array
    {
        $subject = $this->route('subject');
        /** @var User|null $actor */
        $actor = $this->user();

        return [
            'code' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('subjects', 'code')->ignore($subject->id)],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'created_by' => ['missing'],
            'owner_teacher_id' => $actor?->isAdmin()
                ? ['sometimes', 'nullable', 'integer', Rule::exists('users', 'id')->where('role', 'teacher')->where('is_active', true)]
                : ['missing'],
        ];
    }
}
