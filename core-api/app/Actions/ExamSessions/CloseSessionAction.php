<?php

namespace App\Actions\ExamSessions;

use App\Enums\ExamSessionStatus;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class CloseSessionAction
{
    public function handle(ExamSession $session, User $actor): ExamSession
    {
        return DB::transaction(function () use ($session, $actor): ExamSession {
            /** @var ExamSession $lockedSession */
            $lockedSession = ExamSession::query()->whereKey($session->id)->lockForUpdate()->firstOrFail();
            $lockedSession->load(['exam.subject', 'sessionTeachers']);

            // Recheck policy inside transaction
            Gate::forUser($actor)->authorize('close', $lockedSession);

            // FSM Guard: only published session can be closed
            if ($lockedSession->status !== ExamSessionStatus::PUBLISHED) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Chỉ ca thi đang công bố (published) mới có thể đóng.',
                    'error_code' => 'INVALID_STATE_TRANSITION',
                ], Response::HTTP_CONFLICT));
            }

            // Valid transition: published -> closed
            $lockedSession->status = ExamSessionStatus::CLOSED;
            $lockedSession->save();

            return $lockedSession->load(['exam'])->loadCount(['assignments', 'sessionTeachers']);
        });
    }
}
