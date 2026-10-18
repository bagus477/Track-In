<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BillMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillMemberController extends Controller
{
    // Pastikan anggota hanya bisa diakses lewat tagihan milik user sendiri.
    private function find(Request $request, $id): BillMember
    {
        return BillMember::whereHas('bill', fn ($q) => $q->where('user_id', $request->user()->id))
            ->findOrFail($id);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'bill_id'     => 'required|integer',
            'member_name' => 'required|string|max:100',
            'amount'      => 'required|integer|min:0',
            'status'      => 'nullable|in:unpaid,paid',
            'split_mode'  => 'nullable|in:equal,manual',
        ]);

        $bill = $request->user()->bills()->findOrFail($data['bill_id']);

        $member = $bill->members()->create([
            'member_name' => $data['member_name'],
            'amount'      => $data['amount'],
            'status'      => $data['status'] ?? 'unpaid',
            'split_mode'  => $data['split_mode'] ?? 'equal',
        ]);

        return response()->json($member, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $member = $this->find($request, $id);

        $member->update($request->validate([
            'member_name' => 'sometimes|required|string|max:100',
            'amount'      => 'sometimes|required|integer|min:0',
            'status'      => 'sometimes|required|in:unpaid,paid',
            'split_mode'  => 'sometimes|required|in:equal,manual',
        ]));

        return response()->json($member->fresh());
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $this->find($request, $id)->delete();

        return response()->json(['message' => 'Anggota dihapus.']);
    }
}
