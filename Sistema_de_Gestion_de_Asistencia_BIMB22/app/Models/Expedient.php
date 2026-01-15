<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expedient extends Model
{ // Definición de la tabla y la llave primaria
    protected $fillable = [
        'nombre', // Nombre del expediente
        'identificacion', // Identificación del expediente
        'origen_status_id', // Llave foránea a tabla origen_status
        'notas', // Notas adicionales
    ];
}
