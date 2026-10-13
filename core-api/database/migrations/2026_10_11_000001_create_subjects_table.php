<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table): void {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->foreignId('owner_teacher_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index('created_by');
            $table->index('owner_teacher_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
