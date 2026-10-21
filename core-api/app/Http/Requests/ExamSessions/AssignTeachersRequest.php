<?php

namespace App\Http\Requests\ExamSessions;

use App\Enums\UserRole;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AssignTeachersRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ExamSession|null $session */
        $session = $this->route('exam_session');

        return $session instanceof ExamSession
            ? ($this->user()?->can('assignTeachers', $session) ?? false)
            : false;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'teacher_ids' => ['required', 'array', 'min:1', 'max:50'],
            'teacher_ids.*' => ['required', 'integer', 'distinct', 'min:1'],
            'role_in_session' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            $teacherIds = $this->input('teacher_ids');
            if (is_array($teacherIds) && ! empty($teacherIds)) {
                $validTeacherIds = User::query()
                    ->whereIn('id', $teacherIds)
                    ->where('role', UserRole::TEACHER)
                    ->where('is_active', true)
                    ->pluck('id')
                    ->all();

                $invalidIds = array_diff($teacherIds, $validTeacherIds);
                if (! empty($invalidIds)) {
                    $v->errors()->add(
                        'teacher_ids',
                        'Một hoặc nhiều ID giảng viên không hợp lệ, không phải giảng viên hoặc đã bị vô hiệu hóa: '.implode(', ', $invalidIds)
                    );
                }
            }
        });
    }
}
