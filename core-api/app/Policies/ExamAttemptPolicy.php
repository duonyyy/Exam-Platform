<?php

namespace App\Policies;

use App\Enums\ExamAttemptStatus;
use App\Models\ExamAttempt;
use App\Models\User;

class ExamAttemptPolicy
{
    public function view(User $user, ExamAttempt $attempt): bool
    {
        if (! $user->is_active) {
            return false;
        }

        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isStudent()) {
            return $attempt->student_id === $user->id;
        }

        if ($user->isTeacher()) {
            $session = $attempt->session;
            if (! $session) {
                return false;
            }

            if ($session->created_by === $user->id) {
                return true;
            }

            if ($session->exam?->subject?->owner_teacher_id === $user->id) {
                return true;
            }

            return $session->sessionTeachers()->where('teacher_id', $user->id)->exists();
        }

        return false;
    }

    public function saveAnswer(User $user, ExamAttempt $attempt): bool
    {
        return $user->is_active
            && $user->isStudent()
            && $attempt->student_id === $user->id
            && $attempt->status === ExamAttemptStatus::IN_PROGRESS;
    }

    public function submit(User $user, ExamAttempt $attempt): bool
    {
        return $user->is_active
            && $user->isStudent()
            && $attempt->student_id === $user->id;
    }

    public function recordProctoring(User $user, ExamAttempt $attempt): bool
    {
        return $user->is_active
            && $user->isStudent()
            && $attempt->student_id === $user->id
            && $attempt->status === ExamAttemptStatus::IN_PROGRESS;
    }
}
