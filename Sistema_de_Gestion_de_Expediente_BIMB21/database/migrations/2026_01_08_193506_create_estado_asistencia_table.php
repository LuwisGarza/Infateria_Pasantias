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
    {   //Creación de tabla estado_asistencia
        Schema::create('estado_asistencia', function (Blueprint $table) {
            // Llave primaria
            $table->id('estado_id');
            $table->string('nombre_estado', 20);
            $table->string('tipo_disponibilidad', 20);
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('estado_asistencia');
    }
};
