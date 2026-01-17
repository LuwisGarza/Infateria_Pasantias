<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PersonaController extends Controller
{
    /**
     * Constructor - Protege todas las rutas con middlewares de permisos
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
        $this->middleware('permission:personas.view')->only(['index', 'show', 'estadisticas']);
        $this->middleware('permission:personas.create')->only(['create', 'store']);
        $this->middleware('permission:personas.edit')->only(['edit', 'update']);
        $this->middleware('permission:personas.delete')->only(['destroy']);
    }

    /**
     * Mostrar lista de personas
     */
    public function index()
    {
        if (!Auth::user()->hasPermissionTo('personas.view')) {
            abort(403, 'No tienes permiso para ver personas');
        }

        $personas = Persona::whereNull('deleted_at')->paginate(10);

        return Inertia::render('Personas/Index', [
            'personas' => $personas,
            'can' => [
                'create' => Auth::user()->hasPermissionTo('personas.create'),
                'edit' => Auth::user()->hasPermissionTo('personas.edit'),
                'delete' => Auth::user()->hasPermissionTo('personas.delete'),
            ]
        ]);
    }

    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        if (!Auth::user()->hasPermissionTo('personas.create')) {
            abort(403, 'No tienes permiso para crear personas');
        }

        return Inertia::render('Personas/Create');
    }

    /**
     * Almacenar nueva persona - VALIDACIONES VENEZOLANAS
     */
    public function store(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('personas.create')) {
            abort(403, 'No tienes permiso para crear personas');
        }

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
                'required', // En Venezuela la cédula es obligatoria
                'string',
                'max:15',
                // Acepta: V-12345678, E-12345678, 12345678 (7-9 dígitos)
                'regex:/^(V|E|v|e)?-?\d{7,9}$/',
                Rule::unique('persona', 'cedula')->where(function ($query) {
                    return $query->whereNull('deleted_at');
                }),
            ],
            'fecha_nacimiento' => [
                'required',
                'date',
                // Acepta: DD/MM/AAAA (formato venezolano)
                'regex:/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/',
                'before_or_equal:today',
                function ($attribute, $value, $fail) {
                    // Validar fecha real (ej: no 31/02/2023)
                    $parts = explode('/', $value);
                    if (count($parts) === 3 && !checkdate($parts[1], $parts[0], $parts[2])) {
                        $fail('La fecha de nacimiento no es válida.');
                    }

                    // Edad mínima (15 años) y máxima (120 años)
                    $birthDate = \DateTime::createFromFormat('d/m/Y', $value);
                    $today = new \DateTime();
                    $age = $today->diff($birthDate)->y;

                    if ($age < 15) {
                        $fail('La persona debe tener al menos 15 años.');
                    }
                    if ($age > 120) {
                        $fail('La edad no puede ser mayor a 120 años.');
                    }
                }
            ],
            'direccion' => 'nullable|string|max:255',
            'telefono' => [
                'required',
                'string',
                'max:20',
                // Acepta: 0414-1234567, 04121234567, +58-414-1234567, (0241) 1234567
                'regex:/^(\+58[\s\-]?)?(0?(2(41|42|43|44|45|46|47|48)|4(12|14|16|24|26))[\s\-]?)?\d{3}[\s\-]?\d{4}$/',
            ],
            'rango_militar' => [
                'nullable',
                'string',
                'max:100',
                'regex:/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\-\s\.\,]+$/u'
            ],
        ], [
            'nombres.regex' => 'El nombre solo puede contener letras, espacios, apóstrofes (\') y guiones (-)',
            'apellidos.regex' => 'Los apellidos solo pueden contener letras, espacios, apóstrofes (\') y guientes (-)',
            'cedula.required' => 'La cédula es obligatoria en Venezuela.',
            'cedula.regex' => 'Formato de cédula venezolana inválido. Ejemplos válidos: V-12345678, E-87654321, 12345678',
            'cedula.unique' => 'Esta cédula ya está registrada en el sistema.',
            'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria.',
            'fecha_nacimiento.regex' => 'La fecha debe tener formato DD/MM/AAAA (ej: 15/07/1990).',
            'fecha_nacimiento.before_or_equal' => 'La fecha no puede ser futura.',
            'telefono.required' => 'El teléfono es obligatorio.',
            'telefono.regex' => 'Formato de teléfono venezolano inválido. Ejemplos: 0414-1234567, 0241-1234567, +58-414-1234567',
            'rango_militar.regex' => 'El rango militar contiene caracteres no permitidos.',
        ]);

        Persona::create(array_merge($validated, [
            'activo' => true,
        ]));

        return redirect()->route('personas.index')
            ->with('success', 'Persona creada exitosamente.');
    }

    /**
     * Mostrar detalles de una persona
     */
    public function show(Persona $persona)
    {
        if (!Auth::user()->hasPermissionTo('personas.view')) {
            abort(403, 'No tienes permiso para ver personas');
        }

        return Inertia::render('Personas/Show', [
            'persona' => $persona,
        ]);
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(Persona $persona)
    {
        if (!Auth::user()->hasPermissionTo('personas.edit')) {
            abort(403, 'No tienes permiso para editar personas');
        }

        return Inertia::render('Personas/Edit', [
            'persona' => $persona,
        ]);
    }

    /**
     * Actualizar persona - VALIDACIONES VENEZOLANAS
     */
    public function update(Request $request, Persona $persona)
    {
        if (!Auth::user()->hasPermissionTo('personas.edit')) {
            abort(403, 'No tienes permiso para editar personas');
        }

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
                'required',
                'string',
                'max:15',
                'regex:/^(V|E|v|e)?-?\d{7,9}$/',
                Rule::unique('persona', 'cedula')
                    ->where(function ($query) {
                        return $query->whereNull('deleted_at');
                    })
                    ->ignore($persona->persona_id, 'persona_id'),
            ],
            'fecha_nacimiento' => [
                'required',
                'regex:/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/',
                'before_or_equal:today',
                function ($attribute, $value, $fail) {
                    $parts = explode('/', $value);
                    if (count($parts) === 3 && !checkdate($parts[1], $parts[0], $parts[2])) {
                        $fail('La fecha de nacimiento no es válida.');
                    }

                    $birthDate = \DateTime::createFromFormat('d/m/Y', $value);
                    $today = new \DateTime();
                    $age = $today->diff($birthDate)->y;

                    if ($age < 15) {
                        $fail('La persona debe tener al menos 15 años.');
                    }
                    if ($age > 120) {
                        $fail('La edad no puede ser mayor a 120 años.');
                    }
                }
            ],
            'direccion' => 'nullable|string|max:255',
            'telefono' => [
                'required',
                'string',
                'max:20',
                'regex:/^(\+58[\s\-]?)?(0?(2(41|42|43|44|45|46|47|48)|4(12|14|16|24|26))[\s\-]?)?\d{3}[\s\-]?\d{4}$/',
            ],
            'rango_militar' => [
                'nullable',
                'string',
                'max:100',
                'regex:/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\-\s\.\,]+$/u'
            ],
            'activo' => 'boolean',
        ], [
            'nombres.regex' => 'El nombre solo puede contener letras, espacios, apóstrofes (\') y guiones (-)',
            'apellidos.regex' => 'Los apellidos solo pueden contener letras, espacios, apóstrofes (\') y guiones (-)',
            'cedula.regex' => 'Formato de cédula venezolana inválido. Ejemplos: V-12345678, E-87654321, 12345678',
            'fecha_nacimiento.regex' => 'La fecha debe tener formato DD/MM/AAAA (ej: 25/12/1990).',
            'telefono.regex' => 'Formato de teléfono venezolano inválido. Ejemplos: 0414-1234567, 0241-1234567, +58-414-1234567',
            'rango_militar.regex' => 'El rango militar contiene caracteres no permitidos.',
        ]);

        $persona->update($validated);

        return redirect()->route('personas.index')
            ->with('success', 'Persona actualizada exitosamente.');
    }

    /**
     * Eliminar persona (soft delete)
     */
    public function destroy(Persona $persona)
    {
        if (!Auth::user()->hasPermissionTo('personas.delete')) {
            abort(403, 'No tienes permiso para eliminar personas');
        }

        $persona->delete();

        return redirect()->route('personas.index')
            ->with('success', 'Persona eliminada exitosamente.');
    }

    /**
     * Obtener estadísticas
     */
    public function estadisticas()
    {
        if (!Auth::user()->hasPermissionTo('personas.view')) {
            abort(403, 'No tienes permiso para ver estadísticas de personas');
        }

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
