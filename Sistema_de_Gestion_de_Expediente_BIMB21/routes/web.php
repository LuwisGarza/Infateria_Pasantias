<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ExpedientController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\RoleController;
use Spatie\Permission\Models\Role;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// 1. Rutas de perfil (solo auth)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 2. Expedientes (solo autenticacion)
Route::middleware(['auth'])->group(function () {
    Route::resource('expedientes', ExpedientController::class);
});

// 3. Personas (autenticacion + verificación de email)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('personas', PersonaController::class);
});

// 4. Backups (autenticacion + verificación de email)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/backups', [BackupController::class, 'index'])->name('backups.index');
    Route::post('/backups', [BackupController::class, 'create'])->name('backups.create');
    Route::get('/backups/download/{filename}', [BackupController::class, 'download'])->name('backups.download');
    Route::delete('/backups/{filename}', [BackupController::class, 'destroy'])->name('backups.destroy');
});

Route::get('/register', [ProfileController::class, 'create'])
    ->middleware('guest')
    ->name('register');

Route::get('/permisos', [RoleController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('roles.index');


Route::post('/roles/create', [RoleController::class, 'createRole'])
    ->middleware(['auth', 'verified'])
    ->name('roles.create');



require __DIR__ . '/auth.php';
