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
use Tests\TestCase;

class SaveAnswerTest extends TestCase
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

    private function createQuestion(Topic $topic, User $author, QuestionType $type = QuestionType::SINGLE_CHOICE): Question
    {
        $options = $type === QuestionType::SHORT_ANSWER ? null : [
            ['id' => 'opt_a', 'content' => 'Option A'],
            ['id' => 'opt_b', 'content' => 'Option B'],
        ];

        $correctAnswer = $type === QuestionType::SHORT_ANSWER ? 'Correct Text' : 'opt_a';

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

    public function test_student_can_autosave_choice_answer_and_upsert_idempotently(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Web Dev']);
        $question = $this->createQuestion($topic, $teacher, QuestionType::SINGLE_CHOICE);

        $exam = new Exam([
            'title' => 'Web Exam',
            'duration_minutes' => 60,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();
        $exam->questions()->attach($question->id, ['order' => 1, 'points' => 10.00]);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Ca thi Web '.uniqid(),
            'start_at' => Carbon::now()->subMinutes(5),
            'end_at' => Carbon::now()->addHour(),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $session->created_by = $teacher->id;
        $session->status = ExamSessionStatus::PUBLISHED;
        $session->save();

        SessionAssignment::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
        ]);

        $attempt = ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::IN_PROGRESS,
            'started_at' => Carbon::now()->subMinutes(5),
            'total_points' => '10.00',
        ]);

        // 1. Save answer for the first time
        $response1 = $this->actingAs($student)
            ->patchJson("/api/v1/exam-attempts/{$attempt->id}/answers", [
                'question_id' => $question->id,
                'selected_options' => ['opt_a'],
            ]);

        $response1->assertStatus(200)
            ->assertJsonPath('data.attempt_id', $attempt->id)
            ->assertJsonPath('data.question_id', $question->id)
            ->assertJsonPath('data.selected_options', ['opt_a']);

        $this->assertEquals(1, AttemptAnswer::query()->where('attempt_id', $attempt->id)->count());

        // 2. Change answer (Idempotent Upsert)
        $response2 = $this->actingAs($student)
            ->patchJson("/api/v1/exam-attempts/{$attempt->id}/answers", [
                'question_id' => $question->id,
                'selected_options' => ['opt_b'],
            ]);

        $response2->assertStatus(200)
            ->assertJsonPath('data.selected_options', ['opt_b']);

        $this->assertEquals(1, AttemptAnswer::query()->where('attempt_id', $attempt->id)->count());
        $this->assertDatabaseHas('attempt_answers', [
            'attempt_id' => $attempt->id,
            'question_id' => $question->id,
        ]);
    }

    public function test_student_can_autosave_short_answer(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Math']);
        $question = $this->createQuestion($topic, $teacher, QuestionType::SHORT_ANSWER);

        $exam = new Exam([
            'title' => 'Math Exam',
            'duration_minutes' => 60,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();
        $exam->questions()->attach($question->id, ['order' => 1, 'points' => 10.00]);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Ca thi Math '.uniqid(),
            'start_at' => Carbon::now()->subMinutes(5),
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
            'started_at' => Carbon::now()->subMinutes(5),
            'total_points' => '10.00',
        ]);

        $response = $this->actingAs($student)
            ->patchJson("/api/v1/exam-attempts/{$attempt->id}/answers", [
                'question_id' => $question->id,
                'selected_options' => ['Sample written answer'],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.selected_options', ['Sample written answer']);
    }

    public function test_saving_answer_is_rejected_if_attempt_already_submitted(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $question = $this->createQuestion($topic, $teacher);

        $exam = new Exam([
            'title' => 'Exam',
            'duration_minutes' => 60,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();
        $exam->questions()->attach($question->id, ['order' => 1, 'points' => 10.00]);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Session',
            'start_at' => Carbon::now()->subMinutes(20),
            'end_at' => Carbon::now()->addHour(),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $session->created_by = $teacher->id;
        $session->status = ExamSessionStatus::PUBLISHED;
        $session->save();

        // Attempt is already SUBMITTED
        $attempt = ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::SUBMITTED,
            'started_at' => Carbon::now()->subMinutes(20),
            'submitted_at' => Carbon::now()->subMinutes(5),
            'score' => '10.00',
            'total_points' => '10.00',
        ]);

        $response = $this->actingAs($student)
            ->patchJson("/api/v1/exam-attempts/{$attempt->id}/answers", [
                'question_id' => $question->id,
                'selected_options' => ['opt_a'],
            ]);

        // Forbidden by policy (must be IN_PROGRESS)
        $response->assertStatus(403);
    }

    public function test_saving_answer_is_rejected_if_attempt_time_expired(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $question = $this->createQuestion($topic, $teacher);

        $exam = new Exam([
            'title' => 'Exam',
            'duration_minutes' => 30, // 30 minutes
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();
        $exam->questions()->attach($question->id, ['order' => 1, 'points' => 10.00]);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Session',
            'start_at' => Carbon::now()->subHours(2),
            'end_at' => Carbon::now()->addHour(),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $session->created_by = $teacher->id;
        $session->status = ExamSessionStatus::PUBLISHED;
        $session->save();

        // Attempt started 45 minutes ago (duration 30 mins) -> Expired
        $attempt = ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $student->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::IN_PROGRESS,
            'started_at' => Carbon::now()->subMinutes(45),
            'total_points' => '10.00',
        ]);

        $response = $this->actingAs($student)
            ->patchJson("/api/v1/exam-attempts/{$attempt->id}/answers", [
                'question_id' => $question->id,
                'selected_options' => ['opt_a'],
            ]);

        $response->assertStatus(409)
            ->assertJsonPath('error_code', 'ATTEMPT_TIME_EXPIRED');
    }

    public function test_saving_answer_for_question_not_in_exam_is_rejected(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $qInExam = $this->createQuestion($topic, $teacher);
        $qNotInExam = $this->createQuestion($topic, $teacher);

        $exam = new Exam([
            'title' => 'Exam',
            'duration_minutes' => 60,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();
        $exam->questions()->attach($qInExam->id, ['order' => 1, 'points' => 10.00]);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Session',
            'start_at' => Carbon::now()->subMinutes(5),
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
            'started_at' => Carbon::now()->subMinutes(5),
            'total_points' => '10.00',
        ]);

        $response = $this->actingAs($student)
            ->patchJson("/api/v1/exam-attempts/{$attempt->id}/answers", [
                'question_id' => $qNotInExam->id,
                'selected_options' => ['opt_a'],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['question_id']);
    }

    public function test_saving_invalid_option_id_is_rejected(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $question = $this->createQuestion($topic, $teacher);

        $exam = new Exam([
            'title' => 'Exam',
            'duration_minutes' => 60,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();
        $exam->questions()->attach($question->id, ['order' => 1, 'points' => 10.00]);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Session',
            'start_at' => Carbon::now()->subMinutes(5),
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
            'started_at' => Carbon::now()->subMinutes(5),
            'total_points' => '10.00',
        ]);

        $response = $this->actingAs($student)
            ->patchJson("/api/v1/exam-attempts/{$attempt->id}/answers", [
                'question_id' => $question->id,
                'selected_options' => ['invalid_nonexistent_opt'],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['selected_options']);
    }

    public function test_idor_student_cannot_save_answer_or_view_another_students_attempt(): void
    {
        $teacher = User::factory()->teacher()->create();
        $studentA = User::factory()->student()->create();
        $studentB = User::factory()->student()->create();

        $subject = $this->createSubject($teacher);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic']);
        $question = $this->createQuestion($topic, $teacher);

        $exam = new Exam([
            'title' => 'Exam',
            'duration_minutes' => 60,
            'pass_score' => '5.00',
            'total_points' => '10.00',
            'shuffle_questions' => false,
            'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $teacher->id;
        $exam->save();
        $exam->questions()->attach($question->id, ['order' => 1, 'points' => 10.00]);

        $session = new ExamSession([
            'exam_id' => $exam->id,
            'title' => 'Session',
            'start_at' => Carbon::now()->subMinutes(5),
            'end_at' => Carbon::now()->addHour(),
            'allow_late_minutes' => 15,
            'max_attempts' => 1,
        ]);
        $session->created_by = $teacher->id;
        $session->status = ExamSessionStatus::PUBLISHED;
        $session->save();

        // Student A's attempt
        $attemptA = ExamAttempt::create([
            'exam_session_id' => $session->id,
            'student_id' => $studentA->id,
            'attempt_number' => 1,
            'status' => ExamAttemptStatus::IN_PROGRESS,
            'started_at' => Carbon::now()->subMinutes(5),
            'total_points' => '10.00',
        ]);

        // Student B tries to save answer to Student A's attempt -> 403 Forbidden (TC-SEC-01)
        $this->actingAs($studentB)
            ->patchJson("/api/v1/exam-attempts/{$attemptA->id}/answers", [
                'question_id' => $question->id,
                'selected_options' => ['opt_a'],
            ])
            ->assertStatus(403);

        // Student B tries to view Student A's attempt -> 403 Forbidden (TC-SEC-01)
        $this->actingAs($studentB)
            ->getJson("/api/v1/exam-attempts/{$attemptA->id}")
            ->assertStatus(403);

        // Teacher creator can view -> 200 OK
        $this->actingAs($teacher)
            ->getJson("/api/v1/exam-attempts/{$attemptA->id}")
            ->assertStatus(200);

        // Admin can view -> 200 OK
        $admin = User::factory()->admin()->create();
        $this->actingAs($admin)
            ->getJson("/api/v1/exam-attempts/{$attemptA->id}")
            ->assertStatus(200);
    }
}
