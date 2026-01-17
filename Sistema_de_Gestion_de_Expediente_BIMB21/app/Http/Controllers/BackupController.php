<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class BackupController extends Controller
{
    /**
     * Muestra la página principal de backups
     */
    public function index()
    {
        return inertia('BackupPage', [
            'backups' => $this->getBackupsList(),
            'diskInfo' => $this->getDiskInfo(),
            'dbInfo' => $this->getDatabaseInfo(),
        ]);
    }

    /**
     * Crea un nuevo backup desde la web
     */
    public function create()
    {
        try {
            // Ruta del directorio de backups
            $backupDir = storage_path('app/backups');

            // Crear directorio si no existe (IMPORTANTE)
            if (!File::exists($backupDir)) {
                File::makeDirectory($backupDir, 0755, true, true);
            }

            // Ruta de la base de datos SQLite
            $dbPath = database_path('database.sqlite');

            if (!File::exists($dbPath)) {
                return redirect()->route('backups.index')
                    ->with('error', 'No se encontró la base de datos SQLite en: ' . $dbPath);
            }

            // Nombre del backup con fecha y hora
            $backupName = 'backup_' . date('Y-m-d_His') . '.sqlite';
            $backupPath = $backupDir . '/' . $backupName;

            // DEPURACIÓN: Verifica permisos
            Log::info('Intentando crear backup', [
                'db_path' => $dbPath,
                'backup_path' => $backupPath,
                'db_exists' => file_exists($dbPath),
                'backup_dir_exists' => is_dir($backupDir),
                'backup_dir_writable' => is_writable($backupDir),
            ]);

            // Copiar el archivo de la base de datos MANUALMENTE
            // Esto es más confiable que un comando Artisan
            if (!copy($dbPath, $backupPath)) {
                Log::error('No se pudo copiar el archivo', [
                    'source' => $dbPath,
                    'destination' => $backupPath,
                    'error' => error_get_last()
                ]);

                return redirect()->route('backups.index')
                    ->with('error', 'Error al copiar el archivo. Verifica permisos.');
            }

            Log::info('Backup creado exitosamente: ' . $backupName);

            return redirect()->route('backups.index')
                ->with('success', 'Backup creado exitosamente: ' . $backupName);
        } catch (\Exception $e) {
            Log::error('Error en create(): ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('backups.index')
                ->with('error', 'Error al crear backup: ' . $e->getMessage());
        }
    }

    /**
     * Descarga un backup específico
     */
    public function download($filename)
    {
        // Verifica que el archivo existe
        $filePath = storage_path('app/backups/' . $filename);

        if (!File::exists($filePath)) {
            abort(404, 'El backup no existe');
        }

        // Forza la descarga
        return response()->download($filePath);
    }

    /**
     * Elimina un backup
     */
    public function destroy($filename)
    {
        $filePath = storage_path('app/backups/' . $filename);

        if (File::exists($filePath)) {
            File::delete($filePath);

            return redirect()->route('backups.index')
                ->with('success', '🗑️ Backup eliminado correctamente');
        }

        return redirect()->route('backups.index')
            ->with('error', 'Archivo no encontrado');
    }

    /**
     * Obtiene lista de todos los backups
     */
    private function getBackupsList()
    {
        $backups = [];
        $backupDir = storage_path('app/backups');

        // Si la carpeta no existe, retorna array vacío
        if (!File::exists($backupDir)) {
            return [];
        }

        // Obtiene todos los archivos .sqlite
        $files = File::files($backupDir);

        foreach ($files as $file) {
            if ($file->getExtension() === 'sqlite') {
                $backups[] = [
                    'name' => $file->getFilename(),
                    'size' => $file->getSize(),
                    'size_human' => $this->formatBytes($file->getSize()),
                    'created_at' => $file->getMTime(),
                    'created_at_formatted' => date('d/m/Y H:i:s', $file->getMTime()),
                    // Ruta para descargar
                    'download_url' => route('backups.download', $file->getFilename()),
                ];
            }
        }

        // Ordena por fecha (más reciente primero)
        usort($backups, function ($a, $b) {
            return $b['created_at'] <=> $a['created_at'];
        });

        return $backups;
    }

    /**
     * Información del espacio en disco - CORREGIDO
     */
    private function getDiskInfo()
    {
        try {
            // Ruta para calcular espacio
            $path = base_path(); // Directorio raíz del proyecto

            $free = @disk_free_space($path);
            $total = @disk_total_space($path);

            // Si no se puede obtener el espacio (Windows/Linux)
            if ($free === false || $total === false) {
                Log::warning('No se pudo obtener info del disco', [
                    'path' => $path,
                    'free' => $free,
                    'total' => $total,
                    'error' => error_get_last()
                ]);

                return [
                    'free' => 'N/A',
                    'total' => 'N/A',
                    'used' => 'N/A',
                    'used_percent' => 0,
                    'available' => false,
                ];
            }

            $used = $total - $free;
            $used_percent = $total > 0 ? round(($used / $total) * 100, 2) : 0;

            return [
                'free' => $this->formatBytes($free),
                'total' => $this->formatBytes($total),
                'used' => $this->formatBytes($used),
                'used_percent' => $used_percent,
                'available' => true,
            ];
        } catch (\Exception $e) {
            Log::error('Error en getDiskInfo(): ' . $e->getMessage());

            return [
                'free' => 'N/A',
                'total' => 'N/A',
                'used' => 'N/A',
                'used_percent' => 0,
                'available' => false,
            ];
        }
    }

    /**
     * Información de la base de datos
     */
    private function getDatabaseInfo()
    {
        $dbPath = database_path('database.sqlite');

        if (!File::exists($dbPath)) {
            return [
                'name' => 'SQLite',
                'size' => 'N/A',
                'last_modified' => 'N/A',
                'exists' => false,
            ];
        }

        return [
            'name' => 'SQLite',
            'size' => $this->formatBytes(File::size($dbPath)),
            'last_modified' => date('d/m/Y H:i:s', File::lastModified($dbPath)),
            'exists' => true,
        ];
    }

    /**
     * Formatea bytes a formato legible
     */
    private function formatBytes($bytes, $precision = 2)
    {
        if ($bytes <= 0) return '0 B';

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
