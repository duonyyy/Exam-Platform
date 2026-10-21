<?php

namespace App\Http\Requests\ExamSessions;

use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ListExamSessionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->can('viewAny', ExamSession::class) ?? false;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'status' => ['sometimes', 'string', 'in:draft,published,closed,cancelled'],
            'exam_id' => ['sometimes', 'integer', 'min:1'],
        ];
    }
}
