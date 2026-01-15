import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ estados }) {
    // Recibe 'estados' como prop
    const { data, setData, post, processing, errors } = useForm({
        nombre: "",
        identificacion: "",
        origen_status_3_6_0_list: estados.length > 0 ? estados[0].list : "", // Usa el primer estado disponible
        notas: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("expedients.store"), {
            preserveScroll: true,
            onError: (errors) => {
                console.log("Errores:", errors);
            },
            onSuccess: () => {
                console.log("Éxito");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Crear Nuevo Expediente" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Registrar Nuevo Expediente
                            </h2>
                            <Link
                                href={route("expedients.index")}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                ← Volver al Listado
                            </Link>
                        </div>

                        {/* Mostrar errores generales */}
                        {errors.error && (
                            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                {errors.error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Campo: Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData("nombre", e.target.value)
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.nombre && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>

                            {/* Campo: Identificación */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Número de Identificación *
                                </label>
                                <input
                                    type="text"
                                    value={data.identificacion}
                                    onChange={(e) =>
                                        setData(
                                            "identificacion",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.identificacion && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.identificacion}
                                    </p>
                                )}
                            </div>

                            {/* Campo: Estado - FALTABA ESTE CAMPO */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Estado *
                                </label>
                                <select
                                    value={data.origen_status_3_6_0_list}
                                    onChange={(e) =>
                                        setData(
                                            "origen_status_3_6_0_list",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Seleccionar Estado</option>
                                    {estados.map((estado) => (
                                        <option
                                            key={estado.list}
                                            value={estado.list}
                                        >
                                            {estado.nombre ||
                                                `Estado ${estado.list}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.origen_status_3_6_0_list && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.origen_status_3_6_0_list}
                                    </p>
                                )}
                            </div>

                            {/* Campo: Notas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Observaciones / Notas
                                </label>
                                <textarea
                                    value={data.notas}
                                    onChange={(e) =>
                                        setData("notas", e.target.value)
                                    }
                                    rows="3"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.notas && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.notas}
                                    </p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end space-x-4 pt-4">
                                <Link
                                    href={route("expedients.index")}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                                >
                                    {processing && (
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    )}
                                    {processing
                                        ? "Guardando..."
                                        : "Guardar Expediente"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
