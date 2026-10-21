<?php

namespace App\Enums;

enum ExamAttemptStatus: string
{
    case IN_PROGRESS = 'in_progress';
    case SUBMITTED = 'submitted';
    case GRADED = 'graded';
}
