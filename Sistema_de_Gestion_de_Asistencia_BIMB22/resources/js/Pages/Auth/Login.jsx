import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    Eye,
    EyeOff,
    Lock,
    User,
    Flame,
    Zap,
    Atom,
    KeyRound,
    ArrowRight,
} from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    {/* Card de Login */}
                    <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
                        {/* Header con fondo */}
                        <div className="card-header bg-black bg-gradient text-white py-4">
                            <div className="text-center">
                                <div className="d-flex flex-column align-items-center">
                                    <KeyRound className="mb-3" size={40} />
                                </div>
                                <h2 className="h3 mb-2 fw-bold">
                                    Inicio de Sesión
                                </h2>
                            </div>
                        </div>

                        <div className="card-body p-4 p-md-5">
                            {/* Mensaje de estado */}
                            {status && (
                                <div
                                    className="alert alert-success alert-dismissible fade show mb-4"
                                    role="alert"
                                >
                                    {status}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="alert"
                                        aria-label="Close"
                                    ></button>
                                </div>
                            )}

                            <form onSubmit={submit}>
                                {/* Campo Usuario */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="username"
                                        className="form-label fw-medium"
                                    >
                                        Nombre de Usuario
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <User
                                                size={20}
                                                className="text-muted"
                                            />
                                        </span>
                                        <input
                                            id="username"
                                            type="text"
                                            name="username"
                                            value={data.username}
                                            className={`form-control ${
                                                errors.username
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            autoComplete="username"
                                            autoFocus={true}
                                            onChange={(e) =>
                                                setData(
                                                    "username",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ingresa tu usuario"
                                        />
                                    </div>
                                    {errors.username && (
                                        <div className="invalid-feedback d-block mt-1">
                                            {errors.username}
                                        </div>
                                    )}
                                </div>

                                {/* Campo Contraseña */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="password"
                                        className="form-label fw-medium"
                                    >
                                        Contraseña
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <Lock
                                                size={20}
                                                className="text-muted"
                                            />
                                        </span>
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={data.password}
                                            className={`form-control ${
                                                errors.password
                                                    ? "is-invalid"
                                                    : ""
                                            } border-start-1`}
                                            autoComplete="current-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ingresa tu contraseña"
                                        />
                                        <button
                                            type="button"
                                            className="input-group-text bg-light border-start-0"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            title={
                                                showPassword
                                                    ? "Ocultar contraseña"
                                                    : "Mostrar contraseña"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    size={20}
                                                    className="text-muted"
                                                />
                                            ) : (
                                                <Eye
                                                    size={20}
                                                    className="text-muted"
                                                />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div className="invalid-feedback d-block mt-1">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                {/* Recordarme y Olvidé contraseña */}
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                            className="form-check-input"
                                        />
                                        <label
                                            htmlFor="remember"
                                            className="form-check-label small"
                                        >
                                            Recordarme
                                        </label>
                                    </div>
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-decoration-none small text-primary"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    )}
                                </div>

                                {/* Botón de Iniciar Sesión */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-50 py-3 fw-bold mb-0 center-block d-block mx-auto rounded-pill"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Iniciando sesión...
                                        </>
                                    ) : (
                                        "Iniciar Sesión"
                                    )}
                                </button>

                                {/* Enlace a Registro */}
                                <div className="text-center mt-4 pt-3 border-top">
                                    <p className="text-muted mb-2">
                                        ¿Primera vez aquí?
                                    </p>
                                    <Link
                                        href={route("register")}
                                        className="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                                    >
                                        Crear cuenta
                                        <ArrowRight
                                            className="ms-2"
                                            size={16}
                                        />
                                    </Link>
                                </div>

                                {/* Mensaje de bienvenida */}
                                <div className="text-center mt-4 pt-3 border-top ">
                                    <p className="text-muted small mb-0">
                                        Bienvenido al sistema de gestión de
                                        asistencias
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="text-center mt-4">
                        <p className="text-muted small mb-3">
                            Sistema desarrollado con:
                        </p>

                        {/* Iconos de tecnologías */}
                        <div className="d-flex justify-content-center align-items-center gap-4 mt-2">
                            {/* Laravel */}
                            <a
                                href="https://laravel.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                                title="Laravel Framework"
                            >
                                <div className="d-flex flex-column align-items-center">
                                    <Flame size={24} className="text-danger" />
                                    <span className="text-muted mt-1 small">
                                        Laravel
                                    </span>
                                </div>
                            </a>

                            {/* Inertia.js */}
                            <a
                                href="https://inertiajs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                                title="Inertia.js"
                            >
                                <div className="d-flex flex-column align-items-center">
                                    <Zap size={24} className="text-warning" />
                                    <span className="text-muted mt-1 small">
                                        Inertia
                                    </span>
                                </div>
                            </a>

                            {/* React */}
                            <a
                                href="https://reactjs.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                                title="React"
                            >
                                <div className="d-flex flex-column align-items-center">
                                    <Atom size={24} className="text-info" />
                                    <span className="text-muted mt-1 small">
                                        React
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Estilos adicionales */}
            <style>{`
                .card {
                    transition: transform 0.6s ease;
                    animation: fadeInUp 0.8s ease-out;
                }

                .card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
                }

                .card-header {
                    background: linear-gradient(
                        135deg,
                        #000000 0%,
                        #333333 100%
                    );
                }

                .input-group-text {
                    transition: all 0.3s ease;
                    background-color: #f8f9fa !important;
                }

                .form-control {
                    transition: all 0.3s ease;
                    border-color: #dee2e6;
                }

                .form-control:focus {
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                    border-color: #86b7fe;
                    transform: translateY(-1px);
                }

                .form-control.is-invalid:focus {
                    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
                }

                .btn-primary {
                    background: linear-gradient(
                        135deg,
                        #798694 0%,
                        #212529 100%
                    );
                    border: none;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .btn-primary:hover:not(:disabled) {
                    background: linear-gradient(
                        155deg,
                        #0b5ed7 0%,
                        #0a58ca 100%
                    );
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
                }

                .btn-primary:disabled {
                    opacity: 0.65;
                    transform: none !important;
                }

                .btn-outline-primary {
                    transition: all 0.3s ease;
                }

                .btn-outline-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(13, 110, 253, 0.2);
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </GuestLayout>
    );
}
