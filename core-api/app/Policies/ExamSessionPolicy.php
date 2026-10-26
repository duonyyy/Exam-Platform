<?php

namespace App\Policies;

use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\User;

class ExamSessionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && ($user->isAdmin() || $user->isTeacher());
    }

    public function view(User $user, ExamSession $session): bool
    {
        return $this->viewAny($user) && $this->isAuthorizedForSession($user, $session);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function createForExam(User $user, Exam $exam): bool
    {
        return $this->create($user)
            && ($user->isAdmin() || $exam->subject?->owner_teacher_id === $user->id);
    }

    public function publish(User $user, ExamSession $session): bool
    {
        return $this->viewAny($user) && $this->isAuthorizedForSession($user, $session);
    }

    public function close(User $user, ExamSession $session): bool
    {
        return $this->viewAny($user) && $this->isAuthorizedForSession($user, $session);
    }

    public function assignStudents(User $user, ExamSession $session): bool
    {
        return $this->viewAny($user) && $this->isAuthorizedForSession($user, $session);
    }

    public function assignTeachers(User $user, ExamSession $session): bool
    {
        return $this->viewAny($user) && (
            $user->isAdmin()
            || $session->created_by === $user->id
            || $session->exam?->subject?->owner_teacher_id === $user->id
        );
    }

    public function viewProctoring(User $user, ExamSession $session): bool
    {
        return $this->viewAny($user) && $this->isAuthorizedForSession($user, $session);
    }

    public function viewResults(User $user, ExamSession $session): bool
    {
        return $this->viewAny($user) && $this->isAuthorizedForSession($user, $session);
    }

    public function exportResults(User $user, ExamSession $session): bool
    {
        return $this->viewResults($user, $session);
    }

    private function isAuthorizedForSession(User $user, ExamSession $session): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($session->created_by === $user->id) {
            return true;
        }

        if ($session->exam?->subject?->owner_teacher_id === $user->id) {
            return true;
        }

        return $session->sessionTeachers()->where('teacher_id', $user->id)->exists();
    }
}
