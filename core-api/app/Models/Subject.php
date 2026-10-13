<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property int $created_by
 * @property int|null $owner_teacher_id
 * @property int|null $topics_count
 */
class Subject extends Model
{
    protected $fillable = ['code', 'name', 'description'];

    protected function casts(): array
    {
        return [
            'created_by' => 'integer',
            'owner_teacher_id' => 'integer',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function ownerTeacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_teacher_id');
    }

    public function topics(): HasMany
    {
        return $this->hasMany(Topic::class);
    }
}
