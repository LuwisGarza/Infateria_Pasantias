<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;

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
    public function create(Request $request)
    {
        try {
            // Ejecuta el comando personalizado que creaste
            Artisan::call('backup:sqlite');

            $output = Artisan::output();

            return response()->json([
                'success' => true,
                'message' => '✅ Backup creado exitosamente',
                'backups' => $this->getBackupsList(), // Lista actualizada
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error: ' . $e->getMessage()
            ], 500);
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

            return response()->json([
                'success' => true,
                'message' => '🗑️ Backup eliminado',
                'backups' => $this->getBackupsList(),
            ]);
        }

        return response()->json([
            'success' => false,
            'error' => 'Archivo no encontrado'
        ], 404);
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
     * Información del espacio en disco
     */
    private function getDiskInfo()
    {
        $path = storage_path('app/backups');

        if (!File::exists($path)) {
            $path = storage_path();
        }

        $free = disk_free_space($path);
        $total = disk_total_space($path);
        $used = $total - $free;

        return [
            'free' => $this->formatBytes($free),
            'total' => $this->formatBytes($total),
            'used' => $this->formatBytes($used),
            'used_percent' => $total > 0 ? round(($used / $total) * 100, 2) : 0,
        ];
    }

    /**
     * Información de la base de datos
     */
    private function getDatabaseInfo()
    {
        $dbPath = database_path('database.sqlite');

        return [
            'name' => 'SQLite',
            'size' => File::exists($dbPath) ? $this->formatBytes(File::size($dbPath)) : 'No encontrada',
            'last_modified' => File::exists($dbPath) ? date('d/m/Y H:i:s', File::lastModified($dbPath)) : null,
        ];
    }

    /**
     * Formatea bytes a formato legible
     */
    private function formatBytes($bytes, $precision = 2)
    {
        if ($bytes <= 0) return '0 B';

        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
