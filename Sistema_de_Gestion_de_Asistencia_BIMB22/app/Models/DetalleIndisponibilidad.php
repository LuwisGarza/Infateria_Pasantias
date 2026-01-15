<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleIndisponibilidad extends Model
{ // Definición de la tabla y la llave primaria
    protected $table = 'detalle_indisponibilidad';
    protected $primaryKey = 'detalle_id';

    protected $fillable = [
        'asistencia_id', // Llave foránea a tabla asistencia
        'tipo_indisponibilidad', // Tipo de indisponibilidad
        'descripcion', // Descripción de la indisponibilidad
        'fecha_inicio', // Fecha de inicio de la indisponibilidad
        'fecha_fin_estimada', // Fecha de fin estimada de la indisponibilidad
        'turno_permiso_id', // Llave foránea a tabla turno_permiso (opcional)
    ];

    // Relaciones con Asistencia y TurnoPermiso
    public function asistencia()
    {
        return $this->belongsTo(Asistencia::class, 'asistencia_id', 'asistencia_id');
    }

    public function turnoPermiso()
    {
        return $this->belongsTo(TurnoPermiso::class, 'turno_permiso_id', 'turno_permiso_id');
    }
}
