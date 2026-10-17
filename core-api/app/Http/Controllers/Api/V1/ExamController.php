<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Exams\AttachQuestionsToExamAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Exams\AttachQuestionsRequest;
use App\Http\Requests\Exams\ListExamsRequest;
use App\Http\Requests\Exams\StoreExamRequest;
use App\Http\Resources\ExamResource;
use App\Models\Exam;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class ExamController extends Controller
{
    public function index(ListExamsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        /** @var User $actor */
        $actor = $request->user();
        $exams = Exam::query()->withCount('questions');
        // ASVS V8.2: scope in SQL, before pagination and serialization.
        if ($actor->isTeacher()) {
            $exams->whereHas('subject', fn ($query) => $query->where('owner_teacher_id', $actor->id));
        }

        return ExamResource::collection($exams->orderBy('id')->paginate($filters['per_page'] ?? 20));
    }

    public function store(StoreExamRequest $request): JsonResponse
    {
        $data = $request->validated();
        /** @var User $actor */
        $actor = $request->user();
        $exam = DB::transaction(function () use ($data, $actor): Exam {
            $subject = Subject::query()->whereKey($data['subject_id'])->lockForUpdate()->firstOrFail();
            Gate::forUser($actor)->authorize('createInSubject', [Exam::class, $subject]);

            $exam = new Exam($data);
            $exam->subject_id = $subject->id;
            $exam->created_by = $actor->id;
            $exam->total_points = '0.00';
            $exam->save();

            return $exam->loadCount('questions');
        });

        return (new ExamResource($exam))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function attachQuestions(AttachQuestionsRequest $request, Exam $exam, AttachQuestionsToExamAction $action): ExamResource
    {
        /** @var User $actor */
        $actor = $request->user();

        return new ExamResource($action->handle($exam, $actor, $request->validated('questions')));
    }
}
