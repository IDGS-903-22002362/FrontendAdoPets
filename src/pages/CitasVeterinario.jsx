import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useServices } from '../hooks/useServices';
import { MdEvent, MdPets, MdPerson, MdRoom, MdAccessTime, MdCheckCircle, MdCancel, MdInfo, MdAssignment, MdClose } from 'react-icons/md';
import Loading from '../components/Loading';
import AtenderCitaModal from '../components/AtenderCitaModal';

const CitasVeterinario = () => {
  const { user } = useAuth();
  const { getCitasPorVeterinario, completarCita, cancelarCita, crearTicket, getInventario } = useServices();
  
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [modalCompletarVisible, setModalCompletarVisible] = useState(false);
  const [modalCancelarVisible, setModalCancelarVisible] = useState(false);
  const [modalAtenderVisible, setModalAtenderVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [notasCompletar, setNotasCompletar] = useState('');
  const [motivoCancelar, setMotivoCancelar] = useState('');

  useEffect(() => {
    if (user?.id) {
      cargarCitas();
    }
  }, [user]);

  const cargarCitas = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const result = await getCitasPorVeterinario(user.id, params.startDate, params.endDate);
      
      if (result.success) {
        // Filtrar solo citas pendientes (excluir Completadas=2, Canceladas=3, NoAsistio=4)
        const citasPendientes = (result.data || []).filter(
          cita => cita.status !== 2 && cita.status !== 3 && cita.status !== 4
        );
        setCitas(citasPendientes);
      } else {
        showNotification(result.message || 'Error al cargar citas', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'Error al cargar citas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleCompletarClick = (cita) => {
    setCitaSeleccionada(cita);
    setNotasCompletar('');
    setModalCompletarVisible(true);
  };

  const handleCancelarClick = (cita) => {
    setCitaSeleccionada(cita);
    setMotivoCancelar('');
    setModalCancelarVisible(true);
  };

  const handleAtenderClick = (cita) => {
    setCitaSeleccionada(cita);
    setModalAtenderVisible(true);
  };

  const handleGuardarTicket = async (payload) => {
    try {
      const result = await crearTicket(payload);
      
      if (result.success) {
        // Intentar completar la cita automáticamente después de generar el ticket
        if (citaSeleccionada?.id) {
          try {
            const completarResult = await completarCita(
              citaSeleccionada.id, 
              'Cita completada - Ticket generado exitosamente'
            );
            
            if (completarResult.success) {
              showNotification('Ticket creado y cita completada exitosamente', 'success');
            } else {
              showNotification('Ticket creado exitosamente', 'success');
            }
          } catch (error) {
            // Si hay error al completar (ej: 409 - ya completada), solo notificar el ticket
            showNotification('Ticket creado exitosamente', 'success');
          }
        } else {
          showNotification('Ticket creado exitosamente', 'success');
        }
        
        setModalAtenderVisible(false);
        cargarCitas();
      } else {
        showNotification(result.message || 'Error al crear ticket', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'Error al crear ticket', 'error');
    }
  };

  const handleCompletarConfirm = async () => {
    if (!citaSeleccionada) return;
    
    try {
      const result = await completarCita(citaSeleccionada.id, notasCompletar);
      
      if (result.success) {
        showNotification('Cita completada exitosamente', 'success');
        setModalCompletarVisible(false);
        cargarCitas();
      } else {
        showNotification(result.message || 'Error al completar cita', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'Error al completar cita', 'error');
    }
  };

  const handleCancelarConfirm = async () => {
    if (!citaSeleccionada || !motivoCancelar.trim()) {
      showNotification('Debes proporcionar un motivo de cancelación', 'error');
      return;
    }
    
    try {
      const result = await cancelarCita(citaSeleccionada.id, motivoCancelar);
      
      if (result.success) {
        showNotification('Cita cancelada exitosamente', 'success');
        setModalCancelarVisible(false);
        cargarCitas();
      } else {
        showNotification(result.message || 'Error al cancelar cita', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'Error al cancelar cita', 'error');
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      1: 'Programada',
      2: 'Completada',
      3: 'Cancelada',
      4: 'No Asistió',
      5: 'En Proceso'
    };
    return statusMap[status] || 'Desconocido';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      1: 'bg-yellow-100 text-yellow-800',   // Programada
      2: 'bg-green-100 text-green-800',     // Completada
      3: 'bg-red-100 text-red-800',         // Cancelada
      4: 'bg-gray-100 text-gray-800',       // No Asistió
      5: 'bg-blue-100 text-blue-800'        // En Proceso
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getTipoLabel = (tipo) => {
    const tipoMap = {
      1: 'Consulta',
      2: 'Cirugía',
      3: 'Baño',
      4: 'Vacuna',
      5: 'Procedimiento',
      6: 'Urgencia',
      7: 'Seguimiento'
    };
    return tipoMap[tipo] || 'Desconocido';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const puedeCompletar = (cita) => {
    // Solo se puede completar si está Programada (1) o En Proceso (5)
    return cita.status === 1 || cita.status === 5;
  };

  const puedeCancelar = (cita) => {
    // Solo se puede cancelar si está Programada (1)
    return cita.status === 1;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-800">Mis Citas</h1>
            <p className="text-sm text-gray-500 font-thin mt-1">
              Gestiona tus citas veterinarias programadas
            </p>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`border px-4 py-3 rounded-lg ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
            <MdEvent className="text-xl" />
            <span>Filtros de Fecha</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={cargarCitas}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <MdEvent />
                Filtrar Citas
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Citas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {citas.length === 0 ? (
            <div className="text-center py-12">
              <MdInfo className="mx-auto text-gray-400 text-5xl mb-4" />
              <p className="text-gray-500 text-lg">No tienes citas agendadas</p>
              <p className="text-gray-400 text-sm mt-2">
                Las citas programadas aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mascota / Propietario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sala
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duración
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {citas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              <MdPets className="text-blue-600" />
                              {cita.mascotaNombre}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              <MdPerson className="text-gray-400" />
                              {cita.propietarioNombre}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDateTime(cita.startAt)}</div>
                        <div className="text-xs text-gray-500">Fin: {new Date(cita.endAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <MdRoom className="text-gray-400" />
                          {cita.salaNombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {getTipoLabel(cita.tipo)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <MdAccessTime className="text-gray-400" />
                          {cita.duracionMin} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(cita.status)}`}>
                          {getStatusLabel(cita.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAtenderClick(cita)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                            title="Atender y generar ticket"
                          >
                            <MdAssignment className="text-lg" />
                          </button>
                          {puedeCompletar(cita) && (
                            <button
                              onClick={() => handleCompletarClick(cita)}
                              className="text-green-600 hover:text-green-900 inline-flex items-center"
                              title="Completar cita"
                            >
                              <MdCheckCircle className="text-lg" />
                            </button>
                          )}
                          {puedeCancelar(cita) && (
                            <button
                              onClick={() => handleCancelarClick(cita)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center"
                              title="Cancelar cita"
                            >
                              <MdCancel className="text-lg" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Completar */}
      {modalCompletarVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Completar Cita</h2>
              <button
                onClick={() => setModalCompletarVisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <MdPets className="text-blue-600" />
                  <span className="font-semibold">{citaSeleccionada?.mascotaNombre}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MdPerson />
                  <span>{citaSeleccionada?.propietarioNombre}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={notasCompletar}
                  onChange={(e) => setNotasCompletar(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Agrega notas sobre la cita completada..."
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setModalCompletarVisible(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCompletarConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <MdCheckCircle />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cancelar */}
      {modalCancelarVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Cancelar Cita</h2>
              <button
                onClick={() => setModalCancelarVisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <MdPets className="text-blue-600" />
                  <span className="font-semibold">{citaSeleccionada?.mascotaNombre}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MdPerson />
                  <span>{citaSeleccionada?.propietarioNombre}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de cancelación <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={motivoCancelar}
                  onChange={(e) => setMotivoCancelar(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe el motivo de la cancelación..."
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setModalCancelarVisible(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={handleCancelarConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <MdCancel />
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}

      <AtenderCitaModal
        isOpen={modalAtenderVisible}
        onClose={() => setModalAtenderVisible(false)}
        cita={citaSeleccionada}
        onGuardar={handleGuardarTicket}
        getInventario={getInventario}
      />
    </div>
  );
};

export default CitasVeterinario;
