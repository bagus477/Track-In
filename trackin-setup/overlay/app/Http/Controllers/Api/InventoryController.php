<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    private function rules(): array
    {
        return [
            'name'          => 'required|string|max:150',
            'category'      => 'required|in:Barang Bersama,Barang Pribadi,Patungan',
            'purchased_by'  => 'required|string|max:100',
            'price'         => 'required|integer|min:0',
            'purchase_date' => 'required|date',
            'description'   => 'nullable|string|max:1000',
            'icon'          => 'nullable|string|max:16',
        ];
    }

    private function find(Request $request, $id): InventoryItem
    {
        return $request->user()->inventoryItems()->findOrFail($id);
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->inventoryItems()->orderByDesc('purchase_date')->orderByDesc('id')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $item = $request->user()->inventoryItems()->create($request->validate($this->rules()));

        return response()->json($item, 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        return response()->json($this->find($request, $id));
    }

    public function update(Request $request, $id): JsonResponse
    {
        $item = $this->find($request, $id);
        $item->update($request->validate($this->rules()));

        return response()->json($item->fresh());
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $this->find($request, $id)->delete();

        return response()->json(['message' => 'Barang dihapus.']);
    }
}
