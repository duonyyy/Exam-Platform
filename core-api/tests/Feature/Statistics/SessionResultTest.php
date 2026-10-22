<?php

namespace Tests\Feature\Statistics;

use App\Enums\ExamAttemptStatus;
use App\Enums\ExamSessionStatus;
use App\Enums\ProctoringEventType;
use App\Enums\ProctoringSeverity;
use App\Enums\QuestionStatus;
use App\Enums\QuestionType;
use App\Enums\UserRole;
use App\Models\AttemptAnswer;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\ProctoringEvent;
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

class SessionResultTest extends TestCase
{
    use RefreshDatabase;

    private function createTeacher(?string $email = null): User
    {
        $user = new User([
            'name' => 'Teacher '.uniqid(),
            'email' => $email ?? 'teacher_'.uniqid().'@example.com',
            'role' => UserRole::TEACHER,
            'is_active' => true,
        ]);
        $user->password = bcrypt('secret123');
        $user->save();

        return $user;
    }

    private function createAdmin(): User
    {
        $user = new User([
            'name' => 'Admin '.uniqid(),
            'email' => 'admin_'.uniqid().'@example.com',
            'role' => UserRole::ADMIN,
            'is_active' => true,
        ]);
        $user->password = bcrypt('secret123');
        $user->save();

        return $user;
    }

    private function createStudent(?string $name = null, ?string $email = null): User
    {
        $user = new User([
            'name' => $name ?? 'Student '.uniqid(),
            'email' => $email ?? 'student_'.uniqid().'@example.com',
            'role' => UserRole::STUDENT,
            'is_active' => true,
        ]);
        $user->password = bcrypt('secret123');
        $user->save();

        return $user;
    }

    private function createSubject(User $creator): Subject
    {
        $subject = new Subject([
            'code' => 'IT_'.uniqid(),
            'name' => 'Computer Architecture',
        ]);
        $subject->created_by = $creator->id;
        $subject->owner_teacher_id = $creator->id;
        $subject->save();

        return $subject;
    }

    private function createExam(Subject $subject, User $author, float $passScore = 5.0, float $totalPoints = 10.0): Exam
    {
        $topic = new Topic([
            'subject_id' => $subject->id,
            'name' => 'General Topic',
        ]);
        $topic->save();

        $exam = new Exam([
            'title' => 'Midterm Exam',
            'duration_minutes' => 60,
            'pass_score' => $passScore,
            'total_points' => $totalPoints,
            'shuffle_questions' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $author->id;
        $exam->save();

        // Attach two questions
        $q1 = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'What is CPU?',
            'question_type' => QuestionType::SINGLE_CHOICE,
            'options' => [
                ['id' => 'opt_a', 'content' => 'Central Processing Unit'],
                ['id' => 'opt_b', 'content' => 'Computer Personal Unit'],
            ],
            'correct_answer' => 'opt_a',
        ]);
        $q1->status = QuestionStatus::READY;
        $q1->created_by = $author->id;
        $q1->save();

        $q2 = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'What is RAM?',
            'question_type' => QuestionType::SINGLE_CHOICE,
            'options' => [
                ['id' => 'opt_a', 'content' => 'Random Access Memory'],
                ['id' => 'opt_b', 'content' => 'Read Access Memory'],
            ],
            'correct_answer' => 'opt_a',
        ]);
        $q2->status = QuestionStatus::READY;
        $q2->created_by = $author->id;
        $q2->save();

        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 5.0]);
        $exam->questions()->attach($q2->id, ['order' => 2, 'points' => 5.0]);

        return $exam;
    }

    private function createSession(Exam $exam, User $creator): ExamSession
    {
        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Morning Session IT4409',
            'start_at' => Carbon::now()->subHours(2),
            'end_at' => Carbon::now()->addHour(),
            'status' => ExamSessionStatus::PUBLISHED,
            'created_by' => $creator->id,
            'max_attempts' => 1,
            'allow_late_minutes' => 15,
            'show_result_immediately' => true,
        ]);
        $session->save();

        return $session;
    }

    public function test_teacher_can_view_session_results_for_owned_session(): void
    {
        $teacher = $this->createTeacher();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher, passScore: 5.0, totalPoints: 10.0);
        $session = $this->createSession($exam, $teacher);

        $student1 = $this->createStudent('Alice Johnson', 'alice@example.com');
        $student2 = $this->createStudent('Bob Smith', 'bob@example.com');
        $student3 = $this->createStudent('Charlie Brown', 'charlie@example.com');

        // Assign all 3 students
        SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $student1->id, 'assigned_at' => now()]);
        SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $student2->id, 'assigned_at' => now()]);
        SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $student3->id, 'assigned_at' => now()]);

        // Student 1 submitted with score 10.0
        $attempt1 = ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student1->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::SUBMITTED,
            'started_at' => Carbon::now()->subMinutes(50),
            'submitted_at' => Carbon::now()->subMinutes(10),
            'score' => 10.0,
            'total_points' => 10.0,
        ]);

        // Add proctoring event for student 1
        ProctoringEvent::create([
            'attempt_id' => $attempt1->id,
            'event_type' => ProctoringEventType::TAB_HIDDEN,
            'severity' => ProctoringSeverity::MEDIUM,
            'occurred_at' => now()->subMinutes(30),
        ]);

        // Student 2 submitted with score 4.0
        ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student2->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::SUBMITTED,
            'started_at' => Carbon::now()->subMinutes(60),
            'submitted_at' => Carbon::now()->subMinutes(5),
            'score' => 4.0,
            'total_points' => 10.0,
        ]);

        // Student 3 is absent (no attempt)

        $response = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'session' => [
                        'id',
                        'title',
                        'status',
                        'start_at',
                        'end_at',
                        'exam' => ['id', 'title', 'total_points', 'pass_score', 'duration_minutes'],
                    ],
                    'summary' => [
                        'total_assigned',
                        'total_participants',
                        'total_submitted',
                        'total_in_progress',
                        'total_absent',
                        'attendance_rate',
                    ],
                    'statistics' => [
                        'min_score',
                        'max_score',
                        'avg_score',
                        'median_score',
                        'std_deviation',
                        'passed_count',
                        'failed_count',
                        'pass_rate',
                        'fail_rate',
                    ],
                    'histogram' => [
                        '*' => ['range', 'min', 'max', 'count', 'percentage'],
                    ],
                    'question_analysis' => [
                        '*' => [
                            'question_id',
                            'question_text',
                            'question_type',
                            'order',
                            'points',
                            'total_answers',
                            'correct_answers',
                            'incorrect_answers',
                            'difficulty_index',
                            'discrimination_index',
                            'difficulty_level',
                            'discrimination_level',
                        ],
                    ],
                    'scoreboard' => [
                        '*' => [
                            'student_id',
                            'student_name',
                            'student_email',
                            'attempt_id',
                            'status',
                            'score',
                            'total_points',
                            'is_passed',
                            'duration_seconds',
                            'violations_count',
                            'classification',
                            'started_at',
                            'submitted_at',
                        ],
                    ],
                    'pagination' => [
                        'current_page',
                        'per_page',
                        'total',
                        'last_page',
                    ],
                ],
            ]);

        $data = $response->json('data');

        // Check Summary
        $this->assertEquals(3, $data['summary']['total_assigned']);
        $this->assertEquals(2, $data['summary']['total_participants']);
        $this->assertEquals(2, $data['summary']['total_submitted']);
        $this->assertEquals(1, $data['summary']['total_absent']);
        $this->assertEquals(66.67, $data['summary']['attendance_rate']);

        // Check Statistics
        $this->assertEquals(4.0, $data['statistics']['min_score']);
        $this->assertEquals(10.0, $data['statistics']['max_score']);
        $this->assertEquals(7.0, $data['statistics']['avg_score']);
        $this->assertEquals(7.0, $data['statistics']['median_score']);
        $this->assertEquals(3.0, $data['statistics']['std_deviation']); // sqrt(((4-7)^2 + (10-7)^2) / 2) = sqrt(18/2) = 3
        $this->assertEquals(1, $data['statistics']['passed_count']);
        $this->assertEquals(1, $data['statistics']['failed_count']);
        $this->assertEquals(50.0, $data['statistics']['pass_rate']);
        $this->assertEquals(50.0, $data['statistics']['fail_rate']);

        // Check Histogram has 5 buckets
        $this->assertCount(5, $data['histogram']);

        // Check Scoreboard has 3 students including absent
        $this->assertCount(3, $data['scoreboard']);

        // Check violations count on Student 1
        $student1Row = collect($data['scoreboard'])->firstWhere('student_id', $student1->id);
        $this->assertNotNull($student1Row);
        $this->assertEquals(1, $student1Row['violations_count']);
        $this->assertEquals('Xuất sắc', $student1Row['classification']);
        $this->assertTrue($student1Row['is_passed']);

        // Check Absent Student 3
        $student3Row = collect($data['scoreboard'])->firstWhere('student_id', $student3->id);
        $this->assertNotNull($student3Row);
        $this->assertEquals('absent', $student3Row['status']);
        $this->assertNull($student3Row['score']);
    }

    public function test_admin_can_view_session_results_for_any_session(): void
    {
        $teacher = $this->createTeacher();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $response->assertOk()
            ->assertJsonPath('data.session.id', $session->id);
    }

    public function test_assigned_proctor_teacher_can_view_session_results(): void
    {
        $ownerTeacher = $this->createTeacher();
        $proctorTeacher = $this->createTeacher();
        $subject = $this->createSubject($ownerTeacher);
        $exam = $this->createExam($subject, $ownerTeacher);
        $session = $this->createSession($exam, $ownerTeacher);

        // Assign proctor teacher to session
        SessionTeacher::create([
            'exam_session_id' => $session->id,
            'teacher_id' => $proctorTeacher->id,
            'role_in_session' => 'proctor',
        ]);

        $response = $this->actingAs($proctorTeacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $response->assertOk()
            ->assertJsonPath('data.session.id', $session->id);
    }

    public function test_unauthorized_teacher_cannot_view_session_results_idor_protection(): void
    {
        $ownerTeacher = $this->createTeacher();
        $foreignTeacher = $this->createTeacher();
        $subject = $this->createSubject($ownerTeacher);
        $exam = $this->createExam($subject, $ownerTeacher);
        $session = $this->createSession($exam, $ownerTeacher);

        $response = $this->actingAs($foreignTeacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $response->assertForbidden();
    }

    public function test_student_cannot_view_session_results(): void
    {
        $teacher = $this->createTeacher();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $student = $this->createStudent();

        $response = $this->actingAs($student)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $response->assertForbidden();
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $teacher = $this->createTeacher();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $response = $this->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $response->assertUnauthorized();
    }

    public function test_non_existent_session_returns_404(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/exam-sessions/999999/results');

        $response->assertNotFound();
    }

    public function test_empty_session_with_no_submissions_returns_null_stats_gracefully(): void
    {
        $teacher = $this->createTeacher();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher);
        $session = $this->createSession($exam, $teacher);

        $response = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $response->assertOk()
            ->assertJsonPath('data.summary.total_submitted', 0)
            ->assertJsonPath('data.statistics.min_score', null)
            ->assertJsonPath('data.statistics.max_score', null)
            ->assertJsonPath('data.statistics.avg_score', null)
            ->assertJsonPath('data.statistics.median_score', null)
            ->assertJsonPath('data.statistics.std_deviation', null);

        $this->assertEquals(0.0, (float) $response->json('data.statistics.pass_rate'));
    }

    public function test_median_and_std_deviation_calculation_odd_and_even_scores(): void
    {
        $teacher = $this->createTeacher();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher, passScore: 5.0, totalPoints: 10.0);
        $session = $this->createSession($exam, $teacher);

        // Create 4 students with scores 4.0, 6.0, 8.0, 10.0 (even count)
        $scores = [4.0, 6.0, 8.0, 10.0];
        foreach ($scores as $score) {
            $st = $this->createStudent();
            SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $st->id, 'assigned_at' => now()]);
            ExamAttempt::create([
                'exam_session_id' => $session->id,
                'student_id' => $st->id,
                'attempt_number' => 1,
                'status' => ExamAttemptStatus::SUBMITTED,
                'started_at' => now()->subHour(),
                'submitted_at' => now()->subMinutes(10),
                'score' => $score,
                'total_points' => 10.0,
            ]);
        }

        $resEven = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $resEven->assertOk();
        // Median of [4, 6, 8, 10] = (6 + 8)/2 = 7.0
        $this->assertEquals(7.0, $resEven->json('data.statistics.median_score'));
        $this->assertEquals(7.0, $resEven->json('data.statistics.avg_score'));
        $this->assertEquals(4.0, $resEven->json('data.statistics.min_score'));
        $this->assertEquals(10.0, $resEven->json('data.statistics.max_score'));

        // Add 5th student with score 3.0 (odd count: [3, 4, 6, 8, 10])
        $st5 = $this->createStudent();
        SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $st5->id, 'assigned_at' => now()]);
        ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $st5->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::SUBMITTED,
            'started_at' => now()->subHour(),
            'submitted_at' => now()->subMinutes(10),
            'score' => 3.0,
            'total_points' => 10.0,
        ]);

        $resOdd = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $resOdd->assertOk();
        // Median of [3, 4, 6, 8, 10] is 6.0
        $this->assertEquals(6.0, $resOdd->json('data.statistics.median_score'));
    }

    public function test_item_analysis_difficulty_and_discrimination_index(): void
    {
        $teacher = $this->createTeacher();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher, passScore: 5.0, totalPoints: 10.0);
        $session = $this->createSession($exam, $teacher);

        $questions = $exam->questions()->orderBy('exam_questions.order')->get();
        $q1 = $questions[0];
        $q2 = $questions[1];

        // Create 10 students: 3 high scorers (score 10), 4 medium scorers (score 5), 3 low scorers (score 0)
        // For Q1: high scorers get it right (3/3), low scorers get it wrong (0/3) -> Discrimination D = (3-0)/3 = 1.0 (excellent)
        // For Q2: all students get it right -> Difficulty P = 1.0 (easy), D = (3-3)/3 = 0.0 (poor)
        for ($i = 1; $i <= 10; $i++) {
            $student = $this->createStudent("Student {$i}");
            SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $student->id, 'assigned_at' => now()]);

            $isHigh = $i <= 3;
            $isMed = $i > 3 && $i <= 7;
            $isLow = $i > 7;

            $q1Correct = $isHigh; // only high scorers get Q1 right
            $q2Correct = true;   // everyone gets Q2 right

            $score = ($q1Correct ? 5.0 : 0.0) + ($q2Correct ? 5.0 : 0.0);

            $attempt = ExamAttempt::create([
                'exam_session_id' => $session->id,
                'student_id' => $student->id,
                'attempt_number' => 1,
                'status' => ExamAttemptStatus::SUBMITTED,
                'started_at' => now()->subHour(),
                'submitted_at' => now()->subMinutes(10),
                'score' => $score,
                'total_points' => 10.0,
            ]);

            AttemptAnswer::create([
                'attempt_id' => $attempt->id,
                'question_id' => $q1->id,
                'selected_options' => $q1Correct ? ['opt_a'] : ['opt_b'],
                'awarded_points' => $q1Correct ? 5.0 : 0.0,
                'is_correct' => $q1Correct,
            ]);

            AttemptAnswer::create([
                'attempt_id' => $attempt->id,
                'question_id' => $q2->id,
                'selected_options' => ['opt_a'],
                'awarded_points' => 5.0,
                'is_correct' => true,
            ]);
        }

        $response = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $response->assertOk();
        $qAnalysis = $response->json('data.question_analysis');

        $this->assertCount(2, $qAnalysis);

        // Q1 analysis
        $q1Stat = collect($qAnalysis)->firstWhere('question_id', $q1->id);
        $this->assertEquals(10, $q1Stat['total_answers']);
        $this->assertEquals(3, $q1Stat['correct_answers']);
        $this->assertEquals(7, $q1Stat['incorrect_answers']);
        $this->assertEquals(0.3, $q1Stat['difficulty_index']); // 3 / 10 = 0.3
        $this->assertEquals(1.0, $q1Stat['discrimination_index']); // (3 - 0) / 3 = 1.0
        $this->assertEquals('excellent', $q1Stat['discrimination_level']);

        // Q2 analysis
        $q2Stat = collect($qAnalysis)->firstWhere('question_id', $q2->id);
        $this->assertEquals(10, $q2Stat['total_answers']);
        $this->assertEquals(10, $q2Stat['correct_answers']);
        $this->assertEquals(0, $q2Stat['incorrect_answers']);
        $this->assertEquals(1.0, $q2Stat['difficulty_index']);
        $this->assertEquals('easy', $q2Stat['difficulty_level']);
        $this->assertEquals(0.0, $q2Stat['discrimination_index']);
        $this->assertEquals('poor', $q2Stat['discrimination_level']);
    }

    public function test_scoreboard_filtering_sorting_and_pagination(): void
    {
        $teacher = $this->createTeacher();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher, passScore: 5.0, totalPoints: 10.0);
        $session = $this->createSession($exam, $teacher);

        $stPassed = $this->createStudent('Alpha Student', 'alpha@example.com');
        $stFailed = $this->createStudent('Beta Student', 'beta@example.com');
        $stAbsent = $this->createStudent('Gamma Student', 'gamma@example.com');

        SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $stPassed->id, 'assigned_at' => now()]);
        SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $stFailed->id, 'assigned_at' => now()]);
        SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $stAbsent->id, 'assigned_at' => now()]);

        ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $stPassed->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::SUBMITTED,
            'started_at' => now()->subHour(),
            'submitted_at' => now()->subMinutes(10),
            'score' => 8.5,
            'total_points' => 10.0,
        ]);

        ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $stFailed->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::SUBMITTED,
            'started_at' => now()->subHour(),
            'submitted_at' => now()->subMinutes(5),
            'score' => 3.0,
            'total_points' => 10.0,
        ]);

        // Filter by is_passed = true
        $resPass = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results?is_passed=true");
        $resPass->assertOk();
        $this->assertCount(1, $resPass->json('data.scoreboard'));
        $this->assertEquals($stPassed->id, $resPass->json('data.scoreboard.0.student_id'));

        // Filter by is_passed = false
        $resFail = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results?is_passed=false");
        $resFail->assertOk();
        $this->assertCount(1, $resFail->json('data.scoreboard'));
        $this->assertEquals($stFailed->id, $resFail->json('data.scoreboard.0.student_id'));

        // Filter by status = absent
        $resAbsent = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results?status=absent");
        $resAbsent->assertOk();
        $this->assertCount(1, $resAbsent->json('data.scoreboard'));
        $this->assertEquals($stAbsent->id, $resAbsent->json('data.scoreboard.0.student_id'));

        // Search by student name
        $resSearch = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results?search=Alpha");
        $resSearch->assertOk();
        $this->assertCount(1, $resSearch->json('data.scoreboard'));
        $this->assertEquals($stPassed->id, $resSearch->json('data.scoreboard.0.student_id'));

        // Pagination test: per_page = 1, page = 2
        $resPage = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results?per_page=1&page=2");
        $resPage->assertOk();
        $this->assertCount(1, $resPage->json('data.scoreboard'));
        $this->assertEquals(2, $resPage->json('data.pagination.current_page'));
        $this->assertEquals(1, $resPage->json('data.pagination.per_page'));
        $this->assertEquals(3, $resPage->json('data.pagination.total'));
        $this->assertEquals(3, $resPage->json('data.pagination.last_page'));
    }

    public function test_query_count_performance_audit_no_n_plus_one(): void
    {
        $teacher = $this->createTeacher();
        $subject = $this->createSubject($teacher);
        $exam = $this->createExam($subject, $teacher, passScore: 5.0, totalPoints: 10.0);
        $session = $this->createSession($exam, $teacher);

        // Seed 10 students with attempts and answers
        $questions = $exam->questions()->get();
        for ($i = 1; $i <= 10; $i++) {
            $student = $this->createStudent("Student {$i}");
            SessionAssignment::create(['exam_session_id' => $session->id, 'student_id' => $student->id, 'assigned_at' => now()]);

            $attempt = ExamAttempt::create([
                'exam_session_id' => $session->id,
                'student_id' => $student->id,
                'attempt_number' => 1,
                'status' => ExamAttemptStatus::SUBMITTED,
                'started_at' => now()->subHour(),
                'submitted_at' => now()->subMinutes(10),
                'score' => 7.5,
                'total_points' => 10.0,
            ]);

            foreach ($questions as $q) {
                AttemptAnswer::create([
                    'attempt_id' => $attempt->id,
                    'question_id' => $q->id,
                    'selected_options' => ['opt_a'],
                    'awarded_points' => 5.0,
                    'is_correct' => true,
                ]);
            }
        }

        DB::flushQueryLog();
        DB::enableQueryLog();

        $response = $this->actingAs($teacher)
            ->getJson("/api/v1/exam-sessions/{$session->id}/results");

        $response->assertOk();

        $queries = DB::getQueryLog();
        $queryCount = count($queries);

        // Ensure constant O(1) query count regardless of student count (<= 15 queries)
        $this->assertLessThanOrEqual(15, $queryCount, "Query count {$queryCount} exceeds threshold. Possible N+1 query detected.");
    }
}
