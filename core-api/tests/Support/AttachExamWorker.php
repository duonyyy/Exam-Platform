<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

require __DIR__.'/../../vendor/autoload.php';
$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

[$script, $examId, $questionId] = $argv;
$pid = DB::selectOne('SELECT pg_backend_pid() AS pid')->pid;
fwrite(STDOUT, "DBPID={$pid}\n");
fflush(STDOUT);

$request = Request::create(
    "/api/v1/exams/{$examId}/questions",
    'POST',
    [],
    [],
    [],
    [
        'HTTP_ACCEPT' => 'application/json',
        'CONTENT_TYPE' => 'application/json',
        'HTTP_AUTHORIZATION' => 'Bearer '.getenv('ATTACH_TEST_TOKEN'),
    ],
    json_encode(['questions' => [['question_id' => (int) $questionId, 'order' => 1, 'points' => 1]]], JSON_THROW_ON_ERROR)
);
$response = $app->make(Kernel::class)->handle($request);
fwrite(STDOUT, 'STATUS='.$response->getStatusCode()."\n");
$app->make(Kernel::class)->terminate($request, $response);
