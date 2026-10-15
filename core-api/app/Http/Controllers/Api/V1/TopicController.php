<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Topics\ListTopicsRequest;
use App\Http\Requests\Topics\StoreTopicRequest;
use App\Http\Resources\TopicResource;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class TopicController extends Controller
{
    public function index(ListTopicsRequest $request, Subject $subject): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $topics = $subject->topics()->orderBy('id');

        $topics->withCount('questions');

        return TopicResource::collection($topics->paginate($filters['per_page'] ?? 20));
    }

    public function store(StoreTopicRequest $request, Subject $subject): JsonResponse
    {
        $data = $request->validated();
        /** @var User $actor */
        $actor = $request->user();

        // ASVS V8.2: recheck record authorization under the parent lock.
        $topic = DB::transaction(function () use ($actor, $subject, $data): Topic {
            $locked = Subject::query()->whereKey($subject->id)->lockForUpdate()->firstOrFail();
            Gate::forUser($actor)->authorize('createTopic', $locked);

            return Topic::create([
                'subject_id' => $locked->id,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
            ]);
        });
        $topic->setAttribute('questions_count', 0);

        return (new TopicResource($topic))->response()->setStatusCode(Response::HTTP_CREATED);
    }
}
