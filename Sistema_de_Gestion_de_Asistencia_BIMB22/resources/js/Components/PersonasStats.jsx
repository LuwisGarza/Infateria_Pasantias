// resources/js/Components/PersonasStats.jsx
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function PersonasStats({
    total,
    activas,
    inactivas,
    loading = false,
}) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total de Personas */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Personal Total</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {total}
                        </p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Activas */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Disponibles</p>
                        <p className="text-2xl font-bold text-green-900">
                            {activas}
                        </p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                        <UserCheck className="w-6 h-6 text-green-600" />
                    </div>
                </div>
                <div className="mt-2">
                    <span className="text-xs text-gray-500">
                        {total > 0 ? Math.round((activas / total) * 100) : 0}%
                    </span>
                </div>
            </div>

            {/* Inactivas */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Indisponibles</p>
                        <p className="text-2xl font-bold text-red-900">
                            {inactivas}
                        </p>
                    </div>
                    <div className="bg-red-100 p-2 rounded-full">
                        <UserX className="w-6 h-6 text-red-600" />
                    </div>
                </div>
                <div className="mt-2">
                    <span className="text-xs text-gray-500">
                        {total > 0 ? Math.round((inactivas / total) * 100) : 0}%
                    </span>
                </div>
            </div>
        </div>
    );
}
