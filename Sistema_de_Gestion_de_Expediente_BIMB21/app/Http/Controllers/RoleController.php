<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleController extends Controller
{
    // 🔒 Roles protegidos del sistema (no se pueden eliminar)
    protected $protectedRoles = ['admin', 'super-admin', 'super administrador'];
    
    // ==================== 🖥️ MÉTODOS INERTIA (PANTALLAS) ====================

    /**
     * 1️⃣ Pantalla principal de roles y permisos
     */
    public function index()
    {
        return Inertia::render('Roles/Index', [
            'roles' => Role::with('permissions')->get()->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'permissions' => $role->permissions->pluck('name'),
                    'is_protected' => in_array($role->name, $this->protectedRoles),
                    'users_count' => $role->users()->count()
                ];
            }),
            'permissions' => Permission::all()->pluck('name'),
        ]);
    }

    /**
     * 2️⃣ Crear rol (Inertia)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:2|max:50|unique:roles,name',
        ]);

        Role::create(['name' => $request->name]);

        return redirect()->route('roles.index')
            ->with('success', 'Rol creado correctamente');
    }

    /**
     * 3️⃣ Eliminar rol (Inertia)
     */
    public function destroy(Role $role)
    {
        // 🔒 Proteger roles del sistema
        if (in_array($role->name, $this->protectedRoles)) {
            return redirect()->route('roles.index')
                ->with('error', 'No se puede eliminar un rol del sistema.');
        }

        // ⚠️ Verificar si hay usuarios con este rol
        if ($role->users()->count() > 0) {
            return redirect()->route('roles.index')
                ->with(
                    'warning',
                    'No se puede eliminar el rol porque tiene usuarios asignados. ' .
                        'Reasigna los usuarios primero.'
                );
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Rol eliminado correctamente');
    }
    
    // ==================== 🔧 MÉTODOS API/AJAX (JSON) ====================

    /**
     * 4️⃣ Obtener rol específico (API)
     */
    public function getRole($roleId)
    {
        $role = Role::with('permissions')->findById($roleId);

        if (!$role) {
            return response()->json([
                'message' => 'Rol no encontrado.'
            ], 404);
        }

        return response()->json([
            'role' => $role,
            'permissions' => $role->permissions->pluck('name'),
            'is_protected' => in_array($role->name, $this->protectedRoles)
        ], 200);
    }

    /**
     * 5️⃣ Actualizar nombre de rol (API)
     */
    public function updateRole(Request $request, $roleId)
    {
        $role = Role::findById($roleId);

        if (!$role) {
            return response()->json(['message' => 'Rol no encontrado.'], 404);
        }

        // 🔒 No permitir cambiar nombre de roles protegidos
        if (in_array($role->name, $this->protectedRoles)) {
            return response()->json([
                'message' => 'No se puede modificar un rol del sistema.'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|min:2|max:50|unique:roles,name,' . $roleId,
        ]);

        $role->name = $request->name;
        $role->save();

        return response()->json([
            'message' => 'Rol actualizado correctamente.',
            'role' => $role
        ], 200);
    }
    
    // ==================== 🔐 ASIGNACIÓN PERMISOS ↔ ROLES ====================

    /**
     * 6️⃣ Asignar permiso a rol (API)
     */
    public function addPermissionToRole(Request $request, $roleId)
    {
        $request->validate([
            'permission' => 'required|exists:permissions,name',
        ]);

        $role = Role::findById($roleId);
        $permissionName = $request->permission;

        if (!$role) {
            return response()->json(['message' => 'Rol no encontrado.'], 404);
        }

        // 🚫 Evitar duplicados
        if ($role->hasPermissionTo($permissionName)) {
            return response()->json([
                'message' => 'El rol ya tiene este permiso.'
            ], 400);
        }

        $role->givePermissionTo($permissionName);

        return response()->json([
            'message' => 'Permiso asignado al rol correctamente.',
            'role' => $role->load('permissions')
        ], 200);
    }

    /**
     * 7️⃣ Remover permiso de rol (API)
     */
    public function removePermissionFromRole(Request $request, $roleId)
    {
        $request->validate([
            'permission' => 'required|exists:permissions,name',
        ]);

        $role = Role::findById($roleId);
        $permissionName = $request->permission;

        if (!$role) {
            return response()->json(['message' => 'Rol no encontrado.'], 404);
        }

        // 🚫 Verificar que el rol tenga el permiso
        if (!$role->hasPermissionTo($permissionName)) {
            return response()->json([
                'message' => 'El rol no tiene este permiso.'
            ], 400);
        }

        $role->revokePermissionTo($permissionName);

        return response()->json([
            'message' => 'Permiso removido del rol correctamente.',
            'role' => $role->load('permissions')
        ], 200);
    }

    /**
     * 8️⃣ Listar permisos de un rol (API)
     */
    public function listPermissionsOfRole($roleId)
    {
        $role = Role::findById($roleId);

        if (!$role) {
            return response()->json(['message' => 'Rol no encontrado.'], 404);
        }

        return response()->json([
            'permissions' => $role->permissions,
            'role_name' => $role->name
        ], 200);
    }
    
    // ==================== 👥 ASIGNACIÓN ROLES ↔ USUARIOS ====================

    /**
     * 9️⃣ Asignar rol a usuario (API)
     */
    public function addRoleToUser(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        $user = User::find($userId);
        $roleName = $request->role;

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // 🚫 Evitar duplicados
        if ($user->hasRole($roleName)) {
            return response()->json([
                'message' => 'El usuario ya tiene este rol.'
            ], 400);
        }

        $user->assignRole($roleName);

        return response()->json([
            'message' => 'Rol asignado correctamente.',
            'user' => $user->load('roles')
        ], 200);
    }

    /**
     * 🔟 Remover rol de usuario (API)
     */
    public function removeRoleFromUser(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        $user = User::find($userId);
        $roleName = $request->role;

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // 🚫 Verificar que el usuario tenga el rol
        if (!$user->hasRole($roleName)) {
            return response()->json([
                'message' => 'El usuario no tiene este rol.'
            ], 400);
        }

        // 🔒 Prevenir remover último rol de admin
        if ($roleName === 'admin' && $user->roles()->count() === 1) {
            return response()->json([
                'message' => 'No se puede remover el único rol de administrador del usuario.'
            ], 403);
        }

        $user->removeRole($roleName);

        return response()->json([
            'message' => 'Rol removido correctamente.',
            'user' => $user->load('roles')
        ], 200);
    }

    /**
     * 1️⃣1️⃣ Listar roles de un usuario (API)
     */
    public function listRolesOfUser($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        return response()->json([
            'roles' => $user->roles,
            'user_name' => $user->name
        ], 200);
    }
    
    // ==================== 📋 ADMINISTRACIÓN DE PERMISOS ====================

    /**
     * 1️⃣2️⃣ Crear permiso (API)
     */
    public function createPermission(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:2|max:50|unique:permissions,name',
        ]);

        $permission = Permission::create(['name' => $request->name]);

        return response()->json([
            'message' => 'Permiso creado correctamente.',
            'permission' => $permission
        ], 201);
    }

    /**
     * 1️⃣3️⃣ Listar permisos (API)
     */
    public function listPermissions()
    {
        $permissions = Permission::all();

        return response()->json(['permissions' => $permissions], 200);
    }

    /**
     * 1️⃣4️⃣ Eliminar permiso (API)
     */
    public function deletePermission($permissionId)
    {
        $permission = Permission::findById($permissionId);

        if (!$permission) {
            return response()->json(['message' => 'Permiso no encontrado.'], 404);
        }

        // 🔍 Verificar si el permiso está en uso
        $rolesWithPermission = Role::whereHas('permissions', function ($query) use ($permission) {
            $query->where('permissions.id', $permission->id);
        })->count();

        if ($rolesWithPermission > 0) {
            return response()->json([
                'message' => 'No se puede eliminar el permiso porque está asignado a ' .
                    $rolesWithPermission . ' rol(es).'
            ], 409);
        }

        $permission->delete();

        return response()->json([
            'message' => 'Permiso eliminado correctamente.'
        ], 200);
    }

    /**
     * 1️⃣5️⃣ Actualizar permiso (API)
     */
    public function updatePermission(Request $request, $permissionId)
    {
        $permission = Permission::findById($permissionId);

        if (!$permission) {
            return response()->json(['message' => 'Permiso no encontrado.'], 404);
        }

        $request->validate([
            'name' => 'required|string|min:2|max:50|unique:permissions,name,' . $permissionId,
        ]);

        $permission->name = $request->name;
        $permission->save();

        return response()->json([
            'message' => 'Permiso actualizado correctamente.',
            'permission' => $permission
        ], 200);
    }
}
