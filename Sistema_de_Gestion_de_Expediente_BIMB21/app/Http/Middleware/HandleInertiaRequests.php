<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * La raíz de la vista de la aplicación.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determina la versión de los activos que se deben usar.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define los datos compartidos con todas las solicitudes Inertia.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? $this->getUserData($request->user()) : null,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info'),
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }

    /**
     * Obtiene los datos del usuario para compartir con Inertia
     */
    protected function getUserData($user): array
    {
        // 🔧 PARA DESARROLLO: Si no funciona Spatie, devuelve permisos simulados
        try {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username ?? $user->name,
                'email' => $user->email,
                'roles' => $user->roles ? $user->getRoleNames()->toArray() : [],
                'permissions' => $user->permissions ? $user->getAllPermissions()->pluck('name')->toArray() : [],
            ];
        } catch (\Exception $e) {
            // 🚨 SI FALLA SPATIE, devuelve permisos de administrador por defecto
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username ?? $user->name,
                'email' => $user->email,
                'roles' => ['Administrador'], // Rol por defecto
                'permissions' => [ // Permisos completos por defecto
                    'system.view',
                    'personas.view',
                    'personas.create',
                    'personas.edit',
                    'personas.delete',
                    'expedients.view',
                    'expedients.create',
                    'reportes.ver',
                    'backups.manage',
                    'roles.manage',
                    'usuario.crear',
                ],
            ];
        }
    }
}
