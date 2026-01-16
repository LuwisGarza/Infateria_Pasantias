import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Index({ roles, permissions }) {
    const { flash = {} } = usePage().props;
    const [showSuccessAlert, setShowSuccessAlert] = useState(true);
    const [expandedRole, setExpandedRole] = useState(null);
    const [loadingPermission, setLoadingPermission] = useState(null);

    // Formulario para crear rol
    const {
        data: roleData,
        setData: setRoleData,
        post: postRole,
        processing: roleProcessing,
        reset: resetRole,
    } = useForm({
        name: "",
    });

    // Formulario para crear permiso
    const {
        data: permissionData,
        setData: setPermissionData,
        post: postPermission,
        processing: permissionProcessing,
        reset: resetPermission,
    } = useForm({
        name: "",
    });

    // Crear rol
    const submitRole = (e) => {
        e.preventDefault();
        postRole(route("roles.store"), {
            onSuccess: () => resetRole(),
        });
    };

    // Crear permiso
    const submitPermission = (e) => {
        e.preventDefault();
        postPermission(route("permissions.create"), {
            onSuccess: () => {
                resetPermission();
                // Recargar página para ver nuevo permiso
                router.reload({ only: ["permissions"] });
            },
        });
    };

    // Función para alternar permisos
    const togglePermission = async (roleId, permissionName, hasPermission) => {
        setLoadingPermission(`${roleId}-${permissionName}`);

        try {
            if (hasPermission) {
                await router.delete(route("roles.permissions.remove", roleId), {
                    data: { permission: permissionName },
                    preserveScroll: true,
                });
            } else {
                await router.post(
                    route("roles.permissions.add", roleId),
                    { permission: permissionName },
                    { preserveScroll: true },
                );
            }
            // Recargar solo los roles
            router.reload({ only: ["roles"] });
        } catch (error) {
            console.error("Error al cambiar permiso:", error);
        } finally {
            setLoadingPermission(null);
        }
    };

    // Función para expandir/colapsar permisos de un rol
    const toggleRoleExpansion = (roleId) => {
        setExpandedRole(expandedRole === roleId ? null : roleId);
    };

    // Función para eliminar rol
    const handleDeleteRole = (role) => {
        if (
            window.confirm(
                `¿Estás seguro de eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`,
            )
        ) {
            router.delete(route("roles.destroy", role.id), {
                onSuccess: () => {
                    // Recargar la página completa
                    router.reload();
                },
            });
        }
    };

    // Cerrar alerta automáticamente después de 5 segundos
    useEffect(() => {
        if (flash.success) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    return (
        <AuthenticatedLayout header="Gestión de Roles y Permisos">
            <Head title="Roles y Permisos" />

            {/* Alertas */}
            {flash.success && showSuccessAlert && (
                <div className="alert alert-success mb-4 d-flex justify-content-between align-items-center alert-dismissible fade show">
                    <span>{flash.success}</span>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowSuccessAlert(false)}
                        aria-label="Cerrar"
                    ></button>
                </div>
            )}

            {flash.error && (
                <div className="alert alert-danger mb-4 d-flex justify-content-between align-items-center alert-dismissible fade show">
                    <span>{flash.error}</span>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => {}}
                        aria-label="Cerrar"
                    ></button>
                </div>
            )}

            {/* Sección de Creación */}
            <div className="row mb-4">
                {/* Crear Rol */}
                <div className="col-md-6 mb-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">
                                <i className="bi bi-person-plus me-2"></i>
                                Crear Nuevo Rol
                            </h5>
                            <form onSubmit={submitRole} className="mt-3">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: editor, supervisor, auditor"
                                        value={roleData.name}
                                        onChange={(e) =>
                                            setRoleData("name", e.target.value)
                                        }
                                        required
                                        minLength={2}
                                        maxLength={50}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        disabled={roleProcessing}
                                    >
                                        {roleProcessing ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                ></span>
                                                Creando...
                                            </>
                                        ) : (
                                            "Crear Rol"
                                        )}
                                    </button>
                                </div>
                                <small className="text-muted mt-2 d-block">
                                    El nombre debe ser único y descriptivo.
                                </small>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Crear Permiso */}
                <div className="col-md-6 mb-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">
                                <i className="bi bi-shield-plus me-2"></i>
                                Crear Nuevo Permiso
                            </h5>
                            <form onSubmit={submitPermission} className="mt-3">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: usuarios.crear, reportes.ver"
                                        value={permissionData.name}
                                        onChange={(e) =>
                                            setPermissionData(
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        minLength={2}
                                        maxLength={50}
                                    />
                                    <button
                                        className="btn btn-success"
                                        disabled={permissionProcessing}
                                    >
                                        {permissionProcessing ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                ></span>
                                                Creando...
                                            </>
                                        ) : (
                                            "Crear Permiso"
                                        )}
                                    </button>
                                </div>
                                <small className="text-muted mt-2 d-block">
                                    Usa formato: modulo.accion
                                </small>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de Roles */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">
                            <i className="bi bi-people me-2"></i>
                            Roles del Sistema
                        </h5>
                        <div className="text-muted">
                            <span className="badge bg-primary me-2">
                                {roles.length} roles
                            </span>
                            <span className="badge bg-secondary">
                                {permissions.length} permisos
                            </span>
                        </div>
                    </div>

                    {roles.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <i className="bi bi-people display-1 text-muted"></i>
                            </div>
                            <p className="text-muted mb-0">
                                No hay roles creados aún.
                            </p>
                            <small>
                                Crea tu primer rol usando el formulario
                                superior.
                            </small>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th width="25%">Rol</th>
                                        <th width="60%">Permisos Asignados</th>
                                        <th width="15%" className="text-center">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map((role) => (
                                        <tr key={role.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-circle me-3">
                                                        <div className="avatar-initial bg-primary text-white">
                                                            {role.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">
                                                            {role.name}
                                                        </div>
                                                        <div className="small text-muted">
                                                            <i className="bi bi-person me-1"></i>
                                                            {role.users_count}{" "}
                                                            usuario(s) ·
                                                            <i className="bi bi-shield-check ms-2 me-1"></i>
                                                            {
                                                                role.permissions
                                                                    .length
                                                            }{" "}
                                                            permiso(s)
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {/* Permisos compactos */}
                                                <div className="mb-2">
                                                    {role.permissions.length ===
                                                    0 ? (
                                                        <span className="badge bg-light text-dark border">
                                                            <i className="bi bi-shield-slash me-1"></i>
                                                            Sin permisos
                                                        </span>
                                                    ) : (
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {role.permissions
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        permission,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                permission
                                                                            }
                                                                            className="badge bg-info"
                                                                        >
                                                                            {
                                                                                permission
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            {role.permissions
                                                                .length > 3 && (
                                                                <span className="badge bg-secondary">
                                                                    +
                                                                    {role
                                                                        .permissions
                                                                        .length -
                                                                        3}{" "}
                                                                    más
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Botón para gestionar permisos */}
                                                <div>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() =>
                                                            toggleRoleExpansion(
                                                                role.id,
                                                            )
                                                        }
                                                    >
                                                        <i
                                                            className={`bi ${expandedRole === role.id ? "bi-eye-slash" : "bi-eye"} me-1`}
                                                        ></i>
                                                        {expandedRole ===
                                                        role.id
                                                            ? "Ocultar"
                                                            : "Gestionar"}{" "}
                                                        Permisos
                                                    </button>
                                                </div>

                                                {/* Panel expandible de permisos */}
                                                {expandedRole === role.id && (
                                                    <div className="border rounded p-3 bg-light mt-2">
                                                        <h6 className="mb-3">
                                                            <i className="bi bi-gear me-2"></i>
                                                            Asignar permisos a:{" "}
                                                            <strong>
                                                                {role.name}
                                                            </strong>
                                                        </h6>

                                                        {permissions.length ===
                                                        0 ? (
                                                            <div className="alert alert-warning">
                                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                                No hay permisos
                                                                creados. Crea
                                                                permisos
                                                                primero.
                                                            </div>
                                                        ) : (
                                                            <div className="row">
                                                                {permissions.map(
                                                                    (
                                                                        permission,
                                                                    ) => {
                                                                        const hasPermission =
                                                                            role.permissions.includes(
                                                                                permission,
                                                                            );
                                                                        const isLoading =
                                                                            loadingPermission ===
                                                                            `${role.id}-${permission}`;

                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    permission
                                                                                }
                                                                                className="col-md-4 mb-2"
                                                                            >
                                                                                <div className="form-check">
                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                            hasPermission
                                                                                        }
                                                                                        onChange={() =>
                                                                                            togglePermission(
                                                                                                role.id,
                                                                                                permission,
                                                                                                hasPermission,
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            isLoading
                                                                                        }
                                                                                        id={`${role.id}-${permission}`}
                                                                                    />
                                                                                    <label
                                                                                        className="form-check-label d-flex align-items-center"
                                                                                        htmlFor={`${role.id}-${permission}`}
                                                                                    >
                                                                                        {isLoading ? (
                                                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                                                        ) : (
                                                                                            <i
                                                                                                className={`bi ${hasPermission ? "bi-check-square" : "bi-square"} me-2`}
                                                                                            ></i>
                                                                                        )}
                                                                                        {
                                                                                            permission
                                                                                        }
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="mt-3 text-end">
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() =>
                                                                    setExpandedRole(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-x-lg me-1"></i>
                                                                Cerrar
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {role.is_protected ? (
                                                    <span
                                                        className="badge bg-warning text-dark"
                                                        title="Rol del sistema"
                                                    >
                                                        <i className="bi bi-shield-lock me-1"></i>
                                                        Protegido
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleDeleteRole(
                                                                role,
                                                            )
                                                        }
                                                        title="Eliminar rol"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Panel de permisos disponibles */}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">
                        <i className="bi bi-shield-check me-2"></i>
                        Permisos Disponibles en el Sistema
                    </h5>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        {permissions.length === 0 ? (
                            <div className="alert alert-warning w-100">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                No hay permisos creados. Usa el formulario
                                superior para crear el primero.
                            </div>
                        ) : (
                            permissions.map((permission) => (
                                <span
                                    key={permission}
                                    className="badge bg-secondary d-flex align-items-center"
                                >
                                    <i className="bi bi-shield me-1"></i>
                                    {permission}
                                </span>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Estilos adicionales */}
            <style>{`
                .avatar-circle {
                    width: 40px;
                    height: 40px;
                }
                .avatar-initial {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                .alert-dismissible {
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .form-check-input:checked {
                    background-color: #0d6efd;
                    border-color: #0d6efd;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
