<?php

use App\Http\Controllers\Api\V1\HealthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Exam Platform (/api/v1)
|--------------------------------------------------------------------------
| All routes in this file are prefixed with /api/v1 via bootstrap/app.php
| Single Source of Truth: docs/03-architecture-api/12-API_DESIGN.md
*/

// System Health Check (Phase 1 Baseline)
Route::get('/health', [HealthController::class, 'check'])->name('api.v1.health');

// Phase 2: Authentication & RBAC
Route::prefix('auth')->group(function () {
    // POST /api/v1/auth/register
    // POST /api/v1/auth/login
    // POST /api/v1/auth/logout (auth:sanctum)
    // GET  /api/v1/auth/me (auth:sanctum)
});

// Protected routes (Sanctum)
Route::middleware(['auth:sanctum'])->group(function () {
    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        // Users & System Settings
    });

    // Teacher & Admin routes
    Route::middleware(['role:teacher,admin'])->group(function () {
        // Subjects & Topics (Phase 3)
        // Question Bank & Review (Phase 4)
        // Exam Templates & Assembly (Phase 5)
        // Exam Sessions Lifecycle (Phase 6)
        // Student Assignments (Phase 7)
    });

    // Student routes
    Route::middleware(['role:student'])->prefix('student')->group(function () {
        // Assigned sessions list
        // Exam Taking & Autosave (Phase 8)
        // Submit Exam Attempt (Phase 9)
        // Proctoring Events (Phase 10)
    });
});
