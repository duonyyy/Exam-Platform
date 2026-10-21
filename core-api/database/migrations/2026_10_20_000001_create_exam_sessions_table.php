<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_sessions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->restrictOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->string('title');
            $table->string('status')->default('draft');
            $table->timestampTz('start_at');
            $table->timestampTz('end_at');
            $table->unsignedInteger('allow_late_minutes')->default(15);
            $table->unsignedInteger('max_attempts')->default(1);
            $table->timestamps();

            $table->index(['status', 'start_at', 'end_at'], 'idx_exam_sessions_status_time');
            $table->index('exam_id');
            $table->index('created_by');
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE exam_sessions ADD CONSTRAINT chk_session_time_window CHECK (end_at > start_at)');
            DB::statement('ALTER TABLE exam_sessions ADD CONSTRAINT chk_session_allow_late CHECK (allow_late_minutes >= 0)');
            DB::statement('ALTER TABLE exam_sessions ADD CONSTRAINT chk_session_max_attempts CHECK (max_attempts > 0)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_sessions');
    }
};
