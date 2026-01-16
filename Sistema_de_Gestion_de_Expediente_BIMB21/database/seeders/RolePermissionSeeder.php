<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $allPermissions = Permission::pluck('name')->toArray();

        // 👁 OBSERVADOR
        Role::findByName('Observador')->syncPermissions([
            'system.view',
            'personas.view',
            'expedients.view',
        ]);

        // ✏️ OPERADOR
        Role::findByName('Operador')->syncPermissions([
            'system.view',
            'personas.view',
            'personas.create',
            'expedients.view',
            'expedients.create',
        ]);

        // 🗑 SUPERVISOR
        Role::findByName('Supervisor')->syncPermissions([
            'system.view',
            'personas.view',
            'personas.create',
            'personas.delete',
            'expedients.view',
            'expedients.create',
        ]);

        // 🔐 ADMINISTRADOR → TODOS
        Role::findByName('Administrador')->syncPermissions($allPermissions);
    }
}
