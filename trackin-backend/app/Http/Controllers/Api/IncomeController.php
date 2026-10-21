<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->incomes()->orderByDesc('income_month')->get()
        );
    }

    // Satu pemasukan per bulan: kalau bulan sudah ada, nilainya diperbarui.
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'amount'       => 'required|integer|min:0',
            'income_month' => ['nullable', 'regex:/^\d{4}-\d{2}$/'],
            'income_date'  => 'nullable|date',
        ]);

        $month = $data['income_month']
            ?? (isset($data['income_date']) ? substr($data['income_date'], 0, 7) : now()->format('Y-m'));

        $income = $request->user()->incomes()->updateOrCreate(
            ['income_month' => $month],
            ['amount' => $data['amount'], 'income_date' => $data['income_date'] ?? null]
        );

        return response()->json($income, $income->wasRecentlyCreated ? 201 : 200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $request->user()->incomes()->findOrFail($id)->delete();

        return response()->json(['message' => 'Pemasukan dihapus.']);
    }
}
