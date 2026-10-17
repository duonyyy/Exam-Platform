<?php

namespace App\Policies;

use App\Models\Exam;
use App\Models\Subject;
use App\Models\User;

class ExamPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && ($user->isAdmin() || $user->isTeacher());
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function createInSubject(User $user, Subject $subject): bool
    {
        return $this->create($user)
            && ($user->isAdmin() || $subject->owner_teacher_id === $user->id);
    }

    public function update(User $user, Exam $exam): bool
    {
        return $this->viewAny($user)
            && ($user->isAdmin() || $exam->subject->owner_teacher_id === $user->id);
    }
}
