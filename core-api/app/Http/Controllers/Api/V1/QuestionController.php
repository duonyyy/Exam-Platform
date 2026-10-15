<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\QuestionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Questions\ChangeQuestionStatusRequest;
use App\Http\Requests\Questions\ListQuestionsRequest;
use App\Http\Requests\Questions\StoreQuestionRequest;
use App\Http\Requests\Questions\UpdateQuestionRequest;
use App\Http\Resources\QuestionAdminResource;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Response;

class QuestionController extends Controller
{
    public function index(ListQuestionsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        /** @var User $actor */
        $actor = $request->user();
        $questions = Question::query();

        // ASVS V8.2: scope collection in SQL, before pagination and serialization.
        if ($actor->isTeacher()) {
            $questions->whereHas('topic.subject', fn ($query) => $query->where('owner_teacher_id', $actor->id));
        }

        return QuestionAdminResource::collection($questions->orderBy('id')->paginate($filters['per_page'] ?? 20));
    }

    public function store(StoreQuestionRequest $request): JsonResponse
    {
        $data = $request->validated();
        /** @var User $actor */
        $actor = $request->user();
        $topic = Topic::query()->with('subject')->findOrFail($data['topic_id']);

        $question = DB::transaction(function () use ($actor, $topic, $data): Question {
            $subject = Subject::query()->whereKey($topic->subject_id)->lockForUpdate()->firstOrFail();
            $topic->setRelation('subject', $subject);
            Gate::forUser($actor)->authorize('createInTopic', [Question::class, $topic]);

            $question = new Question($data);
            $question->created_by = $actor->id;
            $question->status = QuestionStatus::READY;
            $question->source = 'manual';
            $question->save();

            return $question;
        });

        return (new QuestionAdminResource($question))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateQuestionRequest $request, Question $question): QuestionAdminResource
    {
        $data = $request->validated();
        /** @var User $actor */
        $actor = $request->user();

        $updated = DB::transaction(function () use ($actor, $question, $data): Question {
            // ASVS V15.4: serialize question edits with future exam attachment.
            $locked = Question::query()->whereKey($question->id)->lockForUpdate()->firstOrFail();
            $subject = Subject::query()->whereKey($locked->topic->subject_id)->lockForUpdate()->firstOrFail();
            $locked->topic->setRelation('subject', $subject);
            Gate::forUser($actor)->authorize('update', $locked);
            $this->ensureNotUsedInExam($locked);

            $locked->fill($data);
            $locked->updated_by = $actor->id;
            $locked->save();

            return $locked;
        });

        return new QuestionAdminResource($updated);
    }

    public function changeStatus(ChangeQuestionStatusRequest $request, Question $question): QuestionAdminResource
    {
        /** @var User $actor */
        $actor = $request->user();

        $updated = DB::transaction(function () use ($actor, $question, $request): Question {
            $locked = Question::query()->whereKey($question->id)->lockForUpdate()->firstOrFail();
            $subject = Subject::query()->whereKey($locked->topic->subject_id)->lockForUpdate()->firstOrFail();
            $locked->topic->setRelation('subject', $subject);
            Gate::forUser($actor)->authorize('update', $locked);
            $target = QuestionStatus::from($request->validated('status'));
            if ($locked->status !== $target) {
                $this->ensureNotUsedInExam($locked);
                $locked->status = $target;
                $locked->updated_by = $actor->id;
                $locked->save();
            }

            return $locked;
        });

        return new QuestionAdminResource($updated);
    }

    private function ensureNotUsedInExam(Question $question): void
    {
        // Phase 5 must lock the same Question row before attaching it to an Exam.
        if (Schema::hasTable('exam_questions') && DB::table('exam_questions')->where('question_id', $question->id)->exists()) {
            throw new HttpResponseException(response()->json([
                'message' => 'Question is already used in an exam. Create a new question instead.',
                'error_code' => 'QUESTION_ALREADY_IN_EXAM',
            ], Response::HTTP_CONFLICT));
        }
    }
}
