<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Creates the application and isolates the test database.
     */
    public function createApplication()
    {
        $app = parent::createApplication();

        $app['config']->set('database.connections.pgsql.database', 'exam_platform_test');

        return $app;
    }
}
