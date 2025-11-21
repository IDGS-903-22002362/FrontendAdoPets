import React, { useState, useEffect } from 'react';
import { MdClose, MdCode, MdDescription } from 'react-icons/md';
import { useServices } from '../hooks/useServices';
import Loading from './Loading';

const EspecialidadDetalleModal = ({ isOpen, onClose, especialidad }) => {
  const { getEspecialidadByCodigo } = useServices();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detalleEspecialidad, setDetalleEspecialidad] = useState(null);

  useEffect(() => {
    if (isOpen && especialidad) {
      cargarDetalle();
    }
  }, [isOpen, especialidad]);

  const cargarDetalle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEspecialidadByCodigo(especialidad.codigo);
      if (result && result.success) {
        // La respuesta viene en result.data.data según el JSON proporcionado
        setDetalleEspecialidad(result.data?.data || especialidad);
      } else {
        // Si falla la carga, usar los datos que ya tenemos
        setDetalleEspecialidad(especialidad);
      }
    } catch (err) {
      console.error("Error al cargar detalle:", err);
      setDetalleEspecialidad(especialidad);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl text-gray-800 font-semibold">
            Detalle de Especialidad
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <Loading message="Cargando detalle..." />
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : detalleEspecialidad ? (
            <div className="space-y-6">
              {/* Información Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Código */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Código
                    </label>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-2 text-base font-mono font-bold bg-blue-100 text-blue-800 rounded-lg">
                      {detalleEspecialidad.codigo}
                    </span>
                  </div>
                </div>

                {/* ID */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      ID
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 font-mono break-all">
                    {detalleEspecialidad.id}
                  </p>
                </div>
              </div>

              {/* Descripción */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Descripción
                  </label>
                </div>
                <p className="text-gray-800 leading-relaxed">
                  {detalleEspecialidad.descripcion}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontró información</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EspecialidadDetalleModal;
