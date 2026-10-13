<?php

namespace App\Http\Requests\Topics;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreTopicRequest extends FormRequest
{
    public function authorize(): bool
    {
        $subject = $this->route('subject');
        /** @var User|null $actor */
        $actor = $this->user();

        return $subject instanceof Subject && ($actor?->can('createTopic', $subject) ?? false);
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'subject_id' => ['missing'],
        ];
    }
}
