<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Exams\AttachQuestionsToExamAction;
use App\Actions\Exams\GenerateExamFromBlueprintAction;
use App\Enums\QuestionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Exams\AttachQuestionsRequest;
use App\Http\Requests\Exams\ListExamsRequest;
use App\Http\Requests\Exams\StoreExamFromBlueprintRequest;
use App\Http\Requests\Exams\StoreExamRequest;
use App\Http\Resources\ExamResource;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

    public function storeFromBlueprint(
        StoreExamFromBlueprintRequest $request,
        GenerateExamFromBlueprintAction $action
    ): JsonResponse {
        /** @var User $actor */
        $actor = $request->user();

        $exam = $action->handle($actor, $request->validated());

        return (new ExamResource($exam))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function attachQuestions(AttachQuestionsRequest $request, Exam $exam, AttachQuestionsToExamAction $action): ExamResource
    {
        /** @var User $actor */
        $actor = $request->user();

        return new ExamResource($action->handle($exam, $actor, $request->validated('questions')));
    }

    public function readinessReview(Request $request, Exam $exam): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        Gate::forUser($actor)->authorize('view', $exam);

        $exam->load(['subject.topics', 'questions.topic']);
        /** @var Collection<int, Question> $questions */
        $questions = $exam->questions;
        $totalQuestions = $questions->count();
        $totalPoints = (float) $exam->total_points;
        $passScore = (float) $exam->pass_score;

        $allReady = $totalQuestions > 0 && $questions->every(
            fn (Question $q) => $q->status === QuestionStatus::READY
        );
        $isReadyForSession = $allReady;

        $easyCount = $questions->filter(fn (Question $q) => $q->difficulty === 'easy')->count();
        $mediumCount = $questions->filter(fn (Question $q) => $q->difficulty === 'medium')->count();
        $hardCount = $questions->filter(fn (Question $q) => $q->difficulty === 'hard')->count();

        $easyPct = $totalQuestions > 0 ? round(($easyCount / $totalQuestions) * 100, 1) : 0.0;
        $mediumPct = $totalQuestions > 0 ? round(($mediumCount / $totalQuestions) * 100, 1) : 0.0;
        $hardPct = $totalQuestions > 0 ? round(($hardCount / $totalQuestions) * 100, 1) : 0.0;

        $topicsCovered = [];
        $groupedByTopic = $questions->groupBy('topic_id');
        foreach ($groupedByTopic as $topicId => $topicQuestions) {
            /** @var Question $firstQ */
            $firstQ = $topicQuestions->first();
            $topicCount = $topicQuestions->count();
            $topicsCovered[] = [
                'topic_id' => (int) $topicId,
                'topic_name' => $firstQ->topic->name ?? "Chủ đề #{$topicId}",
                'question_count' => $topicCount,
                'percentage' => $totalQuestions > 0 ? round(($topicCount / $totalQuestions) * 100, 1) : 0.0,
            ];
        }

        $warnings = [];
        if ($passScore > $totalPoints) {
            $warnings[] = 'Điểm sàn (pass_score) vượt quá tổng điểm (total_points) của đề thi.';
        }
        if ($totalQuestions === 0) {
            $warnings[] = 'Đề thi chưa có câu hỏi nào được gán.';
        }
        if (! $allReady && $totalQuestions > 0) {
            $warnings[] = 'Đề thi chứa câu hỏi chưa ở trạng thái sẵn sàng (ready).';
        }

        return response()->json([
            'data' => [
                'exam_id' => $exam->id,
                'title' => $exam->title,
                'is_ready_for_session' => $isReadyForSession,
                'total_questions' => $totalQuestions,
                'total_points' => $totalPoints,
                'pass_score' => $passScore,
                'difficulty_distribution' => [
                    'easy' => ['count' => $easyCount, 'percentage' => $easyPct],
                    'medium' => ['count' => $mediumCount, 'percentage' => $mediumPct],
                    'hard' => ['count' => $hardCount, 'percentage' => $hardPct],
                ],
                'topics_covered' => $topicsCovered,
                'warnings' => $warnings,
            ],
        ]);
    }
}
