<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Sistema
            'system.view',

            // Personas
            'personas.view',
            'personas.create',
            'personas.edit',
            'personas.delete',

            // Expedientes
            'expedients.view',
            'expedients.create',

            // Backups
            'backups.manage',

            // Seguridad
            'roles.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
    }
}
