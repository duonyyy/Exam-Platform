<?php

namespace Tests\Feature\Questions;

use App\Enums\QuestionStatus;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use Tests\TestCase;

class QuestionImportTest extends TestCase
{
    use RefreshDatabase;

    private function createSubjectWithTopic(User $creator, ?User $owner, string $topicName = 'Algorithms'): array
    {
        $subject = new Subject(['code' => 'SUB_'.uniqid(), 'name' => 'Data Structures']);
        $subject->created_by = $creator->id;
        $subject->owner_teacher_id = $owner?->id;
        $subject->save();

        $topic = Topic::create([
            'subject_id' => $subject->id,
            'name' => $topicName,
        ]);

        return [$subject, $topic];
    }

    private function createExcelFile(array $rows, string $filename = 'questions.xlsx'): UploadedFile
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $headers = [
            'STT', 'Mã chủ đề', 'Loại câu hỏi', 'Nội dung câu hỏi',
            'Phương án A', 'Phương án B', 'Phương án C', 'Phương án D',
            'Đáp án đúng', 'Độ khó', 'Giải thích',
        ];
        $sheet->fromArray($headers, null, 'A1');
        $sheet->fromArray($rows, null, 'A2');

        $tempPath = tempnam(sys_get_temp_dir(), 'xlsx_');
        $writer = new XlsxWriter($spreadsheet);
        $writer->save($tempPath);

        return new UploadedFile(
            $tempPath,
            $filename,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            null,
            true
        );
    }

    public function test_teacher_can_download_question_import_template(): void
    {
        $teacher = User::factory()->teacher()->create();

        $response = $this->actingAs($teacher)
            ->getJson('/api/v1/questions/import/template');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $this->assertStringContainsString('exam_platform_questions_template.xlsx', (string) $response->headers->get('Content-Disposition'));
        $this->assertNotEmpty($response->getContent());
    }

    public function test_student_cannot_download_template(): void
    {
        $student = User::factory()->student()->create();

        $response = $this->actingAs($student)
            ->getJson('/api/v1/questions/import/template');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_request_is_rejected_401(): void
    {
        $response = $this->getJson('/api/v1/questions/import/template');
        $response->assertStatus(401);
    }

    public function test_teacher_can_validate_valid_excel_file(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        [$subject, $topic] = $this->createSubjectWithTopic($admin, $teacher);

        $rows = [
            [1, $topic->id, 'single_choice', 'Câu hỏi 1?', 'A1', 'B1', 'C1', 'D1', 'A', 'easy', 'Giải thích 1'],
            [2, $topic->id, 'multiple_choice', 'Câu hỏi 2?', 'Opt1', 'Opt2', 'Opt3', 'Opt4', 'A,B', 'medium', 'Giải thích 2'],
            [3, $topic->id, 'true_false', 'Câu hỏi 3 đúng không?', 'Đúng', 'Sai', '', '', 'Đúng', 'hard', 'Giải thích 3'],
            [4, $topic->id, 'short_answer', 'Câu hỏi tự luận 4?', '', '', '', '', 'TCP/IP', 'medium', 'Giải thích 4'],
        ];

        $file = $this->createExcelFile($rows);

        $response = $this->actingAs($teacher)
            ->postJson('/api/v1/questions/import/validate', [
                'file' => $file,
                'topic_id' => $topic->id,
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'total_rows' => 4,
                'valid_count' => 4,
                'invalid_count' => 0,
                'errors' => [],
            ],
        ]);
        $this->assertCount(4, $response->json('data.preview'));
    }

    public function test_validation_reports_detailed_errors_for_invalid_rows(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        [$subject, $topic] = $this->createSubjectWithTopic($admin, $teacher);

        $rows = [
            // Row 2: Valid
            [1, $topic->id, 'single_choice', 'Câu hỏi hợp lệ?', 'A1', 'B1', '', '', 'A', 'easy', ''],
            // Row 3: Missing question text
            [2, $topic->id, 'single_choice', '', 'A2', 'B2', '', '', 'A', 'easy', ''],
            // Row 4: Invalid correct answer (E does not exist)
            [3, $topic->id, 'single_choice', 'Câu hỏi đáp án sai?', 'A3', 'B3', '', '', 'E', 'easy', ''],
            // Row 5: Invalid question type
            [4, $topic->id, 'invalid_type', 'Loại câu sai?', 'A4', 'B4', '', '', 'A', 'easy', ''],
            // Row 6: Non-existent topic
            [5, 999999, 'single_choice', 'Chủ đề sai?', 'A5', 'B5', '', '', 'A', 'easy', ''],
        ];

        $file = $this->createExcelFile($rows);

        $response = $this->actingAs($teacher)
            ->postJson('/api/v1/questions/import/validate', [
                'file' => $file,
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'total_rows' => 5,
                'valid_count' => 1,
                'invalid_count' => 4,
            ],
        ]);

        $errors = $response->json('data.errors');
        $this->assertNotEmpty($errors);
        $errorCols = array_column($errors, 'column');
        $this->assertContains('question_text', $errorCols);
        $this->assertContains('correct_answer', $errorCols);
        $this->assertContains('question_type', $errorCols);
        $this->assertContains('topic_id', $errorCols);
    }

    public function test_teacher_cannot_import_questions_into_other_teachers_subject_idor(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher1 = User::factory()->teacher()->create();
        $teacher2 = User::factory()->teacher()->create();

        // Topic belongs to teacher 1
        [$subject1, $topic1] = $this->createSubjectWithTopic($admin, $teacher1);

        $rows = [
            [1, $topic1->id, 'single_choice', 'IDOR attack question?', 'A', 'B', '', '', 'A', 'easy', ''],
        ];

        $file = $this->createExcelFile($rows);

        // Teacher 2 tries to validate file with teacher 1's topic
        $response = $this->actingAs($teacher2)
            ->postJson('/api/v1/questions/import/validate', [
                'file' => $file,
            ]);

        $response->assertStatus(200);
        $this->assertEquals(0, $response->json('data.valid_count'));
        $this->assertEquals(1, $response->json('data.invalid_count'));
        $this->assertStringContainsString('IDOR', $response->json('data.errors.0.message'));

        // Teacher 2 tries to execute import
        $importResponse = $this->actingAs($teacher2)
            ->postJson('/api/v1/questions/import', [
                'file' => $file,
            ]);

        $importResponse->assertStatus(422);
    }

    public function test_teacher_can_import_valid_questions_in_transaction(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        [$subject, $topic] = $this->createSubjectWithTopic($admin, $teacher);

        $rows = [
            [1, $topic->id, 'single_choice', 'Q1: REST Idempotency?', 'GET', 'POST', 'PUT', 'DELETE', 'C', 'medium', 'PUT is idempotent'],
            [2, $topic->id, 'multiple_choice', 'Q2: Safe methods?', 'GET', 'HEAD', 'POST', 'DELETE', 'A,B', 'easy', 'GET and HEAD are safe'],
            [3, $topic->id, 'true_false', 'Q3: 204 has no body?', 'Đúng', 'Sai', '', '', 'true', 'easy', 'RFC standard'],
        ];

        $file = $this->createExcelFile($rows);

        $response = $this->actingAs($teacher)
            ->postJson('/api/v1/questions/import', [
                'file' => $file,
                'topic_id' => $topic->id,
            ]);

        $response->assertStatus(201);
        $response->assertJson([
            'message' => 'Nạp thành công 3 câu hỏi vào ngân hàng đề.',
            'data' => [
                'imported_count' => 3,
                'total_processed' => 3,
            ],
        ]);

        $this->assertDatabaseHas('questions', [
            'topic_id' => $topic->id,
            'question_text' => 'Q1: REST Idempotency?',
            'status' => QuestionStatus::READY->value,
            'source' => 'excel_import',
            'created_by' => $teacher->id,
        ]);

        $this->assertDatabaseHas('questions', [
            'topic_id' => $topic->id,
            'question_text' => 'Q2: Safe methods?',
            'status' => QuestionStatus::READY->value,
            'source' => 'excel_import',
            'created_by' => $teacher->id,
        ]);

        $this->assertDatabaseHas('questions', [
            'topic_id' => $topic->id,
            'question_text' => 'Q3: 204 has no body?',
            'status' => QuestionStatus::READY->value,
            'source' => 'excel_import',
            'created_by' => $teacher->id,
        ]);
    }

    public function test_import_rolls_back_if_any_row_is_invalid(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        [$subject, $topic] = $this->createSubjectWithTopic($admin, $teacher);

        $initialCount = Question::count();

        $rows = [
            [1, $topic->id, 'single_choice', 'Valid question', 'A', 'B', '', '', 'A', 'easy', ''],
            [2, $topic->id, 'single_choice', '', 'A', 'B', '', '', 'A', 'easy', ''], // Empty question text
        ];

        $file = $this->createExcelFile($rows);

        $response = $this->actingAs($teacher)
            ->postJson('/api/v1/questions/import', [
                'file' => $file,
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['file']);

        // Check rollback: no questions were inserted
        $this->assertEquals($initialCount, Question::count());
    }

    public function test_non_excel_file_is_rejected_422(): void
    {
        $teacher = User::factory()->teacher()->create();
        $file = UploadedFile::fake()->create('malicious.pdf', 100, 'application/pdf');

        $response = $this->actingAs($teacher)
            ->postJson('/api/v1/questions/import', [
                'file' => $file,
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['file']);
    }
}
