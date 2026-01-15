<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    protected $table = 'asistencia';
    protected $primaryKey = 'asistencia_id';

    protected $fillable = [
        'persona_id',
        'fecha',
        'estado_id',
        'hora_registro',
        'observaciones',
    ];

    // Relaciones de persona, estado_asistencia y detalle_indisponibilidad
    public function persona()
    {
        return $this->belongsTo(Persona::class, 'persona_id', 'persona_id');
    }

    public function estado()
    {
        return $this->belongsTo(EstadoAsistencia::class, 'estado_id', 'estado_id');
    }

    public function detalleIndisponibilidad()
    {
        return $this->hasMany(DetalleIndisponibilidad::class, 'asistencia_id', 'asistencia_id');
    }
}
