<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Expense;
use App\Models\Income;
use App\Models\InventoryItem;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $totalIncome = Income::where('user_id', $userId)->sum('amount');

        $totalExpense = Expense::where('user_id', $userId)->sum('amount');

        $totalInventory = InventoryItem::where('user_id', $userId)->count();

        $inventoryValue = InventoryItem::where('user_id', $userId)->sum('price');

        $unpaidBills = Bill::where('user_id', $userId)
            ->where('status', 'unpaid')
            ->count();

        $unpaidBillAmount = Bill::where('user_id', $userId)
            ->where('status', 'unpaid')
            ->sum('total_amount');

        $recentNotes = Note::where('user_id', $userId)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'balance' => $totalIncome - $totalExpense,

                'income' => [
                    'total' => $totalIncome,
                ],

                'expense' => [
                    'total' => $totalExpense,
                ],

                'inventory' => [
                    'total_items' => $totalInventory,
                    'total_value' => $inventoryValue,
                ],

                'bills' => [
                    'unpaid_count' => $unpaidBills,
                    'unpaid_amount' => $unpaidBillAmount,
                ],

                'recent_notes' => $recentNotes,
            ],
        ]);
    }
}
