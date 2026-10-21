<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_attempts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('exam_session_id')->constrained('exam_sessions')->restrictOnDelete();
            $table->foreignId('student_id')->constrained('users')->restrictOnDelete();
            $table->unsignedInteger('attempt_number')->default(1);
            $table->string('status')->default('in_progress');
            $table->timestampTz('started_at');
            $table->timestampTz('submitted_at')->nullable();
            $table->decimal('score', 8, 2)->nullable();
            $table->decimal('total_points', 8, 2)->nullable();
            $table->timestamps();

            $table->unique(['exam_session_id', 'student_id', 'attempt_number']);
            $table->index(['exam_session_id', 'student_id', 'status'], 'idx_exam_attempts_lookup');
            $table->index('student_id');
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE exam_attempts ADD CONSTRAINT chk_attempt_number CHECK (attempt_number > 0)');
        }

        Schema::create('attempt_answers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('attempt_id')->constrained('exam_attempts')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions')->restrictOnDelete();
            $table->json('selected_options');
            $table->decimal('awarded_points', 8, 2)->nullable();
            $table->boolean('is_correct')->nullable();
            $table->timestamps();

            $table->unique(['attempt_id', 'question_id']);
            $table->index('attempt_id', 'idx_attempt_answers_attempt');
            $table->index('question_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attempt_answers');
        Schema::dropIfExists('exam_attempts');
    }
};
