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
     * Run the database seeds with 120+ authentic curriculum questions across 3 core subjects.
     */
    public function run(): void
    {
        $teacherNam = User::where('email', 'teacher@examplatform.local')->firstOrFail();
        $teacherMai = User::where('email', 'teacher.mai@examplatform.local')->firstOrFail();

        // 1. Topics for IT4409 (Computer Architecture)
        $topicCpu = Topic::where('name', 'like', '%CPU%')->firstOrFail();
        $topicMemory = Topic::where('name', 'like', '%Cache%')->firstOrFail();
        $topicIo = Topic::where('name', 'like', '%Nhập/Xuất%')->firstOrFail();

        // 2. Topics for IT3080 (Computer Networks)
        $topicOsi = Topic::where('name', 'like', '%Mô hình OSI%')->firstOrFail();
        $topicIp = Topic::where('name', 'like', '%Tầng Mạng%')->firstOrFail();
        $topicTransport = Topic::where('name', 'like', '%Tầng Giao vận%')->firstOrFail();

        // 3. Topics for IT3290 (Database Systems)
        $topicErd = Topic::where('name', 'like', '%Thực thể%')->firstOrFail();
        $topicSql = Topic::where('name', 'like', '%Ngôn ngữ SQL%')->firstOrFail();
        $topicAcid = Topic::where('name', 'like', '%Chuẩn hóa%')->firstOrFail();

        $questions = [];

        // =========================================================================
        // SUBJECT 1: IT4409 - KIẾN TRÚC MÁY TÍNH (40 CÂU HỎI)
        // =========================================================================

        // Topic 1.1: CPU & Pipeline (14 câu)
        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'CPU là từ viết tắt của cụm từ tiếng Anh nào sau đây?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Central Processing Unit'],
                ['id' => 'opt_b', 'content' => 'Computer Personal Unit'],
                ['id' => 'opt_c', 'content' => 'Control Processing Unit'],
                ['id' => 'opt_d', 'content' => 'Central Power Utility'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'CPU là viết tắt của Central Processing Unit (Bộ xử lý trung tâm của máy tính).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Mục đích cốt lõi của kỹ thuật đường ống lệnh (Instruction Pipelining) trong CPU là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Tăng tốc độ xung nhịp của bộ vi xử lý'],
                ['id' => 'opt_b', 'content' => 'Tăng thông lượng (throughput) thực thi lệnh bằng cách xử lý đồng thời nhiều pha của các lệnh khác nhau'],
                ['id' => 'opt_c', 'content' => 'Giảm tổng thời gian trễ thực thi (latency) của từng lệnh riêng lẻ'],
                ['id' => 'opt_d', 'content' => 'Loại bỏ hoàn toàn rủi ro xung đột dữ liệu (data hazards) trong vi kiến trúc'],
            ],
            'correct_answer' => 'opt_b',
            'explanation' => 'Pipeline cho phép chồng lấn các chu kỳ thực thi lệnh (IF, ID, EX, MEM, WB), từ đó tăng thông lượng (IPC) cho toàn bộ hệ thống.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Hiện tượng "Data Hazard" (xung đột dữ liệu) loại RAW trong vi xử lý xảy ra khi nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Một lệnh cố gắng đọc dữ liệu trước khi lệnh trước đó ghi kết quả vào thanh ghi'],
                ['id' => 'opt_b', 'content' => 'Hai lệnh cùng cố gắng ghi vào một vị trí nhớ tại cùng một thời điểm'],
                ['id' => 'opt_c', 'content' => 'Lệnh rẽ nhánh làm hủy bỏ các lệnh đang nằm trong pipeline'],
                ['id' => 'opt_d', 'content' => 'Hai lệnh cùng yêu cầu sử dụng chung khối ALU'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'RAW (Read After Write) là phụ thuộc dữ liệu thực (True Data Dependency), xảy ra khi lệnh đọc thanh ghi trước khi lệnh trước kịp ghi (Write).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Khối nào trong vi xử lý chịu trách nhiệm thực hiện các phép tính số học và logic?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Khối điều khiển (Control Unit)'],
                ['id' => 'opt_b', 'content' => 'Khối số học và logic (ALU)'],
                ['id' => 'opt_c', 'content' => 'Bộ đếm chương trình (Program Counter)'],
                ['id' => 'opt_d', 'content' => 'Thanh ghi lệnh (Instruction Register)'],
            ],
            'correct_answer' => 'opt_b',
            'explanation' => 'ALU (Arithmetic Logic Unit) đảm nhiệm thực thi các phép tính cộng, trừ, AND, OR, NOT, XOR.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Thanh ghi Program Counter (PC) có nhiệm vụ gì trong chu trình thực thi lệnh?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Lưu trữ mã máy của lệnh đang được giải mã'],
                ['id' => 'opt_b', 'content' => 'Lưu trữ địa chỉ ô nhớ của lệnh kế tiếp cần nạp vào CPU'],
                ['id' => 'opt_c', 'content' => 'Đếm số lượng xung nhịp của CPU đã chạy'],
                ['id' => 'opt_d', 'content' => 'Lưu kết quả tạm thời của phép tính trong ALU'],
            ],
            'correct_answer' => 'opt_b',
            'explanation' => 'Program Counter (PC) trỏ tới địa chỉ bộ nhớ chứa lệnh tiếp theo mà CPU sẽ nạp (Fetch).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Kiến trúc RISC sử dụng tập lệnh phức tạp với nhiều định dạng lệnh có độ dài biến đổi.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_false',
            'explanation' => 'RISC (Reduced Instruction Set Computer) sử dụng tập lệnh đơn giản, độ dài cố định, truy xuất bộ nhớ qua Load/Store. CISC mới dùng tập lệnh phức tạp độ dài biến đổi.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Các kỹ thuật nào sau đây được sử dụng để giảm thiểu độ trễ do xung đột điều khiển (Branch Hazard)? (Chọn tất cả đáp án đúng)',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Dự đoán rẽ nhánh động (Dynamic Branch Prediction)'],
                ['id' => 'opt_b', 'content' => 'Bảng đích rẽ nhánh (Branch Target Buffer - BTB)'],
                ['id' => 'opt_c', 'content' => 'Làm trễ rẽ nhánh (Delayed Branching)'],
                ['id' => 'opt_d', 'content' => 'Tăng kích thước thanh ghi tích lũy (Accumulator)'],
            ],
            'correct_answer' => ['opt_a', 'opt_b', 'opt_c'],
            'explanation' => 'Branch Prediction, BTB và Delayed Branch là 3 kỹ thuật kinh điển xử lý xung đột rẽ nhánh trong vi kiến trúc.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Kỹ thuật Forwarding (hay Bypassing) trong vi xử lý có tác dụng gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Chuyển trực tiếp kết quả từ đầu ra của ALU tới đầu vào của ALU cho lệnh kế tiếp mà không cần chờ ghi vào Register File'],
                ['id' => 'opt_b', 'content' => 'Bỏ qua các lệnh rác trong bộ nhớ'],
                ['id' => 'opt_c', 'content' => 'Tự động sắp xếp lại mã lệnh tại thời điểm biên dịch'],
                ['id' => 'opt_d', 'content' => 'Tăng tốc độ đọc dữ liệu từ bộ nhớ chính RAM'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Forwarding cung cấp dữ liệu vừa tính toán xong ở tầng EX/MEM sang ngay đầu vào ALU của lệnh sau, loại bỏ hoặc giảm bubble stall do RAW hazard.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Trong chu trình lệnh 5 tầng kinh điển (MIPS 5-stage pipeline), thứ tự các tầng từ đầu đến cuối là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'IF -> ID -> EX -> MEM -> WB'],
                ['id' => 'opt_b', 'content' => 'ID -> IF -> EX -> WB -> MEM'],
                ['id' => 'opt_c', 'content' => 'IF -> EX -> ID -> MEM -> WB'],
                ['id' => 'opt_d', 'content' => 'IF -> ID -> MEM -> EX -> WB'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => '5 tầng chuẩn gồm: Instruction Fetch (IF), Instruction Decode (ID), Execute (EX), Memory Access (MEM), Write Back (WB).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Trong kiến trúc Von Neumann, dữ liệu và lệnh chương trình cùng được lưu trữ trong một không gian bộ nhớ chung.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. Kiến trúc Von Neumann dùng chung bus và bộ nhớ cho cả lệnh và dữ liệu, trong khi Harvard tách biệt hai khối nhớ.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Khái niệm CPI (Cycles Per Instruction) thể hiện điều gì trong đánh giá hiệu năng CPU?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Số chu kỳ xung nhịp trung bình cần thiết để hoàn thành một lệnh'],
                ['id' => 'opt_b', 'content' => 'Số lệnh được thực thi trong mỗi chu kỳ xung nhịp'],
                ['id' => 'opt_c', 'content' => 'Số chu kỳ chờ bộ nhớ của mỗi chương trình'],
                ['id' => 'opt_d', 'content' => 'Tần số xung nhịp tối đa của vi xử lý'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'CPI = Cycles / Instruction. Nghịch đảo của CPI là IPC (Instructions Per Cycle).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SHORT_ANSWER,
            'difficulty' => 'easy',
            'question_text' => 'Viết tên viết tắt (3 ký tự) của đơn vị trong CPU chịu trách nhiệm thực thi các phép toán số học và logic.',
            'options' => [],
            'correct_answer' => 'ALU',
            'explanation' => 'ALU là Arithmetic Logic Unit.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Luật Amdahl (Amdahl\'s Law) chỉ ra điều gì về việc tăng tốc hệ thống khi thêm nhân xử lý (parallelism)?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Tốc độ tối đa bị giới hạn bởi phần chương trình phải thực thi tuần tự (serial portion)'],
                ['id' => 'opt_b', 'content' => 'Hiệu năng hệ thống luôn tăng tuyến tính theo số lượng core CPU'],
                ['id' => 'opt_c', 'content' => 'Thêm nhân CPU sẽ giảm thiểu hoàn toàn mức tiêu thụ điện năng'],
                ['id' => 'opt_d', 'content' => 'Hiệu năng chỉ phụ thuộc vào dung lượng bộ nhớ Cache L3'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Theo Amdahl: Speedup = 1 / ((1 - p) + p / s), với p là tỷ lệ song song hóa. Phần tuần tự (1 - p) là trần giới hạn tăng tốc.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicCpu->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Thanh ghi cờ trạng thái (Flags / Status Register) trong CPU thường lưu trữ thông tin gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Các trạng thái kết quả của phép toán ALU như Zero (Z), Carry (C), Overflow (V), Negative (N)'],
                ['id' => 'opt_b', 'content' => 'Địa chỉ của bảng phân trang ảo'],
                ['id' => 'opt_c', 'content' => 'Số lượng tác vụ đang chờ trong hàng đợi hệ điều hành'],
                ['id' => 'opt_d', 'content' => 'Nhiệt độ hiện thời của nhân vi xử lý'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Status register lưu các cờ điều kiện sinh ra sau phép tính ALU dùng cho các lệnh rẽ nhánh điều kiện (je, jne, jg, ...).',
            'created_by' => $teacherNam->id,
        ];

        // Topic 1.2: Memory & Cache (14 câu)
        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Trong phân cấp bộ nhớ máy tính, loại bộ nhớ nào có tốc độ truy xuất nhanh nhất?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Tập thanh ghi trong vi xử lý (Registers)'],
                ['id' => 'opt_b', 'content' => 'Bộ nhớ đệm cấp 1 (L1 Cache)'],
                ['id' => 'opt_c', 'content' => 'Bộ nhớ truy xuất ngẫu nhiên (RAM)'],
                ['id' => 'opt_d', 'content' => 'Ổ lưu trữ thể rắn (NVMe SSD)'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Thanh ghi nằm ngay trong nhân CPU và hoạt động ở xung nhịp CPU, có độ trễ dưới 1 chu kỳ clock.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Nguyên lý "Cục bộ theo thời gian" (Temporal Locality) phát biểu điều gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Một vị trí ô nhớ vừa được truy xuất có khả năng cao sẽ được truy xuất lại trong tương lai gần'],
                ['id' => 'opt_b', 'content' => 'Các ô nhớ nằm liền kề với ô nhớ vừa truy xuất sẽ được truy xuất tiếp theo'],
                ['id' => 'opt_c', 'content' => 'Dữ liệu trong Cache chỉ tồn tại trong một khoảng thời gian hữu hạn'],
                ['id' => 'opt_d', 'content' => 'Bộ nhớ RAM có tốc độ suy giảm theo thời gian sử dụng'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Temporal Locality: Vị trí vừa dùng sẽ sớm được dùng lại (ví dụ biến đếm vòng lặp). Spatial Locality: Các ô nhớ liền kề sẽ được truy xuất.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Trong kỹ thuật ánh xạ bộ nhớ đệm (Cache Mapping), loại ánh xạ nào cho phép một khối dữ liệu từ RAM được nạp vào bất kỳ dòng nào trong Cache?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Ánh xạ trực tiếp (Direct-Mapped Cache)'],
                ['id' => 'opt_b', 'content' => 'Ánh xạ liên kết hoàn toàn (Fully Associative Cache)'],
                ['id' => 'opt_c', 'content' => 'Ánh xạ tập hợp liên kết 2 đường (2-way Set Associative Cache)'],
                ['id' => 'opt_d', 'content' => 'Ánh xạ tập hợp liên kết 4 đường (4-way Set Associative Cache)'],
            ],
            'correct_answer' => 'opt_b',
            'explanation' => 'Fully Associative Cache cho phép khối bộ nhớ đặt ở bất kỳ dòng nào, giảm tối đa xung đột (conflict miss) nhưng tốn chi phí phần cứng so sánh tag.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Chiến lược ghi "Write-Through" trong bộ nhớ Cache hoạt động như thế nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Mỗi thao tác ghi được cập nhật đồng thời lên cả Cache và bộ nhớ chính (RAM)'],
                ['id' => 'opt_b', 'content' => 'Chỉ ghi vào Cache, dữ liệu chỉ được ghi xuống RAM khi khối Cache bị thay thế (evicted)'],
                ['id' => 'opt_c', 'content' => 'Bỏ qua Cache và ghi trực tiếp vào ổ đĩa'],
                ['id' => 'opt_d', 'content' => 'Ghi vào hàng đợi DMA trước khi ghi vào Cache'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Write-Through cập nhật dữ liệu ngay lập tức xuống bộ nhớ dưới để đảm bảo tính nhất quán. Write-Back chỉ ghi xuống bộ nhớ dưới khi block bị thay thế (dirty block).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'TLB (Translation Lookaside Buffer) trong kiến trúc máy tính có vai trò gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Bộ nhớ đệm chuyên dụng lưu trữ các ánh xạ từ địa chỉ ảo sang địa chỉ vật lý gần đây'],
                ['id' => 'opt_b', 'content' => 'Bộ đệm trung gian giữa ALU và FPU'],
                ['id' => 'opt_c', 'content' => 'Bộ dịch mã lệnh Assembly sang mã máy'],
                ['id' => 'opt_d', 'content' => 'Thanh ghi lưu trữ địa chỉ của ngăn xếp Stack'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'TLB là bộ đệm phần cứng trong MMU lưu trữ bảng ánh xạ Page Table mục tiêu, giúp tăng tốc độ chuyển đổi địa chỉ ảo thành địa chỉ vật lý.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Bộ nhớ SRAM (Static RAM) cần phải làm tươi (refresh) định kỳ sau mỗi vài mili-giây để giữ dữ liệu.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_false',
            'explanation' => 'Sai. DRAM dùng tụ điện nên cần mạch refresh định kỳ. SRAM dùng mạch lật flip-flop nên giữ trạng thái liên tục chừng nào còn cấp nguồn.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Những thuật toán thay thế dòng Cache phổ biến nào sau đây được sử dụng khi xảy ra Cache Miss? (Chọn tất cả đáp án đúng)',
            'options' => [
                ['id' => 'opt_a', 'content' => 'LRU (Least Recently Used)'],
                ['id' => 'opt_b', 'content' => 'FIFO (First-In, First-Out)'],
                ['id' => 'opt_c', 'content' => 'Random (Ngẫu nhiên)'],
                ['id' => 'opt_d', 'content' => 'Quicksort Replacement'],
            ],
            'correct_answer' => ['opt_a', 'opt_b', 'opt_c'],
            'explanation' => 'LRU, FIFO, LFU và Random là các thuật toán thay thế dòng cache kinh điển.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Hiện tượng "Page Fault" (lỗi trang) xảy ra khi nào trong hệ thống bộ nhớ ảo?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Trang bộ nhớ ảo mà tiến trình cần truy xuất hiện không nằm trong bộ nhớ RAM'],
                ['id' => 'opt_b', 'content' => 'Thanh ghi PC bị tràn số'],
                ['id' => 'opt_c', 'content' => 'Bộ nhớ Cache L1 bị đầy'],
                ['id' => 'opt_d', 'content' => 'Mã nguồn chương trình bị lỗi cú pháp'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Page Fault xảy ra khi CPU truy xuất một địa chỉ ảo mà cờ Present bit trong bảng phân trang bằng 0, kích hoạt ngắt để HĐH nạp trang từ đĩa vào RAM.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Ba loại Cache Miss theo phân loại kinh điển "3C" của Mark Hill bao gồm những loại nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Compulsory (Bắt buộc), Capacity (Dung lượng), Conflict (Xung đột)'],
                ['id' => 'opt_b', 'content' => 'Control, Compute, Communication'],
                ['id' => 'opt_c', 'content' => 'Cycle, Clock, Cache'],
                ['id' => 'opt_d', 'content' => 'Coherence, Consistency, Concurrency'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Mô hình 3C gồm: Compulsory (cold start miss), Capacity (bộ nhớ cache không đủ chứa data working set), Conflict (xung đột dòng do liên kết tập hợp hữu hạn).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Bộ nhớ ảo (Virtual Memory) cho phép chạy các chương trình có dung lượng bộ nhớ lớn hơn kích thước thực tế của RAM.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. Cơ chế phân trang ảo kết hợp hoán đổi (swap/pagefile) trên ổ đĩa cho phép không gian địa chỉ ảo vượt kích thước RAM vật lý.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Địa chỉ ảo 32-bit với kích thước trang là 4 KB (4096 bytes) sẽ có độ dịch chuyển trong trang (Page Offset) là bao nhiêu bit?',
            'options' => [
                ['id' => 'opt_a', 'content' => '10 bit'],
                ['id' => 'opt_b', 'content' => '12 bit'],
                ['id' => 'opt_c', 'content' => '16 bit'],
                ['id' => 'opt_d', 'content' => '20 bit'],
            ],
            'correct_answer' => 'opt_b',
            'explanation' => 'Kích thước trang 4 KB = 2^12 bytes, do đó cần 12 bit thấp cho trường Offset; 20 bit cao còn lại dùng cho Số hiệu trang (VPN).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SHORT_ANSWER,
            'difficulty' => 'easy',
            'question_text' => 'Viết tên viết tắt (3 ký tự) của loại bộ nhớ truy xuất ngẫu nhiên tĩnh thường dùng làm Cache trong CPU.',
            'options' => [],
            'correct_answer' => 'SRAM',
            'explanation' => 'SRAM là Static Random-Access Memory.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Bộ nhớ đệm L3 (Level 3 Cache) trong các bộ vi xử lý đa nhân hiện đại thường có đặc điểm gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Là bộ nhớ đệm dùng chung (shared cache) cho tất cả các nhân trong cùng đế vi xử lý'],
                ['id' => 'opt_b', 'content' => 'Nằm riêng biệt trong từng nhân và có tốc độ ngang ngửa L1'],
                ['id' => 'opt_c', 'content' => 'Được gắn trên bo mạch chủ bên ngoài chip CPU'],
                ['id' => 'opt_d', 'content' => 'Chỉ lưu trữ các lệnh rẽ nhánh mà không lưu trữ dữ liệu số'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'L3 cache thường là Shared LLC (Last Level Cache) dùng chung cho tất cả các nhân, giúp trao đổi dữ liệu liên nhân nhanh chóng.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicMemory->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Giao thức MESI trong bộ vi xử lý đa nhân được thiết kế để giải quyết vấn đề gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Đảm bảo tính nhất quán bộ nhớ đệm (Cache Coherence)'],
                ['id' => 'opt_b', 'content' => 'Tự động ép xung nhân CPU khi quá nhiệt'],
                ['id' => 'opt_c', 'content' => 'Điều phối năng lượng điện cho thanh RAM'],
                ['id' => 'opt_d', 'content' => 'Mã hóa dữ liệu truyền trên bus hệ thống'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'MESI (Modified, Exclusive, Shared, Invalid) là giao thức đồng bộ trạng thái cache line giữa các core đa xử lý để tránh đọc dữ liệu cũ (stale data).',
            'created_by' => $teacherNam->id,
        ];

        // Topic 1.3: I/O & Interrupts (12 câu)
        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Cơ chế DMA (Direct Memory Access) mang lại lợi ích nổi bật nào cho hệ thống máy tính?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Cho phép thiết bị ngoại vi trao đổi dữ liệu trực tiếp với RAM mà không cần sự can thiệp liên tục của CPU'],
                ['id' => 'opt_b', 'content' => 'Tăng tốc độ truy xuất của đĩa cứng lên bằng tốc độ của thanh ghi'],
                ['id' => 'opt_c', 'content' => 'Loại bỏ hoàn toàn sự cần thiết của bus hệ thống'],
                ['id' => 'opt_d', 'content' => 'Tự động kiểm tra và sửa lỗi bộ nhớ ECC'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'DMA Controller nắm quyền điều khiển bus để truyền các khối dữ liệu lớn giữa I/O và RAM, giải phóng CPU thực thi các tác vụ tính toán khác.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Ngắt phần cứng (Hardware Interrupt) trong hệ thống máy tính được kích hoạt bởi nguồn nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Thiết bị ngoại vi (bàn phím, card mạng, đồng hồ timer) qua chân tín hiệu ngắt'],
                ['id' => 'opt_b', 'content' => 'Một lệnh gọi hàm thông thường trong chương trình C'],
                ['id' => 'opt_c', 'content' => 'Trình biên dịch khi phát hiện lỗi cú pháp'],
                ['id' => 'opt_d', 'content' => 'Trình duyệt web khi tải xong tệp tin'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Ngắt cứng sinh ra từ mạch điện tử ngoại vi gửi tín hiệu điện áp về ngắt bộ điều khiển (PIC / APIC) để báo hiệu sự kiện.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Cơ chế vào/ra điều khiển bằng thăm dò (Programmed I/O - Polling) có nhược điểm lớn nhất là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Lãng phí chu kỳ CPU do phải liên tục đọc thanh ghi trạng thái của thiết bị chờ sẵn sàng (busy-waiting)'],
                ['id' => 'opt_b', 'content' => 'Không thể kết nối quá 2 thiết bị ngoại vi vào máy tính'],
                ['id' => 'opt_c', 'content' => 'Dễ gây cháy nổ phần cứng vi xử lý'],
                ['id' => 'opt_d', 'content' => 'Yêu cầu dung lượng bộ nhớ Cache tối thiểu 16 MB'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Polling bắt CPU quay vòng kiểm tra trạng thái liên tục, gây tiêu hao 100% tài nguyên CPU vào việc chờ đợi thiết bị tốc độ chậm.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Ngắt không thể che giấu (NMI - Non-Maskable Interrupt) có thể bị CPU tạm thời bỏ qua nếu hệ điều hành thiết lập cờ ngắt IF=0.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_false',
            'explanation' => 'Sai. NMI là loại ngắt ưu tiên tối cao cho các lỗi phần cứng nghiêm trọng (như lỗi bộ nhớ RAM, sụt áp nguồn) và không thể bị che hay hoãn lại.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Trong phương pháp Memory-Mapped I/O, các cổng vào/ra của thiết bị được quản lý như thế nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Được gán trực tiếp vào các địa chỉ trong không gian địa chỉ bộ nhớ chính, thao tác bằng lệnh đọc/ghi bộ nhớ thông thường (LOAD/STORE)'],
                ['id' => 'opt_b', 'content' => 'Được quản lý trong không gian địa chỉ riêng biệt và chỉ truy xuất qua các lệnh đặc biệt như IN/OUT'],
                ['id' => 'opt_c', 'content' => 'Chỉ truy xuất qua cổng giao tiếp nối tiếp RS-232'],
                ['id' => 'opt_d', 'content' => 'Lưu trữ hoàn toàn trong bảng thanh ghi vector ngắt'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Memory-Mapped I/O chia sẻ không gian địa chỉ chung với RAM, cho phép dùng chung tập lệnh xử lý bộ nhớ. Khác với Port-Mapped I/O dùng lệnh IN/OUT chuyên biệt.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Các đường dây trong bus hệ thống (System Bus) của máy tính được chia làm những nhóm chính nào? (Chọn tất cả đáp án đúng)',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Bus dữ liệu (Data Bus)'],
                ['id' => 'opt_b', 'content' => 'Bus địa chỉ (Address Bus)'],
                ['id' => 'opt_c', 'content' => 'Bus điều khiển (Control Bus)'],
                ['id' => 'opt_d', 'content' => 'Bus âm thanh (Audio Bus)'],
            ],
            'correct_answer' => ['opt_a', 'opt_b', 'opt_c'],
            'explanation' => 'System Bus bao gồm 3 thành phần tiêu chuẩn: Data Bus, Address Bus và Control Bus.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Bảng Vector ngắt (Interrupt Vector Table - IVT) lưu trữ thông tin gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Địa chỉ bắt đầu của các chương trình phục vụ ngắt (Interrupt Service Routine - ISR)'],
                ['id' => 'opt_b', 'content' => 'Danh sách các thiết bị ngoại vi đang được cắm vào máy tính'],
                ['id' => 'opt_c', 'content' => 'Mã lỗi của các ngoại lệ số học gần nhất'],
                ['id' => 'opt_d', 'content' => 'Bản sao lưu của các thanh ghi khi CPU tắt nguồn'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'IVT lưu mảng con trỏ hàm trỏ tới địa chỉ của từng ISR tương ứng với số hiệu ngắt.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Chuẩn giao tiếp PCIe (PCI Express) truyền tín hiệu theo phương thức nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Truyền nối tiếp điểm-điểm tốc độ cao qua các làn (lanes: x1, x4, x8, x16)'],
                ['id' => 'opt_b', 'content' => 'Truyền song song 64 dây dùng chung bus'],
                ['id' => 'opt_c', 'content' => 'Truyền qua sóng vô tuyến hồng ngoại'],
                ['id' => 'opt_d', 'content' => 'Truyền đồng bộ theo xung kim giây của đồng hồ RTC'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'PCIe là giao tiếp serial tốc độ cao point-to-point với các làn độc lập, thay thế hoàn toàn chuẩn song song cũ PCI/AGP.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Khi một ngắt xảy ra, CPU sẽ tự động lưu lại con trỏ lệnh PC và thanh ghi trạng thái vào Stack trước khi nhảy vào hàm phục vụ ngắt ISR.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. CPU phải bảo toàn ngữ cảnh thực thi (PC, Flags, Registers) vào Stack để sau khi hoàn thành ISR (bằng lệnh IRET) có thể quay lại tiếp tục chương trình bị gián đoạn.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::SHORT_ANSWER,
            'difficulty' => 'easy',
            'question_text' => 'Viết tên viết tắt (3 ký tự) của kỹ thuật cho phép thiết bị I/O chuyển dữ liệu trực tiếp vào bộ nhớ chính mà không qua CPU.',
            'options' => [],
            'correct_answer' => 'DMA',
            'explanation' => 'DMA là Direct Memory Access.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Ngoại lệ (Exception) hay Bẫy (Trap) trong kiến trúc máy tính khác với Ngắt ngoại vi (Interrupt) ở điểm nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Exception/Trap xảy ra đồng bộ với lệnh đang thực thi do chính CPU phát sinh (chia cho 0, lệnh không hợp lệ, phân trang)'],
                ['id' => 'opt_b', 'content' => 'Exception không làm dừng chương trình'],
                ['id' => 'opt_c', 'content' => 'Interrupt chỉ xảy ra khi máy tính bị lỗi phần cứng nguồn'],
                ['id' => 'opt_d', 'content' => 'Trap do thiết bị ngoại vi card mạng gửi đến'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Interrupt là bất đồng bộ (từ bên ngoài CPU), trong khi Exception/Trap là đồng bộ do chính câu lệnh của tiến trình kích hoạt.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIo->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Hiện tượng Bus Contention (tranh chấp bus) trong hệ thống máy tính xảy ra khi nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Khi có nhiều hơn một thiết bị (CPU, DMA controller, Card đồ họa) cùng muốn làm Bus Master để phát dữ liệu tại một thời điểm'],
                ['id' => 'opt_b', 'content' => 'Khi dây bus bị đứt vật lý'],
                ['id' => 'opt_c', 'content' => 'Khi tốc độ truyền dữ liệu vượt quá tốc độ của ổ cứng SSD'],
                ['id' => 'opt_d', 'content' => 'Khi bộ nhớ RAM không đủ chân kết nối'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Bus Master Contention đòi hỏi mạch trọng tài (Bus Arbiter) giải quyết theo cơ chế ưu tiên (daisy-chain hoặc token passing).',
            'created_by' => $teacherNam->id,
        ];

        // =========================================================================
        // SUBJECT 2: IT3080 - MẠNG MÁY TÍNH (40 CÂU HỎI)
        // =========================================================================

        // Topic 2.1: Mô hình OSI & TCP/IP (14 câu)
        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Mô hình tham chiếu OSI chuẩn bao gồm bao nhiêu tầng?',
            'options' => [
                ['id' => 'opt_a', 'content' => '4 tầng'],
                ['id' => 'opt_b', 'content' => '5 tầng'],
                ['id' => 'opt_c', 'content' => '7 tầng'],
                ['id' => 'opt_d', 'content' => '9 tầng'],
            ],
            'correct_answer' => 'opt_c',
            'explanation' => 'Mô hình OSI có 7 tầng: Vật lý, Liên kết dữ liệu, Mạng, Giao vận, Phiên, Trình diễn, Ứng dụng.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Đơn vị dữ liệu giao thức (PDU) tại Tầng Giao vận (Transport Layer) được gọi là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Bit'],
                ['id' => 'opt_b', 'content' => 'Frame (Khung)'],
                ['id' => 'opt_c', 'content' => 'Packet (Gói tin)'],
                ['id' => 'opt_d', 'content' => 'Segment (Đoạn dữ liệu)'],
            ],
            'correct_answer' => 'opt_d',
            'explanation' => 'Transport = Segment/Datagram; Network = Packet; Data Link = Frame; Physical = Bit.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Tầng nào trong mô hình OSI chịu trách nhiệm mã hóa dữ liệu (Encryption) và nén dữ liệu (Compression)?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Tầng Trình diễn (Presentation Layer)'],
                ['id' => 'opt_b', 'content' => 'Tầng Phiên (Session Layer)'],
                ['id' => 'opt_c', 'content' => 'Tầng Ứng dụng (Application Layer)'],
                ['id' => 'opt_d', 'content' => 'Tầng Giao vận (Transport Layer)'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Tầng Trình diễn (Layer 6) đảm nhiệm định dạng, mã hóa dữ liệu (TLS/SSL) và nén cú pháp.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Quá trình đóng gói dữ liệu (Encapsulation) khi dữ liệu truyền từ máy gửi đi diễn ra theo chiều nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Từ Tầng Ứng dụng (Layer 7) xuống Tầng Vật lý (Layer 1)'],
                ['id' => 'opt_b', 'content' => 'Từ Tầng Vật lý (Layer 1) lên Tầng Ứng dụng (Layer 7)'],
                ['id' => 'opt_c', 'content' => 'Chỉ diễn ra tại Tầng Mạng'],
                ['id' => 'opt_d', 'content' => 'Ngẫu nhiên tùy theo băng thông đường truyền'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Tại máy gửi, dữ liệu đi từ tầng trên xuống tầng dưới; mỗi tầng thêm Header (và Trailer ở L2) gọi là Encapsulation.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Switch lớp 2 (Layer 2 Switch) hoạt động dựa trên địa chỉ IP của gói tin để chuyển tiếp dữ liệu.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_false',
            'explanation' => 'Sai. Switch L2 hoạt động tại tầng Data Link dựa trên địa chỉ MAC vật lý. Router mới hoạt động dựa trên địa chỉ IP (Layer 3).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Những giao thức nào sau đây thuộc về Tầng Ứng dụng (Application Layer)? (Chọn tất cả đáp án đúng)',
            'options' => [
                ['id' => 'opt_a', 'content' => 'DNS (Domain Name System)'],
                ['id' => 'opt_b', 'content' => 'HTTP (Hypertext Transfer Protocol)'],
                ['id' => 'opt_c', 'content' => 'SMTP (Simple Mail Transfer Protocol)'],
                ['id' => 'opt_d', 'content' => 'ICMP (Internet Control Message Protocol)'],
            ],
            'correct_answer' => ['opt_a', 'opt_b', 'opt_c'],
            'explanation' => 'DNS, HTTP, SMTP thuộc Tầng Ứng dụng. ICMP thuộc Tầng Mạng (Network Layer).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Địa chỉ MAC (Media Access Control) có độ dài bao nhiêu bit?',
            'options' => [
                ['id' => 'opt_a', 'content' => '32 bit'],
                ['id' => 'opt_b', 'content' => '48 bit'],
                ['id' => 'opt_c', 'content' => '64 bit'],
                ['id' => 'opt_d', 'content' => '128 bit'],
            ],
            'correct_answer' => 'opt_b',
            'explanation' => 'Địa chỉ MAC có 48 bit (6 byte), thường biểu diễn bằng 12 chữ số thập lục phân (hex).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Giao thức ARP (Address Resolution Protocol) có nhiệm vụ cốt lõi là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Phân giải từ địa chỉ IP sang địa chỉ vật lý MAC tương ứng trong mạng cục bộ'],
                ['id' => 'opt_b', 'content' => 'Phân giải từ tên miền sang địa chỉ IP'],
                ['id' => 'opt_c', 'content' => 'Tự động cấp phát địa chỉ IP cho máy khách'],
                ['id' => 'opt_d', 'content' => 'Kiểm tra đường đi của gói tin giữa các router'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'ARP tìm địa chỉ MAC khi đã biết địa chỉ IP đích trên cùng phân đoạn mạng LAN.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Trong mô hình TCP/IP kinh điển 4 tầng, hai tầng Trình diễn và Phiên của OSI được gộp chung vào Tầng Ứng dụng.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. Mô hình TCP/IP gồm: Network Access, Internet, Transport, Application (gồm Application, Presentation, Session của OSI).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SHORT_ANSWER,
            'difficulty' => 'easy',
            'question_text' => 'Viết tên viết tắt (3 ký tự) của mô hình mạng gồm 7 tầng do tổ chức ISO chuẩn hóa.',
            'options' => [],
            'correct_answer' => 'OSI',
            'explanation' => 'Mô hình OSI (Open Systems Interconnection).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Phương thức điều khiển truy cập đường truyền CSMA/CD trong mạng Ethernet giải quyết vấn đề gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Lắng nghe sóng mang và phát hiện va chạm dữ liệu trên môi trường truyền dẫn chia sẻ'],
                ['id' => 'opt_b', 'content' => 'Chống nghe trộm mật khẩu trên đường truyền'],
                ['id' => 'opt_c', 'content' => 'Tối ưu hóa bảng định tuyến động'],
                ['id' => 'opt_d', 'content' => 'Chia tải giữa nhiều cáp mạng song song'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'CSMA/CD (Carrier Sense Multiple Access with Collision Detection) lắng nghe kênh trước khi truyền và lùi lại ngẫu nhiên (backoff) khi có đụng độ.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Hub (bộ tập trung) hoạt động tại tầng nào của mô hình OSI?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Tầng 1 - Vật lý (Physical Layer)'],
                ['id' => 'opt_b', 'content' => 'Tầng 2 - Liên kết dữ liệu (Data Link Layer)'],
                ['id' => 'opt_c', 'content' => 'Tầng 3 - Mạng (Network Layer)'],
                ['id' => 'opt_d', 'content' => 'Tầng 4 - Giao vận (Transport Layer)'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Hub chỉ lặp lại tín hiệu điện ra tất cả các cổng mà không lọc MAC hay IP nên thuộc Tầng Vật lý (Layer 1).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Trường FCS (Frame Check Sequence) ở cuối khung tin Ethernet (Layer 2) sử dụng thuật toán nào để kiểm tra lỗi toàn vẹn dữ liệu?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'CRC (Cyclic Redundancy Check)'],
                ['id' => 'opt_b', 'content' => 'MD5 Checksum'],
                ['id' => 'opt_c', 'content' => 'Hamming Code'],
                ['id' => 'opt_d', 'content' => 'Two\'s Complement Sum'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Ethernet sử dụng thuật toán CRC-32 để phát hiện bit lỗi trên đường truyền.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicOsi->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Giao thức STP (Spanning Tree Protocol - IEEE 802.1D) trong mạng cục bộ có mục tiêu chính là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Ngăn chặn vòng lặp (loop) và bão phát sóng (broadcast storm) trong cấu trúc liên kết Switch dự phòng'],
                ['id' => 'opt_b', 'content' => 'Tăng gấp đôi băng thông giữa các switch'],
                ['id' => 'opt_c', 'content' => 'Tự động gán VLAN cho các cổng mạng'],
                ['id' => 'opt_d', 'content' => 'Xác thực người dùng truy cập WiFi'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'STP khóa logic các cổng vòng lặp dự phòng tạo thành cấu trúc cây không vòng lặp (loop-free tree).',
            'created_by' => $teacherNam->id,
        ];

        // Topic 2.2: Tầng Mạng & Địa chỉ IP, Định tuyến (14 câu)
        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Địa chỉ IPv4 có tổng cộng bao nhiêu bit?',
            'options' => [
                ['id' => 'opt_a', 'content' => '16 bit'],
                ['id' => 'opt_b', 'content' => '32 bit'],
                ['id' => 'opt_c', 'content' => '64 bit'],
                ['id' => 'opt_d', 'content' => '128 bit'],
            ],
            'correct_answer' => 'opt_b',
            'explanation' => 'IPv4 có 32 bit phân thành 4 octet; IPv6 có 128 bit.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Mặt nạ mạng con (Subnet Mask) tương ứng với ký hiệu tiền tố /24 là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => '255.0.0.0'],
                ['id' => 'opt_b', 'content' => '255.255.0.0'],
                ['id' => 'opt_c', 'content' => '255.255.255.0'],
                ['id' => 'opt_d', 'content' => '255.255.255.128'],
            ],
            'correct_answer' => 'opt_c',
            'explanation' => '/24 gồm 24 bit 1 liên tiếp = 255.255.255.0.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Mạng con 192.168.1.0/26 có thể chứa tối đa bao nhiêu địa chỉ IP khả dụng để gán cho các máy trạm (hosts)?',
            'options' => [
                ['id' => 'opt_a', 'content' => '30'],
                ['id' => 'opt_b', 'content' => '62'],
                ['id' => 'opt_c', 'content' => '64'],
                ['id' => 'opt_d', 'content' => '126'],
            ],
            'correct_answer' => 'opt_b',
            'explanation' => '/26 có 32 - 26 = 6 bit host. Tổng số IP = 2^6 = 64. Số host khả dụng = 64 - 2 (trừ địa chỉ mạng và broadcast) = 62.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Dải địa chỉ nào sau đây là dải địa chỉ IP riêng (Private IP) theo chuẩn RFC 1918?',
            'options' => [
                ['id' => 'opt_a', 'content' => '10.0.0.0 - 10.255.255.255'],
                ['id' => 'opt_b', 'content' => '8.8.8.0 - 8.8.8.255'],
                ['id' => 'opt_c', 'content' => '1.1.1.0 - 1.1.1.255'],
                ['id' => 'opt_d', 'content' => '200.100.50.0 - 200.100.50.255'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'RFC 1918 quy định 3 dải private: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Giao thức định tuyến động OSPF (Open Shortest Path First) sử dụng thuật toán nào để tính toán đường đi ngắn nhất?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Thuật toán Dijkstra (Link-State)'],
                ['id' => 'opt_b', 'content' => 'Thuật toán Bellman-Ford (Distance-Vector)'],
                ['id' => 'opt_c', 'content' => 'Thuật toán Floyd-Warshall'],
                ['id' => 'opt_d', 'content' => 'Thuật toán Kruskal'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'OSPF là giao thức trạng thái liên kết (Link-State) áp dụng giải thuật SPF Dijkstra để tính cây đường đi ngắn nhất.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Trường TTL (Time to Live) trong tiêu đề gói tin IPv4 có tác dụng gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Ngăn chặn gói tin di chuyển vô tận trong mạng khi có vòng lặp định tuyến'],
                ['id' => 'opt_b', 'content' => 'Đo thời gian truyền tải gói tin từ máy gửi đến máy nhận'],
                ['id' => 'opt_c', 'content' => 'Đảm bảo gói tin được chuyển phát trong vòng 10 giây'],
                ['id' => 'opt_d', 'content' => 'Chỉ định hạn sử dụng bản quyền của hệ điều hành'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Mỗi router chuyển tiếp gói tin sẽ giảm TTL đi 1. Khi TTL = 0, gói tin bị hủy và router gửi thông điệp ICMP Time Exceeded về máy gửi.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Kỹ thuật NAT (Network Address Translation) cho phép nhiều thiết bị dùng IP nội bộ có thể truy cập Internet thông qua một hoặc vài địa chỉ IP công cộng (Public IP).',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. NAPT/PAT dịch chuyển kết hợp IP và Port để ánh xạ không gian private ra public Internet.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Giao thức BGP (Border Gateway Protocol) đóng vai trò gì trên Internet toàn cầu?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Định tuyến giữa các hệ thống tự trị (Autonomous Systems - AS) trên liên mạng Internet'],
                ['id' => 'opt_b', 'content' => 'Cấp phát địa chỉ IP tự động cho máy trạm gia đình'],
                ['id' => 'opt_c', 'content' => 'Định tuyến gói tin trong mạng LAN nội bộ doanh nghiệp'],
                ['id' => 'opt_d', 'content' => 'Mã hóa kết nối ngân hàng trực tuyến'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'BGP là giao thức Exterior Gateway Protocol (EGP) duy nhất điều phối bảng định tuyến giữa các ISP và AS trên toàn cầu.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Địa chỉ IPv6 có độ dài bao nhiêu bit và được biểu diễn bằng hệ cơ số nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => '128 bit, biểu diễn bằng hệ thập lục phân (Hexadecimal)'],
                ['id' => 'opt_b', 'content' => '64 bit, biểu diễn bằng hệ nhị phân'],
                ['id' => 'opt_c', 'content' => '32 bit, biểu diễn bằng hệ thập phân'],
                ['id' => 'opt_d', 'content' => '256 bit, biểu diễn bằng ký tự Base64'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'IPv6 dài 128 bit gồm 8 nhóm 4 chữ số hex cách nhau bởi dấu hai chấm (ví dụ: 2001:0db8::1).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Lệnh "ping" và "traceroute" sử dụng các loại thông điệp của giao thức nào ở tầng mạng? (Chọn tất cả đáp án đúng)',
            'options' => [
                ['id' => 'opt_a', 'content' => 'ICMP Echo Request'],
                ['id' => 'opt_b', 'content' => 'ICMP Echo Reply'],
                ['id' => 'opt_c', 'content' => 'ICMP Time Exceeded'],
                ['id' => 'opt_d', 'content' => 'BGP Update Message'],
            ],
            'correct_answer' => ['opt_a', 'opt_b', 'opt_c'],
            'explanation' => 'Ping dùng Echo Request (Type 8) và Echo Reply (Type 0). Traceroute tăng dần TTL để nhận thông điệp ICMP Time Exceeded (Type 11).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SHORT_ANSWER,
            'difficulty' => 'easy',
            'question_text' => 'Viết tên viết tắt (4 ký tự) của giao thức cung cấp thông điệp điều khiển và chẩn đoán lỗi trong mạng IP (ví dụ dùng cho lệnh ping).',
            'options' => [],
            'correct_answer' => 'ICMP',
            'explanation' => 'ICMP là Internet Control Message Protocol.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Địa chỉ IP Loopback mặc định của máy tính cục bộ trong chuẩn IPv4 là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => '127.0.0.1'],
                ['id' => 'opt_b', 'content' => '192.168.1.1'],
                ['id' => 'opt_c', 'content' => '0.0.0.0'],
                ['id' => 'opt_d', 'content' => '255.255.255.255'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => '127.0.0.1 là địa chỉ localhost loopback tiêu chuẩn trong IPv4 (127.0.0.0/8).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Nguyên tắc khớp tiền tố dài nhất (Longest Prefix Match) trong Router được áp dụng khi nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Khi bảng định tuyến có nhiều tuyến đường (routes) cùng khớp với IP đích, Router sẽ chọn tuyến có subnet mask dài nhất'],
                ['id' => 'opt_b', 'content' => 'Khi gói tin có kích thước lớn hơn MTU'],
                ['id' => 'opt_c', 'content' => 'Khi địa chỉ MAC của gateway bị thay đổi'],
                ['id' => 'opt_d', 'content' => 'Khi đường truyền xảy ra hiện tượng suy hao tín hiệu'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Longest Prefix Match chọn đường đi đặc hiệu nhất (ví dụ /28 ưu tiên hơn /24).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicIp->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'medium',
            'question_text' => 'Trong IPv6, địa chỉ Broadcast bị loại bỏ hoàn toàn và được thay thế bằng địa chỉ Multicast và Anycast.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. IPv6 không còn khái niệm địa chỉ Broadcast, giảm bớt lưu lượng rác trên phân đoạn mạng.',
            'created_by' => $teacherNam->id,
        ];

        // Topic 2.3: Tầng Giao vận & Ứng dụng (12 câu)
        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Quá trình thiết lập kết nối TCP 3 bước (Three-way Handshake) diễn ra theo chuỗi cờ (flags) nào sau đây?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'SYN -> SYN-ACK -> ACK'],
                ['id' => 'opt_b', 'content' => 'ACK -> SYN -> ACK'],
                ['id' => 'opt_c', 'content' => 'SYN -> FIN -> ACK'],
                ['id' => 'opt_d', 'content' => 'RST -> SYN -> ACK'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'TCP 3-way handshake: Client gửi SYN -> Server phản hồi SYN-ACK -> Client xác nhận bằng ACK.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Sự khác biệt cốt lõi giữa giao thức TCP và UDP là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'TCP là giao thức hướng kết nối và đảm bảo truyền tin cậy; UDP là phi kết nối và không đảm bảo tin cậy'],
                ['id' => 'opt_b', 'content' => 'TCP chỉ truyền văn bản; UDP chỉ truyền video'],
                ['id' => 'opt_c', 'content' => 'UDP có kích thước tiêu đề lớn hơn TCP'],
                ['id' => 'opt_d', 'content' => 'TCP hoạt động ở tầng Mạng; UDP hoạt động ở tầng Giao vận'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'TCP đảm bảo thứ tự gói tin và kiểm soát lỗi/tắc nghẽn. UDP tối ưu cho tốc độ và truyền thời gian thực (VoIP, Game, Video streaming).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Cổng mạng mặc định (Default Port) của giao thức HTTPS bảo mật là cổng bao nhiêu?',
            'options' => [
                ['id' => 'opt_a', 'content' => '80'],
                ['id' => 'opt_b', 'content' => '443'],
                ['id' => 'opt_c', 'content' => '8080'],
                ['id' => 'opt_d', 'content' => '22'],
            ],
            'correct_answer' => 'opt_b',
            'explanation' => 'HTTP dùng port 80; HTTPS dùng port 443; SSH dùng port 22.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Cơ chế cửa sổ trượt (Sliding Window) trong TCP có mục đích chính là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Kiểm soát luồng dữ liệu (Flow Control) nhằm ngăn không cho bên gửi truyền dữ liệu làm tràn bộ đệm bên nhận'],
                ['id' => 'opt_b', 'content' => 'Mã hóa dữ liệu chống giải mã trộm'],
                ['id' => 'opt_c', 'content' => 'Tự động đóng cổng mạng khi máy chủ bị tấn công'],
                ['id' => 'opt_d', 'content' => 'Chuyển đổi giao thức từ IPv4 sang IPv6'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Bên nhận thông báo trường Receive Window (rwnd) trong TCP Header để bên gửi điều chỉnh tốc độ gửi không vượt quá khả năng xử lý.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Giao thức DNS (Domain Name System) chủ yếu sử dụng cổng số 53 với giao thức tầng giao vận nào khi phân giải tên miền thông thường?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'UDP'],
                ['id' => 'opt_b', 'content' => 'TCP'],
                ['id' => 'opt_c', 'content' => 'ICMP'],
                ['id' => 'opt_d', 'content' => 'IGMP'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'DNS query thông thường dùng UDP port 53 vì tốc độ nhanh gọn không cần overhead bắt tay. Khi truyền vùng zone transfer hoặc gói > 512 bytes mới dùng TCP.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Giao thức HTTP/2 hỗ trợ tính năng Ghép kênh (Multiplexing) cho phép gửi nhiều yêu cầu và phản hồi đồng thời trên một kết nối TCP duy nhất.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. HTTP/2 giải quyết vấn đề Head-of-Line Blocking ở tầng ứng dụng bằng cách chia nhỏ frame và ghép kênh trên 1 TCP connection.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Thuật toán kiểm soát tắc nghẽn TCP Tahoe và TCP Reno chuyển từ trạng thái Slow Start sang Congestion Avoidance khi cửa sổ cwnd đạt tới ngưỡng nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'ssthresh (Slow Start Threshold)'],
                ['id' => 'opt_b', 'content' => 'rwnd (Receive Window)'],
                ['id' => 'opt_c', 'content' => 'MTU (Maximum Transmission Unit)'],
                ['id' => 'opt_d', 'content' => 'MSS (Maximum Segment Size)'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Khi cwnd < ssthresh, cwnd tăng theo hàm mũ (Slow Start); khi cwnd >= ssthresh, chuyển sang tăng tuyến tính (Congestion Avoidance).',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Những mã trạng thái HTTP nào sau đây đại diện cho lỗi từ phía máy khách (Client Error 4xx)? (Chọn tất cả đáp án đúng)',
            'options' => [
                ['id' => 'opt_a', 'content' => '400 Bad Request'],
                ['id' => 'opt_b', 'content' => '401 Unauthorized'],
                ['id' => 'opt_c', 'content' => '403 Forbidden'],
                ['id' => 'opt_d', 'content' => '502 Bad Gateway'],
            ],
            'correct_answer' => ['opt_a', 'opt_b', 'opt_c'],
            'explanation' => '400, 401, 403, 404 là mã 4xx Client Error. 502 là mã 5xx Server Error.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Giao thức HTTP/3 sử dụng giao thức tầng giao vận nào làm nền tảng thay cho TCP?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'QUIC (chạy trên nền UDP)'],
                ['id' => 'opt_b', 'content' => 'SCTP'],
                ['id' => 'opt_c', 'content' => 'DCCP'],
                ['id' => 'opt_d', 'content' => 'IPsec'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'HTTP/3 sử dụng QUIC (Quick UDP Internet Connections) chạy trên UDP, loại bỏ triệt để hiện tượng Head-of-Line Blocking ở tầng TCP.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Phương thức HTTP GET mang tính chất Idempotent (thực hiện một lần hay nhiều lần liên tiếp đều cho cùng kết quả trạng thái trên máy chủ).',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. Theo chuẩn HTTP RFC 7231, GET, HEAD, PUT, DELETE là các phương thức mang tính chất Idempotent.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::SHORT_ANSWER,
            'difficulty' => 'easy',
            'question_text' => 'Viết số hiệu cổng tiêu chuẩn mặc định của giao thức truyền file an toàn qua SSH (SFTP/SSH).',
            'options' => [],
            'correct_answer' => '22',
            'explanation' => 'SSH mặc định sử dụng port 22.',
            'created_by' => $teacherNam->id,
        ];

        $questions[] = [
            'topic_id' => $topicTransport->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Cờ FIN trong giao thức TCP được gửi đi khi nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Khi một bên hoàn thành truyền dữ liệu và muốn đóng chiều gửi kết nối'],
                ['id' => 'opt_b', 'content' => 'Khi một bên muốn hủy kết nối khẩn cấp do lỗi'],
                ['id' => 'opt_c', 'content' => 'Khi bên nhận muốn yêu cầu truyền lại gói tin'],
                ['id' => 'opt_d', 'content' => 'Khi đồng bộ hóa số thứ tự ban đầu ISN'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Cờ FIN (Finish) dùng trong quá trình đóng kết nối 4 bước (Four-way Handshake) của TCP.',
            'created_by' => $teacherNam->id,
        ];

        // =========================================================================
        // SUBJECT 3: IT3290 - CƠ SỞ DỮ LIỆU (40 CÂU HỎI)
        // =========================================================================

        // Topic 3.1: ERD & Đại số quan hệ (13 câu)
        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Trong sơ đồ quan hệ thực thể (ERD), hình chữ nhật thường biểu diễn cho thành phần nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Kiểu thực thể (Entity Type)'],
                ['id' => 'opt_b', 'content' => 'Thuộc tính (Attribute)'],
                ['id' => 'opt_c', 'content' => 'Mối quan hệ (Relationship)'],
                ['id' => 'opt_d', 'content' => 'Ràng buộc toàn vẹn'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Quy ước Chen ERD: Hình chữ nhật = Thực thể; Hình elip = Thuộc tính; Hình thoi = Mối quan hệ.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Phép toán nào trong đại số quan hệ chọn ra các thuộc tính (cột) cụ thể từ một quan hệ?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Phép chiếu (Projection - ký hiệu pi)'],
                ['id' => 'opt_b', 'content' => 'Phép chọn (Selection - ký hiệu sigma)'],
                ['id' => 'opt_c', 'content' => 'Phép tích Đề-các (Cartesian Product)'],
                ['id' => 'opt_d', 'content' => 'Phép kết nối (Join)'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Phép chiếu lọc các cột theo chiều dọc; Phép chọn (sigma) lọc các dòng theo điều kiện ngang.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Một mối quan hệ nhiều-nhiều (N:N) giữa hai thực thể SinhVien và MonHoc khi chuyển đổi sang mô hình quan hệ cần được xử lý như thế nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Tách thành một bảng trung gian (Junction Table) chứa khóa ngoại trỏ tới hai bảng gốc'],
                ['id' => 'opt_b', 'content' => 'Thêm khóa ngoại SinhVien vào bảng MonHoc'],
                ['id' => 'opt_c', 'content' => 'Thêm khóa ngoại MonHoc vào bảng SinhVien'],
                ['id' => 'opt_d', 'content' => 'Gộp hai bảng thành một bảng duy nhất'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Quan hệ N:N bắt buộc phải phân rã thành một bảng liên kết (junction/pivot table) kết hợp 2 quan hệ 1:N.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Khóa chính (Primary Key) của một bảng quan hệ có thể chấp nhận giá trị NULL nếu không có dữ liệu trùng lặp.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_false',
            'explanation' => 'Sai. Theo quy tắc Entity Integrity, Primary Key bắt buộc phải NOT NULL và UNIQUE.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Phép kết nối tự nhiên (Natural Join) giữa hai quan hệ R và S có đặc điểm gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Tự động kết nối dựa trên sự bằng nhau của tất cả các thuộc tính có cùng tên ở cả hai bảng và loại bỏ cột trùng lặp'],
                ['id' => 'opt_b', 'content' => 'Nhân tất cả các dòng của R với S mà không cần điều kiện'],
                ['id' => 'opt_c', 'content' => 'Chỉ giữ lại các dòng của R không có trong S'],
                ['id' => 'opt_d', 'content' => 'Là phép hợp tập hợp giữa R và S'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Natural Join là phép equi-join trên tập các thuộc tính chung, kết quả chỉ giữ lại 1 bản sao của mỗi thuộc tính chung đó.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Những phép toán nào sau đây thuộc nhóm 5 phép toán cơ bản trong Đại số quan hệ thuần túy? (Chọn tất cả đáp án đúng)',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Phép chọn (Selection - sigma)'],
                ['id' => 'opt_b', 'content' => 'Phép chiếu (Projection - pi)'],
                ['id' => 'opt_c', 'content' => 'Phép hợp (Union)'],
                ['id' => 'opt_d', 'content' => 'Phép nhóm theo điều kiện (GROUP BY)'],
            ],
            'correct_answer' => ['opt_a', 'opt_b', 'opt_c'],
            'explanation' => '5 phép toán nguyên thủy của Codd gồm: Selection, Projection, Union, Set Difference, Cartesian Product.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Thuộc tính suy diễn (Derived Attribute) trong mô hình ERD là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Thuộc tính có giá trị có thể tính toán được từ các thuộc tính khác (ví dụ: Tuổi tính từ Ngày sinh)'],
                ['id' => 'opt_b', 'content' => 'Thuộc tính có thể chứa nhiều giá trị cùng lúc (ví dụ: Số điện thoại)'],
                ['id' => 'opt_c', 'content' => 'Thuộc tính đóng vai trò làm khóa ngoại'],
                ['id' => 'opt_d', 'content' => 'Thuộc tính không được phép chỉnh sửa sau khi tạo'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Derived Attribute thường được ký hiệu bằng hình elip nét đứt trong ERD, giá trị được tính toán động (ví dụ age = current_year - birth_year).',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Ràng buộc toàn vẹn tham chiếu (Referential Integrity) quy định điều gì đối với khóa ngoại (Foreign Key)?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Giá trị của khóa ngoại phải tham chiếu tới một khóa chính tồn tại ở bảng cha, hoặc có giá trị NULL'],
                ['id' => 'opt_b', 'content' => 'Khóa ngoại không được trùng giá trị ở bất kỳ dòng nào'],
                ['id' => 'opt_c', 'content' => 'Khóa ngoại phải có tên giống hệt tên khóa chính của bảng cha'],
                ['id' => 'opt_d', 'content' => 'Khóa ngoại chỉ được là kiểu số nguyên Auto Increment'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Toàn vẹn tham chiếu đảm bảo không có mồ côi (orphan records), mọi giá trị FK phải tồn tại ở bảng cha hoặc NULL.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'medium',
            'question_text' => 'Thực thể yếu (Weak Entity) là thực thể không thể tồn tại độc lập nếu thiếu thực thể chủ (Owner Entity) và không có đủ thuộc tính để tạo khóa chính riêng.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. Thực thể yếu dùng khóa bộ phận (Partial Key / Discriminator) kết hợp với khóa chính của thực thể chủ để xác định duy nhất.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::SHORT_ANSWER,
            'difficulty' => 'easy',
            'question_text' => 'Viết tên viết tắt (3 ký tự) của sơ đồ thực thể mối quan hệ dùng để thiết kế cơ sở dữ liệu ở mức quan niệm.',
            'options' => [],
            'correct_answer' => 'ERD',
            'explanation' => 'ERD là Entity-Relationship Diagram.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Bản số (Cardinality) 1:N trong quan hệ giữa Khoa và SinhVien thể hiện điều gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Một Khoa có thể có nhiều SinhVien, nhưng mỗi SinhVien chỉ thuộc về một Khoa'],
                ['id' => 'opt_b', 'content' => 'Mỗi SinhVien có thể học ở nhiều Khoa khác nhau cùng lúc'],
                ['id' => 'opt_c', 'content' => 'Mỗi Khoa chỉ được phép nhận duy nhất một SinhVien'],
                ['id' => 'opt_d', 'content' => 'Số lượng Khoa phải bằng số lượng SinhVien'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Quan hệ 1:N một phía là 1 (Khoa) và phía kia là N (nhiều Sinh viên).',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Trong đại số quan hệ, phép chia quan hệ R / S thường được ứng dụng để giải quyết loại truy vấn nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Truy vấn chứa điều kiện "cho tất cả" (FOR ALL) như: Tìm sinh viên đã học TẤT CẢ các môn của ngành CNTT'],
                ['id' => 'opt_b', 'content' => 'Tính trung bình cộng điểm số của một lớp'],
                ['id' => 'opt_c', 'content' => 'Xóa các bản ghi trùng lặp trong bảng'],
                ['id' => 'opt_d', 'content' => 'Chuyển đổi kiểu dữ liệu giữa số nguyên và số thực'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Phép chia quan hệ (Relational Division) mô hình hóa mệnh đề phổ quát "với mọi" (Universal Quantification).',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicErd->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Khóa ứng viên (Candidate Key) của một quan hệ là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Tập thuộc tính tối thiểu có khả năng xác định duy nhất mỗi bộ (tuple) trong quan hệ'],
                ['id' => 'opt_b', 'content' => 'Bất kỳ thuộc tính nào có giá trị khác NULL'],
                ['id' => 'opt_c', 'content' => 'Tập hợp tất cả các cột của bảng cộng lại'],
                ['id' => 'opt_d', 'content' => 'Khóa ngoại tham chiếu tới bảng khác'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Candidate Key là Superkey tối thiểu (minimal superkey). Một trong các Candidate Key sẽ được chọn làm Primary Key.',
            'created_by' => $teacherMai->id,
        ];

        // Topic 3.2: Ngôn ngữ SQL & Chỉ mục (14 câu)
        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Mệnh đề nào trong câu lệnh SQL SELECT được dùng để lọc điều kiện sau khi đã gom nhóm (GROUP BY)?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'WHERE'],
                ['id' => 'opt_b', 'content' => 'HAVING'],
                ['id' => 'opt_c', 'content' => 'ORDER BY'],
                ['id' => 'opt_d', 'content' => 'LIMIT'],
            ],
            'correct_answer' => 'opt_b',
            'explanation' => 'WHERE lọc từng dòng đơn lẻ trước khi gom nhóm; HAVING lọc các nhóm sau khi tính toán các hàm tổng hợp (SUM, COUNT, AVG).',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Sự khác biệt giữa INNER JOIN và LEFT JOIN trong SQL là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'INNER JOIN chỉ trả về các dòng có sự khớp ở cả hai bảng; LEFT JOIN giữ lại toàn bộ các dòng của bảng bên trái dù không khớp ở bảng bên phải'],
                ['id' => 'opt_b', 'content' => 'INNER JOIN nhanh hơn và tự động tạo chỉ mục'],
                ['id' => 'opt_c', 'content' => 'LEFT JOIN loại bỏ các giá trị NULL ở bảng bên trái'],
                ['id' => 'opt_d', 'content' => 'Không có sự khác biệt về kết quả dữ liệu trả về'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'LEFT JOIN bảo toàn tất cả các dòng từ bảng bên trái (Left table), điền NULL cho các cột của bảng phải khi không có dòng khớp.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Cấu trúc dữ liệu nào được sử dụng phổ biến nhất cho việc lập chỉ mục (Indexes) trong các hệ quản trị cơ sở dữ liệu quan hệ như PostgreSQL và MySQL InnoDB?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'B-Tree (hoặc B+Tree)'],
                ['id' => 'opt_b', 'content' => 'Đồ thị có hướng (DAG)'],
                ['id' => 'opt_c', 'content' => 'Mảng động liên kết đơn'],
                ['id' => 'opt_d', 'content' => 'Cây nhị phân tìm kiếm thông thường (BST)'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'B-Tree và B+Tree tối ưu hóa số lượng truy cập đĩa I/O nhờ tính tự cân bằng và các nút có bậc lớn (fan-out cao), phù hợp cho cả tìm kiếm chính xác và tìm kiếm theo dải (range queries).',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Nhóm câu lệnh DDL (Data Definition Language) trong SQL bao gồm những lệnh nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'CREATE, ALTER, DROP, TRUNCATE'],
                ['id' => 'opt_b', 'content' => 'SELECT, INSERT, UPDATE, DELETE'],
                ['id' => 'opt_c', 'content' => 'GRANT, REVOKE'],
                ['id' => 'opt_d', 'content' => 'COMMIT, ROLLBACK, SAVEPOINT'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'DDL định nghĩa cấu trúc bảng/schema. DML thao tác dữ liệu. DCL phân quyền. TCL quản lý giao dịch.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Toán tử UNION trong SQL tự động loại bỏ các dòng dữ liệu trùng lặp trong kết quả, trong khi UNION ALL giữ nguyên các dòng trùng lặp.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. UNION thực hiện distinct sort tốn chi phí hơn; UNION ALL ghép thẳng kết quả nên có hiệu năng cao hơn.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Những trường hợp nào sau đây có thể khiến Database từ chối sử dụng chỉ mục B-Tree và chuyển sang duyệt tuần tự toàn bảng (Seq Scan / Table Scan)? (Chọn tất cả đáp án đúng)',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Sử dụng hàm trên cột trong mệnh đề WHERE (ví dụ: WHERE UPPER(email) = ...) mà không có Functional Index'],
                ['id' => 'opt_b', 'content' => 'So khớp chuỗi ký tự dạng wildcard ở đầu: WHERE name LIKE \'%Nguyen\''],
                ['id' => 'opt_c', 'content' => 'Bảng có số lượng bản ghi quá nhỏ (dưới vài chục dòng) khiến chi phí quét bảng rẻ hơn đọc index'],
                ['id' => 'opt_d', 'content' => 'Sử dụng phép so sánh bằng: WHERE id = 100'],
            ],
            'correct_answer' => ['opt_a', 'opt_b', 'opt_c'],
            'explanation' => 'Hàm bọc cột, leading wildcard LIKE \'%...\' và bảng quá nhỏ đều khiến optimizer bỏ qua index.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Chỉ mục bao phủ (Covering Index / Index-Only Scan) mang lại lợi ích hiệu năng vượt trội gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Truy vấn lấy toàn bộ dữ liệu cần thiết ngay trên các nút lá của Index mà không cần đọc thêm dữ liệu từ bảng chính (Heap/Table)'],
                ['id' => 'opt_b', 'content' => 'Tự động sao lưu dữ liệu sang máy chủ dự phòng'],
                ['id' => 'opt_c', 'content' => 'Cho phép bảng chấp nhận khóa ngoại không tồn tại'],
                ['id' => 'opt_d', 'content' => 'Loại bỏ hoàn toàn chi phí ghi dữ liệu khi chạy INSERT'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Covering Index chứa tất cả các cột được yêu cầu trong SELECT và WHERE, cho phép Database thực thi Index-Only Scan không cần truy cập đĩa vào Table Heap.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Câu lệnh EXPLAIN ANALYZE trong PostgreSQL có tác dụng gì đối với một truy vấn SQL?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Thực thi câu truy vấn và hiển thị kế hoạch thực thi thực tế cùng thời gian chạy chi tiết của từng bước'],
                ['id' => 'opt_b', 'content' => 'Tự động sửa các lỗi cú pháp trong câu lệnh SQL'],
                ['id' => 'opt_c', 'content' => 'Xóa tất cả các chỉ mục không dùng đến trên bảng'],
                ['id' => 'opt_d', 'content' => 'Chuyển đổi truy vấn sang ngôn ngữ NoSQL'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'EXPLAIN ANALYZE chạy thực tế câu query và đo lường thời gian thực thi (actual time), số dòng trả về (actual rows) so sánh với chi phí ước lượng của Query Planner.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Tạo càng nhiều chỉ mục (Indexes) trên một bảng sẽ giúp tăng tốc độ đọc dữ liệu nhưng làm chậm tốc độ của các thao tác ghi (INSERT, UPDATE, DELETE).',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. Mỗi lệnh ghi dữ liệu phải cập nhật đồng thời tất cả các cây chỉ mục liên quan trên bảng, gây tăng chi phí I/O ghi.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SHORT_ANSWER,
            'difficulty' => 'easy',
            'question_text' => 'Viết từ khóa SQL (4 ký tự) dùng trước câu truy vấn để xem kế hoạch thực thi (Execution Plan) của bộ tối ưu hóa.',
            'options' => [],
            'correct_answer' => 'EXPLAIN',
            'explanation' => 'EXPLAIN hiển thị kế hoạch truy vấn do Query Planner tính toán.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Hàm tổng hợp COUNT(ten_cot) trong SQL khác với COUNT(*) ở điểm nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'COUNT(ten_cot) bỏ qua không đếm các giá trị NULL; COUNT(*) đếm toàn bộ số dòng bất kể giá trị các cột'],
                ['id' => 'opt_b', 'content' => 'COUNT(*) chỉ đếm các giá trị số nguyên'],
                ['id' => 'opt_c', 'content' => 'COUNT(ten_cot) tự động loại bỏ các bản ghi trùng lặp'],
                ['id' => 'opt_d', 'content' => 'Không có sự khác nhau nào'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'COUNT(column) chỉ đếm các dòng mà column NOT NULL. Muốn loại bỏ trùng lặp phải chỉ định rõ COUNT(DISTINCT column).',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Trong một chỉ mục hỗn hợp (Composite Index) trên 2 cột (cot_a, cot_b), điều kiện truy vấn nào sau đây có thể tận dụng tốt nhất chỉ mục này?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'WHERE cot_a = 5 AND cot_b = 10'],
                ['id' => 'opt_b', 'content' => 'WHERE cot_b = 10 (không có điều kiện trên cot_a)'],
                ['id' => 'opt_c', 'content' => 'WHERE cot_c = 20'],
                ['id' => 'opt_d', 'content' => 'WHERE cot_b LIKE \'%abc\''],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Composite Index hoạt động theo quy tắc Leftmost Prefix. Truy vấn bắt đầu với cot_a hoặc cả (cot_a, cot_b) sẽ tận dụng tối đa chỉ mục.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Thứ tự thực thi logic (Logical Processing Order) thực tế của một câu truy vấn SQL là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT'],
                ['id' => 'opt_b', 'content' => 'SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY'],
                ['id' => 'opt_c', 'content' => 'WHERE -> FROM -> SELECT -> GROUP BY -> HAVING'],
                ['id' => 'opt_d', 'content' => 'FROM -> SELECT -> WHERE -> ORDER BY -> LIMIT'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Database xử lý bảng nguồn (FROM/JOIN) trước, lọc dòng (WHERE), nhóm (GROUP BY), lọc nhóm (HAVING), chiếu cột (SELECT), sắp xếp (ORDER BY) và cắt trang (LIMIT).',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicSql->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'View (Khung nhìn) trong cơ sở dữ liệu quan hệ là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Một bảng ảo dựa trên kết quả của một câu lệnh SQL SELECT, không lưu dữ liệu vật lý riêng (trừ khi là Materialized View)'],
                ['id' => 'opt_b', 'content' => 'Một bản sao lưu dự phòng nén của database'],
                ['id' => 'opt_c', 'content' => 'Giao diện đồ họa hiển thị các bảng trên màn hình web'],
                ['id' => 'opt_d', 'content' => 'Một loại trigger tự động kích hoạt khi có lỗi'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'View là truy vấn được lưu trữ có tên, hoạt động như một bảng ảo giúp trừu tượng hóa bảo mật và đơn giản hóa truy vấn phức tạp.',
            'created_by' => $teacherMai->id,
        ];

        // Topic 3.3: Chuẩn hóa & Giao dịch ACID (13 câu)
        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Một bảng quan hệ đạt Dạng chuẩn 1 (1NF - First Normal Form) khi nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Tất cả các thuộc tính đều chứa các giá trị nguyên tố (nguyên tử - Atomic values) và không có nhóm lặp'],
                ['id' => 'opt_b', 'content' => 'Không còn phụ thuộc hàm bắc cầu'],
                ['id' => 'opt_c', 'content' => 'Không còn phụ thuộc hàm một phần'],
                ['id' => 'opt_d', 'content' => 'Mỗi thuộc tính vế trái của phụ thuộc hàm đều là siêu khóa'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => '1NF yêu cầu mọi ô trong bảng chỉ chứa một giá trị đơn (atomic), không mảng, không danh sách lặp.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Để một quan hệ đạt Dạng chuẩn 2 (2NF), quan hệ đó phải đạt 1NF và thỏa mãn điều kiện gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Mọi thuộc tính không khóa phải phụ thuộc hàm đầy đủ vào khóa chính (không có phụ thuộc một phần)'],
                ['id' => 'opt_b', 'content' => 'Không tồn tại phụ thuộc hàm bắc cầu giữa các thuộc tính không khóa'],
                ['id' => 'opt_c', 'content' => 'Bảng chỉ được phép có duy nhất một cột làm khóa'],
                ['id' => 'opt_d', 'content' => 'Tất cả các dòng phải được sắp xếp theo thứ tự tăng dần'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => '2NF loại bỏ phụ thuộc hàm một phần (Partial Dependency), nghĩa là thuộc tính không khóa không được phụ thuộc vào một phần của khóa chính phức hợp.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Dạng chuẩn 3 (3NF) loại bỏ loại phụ thuộc hàm nào khỏi quan hệ?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Phụ thuộc hàm bắc cầu (Transitive Dependency)'],
                ['id' => 'opt_b', 'content' => 'Phụ thuộc hàm một phần'],
                ['id' => 'opt_c', 'content' => 'Phụ thuộc đa trị (Multivalued Dependency)'],
                ['id' => 'opt_d', 'content' => 'Phụ thuộc nối kết (Join Dependency)'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => '3NF loại bỏ phụ thuộc bắc cầu (A -> B -> C với A là khóa, B và C là không khóa).',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'easy',
            'question_text' => 'Tính chất "A" (Atomicity - Tính nguyên tử) trong bộ tính chất ACID của giao dịch có ý nghĩa là gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Tất cả các thao tác trong giao dịch đều phải hoàn thành thành công hoặc không thao tác nào được áp dụng (All or Nothing)'],
                ['id' => 'opt_b', 'content' => 'Dữ liệu luôn bảo đảm đúng các ràng buộc toàn vẹn'],
                ['id' => 'opt_c', 'content' => 'Các giao dịch đồng thời không được nhìn thấy dữ liệu trung gian của nhau'],
                ['id' => 'opt_d', 'content' => 'Kết quả của giao dịch tồn tại bền vững ngay cả khi mất điện đột ngột'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Atomicity: Toàn bộ hoặc không gì cả (nếu lỗi ở bất kỳ bước nào, toàn bộ giao dịch sẽ bị ROLLBACK).',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Tính chất "I" (Isolation - Tính cô lập) trong ACID nhằm mục đích giải quyết rủi ro gì?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Ngăn chặn các hiện tượng bất thường khi có nhiều giao dịch thực thi đồng thời (Dirty Read, Non-repeatable Read, Phantom Read)'],
                ['id' => 'opt_b', 'content' => 'Tự động tạo bản sao lưu dữ liệu sang máy chủ khác'],
                ['id' => 'opt_c', 'content' => 'Đảm bảo khóa chính không chứa giá trị NULL'],
                ['id' => 'opt_d', 'content' => 'Tăng tốc độ ghi dữ liệu lên ổ đĩa SSD'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Isolation đảm bảo kết quả thực thi đồng thời nhiều giao dịch tương đương như khi chúng chạy tuần tự.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Hiện tượng "Dirty Read" (Đọc dữ liệu bẩn) trong hệ quản trị cơ sở dữ liệu xảy ra khi nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Giao dịch A đọc dữ liệu vừa được sửa bởi giao dịch B, nhưng sau đó giao dịch B lại bị ROLLBACK'],
                ['id' => 'opt_b', 'content' => 'Giao dịch A đọc một dòng hai lần và nhận được hai giá trị khác nhau do giao dịch B đã COMMIT sửa đổi'],
                ['id' => 'opt_c', 'content' => 'Giao dịch A thực hiện truy vấn khoảng hai lần và thấy xuất hiện thêm dòng mới do giao dịch B đã chèn'],
                ['id' => 'opt_d', 'content' => 'Dữ liệu trên đĩa cứng bị hỏng vật lý'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Dirty Read xảy ra ở mức cô lập Read Uncommitted khi đọc uncommitted changes của transaction khác.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Mức độ cô lập (Isolation Level) cao nhất trong chuẩn SQL ANSI/ISO là mức nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Serializable'],
                ['id' => 'opt_b', 'content' => 'Repeatable Read'],
                ['id' => 'opt_c', 'content' => 'Read Committed'],
                ['id' => 'opt_d', 'content' => 'Read Uncommitted'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'Serializable là mức cô lập cao nhất, loại trừ hoàn toàn Dirty Read, Non-repeatable Read và Phantom Read.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'easy',
            'question_text' => 'Quá trình phi chuẩn hóa (Denormalization) là việc chủ động gộp các bảng hoặc thêm thuộc tính dư thừa nhằm giảm bớt phép JOIN và tăng tốc độ đọc dữ liệu.',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. Denormalization là kỹ thuật đánh đổi dung lượng và tính toàn vẹn ghi để lấy tốc độ đọc tối đa cho các hệ thống OLAP hoặc tải đọc lớn.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::MULTIPLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Bộ 4 tính chất ACID của giao dịch cơ sở dữ liệu bao gồm những thành phần nào? (Chọn tất cả đáp án đúng)',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Atomicity (Tính nguyên tử)'],
                ['id' => 'opt_b', 'content' => 'Consistency (Tính nhất quán)'],
                ['id' => 'opt_c', 'content' => 'Isolation (Tính cô lập)'],
                ['id' => 'opt_d', 'content' => 'Durability (Tính bền vững)'],
            ],
            'correct_answer' => ['opt_a', 'opt_b', 'opt_c', 'opt_d'],
            'explanation' => 'ACID là từ viết tắt của Atomicity, Consistency, Isolation, Durability.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'hard',
            'question_text' => 'Kỹ thuật khóa bi quan (Pessimistic Locking) với mệnh đề SELECT ... FOR UPDATE trong SQL nên được sử dụng khi nào?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Trong các giao dịch xung yếu có nguy cơ tranh chấp cao (Race Condition) như đặt chỗ, trừ tiền ví hoặc nộp bài thi'],
                ['id' => 'opt_b', 'content' => 'Trong các truy vấn chỉ đọc báo cáo thống kê hàng tháng'],
                ['id' => 'opt_c', 'content' => 'Khi cơ sở dữ liệu chỉ có duy nhất một người dùng'],
                ['id' => 'opt_d', 'content' => 'Để thay thế hoàn toàn cho chỉ mục B-Tree'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'SELECT FOR UPDATE khóa hàng ở mức độ Row-Level Lock, ngăn các transaction khác đọc hoặc sửa đồng thời cho đến khi transaction kết thúc (COMMIT/ROLLBACK).',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::TRUE_FALSE,
            'difficulty' => 'medium',
            'question_text' => 'Dạng chuẩn Boyce-Codd (BCNF) nghiêm ngặt hơn 3NF vì yêu cầu với mọi phụ thuộc hàm không tầm thường X -> Y, vế trái X bắt buộc phải là một Siêu khóa (Superkey).',
            'options' => [
                ['id' => 'opt_true', 'content' => 'Đúng'],
                ['id' => 'opt_false', 'content' => 'Sai'],
            ],
            'correct_answer' => 'opt_true',
            'explanation' => 'Đúng. 3NF cho phép Y là thuộc tính khóa nguyên tố ngay cả khi X không phải siêu khóa. BCNF loại bỏ ngoại lệ này.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::SHORT_ANSWER,
            'difficulty' => 'easy',
            'question_text' => 'Viết từ viết tắt (4 ký tự) của bộ 4 tính chất bảo đảm an toàn cho các giao dịch trong hệ quản trị cơ sở dữ liệu.',
            'options' => [],
            'correct_answer' => 'ACID',
            'explanation' => 'ACID đại diện cho Atomicity, Consistency, Isolation, Durability.',
            'created_by' => $teacherMai->id,
        ];

        $questions[] = [
            'topic_id' => $topicAcid->id,
            'question_type' => QuestionType::SINGLE_CHOICE,
            'difficulty' => 'medium',
            'question_text' => 'Cơ chế Write-Ahead Logging (WAL) trong cơ sở dữ liệu giúp đảm bảo tính chất nào trong ACID?',
            'options' => [
                ['id' => 'opt_a', 'content' => 'Durability (Tính bền vững) và Atomicity (phục hồi khi gặp sự cố crash)'],
                ['id' => 'opt_b', 'content' => 'Isolation (Tính cô lập)'],
                ['id' => 'opt_c', 'content' => 'Chỉ định khóa chính tự động'],
                ['id' => 'opt_d', 'content' => 'Nén dữ liệu để giảm dung lượng đĩa'],
            ],
            'correct_answer' => 'opt_a',
            'explanation' => 'WAL ghi nhật ký thay đổi xuống đĩa trước khi ghi dữ liệu thực tế vào data file. Nếu sập nguồn, DBMS dùng log này để Redo các giao dịch đã commit và Undo các giao dịch dở dang.',
            'created_by' => $teacherMai->id,
        ];

        // Seed all questions using updateOrCreate to be idempotent
        $this->command->info('Seeding ' . count($questions) . ' real curriculum questions across 3 subjects...');

        foreach ($questions as $q) {
            Question::updateOrCreate(
                ['question_text' => $q['question_text']],
                [
                    'topic_id' => $q['topic_id'],
                    'question_type' => $q['question_type'],
                    'difficulty' => $q['difficulty'],
                    'options' => $q['options'],
                    'correct_answer' => $q['correct_answer'],
                    'explanation' => $q['explanation'],
                    'status' => QuestionStatus::READY,
                    'created_by' => $q['created_by'],
                    'source' => 'manual',
                ]
            );
        }

        $this->command->info('Successfully seeded ' . count($questions) . ' ready questions into the question bank!');
    }
}
