<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    private function find(Request $request, $id): Note
    {
        return $request->user()->notes()->findOrFail($id);
    }

    // Frontend mengirim "timestamp" (YYYY-MM-DD); kita petakan ke kolom note_date.
    private function validated(Request $request): array
    {
        $request->merge([
            'note_date' => $request->input('note_date', $request->input('timestamp')),
        ]);

        $data = $request->validate([
            'title'     => 'required|string|max:150',
            'body'      => 'nullable|string|max:5000',
            'category'  => 'required|in:Penting,Keuangan,Pribadi',
            'note_date' => 'required|date',
        ]);

        $data['body'] = $data['body'] ?? '';

        return $data;
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->notes()->orderByDesc('is_pinned')->orderByDesc('note_date')->orderByDesc('id')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json($request->user()->notes()->create($this->validated($request) + ['is_pinned' => false])->fresh(), 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        return response()->json($this->find($request, $id));
    }

    public function update(Request $request, $id): JsonResponse
    {
        $note = $this->find($request, $id);
        $note->update($this->validated($request));

        return response()->json($note->fresh());
    }

    public function togglePin(Request $request, $id): JsonResponse
    {
        $note = $this->find($request, $id);
        $note->update(['is_pinned' => ! $note->is_pinned]);

        return response()->json($note->fresh());
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $this->find($request, $id)->delete();

        return response()->json(['message' => 'Catatan dihapus.']);
    }
}
