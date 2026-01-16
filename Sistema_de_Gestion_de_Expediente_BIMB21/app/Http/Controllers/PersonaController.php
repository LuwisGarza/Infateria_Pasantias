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
        // Aplicar middleware de autenticación a todas las acciones
        $this->middleware(['auth', 'verified']);

        // Protección específica por permisos
        $this->middleware('permission:personas.view')->only(['index', 'show']);
        $this->middleware('permission:personas.create')->only(['create', 'store']);
        $this->middleware('permission:personas.edit')->only(['edit', 'update']);
        $this->middleware('permission:personas.delete')->only(['destroy']);
        $this->middleware('permission:personas.view')->only(['estadisticas']);

        // Nota: El permiso 'personas.edit' no existe en tu lista actual
        // Puedes crearlo o usar otro permiso existente como 'personas.create'
        // Te recomiendo crear el permiso 'personas.edit' con:
        // php artisan permission:create-permission personas.edit
    }

    /**
     * Mostrar lista de personas
     * Requiere: personas.view
     */
    public function index()
    {
        // El middleware ya validó el permiso, pero por si acaso:
        if (!Auth::user()->hasPermissionTo('personas.view')) {
            abort(403, 'No tienes permiso para ver personas');
        }

        $personas = Persona::whereNull('deleted_at')->paginate(10);

        return Inertia::render('Personas/Index', [
            'personas' => $personas,
            'can' => [ // Pasar permisos específicos al frontend
                'create' => Auth::user()->hasPermissionTo('personas.create'),
                'edit' => Auth::user()->hasPermissionTo('personas.edit'),
                'delete' => Auth::user()->hasPermissionTo('personas.delete'),
            ]
        ]);
    }

    /**
     * Mostrar formulario de creación
     * Requiere: personas.create
     */
    public function create()
    {
        // Verificación adicional
        if (!Auth::user()->hasPermissionTo('personas.create')) {
            abort(403, 'No tienes permiso para crear personas');
        }

        return Inertia::render('Personas/Create');
    }

    /**
     * Almacenar nueva persona
     * Requiere: personas.create
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
                'nullable',
                'string',
                'max:13',
                'regex:/^\d{3}-\d{7}-\d{1}$/',
                Rule::unique('persona', 'cedula')->where(function ($query) {
                    return $query->whereNull('deleted_at');
                }),
            ],
            'fecha_nacimiento' => [
                'nullable',
                'date',
                'regex:/^\d{4}-\d{2}-\d{2}$/',
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
        ], [
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

    /**
     * Mostrar detalles de una persona
     * Requiere: personas.view
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
     * Requiere: personas.edit
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
     * Actualizar persona
     * Requiere: personas.edit
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

    /**
     * Eliminar persona (soft delete)
     * Requiere: personas.delete
     */
    public function destroy(Persona $persona)
    {
        if (!Auth::user()->hasPermissionTo('personas.delete')) {
            abort(403, 'No tienes permiso para eliminar personas');
        }

        $persona->delete(); // soft delete

        return redirect()->route('personas.index')
            ->with('success', 'Persona eliminada exitosamente.');
    }

    /**
     * Obtener estadísticas
     * Requiere: personas.view
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
