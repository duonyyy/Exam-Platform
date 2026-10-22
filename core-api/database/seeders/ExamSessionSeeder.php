<?php

namespace Database\Seeders;

use App\Enums\ExamAttemptStatus;
use App\Enums\ExamSessionStatus;
use App\Enums\ProctoringEventType;
use App\Enums\ProctoringSeverity;
use App\Models\AttemptAnswer;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\ProctoringEvent;
use App\Models\SessionAssignment;
use App\Models\SessionTeacher;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ExamSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teacherNam = User::where('email', 'teacher@examplatform.local')->firstOrFail();
        $teacherMai = User::where('email', 'teacher.mai@examplatform.local')->firstOrFail();
        $teacherKhoa = User::where('email', 'teacher.khoa@examplatform.local')->firstOrFail();

        $examArch = Exam::where('title', 'like', '%IT4409%')->firstOrFail();
        $examNet = Exam::where('title', 'like', '%IT3080%')->firstOrFail();
        $examDb = Exam::where('title', 'like', '%IT3290%')->firstOrFail();

        $students = User::where('role', 'student')->orderBy('id')->get();

        // =========================================================================
        // CA THI 1: IT4409-K21-GK (ĐÃ ĐÓNG - CÓ BẢNG ĐIỂM, PHỔ ĐIỂM, PHÂN TÍCH CÂU HỎI)
        // =========================================================================
        $sessionClosed = ExamSession::updateOrCreate(
            ['title' => 'IT4409-K21-GK: Ca thi Giữa kỳ Kiến trúc Máy tính (Phòng máy 302)'],
            [
                'exam_id' => $examArch->id,
                'created_by' => $teacherNam->id,
                'status' => ExamSessionStatus::CLOSED,
                'start_at' => Carbon::now()->subHours(3),
                'end_at' => Carbon::now()->subHour(),
                'allow_late_minutes' => 15,
                'max_attempts' => 1,
                'show_result_immediately' => true,
            ]
        );

        // Phân công cán bộ coi thi
        SessionTeacher::updateOrCreate(
            ['exam_session_id' => $sessionClosed->id, 'teacher_id' => $teacherNam->id],
            ['role_in_session' => 'head_proctor']
        );
        SessionTeacher::updateOrCreate(
            ['exam_session_id' => $sessionClosed->id, 'teacher_id' => $teacherKhoa->id],
            ['role_in_session' => 'proctor']
        );

        // Phân công 15 sinh viên (từ SV01 đến SV15)
        $assignedStudents1 = $students->take(15);
        foreach ($assignedStudents1 as $st) {
            SessionAssignment::firstOrCreate(
                ['exam_session_id' => $sessionClosed->id, 'student_id' => $st->id],
                ['assigned_at' => Carbon::now()->subDays(2)]
            );
        }

        // Lấy danh sách câu hỏi của Đề thi Kiến trúc
        $archQuestions = $examArch->questions()->orderBy('exam_questions.order')->get();

        // 12 sinh viên nộp bài với phổ điểm hình chuông (từ 3.75đ đến 9.75đ)
        $scoreMatrix = [
            0 => ['score' => 9.75, 'correct_rate' => 1.0,  'violations' => 0], // SV01 - Xuất sắc
            1 => ['score' => 9.25, 'correct_rate' => 0.95, 'violations' => 1], // SV02 - Xuất sắc
            2 => ['score' => 8.75, 'correct_rate' => 0.90, 'violations' => 0], // SV03 - Giỏi
            3 => ['score' => 8.50, 'correct_rate' => 0.85, 'violations' => 0], // SV04 - Giỏi
            4 => ['score' => 8.00, 'correct_rate' => 0.80, 'violations' => 2], // SV05 - Giỏi
            5 => ['score' => 7.75, 'correct_rate' => 0.75, 'violations' => 0], // SV06 - Khá
            6 => ['score' => 7.25, 'correct_rate' => 0.70, 'violations' => 0], // SV07 - Khá
            7 => ['score' => 6.75, 'correct_rate' => 0.65, 'violations' => 0], // SV08 - Khá
            8 => ['score' => 6.50, 'correct_rate' => 0.65, 'violations' => 1], // SV09 - Khá
            9 => ['score' => 5.50, 'correct_rate' => 0.55, 'violations' => 0], // SV10 - Trung bình
            10 => ['score' => 4.50, 'correct_rate' => 0.45, 'violations' => 0], // SV11 - Yếu (Trượt)
            11 => ['score' => 3.75, 'correct_rate' => 0.35, 'violations' => 3], // SV12 - Yếu (Trượt)
        ];

        foreach ($scoreMatrix as $idx => $meta) {
            $student = $assignedStudents1[$idx];
            $attempt = ExamAttempt::updateOrCreate(
                [
                    'exam_session_id' => $sessionClosed->id,
                    'student_id' => $student->id,
                    'attempt_number' => 1,
                ],
                [
                    'status' => ExamAttemptStatus::SUBMITTED,
                    'started_at' => Carbon::now()->subHours(2)->subMinutes(50)->addMinutes($idx),
                    'submitted_at' => Carbon::now()->subHours(1)->subMinutes(10)->addMinutes($idx),
                    'score' => $meta['score'],
                    'total_points' => 10.0,
                ]
            );

            // Sinh đáp án từng câu
            foreach ($archQuestions as $qIdx => $q) {
                // Nhóm điểm cao (idx < 4) làm đúng câu khó; nhóm điểm thấp làm sai
                $isCorrect = ($idx < 6 && $qIdx < 5) || ($idx < 3) || ($qIdx === 0);
                $points = (float) ($q->pivot?->getAttribute('points') ?? 1.25);

                $selectedOpt = $isCorrect ? $q->correct_answer : ['opt_dummy_wrong'];
                if ($q->question_type->value === 'short_answer') {
                    $selectedOpt = $isCorrect ? 'ALU' : 'CPU';
                }

                AttemptAnswer::updateOrCreate(
                    [
                        'attempt_id' => $attempt->id,
                        'question_id' => $q->id,
                    ],
                    [
                        'selected_options' => is_array($selectedOpt) ? $selectedOpt : [$selectedOpt],
                        'awarded_points' => $isCorrect ? $points : 0.0,
                        'is_correct' => $isCorrect,
                    ]
                );
            }

            // Sinh vi phạm proctoring nếu có
            if ($meta['violations'] > 0) {
                ProctoringEvent::create([
                    'attempt_id' => $attempt->id,
                    'event_type' => ProctoringEventType::TAB_HIDDEN,
                    'severity' => ProctoringSeverity::MEDIUM,
                    'occurred_at' => $attempt->started_at->addMinutes(15),
                    'metadata' => ['duration_seconds' => 12],
                ]);

                if ($meta['violations'] >= 2) {
                    ProctoringEvent::create([
                        'attempt_id' => $attempt->id,
                        'event_type' => ProctoringEventType::FULLSCREEN_EXIT,
                        'severity' => ProctoringSeverity::MEDIUM,
                        'occurred_at' => $attempt->started_at->addMinutes(25),
                        'metadata' => ['trigger' => 'user_keypress_esc'],
                    ]);
                }

                if ($meta['violations'] >= 3) {
                    ProctoringEvent::create([
                        'attempt_id' => $attempt->id,
                        'event_type' => ProctoringEventType::COPY_PASTE_ATTEMPT,
                        'severity' => ProctoringSeverity::HIGH,
                        'occurred_at' => $attempt->started_at->addMinutes(35),
                        'metadata' => ['action' => 'paste_blocked'],
                    ]);
                }
            }
        }

        // 1 sinh viên (SV13) đang làm bài (in_progress)
        $student13 = $assignedStudents1[12];
        ExamAttempt::updateOrCreate(
            [
                'exam_session_id' => $sessionClosed->id,
                'student_id' => $student13->id,
                'attempt_number' => 1,
            ],
            [
                'status' => ExamAttemptStatus::IN_PROGRESS,
                'started_at' => Carbon::now()->subMinutes(40),
                'submitted_at' => null,
                'score' => null,
                'total_points' => 10.0,
            ]
        );

        // SV14 và SV15: Không có attempt (Vắng thi - Absent)

        // =========================================================================
        // CA THI 2: IT3080-K21-CK (ĐANG MỞ PUBLISHED - ĐỂ TEST THỰC CHIẾN LÀM BÀI)
        // =========================================================================
        $sessionOpen = ExamSession::updateOrCreate(
            ['title' => 'IT3080-K21-CK: Thi Trực Tuyến Mạng Máy Tính (Ca Chiều - Đang mở)'],
            [
                'exam_id' => $examNet->id,
                'created_by' => $teacherNam->id,
                'status' => ExamSessionStatus::PUBLISHED,
                'start_at' => Carbon::now()->subMinutes(15),
                'end_at' => Carbon::now()->addHours(2),
                'allow_late_minutes' => 30,
                'max_attempts' => 1,
                'show_result_immediately' => true,
            ]
        );

        SessionTeacher::updateOrCreate(
            ['exam_session_id' => $sessionOpen->id, 'teacher_id' => $teacherNam->id],
            ['role_in_session' => 'head_proctor']
        );

        // Gán demo student (SV20260001) và các bạn từ SV16 -> SV20
        $assignedStudents2 = collect([$students[0]])->merge($students->slice(15, 5));
        foreach ($assignedStudents2 as $st) {
            SessionAssignment::firstOrCreate(
                ['exam_session_id' => $sessionOpen->id, 'student_id' => $st->id],
                ['assigned_at' => Carbon::now()->subDays(1)]
            );
        }

        // =========================================================================
        // CA THI 3: IT3290-K21-KT (BẢN NHÁP DRAFT - ĐỂ TEST PUBLISH / EDIT)
        // =========================================================================
        $sessionDraft = ExamSession::updateOrCreate(
            ['title' => 'IT3290-K21-KT: Kiểm tra Đột xuất CSDL (Bản nháp - Draft)'],
            [
                'exam_id' => $examDb->id,
                'created_by' => $teacherMai->id,
                'status' => ExamSessionStatus::DRAFT,
                'start_at' => Carbon::now()->addDays(2)->setHour(8)->setMinute(0),
                'end_at' => Carbon::now()->addDays(2)->setHour(9)->setMinute(0),
                'allow_late_minutes' => 15,
                'max_attempts' => 1,
                'show_result_immediately' => true,
            ]
        );

        SessionTeacher::updateOrCreate(
            ['exam_session_id' => $sessionDraft->id, 'teacher_id' => $teacherMai->id],
            ['role_in_session' => 'head_proctor']
        );

        // Gán 5 sinh viên dự thảo
        foreach ($students->take(5) as $st) {
            SessionAssignment::firstOrCreate(
                ['exam_session_id' => $sessionDraft->id, 'student_id' => $st->id],
                ['assigned_at' => now()]
            );
        }
    }
}
