<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = ['user_id', 'name', 'category', 'purchased_by', 'price', 'purchase_date', 'description', 'icon'];

    protected $casts = ['price' => 'integer', 'purchase_date' => 'date:Y-m-d'];
}
