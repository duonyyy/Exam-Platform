<?php

namespace App\Enums;

enum ProctoringEventType: string
{
    case TAB_HIDDEN = 'tab_hidden';
    case WINDOW_BLUR = 'window_blur';
    case FULLSCREEN_EXIT = 'fullscreen_exit';
    case DEVTOOLS_OPENED = 'devtools_opened';
    case COPY_PASTE_ATTEMPT = 'copy_paste_attempt';
    case MULTIPLE_DISPLAYS = 'multiple_displays';
}
