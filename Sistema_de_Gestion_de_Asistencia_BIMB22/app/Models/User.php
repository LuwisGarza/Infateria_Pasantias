<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    // Implementación de HasFactory y Notifiable para el modelo User
    use HasFactory, Notifiable;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name', // Nombre del usuario
        'username', // Nombre de usuario
        'email', // Correo electrónico
        'password', // Contraseña del usuario
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password', // Contraseña oculta
        'remember_token', // Token de recordatorio oculto
    ];

    /** Definición de los casts de atributos (para conversión automática)   
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
