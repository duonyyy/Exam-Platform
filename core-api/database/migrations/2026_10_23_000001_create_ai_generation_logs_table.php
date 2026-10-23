<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_generation_logs', function (Blueprint $table): void {
            $table->id();
            $table->string('thread_id', 64);
            $table->foreignId('actor_id')->constrained('users')->restrictOnDelete();
            $table->string('prompt_hash', 64);
            $table->string('proposal_hash', 64);
            $table->foreignId('generated_exam_id')->nullable()->constrained('exams')->nullOnDelete();
            $table->string('status', 32)->default('applied'); // applied, rejected, failed
            $table->jsonb('metadata')->nullable();
            $table->timestamps();

            $table->unique(['thread_id', 'proposal_hash'], 'uq_ai_logs_thread_proposal');
            $table->index(['actor_id', 'thread_id'], 'idx_ai_logs_actor_thread');
            $table->index('proposal_hash', 'idx_ai_logs_proposal_hash');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_generation_logs');
    }
};
