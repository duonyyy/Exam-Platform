<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Root Administrator
        User::updateOrCreate(
            ['email' => 'admin@examplatform.local'],
            [
                'code' => 'AD0001',
                'name' => 'System Administrator',
                'password' => 'Admin@123456',
                'role' => UserRole::ADMIN,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Demo Teacher
        User::updateOrCreate(
            ['email' => 'teacher@examplatform.local'],
            [
                'code' => 'GV0001',
                'name' => 'Demo Teacher',
                'password' => 'Teacher@123456',
                'role' => UserRole::TEACHER,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 3. Demo Student
        User::updateOrCreate(
            ['email' => 'student@examplatform.local'],
            [
                'code' => 'SV20260001',
                'name' => 'Demo Student',
                'password' => 'Student@123456',
                'role' => UserRole::STUDENT,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
