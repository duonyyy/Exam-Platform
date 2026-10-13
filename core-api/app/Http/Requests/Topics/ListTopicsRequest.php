<?php

namespace App\Http\Requests\Topics;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ListTopicsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $subject = $this->route('subject');
        /** @var User|null $actor */
        $actor = $this->user();

        return $subject instanceof Subject && ($actor?->can('view', $subject) ?? false);
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
