// resources/js/Pages/Expedients/Index.jsx
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ expedients }) {
    return (
        <AuthenticatedLayout>
            <Head title="Listado de Personal" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Gestión de Personal
                            </h2>
                            <Link
                                href={route("expedients.create")}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                + Nuevo Personal
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {expedients.data &&
                                    expedients.data.length > 0 ? (
                                        expedients.data.map((persona) => (
                                            <tr key={persona.list}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {persona.nombre}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {persona.identificacion}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                                        {
                                                            persona.origen_status_3_6_0_list
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route(
                                                            "expedients.edit",
                                                            persona.list
                                                        )}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "expedients.show",
                                                            persona.list
                                                        )}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Ver
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                No hay personal registrado aún.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación (si hay) */}
                        {expedients.links && (
                            <div className="mt-4">
                                {/* Inertia maneja la paginación automáticamente */}
                                {Object.entries(expedients.links).map(
                                    ([key, link]) =>
                                        link.url && (
                                            <Link
                                                key={key}
                                                href={link.url}
                                                className={`px-3 py-1 mx-1 border rounded ${
                                                    link.active
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-white text-gray-700"
                                                }`}
                                            >
                                                {key
                                                    .replace("&laquo;", "«")
                                                    .replace("&raquo;", "»")}
                                            </Link>
                                        )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
