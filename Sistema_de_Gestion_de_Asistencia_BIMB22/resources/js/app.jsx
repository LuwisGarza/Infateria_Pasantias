import "../css/app.css"; // Tailwind de Breeze
import "./bootstrap"; // Configuración de Laravel

// Importar Bootstrap SOLO en el cliente (no en SSR)
if (typeof window !== "undefined") {
    // CSS de Bootstrap
    import("bootstrap/dist/css/bootstrap.min.css");
    // JS de Bootstrap (con Popper incluido)
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
}

// Resto del código igual...
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
