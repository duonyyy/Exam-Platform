<?php

namespace App\Http\Requests\Questions;

use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class QuestionImportRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actor */
        $actor = $this->user();

        return $actor?->can('create', Question::class) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:xlsx', 'max:10240'],
            'topic_id' => ['nullable', 'integer', 'exists:topics,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.required' => 'Vui lòng chọn tệp tin Excel để nhập câu hỏi.',
            'file.mimes' => 'Định dạng tệp tin không hợp lệ. Chỉ chấp nhận tệp Excel .xlsx chuẩn.',
            'file.max' => 'Dung lượng tệp tin vượt quá giới hạn tối đa cho phép (10MB).',
            'topic_id.exists' => 'Mã chủ đề mặc định không tồn tại trên hệ thống.',
        ];
    }
}
