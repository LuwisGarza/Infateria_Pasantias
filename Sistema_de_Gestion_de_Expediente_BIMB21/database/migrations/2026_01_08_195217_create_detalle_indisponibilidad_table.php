<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutar las migraciones.
     */
    public function up(): void
    { //Creación de tabla detalle_indisponibilidad
        Schema::create('detalle_indisponibilidad', function (Blueprint $table) {
            // Llave primaria
            $table->id('detalle_id');

            // Llave foránea a tabla asistencia
            $table->foreignId('asistencia_id')
                ->constrained('asistencia', 'asistencia_id')
                ->restrictOnDelete();

            $table->string('tipo_indisponibilidad', 30);
            $table->text('descripcion')->nullable();
            $table->date('fecha_inicio');
            $table->date('fecha_fin_estimada')->nullable();

            // Llave foránea a tabla turno_permiso (opcional)
            $table->foreignId('turno_permiso_id')
                ->nullable()
                ->constrained('turno_permiso', 'turno_permiso_id');

            $table->timestamps();
        });
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_indisponibilidad');
    }
};
