import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Download, Trash2, AlertCircle, CheckCircle, Database, HardDrive } from 'lucide-react';

export default function BackupPage() {
  // Datos del controlador con depuración
  const props = usePage().props;
  console.log('Props recibidas:', props); // Para debug

  const { backups = [], diskInfo = {}, dbInfo = {}, flash } = props;

  // Estados
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [alert, setAlert] = useState(null);
  const { post, delete: destroy } = useForm();

  // Efecto para mostrar mensajes flash
  useEffect(() => {
    if (flash?.success) {
      setAlert({ type: 'success', message: flash.success });
    } else if (flash?.error) {
      setAlert({ type: 'error', message: flash.error });
    }

    // Auto-ocultar alerta después de 5 segundos
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash, alert]);

  // Crear backup
  const handleCreateBackup = () => {
    if (confirm('¿Crear un nuevo backup de la base de datos?')) {
      setIsCreating(true);

      post(
        route('backups.create'),
        {},
        {
          preserveScroll: true,
          onSuccess: () => {
            setIsCreating(false);
            // Recargar la página para ver cambios
            window.location.reload();
          },
          onError: errors => {
            setIsCreating(false);
            setAlert({
              type: 'error',
              message: 'Error al crear el backup. Verifica los logs.',
            });
          },
        }
      );
    }
  };

  // Eliminar backup
  const handleDeleteBackup = filename => {
    if (confirm(`¿Eliminar el backup "${filename}"? Esta acción no se puede deshacer.`)) {
      setIsDeleting(filename);

      destroy(route('backups.destroy', { filename }), {
        preserveScroll: true,
        onSuccess: () => {
          setIsDeleting(null);
          window.location.reload();
        },
        onError: () => {
          setIsDeleting(null);
          setAlert({
            type: 'error',
            message: 'Error al eliminar el backup',
          });
        },
      });
    }
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="h3 mb-0 fw-bold text-dark">Gestión de Respaldo</h2>}
    >
      <Head title="Backups" />

      <div className="container-fluid py-4">
        {/* Alertas */}
        {alert && (
          <div
            className={`alert alert-${alert.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show mb-4`}
            role="alert"
          >
            <div className="d-flex align-items-center">
              {alert.type === 'success' ? (
                <CheckCircle className="me-2" size={20} />
              ) : (
                <AlertCircle className="me-2" size={20} />
              )}
              <span>{alert.message}</span>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlert(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="row">
          <div className="col-12">
            {/* Panel de Información */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                        <Database size={24} className="text-primary" />
                      </div>
                      <h5 className="card-title mb-0">Base de Datos</h5>
                    </div>
                    <div className="ms-5">
                      <div className="mb-2">
                        <strong className="text-muted">Tipo:</strong>
                        <span className="ms-2">SQLite</span>
                      </div>
                      <div className="mb-2">
                        <strong className="text-muted">Tamaño:</strong>
                        <span className="ms-2">{dbInfo?.size || 'N/A'}</span>
                      </div>
                      <div>
                        <strong className="text-muted">Última modificación:</strong>
                        <span className="ms-2">{dbInfo?.last_modified || 'N/A'}</span>
                      </div>
                    </div>
                    {!dbInfo?.exists && (
                      <div className="alert alert-warning mt-3 py-2">
                        <small>
                          <AlertCircle size={14} className="me-1" /> Base de datos no encontrada
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                        <HardDrive size={24} className="text-success" />
                      </div>
                      <h5 className="card-title mb-0">Espacio en Disco</h5>
                    </div>
                    {diskInfo?.available === false ? (
                      <div className="alert alert-warning">
                        <AlertCircle size={16} className="me-1" />
                        <small>No se pudo obtener información del disco</small>
                      </div>
                    ) : (
                      <>
                        <div className="ms-5">
                          <div className="mb-2">
                            <strong className="text-muted">Usado:</strong>
                            <span className="ms-2">
                              {diskInfo?.used || 'N/A'} de {diskInfo?.total || 'N/A'}
                            </span>
                            <span className="ms-2 text-muted">
                              ({diskInfo?.used_percent || '0'}%)
                            </span>
                          </div>
                          <div className="mb-3">
                            <strong className="text-muted">Libre:</strong>
                            <span className="ms-2">{diskInfo?.free || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{
                              width: `${diskInfo?.used_percent || 0}%`,
                            }}
                            aria-valuenow={diskInfo?.used_percent || 0}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <div className="text-end mt-1">
                          <small className="text-muted">{diskInfo?.used_percent || 0}% usado</small>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Crear Backup */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body text-center py-4">
                <button
                  onClick={handleCreateBackup}
                  disabled={isCreating}
                  className="btn btn-primary btn-lg px-4"
                >
                  {isCreating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creando respaldo...
                    </>
                  ) : (
                    <>Crear Nuevo Respaldo</>
                  )}
                </button>
                <p className="text-muted mt-3 mb-2">
                  El respaldo se guardará en:{' '}
                  <code className="bg-light px-2 py-1 rounded">storage/app/backups/</code>
                </p>
                {backups.length > 0 && (
                  <p className="text-success small mb-0">
                    Hay {backups.length} respaldo(s) almacenado(s)
                  </p>
                )}
              </div>
            </div>

            {/* Lista de Backups */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    Respaldos Existentes
                    <span className="badge bg-primary ms-2">{backups.length}</span>
                  </h5>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <span
                      className="spinner-border spinner-border-sm me-1 d-none"
                      id="refresh-spinner"
                    ></span>
                    Actualizar lista
                  </button>
                </div>
              </div>

              <div className="card-body p-0">
                {backups.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <Database size={48} className="mb-3 opacity-25" />
                    <h5 className="fw-light">No hay respaldos creados aún</h5>
                    <p className="text-muted small">
                      Haz clic en "Crear Nuevo Respaldo" para comenzar
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4">Archivo</th>
                          <th>Tamaño</th>
                          <th>Fecha de Creación</th>
                          <th className="text-center pe-4">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backups.map((backup, index) => (
                          <tr key={backup?.name || index} className="align-middle">
                            <td className="ps-4">
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                                  <Database size={16} className="text-primary" />
                                </div>
                                <div>
                                  <div className="fw-medium">{backup?.name || 'Sin nombre'}</div>
                                  <div className="text-muted small">
                                    <code>.sqlite</code>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {backup?.size_human || 'N/A'}
                              </span>
                            </td>
                            <td>
                              <div className="text-muted">
                                {backup?.created_at_formatted || 'N/A'}
                              </div>
                            </td>
                            <td className="text-center pe-4">
                              <div className="d-flex justify-content-center gap-2">
                                {/* Botón Descargar */}
                                <a
                                  href={backup.download_url}
                                  className="btn btn-sm btn-success d-flex align-items-center"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Descargar"
                                >
                                  <Download size={16} />
                                  <span className="ms-1 d-none d-md-inline">Descargar</span>
                                </a>

                                {/* Botón Eliminar */}
                                <button
                                  onClick={() => handleDeleteBackup(backup.name)}
                                  className="btn btn-sm btn-danger d-flex align-items-center"
                                  disabled={isDeleting === backup.name}
                                  title="Eliminar"
                                >
                                  {isDeleting === backup.name ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm me-1"
                                        role="status"
                                      ></span>
                                      <span className="d-none d-md-inline">Eliminando...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 size={16} />
                                      <span className="ms-1 d-none d-md-inline">Eliminar</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Footer de la tabla */}
              {backups.length > 0 && (
                <div className="card-footer bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted small">Mostrando {backups.length} respaldo(s)</div>
                    <div className="text-muted small">
                      Total:{' '}
                      {backups.reduce((acc, backup) => acc + (backup.size || 0), 0) /
                        (1024 * 1024) >
                      1
                        ? (
                            backups.reduce((acc, backup) => acc + (backup.size || 0), 0) /
                            (1024 * 1024)
                          ).toFixed(2) + ' MB'
                        : (
                            backups.reduce((acc, backup) => acc + (backup.size || 0), 0) / 1024
                          ).toFixed(2) + ' KB'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
