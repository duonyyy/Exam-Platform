<?php

namespace App\Enums;

enum ExamSessionStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case CLOSED = 'closed';
    case CANCELLED = 'cancelled';
}
