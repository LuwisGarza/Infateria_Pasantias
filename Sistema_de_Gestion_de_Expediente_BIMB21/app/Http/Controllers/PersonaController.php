<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PersonaController extends Controller
{
    public function index()
    {
        $personas = Persona::whereNull('deleted_at')->paginate(10);

        return Inertia::render('Personas/Index', [
            'personas' => $personas,
        ]);
    }

    public function create()
    {
        return Inertia::render('Personas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombres' => [
                'required',
                'string',
                'max:180',
                'regex:/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s\'-]+$/u' // Solo letras, espacios, apóstrofes y guiones
            ],
            'apellidos' => [
                'required',
                'string',
                'max:180',
                'regex:/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s\'-]+$/u'
            ],
            'cedula' => [
                'nullable',
                'string',
                'max:13',
                'regex:/^\d{3}-\d{7}-\d{1}$/', // Formato: 000-0000000-0
                Rule::unique('persona', 'cedula')->where(function ($query) {
                    return $query->whereNull('deleted_at');
                }),
            ],
            'fecha_nacimiento' => [
                'nullable',
                'date',
                'regex:/^\d{4}-\d{2}-\d{2}$/', // Formato: YYYY-MM-DD
            ],
            'direccion' => 'nullable|string|max:255',
            'telefono' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^(\+1[\s\-]?)?(809|829|849)[\s\-]?\d{3}[\s\-]?\d{4}$/', // Teléfono dominicano
            ],
            'rango_militar' => [
                'nullable',
                'string',
                'max:100',
                'regex:/^[A-Za-z0-9\-\s\.\,]+$/' // Letras, números, guiones, puntos, comas
            ],
        ], [
            // Mensajes personalizados de error
            'nombres.regex' => 'El nombre solo puede contener letras, espacios, apóstrofes (\') y guiones (-)',
            'apellidos.regex' => 'Los apellidos solo pueden contener letras, espacios, apóstrofes (\') y guiones (-)',
            'cedula.regex' => 'La cédula debe tener el formato: 000-0000000-0',
            'fecha_nacimiento.regex' => 'La fecha debe tener el formato: AAAA-MM-DD',
            'telefono.regex' => 'El teléfono debe ser un número dominicano válido (809, 829, 849). Ejemplo: 809-123-4567',
            'rango_militar.regex' => 'El rango militar contiene caracteres no permitidos. Solo letras, números, guiones, puntos y comas.',
        ]);

        Persona::create(array_merge($validated, [
            'activo' => true,
        ]));

        return redirect()->route('personas.index')
            ->with('success', 'Persona creada exitosamente.');
    }

    public function edit(Persona $persona)
    {
        return Inertia::render('Personas/Edit', [
            'persona' => $persona,
        ]);
    }

    public function update(Request $request, Persona $persona)
    {
        $validated = $request->validate([
            'nombres' => [
                'required',
                'string',
                'max:180',
                'regex:/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s\'-]+$/u'
            ],
            'apellidos' => [
                'required',
                'string',
                'max:180',
                'regex:/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s\'-]+$/u'
            ],
            'cedula' => [
                'nullable',
                'string',
                'max:13',
                'regex:/^\d{3}-\d{7}-\d{1}$/',
                Rule::unique('persona', 'cedula')
                    ->where(function ($query) {
                        return $query->whereNull('deleted_at');
                    })
                    ->ignore($persona->persona_id, 'persona_id'),
            ],
            'fecha_nacimiento' => [
                'nullable',
                'regex:/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/',
            ],
            'direccion' => 'nullable|string|max:255',
            'telefono' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^(\+1[\s\-]?)?(809|829|849)[\s\-]?\d{3}[\s\-]?\d{4}$/',
            ],
            'rango_militar' => [
                'nullable',
                'string',
                'max:100',
                'regex:/^[A-Za-z0-9\-\s\.\,]+$/'
            ],
            'activo' => 'boolean',
        ], [
            'nombres.regex' => 'El nombre solo puede contener letras, espacios, apóstrofes (\') y guiones (-)',
            'apellidos.regex' => 'Los apellidos solo pueden contener letras, espacios, apóstrofes (\') y guiones (-)',
            'cedula.regex' => 'La cédula debe tener el formato: 000-0000000-0',
            'fecha_nacimiento.regex' => 'La fecha debe tener el formato DD/MM/AAAA (ej: 25/12/1990).',
            'telefono.regex' => 'El teléfono debe ser un número dominicano válido (809, 829, 849). Ejemplo: 809-123-4567',
            'rango_militar.regex' => 'El rango militar contiene caracteres no permitidos. Solo letras, números, guiones, puntos y comas.',
        ]);

        $persona->update($validated);

        return redirect()->route('personas.index')
            ->with('success', 'Persona actualizada exitosamente.');
    }

    public function destroy(Persona $persona)
    {
        $persona->delete(); // soft delete

        return redirect()->route('personas.index')
            ->with('success', 'Persona eliminada exitosamente.');
    }

    // Mantenemos este método por si necesitas una API para estadísticas
    public function estadisticas()
    {
        $total = Persona::whereNull('deleted_at')->count();
        $activas = Persona::whereNull('deleted_at')->where('activo', true)->count();
        $inactivas = Persona::whereNull('deleted_at')->where('activo', false)->count();

        return response()->json([
            'total' => $total,
            'activas' => $activas,
            'inactivas' => $inactivas,
            'porcentajeActivas' => $total > 0 ? round(($activas / $total) * 100, 2) : 0,
        ]);
    }
}
