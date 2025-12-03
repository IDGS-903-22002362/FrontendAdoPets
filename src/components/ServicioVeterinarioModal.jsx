import React, { useState, useEffect } from "react";
import { useServices } from "../hooks/useServices";
import { MdClose } from "react-icons/md";

const ServicioVeterinarioModal = ({ isOpen, onClose, servicio, onSuccess }) => {
  const { createServicioVeterinario, updateServicioVeterinario } = useServices();
  
  const [formData, setFormData] = useState({
    descripcion: "",
    categoria: 1,
    duracionMinDefault: 30,
    precioSugerido: 0,
    notas: "",
    activo: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (servicio) {
      setFormData({
        descripcion: servicio.descripcion || "",
        categoria: servicio.categoria || 1,
        duracionMinDefault: servicio.duracionMinDefault || 30,
        precioSugerido: servicio.precioSugerido || 0,
        notas: servicio.notas || "",
        activo: servicio.activo !== undefined ? servicio.activo : true
      });
    } else {
      setFormData({
        descripcion: "",
        categoria: 1,
        duracionMinDefault: 30,
        precioSugerido: 0,
        notas: "",
        activo: true
      });
    }
    setError(null);
  }, [servicio, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const categoria = parseInt(formData.categoria);
      const duracionMin = parseInt(formData.duracionMinDefault);
      const precio = parseFloat(formData.precioSugerido);

      if (isNaN(categoria) || isNaN(duracionMin) || isNaN(precio)) {
        setError("Por favor, verifica que todos los campos numéricos sean válidos");
        setLoading(false);
        return;
      }

      const payload = {
        descripcion: formData.descripcion.trim(),
        categoria: categoria,
        duracionMinDefault: duracionMin,
        precioSugerido: precio,
        notas: formData.notas ? formData.notas.trim() : ""
      };

      if (servicio) {
        payload.activo = formData.activo;
      }

      const result = servicio 
        ? await updateServicioVeterinario(servicio.id, payload)
        : await createServicioVeterinario(payload);

      if (result.success) {
        onSuccess(!!servicio);
        onClose();
      } else {
        const errorMsg = result.message || "Error al guardar el servicio";
        const errorDetails = result.errors && result.errors.length > 0 
          ? `\n${result.errors.join(', ')}` 
          : '';
        setError(errorMsg + errorDetails);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.errors?.join(', ')
        || error.message 
        || "Error al procesar la solicitud";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categorias = [
    { value: 1, label: 'Consulta' },
    { value: 2, label: 'Cirugía' },
    { value: 3, label: 'Diagnóstico' },
    { value: 4, label: 'Estética' },
    { value: 5, label: 'Vacunación' },
    { value: 6, label: 'Emergencia' },
    { value: 99, label: 'Otro' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 animate-fade-in">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {servicio ? "Editar Servicio" : "Nuevo Servicio"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción del servicio"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (minutos) *
              </label>
              <input
                type="number"
                name="duracionMinDefault"
                value={formData.duracionMinDefault}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Sugerido *
            </label>
            <input
              type="number"
              name="precioSugerido"
              value={formData.precioSugerido}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notas adicionales sobre el servicio"
            />
          </div>

          {servicio && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="activo"
                id="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                Servicio activo
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : servicio ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicioVeterinarioModal;
