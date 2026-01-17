import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import {
  UserPlus,
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Save,
  ArrowLeft,
  Medal,
  ChevronDown,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Create({ auth }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    nombres: '',
    apellidos: '',
    cedula: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    rango_militar: '',
  });

  // Formatos de ayuda para el usuario
  const formatosEjemplo = {
    cedula: 'V-12345678 o 12345678 (7-9 dígitos)',
    telefono: '0414-1234567, 0241-7654321',
    fecha: 'DD/MM/AAAA (ej: 15/07/1990)',
  };

  // Estado para mostrar ayuda
  const [showAyudaCedula, setShowAyudaCedula] = useState(false);
  const [showAyudaTelefono, setShowAyudaTelefono] = useState(false);
  const [showAyudaFecha, setShowAyudaFecha] = useState(false);

  // Función para formatear cédula automáticamente
  const formatCedula = value => {
    // Remover todo excepto letras V/E y números
    let cleaned = value.toUpperCase().replace(/[^VE0-9]/g, '');

    // Si empieza con V o E, mantenerla
    if (cleaned.startsWith('V') || cleaned.startsWith('E')) {
      // Formato: V-12345678
      const letra = cleaned.charAt(0);
      const numeros = cleaned.substring(1).replace(/\D/g, '').substring(0, 9);
      if (numeros) {
        return `${letra}-${numeros}`;
      }
      return letra;
    } else {
      // Solo números, limitar a 9 dígitos
      const numeros = cleaned.replace(/\D/g, '').substring(0, 9);
      return numeros;
    }
  };

  // Función para formatear teléfono automáticamente
  const formatTelefono = value => {
    // Remover todo excepto números y +
    let cleaned = value.replace(/[^\d+]/g, '');

    // Si empieza con +58, mantener formato internacional
    if (cleaned.startsWith('+58')) {
      const codigoPais = cleaned.substring(0, 3);
      const resto = cleaned.substring(3).replace(/\D/g, '');
      if (resto.length >= 4) {
        const codigoArea = resto.substring(0, 4);
        const numero = resto.substring(4, 11);
        if (numero) {
          return `${codigoPais}-${codigoArea}-${numero}`;
        }
        return `${codigoPais}-${codigoArea}`;
      }
      return codigoPais;
    } else {
      // Formato local: 0414-1234567
      const numeros = cleaned.replace(/\D/g, '');
      if (numeros.length >= 4) {
        const codigoArea = numeros.substring(0, 4);
        const numero = numeros.substring(4, 11);
        if (numero) {
          return `${codigoArea}-${numero}`;
        }
        return codigoArea;
      }
      return numeros;
    }
  };

  // Función para formatear fecha automáticamente
  const formatFecha = value => {
    // Remover todo excepto números y /
    let cleaned = value.replace(/[^\d/]/g, '');

    // Auto-insertar barras
    if (cleaned.length === 2 && !cleaned.includes('/')) {
      return cleaned + '/';
    }
    if (cleaned.length === 5 && cleaned.charAt(2) === '/' && cleaned.charAt(5) !== '/') {
      return cleaned + '/';
    }

    // Limitar a DD/MM/AAAA (10 caracteres)
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }

    return cleaned;
  };

  // Handlers para los campos con formato automático
  const handleCedulaChange = e => {
    const formatted = formatCedula(e.target.value);
    setData('cedula', formatted);
  };

  const handleTelefonoChange = e => {
    const formatted = formatTelefono(e.target.value);
    setData('telefono', formatted);
  };

  const handleFechaChange = e => {
    const formatted = formatFecha(e.target.value);
    setData('fecha_nacimiento', formatted);
  };

  // Validar fecha antes de enviar
  const validateFecha = fecha => {
    if (!fecha) return false;
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(fecha)) return false;

    const [dia, mes, ano] = fecha.split('/').map(Number);
    const fechaObj = new Date(ano, mes - 1, dia);
    return (
      fechaObj.getDate() === dia &&
      fechaObj.getMonth() === mes - 1 &&
      fechaObj.getFullYear() === ano
    );
  };

  const submit = e => {
    e.preventDefault();

    // Validar fecha antes de enviar
    if (!validateFecha(data.fecha_nacimiento)) {
      alert('La fecha de nacimiento no es válida. Use el formato DD/MM/AAAA');
      return;
    }

    post('/personas');
  };

  // Rangos militares venezolanos más específicos
  const rangosPorCategoria = [
    {
      categoria: 'Tropa',
      rangos: [
        { value: 'soldado_raso', label: 'Soldado Raso' },
        { value: 'soldado', label: 'Soldado' },
        { value: 'cabo', label: 'Cabo' },
        { value: 'cabo_primero', label: 'Cabo Primero' },
        { value: 'cabo_mayor', label: 'Cabo Mayor' },
      ],
    },
    {
      categoria: 'Suboficiales',
      rangos: [
        { value: 'sargento', label: 'Sargento' },
        { value: 'sargento_primero', label: 'Sargento Primero' },
        { value: 'sargento_mayor', label: 'Sargento Mayor' },
        { value: 'suboficial_mayor', label: 'Suboficial Mayor' },
      ],
    },
    {
      categoria: 'Oficiales',
      rangos: [
        { value: 'alferez', label: 'Alférez' },
        { value: 'subteniente', label: 'Subteniente' },
        { value: 'teniente', label: 'Teniente' },
        { value: 'capitan', label: 'Capitán' },
        { value: 'mayor', label: 'Mayor' },
        { value: 'teniente_coronel', label: 'Teniente Coronel' },
        { value: 'coronel', label: 'Coronel' },
      ],
    },
    {
      categoria: 'Generales',
      rangos: [
        { value: 'general_de_brigada', label: 'General de Brigada' },
        { value: 'general_de_division', label: 'General de División' },
        { value: 'mayor_general', label: 'Mayor General' },
        { value: 'general_en_jefe', label: 'General en Jefe' },
      ],
    },
    {
      categoria: 'Otros',
      rangos: [
        { value: 'cadete', label: 'Cadete' },
        { value: 'reserva', label: 'Reserva' },
        { value: 'retirado', label: 'Retirado' },
        { value: 'civil', label: 'Personal Civil' },
      ],
    },
  ];

  // Calcular edad aproximada para mostrar ayuda
  const calcularEdad = fecha => {
    if (!validateFecha(fecha)) return null;
    const [dia, mes, ano] = fecha.split('/').map(Number);
    const hoy = new Date();
    const fechaNac = new Date(ano, mes - 1, dia);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNac.getMonth();
    if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Crear Nueva Persona</h2>
          </div>
          <Link
            href="/personas"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </Link>
        </div>
      }
    >
      <Head title="Agregar Personal" />

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 flex items-center gap-3 pb-4 border-b">
          <User className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium">Información Personal</h3>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombres */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <InputLabel value="Nombres" className="text-gray-700" />
                <span className="text-red-500">*</span>
              </div>
              <TextInput
                value={data.nombres}
                onChange={e => setData('nombres', e.target.value)}
                className="mt-1 block w-full"
                placeholder="Ej: Juan Carlos"
                required
              />
              <InputError message={errors.nombres} />
            </div>

            {/* Apellidos */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <InputLabel value="Apellidos" className="text-gray-700" />
                <span className="text-red-500">*</span>
              </div>
              <TextInput
                value={data.apellidos}
                onChange={e => setData('apellidos', e.target.value)}
                className="mt-1 block w-full"
                placeholder="Ej: Pérez Rodríguez"
                required
              />
              <InputError message={errors.apellidos} />
            </div>

            {/* Cédula */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <InputLabel value="Cédula" className="text-gray-700" />
                  <span className="text-red-500">*</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAyudaCedula(!showAyudaCedula)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <TextInput
                value={data.cedula}
                onChange={handleCedulaChange}
                className="mt-1 block w-full"
                placeholder={formatosEjemplo.cedula}
                required
              />
              {showAyudaCedula && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  <strong>Formatos aceptados:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>
                      <code>V-12345678</code> (Venezolano nacido en Venezuela)
                    </li>
                    <li>
                      <code>E-87654321</code> (Venezolano naturalizado)
                    </li>
                    <li>
                      <code>12345678</code> (Solo números, 7-9 dígitos)
                    </li>
                  </ul>
                </div>
              )}
              <InputError message={errors.cedula} />
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <InputLabel value="Fecha de Nacimiento" className="text-gray-700" />
                  <span className="text-red-500">*</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAyudaFecha(!showAyudaFecha)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <TextInput
                value={data.fecha_nacimiento}
                onChange={handleFechaChange}
                className="mt-1 block w-full"
                placeholder={formatosEjemplo.fecha}
                required
              />
              {showAyudaFecha && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  <div>
                    <strong>Formato:</strong> Día/Mes/Año (ej: 15/07/1990)
                  </div>
                  {data.fecha_nacimiento && validateFecha(data.fecha_nacimiento) && (
                    <div className="mt-1">
                      <strong>Edad aproximada:</strong> {calcularEdad(data.fecha_nacimiento)} años
                    </div>
                  )}
                </div>
              )}
              <InputError message={errors.fecha_nacimiento} />
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <InputLabel value="Dirección" className="text-gray-700" />
              </div>
              <TextInput
                value={data.direccion}
                onChange={e => setData('direccion', e.target.value)}
                className="mt-1 block w-full"
                placeholder="Ej: Av. Principal, Edificio Centro, Piso 5, Caracas"
              />
              <InputError message={errors.direccion} />
            </div>

            {/* Teléfono */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <InputLabel value="Teléfono" className="text-gray-700" />
                  <span className="text-red-500">*</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAyudaTelefono(!showAyudaTelefono)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <TextInput
                value={data.telefono}
                onChange={handleTelefonoChange}
                className="mt-1 block w-full"
                placeholder={formatosEjemplo.telefono}
                required
              />
              {showAyudaTelefono && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  <strong>Formatos aceptados:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>
                      <strong>Móviles:</strong> 0414, 0412, 0416, 0424, 0426
                    </li>
                    <li>
                      <strong>Fijos:</strong> 0241, 0242, 0243, 0244, 0245, 0246
                    </li>
                    <li>
                      <strong>Internacional:</strong> +58-414-1234567
                    </li>
                    <li>Ejemplos: 0414-1234567, 0241-7654321, +58-414-1234567</li>
                  </ul>
                </div>
              )}
              <InputError message={errors.telefono} />
            </div>

            {/* Rango Militar */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Medal className="w-4 h-4 text-yellow-600" />
                <InputLabel value="Rango Militar" className="text-gray-700" />
              </div>
              <div className="relative">
                <select
                  value={data.rango_militar}
                  onChange={e => setData('rango_militar', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  required
                >
                  <option value="">Seleccione un rango militar</option>
                  {rangosPorCategoria.map((categoria, idx) => (
                    <optgroup key={idx} label={categoria.categoria}>
                      {categoria.rangos.map((rango, rIdx) => (
                        <option key={rIdx} value={rango.value}>
                          {rango.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <InputError message={errors.rango_militar} />
            </div>
          </div>

          {/* Resumen de datos ingresados */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Medal className="w-4 h-4" />
              Resumen de información
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Nombre completo:</span>
                <div className="font-semibold mt-1">
                  {data.nombres || 'No ingresado'} {data.apellidos || ''}
                </div>
              </div>
              <div>
                <span className="font-medium">Cédula:</span>
                <div className="font-mono bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                  {data.cedula || 'No ingresada'}
                </div>
              </div>
              <div>
                <span className="font-medium">Fecha de nacimiento:</span>
                <div className="mt-1">
                  {data.fecha_nacimiento || 'No ingresada'}
                  {data.fecha_nacimiento && validateFecha(data.fecha_nacimiento) && (
                    <span className="ml-2 text-gray-600">
                      ({calcularEdad(data.fecha_nacimiento)} años)
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span className="font-medium">Rango seleccionado:</span>
                <div className="mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {data.rango_militar
                      ? rangosPorCategoria
                          .flatMap(c => c.rangos)
                          .find(r => r.value === data.rango_militar)?.label || data.rango_militar
                      : 'No seleccionado'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notas importantes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong>Nota importante:</strong> Todos los campos marcados con{' '}
                <span className="text-red-500">*</span> son obligatorios.
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>La cédula debe tener formato venezolano válido</li>
                  <li>La fecha debe ser en formato DD/MM/AAAA</li>
                  <li>El teléfono debe ser un número venezolano válido</li>
                  <li>La persona debe tener entre 15 y 120 años de edad</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Link
              href="/personas"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancelar
            </Link>
            <PrimaryButton disabled={processing} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {processing ? 'Guardando...' : 'Guardar Persona'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
