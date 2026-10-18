<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    protected $fillable = ['user_id', 'amount', 'income_month', 'income_date'];

    protected $casts = ['amount' => 'integer', 'income_date' => 'date:Y-m-d'];
}
