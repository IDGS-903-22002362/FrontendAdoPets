import React, { useState, useEffect } from "react";
import { useServices } from "../hooks/useServices";
import Loading from "../components/Loading";
import { MdAdd, MdVisibility, MdEdit, MdDelete, MdFilterList, MdCheckCircle, MdError, MdWarning, MdClose } from "react-icons/md";
import EspecialidadModal from "../components/EspecialidadModal";
import EspecialidadDetalleModal from "../components/EspecialidadDetalleModal";

const Especialidades = () => {
  const { getEspecialidades, addEspecialidad } = useServices();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEspecialidades();
      console.log('Respuesta completa:', result);
      if (result && result.success) {
        // La respuesta del backend viene en result.data.data según el JSON
        const especialidadesArray = result.data?.data || [];
        console.log('Especialidades extraídas:', especialidadesArray);
        setEspecialidades(Array.isArray(especialidadesArray) ? especialidadesArray : []);
      } else {
        setError(result.message || "Error al cargar especialidades");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error("Error al cargar especialidades:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaEspecialidad = () => {
    setSelectedEspecialidad(null);
    setShowModal(true);
  };

  const handleVerDetalle = (especialidad) => {
    setSelectedEspecialidad(especialidad);
    setShowDetalleModal(true);
  };

  const handleModalSuccess = () => {
    setNotification({
      type: 'success',
      message: 'Especialidad creada exitosamente'
    });
    cargarEspecialidades();
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (loading) {
    return <Loading message="Cargando especialidades..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={cargarEspecialidades}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-800">Especialidades</h1>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleNuevaEspecialidad}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <MdAdd className="text-xl" />
                Agregar
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 font-thin px-6 pb-4">
            <p>Listado de especialidades disponibles</p>
          </div>
          {especialidades.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No hay especialidades registradas
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {especialidades.map((especialidad) => (
                    <tr key={especialidad.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {especialidad.codigo}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {especialidad.descripcion}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleVerDetalle(especialidad)}
                          className="text-gray-500 hover:text-blue-900 mr-3 inline-flex items-center"
                          title="Ver detalles"
                        >
                          <MdVisibility className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <EspecialidadModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />

        <EspecialidadDetalleModal
          isOpen={showDetalleModal}
          onClose={() => setShowDetalleModal(false)}
          especialidad={selectedEspecialidad}
        />

        {notification && (
          <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
            <div className={`
              ${notification.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}
              border-l-4 p-4 rounded-lg shadow-lg max-w-md flex items-start gap-3
            `}>
              {notification.type === 'success' ? (
                <MdCheckCircle className="text-2xl text-green-500 flex-shrink-0" />
              ) : (
                <MdError className="text-2xl text-red-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`
                  ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}
                  font-medium
                `}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`
                  ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}
                  hover:opacity-70 transition flex-shrink-0
                `}
              >
                <MdClose className="text-xl" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Especialidades;
