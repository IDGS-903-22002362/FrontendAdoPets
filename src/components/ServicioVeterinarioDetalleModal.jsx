import React, { useState, useEffect } from "react";
import { useServices } from "../hooks/useServices";
import { MdClose, MdEdit } from "react-icons/md";
import Loading from "./Loading";

const ServicioVeterinarioDetalleModal = ({ isOpen, onClose, servicioId, onEdit }) => {
  const { getServicioVeterinarioById } = useServices();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && servicioId) {
      cargarServicio();
    }
  }, [isOpen, servicioId, getServicioVeterinarioById]);

  const cargarServicio = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getServicioVeterinarioById(servicioId);
      if (result.success) {
        setServicio(result.data);
      } else {
        setError(result.message || "Error al cargar el servicio");
      }
    } catch (error) {
      setError("Error al conectar con el servidor" + (error.message ? `: ${error.message}` : ""));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (servicio) {
      onEdit(servicio);
      onClose();
    }
  };

  if (!isOpen) return null;

  const categorias = {
    1: 'Consulta',
    2: 'Cirugía',
    3: 'Diagnóstico',
    4: 'Estética',
    5: 'Vacunación',
    6: 'Emergencia',
    99: 'Otro'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 animate-fade-in">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Detalle del Servicio</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <div className="p-6">
          {loading && <Loading message="Cargando detalles..." />}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {servicio && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Descripción
                  </label>
                  <p className="text-gray-900 font-medium">{servicio.descripcion}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Categoría
                  </label>
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded">
                    {servicio.categoriaNombre || categorias[servicio.categoria] || 'N/A'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Duración
                  </label>
                  <p className="text-gray-900">{servicio.duracionMinDefault} minutos</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Precio Sugerido
                  </label>
                  <p className="text-gray-900 font-semibold">
                    ${servicio.precioSugerido?.toLocaleString("es-MX")}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Estado
                  </label>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                    servicio.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {servicio.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Fecha de Creación
                  </label>
                  <p className="text-gray-900">
                    {new Date(servicio.createdAt).toLocaleDateString("es-MX", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {servicio.notas && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Notas
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                    {servicio.notas}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <MdEdit />
                  Editar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicioVeterinarioDetalleModal;
