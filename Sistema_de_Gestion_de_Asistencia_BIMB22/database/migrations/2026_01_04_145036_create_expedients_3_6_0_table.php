<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expedients_3_6_0', function (Blueprint $table) {
            $table->id('list'); // clave primaria auto incremental
            $table->string('nombre'); // nombre obligatorio
            $table->string('identificacion'); // identificación obligatoria
            $table->integer('origen_status_3_6_0_list'); // referencia a un estado
            $table->text('notas')->nullable(); // notas opcionales
            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expedients_3_6_0');
    }
};
