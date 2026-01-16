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
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ auth }) {
  const { data, setData, post, processing, errors } = useForm({
    nombres: '',
    apellidos: '',
    cedula: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    rango_militar: '',
  });

  const submit = e => {
    e.preventDefault();
    post('/personas');
  };

  // Rangos militares básicos
  const rangosMilitares = [
    { value: '', label: 'Seleccione un rango' },
    { value: 'soldado', label: 'Soldado' },
    { value: 'cabo', label: 'Cabo' },
    { value: 'sargento', label: 'Sargento' },
    { value: 'sargento_primero', label: 'Sargento Primero' },
    { value: 'subteniente', label: 'Subteniente' },
    { value: 'teniente', label: 'Teniente' },
    { value: 'capitan', label: 'Capitán' },
    { value: 'mayor', label: 'Mayor' },
    { value: 'teniente_coronel', label: 'Teniente Coronel' },
    { value: 'coronel', label: 'Coronel' },
    { value: 'general', label: 'General' },
    { value: 'otro', label: 'Otro' },
  ];

  // Rangos por categoría para mejor organización
  const rangosPorCategoria = [
    {
      categoria: 'Tropa',
      rangos: [
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
        { value: 'brigadier_general', label: 'Brigadier General' },
        { value: 'general_de_brigada', label: 'General de Brigada' },
        { value: 'general_de_division', label: 'General de División' },
        { value: 'general_en_jefe', label: 'General en Jefe' },
      ],
    },
  ];

  const [otroRango, setOtroRango] = useState('');

  const handleRangoChange = e => {
    const value = e.target.value;
    setData('rango_militar', value);
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
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <InputLabel value="Nombres" className="text-gray-700" />
              </div>
              <TextInput
                value={data.nombres}
                onChange={e => setData('nombres', e.target.value)}
                className="mt-1 block w-full pl-10"
                placeholder="Ingrese los nombres"
                required
              />
              <InputError message={errors.nombres} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <InputLabel value="Apellidos" className="text-gray-700" />
              </div>
              <TextInput
                value={data.apellidos}
                onChange={e => setData('apellidos', e.target.value)}
                className="mt-1 block w-full pl-10"
                placeholder="Ingrese los apellidos"
                required
              />
              <InputError message={errors.apellidos} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <InputLabel value="Cédula" className="text-gray-700" />
              </div>
              <TextInput
                value={data.cedula}
                onChange={e => setData('cedula', e.target.value)}
                className="mt-1 block w-full pl-10"
                placeholder="Ingrese la cédula"
                required
              />
              <InputError message={errors.cedula} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <InputLabel value="Fecha de Nacimiento" className="text-gray-700" />
              </div>
              <TextInput
                type="date"
                value={data.fecha_nacimiento}
                onChange={e => setData('fecha_nacimiento', e.target.value)}
                className="mt-1 block w-full pl-10"
                required
              />
              <InputError message={errors.fecha_nacimiento} />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <InputLabel value="Dirección" className="text-gray-700" />
              </div>
              <TextInput
                value={data.direccion}
                onChange={e => setData('direccion', e.target.value)}
                className="mt-1 block w-full pl-10"
                placeholder="Ingrese la dirección completa"
              />
              <InputError message={errors.direccion} />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <InputLabel value="Teléfono" className="text-gray-700" />
              </div>
              <TextInput
                value={data.telefono}
                onChange={e => setData('telefono', e.target.value)}
                className="mt-1 block w-full pl-10"
                placeholder="Ingrese el número de teléfono"
              />
              <InputError message={errors.telefono} />
            </div>

            {/* Campo de Rango Militar */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Medal className="w-4 h-4 text-yellow-600" />
                <InputLabel value="Rango Militar" className="text-gray-700" />
              </div>
              <div className="relative">
                <select
                  value={data.rango_militar}
                  onChange={handleRangoChange}
                  className="mt-1 block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  required
                >
                  <option value="">Seleccione un rango militar</option>
                  <optgroup label="Tropa">
                    <option value="soldado">Soldado</option>
                    <option value="cabo">Cabo</option>
                    <option value="cabo_primero">Cabo Primero</option>
                    <option value="cabo_mayor">Cabo Mayor</option>
                  </optgroup>
                  <optgroup label="Suboficiales">
                    <option value="sargento">Sargento</option>
                    <option value="sargento_primero">Sargento Primero</option>
                    <option value="sargento_mayor">Sargento Mayor</option>
                    <option value="suboficial_mayor">Suboficial Mayor</option>
                  </optgroup>
                  <optgroup label="Oficiales">
                    <option value="subteniente">Subteniente</option>
                    <option value="teniente">Teniente</option>
                    <option value="capitan">Capitán</option>
                    <option value="mayor">Mayor</option>
                    <option value="teniente_coronel">Teniente Coronel</option>
                    <option value="coronel">Coronel</option>
                  </optgroup>
                  <optgroup label="Generales">
                    <option value="brigadier_general">Brigadier General</option>
                    <option value="general_de_brigada">General de Brigada</option>
                    <option value="general_de_division">General de División</option>
                    <option value="general_en_jefe">General en Jefe</option>
                  </optgroup>
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
              Resumen de información militar
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Nombre completo:</span> {data.nombres}{' '}
                {data.apellidos}
              </div>
              <div>
                <span className="font-medium">Cédula:</span> {data.cedula || 'No ingresada'}
              </div>
              <div>
                <span className="font-medium">Rango seleccionado:</span>
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {data.rango_militar
                    ? rangosMilitares.find(r => r.value === data.rango_militar)?.label ||
                      otroRango ||
                      data.rango_militar
                    : 'No seleccionado'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancelar
            </button>
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
