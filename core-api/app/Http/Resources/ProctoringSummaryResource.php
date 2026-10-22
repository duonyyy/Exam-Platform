<?php

namespace App\Http\Resources;

use App\Models\ExamSession;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property ExamSession $resource
 */
class ProctoringSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ExamSession $session */
        $session = $this->resource;

        $events = $session->proctoringEvents()
            ->with(['attempt.student'])
            ->get();

        $totalEvents = $events->count();

        $severityBreakdown = [
            'low' => $events->where('severity.value', 'low')->count(),
            'medium' => $events->where('severity.value', 'medium')->count(),
            'high' => $events->where('severity.value', 'high')->count(),
            'critical' => $events->where('severity.value', 'critical')->count(),
        ];

        $eventTypeBreakdown = $events->groupBy(fn ($e) => $e->event_type->value)
            ->map(fn ($group) => $group->count())
            ->toArray();

        // Group by attempt
        $attemptsGrouped = $events->groupBy('attempt_id');
        $topFlaggedAttempts = $attemptsGrouped->map(function ($attemptEvents, $attemptId) {
            $first = $attemptEvents->first();
            $attempt = $first?->attempt;
            $student = $attempt?->student;

            $severities = $attemptEvents->pluck('severity.value')->all();
            $highestSeverity = in_array('critical', $severities, true) ? 'critical'
                : (in_array('high', $severities, true) ? 'high'
                : (in_array('medium', $severities, true) ? 'medium' : 'low'));

            return [
                'attempt_id' => (int) $attemptId,
                'student_id' => $student?->id,
                'student_name' => $student?->name,
                'student_code' => $student?->code,
                'total_events' => $attemptEvents->count(),
                'highest_severity' => $highestSeverity,
                'severities' => array_count_values($severities),
            ];
        })->sortByDesc('total_events')->values()->take(10)->all();

        return [
            'exam_session_id' => $session->id,
            'session_title' => $session->title,
            'status' => $session->status->value,
            'total_events' => $totalEvents,
            'flagged_students_count' => $attemptsGrouped->count(),
            'severity_breakdown' => $severityBreakdown,
            'event_type_breakdown' => $eventTypeBreakdown,
            'top_flagged_attempts' => $topFlaggedAttempts,
        ];
    }
}
