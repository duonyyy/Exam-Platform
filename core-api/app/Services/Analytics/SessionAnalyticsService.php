<?php

namespace App\Services\Analytics;

use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\Question;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SessionAnalyticsService
{
    /**
     * Generate comprehensive exam session results and analytics report.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function generateReport(ExamSession $session, array $filters = []): array
    {
        // 1. Eager load session dependencies
        $session->loadMissing(['exam.subject', 'exam.questions']);
        $exam = $session->exam;

        $examTotalPoints = $exam ? (float) $exam->total_points : 10.0;
        if ($examTotalPoints <= 0) {
            $examTotalPoints = 10.0;
        }
        $passScore = $exam ? (float) $exam->pass_score : 0.0;

        // 2. Load all attempts for this session with student and proctoring violation counts
        /** @var Collection<int, ExamAttempt> $attempts */
        $attempts = ExamAttempt::query()
            ->where('exam_session_id', $session->id)
            ->with(['student:id,name,email'])
            ->withCount('proctoringEvents')
            ->get();

        /** @var Collection<int, ExamAttempt> $submittedAttempts */
        $submittedAttempts = $attempts->filter(function (ExamAttempt $attempt): bool {
            return $attempt->isSubmitted() || $attempt->isGraded();
        });

        $inProgressAttempts = $attempts->filter(function (ExamAttempt $attempt): bool {
            return $attempt->isInProgress();
        });

        // 3. Load all assigned students to detect absenteeism
        $assignedStudents = DB::table('session_assignments')
            ->join('users', 'session_assignments.student_id', '=', 'users.id')
            ->where('session_assignments.exam_session_id', $session->id)
            ->select('users.id as student_id', 'users.name as student_name', 'users.email as student_email')
            ->get();

        $totalAssigned = $assignedStudents->count();
        $participantStudentIds = $attempts->pluck('student_id')->unique();
        $totalParticipants = $participantStudentIds->count();
        $totalSubmitted = $submittedAttempts->count();
        $totalInProgress = $inProgressAttempts->count();
        $totalAbsent = max(0, $totalAssigned - $totalParticipants);
        $attendanceRate = $totalAssigned > 0 ? round(($totalParticipants / $totalAssigned) * 100, 2) : 0.0;

        // 4. Calculate score statistics (Min, Max, Avg, Median, StdDev, Pass/Fail)
        $scores = $submittedAttempts
            ->pluck('score')
            ->filter(fn ($s) => $s !== null)
            ->map(fn ($s) => (float) $s)
            ->values()
            ->all();

        sort($scores);
        $scoreCount = count($scores);

        if ($scoreCount === 0) {
            $scoreStats = [
                'min_score' => null,
                'max_score' => null,
                'avg_score' => null,
                'median_score' => null,
                'std_deviation' => null,
                'passed_count' => 0,
                'failed_count' => 0,
                'pass_rate' => 0.0,
                'fail_rate' => 0.0,
            ];
        } else {
            $minScore = round(min($scores), 2);
            $maxScore = round(max($scores), 2);
            $avgScore = round(array_sum($scores) / $scoreCount, 2);

            // Median
            if ($scoreCount === 1) {
                $medianScore = round($scores[0], 2);
            } elseif ($scoreCount % 2 === 1) {
                $medianScore = round($scores[($scoreCount - 1) / 2], 2);
            } else {
                $midLeft = $scores[$scoreCount / 2 - 1];
                $midRight = $scores[$scoreCount / 2];
                $medianScore = round(($midLeft + $midRight) / 2, 2);
            }

            // Standard Deviation
            if ($scoreCount === 1) {
                $stdDeviation = 0.0;
            } else {
                $variance = array_sum(array_map(fn ($s) => pow($s - $avgScore, 2), $scores)) / $scoreCount;
                $stdDeviation = round(sqrt($variance), 2);
            }

            $passedCount = count(array_filter($scores, fn ($s) => $s >= $passScore));
            $failedCount = $scoreCount - $passedCount;
            $passRate = round(($passedCount / $scoreCount) * 100, 2);
            $failRate = round(($failedCount / $scoreCount) * 100, 2);

            $scoreStats = [
                'min_score' => $minScore,
                'max_score' => $maxScore,
                'avg_score' => $avgScore,
                'median_score' => $medianScore,
                'std_deviation' => $stdDeviation,
                'passed_count' => $passedCount,
                'failed_count' => $failedCount,
                'pass_rate' => $passRate,
                'fail_rate' => $failRate,
            ];
        }

        // 5. Score Distribution Histogram (5 proportional buckets)
        $histogram = $this->buildHistogram($scores, $examTotalPoints, $scoreCount);

        // 6. Question Analysis (Difficulty & Discrimination index)
        $questionAnalysis = $this->buildQuestionAnalysis($session, $submittedAttempts, $scoreCount);

        // 7. Student Scoreboard with Filtering, Sorting, Pagination
        $scoreboardData = $this->buildScoreboard(
            $assignedStudents,
            $attempts,
            $examTotalPoints,
            $passScore,
            $filters
        );

        return [
            'session' => [
                'id' => $session->id,
                'title' => $session->title,
                'status' => $session->status->value,
                'start_at' => $session->start_at->toIso8601String(),
                'end_at' => $session->end_at->toIso8601String(),
                'exam' => [
                    'id' => $exam?->id,
                    'title' => $exam?->title,
                    'total_points' => $examTotalPoints,
                    'pass_score' => $passScore,
                    'duration_minutes' => $exam?->duration_minutes,
                ],
            ],
            'summary' => [
                'total_assigned' => $totalAssigned,
                'total_participants' => $totalParticipants,
                'total_submitted' => $totalSubmitted,
                'total_in_progress' => $totalInProgress,
                'total_absent' => $totalAbsent,
                'attendance_rate' => $attendanceRate,
            ],
            'statistics' => $scoreStats,
            'histogram' => $histogram,
            'question_analysis' => $questionAnalysis,
            'scoreboard' => $scoreboardData['items'],
            'pagination' => $scoreboardData['pagination'],
        ];
    }

    /**
     * Build 5 score histogram buckets.
     *
     * @param  array<int, float>  $scores
     * @return array<int, array<string, mixed>>
     */
    private function buildHistogram(array $scores, float $totalPoints, int $totalSubmissions): array
    {
        $step = $totalPoints / 5;
        $buckets = [];

        for ($i = 1; $i <= 5; $i++) {
            $min = round(($i - 1) * $step, 2);
            $max = round($i * $step, 2);

            // Format standard display range e.g. "0.0 - 2.0", "2.1 - 4.0"
            if ($i === 1) {
                $rangeLabel = sprintf('%.1f - %.1f', $min, $max);
                $count = count(array_filter($scores, fn ($s) => $s >= $min && $s <= $max));
            } elseif ($i === 5) {
                $rangeLabel = sprintf('%.1f - %.1f', $min + 0.1, $max);
                $count = count(array_filter($scores, fn ($s) => $s > $min));
            } else {
                $rangeLabel = sprintf('%.1f - %.1f', $min + 0.1, $max);
                $count = count(array_filter($scores, fn ($s) => $s > $min && $s <= $max));
            }

            $percentage = $totalSubmissions > 0 ? round(($count / $totalSubmissions) * 100, 2) : 0.0;

            $buckets[] = [
                'range' => $rangeLabel,
                'min' => $min,
                'max' => $max,
                'count' => $count,
                'percentage' => $percentage,
            ];
        }

        return $buckets;
    }

    /**
     * Compute item difficulty index and discrimination index.
     *
     * @param  Collection<int, ExamAttempt>  $submittedAttempts
     * @return array<int, array<string, mixed>>
     */
    private function buildQuestionAnalysis(ExamSession $session, Collection $submittedAttempts, int $scoreCount): array
    {
        /** @var Collection<int, Question> $questions */
        $questions = $session->exam
            ? $session->exam->questions()->orderBy('exam_questions.order')->get()
            : collect();

        if ($questions->isEmpty()) {
            return [];
        }

        if ($scoreCount === 0) {
            return $questions->map(function (Question $q): array {
                return [
                    'question_id' => $q->id,
                    'question_text' => $q->question_text,
                    'question_type' => $q->question_type->value,
                    'order' => (int) ($q->pivot?->getAttribute('order') ?? 1),
                    'points' => (float) ($q->pivot?->getAttribute('points') ?? 0.0),
                    'total_answers' => 0,
                    'correct_answers' => 0,
                    'incorrect_answers' => 0,
                    'difficulty_index' => null,
                    'discrimination_index' => null,
                    'difficulty_level' => 'no_data',
                    'discrimination_level' => 'no_data',
                ];
            })->values()->all();
        }

        $submittedAttemptIds = $submittedAttempts->pluck('id')->all();

        // 1. Total and correct answers per question across all submitted attempts
        $answerStats = DB::table('attempt_answers')
            ->whereIn('attempt_id', $submittedAttemptIds)
            ->select(
                'question_id',
                DB::raw('COUNT(*) as total_answers'),
                DB::raw('COUNT(CASE WHEN is_correct = true THEN 1 END) as correct_answers')
            )
            ->groupBy('question_id')
            ->get()
            ->keyBy('question_id');

        // 2. Discrimination Index Calculation:
        // Divide into Upper and Lower groups
        $sortedAttempts = $submittedAttempts->sortByDesc(fn ($a) => (float) $a->score)->values();

        $groupSize = 0;
        if ($scoreCount >= 10) {
            $groupSize = max(1, (int) round($scoreCount * 0.27)); // Kelley's 27% rule
        } elseif ($scoreCount >= 2) {
            $groupSize = intdiv($scoreCount, 2); // Split half for smaller cohorts
        }

        $upperCorrect = collect();
        $lowerCorrect = collect();

        if ($groupSize > 0) {
            $upperAttemptIds = $sortedAttempts->take($groupSize)->pluck('id')->all();
            $lowerAttemptIds = $sortedAttempts->slice(-$groupSize)->pluck('id')->all();

            $upperCorrect = DB::table('attempt_answers')
                ->whereIn('attempt_id', $upperAttemptIds)
                ->where('is_correct', true)
                ->select('question_id', DB::raw('COUNT(*) as count'))
                ->groupBy('question_id')
                ->pluck('count', 'question_id');

            $lowerCorrect = DB::table('attempt_answers')
                ->whereIn('attempt_id', $lowerAttemptIds)
                ->where('is_correct', true)
                ->select('question_id', DB::raw('COUNT(*) as count'))
                ->groupBy('question_id')
                ->pluck('count', 'question_id');
        }

        return $questions->map(function (Question $q) use ($answerStats, $groupSize, $upperCorrect, $lowerCorrect): array {
            $stat = $answerStats->get($q->id);
            $totalAnswers = $stat ? (int) $stat->total_answers : 0;
            $correctAnswers = $stat ? (int) $stat->correct_answers : 0;
            $incorrectAnswers = max(0, $totalAnswers - $correctAnswers);

            // Difficulty index P
            if ($totalAnswers > 0) {
                $difficultyIndex = round($correctAnswers / $totalAnswers, 2);
                if ($difficultyIndex >= 0.80) {
                    $diffLevel = 'easy';
                } elseif ($difficultyIndex >= 0.30) {
                    $diffLevel = 'medium';
                } else {
                    $diffLevel = 'hard';
                }
            } else {
                $difficultyIndex = null;
                $diffLevel = 'no_data';
            }

            // Discrimination index D
            if ($groupSize > 0) {
                $ru = (int) ($upperCorrect->get($q->id) ?? 0);
                $rl = (int) ($lowerCorrect->get($q->id) ?? 0);
                $discriminationIndex = round(($ru - $rl) / $groupSize, 2);

                if ($discriminationIndex >= 0.40) {
                    $discLevel = 'excellent';
                } elseif ($discriminationIndex >= 0.30) {
                    $discLevel = 'good';
                } elseif ($discriminationIndex >= 0.20) {
                    $discLevel = 'fair';
                } elseif ($discriminationIndex >= 0.0) {
                    $discLevel = 'poor';
                } else {
                    $discLevel = 'negative';
                }
            } else {
                $discriminationIndex = null;
                $discLevel = 'insufficient_data';
            }

            return [
                'question_id' => $q->id,
                'question_text' => $q->question_text,
                'question_type' => $q->question_type->value,
                'order' => (int) ($q->pivot?->getAttribute('order') ?? 1),
                'points' => (float) ($q->pivot?->getAttribute('points') ?? 0.0),
                'total_answers' => $totalAnswers,
                'correct_answers' => $correctAnswers,
                'incorrect_answers' => $incorrectAnswers,
                'difficulty_index' => $difficultyIndex,
                'discrimination_index' => $discriminationIndex,
                'difficulty_level' => $diffLevel,
                'discrimination_level' => $discLevel,
            ];
        })->values()->all();
    }

    /**
     * Build scoreboard rows with filtering, sorting and pagination.
     *
     * @param  Collection<int, \stdClass>  $assignedStudents
     * @param  Collection<int, ExamAttempt>  $attempts
     * @param  array<string, mixed>  $filters
     * @return array{items: array<int, array<string, mixed>>, pagination: array<string, int>}
     */
    private function buildScoreboard(
        Collection $assignedStudents,
        Collection $attempts,
        float $totalPoints,
        float $passScore,
        array $filters
    ): array {
        $attemptsByStudent = $attempts->keyBy('student_id');

        // Merge assigned students and any extra attempts
        $studentMap = collect();

        foreach ($assignedStudents as $assigned) {
            $studentMap->put((int) $assigned->student_id, [
                'student_id' => (int) $assigned->student_id,
                'student_name' => (string) $assigned->student_name,
                'student_email' => (string) $assigned->student_email,
            ]);
        }

        foreach ($attempts as $attempt) {
            if (! $studentMap->has($attempt->student_id) && $attempt->student) {
                $studentMap->put((int) $attempt->student_id, [
                    'student_id' => (int) $attempt->student_id,
                    'student_name' => (string) $attempt->student->name,
                    'student_email' => (string) $attempt->student->email,
                ]);
            }
        }

        $scoreboard = $studentMap->map(function (array $studentInfo) use ($attemptsByStudent, $totalPoints, $passScore): array {
            $studentId = $studentInfo['student_id'];
            /** @var ExamAttempt|null $attempt */
            $attempt = $attemptsByStudent->get($studentId);

            if (! $attempt) {
                return [
                    'student_id' => $studentId,
                    'student_name' => $studentInfo['student_name'],
                    'student_email' => $studentInfo['student_email'],
                    'attempt_id' => null,
                    'attempt_number' => null,
                    'status' => 'absent',
                    'score' => null,
                    'total_points' => $totalPoints,
                    'is_passed' => null,
                    'duration_seconds' => null,
                    'violations_count' => 0,
                    'classification' => null,
                    'started_at' => null,
                    'submitted_at' => null,
                ];
            }

            $isSubmitted = $attempt->isSubmitted() || $attempt->isGraded();
            $status = $isSubmitted ? 'submitted' : 'in_progress';

            $score = $isSubmitted && $attempt->score !== null ? (float) $attempt->score : null;
            $isPassed = $score !== null ? ($score >= $passScore) : null;

            $durationSeconds = null;
            if ($attempt->started_at && $attempt->submitted_at) {
                $durationSeconds = max(0, $attempt->started_at->diffInSeconds($attempt->submitted_at));
            } elseif ($attempt->started_at) {
                $durationSeconds = max(0, $attempt->started_at->diffInSeconds(now()));
            }

            // Vietnamese Standard Academic Classification
            $classification = null;
            if ($score !== null) {
                $scaledScore = $totalPoints > 0 ? ($score / $totalPoints) * 10.0 : 0.0;
                if ($scaledScore >= 9.0) {
                    $classification = 'Xuất sắc';
                } elseif ($scaledScore >= 8.0) {
                    $classification = 'Giỏi';
                } elseif ($scaledScore >= 6.5) {
                    $classification = 'Khá';
                } elseif ($scaledScore >= 5.0) {
                    $classification = 'Trung bình';
                } else {
                    $classification = 'Yếu';
                }
            }

            return [
                'student_id' => $studentId,
                'student_name' => $studentInfo['student_name'],
                'student_email' => $studentInfo['student_email'],
                'attempt_id' => $attempt->id,
                'attempt_number' => $attempt->attempt_number,
                'status' => $status,
                'score' => $score,
                'total_points' => $totalPoints,
                'is_passed' => $isPassed,
                'duration_seconds' => $durationSeconds,
                'violations_count' => (int) ($attempt->proctoring_events_count ?? 0),
                'classification' => $classification,
                'started_at' => $attempt->started_at?->toIso8601String(),
                'submitted_at' => $attempt->submitted_at?->toIso8601String(),
            ];
        });

        // Apply Status Filter
        if (! empty($filters['status']) && $filters['status'] !== 'all') {
            $scoreboard = $scoreboard->filter(fn (array $row) => $row['status'] === $filters['status']);
        }

        // Apply is_passed Filter
        if (isset($filters['is_passed'])) {
            $expectedPass = filter_var($filters['is_passed'], FILTER_VALIDATE_BOOLEAN);
            $scoreboard = $scoreboard->filter(fn (array $row) => $row['is_passed'] === $expectedPass);
        }

        // Apply Search Filter (name or email)
        if (! empty($filters['search'])) {
            $keyword = mb_strtolower(trim((string) $filters['search']), 'UTF-8');
            $scoreboard = $scoreboard->filter(function (array $row) use ($keyword) {
                return str_contains(mb_strtolower($row['student_name'], 'UTF-8'), $keyword)
                    || str_contains(mb_strtolower($row['student_email'], 'UTF-8'), $keyword);
            });
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'score';
        $direction = strtolower($filters['sort_direction'] ?? ($sortBy === 'score' ? 'desc' : 'asc'));

        $scoreboard = $scoreboard->sort(function (array $a, array $b) use ($sortBy, $direction): int {
            $valA = $a[$sortBy] ?? null;
            $valB = $b[$sortBy] ?? null;

            // Nulls always sort last regardless of direction
            if ($valA === null && $valB === null) {
                return 0;
            }
            if ($valA === null) {
                return 1;
            }
            if ($valB === null) {
                return -1;
            }

            if (is_string($valA) && is_string($valB)) {
                $cmp = strcasecmp($valA, $valB);
            } else {
                $cmp = $valA <=> $valB;
            }

            return $direction === 'desc' ? -$cmp : $cmp;
        })->values();

        // Pagination
        $perPage = min(max((int) ($filters['per_page'] ?? 20), 1), 100);
        $page = max((int) ($filters['page'] ?? 1), 1);
        $total = $scoreboard->count();
        $lastPage = max(1, (int) ceil($total / $perPage));

        $paginatedItems = $scoreboard->slice(($page - 1) * $perPage, $perPage)->values()->all();

        return [
            'items' => $paginatedItems,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => $lastPage,
            ],
        ];
    }
}
