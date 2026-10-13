<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class SwaggerDocumentationTest extends TestCase
{
    public function test_documentation_ui_and_openapi_spec_are_served_in_testing(): void
    {
        $this->get('/docs/api')->assertOk();

        $this->getJson('/docs/api.json')
            ->assertOk()
            ->assertJsonStructure(['openapi', 'info', 'paths']);
    }

    /**
     * Test that viewApiDocs gate allows access in testing environment.
     */
    public function test_view_api_docs_gate_allows_in_testing_environment(): void
    {
        $this->assertTrue(Gate::allows('viewApiDocs'));
    }

    /**
     * Test that viewApiDocs gate denies access when environment is production.
     */
    public function test_view_api_docs_gate_denies_in_production_environment(): void
    {
        $this->app->detectEnvironment(fn () => 'production');

        $this->assertFalse(Gate::allows('viewApiDocs'));
    }
}
