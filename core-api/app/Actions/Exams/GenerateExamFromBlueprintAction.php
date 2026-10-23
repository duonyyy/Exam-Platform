<?php

namespace App\Actions\Exams;

use App\Enums\QuestionStatus;
use App\Models\AiGenerationLog;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class GenerateExamFromBlueprintAction
{
    /**
     * @param  array{
     *     thread_id: string,
     *     prompt_hash: string,
     *     proposal_hash: string,
     *     subject_id: int,
     *     title: string,
     *     duration_minutes: int,
     *     pass_score: int|float|string,
     *     shuffle_questions: bool,
     *     shuffle_options: bool,
     *     questions: array<int, array{question_id: int, order: int, points: int|float|string}>,
     *     metadata?: array<string, mixed>|null,
     * }  $data
     */
    public function handle(User $actor, array $data): Exam
    {
        return DB::transaction(function () use ($actor, $data): Exam {
            // 1. Anti-replay duplicate proposal check (with lockForUpdate)
            $existingLog = DB::table('ai_generation_logs')
                ->where('thread_id', $data['thread_id'])
                ->where('proposal_hash', $data['proposal_hash'])
                ->lockForUpdate()
                ->first();

            if ($existingLog !== null) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Proposal has already been applied for this thread.',
                    'error_code' => 'DUPLICATE_PROPOSAL_APPLIED',
                ], Response::HTTP_CONFLICT));
            }

            // 2. Lock Subject and authorize teacher ownership
            $subject = Subject::query()->whereKey($data['subject_id'])->lockForUpdate()->firstOrFail();
            Gate::forUser($actor)->authorize('createInSubject', [Exam::class, $subject]);

            // 3. Lock and validate all questions in ascending order (prevent deadlock)
            $questionIds = collect($data['questions'])->pluck('question_id')->sort()->values()->all();
            $questions = Question::query()
                ->with('topic:id,subject_id')
                ->whereIn('id', $questionIds)
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            if ($questions->count() !== count($questionIds)) {
                throw new HttpResponseException(response()->json([
                    'message' => 'One or more questions are unavailable for this exam.',
                    'error_code' => 'QUESTION_NOT_AVAILABLE',
                ], Response::HTTP_UNPROCESSABLE_ENTITY));
            }

            foreach ($data['questions'] as $item) {
                $question = $questions->get($item['question_id']);
                if (
                    $question === null
                    || $question->status !== QuestionStatus::READY
                    || $question->topic->subject_id !== $subject->id
                    || $question->deleted_at !== null
                ) {
                    throw new HttpResponseException(response()->json([
                        'message' => 'Question is unavailable for this exam.',
                        'error_code' => 'QUESTION_NOT_AVAILABLE',
                    ], Response::HTTP_UNPROCESSABLE_ENTITY));
                }
            }

            // 4. Calculate total points and validate range
            $totalPoints = collect($data['questions'])->sum('points');
            if ((float) $totalPoints > 999999.99) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Exam total points exceed the supported range.',
                    'error_code' => 'EXAM_TOTAL_POINTS_TOO_HIGH',
                ], Response::HTTP_UNPROCESSABLE_ENTITY));
            }

            // 5. Create Exam record
            $exam = new Exam();
            $exam->subject_id = $subject->id;
            $exam->created_by = $actor->id;
            $exam->title = $data['title'];
            $exam->duration_minutes = $data['duration_minutes'];
            $exam->pass_score = $data['pass_score'];
            $exam->total_points = $totalPoints;
            $exam->shuffle_questions = $data['shuffle_questions'];
            $exam->shuffle_options = $data['shuffle_options'];
            $exam->save();

            // 6. Bulk attach questions to exam_questions
            $examQuestionsData = [];
            $now = now();
            foreach ($data['questions'] as $item) {
                $examQuestionsData[] = [
                    'exam_id' => $exam->id,
                    'question_id' => $item['question_id'],
                    'order' => $item['order'],
                    'points' => $item['points'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            DB::table('exam_questions')->insert($examQuestionsData);

            // 7. Record AI generation audit log
            $log = new AiGenerationLog();
            $log->thread_id = $data['thread_id'];
            $log->actor_id = $actor->id;
            $log->prompt_hash = $data['prompt_hash'];
            $log->proposal_hash = $data['proposal_hash'];
            $log->generated_exam_id = $exam->id;
            $log->status = 'applied';
            $log->metadata = $data['metadata'] ?? [
                'total_questions' => count($data['questions']),
                'total_points' => $totalPoints,
            ];
            $log->save();

            $exam->setRelation('aiGenerationLogs', collect([$log]));

            return $exam->loadCount('questions');
        });
    }
}
