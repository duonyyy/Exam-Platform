<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test authenticated user can retrieve their profile details.
     */
    public function test_authenticated_user_can_fetch_their_profile(): void
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@examplatform.local',
            'name' => 'Administrator',
        ]);

        $token = $admin->createToken('admin_session')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $admin->id,
                    'email' => 'admin@examplatform.local',
                    'name' => 'Administrator',
                    'role' => 'admin',
                    'role_label' => 'Quản trị viên',
                    'is_active' => true,
                ],
            ],
        ]);
    }

    /**
     * Test unauthenticated request cannot access me endpoint.
     */
    public function test_unauthenticated_user_cannot_access_me_endpoint(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
    }
}
