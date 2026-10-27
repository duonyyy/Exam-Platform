<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ListAdminUsersRequest;
use App\Http\Requests\Admin\StoreAdminUserRequest;
use App\Http\Requests\Admin\UpdateAdminUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class AdminUserController extends Controller
{
    /**
     * Display a paginated listing of users for administrative oversight.
     */
    public function index(ListAdminUsersRequest $request): AnonymousResourceCollection
    {
        $query = User::query();

        if ($request->filled('search')) {
            $search = '%' . $request->input('search') . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                    ->orWhere('email', 'like', $search)
                    ->orWhere('code', 'like', $search);
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        if ($request->has('is_active') && $request->input('is_active') !== null) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $perPage = (int) $request->input('per_page', 20);
        $users = $query->orderBy('id', 'desc')->paginate($perPage);

        return UserResource::collection($users);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreAdminUserRequest $request): JsonResponse
    {
        $validated = $request->validated();
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        $user = User::create($validated);

        return (new UserResource($user))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): UserResource
    {
        return new UserResource($user);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateAdminUserRequest $request, User $user): UserResource
    {
        /** @var User $actor */
        $actor = $request->user();

        // Security Guard: Prevent admin from deactivating themselves
        if ($user->id === $actor->id && $request->has('is_active') && !$request->boolean('is_active')) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => 'Cannot deactivate your own administrator account.',
                'error_code' => 'CANNOT_DEACTIVATE_SELF',
            ], Response::HTTP_UNPROCESSABLE_ENTITY));
        }

        // Security Guard: Prevent admin from demoting their own admin role
        if ($user->id === $actor->id && $request->has('role') && $request->input('role') !== UserRole::ADMIN->value) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => 'Cannot change role of your own administrator account.',
                'error_code' => 'CANNOT_DEMOTE_SELF',
            ], Response::HTTP_UNPROCESSABLE_ENTITY));
        }

        $user->update($request->validated());

        return new UserResource($user->fresh());
    }
}
