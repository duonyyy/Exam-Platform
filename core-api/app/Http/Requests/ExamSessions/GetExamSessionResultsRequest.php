<?php

namespace App\Http\Requests\ExamSessions;

use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class GetExamSessionResultsRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('is_passed')) {
            $val = filter_var($this->input('is_passed'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($val !== null) {
                $this->merge(['is_passed' => $val]);
            }
        }
    }

    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->can('viewAny', ExamSession::class) ?? false;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'status' => ['sometimes', 'string', 'in:all,submitted,in_progress,absent'],
            'is_passed' => ['sometimes', 'boolean'],
            'sort_by' => ['sometimes', 'string', 'in:score,name,submitted_at,duration_seconds'],
            'sort_direction' => ['sometimes', 'string', 'in:asc,desc'],
            'search' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
