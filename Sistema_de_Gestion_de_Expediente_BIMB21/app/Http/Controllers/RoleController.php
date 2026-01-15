<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);
    }

    //metodo para obtener un rol por id
    public function getRole($roleId)
    {
        $role = \Spatie\Permission\Models\Role::findById($roleId);

        if (!$role) {
            return response()->json(['message' => 'Rol no encontrado.'], 404);
        }

        return response()->json($role, 200);
    }


    // Crear un nuevo rol usando Spatie Permission
    public function createRole(Request $request)
    {
        $roleName = $request->input('rolname');

        \Spatie\Permission\Models\Role::create(['name' => $roleName]);

        return response()->json(['message' => 'Rol creado correctamente.'], 201);
    }

    public function deleteRole(Request $request)
    {
        $role = \Spatie\Permission\Models\Role::findById($request->input('rolname'));

        if (!$role) {
            return response()->json(['message' => 'Rol no encontrado.'], 404);
        }

        $role->delete();

        return response()->json(['message' => 'Rol eliminado correctamente.'], 200);
    }

    public function updateRole(Request $request, $roleId)
    {
        $role = \Spatie\Permission\Models\Role::findById($roleId);

        if (!$role) {
            return response()->json(['message' => 'Rol no encontrado.'], 404);
        }

        $newName = $request->input('name');
        $role->name = $newName;
        $role->save();

        return response()->json(['message' => 'Rol actualizado correctamente.'], 200);
    }

    //metodo para asignar roles a usuarios
    public function addRoleToUser(Request $request, $userId)
    {
        $user = \App\Models\User::find($userId);
        $roleName = $request->input('role');

        if ($user->hasRole($roleName)) {
            return response()->json(['message' => 'El usuario ya tiene este rol.'], 400);
        }

        $user->assignRole($roleName);

        return response()->json(['message' => 'Rol asignado correctamente.'], 200);
    }

    public function removeRoleFromUser(Request $request, $userId)
    {
        $user = \App\Models\User::find($userId);
        $roleName = $request->input('role');

        if (!$user->hasRole($roleName)) {
            return response()->json(['message' => 'El usuario no tiene este rol.'], 400);
        }

        $user->removeRole($roleName);

        return response()->json(['message' => 'Rol removido correctamente.'], 200);
    }
    //metodo para asignar permisos a roles
    public function addPermissionToRole(Request $request, $roleId)
    {
        $role = \Spatie\Permission\Models\Role::findById($roleId);
        $permissionName = $request->input('permission');

        $role->givePermissionTo($permissionName);

        return response()->json(['message' => 'Permiso asignado al rol correctamente.'], 200);
    }

    public function removePermissionFromRole(Request $request, $roleId)
    {
        $role = \Spatie\Permission\Models\Role::findById($roleId);
        $permissionName = $request->input('permission');

        $role->revokePermissionTo($permissionName);

        return response()->json(['message' => 'Permiso removido del rol correctamente.'], 200);
    }

    public function listPermissionsOfRole($roleId)
    {
        $role = \Spatie\Permission\Models\Role::findById($roleId);
        $permissions = $role->permissions;

        return response()->json($permissions, 200);
    }

    public function listRolesOfUser($userId)
    {
        $user = \App\Models\User::find($userId);
        $roles = $user->roles;

        return response()->json($roles, 200);
    }

    public function createPermission(Request $request)
    {
        $permissionName = $request->input('name');

        // Crear un nuevo permiso usando Spatie Permission
        \Spatie\Permission\Models\Permission::create(['name' => $permissionName]);

        return response()->json(['message' => 'Permiso creado correctamente.'], 201);
    }

    public function listPermissions()
    {
        $permissions = \Spatie\Permission\Models\Permission::all();

        return response()->json($permissions, 200);
    }

    public function deletePermission($permissionId)
    {
        $permission = \Spatie\Permission\Models\Permission::findById($permissionId);

        if (!$permission) {
            return response()->json(['message' => 'Permiso no encontrado.'], 404);
        }

        $permission->delete();

        return response()->json(['message' => 'Permiso eliminado correctamente.'], 200);
    }

    public function updatePermission(Request $request, $permissionId)
    {
        $permission = \Spatie\Permission\Models\Permission::findById($permissionId);
        if (!$permission) {
            return response()->json(['message' => 'Permiso no encontrado.'], 404);
        }
        $newName = $request->input('name');
        $permission->name = $newName;
        $permission->save();
        return response()->json(['message' => 'Permiso actualizado correctamente.'], 200);
    }
}
