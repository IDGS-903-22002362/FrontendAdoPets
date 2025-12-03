import { useState, useEffect } from 'react';
import { MdVisibility, MdReceipt } from 'react-icons/md';
import { useServices } from '../hooks/useServices';
import TicketDetalleModal from '../components/TicketDetalleModal';
import Loading from '../components/Loading';

const Tickets = () => {
  const { getTickets, getTicketById } = useServices();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await getTickets();
      
      if (response.success) {
        setTickets(response.data || []);
      } else {
        showNotification(response.message || 'Error al cargar tickets', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'Error al cargar tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleView = async (ticket) => {
    try {
      const response = await getTicketById(ticket.id);
      if (response.success) {
        setSelectedTicket(response.data);
        setIsDetailModalOpen(true);
      } else {
        showNotification(response.message || 'Error al cargar detalle', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'Error al cargar detalle', 'error');
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      1: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Generado' },
      2: { bg: 'bg-green-100', text: 'text-green-800', label: 'Entregado' },
      3: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
      4: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Reimpreso' }
    };
    return badges[estado] || badges[1];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Tickets
        </h1>
        <p className="text-gray-600 mt-2">Gestión de comprobantes de servicio</p>
      </div>

      {notification.show && (
        <div className={`mb-4 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notification.message}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <MdReceipt className="mx-auto text-6xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No hay tickets disponibles</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => {
                  const estadoBadge = getEstadoBadge(ticket.estado);
                  
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.numeroTicket}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(ticket.fechaProcedimiento)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {ticket.nombreCliente}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {ticket.nombreMascota || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {ticket.nombreProcedimiento}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(ticket.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${estadoBadge.bg} ${estadoBadge.text}`}>
                          {estadoBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleView(ticket)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Ver detalles"
                        >
                          <MdVisibility size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedTicket && (
        <TicketDetalleModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
};

export default Tickets;
