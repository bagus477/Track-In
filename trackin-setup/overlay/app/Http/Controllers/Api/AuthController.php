<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'username' => 'nullable|string|max:50|unique:users,username',
            'email'    => 'required|email|max:150|unique:users,email',
            'phone'    => 'nullable|string|max:30',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create($data);

        return response()->json([
            'message' => 'Registrasi berhasil.',
            'token'   => $user->createToken('trackin')->plainTextToken,
            'user'    => $user,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        return response()->json([
            'message' => 'Login berhasil.',
            'token'   => $user->createToken('trackin')->plainTextToken,
            'user'    => $user,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil keluar.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name'     => 'sometimes|required|string|max:100',
            'username' => ['sometimes', 'nullable', 'string', 'max:50', Rule::unique('users', 'username')->ignore($user->id)],
            'email'    => ['sometimes', 'required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($user->id)],
            'phone'    => 'sometimes|nullable|string|max:30',
        ]);

        $user->update($data);

        return response()->json(['message' => 'Profil diperbarui.', 'user' => $user->fresh()]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8',
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Password saat ini salah.',
                'errors'  => ['current_password' => ['Password saat ini salah.']],
            ], 422);
        }

        $user->update(['password' => $data['new_password']]);

        return response()->json(['message' => 'Password berhasil diperbarui.']);
    }

    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete(); // data lain ikut terhapus (cascade)

        return response()->json(['message' => 'Akun dihapus.']);
    }
}
