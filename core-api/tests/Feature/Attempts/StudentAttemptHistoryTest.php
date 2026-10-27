<?php

namespace Tests\Feature\Attempts;

use App\Enums\ExamAttemptStatus;
use App\Enums\ExamSessionStatus;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\Subject;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentAttemptHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_fetch_own_attempt_history(): void
    {
        $teacher = User::factory()->teacher()->create();
        $studentA = User::factory()->student()->create();
        $studentB = User::factory()->student()->create();

        $subject = new Subject([
            'code' => 'CS101',
            'name' => 'Computer Science',
        ]);
        $subject->created_by = $teacher->id;
        $subject->owner_teacher_id = $teacher->id;
        $subject->save();

        $exam = new Exam([
            'title' => 'Midterm Exam',
            'duration_minutes' => 60,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => true,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Ca thi Midterm CS101',
            'start_at' => Carbon::now()->subHours(2),
            'end_at' => Carbon::now()->addHours(1),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $session->created_by = $teacher->id;
        $session->status = ExamSessionStatus::PUBLISHED;
        $session->save();

        // Attempt for Student A
        $attemptA = new ExamAttempt([
            'exam_session_id' => $session->id,
            'student_id' => $studentA->id,
            'attempt_number' => 1,
            'started_at' => Carbon::now()->subHour(),
            'submitted_at' => Carbon::now()->subMinutes(10),
            'status' => ExamAttemptStatus::SUBMITTED,
            'score' => 8.50,
        ]);
        $attemptA->save();

        // Attempt for Student B
        $attemptB = new ExamAttempt([
            'exam_session_id' => $session->id,
            'student_id' => $studentB->id,
            'attempt_number' => 1,
            'started_at' => Carbon::now()->subHour(),
            'status' => ExamAttemptStatus::IN_PROGRESS,
            'score' => null,
        ]);
        $attemptB->save();

        // When Student A queries their attempt history
        $response = $this->actingAs($studentA)
            ->getJson('/api/v1/student/attempts');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.attempt_id', $attemptA->id)
            ->assertJsonPath('data.0.score', 8.5)
            ->assertJsonPath('data.0.is_passed', true)
            ->assertJsonPath('data.0.session.title', 'Ca thi Midterm CS101')
            ->assertJsonPath('data.0.subject.code', 'CS101');
    }

    public function test_unauthenticated_cannot_access_student_attempts(): void
    {
        $this->getJson('/api/v1/student/attempts')
            ->assertUnauthorized();
    }
}
