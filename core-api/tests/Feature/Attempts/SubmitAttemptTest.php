<?php

namespace Tests\Feature\Attempts;

use App\Enums\ExamAttemptStatus;
use App\Enums\ExamSessionStatus;
use App\Enums\QuestionStatus;
use App\Enums\QuestionType;
use App\Models\AttemptAnswer;
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
use Illuminate\Support\Str;
use Tests\TestCase;

class SubmitAttemptTest extends TestCase
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

    private function createQuestion(
        Topic $topic,
        User $author,
        QuestionType $type = QuestionType::SINGLE_CHOICE,
        mixed $correctAnswer = 'opt_a',
        ?array $options = null
    ): Question {
        if ($options === null) {
            $options = $type === QuestionType::SHORT_ANSWER ? null : [
                ['id' => 'opt_a', 'content' => 'Option A'],
                ['id' => 'opt_b', 'content' => 'Option B'],
                ['id' => 'opt_c', 'content' => 'Option C'],
            ];
        }

        $q = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'Sample Question '.uniqid(),
            'question_type' => $type,
            'options' => $options,
            'correct_answer' => $correctAnswer,
            'difficulty' => 'medium',
        ]);
        $q->created_by = $author->id;
        $q->status = QuestionStatus::READY;
        $q->source = 'manual';
        $q->save();

        return $q;
    }

    private function createExam(Subject $subject, User $author, int $durationMinutes = 60, float $passScore = 5.0): Exam
    {
        $exam = new Exam([
            'title' => 'Exam '.uniqid(),
            'duration_minutes' => $durationMinutes,
            'pass_score' => number_format($passScore, 2, '.', ''),
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $author->id;
        $exam->save();

        return $exam;
    }

    private function createSession(
        Exam $exam,
        User $creator,
        bool $showResultImmediately = true,
        int $startMinutesAgo = 10,
        int $endHoursLater = 1
    ): ExamSession {
        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Session '.uniqid(),
            'start_at' => Carbon::now()->subMinutes($startMinutesAgo),
            'end_at' => Carbon::now()->addHours($endHoursLater),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
            'show_result_immediately' => $showResultImmediately,
        ]);
        $session->created_by = $creator->id;
        $session->status = ExamSessionStatus::PUBLISHED;
        $session->save();

        return $session;
    }

    private function createAttempt(
        ExamSession $session,
        User $student,
        ExamAttemptStatus $status = ExamAttemptStatus::IN_PROGRESS,
        int $startedMinutesAgo = 10
    ): ExamAttempt {
        SessionAssignment::firstOrCreate([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
        ]);

        return ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => $status,
            'started_at' => Carbon::now()->subMinutes($startedMinutesAgo),
            'total_points' => '10.00',
        ]);
    }

    public function test_student_can_submit_attempt_with_show_result_immediately_true(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Database']);

        $q1 = $this->createQuestion($topic, $teacher, QuestionType::SINGLE_CHOICE, 'opt_a');
        $q2 = $this->createQuestion($topic, $teacher, QuestionType::TRUE_FALSE, 'true', [
            ['id' => 'true', 'content' => 'Đúng'],
            ['id' => 'false', 'content' => 'Sai'],
        ]);

        $exam = $this->createExam($subject, $teacher, 60, 5.0);
        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 5.00]);
        $exam->questions()->attach($q2->id, ['order' => 2, 'points' => 5.00]);

        $session = $this->createSession($exam, $teacher, showResultImmediately: true);
        $attempt = $this->createAttempt($session, $student);

        // Student answered both correctly beforehand
        AttemptAnswer::create([
            'attempt_id' => $attempt->id,
            'question_id' => $q1->id,
            'selected_options' => ['opt_a'],
        ]);
        AttemptAnswer::create([
            'attempt_id' => $attempt->id,
            'question_id' => $q2->id,
            'selected_options' => ['true'],
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit");

        $response->assertStatus(200)
            ->assertJsonPath('data.attempt_id', $attempt->id)
            ->assertJsonPath('data.status', ExamAttemptStatus::SUBMITTED->value)
            ->assertJsonPath('data.total_questions', 2)
            ->assertJsonPath('data.answered_questions', 2)
            ->assertJsonPath('data.score', fn ($val) => (float) $val === 10.0)
            ->assertJsonPath('data.total_points', fn ($val) => (float) $val === 10.0)
            ->assertJsonPath('data.is_passed', true)
            ->assertJsonStructure([
                'data' => [
                    'attempt_id',
                    'status',
                    'started_at',
                    'submitted_at',
                    'total_questions',
                    'answered_questions',
                    'score',
                    'total_points',
                    'is_passed',
                ],
                'message',
            ]);

        $this->assertDatabaseHas('exam_attempts', [
            'id' => $attempt->id,
            'status' => ExamAttemptStatus::SUBMITTED->value,
            'score' => '10.00',
        ]);

        $this->assertDatabaseHas('attempt_answers', [
            'attempt_id' => $attempt->id,
            'question_id' => $q1->id,
            'is_correct' => 1,
            'awarded_points' => '5.00',
        ]);
    }

    public function test_student_can_submit_attempt_with_show_result_immediately_false(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Security']);

        $q1 = $this->createQuestion($topic, $teacher, QuestionType::SINGLE_CHOICE, 'opt_a');

        $exam = $this->createExam($subject, $teacher, 60, 5.0);
        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 10.00]);

        // show_result_immediately is FALSE (e.g. final exam)
        $session = $this->createSession($exam, $teacher, showResultImmediately: false);
        $attempt = $this->createAttempt($session, $student);

        AttemptAnswer::create([
            'attempt_id' => $attempt->id,
            'question_id' => $q1->id,
            'selected_options' => ['opt_a'],
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit");

        $response->assertStatus(200)
            ->assertJsonPath('data.attempt_id', $attempt->id)
            ->assertJsonPath('data.status', ExamAttemptStatus::SUBMITTED->value)
            ->assertJsonPath('data.total_questions', 1)
            ->assertJsonPath('data.answered_questions', 1)
            ->assertJsonPath('data.score', null)
            ->assertJsonPath('data.total_points', null)
            ->assertJsonPath('data.is_passed', null);

        // In DB, score is recorded internally for teacher/grading
        $this->assertDatabaseHas('exam_attempts', [
            'id' => $attempt->id,
            'status' => ExamAttemptStatus::SUBMITTED->value,
            'score' => '10.00',
        ]);
    }

    public function test_student_can_submit_with_final_answers_in_payload(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Backend']);

        $q1 = $this->createQuestion($topic, $teacher, QuestionType::SINGLE_CHOICE, 'opt_a');
        $q2 = $this->createQuestion($topic, $teacher, QuestionType::SHORT_ANSWER, 'PostgreSQL');

        $exam = $this->createExam($subject, $teacher, 60, 5.0);
        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 5.00]);
        $exam->questions()->attach($q2->id, ['order' => 2, 'points' => 5.00]);

        $session = $this->createSession($exam, $teacher, showResultImmediately: true);
        $attempt = $this->createAttempt($session, $student);

        // Q1 already answered
        AttemptAnswer::create([
            'attempt_id' => $attempt->id,
            'question_id' => $q1->id,
            'selected_options' => ['opt_a'],
        ]);

        // Q2 is submitted directly in the final_answers payload
        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit", [
                'final_answers' => [
                    [
                        'question_id' => $q2->id,
                        'selected_options' => 'postgresql', // case-insensitive match
                    ],
                ],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.total_questions', 2)
            ->assertJsonPath('data.answered_questions', 2)
            ->assertJsonPath('data.score', fn ($val) => (float) $val === 10.0)
            ->assertJsonPath('data.is_passed', true);

        $this->assertDatabaseHas('attempt_answers', [
            'attempt_id' => $attempt->id,
            'question_id' => $q2->id,
            'is_correct' => 1,
            'awarded_points' => '5.00',
        ]);
    }

    public function test_submitting_already_submitted_attempt_returns_409_conflict(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $q1 = $this->createQuestion($topic, $teacher);

        $exam = $this->createExam($subject, $teacher, 60);
        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 10.00]);

        $session = $this->createSession($exam, $teacher);
        $attempt = $this->createAttempt($session, $student, status: ExamAttemptStatus::SUBMITTED);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit");

        $response->assertStatus(409)
            ->assertJsonPath('error_code', 'ATTEMPT_ALREADY_SUBMITTED');
    }

    public function test_submitting_attempt_past_deadline_plus_30s_grace_returns_409_conflict(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $q1 = $this->createQuestion($topic, $teacher);

        $exam = $this->createExam($subject, $teacher, durationMinutes: 30);
        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 10.00]);

        $session = $this->createSession($exam, $teacher, startMinutesAgo: 60, endHoursLater: 2);

        // Started 31 minutes ago (30 min duration + 30s grace = 30m30s limit -> expired)
        $attempt = $this->createAttempt($session, $student, startedMinutesAgo: 31);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit");

        $response->assertStatus(409)
            ->assertJsonPath('error_code', 'ATTEMPT_TIME_EXPIRED');
    }

    public function test_submitting_within_30s_grace_period_is_accepted(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $q1 = $this->createQuestion($topic, $teacher);

        $exam = $this->createExam($subject, $teacher, durationMinutes: 30);
        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 10.00]);

        $session = $this->createSession($exam, $teacher, startMinutesAgo: 60, endHoursLater: 2);

        // Attempt started exactly 30 minutes and 10 seconds ago (inside the 30s grace period)
        SessionAssignment::firstOrCreate([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
        ]);

        $attempt = ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::IN_PROGRESS,
            'started_at' => Carbon::now()->subMinutes(30)->subSeconds(10),
            'total_points' => '10.00',
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit");

        $response->assertStatus(200)
            ->assertJsonPath('data.status', ExamAttemptStatus::SUBMITTED->value);
    }

    public function test_idor_student_cannot_submit_another_students_attempt(): void
    {
        $teacher = User::factory()->teacher()->create();
        $studentA = User::factory()->student()->create();
        $studentB = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $q1 = $this->createQuestion($topic, $teacher);

        $exam = $this->createExam($subject, $teacher, 60);
        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 10.00]);

        $session = $this->createSession($exam, $teacher);
        $attemptA = $this->createAttempt($session, $studentA);

        // Student B tries to submit Student A's attempt
        $response = $this->actingAs($studentB)
            ->postJson("/api/v1/exam-attempts/{$attemptA->id}/submit");

        $response->assertStatus(403);
    }

    public function test_teacher_or_admin_cannot_submit_attempt(): void
    {
        $teacher = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $q1 = $this->createQuestion($topic, $teacher);

        $exam = $this->createExam($subject, $teacher, 60);
        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 10.00]);

        $session = $this->createSession($exam, $teacher);
        $attempt = $this->createAttempt($session, $student);

        // Teacher attempt
        $this->actingAs($teacher)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit")
            ->assertStatus(403);

        // Admin attempt
        $this->actingAs($admin)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit")
            ->assertStatus(403);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->postJson('/api/v1/exam-attempts/9999/submit');
        $response->assertStatus(401);
    }

    public function test_inactive_student_cannot_submit_attempt(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create(['is_active' => false]);

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $q1 = $this->createQuestion($topic, $teacher);

        $exam = $this->createExam($subject, $teacher, 60);
        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 10.00]);

        $session = $this->createSession($exam, $teacher);
        $attempt = $this->createAttempt($session, $student);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit");

        $response->assertStatus(403);
    }

    public function test_idempotency_key_replays_cached_response(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $q1 = $this->createQuestion($topic, $teacher);

        $exam = $this->createExam($subject, $teacher, 60);
        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 10.00]);

        $session = $this->createSession($exam, $teacher);
        $attempt = $this->createAttempt($session, $student);

        $idempotencyKey = (string) Str::uuid();

        // 1. First submission with Idempotency-Key
        $response1 = $this->actingAs($student)
            ->withHeader('Idempotency-Key', $idempotencyKey)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit");

        $response1->assertStatus(200)
            ->assertJsonPath('data.status', ExamAttemptStatus::SUBMITTED->value);

        // 2. Replay with the same Idempotency-Key
        $response2 = $this->actingAs($student)
            ->withHeader('Idempotency-Key', $idempotencyKey)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit");

        $response2->assertStatus(200)
            ->assertJsonPath('data.attempt_id', $attempt->id)
            ->assertJsonPath('data.status', ExamAttemptStatus::SUBMITTED->value);
    }

    public function test_validation_rejects_question_not_belonging_to_exam(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $qInExam = $this->createQuestion($topic, $teacher);
        $qNotInExam = $this->createQuestion($topic, $teacher);

        $exam = $this->createExam($subject, $teacher, 60);
        $exam->questions()->attach($qInExam->id, ['order' => 1, 'points' => 10.00]);

        $session = $this->createSession($exam, $teacher);
        $attempt = $this->createAttempt($session, $student);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit", [
                'final_answers' => [
                    [
                        'question_id' => $qNotInExam->id,
                        'selected_options' => ['opt_a'],
                    ],
                ],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['final_answers.0.question_id']);
    }

    public function test_all_or_nothing_scoring_on_multiple_choice_in_attempt(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Algorithms']);

        // Multiple choice question requiring BOTH opt_a AND opt_b
        $qMulti = $this->createQuestion(
            $topic,
            $teacher,
            QuestionType::MULTIPLE_CHOICE,
            ['opt_a', 'opt_b']
        );

        $exam = $this->createExam($subject, $teacher, 60, 5.0);
        $exam->questions()->attach($qMulti->id, ['order' => 1, 'points' => 10.00]);

        $session = $this->createSession($exam, $teacher, showResultImmediately: true);
        $attempt = $this->createAttempt($session, $student);

        // Student only selected 'opt_a' (partial answer)
        AttemptAnswer::create([
            'attempt_id' => $attempt->id,
            'question_id' => $qMulti->id,
            'selected_options' => ['opt_a'],
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/v1/exam-attempts/{$attempt->id}/submit");

        $response->assertStatus(200)
            ->assertJsonPath('data.score', fn ($val) => (float) $val === 0.0) // 0 pts awarded per All-or-Nothing
            ->assertJsonPath('data.is_passed', false);

        $this->assertDatabaseHas('attempt_answers', [
            'attempt_id' => $attempt->id,
            'question_id' => $qMulti->id,
            'is_correct' => 0,
            'awarded_points' => '0.00',
        ]);
    }
}
