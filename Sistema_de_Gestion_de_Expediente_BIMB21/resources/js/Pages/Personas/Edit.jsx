import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import {
    UserCog,
    User,
    Mail,
    Calendar,
    MapPin,
    Phone,
    Save,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Medal,
    ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function Edit({ auth, persona }) {
    const { data, setData, put, processing, errors } = useForm({
        nombres: persona.nombres,
        apellidos: persona.apellidos,
        cedula: persona.cedula,
        fecha_nacimiento: persona.fecha_nacimiento || "",
        direccion: persona.direccion || "",
        telefono: persona.telefono || "",
        rango_militar: persona.rango_militar || "",
        activo: persona.activo,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/personas/${persona.persona_id}`);
    };

    // Rangos militares básicos
    const rangosMilitares = [
        { value: "", label: "Seleccione un rango" },
        { value: "soldado", label: "Soldado" },
        { value: "cabo", label: "Cabo" },
        { value: "sargento", label: "Sargento" },
        { value: "sargento_primero", label: "Sargento Primero" },
        { value: "subteniente", label: "Subteniente" },
        { value: "teniente", label: "Teniente" },
        { value: "capitan", label: "Capitán" },
        { value: "mayor", label: "Mayor" },
        { value: "teniente_coronel", label: "Teniente Coronel" },
        { value: "coronel", label: "Coronel" },
        { value: "general", label: "General" },
        { value: "otro", label: "Otro" },
    ];

    // Estado para el rango personalizado
    const [otroRango, setOtroRango] = useState(
        persona.rango_militar &&
            !rangosMilitares.some((r) => r.value === persona.rango_militar)
            ? persona.rango_militar
            : ""
    );

    // Verificar si el rango actual es uno de los predefinidos
    const esRangoPredefinido =
        persona.rango_militar &&
        rangosMilitares.some(
            (r) => r.value === persona.rango_militar && r.value !== ""
        );

    const handleRangoChange = (e) => {
        const value = e.target.value;
        setData("rango_militar", value);

        // Si selecciona "otro" y ya teníamos un rango personalizado, mantenerlo
        if (value !== "otro") {
            setOtroRango("");
        } else if (otroRango) {
            // Si ya tenía un rango personalizado, mantenerlo
            setData("rango_militar", otroRango);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserCog className="w-6 h-6 text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold">
                                Editar Persona
                            </h2>
                            <p className="text-sm text-gray-600">
                                Editando: {persona.nombres} {persona.apellidos}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/personas"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al listado
                    </Link>
                </div>
            }
        >
            <Head title="Editar Persona" />

            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="mb-6 flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-medium">
                            Información Personal
                        </h3>
                    </div>
                    <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                            persona.activo
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {persona.activo ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Activo
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4" />
                                Inactivo
                            </>
                        )}
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <InputLabel
                                    value="Nombres"
                                    className="text-gray-700"
                                />
                            </div>
                            <TextInput
                                value={data.nombres}
                                onChange={(e) =>
                                    setData("nombres", e.target.value)
                                }
                                className="mt-1 block w-full pl-10"
                            />
                            <InputError message={errors.nombres} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <InputLabel
                                    value="Apellidos"
                                    className="text-gray-700"
                                />
                            </div>
                            <TextInput
                                value={data.apellidos}
                                onChange={(e) =>
                                    setData("apellidos", e.target.value)
                                }
                                className="mt-1 block w-full pl-10"
                            />
                            <InputError message={errors.apellidos} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <InputLabel
                                    value="Cédula"
                                    className="text-gray-700"
                                />
                            </div>
                            <TextInput
                                value={data.cedula}
                                onChange={(e) =>
                                    setData("cedula", e.target.value)
                                }
                                className="mt-1 block w-full pl-10"
                            />
                            <InputError message={errors.cedula} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <InputLabel
                                    value="Fecha de Nacimiento"
                                    className="text-gray-700"
                                />
                            </div>
                            <TextInput
                                type="date"
                                value={data.fecha_nacimiento}
                                onChange={(e) =>
                                    setData("fecha_nacimiento", e.target.value)
                                }
                                className="mt-1 block w-full pl-10"
                            />
                            <InputError message={errors.fecha_nacimiento} />
                        </div>

                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <InputLabel
                                    value="Dirección"
                                    className="text-gray-700"
                                />
                            </div>
                            <TextInput
                                value={data.direccion}
                                onChange={(e) =>
                                    setData("direccion", e.target.value)
                                }
                                className="mt-1 block w-full pl-10"
                            />
                            <InputError message={errors.direccion} />
                        </div>

                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <InputLabel
                                    value="Teléfono"
                                    className="text-gray-700"
                                />
                            </div>
                            <TextInput
                                value={data.telefono}
                                onChange={(e) =>
                                    setData("telefono", e.target.value)
                                }
                                className="mt-1 block w-full pl-10"
                            />
                            <InputError message={errors.telefono} />
                        </div>

                        {/* Campo de Rango Militar - AGREGADO AQUÍ */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Medal className="w-4 h-4 text-yellow-600" />
                                <InputLabel
                                    value="Rango Militar"
                                    className="text-gray-700"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={
                                        esRangoPredefinido
                                            ? data.rango_militar
                                            : "otro"
                                    }
                                    onChange={handleRangoChange}
                                    className="mt-1 block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    <option value="">
                                        Seleccione un rango militar
                                    </option>
                                    <optgroup label="Tropa">
                                        <option value="soldado">Soldado</option>
                                        <option value="cabo">Cabo</option>
                                        <option value="cabo_primero">
                                            Cabo Primero
                                        </option>
                                        <option value="cabo_mayor">
                                            Cabo Mayor
                                        </option>
                                    </optgroup>
                                    <optgroup label="Suboficiales">
                                        <option value="sargento">
                                            Sargento
                                        </option>
                                        <option value="sargento_primero">
                                            Sargento Primero
                                        </option>
                                        <option value="sargento_mayor">
                                            Sargento Mayor
                                        </option>
                                        <option value="suboficial_mayor">
                                            Suboficial Mayor
                                        </option>
                                    </optgroup>
                                    <optgroup label="Oficiales">
                                        <option value="subteniente">
                                            Subteniente
                                        </option>
                                        <option value="teniente">
                                            Teniente
                                        </option>
                                        <option value="capitan">Capitán</option>
                                        <option value="mayor">Mayor</option>
                                        <option value="teniente_coronel">
                                            Teniente Coronel
                                        </option>
                                        <option value="coronel">Coronel</option>
                                    </optgroup>
                                    <optgroup label="Generales">
                                        <option value="brigadier_general">
                                            Brigadier General
                                        </option>
                                        <option value="general_de_brigada">
                                            General de Brigada
                                        </option>
                                        <option value="general_de_division">
                                            General de División
                                        </option>
                                        <option value="general_en_jefe">
                                            General en Jefe
                                        </option>
                                    </optgroup>
                                    <option value="otro">
                                        Otro (especifique)
                                    </option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                            <InputError message={errors.rango_militar} />

                            {/* Campo para especificar otro rango */}
                            {(data.rango_militar === "otro" ||
                                (!esRangoPredefinido &&
                                    data.rango_militar)) && (
                                <div className="mt-3">
                                    <InputLabel
                                        value="Especifique el rango"
                                        className="text-gray-700"
                                    />
                                    <div className="flex gap-2">
                                        <TextInput
                                            value={
                                                otroRango || data.rango_militar
                                            }
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                setOtroRango(valor);
                                                setData("rango_militar", valor);
                                            }}
                                            className="mt-1 block w-full"
                                            placeholder="Ingrese el rango militar"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData("rango_militar", "");
                                                setOtroRango("");
                                            }}
                                            className="mt-1 px-3 py-2 text-sm text-red-600 hover:text-red-800"
                                        >
                                            Limpiar
                                        </button>
                                    </div>
                                </div>
                            )}

                            <p className="mt-2 text-xs text-gray-500">
                                Seleccione el rango militar correspondiente
                                según la jerarquía
                            </p>
                        </div>
                    </div>

                    {/* Resumen de información militar */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Medal className="w-4 h-4" />
                            Información Militar Actual
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="font-medium">
                                    Rango actual:
                                </span>
                                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                    {data.rango_militar || "No asignado"}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">Estado:</span>
                                <span
                                    className={`ml-2 px-2 py-1 text-xs rounded ${
                                        persona.activo
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {persona.activo ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                                ID: {persona.persona_id}
                            </div>
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="text-gray-600 hover:text-gray-800 flex items-center gap-2 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Cancelar
                            </button>
                        </div>
                        <PrimaryButton
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {processing
                                ? "Actualizando..."
                                : "Actualizar Persona"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
