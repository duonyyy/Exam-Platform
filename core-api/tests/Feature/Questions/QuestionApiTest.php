<?php

namespace Tests\Feature\Questions;

use App\Enums\QuestionStatus;
use App\Http\Resources\QuestionStudentResource;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class QuestionApiTest extends TestCase
{
    use RefreshDatabase;

    private function topic(User $creator, ?User $owner = null, string $code = 'CS101'): Topic
    {
        $subject = new Subject(['code' => $code, 'name' => 'Lập trình PHP']);
        $subject->created_by = $creator->id;
        $subject->owner_teacher_id = $owner?->id;
        $subject->save();

        return Topic::create(['subject_id' => $subject->id, 'name' => 'Hàm']);
    }

    private function payload(Topic $topic, string $type = 'single_choice'): array
    {
        return [
            'topic_id' => $topic->id,
            'question_text' => '2 + 2 = ?',
            'question_type' => $type,
            'options' => [
                ['id' => 'a', 'content' => '4'],
                ['id' => 'b', 'content' => '5'],
            ],
            'correct_answer' => 'a',
            'difficulty' => 'easy',
        ];
    }

    public function test_admin_creates_all_four_types_with_jsonb_and_server_owned_fields(): void
    {
        $admin = User::factory()->admin()->create();
        $topic = $this->topic($admin);
        $this->actingAs($admin);

        foreach (['single_choice', 'true_false', 'multiple_choice', 'short_answer'] as $type) {
            $payload = $this->payload($topic, $type);
            if ($type === 'multiple_choice') {
                $payload['correct_answer'] = ['a', 'b'];
            }
            if ($type === 'short_answer') {
                unset($payload['options']);
                $payload['correct_answer'] = 'bốn';
            }

            $id = $this->postJson('/api/v1/questions', $payload)->assertCreated()
                ->assertJsonPath('data.status', 'ready')
                ->assertJsonPath('data.created_by', $admin->id)
                ->assertJsonPath('data.correct_answer', $payload['correct_answer'])
                ->json('data.id');

            $question = Question::findOrFail($id);
            $this->assertSame($payload['correct_answer'], $question->correct_answer);
            $this->assertSame($payload['options'] ?? null, $question->options);
            $this->assertSame('jsonb', DB::selectOne("SELECT data_type FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'correct_answer'")->data_type);
        }

        $this->assertDatabaseCount('questions', 4);
    }

    public function test_teacher_can_create_only_in_owned_subject_and_cannot_spoof_server_fields(): void
    {
        $owner = User::factory()->teacher()->create();
        $other = User::factory()->teacher()->create();
        $topic = $this->topic($owner, $owner);
        $this->actingAs($other)->postJson('/api/v1/questions', $this->payload($topic))->assertForbidden();

        $this->actingAs($owner);
        $this->postJson('/api/v1/questions', $this->payload($topic))->assertCreated();
        foreach (['created_by' => $other->id, 'updated_by' => $other->id, 'status' => 'disabled', 'source' => 'import', 'subject_id' => $topic->subject_id] as $key => $value) {
            $this->postJson('/api/v1/questions', $this->payload($topic) + [$key => $value])
                ->assertUnprocessable()->assertJsonValidationErrors($key);
        }
        $this->assertDatabaseCount('questions', 1);
    }

    public function test_list_is_paginated_and_teacher_sees_only_owned_subject(): void
    {
        $admin = User::factory()->admin()->create();
        $owner = User::factory()->teacher()->create();
        $other = User::factory()->teacher()->create();
        $owned = $this->topic($admin, $owner);
        $foreign = $this->topic($admin, $other, 'CS102');
        $this->actingAs($admin);
        $this->postJson('/api/v1/questions', $this->payload($owned))->assertCreated();
        $this->postJson('/api/v1/questions', $this->payload($foreign))->assertCreated();
        $this->getJson('/api/v1/questions?per_page=1')->assertOk()
            ->assertJsonCount(1, 'data')->assertJsonPath('meta.total', 2);

        $this->actingAs($owner)->getJson('/api/v1/questions')->assertOk()
            ->assertJsonCount(1, 'data')->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.topic_id', $owned->id);
        DB::flushQueryLog();
        DB::enableQueryLog();
        try {
            $this->getJson('/api/v1/questions')->assertOk();
            $this->assertLessThanOrEqual(3, count(DB::getQueryLog()), 'Listing must not query per question.');
        } finally {
            DB::disableQueryLog();
        }
        $this->getJson('/api/v1/questions?per_page=101')->assertUnprocessable()->assertJsonValidationErrors('per_page');
    }

    public function test_question_routes_require_active_authorized_user_and_existing_resources(): void
    {
        $admin = User::factory()->admin()->create();
        $topic = $this->topic($admin);
        $payload = $this->payload($topic);
        $question = new Question($payload);
        $question->created_by = $admin->id;
        $question->status = QuestionStatus::READY;
        $question->source = 'manual';
        $question->save();
        $id = $question->id;
        $this->getJson('/api/v1/questions')->assertUnauthorized();
        $this->postJson('/api/v1/questions', $payload)->assertUnauthorized();
        $this->putJson('/api/v1/questions/999999', $payload)->assertUnauthorized();
        $this->patchJson('/api/v1/questions/999999/status', ['status' => 'disabled'])->assertUnauthorized();

        $this->actingAs(User::factory()->student()->create());
        $this->getJson('/api/v1/questions')->assertForbidden();
        $this->postJson('/api/v1/questions', $payload)->assertForbidden();
        $this->putJson("/api/v1/questions/{$id}", $payload)->assertForbidden();
        $this->patchJson("/api/v1/questions/{$id}/status", ['status' => 'disabled'])->assertForbidden();

        $this->actingAs(User::factory()->teacher()->inactive()->create());
        $this->getJson('/api/v1/questions')->assertForbidden()->assertJsonPath('error_code', 'ACCOUNT_INACTIVE');
        $this->postJson('/api/v1/questions', $payload)->assertForbidden();
        $this->putJson("/api/v1/questions/{$id}", $payload)->assertForbidden();
        $this->patchJson("/api/v1/questions/{$id}/status", ['status' => 'disabled'])->assertForbidden();

        $this->actingAs($admin);
        $this->postJson('/api/v1/questions', array_replace($this->payload($topic), ['topic_id' => 999999]))->assertNotFound();
        $this->putJson('/api/v1/questions/999999', $payload)->assertNotFound();
        $this->patchJson('/api/v1/questions/999999/status', ['status' => 'disabled'])->assertNotFound();
    }

    public function test_choice_validation_rejects_bad_shape_duplicate_and_unknown_answers(): void
    {
        $admin = User::factory()->admin()->create();
        $topic = $this->topic($admin);
        $this->actingAs($admin);
        $base = $this->payload($topic);

        $cases = [
            [[], 'topic_id'],
            [array_replace($base, ['question_type' => 'essay']), 'question_type'],
            [array_replace($base, ['difficulty' => 'extreme']), 'difficulty'],
            [array_replace($base, ['options' => [['id' => 'a', 'content' => '4']]]), 'options'],
            [array_replace($base, ['options' => [['id' => 'a', 'content' => '4'], ['id' => 'a', 'content' => '5']]]), 'options.1.id'],
            [array_replace($base, ['options' => [['id' => 'a', 'content' => '4', 'correct_answer' => 'a'], ['id' => 'b', 'content' => '5']]]), 'options.0'],
            [array_replace($base, ['correct_answer' => 'z']), 'correct_answer'],
            [array_replace($base, ['correct_answer' => ['a']]), 'correct_answer'],
            [array_replace($base, ['question_type' => 'multiple_choice', 'correct_answer' => []]), 'correct_answer'],
            [array_replace($base, ['question_type' => 'multiple_choice', 'correct_answer' => ['a', 'a']]), 'correct_answer.1'],
            [array_replace($base, ['question_type' => 'multiple_choice', 'correct_answer' => ['a', 'z']]), 'correct_answer'],
            [array_replace($base, ['question_type' => 'short_answer', 'correct_answer' => ['a']]), 'correct_answer'],
            [array_replace($base, ['question_type' => 'short_answer', 'options' => null]), 'options'],
        ];

        foreach ($cases as [$input, $error]) {
            $this->postJson('/api/v1/questions', $input)->assertUnprocessable()->assertJsonValidationErrors($error);
        }
        $this->assertDatabaseCount('questions', 0);
    }

    public function test_owner_can_edit_ready_question_and_toggle_availability(): void
    {
        $teacher = User::factory()->teacher()->create();
        $topic = $this->topic($teacher, $teacher);
        $this->actingAs($teacher);
        $id = $this->postJson('/api/v1/questions', $this->payload($topic))->assertCreated()->json('data.id');

        $edited = array_replace($this->payload($topic), ['question_text' => '3 + 3 = ?', 'correct_answer' => 'b']);
        $this->putJson("/api/v1/questions/{$id}", $edited)->assertOk()
            ->assertJsonPath('data.question_text', '3 + 3 = ?')
            ->assertJsonPath('data.correct_answer', 'b')
            ->assertJsonPath('data.updated_by', $teacher->id);
        $this->patchJson("/api/v1/questions/{$id}/status", ['status' => 'disabled'])->assertOk()
            ->assertJsonPath('data.status', 'disabled');
        $this->patchJson("/api/v1/questions/{$id}/status", ['status' => 'disabled'])->assertOk()
            ->assertJsonPath('data.status', 'disabled');
        $this->patchJson("/api/v1/questions/{$id}/status", ['status' => 'ready'])->assertOk()
            ->assertJsonPath('data.status', 'ready');
        $this->assertSame(QuestionStatus::READY, Question::findOrFail($id)->status);
    }

    public function test_foreign_teacher_cannot_edit_or_disable_question_and_server_fields_are_protected(): void
    {
        $teacher = User::factory()->teacher()->create();
        $other = User::factory()->teacher()->create();
        $topic = $this->topic($teacher, $teacher);
        $this->actingAs($teacher);
        $id = $this->postJson('/api/v1/questions', $this->payload($topic))->assertCreated()->json('data.id');

        $this->actingAs($other)->putJson("/api/v1/questions/{$id}", $this->payload($topic))->assertForbidden();
        $this->patchJson("/api/v1/questions/{$id}/status", ['status' => 'disabled'])->assertForbidden();

        $this->actingAs($teacher);
        $this->putJson("/api/v1/questions/{$id}", array_replace($this->payload($topic), ['correct_answer' => 'z']))
            ->assertUnprocessable()->assertJsonValidationErrors('correct_answer');
        $this->putJson("/api/v1/questions/{$id}", [])->assertUnprocessable()->assertJsonValidationErrors('question_text');
        $this->putJson("/api/v1/questions/{$id}", array_replace($this->payload($topic), ['topic_id' => 999999]))
            ->assertUnprocessable()->assertJsonValidationErrors('topic_id');
        $this->putJson("/api/v1/questions/{$id}", $this->payload($topic) + ['status' => 'disabled'])
            ->assertUnprocessable()->assertJsonValidationErrors('status');
        $this->patchJson("/api/v1/questions/{$id}/status", ['status' => 'approved'])
            ->assertUnprocessable()->assertJsonValidationErrors('status');
        $this->patchJson("/api/v1/questions/{$id}/status", [])->assertUnprocessable()->assertJsonValidationErrors('status');
        $this->patchJson("/api/v1/questions/{$id}/status", ['status' => 'disabled', 'correct_answer' => 'b'])
            ->assertUnprocessable()->assertJsonValidationErrors('correct_answer');
        $this->assertSame(QuestionStatus::READY, Question::findOrFail($id)->status);
    }

    public function test_question_already_attached_to_exam_cannot_be_edited_or_disabled(): void
    {
        $admin = User::factory()->admin()->create();
        $topic = $this->topic($admin);
        $this->actingAs($admin);
        $id = $this->postJson('/api/v1/questions', $this->payload($topic))->assertCreated()->json('data.id');

        $exam = new Exam([
            'title' => 'Kiểm tra PHP', 'duration_minutes' => 60, 'pass_score' => 1,
            'shuffle_questions' => false, 'shuffle_options' => false,
        ]);
        $exam->subject_id = $topic->subject_id;
        $exam->created_by = $admin->id;
        $exam->total_points = 0;
        $exam->save();
        $this->postJson("/api/v1/exams/{$exam->id}/questions", [
            'questions' => [['question_id' => $id, 'order' => 1, 'points' => 1]],
        ])->assertOk();

        $this->putJson("/api/v1/questions/{$id}", $this->payload($topic))
            ->assertConflict()->assertJsonPath('error_code', 'QUESTION_ALREADY_IN_EXAM');
        $this->patchJson("/api/v1/questions/{$id}/status", ['status' => 'disabled'])
            ->assertConflict()->assertJsonPath('error_code', 'QUESTION_ALREADY_IN_EXAM');
        $this->assertSame(QuestionStatus::READY, Question::findOrFail($id)->status);
    }

    public function test_status_migration_keeps_unreviewed_legacy_questions_unavailable(): void
    {
        $admin = User::factory()->admin()->create();
        $topic = $this->topic($admin);
        $ids = [];
        foreach (['draft', 'pending', 'rejected', 'approved'] as $legacy) {
            $question = new Question($this->payload($topic));
            $question->created_by = $admin->id;
            $question->status = QuestionStatus::READY;
            $question->source = 'manual';
            $question->save();
            DB::table('questions')->where('id', $question->id)->update(['status' => $legacy]);
            $ids[$legacy] = $question->id;
        }

        $migration = require database_path('migrations/2026_10_15_000001_switch_question_status_to_ready.php');
        $migration->up();

        foreach (['draft', 'pending', 'rejected'] as $legacy) {
            $this->assertDatabaseHas('questions', ['id' => $ids[$legacy], 'status' => 'disabled']);
        }
        $this->assertDatabaseHas('questions', ['id' => $ids['approved'], 'status' => 'ready']);
    }

    public function test_student_resource_excludes_sensitive_fields_at_all_json_levels(): void
    {
        $admin = User::factory()->admin()->create();
        $topic = $this->topic($admin);
        $this->actingAs($admin);
        $id = $this->postJson('/api/v1/questions', $this->payload($topic))->assertCreated()->json('data.id');
        $question = Question::findOrFail($id);
        $question->options = [['id' => 'a', 'content' => '4', 'grading_rubric' => 'secret'], ['id' => 'b', 'content' => ['correct_answer' => 'secret']]];
        $data = (new QuestionStudentResource($question))->resolve(Request::create('/'));
        $json = json_encode($data);
        foreach (['correct_answer', 'explanation', 'grading_rubric', 'rejection_reason'] as $secret) {
            $this->assertStringNotContainsString($secret, $json);
        }
        $this->assertSame([['id' => 'a', 'content' => '4'], ['id' => 'b', 'content' => '']], $data['options']);
    }

    public function test_soft_delete_hides_question_from_topic_count_and_foreign_keys_preserve_history(): void
    {
        $admin = User::factory()->admin()->create();
        $topic = $this->topic($admin);
        $this->actingAs($admin);
        $id = $this->postJson('/api/v1/questions', $this->payload($topic))->assertCreated()->json('data.id');
        Question::findOrFail($id)->delete();
        $this->assertSoftDeleted('questions', ['id' => $id]);
        $this->assertDatabaseHas('questions', ['id' => $id, 'created_by' => $admin->id]);
        $this->getJson("/api/v1/subjects/{$topic->subject_id}/topics")
            ->assertOk()->assertJsonPath('data.0.questions_count', 0);

        foreach ([fn () => DB::table('users')->where('id', $admin->id)->delete(), fn () => DB::table('topics')->where('id', $topic->id)->delete()] as $delete) {
            try {
                DB::transaction($delete);
                $this->fail('The historical foreign key should restrict hard deletion.');
            } catch (QueryException) {
                // PostgreSQL rejected the deletion and Laravel rolled back the savepoint.
            }
        }
    }
}
