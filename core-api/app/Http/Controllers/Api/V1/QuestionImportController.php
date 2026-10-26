<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Questions\QuestionImportRequest;
use App\Http\Requests\Questions\ValidateQuestionImportRequest;
use App\Models\Question;
use App\Models\User;
use App\Services\Excel\QuestionImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class QuestionImportController extends Controller
{
    public function __construct(
        private readonly QuestionImportService $importService
    ) {}

    /**
     * Download standard question import template in Excel (.xlsx) format.
     */
    public function template(Request $request): Response
    {
        Gate::authorize('create', Question::class);

        $topicId = $request->query('topic_id') ? (int) $request->query('topic_id') : null;
        $binary = $this->importService->generateTemplate($topicId);

        $filename = 'exam_platform_questions_template.xlsx';

        return response($binary, HttpResponse::HTTP_OK, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'no-cache, private',
        ]);
    }

    /**
     * Validate uploaded Excel file, return syntax check and row previews.
     */
    public function validateImport(ValidateQuestionImportRequest $request): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var UploadedFile $file */
        $file = $request->file('file');
        /** @var int|null $topicId */
        $topicId = $request->validated('topic_id');

        $result = $this->importService->validateExcel($file, $topicId, $actor);

        return response()->json([
            'message' => 'Thẩm định file câu hỏi hoàn tất.',
            'data' => [
                'total_rows' => $result['total_rows'],
                'valid_count' => $result['valid_count'],
                'invalid_count' => $result['invalid_count'],
                'errors' => $result['errors'],
                'preview' => $result['preview'],
            ],
        ], HttpResponse::HTTP_OK);
    }

    /**
     * Execute bulk import of validated questions into database.
     */
    public function import(QuestionImportRequest $request): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var UploadedFile $file */
        $file = $request->file('file');
        /** @var int|null $topicId */
        $topicId = $request->validated('topic_id');

        $result = $this->importService->import($file, $topicId, $actor);

        return response()->json([
            'message' => "Nạp thành công {$result['imported_count']} câu hỏi vào ngân hàng đề.",
            'data' => $result,
        ], HttpResponse::HTTP_CREATED);
    }
}
