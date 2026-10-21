<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillMember extends Model
{
    protected $fillable = ['bill_id', 'member_name', 'amount', 'status', 'split_mode'];

    protected $casts = ['amount' => 'integer'];

    public function bill(): BelongsTo
    {
        return $this->belongsTo(Bill::class);
    }
}
