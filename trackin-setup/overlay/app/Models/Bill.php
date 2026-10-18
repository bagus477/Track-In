<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bill extends Model
{
    protected $fillable = ['user_id', 'name', 'total_amount', 'due_date', 'status'];

    protected $casts = ['total_amount' => 'integer', 'due_date' => 'date:Y-m-d'];

    public function members(): HasMany
    {
        return $this->hasMany(BillMember::class);
    }
}
