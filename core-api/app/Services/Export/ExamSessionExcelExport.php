<?php

namespace App\Services\Export;

use App\Models\ExamSession;
use App\Services\Analytics\SessionAnalyticsService;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;

class ExamSessionExcelExport
{
    public function __construct(
        private readonly SessionAnalyticsService $analyticsService
    ) {}

    /**
     * Export complete Exam Session results to Excel spreadsheet.
     */
    public function export(ExamSession $session): string
    {
        $session->loadMissing(['exam.subject', 'exam.questions', 'sessionTeachers.teacher']);
        $report = $this->analyticsService->generateReport($session, ['per_page' => 10000]);

        $spreadsheet = new Spreadsheet;

        // -------------------------------------------------------------
        // Sheet 0: Bảng Điểm Thí Sinh (Scoreboard)
        // -------------------------------------------------------------
        $sheet0 = $spreadsheet->getActiveSheet();
        $sheet0->setTitle('BangDiemThiSinh');

        // Title & Metadata
        $sheet0->setCellValue('A1', 'HỆ THỐNG KHẢO THÍ TRỰC TUYẾN — BẢNG ĐIỂM CHÍNH THỨC');
        $sheet0->mergeCells('A1:K1');
        $sheet0->getStyle('A1')->getFont()->setBold(true)->setSize(16)->setColor(new Color('1E3A8A'));
        $sheet0->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $examTitle = $session->exam ? $session->exam->title : 'Đề thi';
        $subjectName = $session->exam?->subject ? $session->exam->subject->name : 'Môn học';
        $subjectCode = $session->exam?->subject ? $session->exam->subject->code : '';
        $sheet0->setCellValue('A2', "Ca thi: {$session->title} | Đề thi: {$examTitle} | Môn học: {$subjectName} ({$subjectCode})");
        $sheet0->mergeCells('A2:K2');
        $sheet0->getStyle('A2')->getFont()->setSize(11)->setBold(true);
        $sheet0->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $startTimeStr = $session->start_at->format('d/m/Y H:i');
        $endTimeStr = $session->end_at->format('H:i');
        $duration = $session->exam ? $session->exam->duration_minutes : 0;
        $totalPoints = $report['session']['exam']['total_points'] ?? 10.0;
        $passScore = $report['session']['exam']['pass_score'] ?? 0.0;

        $sheet0->setCellValue('A3', "Thời gian: {$startTimeStr} - {$endTimeStr} | Thời lượng: {$duration} phút | Thang điểm: {$totalPoints} | Điểm sàn đạt: {$passScore}");
        $sheet0->mergeCells('A3:K3');
        $sheet0->getStyle('A3')->getFont()->setSize(10)->setItalic(true);
        $sheet0->getStyle('A3')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Table Header
        $tableHeaders = [
            'STT',
            'Mã Sinh Viên',
            'Họ và Tên',
            'Email',
            'Trạng Thái',
            'Điểm Số',
            'Thang Điểm',
            'Kết Quả',
            'Xếp Loại',
            'Thời Gian Làm Bài',
            'Số Vi Phạm',
        ];

        $sheet0->fromArray($tableHeaders, null, 'A5');
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1E3A8A']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '0F172A']]],
        ];
        $sheet0->getStyle('A5:K5')->applyFromArray($headerStyle);
        $sheet0->getRowDimension(5)->setRowHeight(28);

        // Populate Rows
        $currentRow = 6;
        $stt = 1;
        /** @var array<int, array<string, mixed>> $scoreboardItems */
        $scoreboardItems = $report['scoreboard'] ?? [];

        foreach ($scoreboardItems as $row) {
            $statusLabel = match ($row['status']) {
                'submitted' => 'Đã nộp bài',
                'in_progress' => 'Đang làm bài',
                default => 'Vắng thi',
            };

            $scoreDisplay = $row['score'] !== null ? (float) $row['score'] : null;
            $resultLabel = $row['is_passed'] === true ? 'ĐẠT' : ($row['is_passed'] === false ? 'HỎNG' : '-');
            $gradeLabel = $row['classification'] ?? '-';

            $durationFormatted = '-';
            if ($row['duration_seconds'] !== null) {
                $mins = intdiv((int) $row['duration_seconds'], 60);
                $secs = (int) $row['duration_seconds'] % 60;
                $durationFormatted = sprintf('%02dm %02ds', $mins, $secs);
            }

            $violations = (int) ($row['violations_count'] ?? 0);

            $rowData = [
                $stt++,
                'SV'.$row['student_id'],
                $row['student_name'],
                $row['student_email'],
                $statusLabel,
                $scoreDisplay,
                $totalPoints,
                $resultLabel,
                $gradeLabel,
                $durationFormatted,
                $violations,
            ];

            $sheet0->fromArray($rowData, null, "A{$currentRow}");

            // Row cell alignment
            $sheet0->getStyle("A{$currentRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet0->getStyle("B{$currentRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet0->getStyle("E{$currentRow}:I{$currentRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet0->getStyle("J{$currentRow}:K{$currentRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            // Conditional styling for Passed/Failed
            if ($resultLabel === 'ĐẠT') {
                $sheet0->getStyle("H{$currentRow}")->getFont()->setBold(true)->setColor(new Color('16A34A'));
            } elseif ($resultLabel === 'HỎNG') {
                $sheet0->getStyle("H{$currentRow}")->getFont()->setBold(true)->setColor(new Color('DC2626'));
            }

            // High violation warning color
            if ($violations > 0) {
                $sheet0->getStyle("K{$currentRow}")->getFont()->setBold(true)->setColor(new Color('DC2626'));
            }

            $currentRow++;
        }

        // Apply grid borders
        $lastRow = max(6, $currentRow - 1);
        $gridStyle = [
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'CBD5E1']]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ];
        $sheet0->getStyle("A6:K{$lastRow}")->applyFromArray($gridStyle);

        foreach (range(1, count($tableHeaders)) as $colIndex) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $sheet0->getColumnDimension($colLetter)->setAutoSize(true);
        }

        // -------------------------------------------------------------
        // Sheet 1: Thống Kê & Phổ Điểm (Statistics & Histogram)
        // -------------------------------------------------------------
        $sheet1 = $spreadsheet->createSheet();
        $sheet1->setTitle('ThongKePhoDiem');

        // Summary Header
        $sheet1->setCellValue('A1', 'THỐNG KÊ TỔNG QUAN CA THI');
        $sheet1->mergeCells('A1:D1');
        $sheet1->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new Color('1E3A8A'));

        $summary = $report['summary'] ?? [];
        $stats = $report['statistics'] ?? [];

        $summaryData = [
            ['Chỉ số khảo thí', 'Số lượng', 'Tỷ lệ %', 'Ghi chú'],
            ['Tổng số thí sinh phân công', $summary['total_assigned'] ?? 0, '100%', 'Danh sách chính thức'],
            ['Số thí sinh tham gia làm bài', $summary['total_participants'] ?? 0, ($summary['attendance_rate'] ?? 0).'%', 'Đã mở đề thi'],
            ['Số bài thi đã nộp hợp lệ', $summary['total_submitted'] ?? 0, ($summary['total_assigned'] > 0 ? round((($summary['total_submitted'] ?? 0) / $summary['total_assigned']) * 100, 2) : 0).'%', 'Đã ghi nhận điểm'],
            ['Số thí sinh vắng mặt', $summary['total_absent'] ?? 0, ($summary['total_assigned'] > 0 ? round((($summary['total_absent'] ?? 0) / $summary['total_assigned']) * 100, 2) : 0).'%', 'Không vào phòng thi'],
        ];
        $sheet1->fromArray($summaryData, null, 'A3');
        $sheet1->getStyle('A3:D3')->applyFromArray($headerStyle);
        $sheet1->getStyle('A4:D7')->applyFromArray($gridStyle);

        // Score Distribution Metrics
        $sheet1->setCellValue('A9', 'CHỈ SỐ THỐNG KÊ PHỔ ĐIỂM');
        $sheet1->mergeCells('A9:D9');
        $sheet1->getStyle('A9')->getFont()->setBold(true)->setSize(14)->setColor(new Color('1E3A8A'));

        $scoreStatsData = [
            ['Tham số thống kê', 'Giá trị', 'Đơn vị tính', 'Đánh giá học thuật'],
            ['Điểm số cao nhất (Max)', $stats['max_score'] ?? '-', 'Điểm', 'Thành tích xuất sắc nhất'],
            ['Điểm số thấp nhất (Min)', $stats['min_score'] ?? '-', 'Điểm', 'Điểm số thấp nhất'],
            ['Điểm trung bình (Mean)', $stats['avg_score'] ?? '-', 'Điểm', 'Năng lực trung bình'],
            ['Điểm trung vị (Median)', $stats['median_score'] ?? '-', 'Điểm', 'Mốc điểm chia đôi nhóm'],
            ['Độ lệch chuẩn (Std Dev)', $stats['std_deviation'] ?? '-', 'Điểm', 'Độ phân tán năng lực'],
            ['Số lượng thí sinh đạt (>= Sàn)', $stats['passed_count'] ?? 0, 'Thí sinh', 'Tỷ lệ: '.($stats['pass_rate'] ?? 0).'%'],
            ['Số lượng thí sinh không đạt', $stats['failed_count'] ?? 0, 'Thí sinh', 'Tỷ lệ: '.($stats['fail_rate'] ?? 0).'%'],
        ];
        $sheet1->fromArray($scoreStatsData, null, 'A11');
        $sheet1->getStyle('A11:D11')->applyFromArray($headerStyle);
        $sheet1->getStyle('A12:D18')->applyFromArray($gridStyle);

        // Score Histogram Table
        $sheet1->setCellValue('A20', 'PHỔ ĐIỂM CHI TIẾT THEO KHOẢNG (HISTOGRAM BUCKETS)');
        $sheet1->mergeCells('A20:D20');
        $sheet1->getStyle('A20')->getFont()->setBold(true)->setSize(14)->setColor(new Color('1E3A8A'));

        $histogramHeaders = ['Khoảng Điểm', 'Mốc Tối Thiểu', 'Mốc Tối Đa', 'Số Lượng Thí Sinh', 'Tỷ Lệ Phần Trăm'];
        $sheet1->fromArray($histogramHeaders, null, 'A22');
        $sheet1->getStyle('A22:E22')->applyFromArray($headerStyle);

        $histRow = 23;
        /** @var array<int, array<string, mixed>> $buckets */
        $buckets = $report['histogram'] ?? [];
        foreach ($buckets as $b) {
            $sheet1->fromArray([
                $b['range'],
                $b['min'],
                $b['max'],
                $b['count'],
                ($b['percentage'] ?? 0).'%',
            ], null, "A{$histRow}");
            $sheet1->getStyle("A{$histRow}:E{$histRow}")->applyFromArray($gridStyle);
            $sheet1->getStyle("B{$histRow}:E{$histRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $histRow++;
        }

        foreach (range(1, 5) as $colIndex) {
            $sheet1->getColumnDimension(Coordinate::stringFromColumnIndex($colIndex))->setAutoSize(true);
        }

        // -------------------------------------------------------------
        // Sheet 2: Phân Tích Chất Lượng Câu Hỏi (Item Analysis)
        // -------------------------------------------------------------
        $sheet2 = $spreadsheet->createSheet();
        $sheet2->setTitle('PhanTichCauHoi');

        $sheet2->setCellValue('A1', 'PHÂN TÍCH CHẤT LƯỢNG NGÂN HÀNG ĐỀ THI (ITEM ANALYSIS)');
        $sheet2->mergeCells('A1:K1');
        $sheet2->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new Color('1E3A8A'));

        $itemHeaders = [
            'Câu Số',
            'Mã Câu Hỏi',
            'Nội Dung Câu Hỏi',
            'Loại Câu Hỏi',
            'Thang Điểm',
            'Lượt Trả Lời',
            'Số Lượt Đúng',
            'Số Lượt Sai',
            'Độ Khó P',
            'Đánh Giá Độ Khó',
            'Độ Phân Biệt D',
            'Đánh Giá Phân Biệt',
        ];
        $sheet2->fromArray($itemHeaders, null, 'A3');
        $sheet2->getStyle('A3:L3')->applyFromArray($headerStyle);
        $sheet2->getRowDimension(3)->setRowHeight(28);

        $itemRow = 4;
        /** @var array<int, array<string, mixed>> $questionItems */
        $questionItems = $report['question_analysis'] ?? [];
        foreach ($questionItems as $idx => $q) {
            $diffText = match ($q['difficulty_level'] ?? '') {
                'easy' => 'Dễ (P >= 0.8)',
                'medium' => 'Trung bình (0.3 <= P < 0.8)',
                'hard' => 'Khó (P < 0.3)',
                default => 'Chưa đủ dữ liệu',
            };

            $discText = match ($q['discrimination_level'] ?? '') {
                'excellent' => 'Rất tốt (D >= 0.4)',
                'good' => 'Tốt (0.3 <= D < 0.4)',
                'fair' => 'Tạm được (0.2 <= D < 0.3)',
                'poor' => 'Kém (0 <= D < 0.2)',
                'negative' => 'Tiêu cực (D < 0 - Cần loại bỏ)',
                default => 'Chưa đủ dữ liệu',
            };

            $sheet2->fromArray([
                $q['order'] ?? ($idx + 1),
                'Q-'.$q['question_id'],
                $q['question_text'],
                $q['question_type'],
                $q['points'],
                $q['total_answers'],
                $q['correct_answers'],
                $q['incorrect_answers'],
                $q['difficulty_index'] !== null ? $q['difficulty_index'] : '-',
                $diffText,
                $q['discrimination_index'] !== null ? $q['discrimination_index'] : '-',
                $discText,
            ], null, "A{$itemRow}");

            $sheet2->getStyle("A{$itemRow}:L{$itemRow}")->applyFromArray($gridStyle);
            $sheet2->getStyle("A{$itemRow}:B{$itemRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet2->getStyle("D{$itemRow}:L{$itemRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            // Warning for negative discrimination
            if (($q['discrimination_level'] ?? '') === 'negative') {
                $sheet2->getStyle("K{$itemRow}:L{$itemRow}")->getFont()->setBold(true)->setColor(new Color('DC2626'));
            }

            $itemRow++;
        }

        foreach (range(1, 12) as $colIndex) {
            $sheet2->getColumnDimension(Coordinate::stringFromColumnIndex($colIndex))->setAutoSize(true);
        }

        // Return focus to Sheet 0
        $spreadsheet->setActiveSheetIndex(0);

        // Output binary
        $writer = new XlsxWriter($spreadsheet);
        ob_start();
        $writer->save('php://output');

        return (string) ob_get_clean();
    }
}
