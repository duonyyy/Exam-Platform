<?php

namespace Tests\Feature\Exams;

use App\Enums\QuestionStatus;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GenerateExamFromBlueprintTest extends TestCase
{
    use RefreshDatabase;

    private function createSubject(User $creator, ?User $owner, string $code): Subject
    {
        $subject = new Subject(['code' => $code, 'name' => "Subject {$code}"]);
        $subject->created_by = $creator->id;
        $subject->owner_teacher_id = $owner?->id;
        $subject->save();

        return $subject;
    }

    private function createQuestion(
        Subject $subject,
        User $author,
        QuestionStatus $status = QuestionStatus::READY,
        string $difficulty = 'easy'
    ): Question {
        $topic = Topic::create([
            'subject_id' => $subject->id,
            'name' => 'Topic '.uniqid(),
        ]);

        $question = new Question([
            'topic_id' => $topic->id,
            'question_text' => 'What is the outcome of 2 + 2?',
            'question_type' => 'single_choice',
            'options' => [
                ['id' => 'a', 'content' => '4'],
                ['id' => 'b', 'content' => '5'],
            ],
            'correct_answer' => 'a',
            'difficulty' => $difficulty,
        ]);
        $question->created_by = $author->id;
        $question->status = $status;
        $question->source = 'manual';
        $question->save();

        return $question;
    }

    private function validBlueprintPayload(Subject $subject, array $questions): array
    {
        return [
            'thread_id' => 'thread_'.bin2hex(random_bytes(8)),
            'prompt_hash' => hash('sha256', 'Design a blueprint exam for web programming'),
            'proposal_hash' => hash('sha256', 'proposal_'.uniqid()),
            'subject_id' => $subject->id,
            'title' => 'Đề thi Khảo thí AI — Lập trình Web',
            'duration_minutes' => 60,
            'pass_score' => 5.0,
            'shuffle_questions' => true,
            'shuffle_options' => true,
            'questions' => $questions,
            'metadata' => [
                'difficulty_distribution' => ['easy' => 50.0, 'medium' => 50.0, 'hard' => 0.0],
                'generator' => 'ExamOps-Agent-v0.1.0',
            ],
        ];
    }

    public function test_teacher_generates_exam_from_blueprint_for_owned_subject(): void
    {
        $teacher = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $subject = $this->createSubject($admin, $teacher, 'CS101');

        $q1 = $this->createQuestion($subject, $teacher, QuestionStatus::READY, 'easy');
        $q2 = $this->createQuestion($subject, $teacher, QuestionStatus::READY, 'medium');

        $questionsPayload = [
            ['question_id' => $q1->id, 'order' => 1, 'points' => 1.5],
            ['question_id' => $q2->id, 'order' => 2, 'points' => 2.5],
        ];

        $payload = $this->validBlueprintPayload($subject, $questionsPayload);

        $response = $this->actingAs($teacher)
            ->postJson('/api/v1/exams/from-blueprint', $payload)
            ->assertCreated();

        $response->assertJsonPath('data.title', $payload['title']);
        $response->assertJsonPath('data.subject_id', $subject->id);
        $response->assertJsonPath('data.total_points', '4.00');
        $response->assertJsonPath('data.questions_count', 2);
        $response->assertJsonPath('data.ai_generation_log.thread_id', $payload['thread_id']);
        $response->assertJsonPath('data.ai_generation_log.proposal_hash', $payload['proposal_hash']);
        $response->assertJsonPath('data.ai_generation_log.status', 'applied');

        $examId = $response->json('data.id');

        $this->assertDatabaseHas('exams', [
            'id' => $examId,
            'subject_id' => $subject->id,
            'created_by' => $teacher->id,
            'total_points' => 4.0,
        ]);

        $this->assertDatabaseHas('exam_questions', [
            'exam_id' => $examId,
            'question_id' => $q1->id,
            'order' => 1,
            'points' => 1.5,
        ]);

        $this->assertDatabaseHas('ai_generation_logs', [
            'thread_id' => $payload['thread_id'],
            'proposal_hash' => $payload['proposal_hash'],
            'generated_exam_id' => $examId,
            'status' => 'applied',
        ]);
    }

    public function test_admin_generates_exam_from_blueprint_for_any_subject(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $subject = $this->createSubject($admin, $teacher, 'MATH201');

        $q = $this->createQuestion($subject, $teacher, QuestionStatus::READY, 'easy');

        $payload = $this->validBlueprintPayload($subject, [
            ['question_id' => $q->id, 'order' => 1, 'points' => 10.0],
        ]);

        $this->actingAs($admin)
            ->postJson('/api/v1/exams/from-blueprint', $payload)
            ->assertCreated()
            ->assertJsonPath('data.total_points', '10.00');
    }

    public function test_teacher_cannot_generate_exam_for_unowned_subject_idor_forbidden(): void
    {
        $owner = User::factory()->teacher()->create();
        $attacker = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $subject = $this->createSubject($admin, $owner, 'SEC101');

        $q = $this->createQuestion($subject, $owner, QuestionStatus::READY, 'easy');

        $payload = $this->validBlueprintPayload($subject, [
            ['question_id' => $q->id, 'order' => 1, 'points' => 5.0],
        ]);

        $this->actingAs($attacker)
            ->postJson('/api/v1/exams/from-blueprint', $payload)
            ->assertForbidden();

        $this->assertDatabaseEmpty('ai_generation_logs');
        $this->assertDatabaseEmpty('exams');
    }

    public function test_duplicate_proposal_hash_in_same_thread_returns_409_conflict(): void
    {
        $teacher = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $subject = $this->createSubject($admin, $teacher, 'CS301');

        $q = $this->createQuestion($subject, $teacher, QuestionStatus::READY, 'easy');

        $payload = $this->validBlueprintPayload($subject, [
            ['question_id' => $q->id, 'order' => 1, 'points' => 5.0],
        ]);

        // First application: succeeds
        $this->actingAs($teacher)
            ->postJson('/api/v1/exams/from-blueprint', $payload)
            ->assertCreated();

        // Second application with identical (thread_id, proposal_hash): returns 409 Conflict
        $this->actingAs($teacher)
            ->postJson('/api/v1/exams/from-blueprint', $payload)
            ->assertStatus(409)
            ->assertJsonPath('error_code', 'DUPLICATE_PROPOSAL_APPLIED');
    }

    public function test_invalid_hash_or_missing_fields_validation_fails_422(): void
    {
        $teacher = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $subject = $this->createSubject($admin, $teacher, 'CS401');

        // Invalid hash (not 64 hex characters)
        $invalidPayload = [
            'thread_id' => 'thread_123',
            'prompt_hash' => 'invalid-hash-too-short',
            'proposal_hash' => 'not-hex',
            'subject_id' => $subject->id,
            'title' => 'Test',
            'duration_minutes' => 60,
            'pass_score' => 5.0,
            'shuffle_questions' => true,
            'shuffle_options' => true,
            'questions' => [],
        ];

        $this->actingAs($teacher)
            ->postJson('/api/v1/exams/from-blueprint', $invalidPayload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['prompt_hash', 'proposal_hash', 'questions']);
    }

    public function test_unready_question_or_question_from_different_subject_returns_422(): void
    {
        $teacher = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $subject = $this->createSubject($admin, $teacher, 'CS501');
        $otherSubject = $this->createSubject($admin, $teacher, 'OTHER501');

        // Question not ready (disabled)
        $disabledQ = $this->createQuestion($subject, $teacher, QuestionStatus::DISABLED);
        // Question in different subject
        $foreignQ = $this->createQuestion($otherSubject, $teacher, QuestionStatus::READY);

        $payloadDisabled = $this->validBlueprintPayload($subject, [
            ['question_id' => $disabledQ->id, 'order' => 1, 'points' => 5.0],
        ]);

        $this->actingAs($teacher)
            ->postJson('/api/v1/exams/from-blueprint', $payloadDisabled)
            ->assertUnprocessable()
            ->assertJsonPath('error_code', 'QUESTION_NOT_AVAILABLE');

        $payloadForeign = $this->validBlueprintPayload($subject, [
            ['question_id' => $foreignQ->id, 'order' => 1, 'points' => 5.0],
        ]);

        $this->actingAs($teacher)
            ->postJson('/api/v1/exams/from-blueprint', $payloadForeign)
            ->assertUnprocessable()
            ->assertJsonPath('error_code', 'QUESTION_NOT_AVAILABLE');
    }

    public function test_student_cannot_call_blueprint_generation_endpoint(): void
    {
        $student = User::factory()->student()->create();
        $admin = User::factory()->admin()->create();
        $subject = $this->createSubject($admin, null, 'STU101');

        $this->actingAs($student)
            ->postJson('/api/v1/exams/from-blueprint', ['subject_id' => $subject->id])
            ->assertForbidden();
    }

    public function test_unauthenticated_request_returns_401(): void
    {
        $this->postJson('/api/v1/exams/from-blueprint', [])
            ->assertUnauthorized();
    }

    public function test_readiness_review_returns_comprehensive_statistics_and_readiness_flag(): void
    {
        $teacher = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $subject = $this->createSubject($admin, $teacher, 'REVIEW101');

        $q1 = $this->createQuestion($subject, $teacher, QuestionStatus::READY, 'easy');
        $q2 = $this->createQuestion($subject, $teacher, QuestionStatus::READY, 'medium');

        $payload = $this->validBlueprintPayload($subject, [
            ['question_id' => $q1->id, 'order' => 1, 'points' => 4.0],
            ['question_id' => $q2->id, 'order' => 2, 'points' => 6.0],
        ]);

        $createResp = $this->actingAs($teacher)
            ->postJson('/api/v1/exams/from-blueprint', $payload)
            ->assertCreated();

        $examId = $createResp->json('data.id');

        $reviewResp = $this->actingAs($teacher)
            ->getJson("/api/v1/exams/{$examId}/readiness-review")
            ->assertOk();

        $reviewResp->assertJsonPath('data.exam_id', $examId);
        $reviewResp->assertJsonPath('data.is_ready_for_session', true);
        $reviewResp->assertJsonPath('data.total_questions', 2);
        $reviewResp->assertJsonPath('data.total_points', 10);
        $reviewResp->assertJsonPath('data.pass_score', 5);
        $reviewResp->assertJsonPath('data.difficulty_distribution.easy.count', 1);
        $reviewResp->assertJsonPath('data.difficulty_distribution.easy.percentage', 50);
        $reviewResp->assertJsonPath('data.difficulty_distribution.medium.count', 1);
        $reviewResp->assertJsonPath('data.difficulty_distribution.medium.percentage', 50);
        $reviewResp->assertJsonCount(2, 'data.topics_covered');
        $reviewResp->assertJsonPath('data.warnings', []);
    }

    public function test_readiness_review_returns_warnings_when_pass_score_exceeds_total_points(): void
    {
        $teacher = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $subject = $this->createSubject($admin, $teacher, 'WARN101');

        $q = $this->createQuestion($subject, $teacher, QuestionStatus::READY, 'easy');

        $payload = $this->validBlueprintPayload($subject, [
            ['question_id' => $q->id, 'order' => 1, 'points' => 2.0],
        ]);
        $payload['pass_score'] = 8.0; // pass_score 8 > total_points 2

        $createResp = $this->actingAs($teacher)
            ->postJson('/api/v1/exams/from-blueprint', $payload)
            ->assertCreated();

        $examId = $createResp->json('data.id');

        $reviewResp = $this->actingAs($teacher)
            ->getJson("/api/v1/exams/{$examId}/readiness-review")
            ->assertOk();

        $reviewResp->assertJsonPath('data.is_ready_for_session', true);
        $warnings = $reviewResp->json('data.warnings');
        $this->assertCount(1, $warnings);
        $this->assertStringContainsString('pass_score', $warnings[0]);
    }

    public function test_teacher_cannot_view_readiness_review_of_unowned_exam(): void
    {
        $owner = User::factory()->teacher()->create();
        $attacker = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $subject = $this->createSubject($admin, $owner, 'PRIV101');

        $q = $this->createQuestion($subject, $owner, QuestionStatus::READY, 'easy');
        $payload = $this->validBlueprintPayload($subject, [
            ['question_id' => $q->id, 'order' => 1, 'points' => 1.0],
        ]);

        $examId = $this->actingAs($owner)
            ->postJson('/api/v1/exams/from-blueprint', $payload)
            ->assertCreated()
            ->json('data.id');

        $this->actingAs($attacker)
            ->getJson("/api/v1/exams/{$examId}/readiness-review")
            ->assertForbidden();
    }
}
