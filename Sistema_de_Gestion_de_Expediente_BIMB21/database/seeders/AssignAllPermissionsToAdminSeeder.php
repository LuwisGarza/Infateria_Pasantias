<?php

namespace Database\Seeders;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

class AssignAllPermissionsToAdminSeeder extends Seeder
{
    public function run()
    {
        // 1. Crear o obtener rol Administrador
        $adminRole = Role::firstOrCreate([
            'name' => 'Administrador',
            'guard_name' => 'web'
        ]);

        // 2. Obtener TODOS los permisos existentes
        $allPermissions = Permission::all();

        // 3. Sincronizar todos los permisos al rol
        $adminRole->syncPermissions($allPermissions);

        $this->command->info("✅ " . $allPermissions->count() . " permisos asignados al rol Administrador");

        // 4. Asignar rol Administrador al primer usuario (o todos los que quieras)
        $users = User::all();
        foreach ($users as $user) {
            $user->assignRole($adminRole);
            $this->command->info("✅ Rol Administrador asignado a: {$user->email}");
        }

        $this->command->info("\n🎯 Ahora el usuario Administrador puede acceder a TODO el sistema.");
    }
}
