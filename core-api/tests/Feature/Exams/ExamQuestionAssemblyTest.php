<?php

namespace Tests\Feature\Exams;

use App\Enums\QuestionStatus;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ExamQuestionAssemblyTest extends TestCase
{
    use RefreshDatabase;

    private function subject(User $creator, ?User $owner, string $code): Subject
    {
        $subject = new Subject(['code' => $code, 'name' => $code]);
        $subject->created_by = $creator->id;
        $subject->owner_teacher_id = $owner?->id;
        $subject->save();

        return $subject;
    }

    private function question(Subject $subject, User $author, QuestionStatus $status = QuestionStatus::READY): Question
    {
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Topic '.uniqid()]);
        $question = new Question([
            'topic_id' => $topic->id,
            'question_text' => '2 + 2 = ?',
            'question_type' => 'single_choice',
            'options' => [['id' => 'a', 'content' => '4'], ['id' => 'b', 'content' => '5']],
            'correct_answer' => 'a',
            'difficulty' => 'easy',
        ]);
        $question->created_by = $author->id;
        $question->status = $status;
        $question->source = 'manual';
        $question->save();

        return $question;
    }

    private function examPayload(Subject $subject): array
    {
        return [
            'subject_id' => $subject->id,
            'title' => 'Đề PHP',
            'duration_minutes' => 60,
            'pass_score' => 5,
            'shuffle_questions' => true,
            'shuffle_options' => false,
        ];
    }

    private function createExam(Subject $subject, User $actor): int
    {
        return $this->actingAs($actor)->postJson('/api/v1/exams', $this->examPayload($subject))
            ->assertCreated()->json('data.id');
    }

    public function test_teacher_creates_and_lists_only_owned_exams_with_pagination(): void
    {
        $teacher = User::factory()->teacher()->create();
        $other = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $owned = $this->subject($admin, $teacher, 'PHP');
        $foreign = $this->subject($admin, $other, 'SQL');

        $id = $this->createExam($owned, $teacher);
        $this->assertDatabaseHas('exams', ['id' => $id, 'created_by' => $teacher->id, 'total_points' => 0]);
        $this->actingAs($teacher)->getJson('/api/v1/exams')->assertOk()
            ->assertJsonCount(1, 'data')->assertJsonPath('data.0.questions_count', 0)
            ->assertJsonPath('data.0.pass_score', '5.00');

        $this->actingAs($teacher)->postJson('/api/v1/exams', $this->examPayload($foreign))->assertForbidden();
        $this->createExam($foreign, $admin);
        $this->actingAs($teacher)->getJson('/api/v1/exams')->assertJsonPath('meta.total', 1);
        $this->actingAs($admin)->getJson('/api/v1/exams?per_page=1')->assertOk()
            ->assertJsonCount(1, 'data')->assertJsonPath('meta.total', 2);
        $this->getJson('/api/v1/exams?per_page=101')->assertUnprocessable()->assertJsonValidationErrors('per_page');
    }

    public function test_create_and_attach_routes_enforce_auth_role_scope_validation_and_not_found(): void
    {
        $admin = User::factory()->admin()->create();
        $owner = User::factory()->teacher()->create();
        $other = User::factory()->teacher()->create();
        $subject = $this->subject($admin, $owner, 'PHP');
        $payload = $this->examPayload($subject);

        $this->getJson('/api/v1/exams')->assertUnauthorized();
        $this->postJson('/api/v1/exams', $payload)->assertUnauthorized();
        $this->postJson('/api/v1/exams/999999/questions', ['questions' => []])->assertUnauthorized();
        $id = $this->createExam($subject, $owner);
        $this->actingAs(User::factory()->student()->create());
        $this->getJson('/api/v1/exams')->assertForbidden();
        $this->postJson('/api/v1/exams', $payload)->assertForbidden();
        $this->postJson("/api/v1/exams/{$id}/questions", ['questions' => []])->assertForbidden();

        $this->actingAs($owner)->postJson('/api/v1/exams', [])->assertUnprocessable()
            ->assertJsonValidationErrors(['subject_id', 'title', 'duration_minutes', 'pass_score']);
        foreach (['created_by' => $other->id, 'total_points' => 100, 'questions' => []] as $key => $value) {
            $this->postJson('/api/v1/exams', $payload + [$key => $value])
                ->assertUnprocessable()->assertJsonValidationErrors($key);
        }
        $this->postJson('/api/v1/exams', array_replace($payload, ['duration_minutes' => 0, 'pass_score' => -1]))
            ->assertUnprocessable()->assertJsonValidationErrors(['duration_minutes', 'pass_score']);
        $this->postJson('/api/v1/exams', array_replace($payload, ['subject_id' => 999999]))->assertNotFound();

        $this->postJson('/api/v1/exams/999999/questions', ['questions' => []])->assertNotFound();
        $this->actingAs($other)->postJson("/api/v1/exams/{$id}/questions", [
            'questions' => [['question_id' => 1, 'order' => 1, 'points' => 1]],
        ])->assertForbidden();
        $this->actingAs($owner)->postJson("/api/v1/exams/{$id}/questions", ['questions' => []])
            ->assertUnprocessable()->assertJsonValidationErrors('questions');
        $this->postJson("/api/v1/exams/{$id}/questions", [
            'questions' => [['question_id' => 1, 'order' => 1, 'points' => 0]],
        ])->assertUnprocessable()->assertJsonValidationErrors('questions.0.points');
    }

    public function test_batch_attach_sums_points_and_identical_retry_is_idempotent(): void
    {
        $admin = User::factory()->admin()->create();
        $subject = $this->subject($admin, null, 'PHP');
        $first = $this->question($subject, $admin);
        $second = $this->question($subject, $admin);
        $id = $this->createExam($subject, $admin);
        $body = ['questions' => [
            ['question_id' => $first->id, 'order' => 1, 'points' => '1.25'],
            ['question_id' => $second->id, 'order' => 2, 'points' => '2.75'],
        ]];

        $this->postJson("/api/v1/exams/{$id}/questions", $body)->assertOk()
            ->assertJsonPath('data.total_points', '4.00')->assertJsonPath('data.questions_count', 2);
        $this->postJson("/api/v1/exams/{$id}/questions", $body)->assertOk()
            ->assertJsonPath('data.total_points', '4.00');
        $this->assertDatabaseCount('exam_questions', 2);
        $this->assertSame('4.00', Exam::findOrFail($id)->total_points);

        $this->putJson("/api/v1/questions/{$first->id}", [])->assertUnprocessable();
        $this->patchJson("/api/v1/questions/{$first->id}/status", ['status' => 'disabled'])
            ->assertConflict()->assertJsonPath('error_code', 'QUESTION_ALREADY_IN_EXAM');
    }

    public function test_reassignment_immediately_revokes_teacher_assembly_access(): void
    {
        $admin = User::factory()->admin()->create();
        $owner = User::factory()->teacher()->create();
        $newOwner = User::factory()->teacher()->create();
        $subject = $this->subject($admin, $owner, 'PHP');
        $question = $this->question($subject, $admin);
        $id = $this->createExam($subject, $owner);
        $subject->owner_teacher_id = $newOwner->id;
        $subject->save();

        $body = ['questions' => [['question_id' => $question->id, 'order' => 1, 'points' => 1]]];
        $this->actingAs($owner)->postJson("/api/v1/exams/{$id}/questions", $body)->assertForbidden();
        $this->getJson('/api/v1/exams')->assertJsonPath('meta.total', 0);
        $this->actingAs($newOwner)->postJson("/api/v1/exams/{$id}/questions", $body)->assertOk();
        $this->assertDatabaseCount('exam_questions', 1);
    }

    public function test_batch_is_atomic_and_rejects_unavailable_questions_and_conflicts(): void
    {
        $admin = User::factory()->admin()->create();
        $subject = $this->subject($admin, null, 'PHP');
        $foreign = $this->subject($admin, null, 'SQL');
        $ready = $this->question($subject, $admin);
        $secondReady = $this->question($subject, $admin);
        $disabled = $this->question($subject, $admin, QuestionStatus::DISABLED);
        $crossSubject = $this->question($foreign, $admin);
        $deleted = $this->question($subject, $admin);
        $deleted->delete();
        $id = $this->createExam($subject, $admin);

        foreach ([$disabled->id, $crossSubject->id, $deleted->id, 999999] as $badId) {
            $this->postJson("/api/v1/exams/{$id}/questions", ['questions' => [
                ['question_id' => $ready->id, 'order' => 1, 'points' => 2],
                ['question_id' => $badId, 'order' => 2, 'points' => 3],
            ]])->assertUnprocessable()->assertJsonPath('error_code', 'QUESTION_NOT_AVAILABLE');
            $this->assertDatabaseCount('exam_questions', 0);
            $this->assertSame('0.00', Exam::findOrFail($id)->total_points);
        }

        $this->postJson("/api/v1/exams/{$id}/questions", ['questions' => [
            ['question_id' => $ready->id, 'order' => 1, 'points' => 2],
        ]])->assertOk();
        $this->postJson("/api/v1/exams/{$id}/questions", ['questions' => [
            ['question_id' => $ready->id, 'order' => 1, 'points' => 3],
        ]])->assertConflict()->assertJsonPath('error_code', 'EXAM_QUESTION_CONFLICT');
        $this->postJson("/api/v1/exams/{$id}/questions", ['questions' => [
            ['question_id' => $secondReady->id, 'order' => 1, 'points' => 1],
        ]])->assertConflict()->assertJsonPath('error_code', 'EXAM_QUESTION_CONFLICT');
        $this->postJson("/api/v1/exams/{$id}/questions", ['questions' => [
            ['question_id' => $ready->id, 'order' => 1, 'points' => 2],
            ['question_id' => $ready->id, 'order' => 2, 'points' => 2],
        ]])->assertUnprocessable()->assertJsonValidationErrors('questions.0.question_id');
        $this->assertDatabaseCount('exam_questions', 1);
    }

    public function test_database_constraints_preserve_points_and_history(): void
    {
        $admin = User::factory()->admin()->create();
        $subject = $this->subject($admin, null, 'PHP');
        $question = $this->question($subject, $admin);
        $id = $this->createExam($subject, $admin);
        $this->postJson("/api/v1/exams/{$id}/questions", ['questions' => [
            ['question_id' => $question->id, 'order' => 1, 'points' => 1],
        ]])->assertOk();

        foreach ([
            fn () => DB::table('exam_questions')->where('exam_id', $id)->update(['points' => 0]),
            fn () => DB::table('exam_questions')->where('exam_id', $id)->update(['order' => 0]),
            fn () => DB::table('questions')->where('id', $question->id)->delete(),
            fn () => DB::table('subjects')->where('id', $subject->id)->delete(),
        ] as $invalidWrite) {
            try {
                DB::transaction($invalidWrite);
                $this->fail('PostgreSQL must reject invalid exam data.');
            } catch (QueryException) {
                // Each failed statement rolls back to Laravel's savepoint.
            }
        }
    }

    public function test_aggregate_overflow_rolls_back_the_entire_batch(): void
    {
        $admin = User::factory()->admin()->create();
        $subject = $this->subject($admin, null, 'PHP');
        $first = $this->question($subject, $admin);
        $second = $this->question($subject, $admin);
        $id = $this->createExam($subject, $admin);

        $this->postJson("/api/v1/exams/{$id}/questions", ['questions' => [
            ['question_id' => $first->id, 'order' => 1, 'points' => 600000],
            ['question_id' => $second->id, 'order' => 2, 'points' => 600000],
        ]])->assertUnprocessable()->assertJsonPath('error_code', 'EXAM_TOTAL_POINTS_TOO_HIGH');
        $this->assertDatabaseCount('exam_questions', 0);
        $this->assertSame('0.00', Exam::findOrFail($id)->total_points);
    }
}
