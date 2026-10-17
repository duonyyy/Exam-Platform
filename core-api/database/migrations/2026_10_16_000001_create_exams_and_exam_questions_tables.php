<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('subject_id')->constrained('subjects')->restrictOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->string('title');
            $table->unsignedInteger('duration_minutes');
            $table->decimal('pass_score', 8, 2);
            $table->decimal('total_points', 8, 2)->default(0);
            $table->boolean('shuffle_questions')->default(false);
            $table->boolean('shuffle_options')->default(false);
            $table->timestamps();

            $table->index('created_by');
        });

        DB::statement('ALTER TABLE exams ADD CONSTRAINT chk_exam_duration CHECK (duration_minutes > 0)');
        DB::statement('ALTER TABLE exams ADD CONSTRAINT chk_exam_pass_score CHECK (pass_score >= 0)');
        DB::statement('ALTER TABLE exams ADD CONSTRAINT chk_exam_total_points CHECK (total_points >= 0)');

        Schema::create('exam_questions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->restrictOnDelete();
            $table->foreignId('question_id')->constrained('questions')->restrictOnDelete();
            $table->unsignedInteger('order');
            $table->decimal('points', 8, 2);
            $table->timestamps();

            $table->unique(['exam_id', 'question_id']);
            $table->unique(['exam_id', 'order']);
            $table->index('question_id');
        });

        DB::statement('ALTER TABLE exam_questions ADD CONSTRAINT chk_exam_question_order CHECK ("order" > 0)');
        DB::statement('ALTER TABLE exam_questions ADD CONSTRAINT chk_exam_question_points CHECK (points > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_questions');
        Schema::dropIfExists('exams');
    }
};
