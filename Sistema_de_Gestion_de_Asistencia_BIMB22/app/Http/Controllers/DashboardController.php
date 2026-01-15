<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Persona;

class DashboardController extends Controller
{
    public function index()
    {
        // Usando la misma lógica que tenía PersonaController para stats
        $total = Persona::whereNull('deleted_at')->count();
        $activas = Persona::whereNull('deleted_at')->where('activo', true)->count();
        $inactivas = Persona::whereNull('deleted_at')->where('activo', false)->count();

        // Calcular porcentaje de disponibilidad
        $disponibilidad = 0;
        if ($total > 0) {
            $disponibilidad = round(($activas / $total) * 100);
        }

        // Datos para el dashboard (las mismas stats que antes tenía PersonaController)
        $stats = [
            'total' => $total,
            'activas' => $activas,
            'inactivas' => $inactivas,
            'disponibilidad' => $disponibilidad,
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
        ]);
    }
}
