<?php

namespace App\Policies;

use App\Models\Subject;
use App\Models\User;

class SubjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, Subject $subject): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $user->is_active && ($user->isAdmin() || $user->isTeacher());
    }

    public function createTopic(User $user, Subject $subject): bool
    {
        return $user->is_active
            && ($user->isAdmin() || ($user->isTeacher() && $subject->owner_teacher_id === $user->id));
    }

    public function update(User $user, Subject $subject): bool
    {
        return $user->is_active
            && ($user->isAdmin() || ($user->isTeacher() && $subject->owner_teacher_id === $user->id));
    }

    public function delete(User $user, Subject $subject): bool
    {
        return $this->update($user, $subject);
    }
}
