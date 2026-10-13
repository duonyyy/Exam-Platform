<?php

namespace Tests\Feature\Topics;

use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class TopicApiTest extends TestCase
{
    use RefreshDatabase;

    private function subject(User $creator, ?User $owner = null): Subject
    {
        $subject = new Subject(['code' => 'CS101', 'name' => 'Lập trình PHP']);
        $subject->created_by = $creator->id;
        $subject->owner_teacher_id = $owner?->id;
        $subject->save();

        return $subject;
    }

    public function test_admin_can_create_and_list_topics_in_any_subject(): void
    {
        $teacher = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();
        $subject = $this->subject($teacher, $teacher);

        $this->actingAs($admin)->postJson("/api/v1/subjects/{$subject->id}/topics", [
            'name' => 'Mảng', 'description' => 'Cấu trúc dữ liệu',
        ])->assertCreated()->assertJsonPath('data.subject_id', $subject->id)
            ->assertJsonPath('data.name', 'Mảng')
            ->assertJsonPath('data.questions_count', 0);

        $this->getJson("/api/v1/subjects/{$subject->id}/topics")
            ->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.questions_count', 0)
            ->assertJsonPath('meta.total', 1);
        $this->assertDatabaseHas('topics', ['subject_id' => $subject->id, 'name' => 'Mảng']);
    }

    public function test_teacher_can_create_only_in_owned_subject_but_read_all_subjects(): void
    {
        $owner = User::factory()->teacher()->create();
        $other = User::factory()->teacher()->create();
        $subject = $this->subject($owner, $owner);

        $this->actingAs($other)
            ->postJson("/api/v1/subjects/{$subject->id}/topics", ['name' => 'Vượt quyền'])
            ->assertForbidden();
        $this->getJson("/api/v1/subjects/{$subject->id}/topics")->assertOk();

        $this->actingAs($owner)
            ->postJson("/api/v1/subjects/{$subject->id}/topics", ['name' => 'Hàm'])
            ->assertCreated();
        $this->getJson("/api/v1/subjects/{$subject->id}/topics")
            ->assertOk()->assertJsonPath('data.0.name', 'Hàm');
        $this->assertDatabaseCount('topics', 1);
    }

    public function test_student_can_read_but_cannot_create_topics(): void
    {
        $admin = User::factory()->admin()->create();
        $subject = $this->subject($admin);

        $this->actingAs(User::factory()->student()->create())
            ->getJson("/api/v1/subjects/{$subject->id}/topics")->assertOk();
        $this->postJson("/api/v1/subjects/{$subject->id}/topics", ['name' => 'Vượt quyền'])
            ->assertForbidden();
    }

    public function test_topic_routes_require_active_authenticated_user(): void
    {
        $admin = User::factory()->admin()->create();
        $subject = $this->subject($admin);
        $url = "/api/v1/subjects/{$subject->id}/topics";

        $this->getJson($url)->assertUnauthorized();
        $this->postJson($url, ['name' => 'Hàm'])->assertUnauthorized();

        $this->actingAs(User::factory()->teacher()->create(['is_active' => false]));
        $this->getJson($url)->assertForbidden()->assertJsonPath('error_code', 'ACCOUNT_INACTIVE');
        $this->postJson($url, ['name' => 'Hàm'])->assertForbidden();
    }

    public function test_validation_and_missing_subject_have_expected_status_and_shape(): void
    {
        $admin = User::factory()->admin()->create();
        $subject = $this->subject($admin);
        $this->actingAs($admin);
        $url = "/api/v1/subjects/{$subject->id}/topics";

        $this->postJson($url, [])->assertUnprocessable()
            ->assertJsonPath('message', 'The name field is required.')
            ->assertJsonValidationErrors('name');
        $this->postJson($url, ['name' => 'Hàm', 'subject_id' => 999999])
            ->assertUnprocessable()->assertJsonValidationErrors('subject_id');
        $this->getJson("{$url}?per_page=101")->assertUnprocessable()
            ->assertJsonValidationErrors('per_page');
        $this->getJson('/api/v1/subjects/999999/topics')->assertNotFound();
        $this->postJson('/api/v1/subjects/999999/topics', ['name' => 'Hàm'])->assertNotFound();
        $this->assertDatabaseCount('topics', 0);
    }

    public function test_list_is_paginated_and_counts_questions_when_phase_four_table_exists(): void
    {
        $admin = User::factory()->admin()->create();
        $subject = $this->subject($admin);
        $first = Topic::create(['subject_id' => $subject->id, 'name' => 'Hàm']);
        Topic::create(['subject_id' => $subject->id, 'name' => 'Mảng']);

        // Phase 4 migration is not yet present; create only the FK needed to verify withCount.
        Schema::create('questions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->restrictOnDelete();
        });

        try {
            DB::table('questions')->insert([
                ['topic_id' => $first->id],
                ['topic_id' => $first->id],
            ]);

            $this->actingAs($admin)
                ->getJson("/api/v1/subjects/{$subject->id}/topics?per_page=1&page=1")
                ->assertOk()->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.questions_count', 2)
                ->assertJsonPath('meta.total', 2)
                ->assertJsonPath('meta.current_page', 1);
            $this->getJson("/api/v1/subjects/{$subject->id}/topics?per_page=1&page=2")
                ->assertOk()->assertJsonPath('data.0.questions_count', 0);
        } finally {
            Schema::dropIfExists('questions');
        }
    }
}
