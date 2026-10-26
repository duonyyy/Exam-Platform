<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Exams\ExportExamPdfRequest;
use App\Models\Exam;
use App\Models\ExamSession;
use App\Services\Export\ExamPdfExport;
use App\Services\Export\ExamSessionExcelExport;
use App\Services\Export\ExamSessionPdfExport;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class ExamExportController extends Controller
{
    public function __construct(
        private readonly ExamSessionExcelExport $sessionExcelExport,
        private readonly ExamSessionPdfExport $sessionPdfExport,
        private readonly ExamPdfExport $examPdfExport
    ) {}

    /**
     * Export complete Exam Session scoreboard and analytics to Excel (.xlsx).
     */
    public function exportSessionExcel(Request $request, ExamSession $examSession): Response
    {
        $examSession->loadMissing(['exam.subject', 'sessionTeachers']);
        Gate::authorize('exportResults', $examSession);

        $binary = $this->sessionExcelExport->export($examSession);
        $filename = "bang-diem-ca-thi-{$examSession->id}.xlsx";

        return response($binary, HttpResponse::HTTP_OK, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'no-cache, private',
        ]);
    }

    /**
     * Export official Exam Session report & attendance protocol to PDF.
     */
    public function exportSessionPdf(Request $request, ExamSession $examSession): Response
    {
        $examSession->loadMissing(['exam.subject', 'sessionTeachers']);
        Gate::authorize('exportResults', $examSession);

        $binary = $this->sessionPdfExport->export($examSession);
        $filename = "bien-ban-ca-thi-{$examSession->id}.pdf";

        return response($binary, HttpResponse::HTTP_OK, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'no-cache, private',
        ]);
    }

    /**
     * Export Exam paper to PDF (with or without answer key).
     */
    public function exportExamPdf(ExportExamPdfRequest $request, Exam $exam): Response
    {
        $exam->loadMissing(['subject']);
        Gate::authorize('exportPdf', $exam);

        $includeAnswers = $request->boolean('include_answers', false);
        $binary = $this->examPdfExport->export($exam, $includeAnswers);

        $typeSuffix = $includeAnswers ? '-co-dap-an' : '';
        $filename = "de-thi-{$exam->id}{$typeSuffix}.pdf";

        return response($binary, HttpResponse::HTTP_OK, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'no-cache, private',
        ]);
    }
}
