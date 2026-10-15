<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\QuestionController;
use App\Http\Controllers\Api\V1\SubjectController;
use App\Http\Controllers\Api\V1\TopicController;
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
    Route::post('/register', [AuthController::class, 'register'])->name('api.v1.auth.register');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1')->name('api.v1.auth.login');
});

// Every protected route checks current account status after Sanctum authentication.
Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('api.v1.auth.logout');
        Route::get('/me', [AuthController::class, 'me'])->name('api.v1.auth.me');
    });

    Route::middleware(['role:admin,teacher,student'])->group(function () {
        Route::get('/subjects', [SubjectController::class, 'index'])->name('api.v1.subjects.index');
        Route::get('/subjects/{subject}', [SubjectController::class, 'show'])->name('api.v1.subjects.show');
        Route::get('/subjects/{subject}/topics', [TopicController::class, 'index'])->name('api.v1.subjects.topics.index');
    });

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        // Users & System Settings
    });

    // Teacher & Admin routes
    Route::middleware(['role:teacher,admin'])->group(function () {
        Route::post('/subjects', [SubjectController::class, 'store'])->name('api.v1.subjects.store');
        Route::patch('/subjects/{subject}', [SubjectController::class, 'update'])->name('api.v1.subjects.update');
        Route::delete('/subjects/{subject}', [SubjectController::class, 'destroy'])->name('api.v1.subjects.destroy');
        Route::post('/subjects/{subject}/topics', [TopicController::class, 'store'])->name('api.v1.subjects.topics.store');
        // Question Bank (Phase 4)
        Route::get('/questions', [QuestionController::class, 'index'])->name('api.v1.questions.index');
        Route::post('/questions', [QuestionController::class, 'store'])->name('api.v1.questions.store');
        Route::put('/questions/{question}', [QuestionController::class, 'update'])->name('api.v1.questions.update');
        Route::patch('/questions/{question}/status', [QuestionController::class, 'changeStatus'])->name('api.v1.questions.status');
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
