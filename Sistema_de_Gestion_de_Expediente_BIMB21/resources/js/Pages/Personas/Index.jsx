import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Users,
    UserPlus,
    Edit,
    Trash2,
    Eye,
    Search,
    Download,
    MoreVertical,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { useState } from "react";

export default function Index({ auth, personas }) {
    const [searchTerm, setSearchTerm] = useState("");

    const destroy = (id) => {
        if (confirm("¿Está seguro de que desea eliminar esta persona?")) {
            router.delete(`/personas/${id}`);
        }
    };

    const filteredPersonas = personas.data.filter(
        (persona) =>
            persona.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
            persona.apellidos
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            persona.cedula.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <div>
                            <h2 className="h4 fw-bold mb-0">
                                Gestión de Personas
                            </h2>
                            <p className="text-muted small mb-0">
                                Total registradas: {personas.total}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Personal" />

            {/* NOTA: Ya no mostramos PersonasStats aquí */}

            <div className="bg-white rounded-3 shadow-sm overflow-hidden border">
                {/* Header con búsqueda y acciones */}
                <div className="card-header bg-white border-bottom py-3">
                    <div className="row align-items-center g-3">
                        <div className="col-12 col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-end-0">
                                    <Search className="text-muted" size={20} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, apellido o cédula..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="form-control border-start-0"
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="d-flex justify-content-md-end gap-2">
                                <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                                    <Download size={18} />
                                    <span className="d-none d-md-inline">
                                        Exportar
                                    </span>
                                </button>
                                <Link
                                    href="/personas/create"
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                >
                                    <UserPlus size={18} />
                                    <span className="d-none d-md-inline">
                                        Agregar Nuevo
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de personas */}
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Personal</th>
                                <th>Información</th>
                                <th>Estado</th>
                                <th className="pe-4 text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPersonas.map((persona) => (
                                <tr key={persona.persona_id}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                }}
                                            >
                                                <Users
                                                    className="text-primary"
                                                    size={18}
                                                />
                                            </div>
                                            <div>
                                                <div className="fw-medium">
                                                    {persona.nombres}{" "}
                                                    {persona.apellidos}
                                                </div>
                                                <small className="text-muted">
                                                    ID: {persona.persona_id}
                                                </small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div className="mb-1">
                                                <span className="fw-medium me-1">
                                                    Cédula:
                                                </span>
                                                {persona.cedula}
                                            </div>
                                            {persona.telefono && (
                                                <div className="text-muted">
                                                    <span className="fw-medium me-1">
                                                        Tel:
                                                    </span>
                                                    {persona.telefono}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge d-flex align-items-center gap-1 ${
                                                persona.activo
                                                    ? "bg-success bg-opacity-10 text-success"
                                                    : "bg-danger bg-opacity-10 text-danger"
                                            }`}
                                            style={{ width: "fit-content" }}
                                        >
                                            {persona.activo ? (
                                                <>
                                                    <CheckCircle size={14} />
                                                    Activo
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={14} />
                                                    Inactivo
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="pe-4 text-end">
                                        <div className="btn-group btn-group-sm">
                                            <Link
                                                href={`/personas/${persona.persona_id}`}
                                                className="btn btn-outline-primary"
                                                title="Ver detalles"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                href={`/personas/${persona.persona_id}/edit`}
                                                className="btn btn-outline-success"
                                                title="Editar"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    destroy(persona.persona_id)
                                                }
                                                className="btn btn-outline-danger"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="btn btn-outline-secondary">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer con paginación */}
                {personas.links && (
                    <div className="card-footer bg-white border-top py-3">
                        <div className="row align-items-center">
                            <div className="col-12 col-md-6 mb-2 mb-md-0">
                                <div className="text-muted">
                                    Mostrando {filteredPersonas.length} de{" "}
                                    {personas.total} personas
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <nav className="d-flex justify-content-md-end">
                                    <ul className="pagination pagination-sm mb-0">
                                        {Object.entries(personas.links).map(
                                            ([key, link]) =>
                                                link.url && (
                                                    <li
                                                        key={key}
                                                        className="page-item"
                                                    >
                                                        <Link
                                                            href={link.url}
                                                            className={`page-link ${
                                                                link.active
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    </li>
                                                ),
                                        )}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {filteredPersonas.length === 0 && (
                <div className="text-center py-5">
                    <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                        <Users className="text-muted" size={48} />
                    </div>
                    <h3 className="h5 fw-bold text-gray-900 mb-2">
                        No se encontraron personas
                    </h3>
                    <p className="text-muted mb-4">
                        {searchTerm
                            ? "Intenta con otro término de búsqueda"
                            : "Comienza creando una nueva persona"}
                    </p>
                    {!searchTerm && (
                        <Link
                            href="/personas/create"
                            className="btn btn-primary d-inline-flex align-items-center gap-2"
                        >
                            <UserPlus size={18} />
                            Crear primera persona
                        </Link>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
