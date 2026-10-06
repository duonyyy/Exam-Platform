<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test student can register successfully with valid credentials.
     */
    public function test_student_can_register_successfully(): void
    {
        $payload = [
            'name' => 'Nguyễn Văn An',
            'email' => 'nguyenvanan@example.com',
            'password' => 'SecurePass@123',
            'password_confirmation' => 'SecurePass@123',
            'code' => 'SV20260099',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => [
                    'id',
                    'code',
                    'name',
                    'email',
                    'role',
                    'role_label',
                    'is_active',
                    'created_at',
                ],
                'token',
                'token_type',
            ],
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'nguyenvanan@example.com',
            'name' => 'Nguyễn Văn An',
            'role' => UserRole::STUDENT->value,
            'code' => 'SV20260099',
            'is_active' => true,
        ]);
    }

    /**
     * Test registration automatically assigns an auto-generated student code when omitted.
     */
    public function test_registration_generates_student_code_when_omitted(): void
    {
        $payload = [
            'name' => 'Trần Thị Bình',
            'email' => 'binhtran@example.com',
            'password' => 'SecurePass@123',
            'password_confirmation' => 'SecurePass@123',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(201);
        $code = $response->json('data.user.code');
        $this->assertNotNull($code);
        $this->assertStringStartsWith('SV', $code);
    }

    /**
     * Test registration rejects duplicate email addresses.
     */
    public function test_registration_fails_when_email_already_exists(): void
    {
        User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $payload = [
            'name' => 'Duplicate User',
            'email' => 'existing@example.com',
            'password' => 'SecurePass@123',
            'password_confirmation' => 'SecurePass@123',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    /**
     * Test registration rejects password confirmation mismatch.
     */
    public function test_registration_fails_when_password_confirmation_mismatches(): void
    {
        $payload = [
            'name' => 'Lê Văn Cường',
            'email' => 'cuong@example.com',
            'password' => 'SecurePass@123',
            'password_confirmation' => 'DifferentPass@123',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    /**
     * Test registration rejects password shorter than 8 characters.
     */
    public function test_registration_fails_when_password_is_too_short(): void
    {
        $payload = [
            'name' => 'Lê Văn Dũng',
            'email' => 'dung@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }
}
