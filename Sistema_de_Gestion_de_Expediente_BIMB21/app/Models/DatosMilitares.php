<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatosMilitares extends Model
{ // Definición de la tabla y la llave primaria
    protected $table = 'datos_militares';
    protected $primaryKey = 'militar_id';

    protected $fillable = [
        'persona_id', // Llave foránea a tabla persona
        'grado_id', // Llave foránea a tabla jerarquia_militar
        'matricula', // Matrícula militar única
        'cargo_resolucion', // Cargo según resolución
        'fecha_fin_servicio', // Fecha de fin de servicio militar
    ];

    // Relaciones con Persona y JerarquiaMilitar
    public function persona()
    {
        return $this->belongsTo(Persona::class, 'persona_id', 'persona_id');
    }

    public function jerarquia()
    {
        return $this->belongsTo(JerarquiaMilitar::class, 'grado_id', 'grado_id');
    }
}
