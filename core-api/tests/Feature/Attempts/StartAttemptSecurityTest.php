<?php

namespace Tests\Feature\Attempts;

use App\Enums\ExamAttemptStatus;
use App\Enums\ExamSessionStatus;
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

class StartAttemptSecurityTest extends TestCase
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

    private function createExamWithQuestions(Subject $subject, User $author): Exam
    {
        $topic = Topic::create([
            'subject_id' => $subject->id,
            'name' => 'Database Systems',
        ]);

        $q1 = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'What is ACID in DBMS?',
            'question_type' => QuestionType::SINGLE_CHOICE,
            'options' => [
                ['id' => 'a', 'content' => 'Atomicity, Consistency, Isolation, Durability'],
                ['id' => 'b', 'content' => 'Access, Control, Identity, Data'],
            ],
            'correct_answer' => 'a',
            'explanation' => 'ACID stands for Atomicity, Consistency, Isolation, Durability.',
            'difficulty' => 'medium',
        ]);
        $q1->created_by = $author->id;
        $q1->status = QuestionStatus::READY;
        $q1->source = 'manual';
        $q1->save();

        $exam = new Exam([
            'title' => 'Final Exam Database',
            'duration_minutes' => 60,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => true,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $author->id;
        $exam->save();

        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 10.00]);

        return $exam;
    }

    private function createSession(
        Exam $exam,
        User $teacher,
        ExamSessionStatus $status = ExamSessionStatus::PUBLISHED,
        ?Carbon $startAt = null,
        ?Carbon $endAt = null,
        int $allowLateMinutes = 15,
        int $maxAttempts = 1
    ): ExamSession {
        $start = $startAt ?: Carbon::now()->subMinutes(5);
        $end = $endAt ?: (clone $start)->addHours(2);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Ca thi CSDL '.uniqid(),
            'start_at' => $start,
            'end_at' => $end,
            'allow_late_minutes' => $allowLateMinutes,
            'max_attempts' => $maxAttempts,
        ]);
        $session->created_by = $teacher->id;
        $session->status = $status;
        $session->save();

        return $session;
    }

    public function test_student_can_start_assigned_published_session(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $exam = $this->createExamWithQuestions($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        SessionAssignment::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$session->id}/attempts");

        $response->assertStatus(201)
            ->assertJsonPath('data.exam_session_id', $session->id)
            ->assertJsonPath('data.status', 'in_progress')
            ->assertJsonPath('data.attempt_number', 1)
            ->assertJsonMissing(['correct_answer', 'explanation']);

        $this->assertDatabaseHas('exam_attempts', [
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'status' => 'in_progress',
            'attempt_number' => 1,
        ]);
    }

    public function test_student_cannot_see_correct_answer_when_starting_or_loading_attempt(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $exam = $this->createExamWithQuestions($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        SessionAssignment::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$session->id}/attempts");

        $response->assertStatus(201);
        $attemptId = $response->json('data.id');

        // Khi tải câu hỏi bài thi
        $loadResponse = $this->actingAs($student)
            ->getJson("/api/v1/exam-attempts/{$attemptId}");

        $loadResponse->assertStatus(200)
            ->assertJsonMissing(['correct_answer'])
            ->assertJsonMissing(['explanation'])
            ->assertJsonStructure([
                'data' => [
                    'attempt' => ['id', 'status', 'started_at', 'remaining_seconds'],
                    'questions' => [
                        '*' => [
                            'question_id',
                            'question_text',
                            'question_type',
                            'options' => [
                                '*' => ['id', 'content'],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function test_resuming_active_attempt_returns_existing_attempt(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $exam = $this->createExamWithQuestions($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        SessionAssignment::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
        ]);

        // Start first time
        $firstResponse = $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$session->id}/attempts");
        $firstResponse->assertStatus(201);
        $attemptId = $firstResponse->json('data.id');

        // Start second time (reconnect / refresh)
        $secondResponse = $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$session->id}/attempts");

        $secondResponse->assertStatus(200)
            ->assertJsonPath('data.id', $attemptId)
            ->assertJsonPath('data.attempt_number', 1);

        $this->assertEquals(1, ExamAttempt::query()->where('exam_session_id', $session->id)->count());
    }

    public function test_unassigned_student_is_rejected_with_403(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $exam = $this->createExamWithQuestions($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        // Student is not assigned to session
        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$session->id}/attempts");

        $response->assertStatus(403)
            ->assertJsonPath('error_code', 'STUDENT_NOT_ASSIGNED');
    }

    public function test_student_cannot_start_draft_or_closed_session(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $exam = $this->createExamWithQuestions($subject, $teacher);

        // Draft session
        $draftSession = $this->createSession($exam, $teacher, ExamSessionStatus::DRAFT);
        SessionAssignment::create([
            'exam_session_id' => $draftSession->id,
            'student_id' => $student->id,
        ]);

        $draftResponse = $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$draftSession->id}/attempts");
        $draftResponse->assertStatus(409)
            ->assertJsonPath('error_code', 'SESSION_NOT_PUBLISHED');

        // Closed session
        $closedSession = $this->createSession($exam, $teacher, ExamSessionStatus::CLOSED);
        SessionAssignment::create([
            'exam_session_id' => $closedSession->id,
            'student_id' => $student->id,
        ]);

        $closedResponse = $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$closedSession->id}/attempts");
        $closedResponse->assertStatus(409)
            ->assertJsonPath('error_code', 'SESSION_NOT_PUBLISHED');
    }

    public function test_student_cannot_start_before_session_starts(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $exam = $this->createExamWithQuestions($subject, $teacher);

        // Session starts 1 hour in the future
        $futureSession = $this->createSession(
            $exam,
            $teacher,
            ExamSessionStatus::PUBLISHED,
            Carbon::now()->addHour()
        );

        SessionAssignment::create([
            'exam_session_id' => $futureSession->id,
            'student_id' => $student->id,
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$futureSession->id}/attempts");

        $response->assertStatus(409)
            ->assertJsonPath('error_code', 'SESSION_NOT_STARTED');
    }

    public function test_late_arrival_is_rejected_under_br014(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $exam = $this->createExamWithQuestions($subject, $teacher);

        // Session started 30 mins ago, late allowance is 15 mins
        $lateSession = $this->createSession(
            $exam,
            $teacher,
            ExamSessionStatus::PUBLISHED,
            Carbon::now()->subMinutes(30),
            Carbon::now()->addHour(),
            15
        );

        SessionAssignment::create([
            'exam_session_id' => $lateSession->id,
            'student_id' => $student->id,
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$lateSession->id}/attempts");

        $response->assertStatus(409)
            ->assertJsonPath('error_code', 'SESSION_LATE_ARRIVAL');
    }

    public function test_student_cannot_exceed_max_attempts_under_br009(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $exam = $this->createExamWithQuestions($subject, $teacher);

        // max_attempts = 1
        $session = $this->createSession(
            $exam,
            $teacher,
            ExamSessionStatus::PUBLISHED,
            Carbon::now()->subMinutes(5),
            Carbon::now()->addHour(),
            30,
            1
        );

        SessionAssignment::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
        ]);

        // Attempt 1 already submitted
        ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::SUBMITTED,
            'started_at' => Carbon::now()->subMinutes(20),
            'submitted_at' => Carbon::now()->subMinutes(10),
            'score' => '8.00',
            'total_points' => '10.00',
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$session->id}/attempts");

        $response->assertStatus(409)
            ->assertJsonPath('error_code', 'MAX_ATTEMPTS_REACHED');
    }

    public function test_unauthenticated_or_inactive_student_is_rejected(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->inactive()->create();

        $subject = $this->createSubject($teacher);
        $exam = $this->createExamWithQuestions($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        // Unauthenticated
        $this->postJson("/api/v1/exam-sessions/{$session->id}/attempts")
            ->assertStatus(401);

        // Inactive student
        $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$session->id}/attempts")
            ->assertStatus(403);
    }
}
