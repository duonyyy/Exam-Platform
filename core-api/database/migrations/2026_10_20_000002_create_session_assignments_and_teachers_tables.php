<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_assignments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('exam_session_id')->constrained('exam_sessions')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->restrictOnDelete();
            $table->timestampTz('assigned_at')->nullable();
            $table->timestamps();

            $table->unique(['exam_session_id', 'student_id']);
            $table->index('student_id');
        });

        Schema::create('session_teachers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('exam_session_id')->constrained('exam_sessions')->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('users')->restrictOnDelete();
            $table->string('role_in_session')->default('proctor');
            $table->timestamps();

            $table->unique(['exam_session_id', 'teacher_id']);
            $table->index('teacher_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_teachers');
        Schema::dropIfExists('session_assignments');
    }
};
