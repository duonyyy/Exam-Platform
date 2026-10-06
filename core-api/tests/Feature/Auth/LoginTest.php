<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user can log in with valid credentials and receives a Sanctum bearer token.
     */
    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'student@examplatform.local',
            'password' => Hash::make('CorrectPassword@123'),
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'student@examplatform.local',
            'password' => 'CorrectPassword@123',
            'device_name' => 'Chrome Windows',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => [
                    'id',
                    'email',
                    'role',
                    'is_active',
                ],
                'token',
                'token_type',
            ],
        ]);
        $this->assertSame('student@examplatform.local', $response->json('data.user.email'));
        $this->assertNotEmpty($response->json('data.token'));
    }

    /**
     * Test login fails with 401 when given an invalid password.
     */
    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'student@examplatform.local',
            'password' => Hash::make('CorrectPassword@123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'student@examplatform.local',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
            'error_code' => 'INVALID_CREDENTIALS',
        ]);
    }

    /**
     * Test login fails with 401 when email does not exist.
     */
    public function test_login_fails_with_non_existent_email(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'nonexistent@examplatform.local',
            'password' => 'AnyPassword@123',
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
            'error_code' => 'INVALID_CREDENTIALS',
        ]);
    }

    /**
     * Test login is blocked with 403 when user account is deactivated.
     */
    public function test_login_fails_when_account_is_deactivated(): void
    {
        User::factory()->inactive()->create([
            'email' => 'blocked@examplatform.local',
            'password' => Hash::make('CorrectPassword@123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'blocked@examplatform.local',
            'password' => 'CorrectPassword@123',
        ]);

        $response->assertStatus(403);
        $response->assertJson([
            'success' => false,
            'error_code' => 'ACCOUNT_INACTIVE',
        ]);
    }

    /**
     * Test login validation fails with 422 when required fields are missing.
     */
    public function test_login_fails_validation_when_fields_are_missing(): void
    {
        $response = $this->postJson('/api/v1/auth/login', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email', 'password']);
    }

    /**
     * Test rate limiting blocks requests after 5 consecutive attempts per minute.
     */
    public function test_login_rate_limiting_blocks_after_too_many_attempts(): void
    {
        User::factory()->create([
            'email' => 'target@examplatform.local',
            'password' => Hash::make('Password@123'),
        ]);

        // Attempt 5 failed logins
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', [
                'email' => 'target@examplatform.local',
                'password' => 'WrongPassword',
            ]);
        }

        // 6th attempt must trigger HTTP 429 Too Many Requests
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'target@examplatform.local',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(429);
    }
}
