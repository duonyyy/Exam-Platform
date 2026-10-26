<?php

namespace App\Services\Excel;

use App\Enums\QuestionStatus;
use App\Enums\QuestionType;
use App\Models\Question;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;

class QuestionImportService
{
    /**
     * Generate standard Excel template for question authoring.
     */
    public function generateTemplate(?int $topicId = null): string
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('NganHangCauHoi');

        // Headers
        $headers = [
            'STT',
            'Mã chủ đề (Topic ID)',
            'Loại câu hỏi (single_choice/multiple_choice/true_false/short_answer)',
            'Nội dung câu hỏi',
            'Phương án A',
            'Phương án B',
            'Phương án C',
            'Phương án D',
            'Đáp án đúng (VD: A hoặc A,B hoặc True/False hoặc nội dung ngắn)',
            'Độ khó (easy/medium/hard)',
            'Giải thích đáp án (Tùy chọn)',
        ];

        $sheet->fromArray($headers, null, 'A1');

        // Header Styling
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '1E3A8A'], // Deep Navy
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '0F172A'],
                ],
            ],
        ];

        $sheet->getStyle('A1:K1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(32);

        // Sample Data Rows
        $sampleTopicId = $topicId ?? 1;
        $sampleRows = [
            [
                1,
                $sampleTopicId,
                'single_choice',
                'Trong kiến trúc RESTful API, phương thức HTTP nào có tính chất Idempotent và dùng để cập nhật toàn diện?',
                'POST',
                'PUT',
                'PATCH',
                'DELETE',
                'B',
                'easy',
                'Phương thức PUT có tính chất idempotent và cập nhật toàn bộ tài nguyên theo chuẩn RFC 7231.',
            ],
            [
                2,
                $sampleTopicId,
                'multiple_choice',
                'Những phương thức HTTP nào dưới đây có tính chất an toàn (Safe Methods)?',
                'GET',
                'HEAD',
                'OPTIONS',
                'DELETE',
                'A,B,C',
                'medium',
                'GET, HEAD, OPTIONS chỉ đọc tài nguyên và không làm thay đổi trạng thái phía server.',
            ],
            [
                3,
                $sampleTopicId,
                'true_false',
                'Mã trạng thái HTTP 204 No Content vẫn có thể trả về nội dung message-body trong response?',
                'Đúng',
                'Sai',
                '',
                '',
                'Sai',
                'easy',
                'Chuẩn RFC quy định phản hồi 204 tuyệt đối không chứa message body.',
            ],
            [
                4,
                $sampleTopicId,
                'short_answer',
                'Thuật toán băm mật khẩu mặc định được sử dụng phổ biến trong Laravel là gì?',
                '',
                '',
                '',
                '',
                'bcrypt',
                'hard',
                'Laravel sử dụng thuật toán Bcrypt hoặc Argon2 để băm mật khẩu an toàn.',
            ],
        ];

        $sheet->fromArray($sampleRows, null, 'A2');

        // Style Sample Rows
        $dataStyle = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'CBD5E1'],
                ],
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ];
        $sheet->getStyle('A2:K5')->applyFromArray($dataStyle);
        $sheet->getStyle('A2:C5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('I2:J5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Auto size columns
        foreach (range(1, count($headers)) as $colIndex) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        // Write to binary string
        $writer = new XlsxWriter($spreadsheet);
        ob_start();
        $writer->save('php://output');

        return (string) ob_get_clean();
    }

    /**
     * Validate uploaded Excel file and return errors and preview payload.
     *
     * @return array{
     *     total_rows: int,
     *     valid_count: int,
     *     invalid_count: int,
     *     errors: array<int, array{row: int, column: string, message: string}>,
     *     preview: array<int, array<string, mixed>>,
     *     valid_data: array<int, array<string, mixed>>
     * }
     */
    public function validateExcel(UploadedFile $file, ?int $defaultTopicId, User $actor): array
    {
        $realPath = $file->getRealPath();
        if (! $realPath || ! file_exists($realPath)) {
            throw ValidationException::withMessages([
                'file' => ['Không tìm thấy tệp tin tải lên trên máy chủ.'],
            ]);
        }

        try {
            $spreadsheet = IOFactory::load($realPath);
        } catch (\Throwable $e) {
            throw ValidationException::withMessages([
                'file' => ['Không thể đọc tệp Excel. Vui lòng đảm bảo tệp định dạng .xlsx hợp lệ: '.$e->getMessage()],
            ]);
        }

        $sheet = $spreadsheet->getActiveSheet();
        $highestRow = $sheet->getHighestRow();

        $errors = [];
        $validData = [];
        $preview = [];
        $totalRows = 0;

        // Cache topics owned by teacher / existing topics to minimize DB roundtrips
        $topicCache = [];

        for ($row = 2; $row <= $highestRow; $row++) {
            $cells = [];
            $allEmpty = true;
            for ($col = 1; $col <= 11; $col++) {
                $val = trim((string) $sheet->getCell([$col, $row])->getValue());
                $cells[$col] = $val;
                if ($val !== '') {
                    $allEmpty = false;
                }
            }

            if ($allEmpty) {
                continue;
            }

            $totalRows++;
            $rowErrors = [];

            // 1. Topic ID validation & IDOR check
            $topicIdInput = $cells[2] !== '' ? (int) $cells[2] : $defaultTopicId;
            if (! $topicIdInput) {
                $rowErrors[] = [
                    'row' => $row,
                    'column' => 'topic_id',
                    'message' => 'Thiếu Mã chủ đề (Topic ID). Vui lòng nhập ở cột B hoặc chọn chủ đề mặc định.',
                ];
            } else {
                if (! isset($topicCache[$topicIdInput])) {
                    $topic = Topic::query()->with('subject')->find($topicIdInput);
                    $topicCache[$topicIdInput] = $topic;
                } else {
                    $topic = $topicCache[$topicIdInput];
                }

                if (! $topic) {
                    $rowErrors[] = [
                        'row' => $row,
                        'column' => 'topic_id',
                        'message' => "Chủ đề ID #{$topicIdInput} không tồn tại trên hệ thống.",
                    ];
                } elseif ($actor->isTeacher() && $topic->subject?->owner_teacher_id !== $actor->id) {
                    $rowErrors[] = [
                        'row' => $row,
                        'column' => 'topic_id',
                        'message' => "Bạn không có quyền thêm câu hỏi vào chủ đề thuộc môn '{$topic->subject?->name}' (IDOR Protection).",
                    ];
                }
            }

            // 2. Question Type
            $rawType = strtolower($cells[3]);
            $type = $this->normalizeQuestionType($rawType);
            if (! $type) {
                $rowErrors[] = [
                    'row' => $row,
                    'column' => 'question_type',
                    'message' => "Loại câu hỏi '{$cells[3]}' không hợp lệ. Chỉ chấp nhận: single_choice, multiple_choice, true_false, short_answer.",
                ];
            }

            // 3. Question Text
            $questionText = $cells[4];
            if ($questionText === '') {
                $rowErrors[] = [
                    'row' => $row,
                    'column' => 'question_text',
                    'message' => 'Nội dung câu hỏi không được để trống.',
                ];
            } elseif (mb_strlen($questionText) > 10000) {
                $rowErrors[] = [
                    'row' => $row,
                    'column' => 'question_text',
                    'message' => 'Nội dung câu hỏi vượt quá 10.000 ký tự cho phép.',
                ];
            }

            // 4. Options and Correct Answer
            $options = null;
            $correctAnswer = null;

            if ($type) {
                $optA = $cells[5];
                $optB = $cells[6];
                $optC = $cells[7];
                $optD = $cells[8];
                $rawAns = $cells[9];

                if (in_array($type, [QuestionType::SINGLE_CHOICE, QuestionType::MULTIPLE_CHOICE], true)) {
                    $opts = [];
                    if ($optA !== '') {
                        $opts[] = ['id' => 'A', 'content' => $optA];
                    }
                    if ($optB !== '') {
                        $opts[] = ['id' => 'B', 'content' => $optB];
                    }
                    if ($optC !== '') {
                        $opts[] = ['id' => 'C', 'content' => $optC];
                    }
                    if ($optD !== '') {
                        $opts[] = ['id' => 'D', 'content' => $optD];
                    }

                    if (count($opts) < 2) {
                        $rowErrors[] = [
                            'row' => $row,
                            'column' => 'options',
                            'message' => 'Câu hỏi trắc nghiệm phải có ít nhất 2 phương án lựa chọn (A, B).',
                        ];
                    }

                    $validOptionIds = array_column($opts, 'id');

                    if ($rawAns === '') {
                        $rowErrors[] = [
                            'row' => $row,
                            'column' => 'correct_answer',
                            'message' => 'Đáp án đúng không được để trống.',
                        ];
                    } elseif ($type === QuestionType::SINGLE_CHOICE) {
                        $ansClean = strtoupper(trim($rawAns));
                        if (! in_array($ansClean, $validOptionIds, true)) {
                            $rowErrors[] = [
                                'row' => $row,
                                'column' => 'correct_answer',
                                'message' => "Đáp án đúng '{$rawAns}' không khớp với bất kỳ phương án nào đã nhập (".implode(', ', $validOptionIds).').',
                            ];
                        } else {
                            $correctAnswer = $ansClean;
                        }
                    } else { // MULTIPLE_CHOICE
                        $rawParts = explode(',', $rawAns);
                        $ansCleanList = [];
                        foreach ($rawParts as $part) {
                            $cleaned = strtoupper(trim($part));
                            if ($cleaned !== '') {
                                $ansCleanList[] = $cleaned;
                            }
                        }
                        $ansCleanList = array_values(array_unique($ansCleanList));

                        if (empty($ansCleanList)) {
                            $rowErrors[] = [
                                'row' => $row,
                                'column' => 'correct_answer',
                                'message' => 'Đáp án đúng câu hỏi nhiều lựa chọn không được để trống.',
                            ];
                        } else {
                            $diff = array_diff($ansCleanList, $validOptionIds);
                            if (! empty($diff)) {
                                $rowErrors[] = [
                                    'row' => $row,
                                    'column' => 'correct_answer',
                                    'message' => "Các phương án đáp án '".implode(', ', $diff)."' không tồn tại trong danh sách lựa chọn.",
                                ];
                            } else {
                                $correctAnswer = $ansCleanList;
                            }
                        }
                    }

                    $options = $opts;
                } elseif ($type === QuestionType::TRUE_FALSE) {
                    $options = [
                        ['id' => 'true', 'content' => $optA !== '' ? $optA : 'Đúng'],
                        ['id' => 'false', 'content' => $optB !== '' ? $optB : 'Sai'],
                    ];

                    $rawAnsLower = mb_strtolower(trim($rawAns));
                    if (in_array($rawAnsLower, ['true', 't', 'đúng', 'dung', '1', 'a'], true)) {
                        $correctAnswer = 'true';
                    } elseif (in_array($rawAnsLower, ['false', 'f', 'sai', '0', 'b'], true)) {
                        $correctAnswer = 'false';
                    } else {
                        $rowErrors[] = [
                            'row' => $row,
                            'column' => 'correct_answer',
                            'message' => "Đáp án đúng câu Đúng/Sai '{$rawAns}' không hợp lệ (hãy điền Đúng/Sai hoặc True/False).",
                        ];
                    }
                } elseif ($type === QuestionType::SHORT_ANSWER) {
                    if ($rawAns === '') {
                        $rowErrors[] = [
                            'row' => $row,
                            'column' => 'correct_answer',
                            'message' => 'Đáp án đúng câu trả lời ngắn không được để trống.',
                        ];
                    } else {
                        $options = null;
                        $correctAnswer = trim($rawAns);
                    }
                }
            }

            // 5. Difficulty
            $rawDiff = strtolower($cells[10]);
            $difficulty = $this->normalizeDifficulty($rawDiff);

            // 6. Explanation
            $explanation = $cells[11] !== '' ? $cells[11] : null;

            if (! empty($rowErrors)) {
                foreach ($rowErrors as $re) {
                    $errors[] = $re;
                }
            } else {
                $itemPayload = [
                    'topic_id' => $topicIdInput,
                    'question_type' => $type,
                    'question_text' => $questionText,
                    'options' => $options,
                    'correct_answer' => $correctAnswer,
                    'difficulty' => $difficulty,
                    'explanation' => $explanation,
                ];

                $validData[] = $itemPayload;

                if (count($preview) < 5) {
                    $preview[] = [
                        'row' => $row,
                        'topic_id' => $topicIdInput,
                        'question_type' => $type->value,
                        'question_text' => mb_substr($questionText, 0, 100).'...',
                        'difficulty' => $difficulty,
                        'options_count' => is_array($options) ? count($options) : 0,
                        'correct_answer' => $correctAnswer,
                    ];
                }
            }
        }

        return [
            'total_rows' => $totalRows,
            'valid_count' => count($validData),
            'invalid_count' => $totalRows - count($validData),
            'errors' => $errors,
            'preview' => $preview,
            'valid_data' => $validData,
        ];
    }

    /**
     * Perform the bulk question import within a database transaction.
     *
     * @return array{
     *     imported_count: int,
     *     sample_imported_ids: array<int, int>,
     *     total_processed: int
     * }
     */
    public function import(UploadedFile $file, ?int $defaultTopicId, User $actor): array
    {
        $validationResult = $this->validateExcel($file, $defaultTopicId, $actor);

        if ($validationResult['valid_count'] === 0) {
            $firstError = $validationResult['errors'][0]['message'] ?? 'Tệp tải lên không chứa câu hỏi hợp lệ nào.';
            throw ValidationException::withMessages([
                'file' => ["Nhập thất bại: {$firstError}"],
            ]);
        }

        if ($validationResult['invalid_count'] > 0) {
            $errCount = $validationResult['invalid_count'];
            $sampleErrors = array_slice($validationResult['errors'], 0, 3);
            $msgList = [];
            foreach ($sampleErrors as $err) {
                $msgList[] = "Dòng {$err['row']} [{$err['column']}]: {$err['message']}";
            }
            throw ValidationException::withMessages([
                'file' => [
                    "Phát hiện {$errCount} dòng lỗi trong tệp Excel. Vui lòng sửa toàn bộ lỗi trước khi nhập: ".implode('; ', $msgList),
                ],
            ]);
        }

        return DB::transaction(function () use ($validationResult, $actor): array {
            $createdIds = [];

            foreach ($validationResult['valid_data'] as $item) {
                $question = new Question;
                $question->topic_id = (int) $item['topic_id'];
                $question->created_by = $actor->id;
                $question->question_text = (string) $item['question_text'];
                $question->question_type = $item['question_type'];
                $question->options = $item['options'];
                $question->correct_answer = $item['correct_answer'];
                $question->difficulty = (string) $item['difficulty'];
                $question->explanation = $item['explanation'] !== null ? (string) $item['explanation'] : null;
                $question->status = QuestionStatus::READY;
                $question->source = 'excel_import';
                $question->save();

                $createdIds[] = $question->id;
            }

            return [
                'imported_count' => count($createdIds),
                'sample_imported_ids' => array_slice($createdIds, 0, 10),
                'total_processed' => $validationResult['total_rows'],
            ];
        });
    }

    private function normalizeQuestionType(string $raw): ?QuestionType
    {
        $cleaned = strtolower(trim($raw));

        return match ($cleaned) {
            'single_choice', 'single', 'trắc nghiệm đơn', 'trac_nghiem_don', 'mot_dap_an' => QuestionType::SINGLE_CHOICE,
            'multiple_choice', 'multiple', 'nhiều đáp án', 'nhieu_dap_an' => QuestionType::MULTIPLE_CHOICE,
            'true_false', 'tf', 'đúng sai', 'dung_sai', 'dung/sai' => QuestionType::TRUE_FALSE,
            'short_answer', 'short', 'tự luận ngắn', 'tu_luan_ngan', 'tu_luan' => QuestionType::SHORT_ANSWER,
            default => null,
        };
    }

    private function normalizeDifficulty(string $raw): string
    {
        $cleaned = strtolower(trim($raw));

        return match ($cleaned) {
            'easy', 'dễ', 'de' => 'easy',
            'hard', 'khó', 'kho' => 'hard',
            default => 'medium',
        };
    }
}
