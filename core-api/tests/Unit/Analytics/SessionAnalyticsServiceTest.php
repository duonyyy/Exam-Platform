<?php

namespace Tests\Unit\Analytics;

use App\Enums\ExamAttemptStatus;
use App\Enums\ExamSessionStatus;
use App\Enums\QuestionStatus;
use App\Enums\QuestionType;
use App\Enums\UserRole;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\Question;
use App\Models\SessionAssignment;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use App\Services\Analytics\SessionAnalyticsService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SessionAnalyticsServiceTest extends TestCase
{
    use RefreshDatabase;

    private SessionAnalyticsService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new SessionAnalyticsService;
    }

    private function createSetup(): array
    {
        $teacher = new User([
            'name' => 'Prof. Turing',
            'email' => 'turing_'.uniqid().'@example.com',
            'role' => UserRole::TEACHER,
            'is_active' => true,
        ]);
        $teacher->password = bcrypt('secret123');
        $teacher->save();

        $subject = new Subject([
            'code' => 'MATH_'.uniqid(),
            'name' => 'Discrete Mathematics',
        ]);
        $subject->created_by = $teacher->id;
        $subject->owner_teacher_id = $teacher->id;
        $subject->save();

        $topic = new Topic(['subject_id' => $subject->id, 'name' => 'Logic']);
        $topic->save();

        $q = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'P and Q is true when both are true?',
            'question_type' => QuestionType::TRUE_FALSE,
            'options' => [
                ['id' => 'opt_true', 'content' => 'True'],
                ['id' => 'opt_false', 'content' => 'False'],
            ],
            'correct_answer' => 'opt_true',
        ]);
        $q->status = QuestionStatus::READY;
        $q->created_by = $teacher->id;
        $q->save();

        $exam = new Exam([
            'title' => 'Logic Quiz',
            'duration_minutes' => 30,
            'pass_score' => 5.0,
            'total_points' => 10.0,
            'shuffle_questions' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();
        $exam->questions()->attach($q->id, ['order' => 1, 'points' => 10.0]);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Logic Session',
            'start_at' => Carbon::now()->subHour(),
            'end_at' => Carbon::now()->addHour(),
            'status' => ExamSessionStatus::PUBLISHED,
            'created_by' => $teacher->id,
        ]);
        $session->save();

        return [$session, $exam, $q, $teacher];
    }

    public function test_single_submission_stats(): void
    {
        [$session, $exam, $q, $teacher] = $this->createSetup();

        $student = new User([
            'name' => 'Single Student',
            'email' => 'single_'.uniqid().'@example.com',
            'role' => UserRole::STUDENT,
            'is_active' => true,
        ]);
        $student->password = bcrypt('secret');
        $student->save();

        SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $student->id, 'assigned_at' => now()]);

        ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::SUBMITTED,
            'started_at' => now()->subMinutes(20),
            'submitted_at' => now(),
            'score' => 8.5,
            'total_points' => 10.0,
        ]);

        $report = $this->service->generateReport($session);

        $this->assertEquals(8.5, $report['statistics']['min_score']);
        $this->assertEquals(8.5, $report['statistics']['max_score']);
        $this->assertEquals(8.5, $report['statistics']['avg_score']);
        $this->assertEquals(8.5, $report['statistics']['median_score']);
        $this->assertEquals(0.0, $report['statistics']['std_deviation']);
        $this->assertEquals(1, $report['statistics']['passed_count']);
        $this->assertEquals(0, $report['statistics']['failed_count']);
        $this->assertEquals(100.0, $report['statistics']['pass_rate']);
    }

    public function test_identical_scores_standard_deviation_is_zero(): void
    {
        [$session, $exam, $q, $teacher] = $this->createSetup();

        for ($i = 1; $i <= 3; $i++) {
            $student = new User([
                'name' => "Student {$i}",
                'email' => "same_{$i}_".uniqid().'@example.com',
                'role' => UserRole::STUDENT,
                'is_active' => true,
            ]);
            $student->password = bcrypt('secret');
            $student->save();

            SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $student->id, 'assigned_at' => now()]);

            ExamAttempt::create([
                'exam_session_id' => $session->id,
                'student_id' => $student->id,
                'attempt_number' => 1,
                'status' => ExamAttemptStatus::SUBMITTED,
                'started_at' => now()->subMinutes(20),
                'submitted_at' => now(),
                'score' => 7.0,
                'total_points' => 10.0,
            ]);
        }

        $report = $this->service->generateReport($session);

        $this->assertEquals(7.0, $report['statistics']['avg_score']);
        $this->assertEquals(7.0, $report['statistics']['median_score']);
        $this->assertEquals(0.0, $report['statistics']['std_deviation']);
    }

    public function test_classification_ranks_across_scale(): void
    {
        [$session, $exam, $q, $teacher] = $this->createSetup();

        $testCases = [
            ['score' => 9.5, 'expected' => 'Xuất sắc'],
            ['score' => 8.5, 'expected' => 'Giỏi'],
            ['score' => 7.0, 'expected' => 'Khá'],
            ['score' => 5.5, 'expected' => 'Trung bình'],
            ['score' => 3.0, 'expected' => 'Yếu'],
        ];

        foreach ($testCases as $idx => $tc) {
            $st = new User([
                'name' => "Student {$idx}",
                'email' => "rank_{$idx}_".uniqid().'@example.com',
                'role' => UserRole::STUDENT,
                'is_active' => true,
            ]);
            $st->password = bcrypt('secret');
            $st->save();

            SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $st->id, 'assigned_at' => now()]);

            ExamAttempt::create([
                'exam_session_id' => $session->id,
                'student_id' => $st->id,
                'attempt_number' => 1,
                'status' => ExamAttemptStatus::SUBMITTED,
                'started_at' => now()->subMinutes(20),
                'submitted_at' => now(),
                'score' => $tc['score'],
                'total_points' => 10.0,
            ]);
        }

        $report = $this->service->generateReport($session);

        $scoreboard = collect($report['scoreboard'])->keyBy('score');

        foreach ($testCases as $tc) {
            $row = $scoreboard->get($tc['score']);
            $this->assertNotNull($row);
            $this->assertEquals($tc['expected'], $row['classification']);
        }
    }
}
