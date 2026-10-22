<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teacherNam = User::where('email', 'teacher@examplatform.local')->firstOrFail();
        $teacherMai = User::where('email', 'teacher.mai@examplatform.local')->firstOrFail();

        $subArch = Subject::where('code', 'IT4409')->firstOrFail();
        $subNet = Subject::where('code', 'IT3080')->firstOrFail();
        $subDb = Subject::where('code', 'IT3290')->firstOrFail();

        // 1. Đề thi Giữa kỳ Kiến trúc Máy tính
        $examArch = Exam::updateOrCreate(
            ['title' => 'Đề thi Giữa kỳ IT4409 - Kiến trúc Máy tính (Đề chuẩn A)'],
            [
                'subject_id' => $subArch->id,
                'created_by' => $teacherNam->id,
                'duration_minutes' => 60,
                'pass_score' => 5.0,
                'total_points' => 10.0,
                'shuffle_questions' => false,
                'shuffle_options' => true,
            ]
        );

        // Attach questions to Exam 1
        $archQuestions = Question::whereHas('topic', fn ($q) => $q->where('subject_id', $subArch->id))->get();
        $examArch->questions()->detach();

        $order = 1;
        $pointsMap = [
            1 => 1.25, // CPU acronym
            2 => 1.25, // Memory speed
            3 => 1.25, // Pipeline
            4 => 1.25, // DMA
            5 => 1.25, // RAM multiple choice
            6 => 1.25, // Cache L1 True/False
            7 => 2.50, // ALU short answer
        ];

        foreach ($archQuestions as $idx => $q) {
            $points = $pointsMap[$idx + 1] ?? 1.25;
            $examArch->questions()->attach($q->id, [
                'order' => $order++,
                'points' => $points,
            ]);
        }

        // 2. Đề thi Cuối kỳ Mạng Máy tính
        $examNet = Exam::updateOrCreate(
            ['title' => 'Đề thi Cuối kỳ IT3080 - Mạng Máy tính (Đề B)'],
            [
                'subject_id' => $subNet->id,
                'created_by' => $teacherNam->id,
                'duration_minutes' => 75,
                'pass_score' => 5.0,
                'total_points' => 10.0,
                'shuffle_questions' => true,
                'shuffle_options' => true,
            ]
        );

        $netQuestions = Question::whereHas('topic', fn ($q) => $q->where('subject_id', $subNet->id))->get();
        $examNet->questions()->detach();

        $order = 1;
        foreach ($netQuestions as $q) {
            $examNet->questions()->attach($q->id, [
                'order' => $order++,
                'points' => 1.5,
            ]);
        }

        // 3. Đề thi CSDL
        $examDb = Exam::updateOrCreate(
            ['title' => 'Kiểm tra Giữa kỳ IT3290 - Cơ sở Dữ liệu Quan hệ'],
            [
                'subject_id' => $subDb->id,
                'created_by' => $teacherMai->id,
                'duration_minutes' => 45,
                'pass_score' => 5.0,
                'total_points' => 10.0,
                'shuffle_questions' => false,
                'shuffle_options' => false,
            ]
        );

        $dbQuestions = Question::whereHas('topic', fn ($q) => $q->where('subject_id', $subDb->id))->get();
        $examDb->questions()->detach();

        $order = 1;
        foreach ($dbQuestions as $q) {
            $examDb->questions()->attach($q->id, [
                'order' => $order++,
                'points' => 2.5,
            ]);
        }
    }
}
