<?php

namespace Database\Seeders;

use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Seeder;

class AcademicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teacherNam = User::where('email', 'teacher@examplatform.local')->firstOrFail();
        $teacherMai = User::where('email', 'teacher.mai@examplatform.local')->firstOrFail();

        // 1. Môn học IT4409 - Kiến trúc Máy tính
        $subArchitecture = Subject::updateOrCreate(
            ['code' => 'IT4409'],
            [
                'name' => 'Kiến trúc Máy tính',
                'description' => 'Môn học trang bị kiến trúc vi xử lý, tập lệnh x86/ARM, phân cấp bộ nhớ và hệ thống I/O.',
                'created_by' => $teacherNam->id,
                'owner_teacher_id' => $teacherNam->id,
            ]
        );

        Topic::updateOrCreate(
            ['subject_id' => $subArchitecture->id, 'name' => 'Bộ vi xử lý & Pipeline (CPU & ALU)'],
            ['description' => 'Cấu trúc khối điều khiển, thanh ghi, ALU và kỹ thuật đường ống lệnh Pipeline.']
        );
        Topic::updateOrCreate(
            ['subject_id' => $subArchitecture->id, 'name' => 'Phân cấp Bộ nhớ & Cache (Memory Hierarchy)'],
            ['description' => 'Nguyên lý cục bộ, tổ chức Cache L1/L2/L3, phân trang và bộ nhớ ảo.']
        );
        Topic::updateOrCreate(
            ['subject_id' => $subArchitecture->id, 'name' => 'Hệ thống Nhập/Xuất & Ngắt (I/O & Interrupts)'],
            ['description' => 'Bus hệ thống, cơ chế DMA, ngắt cứng và polling.']
        );

        // 2. Môn học IT3080 - Mạng Máy tính
        $subNetworking = Subject::updateOrCreate(
            ['code' => 'IT3080'],
            [
                'name' => 'Mạng Máy tính',
                'description' => 'Nguyên lý kiến trúc mạng truyền thông, mô hình phân tầng, giao thức Internet.',
                'created_by' => $teacherNam->id,
                'owner_teacher_id' => $teacherNam->id,
            ]
        );

        Topic::updateOrCreate(
            ['subject_id' => $subNetworking->id, 'name' => 'Mô hình OSI & Bộ giao thức TCP/IP'],
            ['description' => 'Tổng quan 7 tầng OSI, đóng gói dữ liệu và các giao thức nền tảng.']
        );
        Topic::updateOrCreate(
            ['subject_id' => $subNetworking->id, 'name' => 'Tầng Mạng & Địa chỉ IPv4/IPv6, Định tuyến'],
            ['description' => 'Chia mạng con CIDR/VLSM, NAT, giao thức OSPF, BGP.']
        );
        Topic::updateOrCreate(
            ['subject_id' => $subNetworking->id, 'name' => 'Tầng Giao vận & Ứng dụng (TCP, UDP, HTTP, DNS)'],
            ['description' => 'Bắt tay 3 bước, kiểm soát luồng/tắc nghẽn, TLS, HTTP/2 và DNS lookup.']
        );

        // 3. Môn học IT3290 - Cơ sở Dữ liệu
        $subDatabase = Subject::updateOrCreate(
            ['code' => 'IT3290'],
            [
                'name' => 'Cơ sở Dữ liệu',
                'description' => 'Hệ quản trị cơ sở dữ liệu quan hệ, đại số quan hệ, SQL chuẩn và tính toàn vẹn giao dịch.',
                'created_by' => $teacherMai->id,
                'owner_teacher_id' => $teacherMai->id,
            ]
        );

        Topic::updateOrCreate(
            ['subject_id' => $subDatabase->id, 'name' => 'Mô hình Thực thể (ERD) & Đại số Quan hệ'],
            ['description' => 'Thực thể, quan hệ, phép chiếu, chọn, kết nối (Join) trong đại số quan hệ.']
        );
        Topic::updateOrCreate(
            ['subject_id' => $subDatabase->id, 'name' => 'Ngôn ngữ SQL & Tối ưu hóa Chỉ mục (Indexes)'],
            ['description' => 'DML, DDL, B-Tree, Hash Index và kế hoạch thực thi EXPLAIN.']
        );
        Topic::updateOrCreate(
            ['subject_id' => $subDatabase->id, 'name' => 'Chuẩn hóa Dữ liệu (1NF-BCNF) & Giao dịch ACID'],
            ['description' => 'Phụ thuộc hàm, dạng chuẩn 1NF, 2NF, 3NF, BCNF, tính chất Atomicity, Consistency, Isolation, Durability.']
        );
    }
}
