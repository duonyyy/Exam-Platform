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
use App\Models\ProctoringEvent;
use App\Models\Question;
use App\Models\SessionAssignment;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProctoringSummaryTest extends TestCase
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
            'question_text' => 'Sample Question',
            'question_type' => QuestionType::SINGLE_CHOICE,
            'options' => [
                ['id' => 'opt_a', 'content' => 'Option A'],
                ['id' => 'opt_b', 'content' => 'Option B'],
            ],
            'correct_answer' => 'opt_a',
        ]);
        $question->status = QuestionStatus::READY;
        $question->created_by = $author->id;
        $question->save();

        $exam = new Exam([
            'title' => 'Final Exam',
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
            'title' => 'Afternoon Session',
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

    private function createAttempt(ExamSession $session, User $student): ExamAttempt
    {
        SessionAssignment::firstOrCreate(
            ['exam_session_id' => $session->id, 'student_id' => $student->id],
            ['assigned_at' => now()]
        );

        $attempt = new ExamAttempt([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::IN_PROGRESS,
            'started_at' => now()->subMinutes(5),
        ]);
        $attempt->save();

        return $attempt;
    }

    public function test_assigned_teacher_can_view_proctoring_summary(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $studentA = User::factory()->student()->create();
        $studentB = User::factory()->student()->create();
        $attemptA = $this->createAttempt($session, $studentA);
        $attemptB = $this->createAttempt($session, $studentB);

        // Create events for Student A: 2 medium, 1 critical
        ProctoringEvent::create([
            'attempt_id' => $attemptA->id,
            'event_type' => ProctoringEventType::FULLSCREEN_EXIT,
            'severity' => ProctoringSeverity::MEDIUM,
            'occurred_at' => now()->subMinutes(3),
        ]);
        ProctoringEvent::create([
            'attempt_id' => $attemptA->id,
            'event_type' => ProctoringEventType::DEVTOOLS_OPENED,
            'severity' => ProctoringSeverity::CRITICAL,
            'occurred_at' => now()->subMinutes(2),
        ]);

        // Create event for Student B: 1 low
        ProctoringEvent::create([
            'attempt_id' => $attemptB->id,
            'event_type' => ProctoringEventType::WINDOW_BLUR,
            'severity' => ProctoringSeverity::LOW,
            'occurred_at' => now()->subMinute(),
        ]);

        $response = $this->actingAs($teacher, 'sanctum')
            ->getJson("/api/v1/exam-sessions/{$session->id}/proctoring-summary");

        $response->assertOk()
            ->assertJsonPath('data.exam_session_id', $session->id)
            ->assertJsonPath('data.total_events', 3)
            ->assertJsonPath('data.flagged_students_count', 2)
            ->assertJsonPath('data.severity_breakdown.critical', 1)
            ->assertJsonPath('data.severity_breakdown.medium', 1)
            ->assertJsonPath('data.severity_breakdown.low', 1)
            ->assertJsonPath('data.top_flagged_attempts.0.attempt_id', $attemptA->id)
            ->assertJsonPath('data.top_flagged_attempts.0.highest_severity', 'critical')
            ->assertJsonPath('data.top_flagged_attempts.0.total_events', 2);
    }

    public function test_admin_can_view_proctoring_summary_for_any_session(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/exam-sessions/{$session->id}/proctoring-summary");

        $response->assertOk();
    }

    public function test_unassigned_teacher_cannot_view_proctoring_summary(): void
    {
        $teacherA = User::factory()->teacher()->create();
        $teacherB = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacherA);
        $exam = $this->createExam($subject, $teacherA);
        $session = $this->createSession($exam, $teacherA);

        // Teacher B has no relationship with session A
        $response = $this->actingAs($teacherB, 'sanctum')
            ->getJson("/api/v1/exam-sessions/{$session->id}/proctoring-summary");

        $response->assertForbidden();
    }

    public function test_student_cannot_view_proctoring_summary(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $student = User::factory()->student()->create();

        $response = $this->actingAs($student, 'sanctum')
            ->getJson("/api/v1/exam-sessions/{$session->id}/proctoring-summary");

        $response->assertForbidden();
    }

    public function test_teacher_can_view_paginated_events_filtered_by_severity(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $student = User::factory()->student()->create();
        $attempt = $this->createAttempt($session, $student);

        ProctoringEvent::create([
            'attempt_id' => $attempt->id,
            'event_type' => ProctoringEventType::DEVTOOLS_OPENED,
            'severity' => ProctoringSeverity::CRITICAL,
            'occurred_at' => now()->subMinutes(2),
        ]);
        ProctoringEvent::create([
            'attempt_id' => $attempt->id,
            'event_type' => ProctoringEventType::TAB_HIDDEN,
            'severity' => ProctoringSeverity::LOW,
            'occurred_at' => now()->subMinute(),
        ]);

        // Filter by critical
        $response = $this->actingAs($teacher, 'sanctum')
            ->getJson("/api/v1/exam-sessions/{$session->id}/proctoring-events?severity=critical");

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.severity', 'critical')
            ->assertJsonPath('data.0.event_type', ProctoringEventType::DEVTOOLS_OPENED->value);
    }
}
