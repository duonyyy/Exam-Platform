<?php

return [
    /*
    |--------------------------------------------------------------------------
    | View Storage Paths
    |--------------------------------------------------------------------------
    |
    | Although this application exposes a JSON API, Laravel registers its view
    | compiler for framework error rendering and third-party packages. Defining
    | this path keeps that compiler valid in every runtime environment.
    |
    */

    'paths' => [
        resource_path('views'),
    ],

    'compiled' => env('VIEW_COMPILED_PATH', storage_path('framework/views')),
];
