import React, { useState, useEffect } from "react";
import { useServices } from "../hooks/useServices";
import Loading from "../components/Loading";
import { MdAdd, MdVisibility, MdEdit, MdDelete, MdFilterList, MdCheckCircle, MdError, MdClose, MdToggleOn, MdToggleOff } from "react-icons/md";
import ServicioVeterinarioModal from "../components/ServicioVeterinarioModal";
import ServicioVeterinarioDetalleModal from "../components/ServicioVeterinarioDetalleModal";

const ServiciosVeterinarios = () => {
  const { getServiciosVeterinarios, deleteServicioVeterinario, activarServicioVeterinario } = useServices();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [selectedServicioId, setSelectedServicioId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, servicioId: null, servicioDesc: '' });
  const [incluirInactivos, setIncluirInactivos] = useState(false);

  useEffect(() => {
    cargarServicios();
  }, [incluirInactivos, getServiciosVeterinarios]);

  const cargarServicios = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getServiciosVeterinarios(incluirInactivos);
      if (result.success) {
        setServicios(result.data || []);
      } else {
        setError(result.message || "Error al cargar servicios");
      }
    } catch (error) {
      setError("Error al conectar con el servidor" + (error.message ? `: ${error.message}` : ""));
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoServicio = () => {
    setSelectedServicio(null);
    setShowModal(true);
  };

  const handleVerDetalle = (servicioId) => {
    setSelectedServicioId(servicioId);
    setShowDetalleModal(true);
  };

  const handleEditarServicio = (servicio) => {
    setSelectedServicio(servicio);
    setShowModal(true);
  };

  const handleEliminarServicio = (id, descripcion) => {
    setConfirmDialog({
      isOpen: true,
      servicioId: id,
      servicioDesc: descripcion
    });
  };

  const confirmarEliminacion = async () => {
    const { servicioId, servicioDesc } = confirmDialog;
    setConfirmDialog({ isOpen: false, servicioId: null, servicioDesc: '' });

    try {
      const result = await deleteServicioVeterinario(servicioId);
      if (result.success) {
        setNotification({
          type: 'success',
          message: `Servicio "${servicioDesc}" eliminado exitosamente`
        });
        cargarServicios();
      } else {
        setNotification({
          type: 'error',
          message: result.message || 'Error al eliminar servicio'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Error al eliminar servicio' + (error.message ? `: ${error.message}` : "")
      });
    }
  };

  const handleToggleActivo = async (id, activo) => {
    if (!activo) {
      try {
        const result = await activarServicioVeterinario(id);
        if (result.success) {
          setNotification({
            type: 'success',
            message: 'Servicio activado exitosamente'
          });
          cargarServicios();
        } else {
          setNotification({
            type: 'error',
            message: result.message || 'Error al activar servicio'
          });
        }
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Error al activar servicio' + (error.message ? `: ${error.message}` : "")
        });
      }
    }
  };

  const handleModalSuccess = (isEdit) => {
    setNotification({
      type: 'success',
      message: isEdit ? 'Servicio actualizado exitosamente' : 'Servicio creado exitosamente'
    });
    cargarServicios();
  };

  if (loading) {
    return <Loading message="Cargando servicios..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={cargarServicios}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-800">Servicios Veterinarios</h1>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incluirInactivos}
                  onChange={(e) => setIncluirInactivos(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Incluir inactivos
              </label>
              <button 
                onClick={handleNuevoServicio}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <MdAdd className="text-xl" />
                Agregar
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 font-thin px-6 pb-4">
            <p>Listado de servicios veterinarios</p>
          </div>
          {servicios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No hay servicios registrados
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duración (min)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Sugerido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Creación
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {servicios.map((servicio) => (
                    <tr key={servicio.id} className={`hover:bg-gray-50 ${!servicio.activo ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {servicio.descripcion}
                        </div>
                        {servicio.notas && (
                          <div className="text-xs text-gray-500 mt-1">
                            {servicio.notas}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {servicio.categoriaNombre || categorias[servicio.categoria] || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {servicio.duracionMinDefault} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${servicio.precioSugerido?.toLocaleString("es-MX")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActivo(servicio.id, servicio.activo)}
                          className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${
                            servicio.activo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                          }`}
                          disabled={servicio.activo}
                        >
                          {servicio.activo ? (
                            <>
                              <MdToggleOn className="text-lg" />
                              Activo
                            </>
                          ) : (
                            <>
                              <MdToggleOff className="text-lg" />
                              Inactivo
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(servicio.createdAt).toLocaleDateString("es-MX")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleVerDetalle(servicio.id)}
                          className="text-gray-500 hover:text-blue-900 mr-3 inline-flex items-center"
                          title="Ver detalles"
                        >
                          <MdVisibility className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleEditarServicio(servicio)}
                          className="text-gray-500 hover:text-yellow-900 mr-3 inline-flex items-center"
                          title="Editar"
                        >
                          <MdEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleEliminarServicio(servicio.id, servicio.descripcion)}
                          className="text-gray-500 hover:text-red-900 inline-flex items-center"
                          title="Eliminar"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ServicioVeterinarioModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          servicio={selectedServicio}
          onSuccess={() => handleModalSuccess(selectedServicio !== null)}
        />

        <ServicioVeterinarioDetalleModal
          isOpen={showDetalleModal}
          onClose={() => setShowDetalleModal(false)}
          servicioId={selectedServicioId}
          onEdit={handleEditarServicio}
        />

        {confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 animate-fade-in">
            <div className="bg-white rounded-lg w-full max-w-md shadow-2xl animate-scale-in">
              <div className="flex items-center gap-3 p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800 flex-1">Confirmar eliminación</h2>
                <button
                  onClick={() => setConfirmDialog({ isOpen: false, servicioId: null, servicioDesc: '' })}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-700">
                  ¿Estás seguro de que deseas eliminar el servicio "<strong>{confirmDialog.servicioDesc}</strong>"? Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => setConfirmDialog({ isOpen: false, servicioId: null, servicioDesc: '' })}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminacion}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

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

export default ServiciosVeterinarios;
