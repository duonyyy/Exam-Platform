<?php

namespace App\Services\Proctoring;

use App\Enums\ProctoringEventType;
use App\Enums\ProctoringSeverity;

class ProctoringSeverityResolver
{
    /**
     * Resolve the severity of a proctoring event deterministically.
     *
     * @param  array<string, mixed>|null  $metadata
     */
    public function resolve(ProctoringEventType|string $type, ?array $metadata = null): ProctoringSeverity
    {
        $eventType = is_string($type) ? ProctoringEventType::tryFrom($type) : $type;

        if (! $eventType) {
            return ProctoringSeverity::LOW;
        }

        $duration = isset($metadata['duration_seconds']) && is_numeric($metadata['duration_seconds'])
            ? (int) $metadata['duration_seconds']
            : 0;

        return match ($eventType) {
            ProctoringEventType::DEVTOOLS_OPENED => ProctoringSeverity::CRITICAL,
            ProctoringEventType::MULTIPLE_DISPLAYS => ProctoringSeverity::HIGH,
            ProctoringEventType::COPY_PASTE_ATTEMPT => ProctoringSeverity::HIGH,
            ProctoringEventType::FULLSCREEN_EXIT => ProctoringSeverity::MEDIUM,
            ProctoringEventType::TAB_HIDDEN => match (true) {
                $duration >= 30 => ProctoringSeverity::HIGH,
                $duration >= 10 => ProctoringSeverity::MEDIUM,
                default => ProctoringSeverity::LOW,
            },
            ProctoringEventType::WINDOW_BLUR => match (true) {
                $duration >= 20 => ProctoringSeverity::MEDIUM,
                default => ProctoringSeverity::LOW,
            },
        };
    }
}
