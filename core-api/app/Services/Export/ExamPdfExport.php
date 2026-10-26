<?php

namespace App\Services\Export;

use App\Models\Exam;
use Barryvdh\DomPDF\Facade\Pdf;

class ExamPdfExport
{
    /**
     * Generate official Exam paper PDF and return raw PDF binary string.
     */
    public function export(Exam $exam, bool $includeAnswers = false): string
    {
        $exam->loadMissing([
            'subject',
            'questions' => function ($query) {
                $query->orderBy('exam_questions.order');
            },
        ]);

        $pdf = Pdf::loadView('exports.exam-paper', [
            'exam' => $exam,
            'includeAnswers' => $includeAnswers,
            'generatedAt' => now()->format('d/m/Y H:i:s'),
        ]);

        $pdf->setPaper('a4', 'portrait');
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isRemoteEnabled', false);

        return $pdf->output();
    }
}
