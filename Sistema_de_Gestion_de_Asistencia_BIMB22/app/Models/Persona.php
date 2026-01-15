<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Persona extends Model
{ // Implementación de SoftDeletes
    use SoftDeletes;

    protected $table = 'persona'; // Definición de la tabla
    protected $primaryKey = 'persona_id'; // Definición de la llave primaria

    protected $fillable = [
        'nombres', // Nombres de la persona
        'apellidos', // Apellidos de la persona
        'cedula', // Cédula de identidad
        'fecha_nacimiento', // Fecha de nacimiento
        'direccion', // Dirección de residencia
        'telefono', // Número de teléfono
        'activo', // Estado activo/inactivo
        'fecha_baja', // Fecha de baja (si aplica)
    ];

    // Relación: Persona -> DatosMilitares
    public function datosMilitares()
    {
        return $this->hasOne(DatosMilitares::class, 'persona_id', 'persona_id');
    }

    // Relación: Persona -> Asistencias
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class, 'persona_id', 'persona_id');
    }

    /**
     * Mutador: Convierte formato DD/MM/YYYY a YYYY-MM-DD para la base de datos.
     */
    public function setFechaNacimientoAttribute($value)
    {
        if (!empty($value) && preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $value)) {
            $this->attributes['fecha_nacimiento'] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
        } else {
            // Si ya viene en formato YYYY-MM-DD o está vacío, lo asigna directamente
            $this->attributes['fecha_nacimiento'] = $value;
        }
    }

    /**
     * Accesor: Convierte formato YYYY-MM-DD de la BD a DD/MM/YYYY para mostrar.
     */
    public function getFechaNacimientoAttribute($value)
    {
        if (!empty($value)) {
            return Carbon::parse($value)->format('d/m/Y');
        }
        return $value;
    }

    /**
     * Accesor para formularios: Devuelve la fecha en formato original para edición.
     * Laravel necesita esto al poblar formularios con datos antiguos (old()).
     */
    public function getFechaNacimientoForInputAttribute()
    {
        if (!empty($this->attributes['fecha_nacimiento'])) {
            return Carbon::parse($this->attributes['fecha_nacimiento'])->format('d/m/Y');
        }
        return null;
    }
}
