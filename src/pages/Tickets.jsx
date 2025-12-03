import { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Download, 
  Search, 
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ticketService from '../services/ticket.service';
import TicketModal from '../components/TicketModal';
import TicketDetalleModal from '../components/TicketDetalleModal';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const isCliente = user?.roles?.includes('Cliente') || user?.roles?.includes('cliente');

  const loadTickets = async () => {
    try {
      setLoading(true);
      // Si es cliente, cargar solo sus tickets
      const response = isCliente
        ? await ticketService.getByCliente(user.id)
        : await ticketService.getByCliente(user.id); // TODO: Implementar getAll en el backend
      
      if (response.success) {
        setTickets(response.data);
      }
    } catch (error) {
      console.error('Error al cargar tickets:', error);
      toast.error('Error al cargar los tickets');
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.numeroTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.nombreMascota && ticket.nombreMascota.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterEstado) {
      filtered = filtered.filter(ticket => ticket.estado.toString() === filterEstado);
    }

    setFilteredTickets(filtered);
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets, searchTerm, filterEstado]);

  const handleCreate = () => {
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  const handleView = async (ticket) => {
    try {
      const response = await ticketService.getById(ticket.id);
      if (response.success) {
        setSelectedTicket(response.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error al obtener detalle de ticket:', error);
      toast.error('Error al cargar el detalle del ticket');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await ticketService.create(formData);
      if (response.success) {
        toast.success('Ticket creado exitosamente');
        setIsModalOpen(false);
        loadTickets();
      }
    } catch (error) {
      console.error('Error al crear ticket:', error);
      const message = error.response?.data?.message || 'Error al crear el ticket';
      toast.error(message);
    }
  };

  const handleMarcarEntregado = async (id) => {
    if (!window.confirm('¿Marcar este ticket como entregado?')) {
      return;
    }

    try {
      const response = await ticketService.marcarEntregado(id);
      if (response.success) {
        toast.success('Ticket marcado como entregado');
        loadTickets();
      }
    } catch (error) {
      console.error('Error al marcar ticket:', error);
      toast.error('Error al actualizar el ticket');
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      await ticketService.downloadPdf(id);
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      toast.error('Error al descargar el PDF');
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      1: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Generado' },
      2: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Entregado' },
      3: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Cancelado' },
      4: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FileText, label: 'Reimpreso' }
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tickets</h1>
              <p className="text-sm text-gray-500 font-thin mt-1">Gestión de comprobantes de servicio</p>
            </div>
            {!isCliente && (
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Agregar
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente o mascota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Todos los estados</option>
                  <option value="1">Generado</option>
                  <option value="2">Entregado</option>
                  <option value="3">Cancelado</option>
                  <option value="4">Reimpreso</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-semibold">{filteredTickets.length}</span>
                <span>ticket(s) encontrado(s)</span>
              </div>
            </div>
          </div>

          {/* Tabla de Tickets */}
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-lg">No hay tickets disponibles</p>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => {
                    const estadoBadge = getEstadoBadge(ticket.estado);
                    const IconEstado = estadoBadge.icon;
                    
                    return (
                      <tr key={ticket.id} className="hover:bg-gray-50">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {ticket.nombreProcedimiento}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(ticket.total)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoBadge.bg} ${estadoBadge.text}`}>
                            <IconEstado className="h-3 w-3" />
                            {estadoBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(ticket)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver detalles"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDownloadPdf(ticket.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Descargar PDF"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                            {!isCliente && ticket.estado === 1 && (
                              <button
                                onClick={() => handleMarcarEntregado(ticket.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Marcar como entregado"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modales */}
      {isModalOpen && (
        <TicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          ticket={selectedTicket}
        />
      )}

      {isDetailModalOpen && selectedTicket && (
        <TicketDetalleModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          ticket={selectedTicket}
          onDownloadPdf={handleDownloadPdf}
        />
      )}
    </div>
  );
};

export default Tickets;
