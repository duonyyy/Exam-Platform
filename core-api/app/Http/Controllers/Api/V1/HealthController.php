<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    /**
     * Check system health and database connectivity.
     */
    public function check(): JsonResponse
    {
        $dbStatus = 'connected';
        $dbLatencyMs = null;

        try {
            $start = microtime(true);
            DB::connection()->getPdo();
            $dbLatencyMs = round((microtime(true) - $start) * 1000, 2);
        } catch (Throwable $e) {
            $dbStatus = 'disconnected';
        }

        $isHealthy = $dbStatus === 'connected';

        return response()->json([
            'success' => $isHealthy,
            'message' => $isHealthy ? 'Exam Platform API is fully operational' : 'Database connection error',
            'data' => [
                'status' => $isHealthy ? 'healthy' : 'degraded',
                'timestamp' => now()->toIso8601String(),
                'version' => '1.0.0',
                'environment' => config('app.env'),
                'database' => [
                    'driver' => config('database.default'),
                    'status' => $dbStatus,
                    'latency_ms' => $dbLatencyMs,
                ],
            ],
        ], $isHealthy ? 200 : 503);
    }
}
