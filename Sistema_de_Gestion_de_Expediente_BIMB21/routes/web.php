<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ExpedientController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\RoleController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard - temporalmente SIN permisos para desarrollo
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// 1. Rutas de perfil (solo auth)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 2. Expedientes
Route::middleware(['auth'])->group(function () {
    Route::resource('expedients', ExpedientController::class);
});

// 3. Ruta protegida por PERMISO específico (RECOMENDADO)
Route::middleware(['auth', 'verified', 'permission:personas.view'])->group(function () {
    Route::get('/personas', [PersonaController::class, 'index']);
    Route::get('/personas/{persona}', [PersonaController::class, 'show']);
});
Route::get('/personas/{persona}', [PersonaController::class, 'show'])
    ->middleware(['auth', 'verified', 'permission:personas.view'])
    ->name('personas.show');

Route::get('/personas/create', [PersonaController::class, 'create'])
    ->middleware(['auth', 'verified', 'permission:personas.create'])
    ->name('personas.create');

Route::post('/personas', [PersonaController::class, 'store'])
    ->middleware(['auth', 'verified', 'permission:personas.create'])
    ->name('personas.store');

// 4. Backups
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/backups', [BackupController::class, 'index'])->name('backups.index');
    Route::post('/backups', [BackupController::class, 'create'])->name('backups.create');
    Route::get('/backups/download/{filename}', [BackupController::class, 'download'])->name('backups.download');
    Route::delete('/backups/{filename}', [BackupController::class, 'destroy'])->name('backups.destroy');
});

// ============ 🎯 RUTAS DE ROLES Y PERMISOS (ÚNICAS) ============

// RUTA PRINCIPAL para vista de roles/permisos
Route::get('/permisos', [RoleController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('roles.index');

// TODAS las demás rutas bajo /roles (API/CRUD)
Route::prefix('roles')->middleware(['auth', 'verified'])->group(function () {
    // CRUD básico
    Route::post('/', [RoleController::class, 'store'])->name('roles.store');
    Route::delete('/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

    // API adicional
    Route::get('/{role}/get', [RoleController::class, 'getRole'])->name('roles.get');
    Route::put('/{role}/update', [RoleController::class, 'updateRole'])->name('roles.update');

    // Permisos de roles
    Route::post('/{role}/permissions/add', [RoleController::class, 'addPermissionToRole'])
        ->name('roles.permissions.add');
    Route::delete('/{role}/permissions/remove', [RoleController::class, 'removePermissionFromRole'])
        ->name('roles.permissions.remove');
    Route::get('/{role}/permissions', [RoleController::class, 'listPermissionsOfRole'])
        ->name('roles.permissions.list');
});

// Rutas para permisos (CRUD)
Route::prefix('permissions')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [RoleController::class, 'listPermissions'])->name('permissions.list');
    Route::post('/', [RoleController::class, 'createPermission'])->name('permissions.create');
    Route::put('/{permission}', [RoleController::class, 'updatePermission'])->name('permissions.update');
    Route::delete('/{permission}', [RoleController::class, 'deletePermission'])->name('permissions.delete');
});

// 👇 Rutas adicionales (si las necesitas)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/asistencias', function () {
        return Inertia::render('Asistencias/Index');
    })->name('asistencias');

    Route::get('/jerarquias', function () {
        return Inertia::render('Jerarquias/Index');
    })->name('jerarquias');

    Route::get('/reportes', function () {
        return Inertia::render('Reportes/Index');
    })->name('reportes');
});

require __DIR__ . '/auth.php';
