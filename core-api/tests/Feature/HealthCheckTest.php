<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    /**
     * Test the GET /api/v1/health endpoint returns structured JSON.
     */
    public function test_health_check_returns_success_structure(): void
    {
        $response = $this->getJson('/api/v1/health');

        // Check either 200 (healthy) or 503 (degraded DB in testing environment)
        $this->assertContains($response->status(), [200, 503]);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'status',
                'timestamp',
                'version',
                'database' => [
                    'driver',
                    'status',
                ],
            ],
        ]);
    }
}
