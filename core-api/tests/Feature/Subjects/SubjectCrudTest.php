<?php

namespace Tests\Feature\Subjects;

use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubjectCrudTest extends TestCase
{
    use RefreshDatabase;

    private function subject(User $creator, ?User $owner = null, string $code = 'CS101', string $name = 'Lập trình PHP'): Subject
    {
        $subject = new Subject(['code' => $code, 'name' => $name]);
        $subject->created_by = $creator->id;
        $subject->owner_teacher_id = $owner?->id;
        $subject->save();

        return $subject;
    }

    public function test_authenticated_roles_can_list_search_and_view_subjects_with_pagination(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->subject($teacher);
        $this->subject($teacher, $teacher, 'MATH101', 'Toán cao cấp');

        $this->actingAs(User::factory()->student()->create())
            ->getJson('/api/v1/subjects?search=php&per_page=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $subject->id)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.topics_count', 0);

        $this->getJson("/api/v1/subjects/{$subject->id}")
            ->assertOk()
            ->assertJsonPath('data.code', 'CS101');
    }

    public function test_subject_routes_require_authentication(): void
    {
        $subject = $this->subject(User::factory()->teacher()->create());

        $this->getJson('/api/v1/subjects')->assertUnauthorized();
        $this->getJson("/api/v1/subjects/{$subject->id}")->assertUnauthorized();
        $this->postJson('/api/v1/subjects', [])->assertUnauthorized();
        $this->patchJson("/api/v1/subjects/{$subject->id}", [])->assertUnauthorized();
        $this->deleteJson("/api/v1/subjects/{$subject->id}")->assertUnauthorized();
    }

    public function test_teacher_creation_sets_ownership_and_rejects_spoofed_owner_or_creator(): void
    {
        $teacher = User::factory()->teacher()->create();
        $other = User::factory()->teacher()->create();
        $this->actingAs($teacher);

        $this->postJson('/api/v1/subjects', ['code' => 'CS101', 'name' => 'PHP'])
            ->assertCreated()
            ->assertJsonPath('data.created_by', $teacher->id)
            ->assertJsonPath('data.owner_teacher_id', $teacher->id);

        $this->postJson('/api/v1/subjects', [
            'code' => 'CS102', 'name' => 'PHP nâng cao', 'owner_teacher_id' => $other->id,
        ])->assertUnprocessable()->assertJsonValidationErrors('owner_teacher_id');
        $this->postJson('/api/v1/subjects', [
            'code' => 'CS102', 'name' => 'PHP nâng cao', 'owner_teacher_id' => null,
        ])->assertUnprocessable()->assertJsonValidationErrors('owner_teacher_id');

        $this->postJson('/api/v1/subjects', [
            'code' => 'CS102', 'name' => 'PHP nâng cao', 'created_by' => $other->id,
        ])->assertUnprocessable()->assertJsonValidationErrors('created_by');

        $this->assertDatabaseCount('subjects', 1);
    }

    public function test_admin_can_assign_and_reassign_only_active_teachers(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $other = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();
        $inactive = User::factory()->teacher()->create(['is_active' => false]);
        $this->actingAs($admin);

        $id = $this->postJson('/api/v1/subjects', [
            'code' => 'CS101', 'name' => 'PHP', 'owner_teacher_id' => $teacher->id,
        ])->assertCreated()->json('data.id');

        $this->patchJson("/api/v1/subjects/{$id}", ['owner_teacher_id' => $student->id])
            ->assertUnprocessable()->assertJsonValidationErrors('owner_teacher_id');
        $this->patchJson("/api/v1/subjects/{$id}", ['owner_teacher_id' => $inactive->id])
            ->assertUnprocessable()->assertJsonValidationErrors('owner_teacher_id');

        $this->patchJson("/api/v1/subjects/{$id}", ['owner_teacher_id' => $other->id])
            ->assertOk()->assertJsonPath('data.owner_teacher_id', $other->id)
            ->assertJsonPath('data.created_by', $admin->id);

        $this->actingAs($teacher)->patchJson("/api/v1/subjects/{$id}", ['name' => 'Vượt quyền'])
            ->assertForbidden();
        $this->assertDatabaseHas('subjects', ['id' => $id, 'name' => 'PHP']);
    }

    public function test_admin_can_leave_subject_unassigned_and_only_admin_can_edit_it(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $this->actingAs($admin);

        $id = $this->postJson('/api/v1/subjects', ['code' => 'CS101', 'name' => 'PHP'])
            ->assertCreated()->assertJsonPath('data.owner_teacher_id', null)->json('data.id');

        $this->actingAs($teacher)
            ->patchJson("/api/v1/subjects/{$id}", ['name' => 'Không hợp lệ'])
            ->assertForbidden();

        $this->actingAs($admin)
            ->patchJson("/api/v1/subjects/{$id}", ['owner_teacher_id' => $teacher->id])
            ->assertOk()->assertJsonPath('data.owner_teacher_id', $teacher->id);

        $this->actingAs($teacher)
            ->patchJson("/api/v1/subjects/{$id}", ['name' => 'Đã phân công'])
            ->assertOk()->assertJsonPath('data.name', 'Đã phân công');
    }

    public function test_teacher_can_update_and_delete_only_their_own_subject(): void
    {
        $owner = User::factory()->teacher()->create();
        $other = User::factory()->teacher()->create();
        $subject = $this->subject($owner, $owner);
        $this->actingAs($other);

        $this->patchJson("/api/v1/subjects/{$subject->id}", ['name' => 'Vượt quyền'])->assertForbidden();
        $this->deleteJson("/api/v1/subjects/{$subject->id}")->assertForbidden();
        $this->assertDatabaseHas('subjects', ['id' => $subject->id, 'name' => 'Lập trình PHP']);

        $this->actingAs($owner)
            ->patchJson("/api/v1/subjects/{$subject->id}", ['name' => 'PHP mới'])
            ->assertOk()->assertJsonPath('data.name', 'PHP mới');
        $this->patchJson("/api/v1/subjects/{$subject->id}", ['owner_teacher_id' => null])
            ->assertUnprocessable()->assertJsonValidationErrors('owner_teacher_id');
        $this->deleteJson("/api/v1/subjects/{$subject->id}")->assertNoContent();
        $this->assertDatabaseMissing('subjects', ['id' => $subject->id]);
    }

    public function test_students_cannot_write_and_inactive_users_cannot_read_or_write(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->subject($teacher, $teacher);
        $this->actingAs(User::factory()->student()->create());

        $this->postJson('/api/v1/subjects', ['code' => 'CS102', 'name' => 'Test'])->assertForbidden();
        $this->patchJson("/api/v1/subjects/{$subject->id}", ['name' => 'Test'])->assertForbidden();
        $this->deleteJson("/api/v1/subjects/{$subject->id}")->assertForbidden();

        $this->actingAs(User::factory()->teacher()->create(['is_active' => false]));
        $this->getJson('/api/v1/subjects')->assertForbidden();
        $this->postJson('/api/v1/subjects', ['code' => 'CS102', 'name' => 'Test'])->assertForbidden();
    }

    public function test_validation_and_missing_subject_return_expected_statuses(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->subject($teacher, $teacher);
        $this->actingAs($teacher);

        $this->postJson('/api/v1/subjects', ['code' => 'CS101'])->assertUnprocessable()
            ->assertJsonValidationErrors(['code', 'name']);
        $this->patchJson("/api/v1/subjects/{$subject->id}", ['name' => ''])
            ->assertUnprocessable()->assertJsonValidationErrors('name');
        $this->getJson('/api/v1/subjects/999999')->assertNotFound();
        $this->patchJson('/api/v1/subjects/999999', ['name' => 'X'])->assertNotFound();
        $this->deleteJson('/api/v1/subjects/999999')->assertNotFound();
    }

    public function test_subject_with_topics_cannot_be_deleted(): void
    {
        $teacher = User::factory()->teacher()->create();
        $subject = $this->subject($teacher, $teacher);
        Topic::create(['subject_id' => $subject->id, 'name' => 'Mảng']);

        $this->actingAs($teacher)->deleteJson("/api/v1/subjects/{$subject->id}")
            ->assertStatus(409)->assertJsonPath('error_code', 'SUBJECT_HAS_TOPICS');
        $this->assertDatabaseHas('subjects', ['id' => $subject->id]);
    }
}
