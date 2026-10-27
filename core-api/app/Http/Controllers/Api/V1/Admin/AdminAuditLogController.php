<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiGenerationLog;
use App\Models\ProctoringEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuditLogController extends Controller
{
    /**
     * Display a unified audit log stream combining AI Copilot and Proctoring security events.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min(100, max(5, (int) $request->input('per_page', 20)));

        $aiLogs = AiGenerationLog::query()
            ->with(['actor:id,name,email,code,role', 'generatedExam:id,title'])
            ->orderBy('id', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => 'ai_' . $log->id,
                    'category' => 'ai_copilot',
                    'action' => 'AI_BLUEPRINT_' . strtoupper($log->status),
                    'actor' => $log->actor ? [
                        'id' => $log->actor->id,
                        'name' => $log->actor->name,
                        'email' => $log->actor->email,
                        'role' => $log->actor->role->value,
                    ] : null,
                    'description' => "Đề thi '#{$log->generated_exam_id}: " . ($log->generatedExam?->title ?? 'Mẫu') . "' trạng thái {$log->status}",
                    'thread_id' => $log->thread_id,
                    'proposal_hash' => $log->proposal_hash,
                    'severity' => 'info',
                    'timestamp' => $log->created_at?->toIso8601String(),
                ];
            });

        $proctoringLogs = ProctoringEvent::query()
            ->with(['attempt.student:id,name,email,code', 'attempt.session:id,title'])
            ->whereIn('severity', ['medium', 'high'])
            ->orderBy('id', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($event) {
                $student = $event->attempt?->student;
                $session = $event->attempt?->session;
                return [
                    'id' => 'proc_' . $event->id,
                    'category' => 'proctoring',
                    'action' => strtoupper($event->event_type->value),
                    'actor' => $student ? [
                        'id' => $student->id,
                        'name' => $student->name,
                        'email' => $student->email,
                        'role' => 'student',
                    ] : null,
                    'description' => "Cảnh báo {$event->severity->value} trong ca thi '" . ($session?->title ?? 'Ca thi') . "'",
                    'metadata' => $event->metadata,
                    'severity' => $event->severity->value,
                    'timestamp' => $event->created_at?->toIso8601String(),
                ];
            });

        $merged = $aiLogs->concat($proctoringLogs)
            ->sortByDesc('timestamp')
            ->values()
            ->take($perPage);

        return response()->json([
            'data' => $merged,
            'meta' => [
                'total' => $aiLogs->count() + $proctoringLogs->count(),
                'per_page' => $perPage,
            ],
        ]);
    }
}
