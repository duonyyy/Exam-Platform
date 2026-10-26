<?php

namespace Tests\Feature\Exams;

use App\Enums\ExamSessionStatus;
use App\Enums\QuestionStatus;
use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\Question;
use App\Models\SessionAssignment;
use App\Models\SessionTeacher;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ExamExportTest extends TestCase
{
    use RefreshDatabase;

    private function createSubject(User $creator, ?User $owner): Subject
    {
        $subject = new Subject(['code' => 'EXP_'.uniqid(), 'name' => 'Software Architecture']);
        $subject->created_by = $creator->id;
        $subject->owner_teacher_id = $owner?->id;
        $subject->save();

        return $subject;
    }

    private function createExam(Subject $subject, User $author): Exam
    {
        $exam = new Exam([
            'title' => 'Final Exam Test',
            'duration_minutes' => 60,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $author->id;
        $exam->save();

        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Design Patterns']);
        $question = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'What pattern provides a single point of access?',
            'question_type' => 'single_choice',
            'options' => [
                ['id' => 'a', 'content' => 'Singleton'],
                ['id' => 'b', 'content' => 'Observer'],
            ],
            'correct_answer' => 'a',
            'difficulty' => 'easy',
            'explanation' => 'Singleton pattern restricts instantiation of a class to one single instance.',
        ]);
        $question->created_by = $author->id;
        $question->status = QuestionStatus::READY;
        $question->source = 'manual';
        $question->save();

        DB::table('exam_questions')->insert([
            'exam_id' => $exam->id,
            'question_id' => $question->id,
            'order' => 1,
            'points' => '10.00',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $exam;
    }

    private function createSession(Exam $exam, User $creator): ExamSession
    {
        $startAt = Carbon::now()->subHour();
        $endAt = Carbon::now()->addHours(2);

        $session = new ExamSession([
            'title' => 'Ca Thi Học Kỳ 1',
            'start_at' => $startAt,
            'end_at' => $endAt,
            'max_attempts' => 1,
            'allow_late_minutes' => 15,
        ]);
        $session->exam_id = $exam->id;
        $session->created_by = $creator->id;
        $session->status = ExamSessionStatus::PUBLISHED;
        $session->save();

        return $session;
    }

    public function test_teacher_can_export_session_results_excel(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        SessionAssignment::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'assigned_at' => now(),
        ]);

        $response = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/export/excel");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $this->assertStringContainsString("bang-diem-ca-thi-{$session->id}.xlsx", (string) $response->headers->get('Content-Disposition'));
        $this->assertNotEmpty($response->getContent());
    }

    public function test_teacher_can_export_session_results_pdf(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        SessionAssignment::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'assigned_at' => now(),
        ]);

        $response = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/export/pdf");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
        $this->assertStringContainsString("bien-ban-ca-thi-{$session->id}.pdf", (string) $response->headers->get('Content-Disposition'));
        $this->assertStringStartsWith('%PDF', (string) $response->getContent());
    }

    public function test_assigned_proctor_teacher_can_export_session_results(): void
    {
        $admin = User::factory()->admin()->create();
        $ownerTeacher = User::factory()->teacher()->create();
        $proctorTeacher = User::factory()->teacher()->create();

        $subject = $this->createSubject($admin, $ownerTeacher);
        $exam = $this->createExam($subject, $ownerTeacher);
        $session = $this->createSession($exam, $ownerTeacher);

        SessionTeacher::create([
            'exam_session_id' => $session->id,
            'teacher_id' => $proctorTeacher->id,
            'role_in_session' => 'Cán bộ coi thi chính',
        ]);

        // Proctor teacher exports excel
        $response = $this->actingAs($proctorTeacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/export/excel");

        $response->assertStatus(200);

        // Proctor teacher exports pdf
        $pdfResponse = $this->actingAs($proctorTeacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/export/pdf");

        $pdfResponse->assertStatus(200);
    }

    public function test_unauthorized_teacher_cannot_export_session_results_idor(): void
    {
        $admin = User::factory()->admin()->create();
        $ownerTeacher = User::factory()->teacher()->create();
        $otherTeacher = User::factory()->teacher()->create();

        $subject = $this->createSubject($admin, $ownerTeacher);
        $exam = $this->createExam($subject, $ownerTeacher);
        $session = $this->createSession($exam, $ownerTeacher);

        $response = $this->actingAs($otherTeacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/export/excel");

        $response->assertStatus(403);

        $pdfResponse = $this->actingAs($otherTeacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/export/pdf");

        $pdfResponse->assertStatus(403);
    }

    public function test_student_cannot_export_session_results(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $response = $this->actingAs($student)
            ->getJson("/api/v1/exam-sessions/{$session->id}/export/excel");

        $response->assertStatus(403);

        $pdfResponse = $this->actingAs($student)
            ->getJson("/api/v1/exam-sessions/{$session->id}/export/pdf");

        $pdfResponse->assertStatus(403);
    }

    public function test_teacher_can_export_exam_pdf_without_answers(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);

        $response = $this->actingAs($teacher)
            ->getJson("/api/v1/exams/{$exam->id}/export/pdf");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
        $this->assertStringContainsString("de-thi-{$exam->id}.pdf", (string) $response->headers->get('Content-Disposition'));
        $this->assertStringStartsWith('%PDF', (string) $response->getContent());
    }

    public function test_teacher_can_export_exam_pdf_with_answers(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);

        $response = $this->actingAs($teacher)
            ->getJson("/api/v1/exams/{$exam->id}/export/pdf?include_answers=1");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
        $this->assertStringContainsString("de-thi-{$exam->id}-co-dap-an.pdf", (string) $response->headers->get('Content-Disposition'));
        $this->assertStringStartsWith('%PDF', (string) $response->getContent());
    }

    public function test_unauthorized_teacher_cannot_export_exam_pdf_idor(): void
    {
        $admin = User::factory()->admin()->create();
        $ownerTeacher = User::factory()->teacher()->create();
        $otherTeacher = User::factory()->teacher()->create();

        $subject = $this->createSubject($admin, $ownerTeacher);
        $exam = $this->createExam($subject, $ownerTeacher);

        $response = $this->actingAs($otherTeacher)
            ->getJson("/api/v1/exams/{$exam->id}/export/pdf");

        $response->assertStatus(403);
    }

    public function test_student_cannot_export_exam_pdf(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);

        $response = $this->actingAs($student)
            ->getJson("/api/v1/exams/{$exam->id}/export/pdf");

        $response->assertStatus(403);
    }

    public function test_unauthenticated_request_is_rejected_401(): void
    {
        $response = $this->getJson('/api/v1/exams/1/export/pdf');
        $response->assertStatus(401);
    }
}
