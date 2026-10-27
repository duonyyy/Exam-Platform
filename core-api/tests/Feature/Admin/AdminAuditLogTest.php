<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_audit_logs(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/audit-logs');

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'meta' => ['total', 'per_page'],
            ]);
    }

    public function test_unauthenticated_cannot_access_audit_logs(): void
    {
        $this->getJson('/api/v1/admin/audit-logs')
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_access_audit_logs(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $this->actingAs($teacher)
            ->getJson('/api/v1/admin/audit-logs')
            ->assertForbidden();

        $this->actingAs($student)
            ->getJson('/api/v1/admin/audit-logs')
            ->assertForbidden();
    }
}
