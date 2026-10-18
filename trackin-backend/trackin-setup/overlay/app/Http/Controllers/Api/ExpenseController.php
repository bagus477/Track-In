<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    private function rules(): array
    {
        return [
            'description'  => 'required|string|max:150',
            'category'     => 'nullable|string|max:50',
            'amount'       => 'required|integer|min:1',
            'expense_date' => 'required|date',
            'paid_by'      => 'nullable|string|max:100',
        ];
    }

    private function find(Request $request, $id): Expense
    {
        return $request->user()->expenses()->findOrFail($id);
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->expenses()->orderByDesc('expense_date')->orderByDesc('id')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules());
        $data['category'] = $data['category'] ?? 'Lainnya';

        return response()->json($request->user()->expenses()->create($data), 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        return response()->json($this->find($request, $id));
    }

    public function update(Request $request, $id): JsonResponse
    {
        $expense = $this->find($request, $id);
        $expense->update($request->validate($this->rules()));

        return response()->json($expense->fresh());
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $this->find($request, $id)->delete();

        return response()->json(['message' => 'Pengeluaran dihapus.']);
    }
}
