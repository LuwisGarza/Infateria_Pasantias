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
    { //Creación de tabla turno_permiso
        Schema::create('turno_permiso', function (Blueprint $table) {
            $table->id('turno_permiso_id');
            $table->string('tipo_permiso', 30);
            $table->string('unidad', 50);
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->integer('cupo_maximo');
            $table->integer('cupo_actual')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('turno_permiso');
    }
};
