import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePet } from '../hooks/usePet';
import { useServices } from '../hooks/useServices';
import expedienteService from '../services/expediente.service';

const ExpedienteModal = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { pets, getMascota } = usePet();
  const { services, getEmpleados } = useServices();

  const [formData, setFormData] = useState({
    mascotaId: '',
    veterinarioId: user?.id || '',
    citaId: '',
    motivoConsulta: '',
    anamnesis: '',
    diagnostico: '',
    tratamiento: '',
    notas: '',
    pronostico: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [veterinarios, setVeterinarios] = useState([]);

  useEffect(() => {
    getMascota();
    loadVeterinarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadVeterinarios = async () => {
    try {
      await getEmpleados({ pageNumber: 1, pageSize: 100 });
      // Filtrar solo veterinarios del contexto
      if (services?.data?.items) {
        const vets = services.data.items.filter(emp => {
          // Filtrar por roles que contienen "Veterinario"
          const hasVetRole = emp.roles?.some(role => 
            role.toLowerCase().includes('veterinari')
          );
          // También verificar especialidad si existe
          const hasVetEspecialidad = emp.especialidades?.some(esp =>
            esp.nombre?.toLowerCase().includes('veterinari')
          );
          
          return hasVetRole || hasVetEspecialidad;
        });
        console.log('Veterinarios encontrados:', vets);
        setVeterinarios(vets);
      }
    } catch (error) {
      console.error('Error al cargar veterinarios:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.mascotaId) {
      newErrors.mascotaId = 'La mascota es requerida';
    }

    if (!formData.veterinarioId) {
      newErrors.veterinarioId = 'El veterinario es requerido';
    }

    if (!formData.diagnostico || formData.diagnostico.trim() === '') {
      newErrors.diagnostico = 'El diagnóstico es requerido';
    } else if (formData.diagnostico.length > 2000) {
      newErrors.diagnostico = 'El diagnóstico no puede exceder 2000 caracteres';
    }

    if (formData.motivoConsulta && formData.motivoConsulta.length > 1000) {
      newErrors.motivoConsulta = 'El motivo no puede exceder 1000 caracteres';
    }

    if (formData.anamnesis && formData.anamnesis.length > 2000) {
      newErrors.anamnesis = 'La anamnesis no puede exceder 2000 caracteres';
    }

    if (formData.tratamiento && formData.tratamiento.length > 2000) {
      newErrors.tratamiento = 'El tratamiento no puede exceder 2000 caracteres';
    }

    if (formData.notas && formData.notas.length > 1000) {
      newErrors.notas = 'Las notas no pueden exceder 1000 caracteres';
    }

    if (formData.pronostico && formData.pronostico.length > 500) {
      newErrors.pronostico = 'El pronóstico no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        citaId: formData.citaId || null
      };

      // Log en desarrollo para debugging
      if (import.meta.env.DEV) {
        console.log('Datos a enviar:', dataToSend);
      }

      const response = await expedienteService.create(dataToSend);

      if (response?.success) {
        onSuccess();
      } else {
        setErrors({ 
          submit: response?.message || 'Error al crear el expediente. Verifica los datos.' 
        });
      }
    } catch (error) {
      console.error('Error al crear expediente:', error);
      
      // Mostrar mensaje más específico según el error
      let errorMessage = 'Error al crear el expediente.';
      
      if (error.response?.status === 500) {
        errorMessage = 'Error en el servidor. Verifica que todos los datos sean correctos y que el veterinario tenga los permisos necesarios.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Datos inválidos. Verifica la información.';
      } else if (error.response?.status === 401) {
        errorMessage = 'No autorizado. Verifica tu sesión.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'No se puede conectar al servidor.';
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Nuevo Expediente Médico</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mascota <span className="text-red-500">*</span>
              </label>
              <select
                name="mascotaId"
                value={formData.mascotaId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.mascotaId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar mascota</option>
                {pets?.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.nombre} - {pet.especie}
                  </option>
                ))}
              </select>
              {errors.mascotaId && (
                <p className="mt-1 text-sm text-red-600">{errors.mascotaId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Veterinario <span className="text-red-500">*</span>
              </label>
              <select
                name="veterinarioId"
                value={formData.veterinarioId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.veterinarioId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar veterinario</option>
                {veterinarios.map((vet) => (
                  <option key={vet.id} value={vet.id}>
                    {vet.nombre} {vet.apellidoPaterno}
                  </option>
                ))}
              </select>
              {errors.veterinarioId && (
                <p className="mt-1 text-sm text-red-600">{errors.veterinarioId}</p>
              )}
            </div>
          </div>

          {/* Motivo de consulta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de Consulta
            </label>
            <textarea
              name="motivoConsulta"
              value={formData.motivoConsulta}
              onChange={handleChange}
              rows="2"
              maxLength="1000"
              placeholder="Describe el motivo de la consulta..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.motivoConsulta ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.motivoConsulta && (
                <p className="text-sm text-red-600">{errors.motivoConsulta}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.motivoConsulta.length}/1000
              </p>
            </div>
          </div>

          {/* Anamnesis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anamnesis (Historia Clínica)
            </label>
            <textarea
              name="anamnesis"
              value={formData.anamnesis}
              onChange={handleChange}
              rows="3"
              maxLength="2000"
              placeholder="Historial médico relevante, síntomas previos, etc..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.anamnesis ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.anamnesis && (
                <p className="text-sm text-red-600">{errors.anamnesis}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.anamnesis.length}/2000
              </p>
            </div>
          </div>

          {/* Diagnóstico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnóstico <span className="text-red-500">*</span>
            </label>
            <textarea
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              rows="3"
              maxLength="2000"
              placeholder="Diagnóstico médico detallado..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.diagnostico ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.diagnostico && (
                <p className="text-sm text-red-600">{errors.diagnostico}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.diagnostico.length}/2000
              </p>
            </div>
          </div>

          {/* Tratamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tratamiento
            </label>
            <textarea
              name="tratamiento"
              value={formData.tratamiento}
              onChange={handleChange}
              rows="3"
              maxLength="2000"
              placeholder="Tratamiento prescrito, medicamentos, dosis..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.tratamiento ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.tratamiento && (
                <p className="text-sm text-red-600">{errors.tratamiento}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.tratamiento.length}/2000
              </p>
            </div>
          </div>

          {/* Pronóstico y Notas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pronóstico
              </label>
              <textarea
                name="pronostico"
                value={formData.pronostico}
                onChange={handleChange}
                rows="3"
                maxLength="500"
                placeholder="Pronóstico del paciente..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pronostico ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.pronostico && (
                  <p className="text-sm text-red-600">{errors.pronostico}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.pronostico.length}/500
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionales
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows="3"
                maxLength="1000"
                placeholder="Notas u observaciones adicionales..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.notas ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.notas && (
                  <p className="text-sm text-red-600">{errors.notas}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.notas.length}/1000
                </p>
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Expediente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpedienteModal;
