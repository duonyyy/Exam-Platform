<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case TEACHER = 'teacher';
    case STUDENT = 'student';

    /**
     * Get human-readable label in Vietnamese.
     */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Quản trị viên',
            self::TEACHER => 'Giảng viên',
            self::STUDENT => 'Sinh viên',
        };
    }

    /**
     * Get all enum string values.
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
