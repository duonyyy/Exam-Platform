<?php

return [
    /*
     * Your API path. By default, all routes starting with this path will be included
     * in the generated OpenAPI document.
     */
    'api_path' => 'api/v1',

    'api_domain' => null,

    /*
     * The path where your OpenAPI specification will be exported.
     */
    'export_path' => 'api.json',

    'info' => [
        'version' => env('API_VERSION', '1.0.0'),
        'description' => 'Enterprise Core RESTful API for Exam Platform (Laravel 13 & PHP 8.3+). Single Source of Truth for examination workflows, autosave, and proctoring.',
    ],

    /*
     * Customize Stoplight Elements / Swagger UI
     */
    'ui' => [
        'title' => 'Exam Platform API — OpenAPI 3.1 & Swagger Documentation',
        'theme' => 'light',
        'hide_try_it' => false,
        'logo' => '',
        'try_it_credentials_policy' => 'include',
    ],

    /*
     * The list of middleware of the documentation page. Protected by the viewApiDocs Gate.
     */
    'middleware' => [
        'web',
        \Dedoc\Scramble\Http\Middleware\RestrictedDocsAccess::class,
    ],

    'servers' => [
        'Local Development' => 'http://localhost:8000',
    ],
];
