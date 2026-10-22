<?php

namespace Database\Seeders;

use App\Enums\QuestionStatus;
use App\Enums\QuestionType;
use App\Models\Question;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teacherNam = User::where('email', 'teacher@examplatform.local')->firstOrFail();
        $teacherMai = User::where('email', 'teacher.mai@examplatform.local')->firstOrFail();

        // 1. Topic: CPU & Pipeline
        $topicCpu = Topic::where('name', 'like', '%CPU%')->firstOrFail();
        $topicMemory = Topic::where('name', 'like', '%Cache%')->firstOrFail();
        $topicIo = Topic::where('name', 'like', '%Nhập/Xuất%')->firstOrFail();

        // 2. Topic: Mạng máy tính
        $topicOsi = Topic::where('name', 'like', '%Mô hình OSI%')->firstOrFail();
        $topicIp = Topic::where('name', 'like', '%Tầng Mạng%')->firstOrFail();
        $topicTransport = Topic::where('name', 'like', '%Tầng Giao vận%')->firstOrFail();

        // 3. Topic: Cơ sở dữ liệu
        $topicSql = Topic::where('name', 'like', '%Ngôn ngữ SQL%')->firstOrFail();
        $topicAcid = Topic::where('name', 'like', '%Chuẩn hóa%')->firstOrFail();

        // --- NHÓM 1: CÂU HỎI SINGLE CHOICE ---
        Question::updateOrCreate(
            ['question_text' => 'CPU là từ viết tắt của cụm từ tiếng Anh nào sau đây?'],
            [
                'topic_id' => $topicCpu->id,
                'question_type' => QuestionType::SINGLE_CHOICE,
                'difficulty' => 'easy',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'Central Processing Unit'],
                    ['id' => 'opt_b', 'content' => 'Computer Personal Unit'],
                    ['id' => 'opt_c', 'content' => 'Control Processing Unit'],
                    ['id' => 'opt_d', 'content' => 'Central Power Utility'],
                ],
                'correct_answer' => 'opt_a',
                'explanation' => 'CPU là viết tắt của Central Processing Unit (Bộ xử lý trung tâm của máy tính).',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Trong phân cấp bộ nhớ máy tính, loại bộ nhớ nào có tốc độ truy xuất nhanh nhất?'],
            [
                'topic_id' => $topicMemory->id,
                'question_type' => QuestionType::SINGLE_CHOICE,
                'difficulty' => 'medium',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'Tập thanh ghi trong vi xử lý (Registers)'],
                    ['id' => 'opt_b', 'content' => 'Bộ nhớ đệm cấp 1 (L1 Cache)'],
                    ['id' => 'opt_c', 'content' => 'Bộ nhớ truy xuất ngẫu nhiên (RAM)'],
                    ['id' => 'opt_d', 'content' => 'Ổ lưu trữ thể rắn (NVMe SSD)'],
                ],
                'correct_answer' => 'opt_a',
                'explanation' => 'Thanh ghi nằm ngay trong nhân CPU và hoạt động ở xung nhịp CPU, có độ trễ dưới 1 chu kỳ clock.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Mục đích cốt lõi của kỹ thuật đường ống lệnh (Instruction Pipelining) trong CPU là gì?'],
            [
                'topic_id' => $topicCpu->id,
                'question_type' => QuestionType::SINGLE_CHOICE,
                'difficulty' => 'hard',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'Giảm tổng thời gian trễ thực thi (Latency) của từng câu lệnh đơn lẻ'],
                    ['id' => 'opt_b', 'content' => 'Tăng thông lượng (Throughput) thực thi lệnh bằng cách gối đầu các giai đoạn thực thi'],
                    ['id' => 'opt_c', 'content' => 'Tăng dung lượng lưu trữ của thanh ghi chương trình'],
                    ['id' => 'opt_d', 'content' => 'Loại bỏ hoàn toàn các xung đột rẽ nhánh trong mã nguồn'],
                ],
                'correct_answer' => 'opt_b',
                'explanation' => 'Pipeline không làm giảm thời gian thực thi của một lệnh đơn, mà làm tăng số lượng lệnh hoàn thành trên một đơn vị thời gian (Throughput).',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Địa chỉ MAC (Media Access Control) hoạt động tại tầng nào trong mô hình 7 tầng OSI?'],
            [
                'topic_id' => $topicOsi->id,
                'question_type' => QuestionType::SINGLE_CHOICE,
                'difficulty' => 'easy',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'Tầng 1 - Vật lý (Physical Layer)'],
                    ['id' => 'opt_b', 'content' => 'Tầng 2 - Liên kết dữ liệu (Data Link Layer)'],
                    ['id' => 'opt_c', 'content' => 'Tầng 3 - Mạng (Network Layer)'],
                    ['id' => 'opt_d', 'content' => 'Tầng 4 - Giao vận (Transport Layer)'],
                ],
                'correct_answer' => 'opt_b',
                'explanation' => 'Địa chỉ vật lý MAC là định danh ở tầng Data Link (Layer 2) dùng trong mạng cục bộ Ethernet/Wi-Fi.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Giao thức nào sau đây hoạt động theo mô hình phi kết nối (Connectionless) và không đảm bảo độ tin cậy vận chuyển?'],
            [
                'topic_id' => $topicTransport->id,
                'question_type' => QuestionType::SINGLE_CHOICE,
                'difficulty' => 'easy',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'TCP (Transmission Control Protocol)'],
                    ['id' => 'opt_b', 'content' => 'UDP (User Datagram Protocol)'],
                    ['id' => 'opt_c', 'content' => 'HTTP (Hypertext Transfer Protocol)'],
                    ['id' => 'opt_d', 'content' => 'BGP (Border Gateway Protocol)'],
                ],
                'correct_answer' => 'opt_b',
                'explanation' => 'UDP không thực hiện bắt tay và không kiểm soát xác nhận gói tin, phù hợp cho streaming và gaming.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Cổng mặc định (Well-known Port) của giao thức duyệt web an toàn HTTPS là bao nhiêu?'],
            [
                'topic_id' => $topicTransport->id,
                'question_type' => QuestionType::SINGLE_CHOICE,
                'difficulty' => 'easy',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'Port 80'],
                    ['id' => 'opt_b', 'content' => 'Port 8080'],
                    ['id' => 'opt_c', 'content' => 'Port 443'],
                    ['id' => 'opt_d', 'content' => 'Port 22'],
                ],
                'correct_answer' => 'opt_c',
                'explanation' => 'HTTP dùng port 80, HTTPS dùng port 443, SSH dùng port 22.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Cơ chế DMA (Direct Memory Access) mang lại lợi ích nổi bật nào trong kiến trúc máy tính?'],
            [
                'topic_id' => $topicIo->id,
                'question_type' => QuestionType::SINGLE_CHOICE,
                'difficulty' => 'medium',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'Cho phép thiết bị I/O truyền dữ liệu trực tiếp với RAM mà không cần CPU can thiệp từng byte'],
                    ['id' => 'opt_b', 'content' => 'Tăng gấp đôi dung lượng bộ nhớ khả dụng của hệ thống'],
                    ['id' => 'opt_c', 'content' => 'Ngăn chặn hoàn toàn mọi xung đột bộ nhớ giữa các ứng dụng'],
                    ['id' => 'opt_d', 'content' => 'Loại bỏ hoàn toàn sự cần thiết của cơ chế ngắt cứng'],
                ],
                'correct_answer' => 'opt_a',
                'explanation' => 'DMA giải phóng vi xử lý khỏi việc luân chuyển khối lượng dữ liệu lớn giữa thiết bị ngoại vi và RAM.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Trong đại số quan hệ, phép toán nào dùng để trích chọn các cột mong muốn từ một bảng?'],
            [
                'topic_id' => $topicSql->id,
                'question_type' => QuestionType::SINGLE_CHOICE,
                'difficulty' => 'medium',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'Phép chiếu (Projection - biểu ký hiệu π)'],
                    ['id' => 'opt_b', 'content' => 'Phép chọn (Selection - biểu ký hiệu σ)'],
                    ['id' => 'opt_c', 'content' => 'Phép tích Descartes (Cartesian Product - biểu ký hiệu ×)'],
                    ['id' => 'opt_d', 'content' => 'Phép hợp (Union - biểu ký hiệu ∪)'],
                ],
                'correct_answer' => 'opt_a',
                'explanation' => 'Phép chiếu π chọn danh sách thuộc tính (cột), phép chọn σ lọc dòng theo điều kiện vị từ.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherMai->id,
            ]
        );

        // --- NHÓM 2: CÂU HỎI MULTIPLE CHOICE ---
        Question::updateOrCreate(
            ['question_text' => 'Những đặc tính nào sau đây đúng với bộ nhớ RAM (Random Access Memory)? (Chọn nhiều đáp án)'],
            [
                'topic_id' => $topicMemory->id,
                'question_type' => QuestionType::MULTIPLE_CHOICE,
                'difficulty' => 'medium',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'Là bộ nhớ khả biến (mất toàn bộ dữ liệu khi ngắt nguồn điện)'],
                    ['id' => 'opt_b', 'content' => 'Tốc độ truy xuất nhanh hơn đáng kể so với ổ đĩa quang và HDD/SSD'],
                    ['id' => 'opt_c', 'content' => 'CPU có thể truy xuất ngẫu nhiên trực tiếp tới từng ô nhớ theo địa chỉ'],
                    ['id' => 'opt_d', 'content' => 'Dữ liệu được lưu trữ vĩnh viễn không phụ thuộc nguồn nuôi'],
                ],
                'correct_answer' => ['opt_a', 'opt_b', 'opt_c'],
                'explanation' => 'RAM là bộ nhớ khả biến (volatile), tốc độ cao, CPU đọc ghi trực tiếp qua bus hệ thống.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Những giao thức nào sau đây thuộc Tầng Ứng dụng (Application Layer) trong bộ giao thức Internet? (Chọn nhiều đáp án)'],
            [
                'topic_id' => $topicTransport->id,
                'question_type' => QuestionType::MULTIPLE_CHOICE,
                'difficulty' => 'medium',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'DNS (Domain Name System)'],
                    ['id' => 'opt_b', 'content' => 'HTTP (Hypertext Transfer Protocol)'],
                    ['id' => 'opt_c', 'content' => 'IP (Internet Protocol)'],
                    ['id' => 'opt_d', 'content' => 'SMTP (Simple Mail Transfer Protocol)'],
                ],
                'correct_answer' => ['opt_a', 'opt_b', 'opt_d'],
                'explanation' => 'IP thuộc Tầng Mạng (Network Layer). DNS, HTTP và SMTP đều thuộc Tầng Ứng dụng.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Bốn đặc tính cốt lõi của giao dịch trong Hệ quản trị cơ sở dữ liệu (ACID) bao gồm: (Chọn 4 đáp án đúng)'],
            [
                'topic_id' => $topicAcid->id,
                'question_type' => QuestionType::MULTIPLE_CHOICE,
                'difficulty' => 'hard',
                'options' => [
                    ['id' => 'opt_a', 'content' => 'Atomicity (Tính nguyên tử)'],
                    ['id' => 'opt_b', 'content' => 'Consistency (Tính nhất quán)'],
                    ['id' => 'opt_c', 'content' => 'Isolation (Tính cô lập)'],
                    ['id' => 'opt_d', 'content' => 'Durability (Tính bền vững)'],
                    ['id' => 'opt_e', 'content' => 'Availability (Tính khả dụng)'],
                ],
                'correct_answer' => ['opt_a', 'opt_b', 'opt_c', 'opt_d'],
                'explanation' => 'ACID là viết tắt của Atomicity, Consistency, Isolation và Durability.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherMai->id,
            ]
        );

        // --- NHÓM 3: CÂU HỎI TRUE / FALSE ---
        Question::updateOrCreate(
            ['question_text' => 'Bộ nhớ đệm L1 Cache thông thường được tích hợp trực tiếp ngay bên trong từng nhân vi xử lý (CPU Core).'],
            [
                'topic_id' => $topicMemory->id,
                'question_type' => QuestionType::TRUE_FALSE,
                'difficulty' => 'easy',
                'options' => [
                    ['id' => 'opt_true', 'content' => 'Đúng'],
                    ['id' => 'opt_false', 'content' => 'Sai'],
                ],
                'correct_answer' => 'opt_true',
                'explanation' => 'Đúng. L1 Cache nằm bên trong nhân để đạt băng thông tối đa và độ trễ thấp nhất.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Giao thức TCP sử dụng quy trình bắt tay 2 bước (2-way Handshake) để thiết lập một kết nối tin cậy.'],
            [
                'topic_id' => $topicTransport->id,
                'question_type' => QuestionType::TRUE_FALSE,
                'difficulty' => 'easy',
                'options' => [
                    ['id' => 'opt_true', 'content' => 'Đúng'],
                    ['id' => 'opt_false', 'content' => 'Sai'],
                ],
                'correct_answer' => 'opt_false',
                'explanation' => 'Sai. TCP sử dụng quy trình bắt tay 3 bước (3-way Handshake: SYN -> SYN-ACK -> ACK).',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Một bảng trong CSDL đạt dạng chuẩn 3NF (Third Normal Form) thì bắt buộc phải thỏa mãn dạng chuẩn 2NF.'],
            [
                'topic_id' => $topicAcid->id,
                'question_type' => QuestionType::TRUE_FALSE,
                'difficulty' => 'medium',
                'options' => [
                    ['id' => 'opt_true', 'content' => 'Đúng'],
                    ['id' => 'opt_false', 'content' => 'Sai'],
                ],
                'correct_answer' => 'opt_true',
                'explanation' => 'Đúng. Các dạng chuẩn có tính bao hàm tăng dần: 1NF -> 2NF -> 3NF -> BCNF.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherMai->id,
            ]
        );

        // --- NHÓM 4: CÂU HỎI SHORT ANSWER ---
        Question::updateOrCreate(
            ['question_text' => 'Khối chức năng nào bên trong CPU chuyên trách xử lý các phép tính số học và thao tác logic bit? (Viết tắt 3 chữ cái)'],
            [
                'topic_id' => $topicCpu->id,
                'question_type' => QuestionType::SHORT_ANSWER,
                'difficulty' => 'medium',
                'options' => null,
                'correct_answer' => 'ALU',
                'explanation' => 'ALU là Arithmetic Logic Unit (Khối số học và logic).',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Giao thức nào có nhiệm vụ ánh xạ từ địa chỉ logic IP sang địa chỉ vật lý MAC trong mạng cục bộ? (Viết tắt 3 chữ cái)'],
            [
                'topic_id' => $topicIp->id,
                'question_type' => QuestionType::SHORT_ANSWER,
                'difficulty' => 'medium',
                'options' => null,
                'correct_answer' => 'ARP',
                'explanation' => 'ARP là Address Resolution Protocol.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherNam->id,
            ]
        );

        Question::updateOrCreate(
            ['question_text' => 'Cấu trúc dữ liệu cây tự cân bằng nào phổ biến nhất được các CSDL quan hệ (PostgreSQL, MySQL) sử dụng để tạo Chỉ mục (Index)?'],
            [
                'topic_id' => $topicSql->id,
                'question_type' => QuestionType::SHORT_ANSWER,
                'difficulty' => 'hard',
                'options' => null,
                'correct_answer' => 'B-Tree',
                'explanation' => 'B-Tree (Balanced Tree) là cấu trúc mặc định và phổ biến nhất cho chỉ mục CSDL.',
                'status' => QuestionStatus::READY,
                'created_by' => $teacherMai->id,
            ]
        );
    }
}
