<?php

namespace Tests\Unit\Scoring;

use App\Enums\ExamAttemptStatus;
use App\Enums\ExamSessionStatus;
use App\Enums\QuestionStatus;
use App\Enums\QuestionType;
use App\Models\AttemptAnswer;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use App\Services\Scoring\AttemptScorer;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttemptScorerTest extends TestCase
{
    use RefreshDatabase;

    protected AttemptScorer $scorer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->scorer = new AttemptScorer;
    }

    public function test_evaluate_single_choice_question(): void
    {
        $q = new Question([
            'question_type' => QuestionType::SINGLE_CHOICE,
            'correct_answer' => 'opt_b',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Alpha'],
                ['id' => 'opt_b', 'content' => 'Beta'],
            ],
        ]);

        $this->assertTrue($this->scorer->evaluateAnswer($q, 'opt_b'));
        $this->assertTrue($this->scorer->evaluateAnswer($q, ['opt_b']));
        $this->assertFalse($this->scorer->evaluateAnswer($q, 'opt_a'));
        $this->assertFalse($this->scorer->evaluateAnswer($q, ['opt_a']));
        $this->assertFalse($this->scorer->evaluateAnswer($q, []));
        $this->assertFalse($this->scorer->evaluateAnswer($q, ''));
    }

    public function test_evaluate_true_false_question(): void
    {
        $q = new Question([
            'question_type' => QuestionType::TRUE_FALSE,
            'correct_answer' => 'opt_true',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
        ]);

        $this->assertTrue($this->scorer->evaluateAnswer($q, 'opt_true'));
        $this->assertTrue($this->scorer->evaluateAnswer($q, ['opt_true']));
        $this->assertFalse($this->scorer->evaluateAnswer($q, 'opt_false'));
        $this->assertFalse($this->scorer->evaluateAnswer($q, []));
    }

    public function test_evaluate_multiple_choice_question_with_all_or_nothing_rule(): void
    {
        $q = new Question([
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'correct_answer' => ['opt_a', 'opt_c'],
            'options' => [
                ['id' => 'opt_a', 'content' => 'Option A'],
                ['id' => 'opt_b', 'content' => 'Option B'],
                ['id' => 'opt_c', 'content' => 'Option C'],
                ['id' => 'opt_d', 'content' => 'Option D'],
            ],
        ]);

        // Exact match
        $this->assertTrue($this->scorer->evaluateAnswer($q, ['opt_a', 'opt_c']));
        // Order permutation
        $this->assertTrue($this->scorer->evaluateAnswer($q, ['opt_c', 'opt_a']));

        // Partial match (missing opt_c) -> Fail under All-or-Nothing (BR-010 / A-003)
        $this->assertFalse($this->scorer->evaluateAnswer($q, ['opt_a']));
        // Extra incorrect option
        $this->assertFalse($this->scorer->evaluateAnswer($q, ['opt_a', 'opt_b', 'opt_c']));
        // Completely incorrect
        $this->assertFalse($this->scorer->evaluateAnswer($q, ['opt_b']));
        $this->assertFalse($this->scorer->evaluateAnswer($q, []));
    }

    public function test_evaluate_short_answer_question_with_case_insensitivity_and_trimming(): void
    {
        $q = new Question([
            'question_type' => QuestionType::SHORT_ANSWER,
            'correct_answer' => 'Photosynthesis',
        ]);

        // Exact
        $this->assertTrue($this->scorer->evaluateAnswer($q, 'Photosynthesis'));
        // Lowercase
        $this->assertTrue($this->scorer->evaluateAnswer($q, 'photosynthesis'));
        // Uppercase
        $this->assertTrue($this->scorer->evaluateAnswer($q, 'PHOTOSYNTHESIS'));
        // With leading and trailing whitespace
        $this->assertTrue($this->scorer->evaluateAnswer($q, '   photosynthesis   '));
        // As single-element array
        $this->assertTrue($this->scorer->evaluateAnswer($q, ['photosynthesis']));

        // Unicode / Vietnamese support
        $qVietnamese = new Question([
            'question_type' => QuestionType::SHORT_ANSWER,
            'correct_answer' => 'Hà Nội',
        ]);
        $this->assertTrue($this->scorer->evaluateAnswer($qVietnamese, 'hà nội'));
        $this->assertTrue($this->scorer->evaluateAnswer($qVietnamese, 'HÀ NỘI'));
        $this->assertFalse($this->scorer->evaluateAnswer($qVietnamese, 'Sài Gòn'));

        // Incorrect and empty
        $this->assertFalse($this->scorer->evaluateAnswer($q, 'Respiration'));
        $this->assertFalse($this->scorer->evaluateAnswer($q, ''));
        $this->assertFalse($this->scorer->evaluateAnswer($q, []));
    }

    public function test_calculate_attempt_full_score_and_breakdown(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = new Subject(['code' => 'CS_'.uniqid(), 'name' => 'Computer Science']);
        $subject->created_by = $teacher->id;
        $subject->owner_teacher_id = $teacher->id;
        $subject->save();

        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic 1']);

        // Question 1: Single Choice (2.5 pts)
        $q1 = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'Q1',
            'question_type' => QuestionType::SINGLE_CHOICE,
            'options' => [['id' => 'a', 'content' => 'A'], ['id' => 'b', 'content' => 'B']],
            'correct_answer' => 'a',
            'difficulty' => 'easy',
        ]);
        $q1->created_by = $teacher->id;
        $q1->status = QuestionStatus::READY;
        $q1->save();

        // Question 2: Multiple Choice (2.5 pts)
        $q2 = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'Q2',
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'options' => [['id' => 'a', 'content' => 'A'], ['id' => 'b', 'content' => 'B'], ['id' => 'c', 'content' => 'C']],
            'correct_answer' => ['a', 'c'],
            'difficulty' => 'medium',
        ]);
        $q2->created_by = $teacher->id;
        $q2->status = QuestionStatus::READY;
        $q2->save();

        // Question 3: True / False (2.5 pts)
        $q3 = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'Q3',
            'question_type' => QuestionType::TRUE_FALSE,
            'options' => [['id' => 'true', 'content' => 'Đúng'], ['id' => 'false', 'content' => 'Sai']],
            'correct_answer' => 'true',
            'difficulty' => 'easy',
        ]);
        $q3->created_by = $teacher->id;
        $q3->status = QuestionStatus::READY;
        $q3->save();

        // Question 4: Short Answer (2.5 pts)
        $q4 = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'Q4',
            'question_type' => QuestionType::SHORT_ANSWER,
            'correct_answer' => 'Laravel',
            'difficulty' => 'medium',
        ]);
        $q4->created_by = $teacher->id;
        $q4->status = QuestionStatus::READY;
        $q4->save();

        $exam = new Exam([
            'title' => 'Sample Exam',
            'duration_minutes' => 45,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();

        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 2.50]);
        $exam->questions()->attach($q2->id, ['order' => 2, 'points' => 2.50]);
        $exam->questions()->attach($q3->id, ['order' => 3, 'points' => 2.50]);
        $exam->questions()->attach($q4->id, ['order' => 4, 'points' => 2.50]);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Ca thi mẫu',
            'start_at' => Carbon::now()->subMinutes(10),
            'end_at' => Carbon::now()->addHour(),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $session->created_by = $teacher->id;
        $session->status = ExamSessionStatus::PUBLISHED;
        $session->save();

        $attempt = ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::IN_PROGRESS,
            'started_at' => Carbon::now()->subMinutes(10),
            'total_points' => '10.00',
        ]);

        // Student answers: Q1 correct, Q2 correct, Q3 correct, Q4 correct
        AttemptAnswer::create(['attempt_id' => $attempt->id, 'question_id' => $q1->id, 'selected_options' => ['a']]);
        AttemptAnswer::create(['attempt_id' => $attempt->id, 'question_id' => $q2->id, 'selected_options' => ['c', 'a']]);
        AttemptAnswer::create(['attempt_id' => $attempt->id, 'question_id' => $q3->id, 'selected_options' => ['true']]);
        AttemptAnswer::create(['attempt_id' => $attempt->id, 'question_id' => $q4->id, 'selected_options' => ['laravel']]);

        $attempt->load(['session.exam']);
        $result = $this->scorer->calculate($attempt);

        $this->assertEquals(10.00, $result->score);
        $this->assertEquals(10.00, $result->totalPoints);
        $this->assertEquals(4, $result->totalQuestions);
        $this->assertEquals(4, $result->answeredQuestions);
        $this->assertEquals(4, $result->correctQuestions);
        $this->assertTrue($result->isPassed);

        // Verify DB updates in attempt_answers
        $ans1 = AttemptAnswer::where('attempt_id', $attempt->id)->where('question_id', $q1->id)->firstOrFail();
        $this->assertTrue($ans1->is_correct);
        $this->assertEquals('2.50', $ans1->awarded_points);

        $ans4 = AttemptAnswer::where('attempt_id', $attempt->id)->where('question_id', $q4->id)->firstOrFail();
        $this->assertTrue($ans4->is_correct);
        $this->assertEquals('2.50', $ans4->awarded_points);
    }

    public function test_calculate_attempt_with_partial_and_unanswered_questions(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = new Subject(['code' => 'CS_'.uniqid(), 'name' => 'Computer Science']);
        $subject->created_by = $teacher->id;
        $subject->owner_teacher_id = $teacher->id;
        $subject->save();

        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic 1']);

        $q1 = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'Q1',
            'question_type' => QuestionType::SINGLE_CHOICE,
            'options' => [['id' => 'a', 'content' => 'A'], ['id' => 'b', 'content' => 'B']],
            'correct_answer' => 'a',
            'difficulty' => 'easy',
        ]);
        $q1->created_by = $teacher->id;
        $q1->status = QuestionStatus::READY;
        $q1->save();

        $q2 = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'Q2',
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'options' => [['id' => 'a', 'content' => 'A'], ['id' => 'b', 'content' => 'B'], ['id' => 'c', 'content' => 'C']],
            'correct_answer' => ['a', 'b'],
            'difficulty' => 'medium',
        ]);
        $q2->created_by = $teacher->id;
        $q2->status = QuestionStatus::READY;
        $q2->save();

        $exam = new Exam([
            'title' => 'Exam',
            'duration_minutes' => 45,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();

        $exam->questions()->attach($q1->id, ['order' => 1, 'points' => 5.00]);
        $exam->questions()->attach($q2->id, ['order' => 2, 'points' => 5.00]);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Ca thi',
            'start_at' => Carbon::now()->subMinutes(10),
            'end_at' => Carbon::now()->addHour(),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $session->created_by = $teacher->id;
        $session->status = ExamSessionStatus::PUBLISHED;
        $session->save();

        $attempt = ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::IN_PROGRESS,
            'started_at' => Carbon::now()->subMinutes(10),
            'total_points' => '10.00',
        ]);

        // Student only answers Q1 (correct) and leaves Q2 blank
        AttemptAnswer::create(['attempt_id' => $attempt->id, 'question_id' => $q1->id, 'selected_options' => ['a']]);

        $attempt->load(['session.exam']);
        $result = $this->scorer->calculate($attempt);

        $this->assertEquals(5.00, $result->score);
        $this->assertEquals(10.00, $result->totalPoints);
        $this->assertEquals(2, $result->totalQuestions);
        $this->assertEquals(1, $result->answeredQuestions);
        $this->assertEquals(1, $result->correctQuestions);
        $this->assertTrue($result->isPassed); // 5.00 >= 5.00 pass_score

        // Ensure Q2 has an attempt_answer row recorded with 0 points
        $ans2 = AttemptAnswer::where('attempt_id', $attempt->id)->where('question_id', $q2->id)->first();
        $this->assertNotNull($ans2);
        $this->assertFalse($ans2->is_correct);
        $this->assertEquals('0.00', $ans2->awarded_points);
    }
}
