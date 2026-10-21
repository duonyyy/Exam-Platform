<?php

namespace Tests\Feature\Sessions;

use App\Enums\ExamSessionStatus;
use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\SessionAssignment;
use App\Models\Subject;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssignmentTest extends TestCase
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
            'title' => 'Kỳ thi kiểm tra giữa kỳ',
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

    private function createSession(Exam $exam, User $creator, ExamSessionStatus $status = ExamSessionStatus::DRAFT): ExamSession
    {
        $startAt = Carbon::now()->addDays(2)->setHour(8)->setMinute(0)->setSecond(0);
        $endAt = (clone $startAt)->addHours(2);

        return ExamSession::create([
            'exam_id' => $exam->id,
            'created_by' => $creator->id,
            'title' => 'Ca thi chuẩn bị phân công',
            'status' => $status,
            'start_at' => $startAt,
            'end_at' => $endAt,
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
    }

    public function test_teacher_can_assign_students_to_owned_session(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $students = User::factory()->student()->count(3)->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $payload = [
            'student_ids' => $students->pluck('id')->all(),
        ];

        $response = $this->actingAs($teacher)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-students", $payload);

        $response->assertOk()
            ->assertJsonPath('data.exam_session_id', $session->id)
            ->assertJsonPath('data.assigned_count', 3)
            ->assertJsonPath('data.total_assigned_students', 3);

        foreach ($students as $student) {
            $this->assertDatabaseHas('session_assignments', [
                'exam_session_id' => $session->id,
                'student_id' => $student->id,
            ]);
        }
    }

    public function test_admin_can_assign_students_to_any_session(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $students = User::factory()->student()->count(2)->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $payload = [
            'student_ids' => $students->pluck('id')->all(),
        ];

        $this->actingAs($admin)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-students", $payload)
            ->assertOk()
            ->assertJsonPath('data.assigned_count', 2)
            ->assertJsonPath('data.total_assigned_students', 2);
    }

    public function test_teacher_cannot_assign_students_to_other_teachers_session_idor(): void
    {
        $admin = User::factory()->admin()->create();
        $teacherOwner = User::factory()->teacher()->create();
        $teacherAttacker = User::factory()->teacher()->create();
        $students = User::factory()->student()->count(2)->create();

        $subject = $this->createSubject($admin, $teacherOwner);
        $exam = $this->createExam($subject, $teacherOwner);
        $session = $this->createSession($exam, $teacherOwner);

        $payload = [
            'student_ids' => $students->pluck('id')->all(),
        ];

        $this->actingAs($teacherAttacker)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-students", $payload)
            ->assertForbidden();

        $this->assertDatabaseCount('session_assignments', 0);
    }

    public function test_assignment_is_idempotent_and_prevents_duplicate_records_br008(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student1 = User::factory()->student()->create();
        $student2 = User::factory()->student()->create();
        $student3 = User::factory()->student()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        // 1. Assign student 1 and 2
        $this->actingAs($teacher)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-students", [
                'student_ids' => [$student1->id, $student2->id],
            ])
            ->assertOk()
            ->assertJsonPath('data.assigned_count', 2)
            ->assertJsonPath('data.total_assigned_students', 2);

        // 2. Re-assign student 2 along with student 3 -> only student 3 is new, student 2 ignored (Idempotent BR-008)
        $this->actingAs($teacher)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-students", [
                'student_ids' => [$student2->id, $student3->id],
            ])
            ->assertOk()
            ->assertJsonPath('data.assigned_count', 1)
            ->assertJsonPath('data.total_assigned_students', 3);

        $this->assertDatabaseCount('session_assignments', 3);
    }

    public function test_cannot_assign_non_student_or_inactive_user(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();
        $inactiveStudent = User::factory()->student()->create(['is_active' => false]);
        $anotherTeacher = User::factory()->teacher()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        // 1. Attempting to assign a teacher as a student -> 422
        $this->actingAs($teacher)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-students", [
                'student_ids' => [$student->id, $anotherTeacher->id],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('student_ids');

        // 2. Attempting to assign an inactive student -> 422
        $this->actingAs($teacher)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-students", [
                'student_ids' => [$inactiveStudent->id],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('student_ids');

        // 3. Empty student list -> 422
        $this->actingAs($teacher)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-students", [
                'student_ids' => [],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('student_ids');
    }

    public function test_cannot_assign_students_to_closed_or_cancelled_session(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);
        $closedSession = $this->createSession($exam, $teacher, ExamSessionStatus::CLOSED);

        $this->actingAs($teacher)
            ->postJson("/api/v1/exam-sessions/{$closedSession->id}/assign-students", [
                'student_ids' => [$student->id],
            ])
            ->assertStatus(409)
            ->assertJsonPath('error_code', 'SESSION_CLOSED_FOR_ASSIGNMENT');
    }

    public function test_teacher_can_assign_proctors_to_session(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $proctor1 = User::factory()->teacher()->create();
        $proctor2 = User::factory()->teacher()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $payload = [
            'teacher_ids' => [$proctor1->id, $proctor2->id],
            'role_in_session' => 'proctor',
        ];

        $response = $this->actingAs($teacher)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-teachers", $payload);

        $response->assertOk()
            ->assertJsonPath('data.exam_session_id', $session->id)
            ->assertJsonPath('data.assigned_count', 2)
            ->assertJsonPath('data.total_teachers', 2);

        $this->assertDatabaseHas('session_teachers', [
            'exam_session_id' => $session->id,
            'teacher_id' => $proctor1->id,
            'role_in_session' => 'proctor',
        ]);
    }

    public function test_teacher_cannot_assign_proctors_to_other_teachers_session_idor(): void
    {
        $admin = User::factory()->admin()->create();
        $teacherOwner = User::factory()->teacher()->create();
        $teacherAttacker = User::factory()->teacher()->create();
        $proctor = User::factory()->teacher()->create();

        $subject = $this->createSubject($admin, $teacherOwner);
        $exam = $this->createExam($subject, $teacherOwner);
        $session = $this->createSession($exam, $teacherOwner);

        $this->actingAs($teacherAttacker)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-teachers", [
                'teacher_ids' => [$proctor->id],
            ])
            ->assertForbidden();
    }

    public function test_student_can_list_only_their_assigned_sessions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $studentA = User::factory()->student()->create();
        $studentB = User::factory()->student()->create();

        $subject1 = $this->createSubject($admin, $teacher, 'MATH101');
        $subject2 = $this->createSubject($admin, $teacher, 'PHYS101');

        $exam1 = $this->createExam($subject1, $teacher, 60);
        $exam2 = $this->createExam($subject2, $teacher, 90);

        // Published sessions
        $session1 = $this->createSession($exam1, $teacher, ExamSessionStatus::PUBLISHED);
        $session2 = $this->createSession($exam2, $teacher, ExamSessionStatus::PUBLISHED);
        $session3 = $this->createSession($exam1, $teacher, ExamSessionStatus::PUBLISHED);

        // Assign student A to Session 1 & 2
        SessionAssignment::create([
            'exam_session_id' => $session1->id,
            'student_id' => $studentA->id,
            'assigned_at' => now(),
        ]);
        SessionAssignment::create([
            'exam_session_id' => $session2->id,
            'student_id' => $studentA->id,
            'assigned_at' => now(),
        ]);

        // Assign student B to Session 3 only
        SessionAssignment::create([
            'exam_session_id' => $session3->id,
            'student_id' => $studentB->id,
            'assigned_at' => now(),
        ]);

        // Student A requests assigned sessions
        $response = $this->actingAs($studentA)
            ->getJson('/api/v1/student/assigned-sessions');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'exam_id',
                        'title',
                        'status',
                        'start_at',
                        'end_at',
                        'allow_late_minutes',
                        'max_attempts',
                        'assigned_at',
                        'exam' => [
                            'id',
                            'title',
                            'duration_minutes',
                            'total_points',
                            'pass_score',
                            'subject' => [
                                'id',
                                'code',
                                'name',
                            ],
                        ],
                    ],
                ],
                'links',
                'meta',
            ])
            ->assertJsonMissing(['correct_answer'])
            ->assertJsonMissing(['questions']);

        // Assert Student A does not see Session 3
        $returnedIds = collect($response->json('data'))->pluck('id')->all();
        $this->assertContains($session1->id, $returnedIds);
        $this->assertContains($session2->id, $returnedIds);
        $this->assertNotContains($session3->id, $returnedIds);
    }

    public function test_student_does_not_see_draft_sessions_even_if_assigned(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);

        // Draft session
        $draftSession = $this->createSession($exam, $teacher, ExamSessionStatus::DRAFT);
        SessionAssignment::create([
            'exam_session_id' => $draftSession->id,
            'student_id' => $student->id,
            'assigned_at' => now(),
        ]);

        $response = $this->actingAs($student)
            ->getJson('/api/v1/student/assigned-sessions');

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_student_cannot_call_assignment_endpoints_403(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($admin, $teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-students", [
                'student_ids' => [$student->id],
            ])
            ->assertForbidden();

        $this->actingAs($student)
            ->postJson("/api/v1/exam-sessions/{$session->id}/assign-teachers", [
                'teacher_ids' => [$teacher->id],
            ])
            ->assertForbidden();
    }

    public function test_unauthenticated_user_cannot_access_assigned_sessions_401(): void
    {
        $this->getJson('/api/v1/student/assigned-sessions')
            ->assertUnauthorized();
    }
}
