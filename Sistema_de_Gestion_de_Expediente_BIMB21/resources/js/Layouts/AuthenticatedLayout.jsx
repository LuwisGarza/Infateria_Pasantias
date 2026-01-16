import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    Home,
    Users,
    Shield,
    Calendar,
    FileText,
    Settings,
    BarChart3,
    Bell,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    CheckCircle,
    XCircle,
    HardDrive,
} from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const { auth, url } = usePage().props; // ✅ Obtener URL actual
    const user = auth.user;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // Detectar ruta actual al cargar y cuando cambie la URL
    useEffect(() => {
        const currentPath = window.location.pathname;

        // Mapeo de rutas a IDs del menú
        const routeToMenuId = {
            "/dashboard": "dashboard",
            "/personas": "personas",
            "/asistencias": "asistencias",
            "/jerarquias": "jerarquias",
            "/permisos": "permisos",
            "/reportes": "reportes",
            "/backups": "backups",
            // Agrega más rutas según necesites
        };

        // Encontrar el ID del menú basado en la ruta actual
        const matchedRoute = Object.keys(routeToMenuId).find((route) =>
            currentPath.startsWith(route),
        );

        if (matchedRoute) {
            setActiveMenu(routeToMenuId[matchedRoute]);
        } else {
            // Si no coincide, usar la ruta base
            const basePath = currentPath.split("/")[1];
            if (basePath) {
                setActiveMenu(basePath);
            }
        }
    }, [url]); // ✅ Se ejecuta cuando cambia la URL

    // Menú de navegación - actualizado con rutas exactas
    const menuItems = [
        {
            id: "dashboard",
            label: "Información General",
            icon: Home,
            href: "/dashboard",
            exact: true,
        },
        {
            id: "personas",
            label: "Personal",
            icon: Users,
            href: "/personas",
        },
        {
            id: "asistencias",
            label: "Asistencias",
            icon: Calendar,
            href: "/asistencias",
        },
        {
            id: "jerarquias",
            label: "Jerarquías",
            icon: Shield,
            href: "/jerarquias",
        },
        {
            id: "permisos",
            label: "Permisos",
            icon: FileText,
            href: "/permisos",
        },
        {
            id: "reportes",
            label: "Reportes",
            icon: BarChart3,
            href: "/reportes",
        },
        {
            id: "backups",
            label: "Mantenimiento",
            icon: HardDrive,
            href: "/backups",
        },
    ];

    // Función para verificar si un ítem está activo
    const isActive = (item) => {
        return activeMenu === item.id;
    };

    // Cerrar dropdown al hacer clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showUserDropdown &&
                !event.target.closest(".user-dropdown-container")
            ) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showUserDropdown]);

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* SIDEBAR */}
            <div
                className={`
                fixed-top start-0 h-100 z-50
                bg-dark text-white
                transition-all duration-300
                ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}
                d-flex flex-column
            `}
                style={{
                    width: sidebarCollapsed ? "80px" : "256px",
                    transition: "width 0.3s ease-in-out",
                }}
            >
                {/* Logo y Botón Colapsar */}
                <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary">
                    {!sidebarCollapsed && (
                        <Link
                            href="/"
                            className="d-flex align-items-center text-decoration-none text-white"
                        >
                            <ApplicationLogo
                                className="me-2"
                                style={{ height: "32px" }}
                            />
                            <span className="fs-5 fw-bold">
                                Disponibles e Indisponibles
                            </span>
                        </Link>
                    )}
                    {sidebarCollapsed && (
                        <Link
                            href="/"
                            className="d-flex justify-content-center w-100"
                        >
                            <ApplicationLogo
                                className="text-white"
                                style={{ height: "32px" }}
                            />
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="btn btn-sm btn-outline-light border-0"
                        aria-label={
                            sidebarCollapsed ? "Expandir menú" : "Colapsar menú"
                        }
                    >
                        {sidebarCollapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Menú de Navegación */}
                <nav className="flex-grow-1 overflow-auto py-3">
                    <ul className="nav flex-column px-2 gap-1">
                        {menuItems.map((item) => (
                            <li key={item.id} className="nav-item">
                                <Link
                                    href={item.href}
                                    onClick={() => setActiveMenu(item.id)}
                                    className={`
                                        nav-link d-flex align-items-center rounded-2
                                        text-white text-decoration-none py-3 px-3
                                        ${isActive(item) ? "bg-primary" : "hover-bg-gray-800"}
                                        transition-colors
                                    `}
                                    style={{
                                        backgroundColor: isActive(item)
                                            ? "#0d6efd"
                                            : "transparent",
                                        minHeight: "48px",
                                    }}
                                >
                                    <item.icon
                                        className="flex-shrink-0"
                                        size={20}
                                    />
                                    {!sidebarCollapsed && (
                                        <span className="ms-3 flex-grow-1">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="px-3 py-4">
                        <hr className="border-secondary my-0" />
                    </div>
                </nav>

                {/* Perfil de Usuario con Dropdown */}
                <div className="border-top border-secondary p-3 user-dropdown-container">
                    <div className="d-flex align-items-center position-relative">
                        <div
                            className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                        >
                            <User className="text-white" size={20} />
                        </div>
                        {!sidebarCollapsed && (
                            <>
                                <div className="flex-grow-1 ms-3 min-w-0">
                                    <p className="mb-0 fw-medium text-truncate">
                                        {user.name}
                                    </p>
                                    <p className="mb-0 small text-muted text-truncate">
                                        {user.email}
                                    </p>
                                </div>
                                {/* Botón dropdown para mostrar/ocultar menú */}
                                <button
                                    className="btn btn-link text-light p-0"
                                    type="button"
                                    onClick={() =>
                                        setShowUserDropdown(!showUserDropdown)
                                    }
                                    aria-expanded={showUserDropdown}
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserDropdown && (
                                    <div
                                        className="position-absolute end-0 bottom-100 mb-2 bg-white rounded shadow-lg"
                                        style={{
                                            minWidth: "200px",
                                            zIndex: 1000,
                                        }}
                                    >
                                        <div className="p-2">
                                            <Link
                                                className="dropdown-item d-flex align-items-center text-dark text-decoration-none py-2 px-3 rounded"
                                                href={route("profile.edit")}
                                                onClick={() =>
                                                    setShowUserDropdown(false)
                                                }
                                            >
                                                <User
                                                    className="me-2"
                                                    size={16}
                                                />
                                                Editar Perfil
                                            </Link>
                                            <hr className="my-2" />
                                            <Link
                                                className="dropdown-item d-flex align-items-center text-danger text-decoration-none py-2 px-3 rounded"
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                onClick={() =>
                                                    setShowUserDropdown(false)
                                                }
                                            >
                                                <LogOut
                                                    className="me-2"
                                                    size={16}
                                                />
                                                Cerrar Sesión
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido Principal */}
            <div
                className="flex-grow-1 transition-all duration-300"
                style={{
                    marginLeft: sidebarCollapsed ? "80px" : "256px",
                    transition: "margin-left 0.3s ease-in-out",
                }}
            >
                {header && (
                    <header className="bg-white shadow-sm border-bottom">
                        <div className="container-fluid py-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h1 className="h3 mb-0 fw-bold text-dark">
                                        {header}
                                    </h1>
                                    <p className="text-muted small mb-0 mt-1">
                                        {new Date().toLocaleDateString(
                                            "es-ES",
                                            {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            },
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>
                )}

                <main className="container-fluid py-4">{children}</main>
            </div>
        </div>
    );
}
