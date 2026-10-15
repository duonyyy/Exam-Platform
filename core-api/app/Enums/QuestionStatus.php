<?php

namespace App\Enums;

enum QuestionStatus: string
{
    case READY = 'ready';
    case DISABLED = 'disabled';
}
