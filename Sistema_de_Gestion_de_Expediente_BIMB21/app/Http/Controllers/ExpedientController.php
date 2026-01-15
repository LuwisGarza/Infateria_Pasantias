<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\Expedients_3_6_0;
use App\Models\OrigenStatus_3_6_0; // Para cargar los estados en el formulario
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpedientController extends Controller
{

    // ExpedientController.php
    public function index()
    {
        // Obtén los expedientes paginados
        $expedients = Expedients_3_6_0::with('status')->paginate(10);

        // Pásalos a la vista Inertia
        return Inertia::render('Expedients/Index', [
            'expedients' => $expedients
        ]);
    }
    // Muestra el formulario de creación
    public function create()
    {
        // Obtener los estados para llenar un <select>
        $estados = OrigenStatus_3_6_0::all();

        // Pasar los estados al componente React
        return Inertia::render('Expedients/Create', [
            'estados' => $estados
        ]);
    }



    public function store(Request $request)
    {

        // 1. Validar los datos
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'identificacion' => 'required|string|max:100|unique:expedients_3_6_0,identificacion',
            'origen_status_3_6_0_list' => 'required|exists:origen_status_3_6_0,list',
            'notas' => 'nullable|string',
        ]);

        // 2. Crear el expediente
        Expedients_3_6_0::create($validated);

        // 3. Redirigir al index de expedientes
        return redirect()->route('expedients.index')
            ->with('success', 'Expediente creado correctamente.');
    }
}
