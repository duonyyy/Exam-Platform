<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::table('questions')->whereNotIn('status', ['draft', 'pending', 'approved', 'rejected', 'ready', 'disabled'])->exists()) {
            throw new LogicException('Unknown question status; inspect data before changing the lifecycle.');
        }

        // Keep previously rejected or unreviewed questions unavailable; only newly created questions are ready immediately.
        DB::table('questions')->whereIn('status', ['draft', 'pending', 'rejected'])->update(['status' => 'disabled']);
        DB::table('questions')->where('status', 'approved')->update(['status' => 'ready']);
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE questions ALTER COLUMN status SET DEFAULT 'ready'");
        }
    }

    public function down(): void
    {
        // Legacy draft/pending/rejected states cannot be reconstructed after migration.
        throw new LogicException('Question status migration is forward-only; restore from backup or use a forward fix.');
    }
};
