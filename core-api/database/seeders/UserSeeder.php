<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Administrators
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

        User::updateOrCreate(
            ['email' => 'admin.tra@examplatform.local'],
            [
                'code' => 'AD0002',
                'name' => 'Nguyễn Thị Thanh Tra (Thanh tra Đào tạo)',
                'password' => 'Admin@123456',
                'role' => UserRole::ADMIN,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Teachers / Faculty
        User::updateOrCreate(
            ['email' => 'teacher@examplatform.local'],
            [
                'code' => 'GV0001',
                'name' => 'TS. Lê Hoàng Nam (Trưởng bộ môn Mạng & Kiến trúc)',
                'password' => 'Teacher@123456',
                'role' => UserRole::TEACHER,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'teacher.mai@examplatform.local'],
            [
                'code' => 'GV0002',
                'name' => 'ThS. Nguyễn Thị Mai (Giảng viên CSDL & Hệ thống thông tin)',
                'password' => 'Teacher@123456',
                'role' => UserRole::TEACHER,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'teacher.khoa@examplatform.local'],
            [
                'code' => 'GV0003',
                'name' => 'TS. Vũ Đình Khoa (Cán bộ Coi thi & An toàn thông tin)',
                'password' => 'Teacher@123456',
                'role' => UserRole::TEACHER,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 3. Students
        $students = [
            ['code' => 'SV20260001', 'name' => 'Nguyễn Văn An (Demo Student)', 'email' => 'student@examplatform.local'],
            ['code' => 'SV20260002', 'name' => 'Trần Thị Bích', 'email' => 'sv02@examplatform.local'],
            ['code' => 'SV20260003', 'name' => 'Lê Hoàng Cường', 'email' => 'sv03@examplatform.local'],
            ['code' => 'SV20260004', 'name' => 'Phạm Minh Đức', 'email' => 'sv04@examplatform.local'],
            ['code' => 'SV20260005', 'name' => 'Đỗ Thu Hà', 'email' => 'sv05@examplatform.local'],
            ['code' => 'SV20260006', 'name' => 'Hoàng Văn Hải', 'email' => 'sv06@examplatform.local'],
            ['code' => 'SV20260007', 'name' => 'Vũ Thị Hạnh', 'email' => 'sv07@examplatform.local'],
            ['code' => 'SV20260008', 'name' => 'Bùi Tuấn Kiệt', 'email' => 'sv08@examplatform.local'],
            ['code' => 'SV20260009', 'name' => 'Ngô Phương Linh', 'email' => 'sv09@examplatform.local'],
            ['code' => 'SV20260010', 'name' => 'Đặng Quang Long', 'email' => 'sv10@examplatform.local'],
            ['code' => 'SV20260011', 'name' => 'Dương Thúy Nga', 'email' => 'sv11@examplatform.local'],
            ['code' => 'SV20260012', 'name' => 'Lý Hữu Nghĩa', 'email' => 'sv12@examplatform.local'],
            ['code' => 'SV20260013', 'name' => 'Mai Xuân Phong', 'email' => 'sv13@examplatform.local'],
            ['code' => 'SV20260014', 'name' => 'Chu Hồng Quân', 'email' => 'sv14@examplatform.local'],
            ['code' => 'SV20260015', 'name' => 'Tạ Diễm Quỳnh', 'email' => 'sv15@examplatform.local'],
            ['code' => 'SV20260016', 'name' => 'Võ Minh Sơn', 'email' => 'sv16@examplatform.local'],
            ['code' => 'SV20260017', 'name' => 'Đoàn Bảo Trang', 'email' => 'sv17@examplatform.local'],
            ['code' => 'SV20260018', 'name' => 'Hà Quốc Tuấn', 'email' => 'sv18@examplatform.local'],
            ['code' => 'SV20260019', 'name' => 'Lâm Gia Uyên', 'email' => 'sv19@examplatform.local'],
            ['code' => 'SV20260020', 'name' => 'Phan Trọng Vũ', 'email' => 'sv20@examplatform.local'],
        ];

        foreach ($students as $stu) {
            User::updateOrCreate(
                ['email' => $stu['email']],
                [
                    'code' => $stu['code'],
                    'name' => $stu['name'],
                    'password' => 'Student@123456',
                    'role' => UserRole::STUDENT,
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
