<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expedients_3_6_0 extends Model
{
    use HasFactory;

    // Especifica el nombre EXACTO de la tabla
    protected $table = 'expedients_3_6_0';

    // Clave primaria personalizada (se llama 'list')
    protected $primaryKey = 'list';

    // Campos que se pueden llenar masivamente (IMPORTANTE para create())
    protected $fillable = [
        'nombre',
        'identificacion',
        'origen_status_3_6_0_list',
        'notas'
    ];

    // Si usas autoincremento
    public $incrementing = true;

    // Relación con el estado (opcional pero útil)
    public function estado()
    {
        return $this->belongsTo(OrigenStatus_3_6_0::class, 'origen_status_3_6_0_list', 'list');
    }
}
