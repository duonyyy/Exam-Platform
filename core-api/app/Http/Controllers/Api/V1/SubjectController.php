<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subjects\ListSubjectsRequest;
use App\Http\Requests\Subjects\StoreSubjectRequest;
use App\Http\Requests\Subjects\UpdateSubjectRequest;
use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class SubjectController extends Controller
{
    public function index(ListSubjectsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $subjects = Subject::query()->withCount('topics');

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $likeOperator = DB::getDriverName() === 'pgsql' ? 'ILIKE' : 'like';
            $subjects->where(function (Builder $query) use ($search, $likeOperator): void {
                $query->where('code', $likeOperator, "%{$search}%")
                    ->orWhere('name', $likeOperator, "%{$search}%");
            });
        }

        return SubjectResource::collection($subjects->orderBy('id')->paginate($filters['per_page'] ?? 20));
    }

    public function show(Subject $subject): SubjectResource
    {
        Gate::authorize('view', $subject);

        return new SubjectResource($subject->loadCount('topics'));
    }

    public function store(StoreSubjectRequest $request): JsonResponse
    {
        $data = $request->validated();
        /** @var User $actor */
        $actor = $request->user();
        $subject = new Subject([
            'code' => $data['code'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);
        $subject->created_by = $actor->id;
        $subject->owner_teacher_id = $actor->isTeacher() ? $actor->id : ($data['owner_teacher_id'] ?? null);
        $subject->save();

        return (new SubjectResource($subject->loadCount('topics')))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateSubjectRequest $request, Subject $subject): SubjectResource
    {
        $data = $request->validated();
        /** @var User $actor */
        $actor = $request->user();

        $updated = DB::transaction(function () use ($actor, $subject, $data): Subject {
            $locked = Subject::query()->whereKey($subject->id)->lockForUpdate()->firstOrFail();
            Gate::forUser($actor)->authorize('update', $locked);
            $locked->fill(Arr::only($data, ['code', 'name', 'description']));

            if ($actor->isAdmin() && array_key_exists('owner_teacher_id', $data)) {
                $locked->owner_teacher_id = $data['owner_teacher_id'];
            }

            $locked->save();

            return $locked;
        });

        return new SubjectResource($updated->loadCount('topics'));
    }

    public function destroy(Subject $subject): Response
    {
        return DB::transaction(function () use ($subject): Response {
            $locked = Subject::query()->whereKey($subject->id)->lockForUpdate()->firstOrFail();
            Gate::authorize('delete', $locked);

            if ($locked->topics()->exists()) {
                return response()->json([
                    'message' => 'Không thể xóa môn học đang có chủ đề.',
                    'error_code' => 'SUBJECT_HAS_TOPICS',
                ], Response::HTTP_CONFLICT);
            }

            $locked->delete();

            return response()->noContent();
        });
    }
}
