<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * registro de servicios.
     */
    public function register(): void
    {
        //
    }

    /**
     * Servicios de arranque.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
