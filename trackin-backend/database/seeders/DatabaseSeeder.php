<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'yusuf@trackin.test'],
            [
                'name'     => 'Yusuf',
                'username' => 'yusuf',
                'phone'    => '081234567890',
                'password' => 'password123',
            ]
        );

        if ($user->inventoryItems()->exists()) {
            return;
        }

        $user->inventoryItems()->createMany([
            ['name' => 'Laptop ASUS', 'category' => 'Barang Pribadi', 'purchased_by' => 'Yusuf', 'price' => 8000000, 'purchase_date' => '2026-08-01', 'description' => 'Laptop untuk kuliah', 'icon' => '💻'],
            ['name' => 'Meja Belajar', 'category' => 'Barang Bersama', 'purchased_by' => 'Bagus', 'price' => 750000, 'purchase_date' => '2026-08-05', 'description' => 'Meja untuk ruang bersama', 'icon' => '🪑'],
            ['name' => 'Kipas Angin', 'category' => 'Patungan', 'purchased_by' => 'Hafidz', 'price' => 350000, 'purchase_date' => '2026-08-10', 'description' => 'Dibeli patungan', 'icon' => '🌀'],
        ]);

        $user->expenses()->createMany([
            ['description' => 'Bayar Kost', 'category' => 'Kost', 'amount' => 500000, 'expense_date' => '2026-08-01', 'paid_by' => 'Yusuf'],
            ['description' => 'WiFi', 'category' => 'WiFi', 'amount' => 150000, 'expense_date' => '2026-08-05', 'paid_by' => 'Bagus'],
            ['description' => 'Listrik', 'category' => 'Listrik', 'amount' => 100000, 'expense_date' => '2026-08-10', 'paid_by' => 'Hafidz'],
        ]);

        $user->incomes()->create(['amount' => 1500000, 'income_month' => '2026-08']);

        $bill = $user->bills()->create(['name' => 'Tagihan WiFi', 'total_amount' => 150000, 'due_date' => '2026-08-25', 'status' => 'unpaid']);
        foreach (['Yusuf', 'Bagus', 'Hafidz'] as $name) {
            $bill->members()->create(['member_name' => $name, 'amount' => 50000]);
        }

        $user->notes()->createMany([
            ['title' => 'Bayar Kost', 'body' => 'Jangan lupa bayar kost setiap tanggal 1', 'category' => 'Penting', 'note_date' => '2026-08-25'],
            ['title' => 'Belanja Bulanan', 'body' => 'Beli kebutuhan bulanan', 'category' => 'Keuangan', 'note_date' => '2026-08-24'],
        ]);
    }
}
