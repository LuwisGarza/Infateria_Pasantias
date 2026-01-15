<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JerarquiaMilitar extends Model
{
    //use HasFactory;

    // Tabla exacta
    protected $table = 'jerarquia_militar';

    // Clave primaria
    protected $primaryKey = 'grado_id';

    // Campos rellenables
    protected $fillable = [
        'nombre_grado'
    ];

    // Relación con DatosMilitares
    public function datosMilitares()
    {
        return $this->hasMany(DatosMilitares::class, 'grado_id', 'grado_id');
    }
}
