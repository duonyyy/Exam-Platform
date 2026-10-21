<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\ExamSessions\AssignStudentsAction;
use App\Actions\ExamSessions\AssignTeachersAction;
use App\Actions\ExamSessions\CloseSessionAction;
use App\Actions\ExamSessions\PublishSessionAction;
use App\Enums\ExamSessionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ExamSessions\AssignStudentsRequest;
use App\Http\Requests\ExamSessions\AssignTeachersRequest;
use App\Http\Requests\ExamSessions\ListExamSessionsRequest;
use App\Http\Requests\ExamSessions\StoreExamSessionRequest;
use App\Http\Resources\ExamSessionResource;
use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class ExamSessionController extends Controller
{
    public function index(ListExamSessionsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        /** @var User $actor */
        $actor = $request->user();

        $query = ExamSession::query()
            ->with(['exam'])
            ->withCount(['assignments', 'sessionTeachers']);

        // ASVS V8.2: scope in SQL before pagination and serialization.
        if ($actor->isTeacher()) {
            $query->where(function ($q) use ($actor): void {
                $q->where('created_by', $actor->id)
                    ->orWhereHas('exam.subject', fn ($sq) => $sq->where('owner_teacher_id', $actor->id))
                    ->orWhereHas('sessionTeachers', fn ($tq) => $tq->where('teacher_id', $actor->id));
            });
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['exam_id'])) {
            $query->where('exam_id', $filters['exam_id']);
        }

        return ExamSessionResource::collection(
            $query->orderByDesc('id')->paginate($filters['per_page'] ?? 20)
        );
    }

    public function store(StoreExamSessionRequest $request): JsonResponse
    {
        $data = $request->validated();
        /** @var User $actor */
        $actor = $request->user();

        $session = DB::transaction(function () use ($data, $actor): ExamSession {
            /** @var Exam $exam */
            $exam = Exam::query()->with('subject')->whereKey($data['exam_id'])->firstOrFail();
            Gate::forUser($actor)->authorize('createForExam', [ExamSession::class, $exam]);

            $session = new ExamSession($data);
            $session->exam_id = $exam->id;
            $session->created_by = $actor->id;
            $session->status = ExamSessionStatus::DRAFT;
            $session->allow_late_minutes = $data['allow_late_minutes'] ?? 15;
            $session->max_attempts = $data['max_attempts'] ?? 1;
            $session->save();

            return $session->load(['exam'])->loadCount(['assignments', 'sessionTeachers']);
        });

        return (new ExamSessionResource($session))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(ExamSession $examSession): ExamSessionResource
    {
        $examSession->load(['exam.subject', 'sessionTeachers']);
        Gate::authorize('view', $examSession);

        return new ExamSessionResource(
            $examSession->loadCount(['assignments', 'sessionTeachers'])
        );
    }

    public function publish(Request $request, ExamSession $examSession, PublishSessionAction $action): ExamSessionResource
    {
        $examSession->load(['exam.subject', 'sessionTeachers']);
        Gate::authorize('publish', $examSession);

        /** @var User $actor */
        $actor = $request->user();

        return new ExamSessionResource($action->handle($examSession, $actor));
    }

    public function close(Request $request, ExamSession $examSession, CloseSessionAction $action): ExamSessionResource
    {
        $examSession->load(['exam.subject', 'sessionTeachers']);
        Gate::authorize('close', $examSession);

        /** @var User $actor */
        $actor = $request->user();

        return new ExamSessionResource($action->handle($examSession, $actor));
    }

    public function assignStudents(AssignStudentsRequest $request, ExamSession $examSession, AssignStudentsAction $action): JsonResponse
    {
        $examSession->load(['exam.subject', 'sessionTeachers']);
        Gate::authorize('assignStudents', $examSession);

        /** @var User $actor */
        $actor = $request->user();
        /** @var array<int, int> $studentIds */
        $studentIds = $request->validated('student_ids');

        $result = $action->handle($examSession, $studentIds, $actor);

        return response()->json([
            'message' => 'Phân công thí sinh thành công.',
            'data' => $result,
        ], Response::HTTP_OK);
    }

    public function assignTeachers(AssignTeachersRequest $request, ExamSession $examSession, AssignTeachersAction $action): JsonResponse
    {
        $examSession->load(['exam.subject', 'sessionTeachers']);
        Gate::authorize('assignTeachers', $examSession);

        /** @var User $actor */
        $actor = $request->user();
        /** @var array<int, int> $teacherIds */
        $teacherIds = $request->validated('teacher_ids');
        /** @var string|null $roleInSession */
        $roleInSession = $request->validated('role_in_session');

        $result = $action->handle($examSession, $teacherIds, $roleInSession, $actor);

        return response()->json([
            'message' => 'Phân công cán bộ coi thi thành công.',
            'data' => $result,
        ], Response::HTTP_OK);
    }
}
