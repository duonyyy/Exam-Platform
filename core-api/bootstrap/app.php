<?php

use App\Http\Middleware\EnsureActiveUser;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Routing\Middleware\SubstituteBindings;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api/v1',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'active' => EnsureActiveUser::class,
            'role' => RoleMiddleware::class,
        ]);
        $middleware->prependToPriorityList(SubstituteBindings::class, EnsureActiveUser::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
