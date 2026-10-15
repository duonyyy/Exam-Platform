<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->restrictOnDelete();
            // ASVS V8.2: preserve attribution even if an account is deactivated.
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->text('question_text');
            $table->string('question_type');
            $table->jsonb('options')->nullable();
            $table->jsonb('correct_answer');
            $table->text('explanation')->nullable();
            $table->string('difficulty')->default('medium');
            $table->string('status')->default('draft');
            $table->string('source')->default('manual');
            $table->text('rejection_reason')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['topic_id', 'status', 'difficulty']);
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
