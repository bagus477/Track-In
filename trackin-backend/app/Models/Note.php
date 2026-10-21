<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = ['user_id', 'title', 'body', 'category', 'note_date', 'is_pinned'];

    protected $casts = ['note_date' => 'date:Y-m-d', 'is_pinned' => 'boolean'];

    // Alias supaya cocok dengan catatan.js (timestamp & isPinned)
    protected $appends = ['timestamp', 'isPinned'];

    public function getTimestampAttribute(): ?string
    {
        return $this->note_date?->format('Y-m-d');
    }

    public function getIsPinnedAttribute(): bool
    {
        return (bool) ($this->attributes['is_pinned'] ?? false);
    }
}
