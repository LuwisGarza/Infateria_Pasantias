<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Prepare the data for validation.
     * Normalize email and username (trim, lowercase).
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('email')) {
            $this->merge([
                'email' => is_string($this->email) ? strtolower(trim($this->email)) : $this->email,
            ]);
        }

        if ($this->has('username')) {
            $this->merge([
                // Ajusta la normalización según tu formato deseado
                'username' => is_string($this->username) ? strtolower(trim($this->username)) : $this->username,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            // Username: requerido, sin espacios (alpha_dash permite letras, números, guiones y guiones bajos)
            // usa Rule::unique para evitar duplicados pero ignorando el registro actual.
            'username' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                'alpha_dash', // Si quieres permitir puntos o más caracteres cambia a regex
                Rule::unique(User::class, 'username')->ignore($this->user()->id),
            ],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class, 'email')->ignore($this->user()->id),
            ],
        ];
    }
}
