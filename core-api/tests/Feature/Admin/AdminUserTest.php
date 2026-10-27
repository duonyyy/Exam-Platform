<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_users_with_filters_and_pagination(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->teacher()->count(3)->create();
        User::factory()->student()->count(5)->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/users?role=teacher&per_page=10');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('meta.total', 3);
    }

    public function test_unauthenticated_cannot_access_admin_user_endpoints(): void
    {
        $this->getJson('/api/v1/admin/users')
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_access_admin_user_endpoints(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $this->actingAs($teacher)
            ->getJson('/api/v1/admin/users')
            ->assertForbidden();

        $this->actingAs($student)
            ->getJson('/api/v1/admin/users')
            ->assertForbidden();
    }

    public function test_admin_can_create_a_new_user(): void
    {
        $admin = User::factory()->admin()->create();

        $payload = [
            'name' => 'Nguyen Van A',
            'email' => 'nguyenvana@example.com',
            'role' => 'teacher',
            'code' => 'GV9999',
            'password' => 'Password123!',
            'is_active' => true,
        ];

        $response = $this->actingAs($admin)
            ->postJson('/api/v1/admin/users', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.email', 'nguyenvana@example.com')
            ->assertJsonPath('data.role', 'teacher')
            ->assertJsonPath('data.code', 'GV9999');

        $this->assertDatabaseHas('users', [
            'email' => 'nguyenvana@example.com',
            'code' => 'GV9999',
            'role' => UserRole::TEACHER->value,
            'is_active' => true,
        ]);
    }

    public function test_admin_can_view_single_user(): void
    {
        $admin = User::factory()->admin()->create();
        $targetUser = User::factory()->student()->create(['name' => 'Test Target Student']);

        $response = $this->actingAs($admin)
            ->getJson("/api/v1/admin/users/{$targetUser->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $targetUser->id)
            ->assertJsonPath('data.name', 'Test Target Student');
    }

    public function test_admin_can_update_a_user(): void
    {
        $admin = User::factory()->admin()->create();
        $targetUser = User::factory()->student()->create();

        $response = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/users/{$targetUser->id}", [
                'name' => 'Updated Name',
                'is_active' => false,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Name')
            ->assertJsonPath('data.is_active', false);

        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'name' => 'Updated Name',
            'is_active' => false,
        ]);
    }

    public function test_admin_cannot_deactivate_themselves(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/users/{$admin->id}", [
                'is_active' => false,
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error_code', 'CANNOT_DEACTIVATE_SELF');

        $this->assertTrue((bool) $admin->fresh()->is_active);
    }

    public function test_admin_cannot_demote_themselves(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/users/{$admin->id}", [
                'role' => 'student',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error_code', 'CANNOT_DEMOTE_SELF');

        $this->assertEquals(UserRole::ADMIN, $admin->fresh()->role);
    }
}
