<?php

namespace App\Http\Requests\Attempts;

use App\Models\ExamAttempt;
use App\Models\Question;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Validator;

class SaveAttemptAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ExamAttempt|null $attempt */
        $attempt = $this->route('exam_attempt');

        return $attempt instanceof ExamAttempt
            ? ($this->user()?->can('saveAnswer', $attempt) ?? false)
            : false;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'question_id' => ['required', 'integer', 'min:1'],
            'selected_options' => ['required'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            /** @var ExamAttempt|null $attempt */
            $attempt = $this->route('exam_attempt');
            $questionId = (int) $this->input('question_id');

            if ($attempt && $questionId > 0) {
                $session = $attempt->session;
                if (! $session) {
                    $v->errors()->add('question_id', 'Không tìm thấy ca thi tương ứng.');

                    return;
                }

                $belongsToExam = DB::table('exam_questions')
                    ->where('exam_id', $session->exam_id)
                    ->where('question_id', $questionId)
                    ->exists();

                if (! $belongsToExam) {
                    $v->errors()->add('question_id', 'Câu hỏi không thuộc đề thi của ca thi này.');

                    return;
                }

                // Check option IDs for choice questions
                $question = Question::find($questionId);
                if ($question && is_array($question->options) && ! empty($question->options)) {
                    $validOptionIds = array_column($question->options, 'id');
                    $selected = $this->input('selected_options');
                    $selectedList = is_array($selected) ? $selected : [$selected];

                    $invalidOptions = array_diff($selectedList, $validOptionIds);
                    if (! empty($invalidOptions)) {
                        $v->errors()->add(
                            'selected_options',
                            'Phương án lựa chọn không tồn tại trong câu hỏi: '.implode(', ', $invalidOptions)
                        );
                    }
                }
            }
        });
    }
}
