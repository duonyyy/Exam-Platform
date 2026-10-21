<?php

namespace App\Http\Requests\ExamSessions;

use App\Enums\UserRole;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AssignStudentsRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ExamSession|null $session */
        $session = $this->route('exam_session');

        return $session instanceof ExamSession
            ? ($this->user()?->can('assignStudents', $session) ?? false)
            : false;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'student_ids' => ['required', 'array', 'min:1', 'max:500'],
            'student_ids.*' => ['required', 'integer', 'distinct', 'min:1'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            $studentIds = $this->input('student_ids');
            if (is_array($studentIds) && ! empty($studentIds)) {
                $validStudentIds = User::query()
                    ->whereIn('id', $studentIds)
                    ->where('role', UserRole::STUDENT)
                    ->where('is_active', true)
                    ->pluck('id')
                    ->all();

                $invalidIds = array_diff($studentIds, $validStudentIds);
                if (! empty($invalidIds)) {
                    $v->errors()->add(
                        'student_ids',
                        'Một hoặc nhiều ID thí sinh không hợp lệ, không phải sinh viên hoặc đã bị vô hiệu hóa: '.implode(', ', $invalidIds)
                    );
                }
            }
        });
    }
}
