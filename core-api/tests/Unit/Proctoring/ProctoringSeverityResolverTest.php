<?php

namespace Tests\Unit\Proctoring;

use App\Enums\ProctoringEventType;
use App\Enums\ProctoringSeverity;
use App\Services\Proctoring\ProctoringSeverityResolver;
use PHPUnit\Framework\TestCase;

class ProctoringSeverityResolverTest extends TestCase
{
    protected ProctoringSeverityResolver $resolver;

    protected function setUp(): void
    {
        parent::setUp();
        $this->resolver = new ProctoringSeverityResolver;
    }

    public function test_devtools_opened_resolves_to_critical(): void
    {
        $severity = $this->resolver->resolve(ProctoringEventType::DEVTOOLS_OPENED);
        $this->assertSame(ProctoringSeverity::CRITICAL, $severity);
    }

    public function test_copy_paste_attempt_resolves_to_high(): void
    {
        $severity = $this->resolver->resolve(ProctoringEventType::COPY_PASTE_ATTEMPT);
        $this->assertSame(ProctoringSeverity::HIGH, $severity);
    }

    public function test_multiple_displays_resolves_to_high(): void
    {
        $severity = $this->resolver->resolve(ProctoringEventType::MULTIPLE_DISPLAYS);
        $this->assertSame(ProctoringSeverity::HIGH, $severity);
    }

    public function test_fullscreen_exit_resolves_to_medium(): void
    {
        $severity = $this->resolver->resolve(ProctoringEventType::FULLSCREEN_EXIT);
        $this->assertSame(ProctoringSeverity::MEDIUM, $severity);
    }

    public function test_tab_hidden_resolves_based_on_duration(): void
    {
        // < 10 seconds -> LOW
        $this->assertSame(
            ProctoringSeverity::LOW,
            $this->resolver->resolve(ProctoringEventType::TAB_HIDDEN, ['duration_seconds' => 5])
        );

        // >= 10 and < 30 seconds -> MEDIUM
        $this->assertSame(
            ProctoringSeverity::MEDIUM,
            $this->resolver->resolve(ProctoringEventType::TAB_HIDDEN, ['duration_seconds' => 15])
        );

        // >= 30 seconds -> HIGH
        $this->assertSame(
            ProctoringSeverity::HIGH,
            $this->resolver->resolve(ProctoringEventType::TAB_HIDDEN, ['duration_seconds' => 45])
        );
    }

    public function test_window_blur_resolves_based_on_duration(): void
    {
        // < 20 seconds -> LOW
        $this->assertSame(
            ProctoringSeverity::LOW,
            $this->resolver->resolve(ProctoringEventType::WINDOW_BLUR, ['duration_seconds' => 5])
        );

        // >= 20 seconds -> MEDIUM
        $this->assertSame(
            ProctoringSeverity::MEDIUM,
            $this->resolver->resolve(ProctoringEventType::WINDOW_BLUR, ['duration_seconds' => 25])
        );
    }

    public function test_invalid_event_type_string_falls_back_to_low(): void
    {
        $this->assertSame(
            ProctoringSeverity::LOW,
            $this->resolver->resolve('unknown_custom_event')
        );
    }
}
