<?php

namespace App\Http\Requests\ExamSessions;

use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreExamSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->can('create', ExamSession::class) ?? false;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'exam_id' => ['required', 'integer', 'min:1'],
            'title' => ['required', 'string', 'max:255'],
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'allow_late_minutes' => ['nullable', 'integer', 'min:0', 'max:1440'],
            'max_attempts' => ['nullable', 'integer', 'min:1', 'max:10'],
            'created_by' => ['missing'],
            'status' => ['missing'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            $examId = $this->input('exam_id');
            $startAt = $this->input('start_at');
            $endAt = $this->input('end_at');

            if ($examId && $startAt && $endAt) {
                try {
                    $startTime = Carbon::parse($startAt);
                    $endTime = Carbon::parse($endAt);

                    if ($endTime->greaterThan($startTime)) {
                        $exam = Exam::query()->find($examId);
                        if ($exam) {
                            $windowMinutes = $startTime->diffInMinutes($endTime);
                            if ($windowMinutes < $exam->duration_minutes) {
                                $v->errors()->add(
                                    'end_at',
                                    "Khoảng thời gian ca thi ({$windowMinutes} phút) phải lớn hơn hoặc bằng thời lượng làm bài của đề thi ({$exam->duration_minutes} phút)."
                                );
                            }
                        }
                    }
                } catch (\Throwable) {
                    // Carbon parsing errors are already handled by 'date' rule.
                }
            }
        });
    }
}
