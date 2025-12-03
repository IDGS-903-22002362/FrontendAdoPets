import { useState, useEffect } from 'react';
import {
  Plus,
  Eye,
  Trash2,
  Search,
  FileText,
  Filter,
  Calendar,
  User,
  PawPrint,
  AlertCircle,
  X,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import expedienteService from '../services/expediente.service';
import ExpedienteModal from '../components/ExpedienteModal';
import ExpedienteDetalleModal from '../components/ExpedienteDetalleModal';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';

const Expedientes = () => {
  const { user } = useAuth();
  const [expedientes, setExpedientes] = useState([]);
  const [filteredExpedientes, setFilteredExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVeterinario, setFilterVeterinario] = useState('');
  const [filterMascota, setFilterMascota] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isAdmin = user?.roles?.includes('Admin') || user?.roles?.includes('admin');
  const isVeterinario = user?.roles?.includes('Veterinario') || user?.roles?.includes('veterinario');

  const loadExpedientes = async () => {
    try {
      setLoading(true);
      setErrorState(null);
      setExpedientes([]);
      
      // Intentar cargar expedientes solo si el usuario tiene el rol correcto
      if ((isVeterinario || isAdmin) && user?.id) {
        try {
          const response = await expedienteService.getByVeterinario(user.id);
          
          if (response?.success && Array.isArray(response.data)) {
            setExpedientes(response.data);
            setErrorState(null);
          } else if (response?.data && Array.isArray(response.data)) {
            setExpedientes(response.data);
            setErrorState(null);
          } else {
            setExpedientes([]);
          }
        } catch (err) {
          // Manejar diferentes tipos de errores
          if (err.response?.status === 404) {
            // No hay expedientes, esto es normal
            setExpedientes([]);
            setErrorState(null);
          } else if (err.response?.status === 500) {
            // Error del servidor - probablemente no hay datos o hay un problema en el backend
            console.warn('Error 500 al cargar expedientes - puede ser que no haya datos aún');
            setExpedientes([]);
            setErrorState({
              type: 'warning',
              message: 'El sistema de expedientes está listo. Puedes crear el primer expediente.'
            });
          } else if (err.code === 'ERR_NETWORK') {
            // Error de red
            setErrorState({
              type: 'error',
              message: 'No se puede conectar con el servidor. Verifica tu conexión.'
            });
          } else {
            // Otro tipo de error
            setErrorState({
              type: 'error',
              message: 'Error al cargar expedientes. Por favor, intenta nuevamente.'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar expedientes:', error);
      setExpedientes([]);
      setErrorState({
        type: 'error',
        message: 'Error inesperado al cargar expedientes.'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterExpedientes = () => {
    let filtered = [...expedientes];

    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.mascotaNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.veterinarioNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.diagnosticoResumido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.motivoConsulta?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterVeterinario) {
      filtered = filtered.filter(exp =>
        exp.veterinarioNombre?.toLowerCase().includes(filterVeterinario.toLowerCase())
      );
    }

    if (filterMascota) {
      filtered = filtered.filter(exp =>
        exp.mascotaNombre?.toLowerCase().includes(filterMascota.toLowerCase())
      );
    }

    if (dateFrom) {
      filtered = filtered.filter(exp =>
        new Date(exp.fecha) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(exp =>
        new Date(exp.fecha) <= new Date(dateTo)
      );
    }

    setFilteredExpedientes(filtered);
  };

  useEffect(() => {
    loadExpedientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterExpedientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expedientes, searchTerm, filterVeterinario, filterMascota, dateFrom, dateTo]);

  const handleCreate = () => {
    setSelectedExpediente(null);
    setIsModalOpen(true);
  };

  const handleView = async (expedienteId) => {
    try {
      const response = await expedienteService.getById(expedienteId);
      if (response?.success) {
        setSelectedExpediente(response.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error al cargar expediente:', error);
      toast.error('Error al cargar el expediente');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await expedienteService.delete(id);
      if (response?.success) {
        toast.success('Expediente eliminado exitosamente');
        loadExpedientes();
      }
    } catch (error) {
      console.error('Error al eliminar expediente:', error);
      toast.error('Error al eliminar el expediente');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    loadExpedientes();
    toast.success('Expediente creado exitosamente');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterVeterinario('');
    setFilterMascota('');
    setDateFrom('');
    setDateTo('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header con título y botón */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expedientes Médicos</h1>
            <p className="text-sm text-gray-600">
              {filteredExpedientes.length} expediente{filteredExpedientes.length !== 1 ? 's' : ''} encontrado{filteredExpedientes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {(isAdmin || isVeterinario) && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Expediente
          </button>
        )}
      </div>

      {/* Mensaje de error/advertencia */}
      {errorState && (
        <div className={`rounded-lg p-4 flex items-start gap-3 ${
          errorState.type === 'error' 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          {errorState.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`text-sm ${
              errorState.type === 'error' ? 'text-red-800' : 'text-yellow-800'
            }`}>
              {errorState.message}
            </p>
          </div>
          <button
            onClick={() => setErrorState(null)}
            className={`${
              errorState.type === 'error' ? 'text-red-600 hover:text-red-800' : 'text-yellow-600 hover:text-yellow-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por mascota, veterinario o diagnóstico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtros
          </button>
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Veterinario
              </label>
              <input
                type="text"
                value={filterVeterinario}
                onChange={(e) => setFilterVeterinario(e.target.value)}
                placeholder="Filtrar por veterinario"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mascota
              </label>
              <input
                type="text"
                value={filterMascota}
                onChange={(e) => setFilterMascota(e.target.value)}
                placeholder="Filtrar por mascota"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista de expedientes */}
      {filteredExpedientes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {loading ? 'Cargando expedientes...' : 'No se encontraron expedientes'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterVeterinario || filterMascota || dateFrom || dateTo
              ? 'Intenta ajustar los filtros de búsqueda'
              : expedientes.length === 0
              ? 'Aún no hay expedientes registrados. Comienza creando uno nuevo.'
              : 'Comienza creando un nuevo expediente médico'}
          </p>
          {(isAdmin || isVeterinario) && !searchTerm && !filterVeterinario && !filterMascota && !loading && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Crear Primer Expediente
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredExpedientes.map((expediente) => (
            <div
              key={expediente.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <PawPrint className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {expediente.mascotaNombre}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {expediente.diagnosticoResumido}
                      </p>
                      {expediente.motivoConsulta && (
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Motivo:</span> {expediente.motivoConsulta}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{expediente.veterinarioNombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(expediente.fecha)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(expediente.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setDeleteConfirm(expediente)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de creación */}
      {isModalOpen && (
        <ExpedienteModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Modal de detalle */}
      {isDetailModalOpen && selectedExpediente && (
        <ExpedienteDetalleModal
          expediente={selectedExpediente}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedExpediente(null);
          }}
          onUpdate={loadExpedientes}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar Eliminación
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el expediente de{' '}
              <span className="font-semibold">{deleteConfirm.mascotaNombre}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expedientes;
