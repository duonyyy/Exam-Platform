<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Proctoring\RecordProctoringEventAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Proctoring\RecordProctoringEventRequest;
use App\Http\Resources\ProctoringEventResource;
use App\Http\Resources\ProctoringSummaryResource;
use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class ProctoringEventController extends Controller
{
    /**
     * Record proctoring event(s) from student exam room.
     */
    public function record(
        RecordProctoringEventRequest $request,
        ExamAttempt $examAttempt,
        RecordProctoringEventAction $action
    ): JsonResponse {
        Gate::authorize('recordProctoring', $examAttempt);

        /** @var User $student */
        $student = $request->user();

        $result = $action->handle($examAttempt, $request->validated(), $student);

        if ($result instanceof Collection) {
            return ProctoringEventResource::collection($result)
                ->additional(['message' => 'Ghi nhận các sự kiện giám sát thành công.'])
                ->response()
                ->setStatusCode(Response::HTTP_CREATED);
        }

        return (new ProctoringEventResource($result))
            ->additional(['message' => 'Ghi nhận sự kiện giám sát thành công.'])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * View summary of all proctoring violations in an exam session.
     */
    public function summary(Request $request, ExamSession $examSession): JsonResponse
    {
        Gate::authorize('viewProctoring', $examSession);

        return (new ProctoringSummaryResource($examSession))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * View detailed paginated proctoring events for an exam session.
     */
    public function index(Request $request, ExamSession $examSession): AnonymousResourceCollection
    {
        Gate::authorize('viewProctoring', $examSession);

        $query = $examSession->proctoringEvents()
            ->with(['attempt.student'])
            ->latest('occurred_at');

        if ($request->filled('severity')) {
            $query->where('proctoring_events.severity', $request->query('severity'));
        }

        if ($request->filled('event_type')) {
            $query->where('proctoring_events.event_type', $request->query('event_type'));
        }

        if ($request->filled('attempt_id')) {
            $query->where('proctoring_events.attempt_id', (int) $request->query('attempt_id'));
        }

        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);
        $events = $query->paginate($perPage);

        return ProctoringEventResource::collection($events);
    }
}
