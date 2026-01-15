<?php
//servicios para obtener estadísticas de personas

namespace App\Services;

use App\Models\Persona;

class PersonaStatsService
{// Obtiene estadísticas básicas de personas
    public static function getBasicStats()
    {
        return [
            'total' => Persona::whereNull('deleted_at')->count(),// Total de personas no eliminadas
            'activas' => Persona::whereNull('deleted_at')->where('activo', true)->count(),// Personas activas
            'inactivas' => Persona::whereNull('deleted_at')->where('activo', false)->count(),// Personas inactivas
        ];
    }

    public static function getStatsForDashboard()
    {
        $stats = self::getBasicStats();

        // Nuevos registros en los últimos 30 días
        $stats['nuevas_30_dias'] = Persona::whereNull('deleted_at')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        return $stats;
    }
}
