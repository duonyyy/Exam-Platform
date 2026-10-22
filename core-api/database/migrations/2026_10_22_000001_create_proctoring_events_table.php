<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proctoring_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_id')
                ->constrained('exam_attempts')
                ->cascadeOnDelete();
            $table->string('event_type', 50);
            $table->string('severity', 20);
            $table->timestamp('occurred_at');
            $table->jsonb('metadata')->nullable();
            $table->timestamps();

            $table->index(['attempt_id', 'severity'], 'idx_proctoring_attempt_severity');
            $table->index('occurred_at', 'idx_proctoring_occurred_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proctoring_events');
    }
};
