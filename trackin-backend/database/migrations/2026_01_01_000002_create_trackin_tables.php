<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('category')->default('Barang Bersama'); // Barang Bersama | Barang Pribadi | Patungan
            $table->string('purchased_by');
            $table->unsignedBigInteger('price')->default(0);
            $table->date('purchase_date');
            $table->text('description')->nullable();
            $table->string('icon', 16)->nullable();
            $table->timestamps();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('description');
            $table->string('category')->default('Lainnya');
            $table->unsignedBigInteger('amount');
            $table->date('expense_date');
            $table->string('paid_by')->nullable();
            $table->timestamps();
        });

        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('amount');
            $table->string('income_month', 7); // format YYYY-MM
            $table->date('income_date')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'income_month']);
        });

        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedBigInteger('total_amount');
            $table->date('due_date');
            $table->string('status')->default('unpaid'); // unpaid | paid
            $table->timestamps();
        });

        Schema::create('bill_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bill_id')->constrained()->cascadeOnDelete();
            $table->string('member_name');
            $table->unsignedBigInteger('amount')->default(0);
            $table->string('status')->default('unpaid');
            $table->string('split_mode')->default('equal'); // equal | manual
            $table->timestamps();
        });

        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('category')->default('Penting');
            $table->date('note_date');
            $table->boolean('is_pinned')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
        Schema::dropIfExists('bill_members');
        Schema::dropIfExists('bills');
        Schema::dropIfExists('incomes');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('inventory_items');
    }
};
