<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillController extends Controller
{
    private function rules(): array
    {
        return [
            'name'         => 'required|string|max:150',
            'total_amount' => 'required|integer|min:1',
            'due_date'     => 'required|date',
            'status'       => 'nullable|in:unpaid,paid',
        ];
    }

    private function find(Request $request, $id): Bill
    {
        return $request->user()->bills()->with('members')->findOrFail($id);
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->bills()->with('members')->orderBy('due_date')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules());
        $data['status'] = $data['status'] ?? 'unpaid';

        $bill = $request->user()->bills()->create($data);

        return response()->json($bill->load('members'), 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        return response()->json($this->find($request, $id));
    }

    public function update(Request $request, $id): JsonResponse
    {
        $bill = $this->find($request, $id);
        $bill->update($request->validate($this->rules()));

        return response()->json($bill->fresh('members'));
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $this->find($request, $id)->delete();

        return response()->json(['message' => 'Tagihan dihapus.']);
    }
}
