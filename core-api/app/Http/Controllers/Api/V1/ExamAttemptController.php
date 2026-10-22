<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Attempts\SaveAttemptAnswerAction;
use App\Actions\Attempts\StartExamAttemptAction;
use App\Actions\Attempts\SubmitExamAttemptAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Attempts\SaveAttemptAnswerRequest;
use App\Http\Requests\Attempts\SubmitExamAttemptRequest;
use App\Http\Resources\AttemptAnswerResource;
use App\Http\Resources\ExamAttemptDetailResource;
use App\Http\Resources\ExamAttemptSubmitResource;
use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class ExamAttemptController extends Controller
{
    public function start(Request $request, ExamSession $examSession, StartExamAttemptAction $action): JsonResponse
    {
        /** @var User $student */
        $student = $request->user();

        $attempt = $action->handle($examSession, $student);
        $attempt->loadMissing(['session.exam.questions', 'answers']);

        $statusCode = $attempt->wasRecentlyCreated ? Response::HTTP_CREATED : Response::HTTP_OK;

        return (new ExamAttemptDetailResource($attempt))
            ->response()
            ->setStatusCode($statusCode);
    }

    public function show(Request $request, ExamAttempt $examAttempt): JsonResponse
    {
        Gate::authorize('view', $examAttempt);

        $examAttempt->loadMissing(['session.exam.questions', 'answers']);

        return (new ExamAttemptDetailResource($examAttempt))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function saveAnswer(
        SaveAttemptAnswerRequest $request,
        ExamAttempt $examAttempt,
        SaveAttemptAnswerAction $action
    ): JsonResponse {
        /** @var User $student */
        $student = $request->user();

        $answer = $action->handle(
            $examAttempt,
            (int) $request->validated('question_id'),
            $request->validated('selected_options'),
            $student
        );

        return (new AttemptAnswerResource($answer))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function submit(
        SubmitExamAttemptRequest $request,
        ExamAttempt $examAttempt,
        SubmitExamAttemptAction $action
    ): JsonResponse {
        /** @var User $student */
        $student = $request->user();

        $idempotencyKey = $request->header('Idempotency-Key');

        /** @var array<int, array{question_id: int, selected_options?: mixed, answer?: mixed}> $finalAnswers */
        $finalAnswers = $request->validated('final_answers', []);

        $attempt = $action->handle(
            $examAttempt,
            $finalAnswers,
            $student,
            is_string($idempotencyKey) ? $idempotencyKey : null
        );

        $attempt->loadMissing(['session.exam.questions', 'answers']);

        return (new ExamAttemptSubmitResource($attempt))
            ->additional(['message' => 'Nộp bài thi thành công.'])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
