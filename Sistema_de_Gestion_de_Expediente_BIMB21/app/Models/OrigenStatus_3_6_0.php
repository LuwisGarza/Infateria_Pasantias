<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrigenStatus_3_6_0 extends Model
{
    use HasFactory;

    protected $table = 'origen_status_3_6_0';
    protected $primaryKey = 'list';
    public $incrementing = true;

    // AÑADE 'nombre' aquí
    protected $fillable = ['nombre', 'descripcion'];

    // Relación con expedientes (si es necesario)
    public function expedientes()
    {
        return $this->hasMany(Expedients_3_6_0::class, 'origen_status_3_6_0_list', 'list');
    }
}
