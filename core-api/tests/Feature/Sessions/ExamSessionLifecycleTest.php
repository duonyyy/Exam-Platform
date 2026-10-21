<?php

namespace Tests\Feature\Sessions;

use App\Enums\ExamSessionStatus;
use App\Enums\QuestionStatus;
use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\Question;
use App\Models\SessionAssignment;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ExamSessionLifecycleTest extends TestCase
{
    use RefreshDatabase;

    private function createSubject(User $creator, ?User $owner, string $code = 'CS101'): Subject
    {
        $subject = new Subject(['code' => $code.'_'.uniqid(), 'name' => 'Computer Science']);
        $subject->created_by = $creator->id;
        $subject->owner_teacher_id = $owner?->id;
        $subject->save();

        return $subject;
    }

    private function createExam(Subject $subject, User $author, int $durationMinutes = 60): Exam
    {
        $exam = new Exam([
            'title' => 'Midterm Exam',
            'duration_minutes' => $durationMinutes,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => true,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $author->id;
        $exam->save();

        return $exam;
    }

    private function attachQuestionToExam(Exam $exam, User $author): Question
    {
        $topic = Topic::create(['subject_id' => $exam->subject_id, 'name' => 'Algorithms']);
        $question = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'What is the time complexity of binary search?',
            'question_type' => 'single_choice',
            'options' => [
                ['id' => 'a', 'content' => 'O(log n)'],
                ['id' => 'b', 'content' => 'O(n)'],
            ],
            'correct_answer' => 'a',
            'difficulty' => 'medium',
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

        return $question;
    }

    private function assignStudentToSession(ExamSession $session, User $student): SessionAssignment
    {
        return SessionAssignment::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'assigned_at' => now(),
        ]);
    }

    public function test_teacher_can_create_exam_session_for_assigned_subject(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher, 60);

        $startAt = Carbon::now()->addDays(2)->setHour(8)->setMinute(0)->setSecond(0);
        $endAt = (clone $startAt)->addHours(2);

        $payload = [
            'exam_id' => $exam->id,
            'title' => 'Ca thi sang thu 2',
            'start_at' => $startAt->toIso8601String(),
            'end_at' => $endAt->toIso8601String(),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ];

        $response = $this->actingAs($teacher)->postJson('/api/v1/exam-sessions', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'Ca thi sang thu 2')
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.allow_late_minutes', 15)
            ->assertJsonPath('data.max_attempts', 1)
            ->assertJsonPath('data.created_by', $teacher->id)
            ->assertJsonPath('data.assigned_students_count', 0);

        $sessionId = $response->json('data.id');
        $this->assertDatabaseHas('exam_sessions', [
            'id' => $sessionId,
            'title' => 'Ca thi sang thu 2',
            'status' => 'draft',
            'created_by' => $teacher->id,
        ]);
    }

    public function test_admin_can_create_exam_session_for_any_exam(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher, 45);

        $startAt = Carbon::now()->addDays(3)->setHour(9)->setMinute(0)->setSecond(0);
        $endAt = (clone $startAt)->addMinutes(90);

        $payload = [
            'exam_id' => $exam->id,
            'title' => 'Ca thi admin lap lich',
            'start_at' => $startAt->toIso8601String(),
            'end_at' => $endAt->toIso8601String(),
        ];

        $this->actingAs($admin)->postJson('/api/v1/exam-sessions', $payload)
            ->assertCreated()
            ->assertJsonPath('data.title', 'Ca thi admin lap lich')
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.allow_late_minutes', 15)
            ->assertJsonPath('data.max_attempts', 1);
    }

    public function test_unauthenticated_and_student_cannot_access_exam_session_management(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();
        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher, 60);

        $startAt = Carbon::now()->addDays(1);
        $endAt = (clone $startAt)->addHours(2);

        $payload = [
            'exam_id' => $exam->id,
            'title' => 'Ca thi test',
            'start_at' => $startAt->toIso8601String(),
            'end_at' => $endAt->toIso8601String(),
        ];

        $session = ExamSession::create([
            'exam_id' => $exam->id,
            'created_by' => $teacher->id,
            'title' => 'Ca thi test',
            'status' => ExamSessionStatus::DRAFT,
            'start_at' => $startAt,
            'end_at' => $endAt,
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);

        // 401 Unauthorized
        $this->getJson('/api/v1/exam-sessions')->assertUnauthorized();
        $this->postJson('/api/v1/exam-sessions', $payload)->assertUnauthorized();
        $this->postJson("/api/v1/exam-sessions/{$session->id}/publish")->assertUnauthorized();
        $this->postJson("/api/v1/exam-sessions/{$session->id}/close")->assertUnauthorized();

        // 403 Forbidden for Student (Role Middleware)
        $this->actingAs($student)->getJson('/api/v1/exam-sessions')->assertForbidden();
        $this->actingAs($student)->postJson('/api/v1/exam-sessions', $payload)->assertForbidden();
        $this->actingAs($student)->postJson("/api/v1/exam-sessions/{$session->id}/publish")->assertForbidden();
        $this->actingAs($student)->postJson("/api/v1/exam-sessions/{$session->id}/close")->assertForbidden();
    }

    public function test_teacher_cannot_create_session_for_unassigned_subject_idor(): void
    {
        $admin = User::factory()->admin()->create();
        $teacherOwner = User::factory()->teacher()->create();
        $teacherAttacker = User::factory()->teacher()->create();
        $subject = $this->createSubject($admin, $teacherOwner);
        $exam = $this->createExam($subject, $teacherOwner, 60);

        $startAt = Carbon::now()->addDays(1);
        $endAt = (clone $startAt)->addHours(2);

        $payload = [
            'exam_id' => $exam->id,
            'title' => 'Ca thi chiem quyen',
            'start_at' => $startAt->toIso8601String(),
            'end_at' => $endAt->toIso8601String(),
        ];

        $this->actingAs($teacherAttacker)->postJson('/api/v1/exam-sessions', $payload)
            ->assertForbidden();
    }

    public function test_validation_rejects_invalid_time_window_br005(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher, 90); // 90 minutes exam

        $startAt = Carbon::now()->addDays(2)->setHour(10)->setMinute(0)->setSecond(0);

        // 1. end_at before start_at
        $this->actingAs($teacher)->postJson('/api/v1/exam-sessions', [
            'exam_id' => $exam->id,
            'title' => 'End before start',
            'start_at' => $startAt->toIso8601String(),
            'end_at' => (clone $startAt)->subHour()->toIso8601String(),
        ])->assertUnprocessable()->assertJsonValidationErrors('end_at');

        // 2. end_at equals start_at
        $this->actingAs($teacher)->postJson('/api/v1/exam-sessions', [
            'exam_id' => $exam->id,
            'title' => 'End equals start',
            'start_at' => $startAt->toIso8601String(),
            'end_at' => $startAt->toIso8601String(),
        ])->assertUnprocessable()->assertJsonValidationErrors('end_at');

        // 3. Window duration (60 mins) is strictly less than exam duration (90 mins) -> BR-005 violation
        $this->actingAs($teacher)->postJson('/api/v1/exam-sessions', [
            'exam_id' => $exam->id,
            'title' => 'Window too short',
            'start_at' => $startAt->toIso8601String(),
            'end_at' => (clone $startAt)->addMinutes(60)->toIso8601String(),
        ])->assertUnprocessable()->assertJsonValidationErrors('end_at');

        // 4. Missing / mass assignment fields rejected
        $this->actingAs($teacher)->postJson('/api/v1/exam-sessions', [
            'exam_id' => $exam->id,
            'title' => 'Status tamper',
            'start_at' => $startAt->toIso8601String(),
            'end_at' => (clone $startAt)->addMinutes(120)->toIso8601String(),
            'status' => 'published',
        ])->assertUnprocessable()->assertJsonValidationErrors('status');
    }

    public function test_publish_session_requires_exam_to_have_questions_br006(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();
        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher, 60); // 0 questions attached

        $session = ExamSession::create([
            'exam_id' => $exam->id,
            'created_by' => $teacher->id,
            'title' => 'Ca thi chua co de',
            'status' => ExamSessionStatus::DRAFT,
            'start_at' => Carbon::now()->addDays(1),
            'end_at' => Carbon::now()->addDays(1)->addHours(2),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);

        $this->assignStudentToSession($session, $student);

        // Publish should fail with 409 Conflict due to empty exam
        $response = $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/publish");

        $response->assertStatus(409)
            ->assertJsonPath('error_code', 'EXAM_EMPTY');

        $this->assertDatabaseHas('exam_sessions', [
            'id' => $session->id,
            'status' => 'draft',
        ]);
    }

    public function test_publish_session_requires_assigned_students_br006(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher, 60);
        $this->attachQuestionToExam($exam, $teacher); // Exam has questions

        $session = ExamSession::create([
            'exam_id' => $exam->id,
            'created_by' => $teacher->id,
            'title' => 'Ca thi chua co sinh vien',
            'status' => ExamSessionStatus::DRAFT,
            'start_at' => Carbon::now()->addDays(1),
            'end_at' => Carbon::now()->addDays(1)->addHours(2),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        // 0 students assigned

        // Publish should fail with 409 Conflict due to no students
        $response = $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/publish");

        $response->assertStatus(409)
            ->assertJsonPath('error_code', 'NO_STUDENTS_ASSIGNED');

        $this->assertDatabaseHas('exam_sessions', [
            'id' => $session->id,
            'status' => 'draft',
        ]);
    }

    public function test_happy_path_publish_and_close_session_lifecycle(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();
        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher, 60);
        $this->attachQuestionToExam($exam, $teacher);

        $session = ExamSession::create([
            'exam_id' => $exam->id,
            'created_by' => $teacher->id,
            'title' => 'Ca thi chuan tieu chuan',
            'status' => ExamSessionStatus::DRAFT,
            'start_at' => Carbon::now()->addDays(1),
            'end_at' => Carbon::now()->addDays(1)->addHours(2),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $this->assignStudentToSession($session, $student);

        // 1. Publish: draft -> published
        $publishResponse = $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/publish");
        $publishResponse->assertOk()
            ->assertJsonPath('data.status', 'published')
            ->assertJsonPath('data.assigned_students_count', 1);

        $this->assertDatabaseHas('exam_sessions', [
            'id' => $session->id,
            'status' => 'published',
        ]);

        // 2. Close: published -> closed
        $closeResponse = $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/close");
        $closeResponse->assertOk()
            ->assertJsonPath('data.status', 'closed');

        $this->assertDatabaseHas('exam_sessions', [
            'id' => $session->id,
            'status' => 'closed',
        ]);
    }

    public function test_fsm_conflicts_prevent_invalid_state_transitions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();
        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher, 60);
        $this->attachQuestionToExam($exam, $teacher);

        $session = ExamSession::create([
            'exam_id' => $exam->id,
            'created_by' => $teacher->id,
            'title' => 'Ca thi FSM conflict',
            'status' => ExamSessionStatus::DRAFT,
            'start_at' => Carbon::now()->addDays(1),
            'end_at' => Carbon::now()->addDays(1)->addHours(2),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $this->assignStudentToSession($session, $student);

        // Conflict: Closing a draft session must fail
        $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/close")
            ->assertStatus(409)
            ->assertJsonPath('error_code', 'INVALID_STATE_TRANSITION');

        // Publish to published
        $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/publish")->assertOk();

        // Conflict: Publishing an already published session must fail
        $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/publish")
            ->assertStatus(409)
            ->assertJsonPath('error_code', 'INVALID_STATE_TRANSITION');

        // Close to closed
        $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/close")->assertOk();

        // Conflict: Publishing a closed session must fail (Forbidden FSM transition)
        $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/publish")
            ->assertStatus(409)
            ->assertJsonPath('error_code', 'INVALID_STATE_TRANSITION');

        // Conflict: Closing an already closed session must fail
        $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/close")
            ->assertStatus(409)
            ->assertJsonPath('error_code', 'INVALID_STATE_TRANSITION');
    }

    public function test_publish_rejects_expired_session(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();
        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher, 60);
        $this->attachQuestionToExam($exam, $teacher);

        // Session ended in the past
        $session = ExamSession::create([
            'exam_id' => $exam->id,
            'created_by' => $teacher->id,
            'title' => 'Ca thi da qua han',
            'status' => ExamSessionStatus::DRAFT,
            'start_at' => Carbon::now()->subHours(4),
            'end_at' => Carbon::now()->subHours(2),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $this->assignStudentToSession($session, $student);

        $this->actingAs($teacher)->postJson("/api/v1/exam-sessions/{$session->id}/publish")
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'SESSION_EXPIRED');
    }

    public function test_teacher_cannot_publish_or_close_other_teachers_session_idor(): void
    {
        $admin = User::factory()->admin()->create();
        $teacherOwner = User::factory()->teacher()->create();
        $teacherAttacker = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();
        $subject = $this->createSubject($admin, $teacherOwner);
        $exam = $this->createExam($subject, $teacherOwner, 60);
        $this->attachQuestionToExam($exam, $teacherOwner);

        $session = ExamSession::create([
            'exam_id' => $exam->id,
            'created_by' => $teacherOwner->id,
            'title' => 'Ca thi bi tan cong IDOR',
            'status' => ExamSessionStatus::DRAFT,
            'start_at' => Carbon::now()->addDays(1),
            'end_at' => Carbon::now()->addDays(1)->addHours(2),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $this->assignStudentToSession($session, $student);

        // Attacker cannot publish
        $this->actingAs($teacherAttacker)->postJson("/api/v1/exam-sessions/{$session->id}/publish")
            ->assertForbidden();

        // Owner publishes
        $this->actingAs($teacherOwner)->postJson("/api/v1/exam-sessions/{$session->id}/publish")
            ->assertOk();

        // Attacker cannot close
        $this->actingAs($teacherAttacker)->postJson("/api/v1/exam-sessions/{$session->id}/close")
            ->assertForbidden();

        // Owner closes
        $this->actingAs($teacherOwner)->postJson("/api/v1/exam-sessions/{$session->id}/close")
            ->assertOk();
    }

    public function test_listing_exam_sessions_with_scoping_and_filters(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher1 = User::factory()->teacher()->create();
        $teacher2 = User::factory()->teacher()->create();

        $subject1 = $this->createSubject($admin, $teacher1, 'MATH');
        $subject2 = $this->createSubject($admin, $teacher2, 'PHYS');

        $exam1 = $this->createExam($subject1, $teacher1, 60);
        $exam2 = $this->createExam($subject2, $teacher2, 60);

        ExamSession::create([
            'exam_id' => $exam1->id,
            'created_by' => $teacher1->id,
            'title' => 'Math Session 1 (Draft)',
            'status' => ExamSessionStatus::DRAFT,
            'start_at' => Carbon::now()->addDays(1),
            'end_at' => Carbon::now()->addDays(1)->addHours(2),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);

        ExamSession::create([
            'exam_id' => $exam1->id,
            'created_by' => $teacher1->id,
            'title' => 'Math Session 2 (Published)',
            'status' => ExamSessionStatus::PUBLISHED,
            'start_at' => Carbon::now()->addDays(2),
            'end_at' => Carbon::now()->addDays(2)->addHours(2),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);

        ExamSession::create([
            'exam_id' => $exam2->id,
            'created_by' => $teacher2->id,
            'title' => 'Physics Session (Draft)',
            'status' => ExamSessionStatus::DRAFT,
            'start_at' => Carbon::now()->addDays(1),
            'end_at' => Carbon::now()->addDays(1)->addHours(2),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);

        // Teacher 1 only sees their 2 Math sessions
        $this->actingAs($teacher1)->getJson('/api/v1/exam-sessions')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        // Teacher 1 filters by status=published -> 1 session
        $this->actingAs($teacher1)->getJson('/api/v1/exam-sessions?status=published')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Math Session 2 (Published)');

        // Admin sees all 3 sessions
        $this->actingAs($admin)->getJson('/api/v1/exam-sessions')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        // Admin filters by exam_id
        $this->actingAs($admin)->getJson("/api/v1/exam-sessions?exam_id={$exam2->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Physics Session (Draft)');
    }
}
