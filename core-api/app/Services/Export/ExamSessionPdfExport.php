<?php

namespace App\Services\Export;

use App\Models\ExamSession;
use App\Services\Analytics\SessionAnalyticsService;
use Barryvdh\DomPDF\Facade\Pdf;

class ExamSessionPdfExport
{
    public function __construct(
        private readonly SessionAnalyticsService $analyticsService
    ) {}

    /**
     * Generate official Exam Session PDF report and return raw PDF binary string.
     */
    public function export(ExamSession $session): string
    {
        $session->loadMissing(['exam.subject', 'exam.questions', 'sessionTeachers.teacher']);
        $report = $this->analyticsService->generateReport($session, ['per_page' => 10000]);

        $pdf = Pdf::loadView('exports.exam-session-report', [
            'session' => $session,
            'report' => $report,
            'generatedAt' => now()->format('d/m/Y H:i:s'),
        ]);

        $pdf->setPaper('a4', 'landscape');
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isRemoteEnabled', false);

        return $pdf->output();
    }
}
