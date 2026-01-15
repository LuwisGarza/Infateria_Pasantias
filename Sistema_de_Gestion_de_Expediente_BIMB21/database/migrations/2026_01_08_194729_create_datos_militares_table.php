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
    { //Creación de tabla datos_militares
        Schema::create('datos_militares', function (Blueprint $table) {
            // Llave primaria
            $table->id('militar_id');

            // Llave foránea a tabla persona
            $table->foreignId('persona_id')
                ->constrained('persona', 'persona_id')
                ->restrictOnDelete();

            // Llave foránea a tabla jerarquia_militar
            $table->foreignId('grado_id')
                ->constrained('jerarquia_militar', 'grado_id');

            $table->string('matricula', 20)->unique();
            $table->string('cargo_resolucion', 100)->nullable();
            $table->timestamp('fecha_fin_servicio')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('datos_militares');
    }
};
