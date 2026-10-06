<?php

namespace Tests\Unit;

use App\Enums\UserRole;
use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    /**
     * Test User role helper methods correctly distinguish roles.
     */
    public function test_user_role_helper_methods(): void
    {
        $admin = new User(['role' => UserRole::ADMIN]);
        $teacher = new User(['role' => UserRole::TEACHER]);
        $student = new User(['role' => UserRole::STUDENT]);

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($admin->isTeacher());
        $this->assertFalse($admin->isStudent());

        $this->assertFalse($teacher->isAdmin());
        $this->assertTrue($teacher->isTeacher());
        $this->assertFalse($teacher->isStudent());

        $this->assertFalse($student->isAdmin());
        $this->assertFalse($student->isTeacher());
        $this->assertTrue($student->isStudent());
    }

    /**
     * Test User hides sensitive attributes from serialization.
     */
    public function test_user_hides_sensitive_attributes(): void
    {
        $user = new User([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'secret_hash',
            'remember_token' => 'token123',
            'role' => UserRole::STUDENT,
        ]);

        $array = $user->toArray();

        $this->assertArrayNotHasKey('password', $array);
        $this->assertArrayNotHasKey('remember_token', $array);
        $this->assertSame('John Doe', $array['name']);
        $this->assertSame('john@example.com', $array['email']);
    }
}
