<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstadoAsistencia extends Model
{ // Definición de la tabla y la llave primaria
    protected $table = 'estado_asistencia'; // Definición de la tabla
    protected $primaryKey = 'estado_id'; // Definición de la llave primaria

    protected $fillable = [
        'nombre_estado', // Nombre del estado
        'tipo_disponibilidad', // Tipo de disponibilidad
        'descripcion', // Descripción del estado
    ];

    // Relación: Estado -> Asistencias
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class, 'estado_id', 'estado_id');
    }
}
