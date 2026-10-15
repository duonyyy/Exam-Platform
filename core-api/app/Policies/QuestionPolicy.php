<?php

namespace App\Policies;

use App\Models\Question;
use App\Models\Topic;
use App\Models\User;

class QuestionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && ($user->isAdmin() || $user->isTeacher());
    }

    public function view(User $user, Question $question): bool
    {
        return $this->viewAny($user)
            && ($user->isAdmin() || $question->topic->subject->owner_teacher_id === $user->id);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function createInTopic(User $user, Topic $topic): bool
    {
        return $this->create($user)
            && ($user->isAdmin() || $topic->subject->owner_teacher_id === $user->id);
    }

    public function update(User $user, Question $question): bool
    {
        return $this->view($user, $question);
    }
}
