<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InactiveTokenTest extends TestCase
{
    use RefreshDatabase;

    public function test_token_issued_before_deactivation_cannot_access_protected_routes(): void
    {
        $teacher = User::factory()->teacher()->create();
        $token = $teacher->createToken('teacher_session')->plainTextToken;

        $this->withToken($token)->getJson('/api/v1/auth/me')->assertOk();

        $teacher->update(['is_active' => false]);

        $this->getJson('/api/v1/auth/me')
            ->assertForbidden()->assertJsonPath('error_code', 'ACCOUNT_INACTIVE');
        $this->getJson('/api/v1/subjects')
            ->assertForbidden()->assertJsonPath('error_code', 'ACCOUNT_INACTIVE');
        $this->getJson('/api/v1/subjects/999999')
            ->assertForbidden()->assertJsonPath('error_code', 'ACCOUNT_INACTIVE');
        $this->postJson('/api/v1/auth/logout')
            ->assertForbidden()->assertJsonPath('error_code', 'ACCOUNT_INACTIVE');

        // Blocking is checked per request; deactivation does not yet delete stored tokens.
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_direct_database_deactivation_is_also_blocked(): void
    {
        $student = User::factory()->student()->create();
        $token = $student->createToken('student_session')->plainTextToken;
        User::query()->whereKey($student->id)->update(['is_active' => false]);

        $this->withToken($token)->getJson('/api/v1/auth/me')
            ->assertForbidden()->assertJsonPath('error_code', 'ACCOUNT_INACTIVE');
    }

    public function test_bearer_token_expires_after_eight_hours(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('session')->plainTextToken;

        $this->assertSame(480, config('sanctum.expiration'));
        $this->travel(481)->minutes();

        try {
            $this->withToken($token)->getJson('/api/v1/auth/me')->assertUnauthorized();
        } finally {
            $this->travelBack();
        }
    }

    public function test_missing_token_is_still_unauthorized_and_public_health_is_available(): void
    {
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
        $this->getJson('/api/v1/health')->assertOk();
    }
}
