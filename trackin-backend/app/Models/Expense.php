<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = ['user_id', 'description', 'category', 'amount', 'expense_date', 'paid_by'];

    protected $casts = ['amount' => 'integer', 'expense_date' => 'date:Y-m-d'];
}
