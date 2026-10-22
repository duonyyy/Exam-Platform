<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exam_attempts', function (Blueprint $table) {
            $table->index(['exam_session_id', 'status'], 'idx_exam_attempts_session_status');
            $table->index(['exam_session_id', 'score'], 'idx_exam_attempts_session_score');
        });

        Schema::table('attempt_answers', function (Blueprint $table) {
            $table->index(['question_id', 'is_correct'], 'idx_attempt_answers_question_correct');
            $table->index(['attempt_id', 'is_correct'], 'idx_attempt_answers_attempt_correct');
        });
    }

    public function down(): void
    {
        Schema::table('attempt_answers', function (Blueprint $table) {
            $table->dropIndex('idx_attempt_answers_attempt_correct');
            $table->dropIndex('idx_attempt_answers_question_correct');
        });

        Schema::table('exam_attempts', function (Blueprint $table) {
            $table->dropIndex('idx_exam_attempts_session_score');
            $table->dropIndex('idx_exam_attempts_session_status');
        });
    }
};
