<?php

namespace App\Http\Requests\Proctoring;

use App\Enums\ProctoringEventType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecordProctoringEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $validTypes = array_column(ProctoringEventType::cases(), 'value');

        // If batch format
        if ($this->has('events') && is_array($this->input('events'))) {
            return [
                'events' => ['required', 'array', 'min:1', 'max:50'],
                'events.*.event_type' => ['required', 'string', Rule::in($validTypes)],
                'events.*.occurred_at' => ['nullable', 'date'],
                'events.*.metadata' => ['nullable', 'array'],
            ];
        }

        // Single format
        return [
            'event_type' => ['required', 'string', Rule::in($validTypes)],
            'occurred_at' => ['nullable', 'date'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
