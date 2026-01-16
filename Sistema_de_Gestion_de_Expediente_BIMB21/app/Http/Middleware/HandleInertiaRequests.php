<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * la raiz de la vista de la aplicación.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * determina la versión de los activos que se deben usar.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * define los datos compartidos con todas las solicitudes Inertia.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
}
