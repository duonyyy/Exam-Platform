<?php

namespace Tests\Feature\Proctoring;

use App\Enums\ExamAttemptStatus;
use App\Enums\ExamSessionStatus;
use App\Enums\ProctoringEventType;
use App\Enums\ProctoringSeverity;
use App\Enums\QuestionStatus;
use App\Enums\QuestionType;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\Question;
use App\Models\SessionAssignment;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecordProctoringEventTest extends TestCase
{
    use RefreshDatabase;

    private function createSubject(User $creator): Subject
    {
        $subject = new Subject([
            'code' => 'CS_'.uniqid(),
            'name' => 'Computer Science',
        ]);
        $subject->created_by = $creator->id;
        $subject->owner_teacher_id = $creator->id;
        $subject->save();

        return $subject;
    }

    private function createExam(Subject $subject, User $author): Exam
    {
        $topic = new Topic([
            'subject_id' => $subject->id,
            'name' => 'Algorithms',
        ]);
        $topic->save();

        $question = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'What is Big-O of binary search?',
            'question_type' => QuestionType::SINGLE_CHOICE,
            'options' => [
                ['id' => 'opt_a', 'content' => 'O(log n)'],
                ['id' => 'opt_b', 'content' => 'O(n)'],
            ],
            'correct_answer' => 'opt_a',
        ]);
        $question->status = QuestionStatus::READY;
        $question->created_by = $author->id;
        $question->save();

        $exam = new Exam([
            'title' => 'Midterm Exam',
            'duration_minutes' => 60,
            'pass_score' => 5.0,
            'shuffle_questions' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $author->id;
        $exam->save();
        $exam->questions()->attach($question->id, ['order' => 1, 'points' => 10.0]);

        return $exam;
    }

    private function createSession(Exam $exam, User $creator): ExamSession
    {
        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Morning Session',
            'start_at' => Carbon::now()->subMinutes(10),
            'end_at' => Carbon::now()->addHours(2),
            'status' => ExamSessionStatus::PUBLISHED,
            'created_by' => $creator->id,
            'max_attempts' => 1,
            'allow_late_arrival' => true,
            'show_result_immediately' => true,
        ]);
        $session->save();

        return $session;
    }

    private function createAttempt(
        ExamSession $session,
        User $student,
        ExamAttemptStatus $status = ExamAttemptStatus::IN_PROGRESS
    ): ExamAttempt {
        SessionAssignment::firstOrCreate(
            ['exam_session_id' => $session->id, 'student_id' => $student->id],
            ['assigned_at' => now()]
        );

        $attempt = new ExamAttempt([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => $status,
            'started_at' => now()->subMinutes(5),
            'submitted_at' => $status === ExamAttemptStatus::SUBMITTED ? now() : null,
        ]);
        $attempt->save();

        return $attempt;
    }

    public function test_student_can_record_single_proctoring_event_with_automatic_severity(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $student = User::factory()->student()->create();
        $attempt = $this->createAttempt($session, $student);

        // Record a tab_hidden event with 35 seconds away -> should resolve to HIGH severity
        $response = $this->actingAs($student, 'sanctum')
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/proctoring-events", [
                'event_type' => ProctoringEventType::TAB_HIDDEN->value,
                'occurred_at' => now()->toIso8601String(),
                'metadata' => ['duration_seconds' => 35],
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.attempt_id', $attempt->id)
            ->assertJsonPath('data.event_type', ProctoringEventType::TAB_HIDDEN->value)
            ->assertJsonPath('data.severity', ProctoringSeverity::HIGH->value)
            ->assertJsonPath('data.metadata.duration_seconds', 35);

        $this->assertDatabaseHas('proctoring_events', [
            'attempt_id' => $attempt->id,
            'event_type' => ProctoringEventType::TAB_HIDDEN->value,
            'severity' => ProctoringSeverity::HIGH->value,
        ]);
    }

    public function test_student_can_record_batch_of_proctoring_events(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $student = User::factory()->student()->create();
        $attempt = $this->createAttempt($session, $student);

        $response = $this->actingAs($student, 'sanctum')
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/proctoring-events", [
                'events' => [
                    [
                        'event_type' => ProctoringEventType::FULLSCREEN_EXIT->value,
                        'occurred_at' => now()->subSeconds(20)->toIso8601String(),
                    ],
                    [
                        'event_type' => ProctoringEventType::DEVTOOLS_OPENED->value,
                        'occurred_at' => now()->toIso8601String(),
                    ],
                ],
            ]);

        $response->assertCreated()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.event_type', ProctoringEventType::FULLSCREEN_EXIT->value)
            ->assertJsonPath('data.0.severity', ProctoringSeverity::MEDIUM->value)
            ->assertJsonPath('data.1.event_type', ProctoringEventType::DEVTOOLS_OPENED->value)
            ->assertJsonPath('data.1.severity', ProctoringSeverity::CRITICAL->value);

        $this->assertDatabaseCount('proctoring_events', 2);
    }

    public function test_idor_student_cannot_record_event_on_another_student_attempt(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $studentA = User::factory()->student()->create();
        $studentB = User::factory()->student()->create();
        $attemptA = $this->createAttempt($session, $studentA);

        $response = $this->actingAs($studentB, 'sanctum')
            ->postJson("/api/v1/exam-attempts/{$attemptA->id}/proctoring-events", [
                'event_type' => ProctoringEventType::TAB_HIDDEN->value,
            ]);

        $response->assertForbidden();
        $this->assertDatabaseEmpty('proctoring_events');
    }

    public function test_cannot_record_event_on_submitted_attempt(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $student = User::factory()->student()->create();
        $attempt = $this->createAttempt($session, $student, status: ExamAttemptStatus::SUBMITTED);

        $response = $this->actingAs($student, 'sanctum')
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/proctoring-events", [
                'event_type' => ProctoringEventType::TAB_HIDDEN->value,
            ]);

        $response->assertForbidden();
    }

    public function test_teacher_or_admin_cannot_record_proctoring_event(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $student = User::factory()->student()->create();
        $attempt = $this->createAttempt($session, $student);

        // Teacher tries to send proctoring event -> 403 Forbidden (Only students can send proctoring signals)
        $response = $this->actingAs($teacher, 'sanctum')
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/proctoring-events", [
                'event_type' => ProctoringEventType::TAB_HIDDEN->value,
            ]);

        $response->assertForbidden();
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->postJson('/api/v1/exam-attempts/1/proctoring-events', [
            'event_type' => ProctoringEventType::TAB_HIDDEN->value,
        ]);

        $response->assertUnauthorized();
    }

    public function test_validation_rejects_invalid_event_type(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $student = User::factory()->student()->create();
        $attempt = $this->createAttempt($session, $student);

        $response = $this->actingAs($student, 'sanctum')
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/proctoring-events", [
                'event_type' => 'malicious_injected_event_type',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['event_type']);
    }
}
