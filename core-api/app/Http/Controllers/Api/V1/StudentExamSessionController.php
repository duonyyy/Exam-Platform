<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ExamSessionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Students\ListStudentAssignedSessionsRequest;
use App\Http\Resources\StudentAssignedSessionResource;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StudentExamSessionController extends Controller
{
    public function index(ListStudentAssignedSessionsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        /** @var User $student */
        $student = $request->user();

        $query = ExamSession::query()
            ->whereHas('assignments', fn ($q) => $q->where('student_id', $student->id))
            ->with([
                'exam.subject',
                'assignments' => fn ($q) => $q->where('student_id', $student->id),
            ]);

        // Students can only see published or closed sessions
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            $query->whereIn('status', [ExamSessionStatus::PUBLISHED, ExamSessionStatus::CLOSED]);
        }

        return StudentAssignedSessionResource::collection(
            $query->orderBy('start_at')->paginate($filters['per_page'] ?? 20)
        );
    }
}
