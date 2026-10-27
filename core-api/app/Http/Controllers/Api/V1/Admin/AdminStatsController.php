<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\ExamAttemptStatus;
use App\Enums\ExamSessionStatus;
use App\Enums\ProctoringSeverity;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamSession;
use App\Models\ProctoringEvent;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminStatsController extends Controller
{
    /**
     * Get aggregated system-wide operational metrics for Admin Dashboard.
     */
    public function index(): JsonResponse
    {
        $usersTotal = User::count();
        $usersByRole = User::query()
            ->selectRaw('role, count(*) as count')
            ->groupBy('role')
            ->pluck('count', 'role')
            ->all();

        $inactiveUsers = User::where('is_active', false)->count();

        $subjectsCount = Subject::count();
        $topicsCount = Topic::count();
        $questionsCount = Question::whereNull('deleted_at')->count();

        $examsCount = Exam::count();
        $sessionsTotal = ExamSession::count();
        $activeSessions = ExamSession::where('status', ExamSessionStatus::PUBLISHED)->count();

        $attemptsTotal = ExamAttempt::count();
        $attemptsSubmitted = ExamAttempt::where('status', ExamAttemptStatus::SUBMITTED)->count();
        $attemptsInProgress = ExamAttempt::where('status', ExamAttemptStatus::IN_PROGRESS)->count();

        $securityAlertsToday = ProctoringEvent::where('severity', ProctoringSeverity::HIGH)
            ->where('created_at', '>=', now()->startOfDay())
            ->count();

        return response()->json([
            'data' => [
                'users' => [
                    'total' => $usersTotal,
                    'students' => $usersByRole[UserRole::STUDENT->value] ?? 0,
                    'teachers' => $usersByRole[UserRole::TEACHER->value] ?? 0,
                    'admins' => $usersByRole[UserRole::ADMIN->value] ?? 0,
                    'inactive' => $inactiveUsers,
                ],
                'academics' => [
                    'total_subjects' => $subjectsCount,
                    'total_topics' => $topicsCount,
                    'total_questions' => $questionsCount,
                ],
                'exams' => [
                    'total_blueprints' => $examsCount,
                    'total_sessions' => $sessionsTotal,
                    'active_sessions' => $activeSessions,
                ],
                'attempts' => [
                    'total_attempts' => $attemptsTotal,
                    'submitted' => $attemptsSubmitted,
                    'in_progress' => $attemptsInProgress,
                ],
                'security_alerts_today' => $securityAlertsToday,
            ],
        ]);
    }
}
