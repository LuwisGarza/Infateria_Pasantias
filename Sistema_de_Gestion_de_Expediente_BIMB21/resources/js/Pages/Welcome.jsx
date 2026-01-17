import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    Zap,
    Shield,
    Cpu,
    Rocket,
    UserPlus,
    LogIn,
    Sparkles,
    CheckCircle,
    Layers,
    Code2,
    ArrowRight,
} from "lucide-react";

export default function Welcome() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Transición suave de carga
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        // Barra de progreso animada
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const features = [
        {
            icon: <Code2 size={24} />,
            title: "React Components",
            description: "Interfaz reactiva y componentes reutilizables",
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10",
        },
        {
            icon: <Layers size={24} />,
            title: "Bootstrap 5",
            description: "Diseño responsive y sistema de grid",
            color: "text-indigo-500",
            bgColor: "bg-indigo-500/10",
        },
        {
            icon: <Sparkles size={24} />,
            title: "Inertia.js",
            description: "SPA sin complejidad, full-stack simple",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
    ];

    return (
        <>
            <Head title="Bienvenido - Sistema de Gestión" />

            {/* Botones de acceso */}
            <div className="fixed top-6 right-6 z-50 flex gap-1 animate__animated animate__fadeIn">
                <Link
                    href={route("register")}
                    className="btn btn-primary w-50 py-3 fw-bold mb-0 center-block d-block mx-auto rounded-pill"
                >
                    <UserPlus size={20} />
                    Registrarse
                </Link>
                <Link
                    href={route("login")}
                    className="btn btn-primary w-50 py-3 fw-bold mb-0 center-block d-block mx-auto rounded-pill"
                >
                    <LogIn size={20} />
                    Iniciar Sesión
                </Link>
            </div>

            {/* Overlay de carga */}
            <div
                className={`fixed inset-0 z-40 bg-dark transition-all duration-500 ${
                    isLoading ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            >
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        {/* Logo animado simple */}
                        <div className="mb-5">
                            <div className="spinner-container mx-auto mb-4">
                                <div className="spinner-circle"></div>
                                <div className="spinner-circle"></div>
                                <div className="spinner-circle"></div>
                            </div>

                            <h1 className="text-white fw-bold mb-3">
                                <span className="text-primary">Sistema </span>
                                Gestor de Expedientes Digitales
                            </h1>
                            <p className="text-light opacity-75">
                                Cargando experiencia optimizada...
                            </p>
                        </div>

                        {/* Barra de progreso minimalista */}
                        <div className="w-100" style={{ maxWidth: "400px" }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-light small">
                                    Cargando
                                </span>
                                <span className="text-light small">
                                    {progress}%
                                </span>
                            </div>
                            <div
                                className="progress bg-dark bg-opacity-50"
                                style={{ height: "4px" }}
                            >
                                <div
                                    className="progress-bar bg-primary"
                                    style={{
                                        width: `${progress}%`,
                                        transition: "width 0.3s ease",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div
                className={`min-vh-100 bg-gradient-dark transition-opacity duration-500 ${
                    isLoading ? "opacity-0" : "opacity-100"
                }`}
            >
                <div className="container">
                    <div className="row align-items-center min-vh-100 py-5">
                        <div className="col-lg-6">
                            <div className="animate__animated animate__fadeInUp">
                                {/* Encabezado */}
                                <div className="mb-4">
                                    <div className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 mb-3 d-inline-flex align-items-center gap-2">
                                        <Sparkles size={16} />
                                        <span>React + Bootstrap + Inertia</span>
                                    </div>
                                    <h1 className="display-4 fw-bold text-white mb-4">
                                        Desarrollo Moderno
                                        <span className="d-block text-primary">
                                            Sin Complejidad
                                        </span>
                                    </h1>
                                    <p className="lead text-light opacity-75 mb-5">
                                        Combina la potencia de React con la
                                        simplicidad de Bootstrap y la eficiencia
                                        de Inertia.js. Crea aplicaciones web
                                        impresionantes con menos código y mejor
                                        rendimiento.
                                    </p>
                                </div>

                                {/* Características */}
                                <div className="mb-5">
                                    <div className="row g-3">
                                        {features.map((feature, index) => (
                                            <div
                                                key={index}
                                                className="col-md-4"
                                            >
                                                <div
                                                    className={`p-3 rounded-3 ${feature.bgColor} border-0`}
                                                >
                                                    <div
                                                        className={`${feature.color} mb-2`}
                                                    >
                                                        {feature.icon}
                                                    </div>
                                                    <h6 className="text-white fw-semibold mb-1">
                                                        {feature.title}
                                                    </h6>
                                                    <p className="text-light opacity-75 small mb-0">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="animate__animated animate__fadeInUp animate__delay-1s">
                                {/* Card de demostración */}
                                <div className="card border-0 bg-dark bg-opacity-50 rounded-4 shadow-lg overflow-hidden">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center gap-3 mb-4">
                                            <div className="rounded-circle bg-primary bg-opacity-20 p-2">
                                                <CheckCircle
                                                    size={24}
                                                    className="text-primary"
                                                />
                                            </div>
                                            <div>
                                                <h5 className="text-white mb-0">
                                                    Ventajas Principales
                                                </h5>
                                                <p className="text-light opacity-75 small mb-0">
                                                    Todo lo que necesitas en un
                                                    solo stack
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                {
                                                    icon: <Zap size={20} />,
                                                    title: "Rendimiento Óptimo",
                                                    description:
                                                        "Carga rápida y respuesta instantánea",
                                                },
                                                {
                                                    icon: <Shield size={20} />,
                                                    title: "Seguro por Defecto",
                                                    description:
                                                        "Autenticación integrada y protegida",
                                                },
                                                {
                                                    icon: <Cpu size={20} />,
                                                    title: "Escalable",
                                                    description:
                                                        "Crece con las necesidades de tu proyecto",
                                                },
                                                {
                                                    icon: <Rocket size={20} />,
                                                    title: "Productividad",
                                                    description:
                                                        "Desarrollo ágil y mantenimiento simple",
                                                },
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="col-6"
                                                >
                                                    <div className="p-3 bg-dark bg-opacity-25 rounded-3 h-100">
                                                        <div className="d-flex align-items-start gap-2">
                                                            <div className="text-primary mt-1">
                                                                {item.icon}
                                                            </div>
                                                            <div>
                                                                <h6 className="text-white fw-semibold mb-1">
                                                                    {item.title}
                                                                </h6>
                                                                <p className="text-light opacity-75 small mb-0">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Indicador de tecnologías */}
                                        <div className="mt-4 pt-4 border-top border-secondary">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span className="text-light opacity-75 small">
                                                    Tecnologías utilizadas:
                                                </span>
                                                <div className="d-flex gap-2">
                                                    <span className="badge bg-cyan bg-opacity-20 text-cyan">
                                                        React 18
                                                    </span>
                                                    <span className="badge bg-indigo bg-opacity-20 text-indigo">
                                                        Bootstrap 5
                                                    </span>
                                                    <span className="badge bg-purple bg-opacity-20 text-purple">
                                                        Inertia
                                                    </span>
                                                    <span className="badge bg-purple bg-opacity-20 text-purple">
                                                        Laravel
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos CSS */}
            <style>{`
                .min-vh-100 {
                    min-height: 100vh;
                }

                .bg-gradient-dark {
                    background: linear-gradient(
                        135deg,
                        #0f172a 0%,
                        #1e293b 100%
                    );
                }

                /* Spinner simple */
                .spinner-container {
                    position: relative;
                    width: 80px;
                    height: 80px;
                }

                .spinner-circle {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 2px solid transparent;
                    border-top-color: #667eea;
                    border-radius: 50%;
                    animation: spin 1.5s linear infinite;
                }

                .spinner-circle:nth-child(2) {
                    border-top-color: #764ba2;
                    animation-delay: 0.5s;
                }

                .spinner-circle:nth-child(3) {
                    border-top-color: #6b46c1;
                    animation-delay: 1s;
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                /* Transiciones y efectos */
                .hover-shadow {
                    transition: box-shadow 0.3s ease;
                }

                .hover-shadow:hover {
                    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3) !important;
                }

                .hover-bg-light:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                /* Animaciones de entrada */
                .animate__animated {
                    animation-duration: 0.8s;
                }

                .animate__delay-1s {
                    animation-delay: 0.3s;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .display-4 {
                        font-size: 2.5rem;
                    }

                    .fixed.top-6.right-6 {
                        top: 1rem;
                        right: 1rem;
                    }

                    .btn-lg {
                        padding: 0.75rem 1.5rem;
                    }

                    .spinner-container {
                        width: 60px;
                        height: 60px;
                    }
                }

                @media (max-width: 576px) {
                    .col-md-4 {
                        margin-bottom: 1rem;
                    }

                    .col-6 {
                        margin-bottom: 1rem;
                    }
                }
            `}</style>
        </>
    );
}
