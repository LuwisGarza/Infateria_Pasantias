<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TurnoPermiso extends Model
{ // Definición de la tabla y la llave primaria
    protected $table = 'turno_permiso'; // Definición de la tabla
    protected $primaryKey = 'turno_permiso_id'; // Definición de la llave primaria

    protected $fillable = [
        'tipo_permiso', // Tipo de permiso
        'unidad', // Unidad responsable
        'fecha_inicio', // Fecha de inicio
        'fecha_fin', // Fecha de fin
        'cupo_maximo', // Cupo máximo permitido
        'cupo_actual', // Cupo actual utilizado
    ];

    // Relación: TurnoPermiso -> DetalleIndisponibilidad
    public function detalleIndisponibilidad()
    {
        return $this->hasMany(DetalleIndisponibilidad::class, 'turno_permiso_id', 'turno_permiso_id');
    }
}
