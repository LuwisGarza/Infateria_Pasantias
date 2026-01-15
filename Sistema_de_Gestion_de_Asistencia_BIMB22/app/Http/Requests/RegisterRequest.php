<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{4,}$/u',
            ],
            'username' => [
                'required',
                'string',
                'max:30',
                'unique:users',
                'regex:/^[a-zA-Z][a-zA-Z0-9_]{3,}$/',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'max:16',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'El nombre debe tener mínimo 4 letras y solo contener letras y espacios.',
            'username.regex' => 'El usuario debe tener mínimo 4 caracteres y empezar con una letra.',
            'email.regex' => 'Por favor ingresa un correo electrónico válido.',
            'password.regex' => 'La contraseña debe tener 8-16 caracteres con al menos una mayúscula, minúscula, número y símbolo (@$!%*?&).',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nombre completo',
            'username' => 'nombre de usuario',
            'email' => 'correo electrónico',
            'password' => 'contraseña',
        ];
    }
}
