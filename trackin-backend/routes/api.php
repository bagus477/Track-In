<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BillController;
use App\Http\Controllers\Api\BillMemberController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\IncomeController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\NoteController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json(['status' => 'ok', 'app' => 'Track IN']));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Akun
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::put('/me/password', [AuthController::class, 'updatePassword']);
    Route::delete('/me', [AuthController::class, 'destroy']);

    // Inventaris, keuangan, catatan
    Route::apiResource('inventory', InventoryController::class);
    Route::apiResource('expenses', ExpenseController::class);
    Route::apiResource('incomes', IncomeController::class)->only(['index', 'store', 'destroy']);
    Route::apiResource('bills', BillController::class);
    Route::apiResource('bill-members', BillMemberController::class)->only(['store', 'update', 'destroy']);

    Route::patch('/notes/{note}/pin', [NoteController::class, 'togglePin']);
    Route::apiResource('notes', NoteController::class);
});
