<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
                'error_code' => 'UNAUTHENTICATED',
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Support comma separated roles: role:teacher,admin
        $allowedRoles = [];
        foreach ($roles as $roleGroup) {
            foreach (explode(',', $roleGroup) as $role) {
                $allowedRoles[] = trim($role);
            }
        }

        $userRole = $user->role instanceof \BackedEnum ? $user->role->value : (string) $user->role;

        if (! in_array($userRole, $allowedRoles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. You do not have the required role permissions.',
                'error_code' => 'FORBIDDEN_INSUFFICIENT_ROLE',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
