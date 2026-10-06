<?php

namespace Tests\Unit;

use App\Enums\UserRole;
use PHPUnit\Framework\TestCase;

class RoleEnumTest extends TestCase
{
    /**
     * Test UserRole contains expected cases and string values.
     */
    public function test_user_role_enum_cases(): void
    {
        $this->assertSame('admin', UserRole::ADMIN->value);
        $this->assertSame('teacher', UserRole::TEACHER->value);
        $this->assertSame('student', UserRole::STUDENT->value);
    }

    /**
     * Test UserRole values helper returns all enum values.
     */
    public function test_user_role_values_list(): void
    {
        $this->assertSame(['admin', 'teacher', 'student'], UserRole::values());
    }

    /**
     * Test UserRole labels in Vietnamese.
     */
    public function test_user_role_labels(): void
    {
        $this->assertSame('Quản trị viên', UserRole::ADMIN->label());
        $this->assertSame('Giảng viên', UserRole::TEACHER->label());
        $this->assertSame('Sinh viên', UserRole::STUDENT->label());
    }
}
