import React, { useState, useEffect } from "react";
import { useServices } from "../hooks/useServices";
import Loading from "../components/Loading";
import { MdAdd, MdVisibility, MdEdit, MdDelete, MdFilterList, MdCheckCircle, MdError, MdWarning, MdClose } from "react-icons/md";
import EmpleadoModal from "../components/EmpleadoModal";
import EmpleadoDetalleModal from "../components/EmpleadoDetalleModal";

const Empleados = () => {
  const { services, getEmpleados, deleteEmpleado } = useServices();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, empleadoId: null, empleadoNombre: '' });

  useEffect(() => {
    cargarEmpleados();
  }, [currentPage]);

  const cargarEmpleados = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEmpleados({ pageNumber: currentPage, pageSize });
      if (result && !result.success) {
        setError(result.message || "Error al cargar empleados");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error("Error al cargar empleados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleNuevoEmpleado = () => {
    setSelectedEmpleado(null);
    setShowModal(true);
  };

  const handleVerDetalle = (empleadoId) => {
    setSelectedEmpleadoId(empleadoId);
    setShowDetalleModal(true);
  };

  const handleEditarEmpleado = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowModal(true);
  };

  const handleEliminarEmpleado = (id, nombre) => {
    setConfirmDialog({
      isOpen: true,
      empleadoId: id,
      empleadoNombre: nombre
    });
  };

  const confirmarEliminacion = async () => {
    const { empleadoId, empleadoNombre } = confirmDialog;
    setConfirmDialog({ isOpen: false, empleadoId: null, empleadoNombre: '' });

    try {
      const result = await deleteEmpleado(empleadoId);
      if (result.success) {
        setNotification({
          type: 'success',
          message: `Empleado "${empleadoNombre}" eliminado exitosamente`
        });
        cargarEmpleados();
      } else {
        setNotification({
          type: 'error',
          message: result.message || 'Error al eliminar empleado'
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Error al eliminar empleado'
      });
      console.error('Error:', err);
    }
  };

  const handleModalSuccess = (isEdit) => {
    setNotification({
      type: 'success',
      message: isEdit ? 'Empleado actualizado exitosamente' : 'Empleado creado exitosamente'
    });
    cargarEmpleados();
  };

  if (loading) {
    return <Loading message="Cargando empleados..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={cargarEmpleados}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const empleadosData = services?.data?.items || [];
  const paginationInfo = services?.data || {};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-800">Empleados</h1>
            <div className="flex items-center gap-3">
              <button 
                className="text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <MdFilterList className="text-xl" />
                Filters
              </button>
              <button 
                onClick={handleNuevoEmpleado}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <MdAdd className="text-xl" />
                Agregar
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 font-thin px-6 pb-4">
            <p>Listado de empleados</p>
          </div>
          {empleadosData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No hay empleados registrados
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sueldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Especialidades
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Contratación
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {empleadosData.map((empleado) => (
                    <tr key={empleado.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {empleado.nombreCompleto}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {empleado.emailLaboral}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {empleado.telefonoLaboral}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {empleado.tipoEmpleado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${empleado.sueldo?.toLocaleString("es-MX")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {empleado.especialidades?.length > 0 ? (
                            empleado.especialidades.map((esp) => (
                              <span
                                key={esp.id}
                                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                                title={esp.descripcion}
                              >
                                {esp.codigo}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">
                              Sin especialidades
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(
                            empleado.fechaContratacion
                          ).toLocaleDateString("es-MX")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleVerDetalle(empleado.id)}
                          className="text-gray-500 hover:text-blue-900 mr-3 inline-flex items-center"
                          title="Ver detalles"
                        >
                          <MdVisibility className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleEliminarEmpleado(empleado.id, empleado.nombreCompleto)}
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

        {paginationInfo.totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Página {paginationInfo.pageNumber} de {paginationInfo.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!paginationInfo.hasPrevious}
                className={`px-4 py-2 rounded ${
                  paginationInfo.hasPrevious
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                ← Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!paginationInfo.hasNext}
                className={`px-4 py-2 rounded ${
                  paginationInfo.hasNext
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        <EmpleadoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          empleado={selectedEmpleado}
          onSuccess={() => handleModalSuccess(selectedEmpleado !== null)}
        />

        <EmpleadoDetalleModal
          isOpen={showDetalleModal}
          onClose={() => setShowDetalleModal(false)}
          empleadoId={selectedEmpleadoId}
          onEdit={handleEditarEmpleado}
        />

        {confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 animate-fade-in">
            <div className="bg-white rounded-lg w-full max-w-md shadow-2xl animate-scale-in">
              {/* Header */}
              <div className="flex items-center gap-3 p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800 flex-1">Confirmar eliminación</h2>
                <button
                  onClick={() => setConfirmDialog({ isOpen: false, empleadoId: null, empleadoNombre: '' })}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-700">
                  ¿Estás seguro de que deseas eliminar al empleado "<strong>{confirmDialog.empleadoNombre}</strong>"? Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => setConfirmDialog({ isOpen: false, empleadoId: null, empleadoNombre: '' })}
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

export default Empleados;
