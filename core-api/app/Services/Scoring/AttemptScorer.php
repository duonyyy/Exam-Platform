<?php

namespace App\Services\Scoring;

use App\Enums\QuestionType;
use App\Models\AttemptAnswer;
use App\Models\ExamAttempt;
use App\Models\Question;
use Illuminate\Support\Collection;

class AttemptScorer
{
    public function calculate(ExamAttempt $attempt): ScoreResult
    {
        $session = $attempt->session;
        $exam = $session?->exam;

        if (! $exam) {
            throw new \RuntimeException('Không tìm thấy dữ liệu đề thi cho lượt thi này.');
        }

        // Eager load exam questions with pivot metadata ordered by display order
        $questions = $exam->questions()->orderBy('exam_questions.order')->get();
        /** @var Collection<int, AttemptAnswer> $answersByQuestion */
        $answersByQuestion = $attempt->answers()->get()->keyBy('question_id');

        $totalScore = 0.0;
        $totalExamPoints = 0.0;
        $totalQuestions = $questions->count();
        $answeredQuestions = 0;
        $correctQuestions = 0;
        $breakdown = [];

        foreach ($questions as $question) {
            $points = (float) ($question->pivot ? $question->pivot->getAttribute('points') : 0.0);
            $totalExamPoints += $points;

            /** @var AttemptAnswer|null $answer */
            $answer = $answersByQuestion->get($question->id);
            $selectedOptions = $answer ? $answer->selected_options : [];

            $isAnswered = ! empty($selectedOptions);
            if ($isAnswered) {
                $answeredQuestions++;
            }

            $isCorrect = $this->evaluateAnswer($question, $selectedOptions);
            $awardedPoints = $isCorrect ? $points : 0.0;

            if ($isCorrect) {
                $correctQuestions++;
                $totalScore += $awardedPoints;
            }

            // Persist or update attempt_answer with scoring metadata
            AttemptAnswer::updateOrCreate(
                [
                    'attempt_id' => $attempt->id,
                    'question_id' => $question->id,
                ],
                [
                    'selected_options' => $selectedOptions,
                    'awarded_points' => $awardedPoints,
                    'is_correct' => $isCorrect,
                ]
            );

            $breakdown[$question->id] = [
                'question_id' => $question->id,
                'awarded_points' => $awardedPoints,
                'is_correct' => $isCorrect,
            ];
        }

        $totalScore = round($totalScore, 2);
        $totalExamPoints = round($totalExamPoints, 2);
        $passScore = (float) ($exam->pass_score ?? 0);
        $isPassed = $totalScore >= $passScore;

        return new ScoreResult(
            score: $totalScore,
            totalPoints: $totalExamPoints,
            totalQuestions: $totalQuestions,
            answeredQuestions: $answeredQuestions,
            correctQuestions: $correctQuestions,
            isPassed: $isPassed,
            breakdown: $breakdown
        );
    }

    public function evaluateAnswer(Question $question, mixed $selectedOptions): bool
    {
        if (empty($selectedOptions)) {
            return false;
        }

        return match ($question->question_type) {
            QuestionType::SINGLE_CHOICE, QuestionType::TRUE_FALSE => $this->evaluateSingleChoice($question, $selectedOptions),
            QuestionType::MULTIPLE_CHOICE => $this->evaluateMultipleChoice($question, $selectedOptions),
            QuestionType::SHORT_ANSWER => $this->evaluateShortAnswer($question, $selectedOptions),
        };
    }

    private function evaluateSingleChoice(Question $question, mixed $selectedOptions): bool
    {
        $correct = $question->correct_answer;
        $correctOpt = is_array($correct) ? (string) reset($correct) : (string) $correct;
        $selectedOpt = is_array($selectedOptions) ? (string) reset($selectedOptions) : (string) $selectedOptions;

        return $selectedOpt !== '' && trim($selectedOpt) === trim($correctOpt);
    }

    private function evaluateMultipleChoice(Question $question, mixed $selectedOptions): bool
    {
        $correct = $question->correct_answer;
        $correctArray = is_array($correct) ? $correct : [$correct];
        $selectedArray = is_array($selectedOptions) ? $selectedOptions : [$selectedOptions];

        $cleanCorrect = array_values(array_unique(array_filter(array_map('strval', array_map('trim', $correctArray)))));
        $cleanSelected = array_values(array_unique(array_filter(array_map('strval', array_map('trim', $selectedArray)))));

        if (empty($cleanSelected) || empty($cleanCorrect)) {
            return false;
        }

        sort($cleanCorrect);
        sort($cleanSelected);

        return $cleanCorrect === $cleanSelected;
    }

    private function evaluateShortAnswer(Question $question, mixed $selectedOptions): bool
    {
        $correct = $question->correct_answer;
        $correctStr = is_array($correct) ? (string) reset($correct) : (string) $correct;
        $selectedStr = is_array($selectedOptions) ? (string) reset($selectedOptions) : (string) $selectedOptions;

        $cleanCorrect = mb_strtolower(trim($correctStr), 'UTF-8');
        $cleanSelected = mb_strtolower(trim($selectedStr), 'UTF-8');

        return $cleanSelected !== '' && $cleanSelected === $cleanCorrect;
    }
}
