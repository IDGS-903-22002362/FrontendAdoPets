import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TIPOS_SALA = [
  { value: 'Consulta', label: 'Consulta' },
  { value: 'Cirugia', label: 'Cirugía' },
  { value: 'Emergencia', label: 'Emergencia' },
  { value: 'Hospitalizacion', label: 'Hospitalización' },
  { value: 'Diagnostico', label: 'Diagnóstico' },
  { value: 'Baño', label: 'Baño' },
  { value: 'Laboratorio', label: 'Laboratorio' }
];

const SalaModal = ({ isOpen, onClose, onSubmit, sala, isEditing }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Consulta',
    descripcion: '',
    capacidad: 1,
    equipamiento: '',
    ubicacion: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sala && isEditing) {
      setFormData({
        nombre: sala.nombre || '',
        tipo: sala.tipo || 'Consulta',
        descripcion: sala.descripcion || '',
        capacidad: sala.capacidad || 1,
        equipamiento: sala.equipamiento || '',
        ubicacion: sala.ubicacion || ''
      });
    } else {
      setFormData({
        nombre: '',
        tipo: 'Consulta',
        descripcion: '',
        capacidad: 1,
        equipamiento: '',
        ubicacion: ''
      });
    }
    setErrors({});
  }, [sala, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacidad' ? parseInt(value) || 1 : value
    }));
    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo es requerido';
    }

    if (formData.capacidad < 1) {
      newErrors.capacidad = 'La capacidad debe ser al menos 1';
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    if (formData.equipamiento && formData.equipamiento.length > 1000) {
      newErrors.equipamiento = 'El equipamiento no puede exceder 1000 caracteres';
    }

    if (formData.ubicacion && formData.ubicacion.length > 200) {
      newErrors.ubicacion = 'La ubicación no puede exceder 200 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Sala' : 'Nueva Sala'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Sala de Consulta 1"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.tipo ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {TIPOS_SALA.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-500">{errors.tipo}</p>
            )}
          </div>

          {/* Capacidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.capacidad ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.capacidad && (
              <p className="mt-1 text-sm text-red-500">{errors.capacidad}</p>
            )}
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.ubicacion ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Primer piso, ala este"
            />
            {errors.ubicacion && (
              <p className="mt-1 text-sm text-red-500">{errors.ubicacion}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.descripcion ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Descripción de la sala..."
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>
            )}
          </div>

          {/* Equipamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipamiento
            </label>
            <textarea
              name="equipamiento"
              value={formData.equipamiento}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.equipamiento ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Lista de equipamiento disponible..."
            />
            {errors.equipamiento && (
              <p className="mt-1 text-sm text-red-500">{errors.equipamiento}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaModal;
