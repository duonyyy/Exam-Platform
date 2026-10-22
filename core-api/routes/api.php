<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ExamAttemptController;
use App\Http\Controllers\Api\V1\ExamController;
use App\Http\Controllers\Api\V1\ExamSessionController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\ProctoringEventController;
use App\Http\Controllers\Api\V1\QuestionController;
use App\Http\Controllers\Api\V1\StudentExamSessionController;
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
        Route::get('/exams', [ExamController::class, 'index'])->name('api.v1.exams.index');
        Route::post('/exams', [ExamController::class, 'store'])->name('api.v1.exams.store');
        Route::post('/exams/{exam}/questions', [ExamController::class, 'attachQuestions'])->name('api.v1.exams.questions.store');
        // Exam Sessions Lifecycle (Phase 6)
        Route::get('/exam-sessions', [ExamSessionController::class, 'index'])->name('api.v1.exam-sessions.index');
        Route::post('/exam-sessions', [ExamSessionController::class, 'store'])->name('api.v1.exam-sessions.store');
        Route::get('/exam-sessions/{exam_session}', [ExamSessionController::class, 'show'])->name('api.v1.exam-sessions.show');
        Route::post('/exam-sessions/{exam_session}/publish', [ExamSessionController::class, 'publish'])->name('api.v1.exam-sessions.publish');
        Route::post('/exam-sessions/{exam_session}/close', [ExamSessionController::class, 'close'])->name('api.v1.exam-sessions.close');
        // Student Assignments & Teacher Invigilation (Phase 7)
        Route::post('/exam-sessions/{exam_session}/assign-students', [ExamSessionController::class, 'assignStudents'])->name('api.v1.exam-sessions.assign-students');
        Route::post('/exam-sessions/{exam_session}/assign-teachers', [ExamSessionController::class, 'assignTeachers'])->name('api.v1.exam-sessions.assign-teachers');
        // Live Proctoring & Violation Summary (Phase 10)
        Route::get('/exam-sessions/{exam_session}/proctoring-summary', [ProctoringEventController::class, 'summary'])->name('api.v1.exam-sessions.proctoring-summary');
        Route::get('/exam-sessions/{exam_session}/proctoring-events', [ProctoringEventController::class, 'index'])->name('api.v1.exam-sessions.proctoring-events.index');
        // Results & Analytics (Phase 11)
        Route::get('/exam-sessions/{exam_session}/results', [ExamSessionController::class, 'results'])->name('api.v1.exam-sessions.results');
    });

    // Student routes & Attempt Lifecycle (Phase 8, 9, 10)
    Route::middleware(['role:student'])->group(function () {
        // Assigned sessions list (Phase 7)
        Route::get('/student/assigned-sessions', [StudentExamSessionController::class, 'index'])->name('api.v1.student.assigned-sessions');
        // Exam Taking & Autosave (Phase 8)
        Route::post('/exam-sessions/{exam_session}/attempts', [ExamAttemptController::class, 'start'])->name('api.v1.exam-sessions.attempts.start');
        Route::patch('/exam-attempts/{exam_attempt}/answers', [ExamAttemptController::class, 'saveAnswer'])->name('api.v1.exam-attempts.answers.save');
        // Submit & Scoring (Phase 9)
        Route::post('/exam-attempts/{exam_attempt}/submit', [ExamAttemptController::class, 'submit'])->name('api.v1.exam-attempts.submit');
        // Record Proctoring Events (Phase 10 - Rate limited 30 req/min)
        Route::post('/exam-attempts/{exam_attempt}/proctoring-events', [ProctoringEventController::class, 'record'])
            ->middleware('throttle:30,1')
            ->name('api.v1.exam-attempts.proctoring-events.record');
    });

    // Attempt room view (Student owner, Teacher, Admin - protected by ExamAttemptPolicy)
    Route::get('/exam-attempts/{exam_attempt}', [ExamAttemptController::class, 'show'])->name('api.v1.exam-attempts.show');
});
