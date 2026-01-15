import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Users,
    Calendar,
    Shield,
    FileText,
    TrendingUp,
    AlertCircle,
    Clock,
    CheckCircle,
    Info,
} from "lucide-react";

export default function Dashboard({ auth, stats }) {
    // Si no vienen stats desde el backend, usar valores por defecto
    const dashboardStats = stats || {
        total: 0,
        activas: 0,
        inactivas: 0,
        asistenciaHoy: 0,
        permisosPendientes: 0,
    };

    // Calcular porcentaje de asistencia
    const asistenciaPorcentaje =
        dashboardStats.total > 0
            ? Math.round((dashboardStats.activas / dashboardStats.total) * 100)
            : 0;

    // Tarjetas de estadísticas CON DATOS REALES
    const statCards = [
        {
            title: "Personal Total",
            value: dashboardStats.total.toString(),
            change: `${dashboardStats.activas} activos, ${dashboardStats.inactivas} inactivos`,
            icon: Users,
            color: "bg-primary",
            textColor: "text-primary",
            href: "/personas",
        },
        {
            title: "Disponibles",
            value: dashboardStats.activas.toString(),
            change: `${asistenciaPorcentaje}% del total`,
            icon: Shield,
            color: "bg-success",
            textColor: "text-success",
            href: "/personas?activo=1",
        },
        {
            title: "Indisponibles",
            value: dashboardStats.inactivas.toString(),
            change: `${100 - asistenciaPorcentaje}% del total`,
            icon: Shield,
            color: "bg-warning",
            textColor: "text-warning",
            href: "/personas?activo=0",
        },
    ];

    // Actividades recientes
    const recentActivities = [
        {
            time: "Hace 5 min",
            action: "Sargento García registró asistencia",
            user: "Luis García",
            type: "success",
            icon: CheckCircle,
        },
        {
            time: "Hace 15 min",
            action: "Nueva persona agregada",
            user: "Carlos Pérez",
            type: "info",
            icon: FileText,
        },
        {
            time: "Hace 1 hora",
            action: "Permiso aprobado para Rodríguez",
            user: "Ana Rodríguez",
            type: "warning",
            icon: AlertCircle,
        },
        {
            time: "Hace 2 horas",
            action: "Reporte mensual generado",
            user: "Sistema",
            type: "info",
            icon: FileText,
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user} header="Panel de Control">
            <Head title="Dashboard" />

            <div className="container-fluid mt-4">
                {/* 🎯 Tarjetas de Estadísticas CON DATOS REALES */}
                <div className="row g-4 mb-4">
                    {statCards.map((card, index) => (
                        <div key={index} className="col-12 col-sm-6 col-lg-3">
                            <Link
                                href={card.href}
                                className="card text-decoration-none border-0 shadow-sm h-100 hover-shadow transition-all"
                                style={{ minHeight: "140px" }}
                            >
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="card-subtitle mb-2 text-muted">
                                                {card.title}
                                            </h6>
                                            <h3 className="card-title fw-bold mb-0">
                                                {card.value}
                                            </h3>
                                            <small
                                                className={`${card.textColor}`}
                                            >
                                                {card.change}
                                            </small>
                                        </div>
                                        <div
                                            className={`${card.color} p-3 rounded-circle`}
                                        >
                                            <card.icon
                                                className="text-white"
                                                size={24}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className="text-primary text-decoration-underline small">
                                            Ver detalles →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* 📊 Gráfico de Asistencia */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
                                <h5 className="card-title mb-0 fw-bold">
                                    <TrendingUp className="me-2" size={20} />
                                    Asistencia Semanal
                                </h5>
                                <Link
                                    href="/asistencias"
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    Ver detalles →
                                </Link>
                            </div>
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-center bg-light rounded-3 p-5">
                                    <div className="text-center">
                                        <TrendingUp
                                            className="text-muted mb-3"
                                            size={48}
                                        />
                                        <p className="text-muted mb-2">
                                            Gráfico de asistencia semanal
                                        </p>
                                        <small className="text-muted">
                                            (Se integrará con datos reales)
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* ⚠️ Alertas y Recordatorios */}
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 py-3">
                                <h5 className="card-title mb-0 fw-bold">
                                    <AlertCircle
                                        className="me-2 text-warning"
                                        size={20}
                                    />
                                    Alertas del Sistema
                                </h5>
                            </div>
                            <div className="card-body">
                                {dashboardStats.inactivas > 0 && (
                                    <div className="alert alert-danger d-flex align-items-start mb-3">
                                        <div className="me-3">
                                            <Shield size={20} />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="alert-heading fw-bold mb-1">
                                                Personas indisponibles
                                            </h6>
                                            <p className="mb-1 small">
                                                {dashboardStats.inactivas}{" "}
                                                personas están marcadas como
                                                indisponibles
                                            </p>
                                            <Link
                                                href="/personas?activo=0"
                                                className="alert-link text-decoration-none"
                                            >
                                                Revisar →
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <div className="alert alert-primary d-flex align-items-start mb-3">
                                    <div className="me-3">
                                        <Clock size={20} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="alert-heading fw-bold mb-1">
                                            Documentos por vencer
                                        </h6>
                                        <p className="mb-1 small">
                                            5 documentos vencen este mes
                                        </p>
                                        <Link
                                            href="/documentos"
                                            className="alert-link text-decoration-none"
                                        >
                                            Revisar →
                                        </Link>
                                    </div>
                                </div>

                                <div className="alert alert-success d-flex align-items-start">
                                    <div className="me-3">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="alert-heading fw-bold mb-1">
                                            Cumpleaños hoy
                                        </h6>
                                        <p className="mb-1 small">
                                            Sargento García cumple años hoy
                                        </p>
                                        <Link
                                            href="/personas/1"
                                            className="alert-link text-decoration-none"
                                        >
                                            Felicitar →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 📝 Actividad Reciente */}
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 py-3">
                                <h5 className="card-title mb-0 fw-bold">
                                    Actividad Reciente
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="list-group list-group-flush">
                                    {recentActivities.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="list-group-item list-group-item-action border-0 py-3 px-4"
                                        >
                                            <div className="d-flex align-items-start">
                                                <div
                                                    className={`p-2 rounded-circle me-3 ${
                                                        activity.type ===
                                                        "success"
                                                            ? "bg-success bg-opacity-10 text-success"
                                                            : activity.type ===
                                                                "warning"
                                                              ? "bg-warning bg-opacity-10 text-warning"
                                                              : "bg-info bg-opacity-10 text-info"
                                                    }`}
                                                >
                                                    <activity.icon size={18} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <p className="mb-1">
                                                        {activity.action}
                                                    </p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <small className="text-muted">
                                                            {activity.user}
                                                        </small>
                                                        <small className="text-muted">
                                                            {activity.time}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="card-footer bg-white border-0 py-3">
                                    <Link
                                        href="/actividad"
                                        className="btn btn-sm btn-outline-primary w-100"
                                    >
                                        Ver toda la actividad
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🚨 Estadísticas del sistema */}
                <div className="alert alert-info mt-4">
                    <div className="d-flex align-items-center">
                        <Info className="me-2" size={20} />
                        <div>
                            <strong>Datos reales del sistema</strong>
                            <p className="mb-0 small">
                                Las estadísticas mostradas son reales: Total de
                                personas: {dashboardStats.total}, Disponibles:{" "}
                                {dashboardStats.activas}, Indisponibles:{" "}
                                {dashboardStats.inactivas}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
