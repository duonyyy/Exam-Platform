<?php

namespace App\Actions\Exams;

use App\Enums\QuestionStatus;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class AttachQuestionsToExamAction
{
    /**
     * @param  array<int, array{question_id: int, order: int, points: int|float|string}>  $items
     */
    public function handle(Exam $exam, User $actor, array $items): Exam
    {
        return DB::transaction(function () use ($exam, $actor, $items): Exam {
            // ASVS V15.4: serialize all assemblies for this exam before checking uniqueness and summing points.
            $lockedExam = Exam::query()->whereKey($exam->id)->lockForUpdate()->firstOrFail();
            $ids = collect($items)->pluck('question_id')->sort()->values()->all();
            // Lock Question before Subject, matching QuestionController's update/status lock order.
            $questions = Question::query()->with('topic:id,subject_id')->whereIn('id', $ids)
                ->orderBy('id')->lockForUpdate()->get()->keyBy('id');
            $subject = Subject::query()->whereKey($lockedExam->subject_id)->lockForUpdate()->firstOrFail();
            $lockedExam->setRelation('subject', $subject);
            Gate::forUser($actor)->authorize('update', $lockedExam);

            $existing = DB::table('exam_questions')->where('exam_id', $lockedExam->id)->get();
            $byQuestion = $existing->keyBy('question_id');
            $byOrder = $existing->keyBy('order');
            // ASVS V2.3: lock the same Question rows as update/status, then recheck mutable state.
            foreach ($items as $item) {
                $question = $questions->get($item['question_id']);
                if ($question === null || $question->status !== QuestionStatus::READY || $question->topic->subject_id !== $lockedExam->subject_id) {
                    throw new HttpResponseException(response()->json([
                        'message' => 'Question is unavailable for this exam.',
                        'error_code' => 'QUESTION_NOT_AVAILABLE',
                    ], Response::HTTP_UNPROCESSABLE_ENTITY));
                }

                $sameQuestion = $byQuestion->get($item['question_id']);
                $sameOrder = $byOrder->get($item['order']);
                if ($sameQuestion !== null) {
                    if ((int) $sameQuestion->order === $item['order']
                        && (int) round((float) $sameQuestion->points * 100) === (int) round((float) $item['points'] * 100)) {
                        continue;
                    }

                    $this->conflict();
                }
                if ($sameOrder !== null) {
                    $this->conflict();
                }

                DB::table('exam_questions')->insert([
                    'exam_id' => $lockedExam->id,
                    'question_id' => $question->id,
                    'order' => $item['order'],
                    'points' => $item['points'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $total = DB::table('exam_questions')->where('exam_id', $lockedExam->id)->sum('points');
            if ((float) $total > 999999.99) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Exam total points exceed the supported range.',
                    'error_code' => 'EXAM_TOTAL_POINTS_TOO_HIGH',
                ], Response::HTTP_UNPROCESSABLE_ENTITY));
            }
            $lockedExam->total_points = $total;
            $lockedExam->save();

            return $lockedExam->loadCount('questions');
        });
    }

    private function conflict(): never
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Question or order is already assigned to this exam.',
            'error_code' => 'EXAM_QUESTION_CONFLICT',
        ], Response::HTTP_CONFLICT));
    }
}
