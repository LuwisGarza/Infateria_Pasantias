<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BackupSQLite extends Command
{
    protected $signature = 'backup:sqlite';
    protected $description = 'Copia directa del archivo SQLite para backup';

    public function handle()
    {
        $dbPath = database_path('database.sqlite');

        if (!File::exists($dbPath)) {
            $this->error("❌ No se encuentra database.sqlite en: " . $dbPath);
            return 1;
        }

        $backupDir = storage_path('app/backups');
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $backupName = "backup_{$timestamp}.sqlite";
        $backupPath = $backupDir . '\\' . $backupName;

        // ⚠️ IMPORTANTE: Cerrar conexión antes de copiar
        \DB::disconnect();

        if (copy($dbPath, $backupPath)) {
            \DB::reconnect(); // Reconectar después

            $size = filesize($backupPath);
            $sizeMB = round($size / 1024 / 1024, 2);

            $this->info("✅ Backup creado exitosamente!");
            $this->line("📁 Archivo: " . $backupName);
            $this->line("📏 Tamaño: " . $sizeMB . " MB");
            $this->line("📍 Guardado en: " . $backupPath);

            // Limpiar backups antiguos (más de 30 días)
            $this->cleanOldBackups($backupDir);

            return 0;
        } else {
            \DB::reconnect();
            $this->error("❌ Error al copiar el archivo");
            return 1;
        }
    }

    private function cleanOldBackups($backupDir)
    {
        $files = glob($backupDir . '\\backup_*.sqlite');
        $thirtyDaysAgo = time() - (30 * 24 * 60 * 60);
        $deleted = 0;

        foreach ($files as $file) {
            if (filemtime($file) < $thirtyDaysAgo) {
                unlink($file);
                $deleted++;
                $this->line("🗑️  Eliminado: " . basename($file));
            }
        }

        if ($deleted > 0) {
            $this->info("📦 Eliminados {$deleted} backups antiguos");
        }
    }
}
