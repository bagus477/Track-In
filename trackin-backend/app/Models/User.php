<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name', 'username', 'email', 'phone', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function inventoryItems(): HasMany { return $this->hasMany(InventoryItem::class); }
    public function expenses(): HasMany { return $this->hasMany(Expense::class); }
    public function incomes(): HasMany { return $this->hasMany(Income::class); }
    public function bills(): HasMany { return $this->hasMany(Bill::class); }
    public function notes(): HasMany { return $this->hasMany(Note::class); }
}
