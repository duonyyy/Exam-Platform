<?php

namespace App\Services\Scoring;

class ScoreResult
{
    /**
     * @param  array<int, array{question_id: int, awarded_points: float, is_correct: bool}>  $breakdown
     */
    public function __construct(
        public readonly float $score,
        public readonly float $totalPoints,
        public readonly int $totalQuestions,
        public readonly int $answeredQuestions,
        public readonly int $correctQuestions,
        public readonly bool $isPassed,
        public readonly array $breakdown = []
    ) {}
}
