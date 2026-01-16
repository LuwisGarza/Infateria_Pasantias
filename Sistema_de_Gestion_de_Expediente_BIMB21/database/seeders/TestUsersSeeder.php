<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    public function run()
    {
        // 🔧 Crear usuarios de prueba para CADA rol
        $usuarios = [
            [
                'name' => 'Usuario Observador',
                'email' => 'observador@test.com',
                'password' => Hash::make('password123'),
                'role' => 'Observador'
            ],
            [
                'name' => 'Usuario Operador',
                'email' => 'operador@test.com',
                'password' => Hash::make('password123'),
                'role' => 'Operador'
            ],
            [
                'name' => 'Usuario Supervisor',
                'email' => 'supervisor@test.com',
                'password' => Hash::make('password123'),
                'role' => 'Supervisor'
            ],
            [
                'name' => 'Usuario Administrador',
                'email' => 'admin@test.com', // DIFERENTE a tu admin actual
                'password' => Hash::make('password123'),
                'role' => 'Administrador'
            ],
        ];

        foreach ($usuarios as $usuarioData) {
            // Crear o actualizar usuario
            $user = User::updateOrCreate(
                ['email' => $usuarioData['email']],
                [
                    'name' => $usuarioData['name'],
                    'password' => $usuarioData['password'],
                    'email_verified_at' => now(),
                ]
            );

            // Asignar rol
            $user->syncRoles([$usuarioData['role']]);

            echo "Usuario creado: {$usuarioData['email']} - Rol: {$usuarioData['role']}\n";
        }

        echo "\n✅ Usuarios de prueba creados:\n";
        echo "👁 Observador: observador@test.com / password123\n";
        echo "✏️ Operador: operador@test.com / password123\n";
        echo "🗑 Supervisor: supervisor@test.com / password123\n";
        echo "🔐 Administrador: admin@test.com / password123\n";
    }
}
