<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Observador', 'guard_name' => 'web'],
            ['name' => 'Operador', 'guard_name' => 'web'],
            ['name' => 'Supervisor', 'guard_name' => 'web'],
            ['name' => 'Administrador', 'guard_name' => 'web'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['name' => $role['name']],
                ['guard_name' => $role['guard_name']]
            );
        }

        $this->command->info('✅ Roles creados: Observador, Operador, Supervisor, Administrador');
    }
}
