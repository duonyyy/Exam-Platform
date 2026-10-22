<?php

namespace App\Http\Requests\Attempts;

use App\Models\ExamAttempt;
use App\Models\Question;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Validator;

class SubmitExamAttemptRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ExamAttempt|null $attempt */
        $attempt = $this->route('exam_attempt');

        return $attempt instanceof ExamAttempt
            ? ($this->user()?->can('submit', $attempt) ?? false)
            : false;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'final_answers' => ['sometimes', 'array'],
            'final_answers.*.question_id' => ['required', 'integer', 'min:1'],
            'final_answers.*.selected_options' => ['sometimes'],
            'final_answers.*.answer' => ['sometimes'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            /** @var ExamAttempt|null $attempt */
            $attempt = $this->route('exam_attempt');
            $finalAnswers = $this->input('final_answers');

            if (! $attempt || ! is_array($finalAnswers) || empty($finalAnswers)) {
                return;
            }

            $session = $attempt->session;
            if (! $session) {
                $v->errors()->add('final_answers', 'Không tìm thấy ca thi tương ứng.');

                return;
            }

            $validExamQuestionIds = DB::table('exam_questions')
                ->where('exam_id', $session->exam_id)
                ->pluck('question_id')
                ->all();

            $examQuestionMap = array_flip($validExamQuestionIds);

            foreach ($finalAnswers as $index => $item) {
                if (! is_array($item)) {
                    continue;
                }

                $questionId = (int) ($item['question_id'] ?? 0);
                if (! isset($examQuestionMap[$questionId])) {
                    $v->errors()->add("final_answers.{$index}.question_id", "Câu hỏi ID {$questionId} không thuộc đề thi của ca thi này.");

                    continue;
                }

                $rawSelected = $item['selected_options'] ?? $item['answer'] ?? null;
                if ($rawSelected === null) {
                    continue;
                }

                $question = Question::find($questionId);
                if ($question && is_array($question->options) && ! empty($question->options)) {
                    $validOptionIds = array_column($question->options, 'id');
                    $selectedList = is_array($rawSelected) ? $rawSelected : [$rawSelected];

                    $invalidOptions = array_diff($selectedList, $validOptionIds);
                    if (! empty($invalidOptions)) {
                        $v->errors()->add(
                            "final_answers.{$index}.selected_options",
                            'Phương án lựa chọn không tồn tại trong câu hỏi: '.implode(', ', $invalidOptions)
                        );
                    }
                }
            }
        });
    }
}
