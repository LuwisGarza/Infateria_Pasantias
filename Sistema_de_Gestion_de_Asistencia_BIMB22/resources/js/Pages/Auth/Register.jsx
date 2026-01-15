import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    User,
    UserCircle,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    UserPlus,
} from "lucide-react";

const regex = {
    name: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{4,}$/,
    username: /^[a-zA-Z]{4,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [clientErrors, setClientErrors] = useState({
        name: null,
        username: null,
        password: null,
    });

    /* =========================
       VALIDACIÓN POR CAMPO
    ========================= */
    const validateField = (field, value) => {
        let error = null;

        if (value.trim() === "") {
            error = "Este campo no se va a llenar solito ";
        } else if (!regex[field].test(value)) {
            if (field === "name")
                error = "Mínimo 4 letras. Solo se permiten letras";
            if (field === "username")
                error = "Mínimo 4 letras. Sin números ni espacios";
            if (field === "password")
                error =
                    "Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo";
        }

        setClientErrors((prev) => ({
            ...prev,
            [field]: error,
        }));
    };

    /* =========================
       SUBMIT
    ========================= */
    const submit = (e) => {
        e.preventDefault();

        validateField("name", data.name);
        validateField("username", data.username);
        validateField("password", data.password);

        if (clientErrors.name || clientErrors.username || clientErrors.password)
            return;

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registro de Usuario" />

            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
                        <div className="card-header bg-black bg-gradient text-white py-4 d-flex flex-column align-items-center justify-content-center">
                            <UserPlus size={40} className="mb-3" />
                            <h2 className="h3 fw-bold">Crear Cuenta</h2>
                        </div>

                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={submit}>
                                {/* NOMBRE */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        Nombre Completo
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <User size={18} />
                                        </span>
                                        <input
                                            className={`form-control ${
                                                clientErrors.name || errors.name
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={data.name}
                                            onChange={(e) => {
                                                setData("name", e.target.value);
                                                validateField(
                                                    "name",
                                                    e.target.value,
                                                );
                                            }}
                                            placeholder="Ejemplo: Luis Angel"
                                        />
                                    </div>
                                    {(clientErrors.name || errors.name) && (
                                        <div className="invalid-feedback d-block">
                                            {clientErrors.name || errors.name}
                                        </div>
                                    )}
                                </div>
                                {/* USUARIO */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        Nombre de Usuario
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <UserCircle size={18} />
                                        </span>
                                        <input
                                            className={`form-control ${
                                                clientErrors.username ||
                                                errors.username
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={data.username}
                                            onChange={(e) => {
                                                setData(
                                                    "username",
                                                    e.target.value,
                                                );
                                                validateField(
                                                    "username",
                                                    e.target.value,
                                                );
                                            }}
                                            placeholder="Ejemplo: luisangel"
                                        />
                                    </div>
                                    {(clientErrors.username ||
                                        errors.username) && (
                                        <div className="invalid-feedback d-block">
                                            {clientErrors.username ||
                                                errors.username}
                                        </div>
                                    )}
                                </div>
                                {/* EMAIL */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        Correo Electrónico
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <Mail size={18} />
                                        </span>
                                        <input
                                            type="email"
                                            className={`form-control ${
                                                errors.email ? "is-invalid" : ""
                                            }`}
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="ejemplo@email.com"
                                        />
                                    </div>
                                </div>
                                {/* PASSWORD */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        Contraseña
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <Lock size={18} />
                                        </span>
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className={`form-control ${
                                                clientErrors.password ||
                                                errors.password
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={data.password}
                                            onChange={(e) => {
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                );
                                                validateField(
                                                    "password",
                                                    e.target.value,
                                                );
                                            }}
                                            placeholder="Ingresa tu contraseña"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="input-group-text bg-light"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                    {(clientErrors.password ||
                                        errors.password) && (
                                        <div className="invalid-feedback d-block">
                                            {clientErrors.password ||
                                                errors.password}
                                        </div>
                                    )}
                                </div>
                                {/* CONFIRMAR CONTRASEÑA */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        Confirmar Contraseña
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <Lock size={18} />
                                        </span>
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className={`form-control ${
                                                data.password_confirmation &&
                                                data.password !==
                                                    data.password_confirmation
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Repite tu contraseña"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="input-group-text bg-light"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            title={
                                                showConfirmPassword
                                                    ? "Ocultar contraseña"
                                                    : "Mostrar contraseña"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {data.password_confirmation &&
                                        data.password !==
                                            data.password_confirmation && (
                                            <div className="invalid-feedback d-block">
                                                Las contraseñas no coinciden
                                            </div>
                                        )}
                                </div>
                                {/* REQUISITOS */}
                                <div className="alert alert-light border mb-4">
                                    <strong>La contraseña debe incluir:</strong>
                                    <ul className="mb-0 small">
                                        <li>8 caracteres mínimo</li>
                                        <li>Mayúscula y minúscula</li>
                                        <li>Un número</li>
                                        <li>Un símbolo</li>
                                    </ul>
                                </div>
                                {/* boton de registro */}{" "}
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
                                            Cargando...
                                        </>
                                    ) : (
                                        "Registrarse"
                                    )}
                                </button>
                                <div className="text-center mt-4">
                                    <Link href={route("login")}>
                                        ¿Ya tienes cuenta? Inicia sesión
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* ESTILOS Y ANIMACIONES */}
            <style>{`
                .card {
                    transition:
                        transform 0.6s ease,
                        box-shadow 0.6s ease;
                }
                .card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
                }
                .btn-primary {
                    background: linear-gradient(135deg, #6c7985, #212529);
                    border: none;
                    transition: all 0.3s ease;
                }
                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
                }
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
