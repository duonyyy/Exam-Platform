<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_dashboard_stats(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/dashboard-stats');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'users' => ['total', 'students', 'teachers', 'admins', 'inactive'],
                    'academics' => ['total_subjects', 'total_topics', 'total_questions'],
                    'exams' => ['total_blueprints', 'total_sessions', 'active_sessions'],
                    'attempts' => ['total_attempts', 'submitted', 'in_progress'],
                    'security_alerts_today',
                ],
            ]);
    }

    public function test_unauthenticated_cannot_access_dashboard_stats(): void
    {
        $this->getJson('/api/v1/admin/dashboard-stats')
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_access_dashboard_stats(): void
    {
        $teacher = User::factory()->teacher()->create();
        $student = User::factory()->student()->create();

        $this->actingAs($teacher)
            ->getJson('/api/v1/admin/dashboard-stats')
            ->assertForbidden();

        $this->actingAs($student)
            ->getJson('/api/v1/admin/dashboard-stats')
            ->assertForbidden();
    }
}
