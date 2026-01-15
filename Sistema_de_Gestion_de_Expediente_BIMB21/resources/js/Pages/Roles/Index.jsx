import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ roles }) {
    return (
        <AuthenticatedLayout header="Permisos y Roles">
            <Head title="Roles" />

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Listado de Roles</h5>

                    <ul className="list-group mt-3">
                        {roles.map((role) => (
                            <li key={role.id} className="list-group-item">
                                {role.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
