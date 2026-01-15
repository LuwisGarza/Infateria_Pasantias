import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { Download, FileText } from "lucide-react";
export default function GuestLayout({ children }) {
    return (
        <div className="min-vh-100 d-flex flex-column bg-light">
            {/* Navbar simple */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">
                    <Link
                        href="/"
                        className="navbar-brand d-flex align-items-center"
                    >
                        <ApplicationLogo
                            className="me-2"
                            style={{ height: "32px" }}
                        />
                        <span className="fw-bold">Gestión de Personal</span>
                    </Link>
                    <div className="navbar-nav">
                        <Link href="/login" className="nav-link active">
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="flex-grow-1 d-flex align-items-center py-5">
                <div className="container">{children}</div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-top py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <p className="mb-0 text-muted small">
                                &copy; {new Date().getFullYear()} Sistema de
                                Gestión, Todos los derechos reservados.
                            </p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <Link
                                href="/Manual/Manual.pdf"
                                download
                                className="text-muted small me-3 text-decoration-none"
                            >
                                Manual de Usuario
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Estilos adicionales */}
            <style>{`
                .min-vh-100 {
                    min-height: 100vh;
                }

                .bg-light {
                    background-color: #f8f9fa !important;
                }

                main {
                    background: linear-gradient(
                        135deg,
                        #f8f9fa 0%,
                        #e9ecef 100%
                    );
                }
            `}</style>
        </div>
    );
}
