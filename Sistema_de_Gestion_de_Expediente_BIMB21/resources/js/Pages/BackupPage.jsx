import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Download } from "lucide-react";
export default function BackupPage() {
    // Datos del controlador
    const { backups, diskInfo, dbInfo } = usePage().props;

    // Estados
    const [isCreating, setIsCreating] = useState(false);
    const { post, delete: destroy } = useForm();

    // Crear backup
    const handleCreateBackup = () => {
        if (confirm("¿Crear un nuevo backup de la base de datos?")) {
            setIsCreating(true);

            post(
                route("backups.create"),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsCreating(false);
                    },
                    onError: () => {
                        setIsCreating(false);
                        alert("Error al crear el backup");
                    },
                },
            );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="h3 mb-0 fw-bold text-dark">
                    Gestión de Respaldo
                </h2>
            }
        >
            <Head title="Backups" />

            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        {/* Panel de Información */}
                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Base de Datos
                                        </h5>
                                        <p className="card-text">
                                            <strong>Tipo:</strong> SQLite
                                            <br />
                                            <strong>Tamaño:</strong>{" "}
                                            {dbInfo.size}
                                            <br />
                                            <strong>
                                                Última modificación:
                                            </strong>{" "}
                                            {dbInfo.last_modified || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Espacio Local Disponible
                                        </h5>
                                        <p className="card-text">
                                            <strong>Usado:</strong>{" "}
                                            {diskInfo.used} de {diskInfo.total}{" "}
                                            ({diskInfo.used_percent}%)
                                            <br />
                                            <strong>Libre:</strong>{" "}
                                            {diskInfo.free}
                                        </p>
                                        <div className="progress">
                                            <div
                                                className="progress-bar bg-success"
                                                role="progressbar"
                                                style={{
                                                    width: `${diskInfo.used_percent}%`,
                                                }}
                                                aria-valuenow={
                                                    diskInfo.used_percent
                                                }
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                {diskInfo.used_percent}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botón Crear Backup con animacion limitada*/}
                        <div className="card mb-4">
                            <div className="card-body text-center">
                                <button
                                    onClick={handleCreateBackup}
                                    disabled={isCreating}
                                    className="btn btn-primary btn-lg"
                                >
                                    {isCreating ? (
                                        <>
                                            <span
                                                className="me-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Creado Exitósamente
                                        </>
                                    ) : (
                                        " Crear Nuevo Respaldo"
                                    )}
                                </button>
                                <p className="text-muted mt-2 mb-0">
                                    El Respaldo se guardará en:{" "}
                                    <code>storage/app/backups/</code>
                                </p>
                            </div>
                        </div>

                        {/* Lista de Backups */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    Respaldos Existentes ({backups.length})
                                </h5>
                            </div>
                            <div className="card-body">
                                {backups.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        No hay respaldos creados aún
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Archivo</th>
                                                    <th>Tamaño</th>
                                                    <th>Fecha de Creación</th>
                                                    <th>
                                                        <Download />
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {backups.map((backup) => (
                                                    <tr key={backup.name}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <i className="bi bi-database text-primary me-2"></i>
                                                                <span>
                                                                    {
                                                                        backup.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {backup.size_human}
                                                        </td>
                                                        <td>
                                                            {
                                                                backup.created_at_formatted
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className="btn-group btn-group-sm">
                                                                <a
                                                                    href={
                                                                        backup.download_url
                                                                    }
                                                                    className="btn btn-success"
                                                                >
                                                                    <i className="bi bi-download me-1"></i>{" "}
                                                                    Descargar
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
