<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Register transient test routes protected by RoleMiddleware
        Route::get('/_test/admin-only', function () {
            return response()->json(['success' => true, 'message' => 'admin_ok']);
        })->middleware('role:admin');

        Route::get('/_test/teacher-or-admin', function () {
            return response()->json(['success' => true, 'message' => 'staff_ok']);
        })->middleware('role:teacher,admin');
    }

    /**
     * Unauthenticated request returns 401 UNAUTHENTICATED.
     */
    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/_test/admin-only');

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
            'error_code' => 'UNAUTHENTICATED',
        ]);
    }

    /**
     * User with insufficient role receives 403 FORBIDDEN_INSUFFICIENT_ROLE.
     */
    public function test_student_cannot_access_admin_endpoint(): void
    {
        $student = new User([
            'id' => 1,
            'role' => UserRole::STUDENT,
        ]);

        $response = $this->actingAs($student)->getJson('/_test/admin-only');

        $response->assertStatus(403);
        $response->assertJson([
            'success' => false,
            'error_code' => 'FORBIDDEN_INSUFFICIENT_ROLE',
        ]);
    }

    /**
     * User with matching role can access protected endpoint.
     */
    public function test_admin_can_access_admin_endpoint(): void
    {
        $admin = new User([
            'id' => 2,
            'role' => UserRole::ADMIN,
        ]);

        $response = $this->actingAs($admin)->getJson('/_test/admin-only');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'admin_ok',
        ]);
    }

    /**
     * Multi-role route allows any specified role (teacher,admin).
     */
    public function test_teacher_can_access_teacher_or_admin_endpoint(): void
    {
        $teacher = new User([
            'id' => 3,
            'role' => UserRole::TEACHER,
        ]);

        $response = $this->actingAs($teacher)->getJson('/_test/teacher-or-admin');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'staff_ok',
        ]);
    }
}
