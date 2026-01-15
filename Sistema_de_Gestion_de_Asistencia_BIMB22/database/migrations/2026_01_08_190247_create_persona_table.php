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
    {   //Creación de tabla persona
        Schema::create('persona', function (Blueprint $table) {
            // Llave primaria
            $table->id('persona_id');
            $table->string('nombres', 180);
            $table->string('apellidos', 180);
            $table->string('cedula', 13)->unique();
            $table->date('fecha_nacimiento')->nullable();
            $table->text('direccion')->nullable();
            $table->string('telefono', 20)->nullable();

            // booleano para estado activo/inactivo
            $table->boolean('activo')->default(true);
            $table->timestamp('fecha_baja')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('persona');
    }
};
