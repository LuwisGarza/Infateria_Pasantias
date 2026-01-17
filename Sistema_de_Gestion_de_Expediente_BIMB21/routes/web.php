<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\{
    ProfileController,
    PersonaController,
    RoleController
};

Route::get('/', function () {
    return inertia('Welcome');
});

// ============ GRUPO PRINCIPAL (SIN PERMISOS TEMPORAL) ============
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');

    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Personas (TODOS los métodos)
    Route::resource('personas', PersonaController::class);

    // Expedientes (vista temporal)
    Route::get('/expedientes', function () {
        return inertia('Expedientes/Index', [
            'title' => 'Expedientes',
            'message' => 'Módulo en desarrollo'
        ]);
    })->name('expedientes.index');

    // Reportes (vista temporal)
    Route::get('/reportes', function () {
        return inertia('Reportes/Index', [
            'title' => 'Reportes',
            'message' => 'Módulo en desarrollo'
        ]);
    })->name('reportes.index');



    // Backups (vista temporal)
    Route::middleware(['auth'])->group(function () {
        Route::get('/backups', [BackupController::class, 'index'])->name('backups.index');
        Route::post('/backups', [BackupController::class, 'create'])->name('backups.create');
        Route::get('/backups/download/{filename}', [BackupController::class, 'download'])->name('backups.download');
        Route::delete('/backups/{filename}', [BackupController::class, 'destroy'])->name('backups.destroy');
    });

    // Asistencias (vista temporal)
    Route::get('/asistencias', function () {
        return inertia('Asistencias/Index', [
            'title' => 'Asistencias',
            'message' => 'Módulo en desarrollo'
        ]);
    })->name('asistencias');

    // Jerarquías (vista temporal)
    Route::get('/jerarquias', function () {
        return inertia('Jerarquias/Index', [
            'title' => 'Jerarquías',
            'message' => 'Módulo en desarrollo'
        ]);
    })->name('jerarquias');

    // Permisos/Roles
    Route::get('/permisos', [RoleController::class, 'index'])->name('roles.index');

    // Rutas API de roles (mantén las necesarias)
    Route::prefix('roles')->group(function () {
        Route::post('/', [RoleController::class, 'store'])->name('roles.store');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
    });
});



require __DIR__ . '/auth.php';
