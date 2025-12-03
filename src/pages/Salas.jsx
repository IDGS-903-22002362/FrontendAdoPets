import { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Building2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import salaService from '../services/sala.service';
import SalaModal from '../components/SalaModal';
import SalaDetalleModal from '../components/SalaDetalleModal';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';

const Salas = () => {
  const { user } = useAuth();
  const [salas, setSalas] = useState([]);
  const [filteredSalas, setFilteredSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSala, setSelectedSala] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Verificar si el usuario es Admin (el rol está en el array roles)
  const isAdmin = user?.roles?.includes('Admin') || user?.roles?.includes('admin');

  const loadSalas = async () => {
    try {
      setLoading(true);
      const response = showInactive 
        ? await salaService.getAll()
        : await salaService.getActive();
      
      if (response.success) {
        setSalas(response.data);
      }
    } catch (error) {
      console.error('Error al cargar salas:', error);
      toast.error('Error al cargar las salas');
    } finally {
      setLoading(false);
    }
  };

  const filterSalas = () => {
    let filtered = [...salas];

    if (searchTerm) {
      filtered = filtered.filter(sala =>
        sala.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sala.ubicacion && sala.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterTipo) {
      filtered = filtered.filter(sala => sala.tipo === filterTipo);
    }

    if (filterEstado) {
      filtered = filtered.filter(sala => sala.estado === filterEstado);
    }

    setFilteredSalas(filtered);
  };

  useEffect(() => {
    loadSalas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInactive]);

  useEffect(() => {
    filterSalas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salas, searchTerm, filterTipo, filterEstado]);

  const handleCreate = () => {
    setSelectedSala(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (sala) => {
    setSelectedSala(sala);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleView = async (sala) => {
    try {
      const response = await salaService.getById(sala.id);
      if (response.success) {
        setSelectedSala(response.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error al obtener detalle de sala:', error);
      toast.error('Error al cargar el detalle de la sala');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        const response = await salaService.update(selectedSala.id, formData);
        if (response.success) {
          toast.success('Sala actualizada exitosamente');
        }
      } else {
        const response = await salaService.create(formData);
        if (response.success) {
          toast.success('Sala creada exitosamente');
        }
      }
      setIsModalOpen(false);
      loadSalas();
    } catch (error) {
      console.error('Error al guardar sala:', error);
      const message = error.response?.data?.message || 'Error al guardar la sala';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta sala? Esta acción marcará la sala como inactiva.')) {
      return;
    }

    try {
      const response = await salaService.delete(id);
      if (response.success) {
        toast.success('Sala eliminada exitosamente');
        loadSalas();
      }
    } catch (error) {
      console.error('Error al eliminar sala:', error);
      const message = error.response?.data?.message || 'Error al eliminar la sala';
      toast.error(message);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'Disponible': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'Ocupada': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      'Mantenimiento': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Building2 },
      'Reservada': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Building2 }
    };
    return badges[estado] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: Building2 };
  };

  const getTipoBadge = (tipo) => {
    const badges = {
      'Consulta': 'bg-blue-100 text-blue-800',
      'Cirugia': 'bg-purple-100 text-purple-800',
      'Emergencia': 'bg-red-100 text-red-800',
      'Hospitalizacion': 'bg-indigo-100 text-indigo-800',
      'Diagnostico': 'bg-teal-100 text-teal-800',
      'Laboratorio': 'bg-cyan-100 text-cyan-800'
    };
    return badges[tipo] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              Gestión de Salas
            </h1>
            <p className="text-gray-600 mt-2">
              Administra los espacios físicos de la clínica
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={handleCreate}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              Nueva Sala
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar sala..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Tipo */}
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="Consulta">Consulta</option>
              <option value="Cirugia">Cirugía</option>
              <option value="Emergencia">Emergencia</option>
              <option value="Hospitalizacion">Hospitalización</option>
              <option value="Diagnostico">Diagnóstico</option>
              <option value="Laboratorio">Laboratorio</option>
            </select>

            {/* Filtro por Estado */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Ocupada">Ocupada</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Reservada">Reservada</option>
            </select>

            {/* Mostrar Inactivas */}
            {isAdmin && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mostrar inactivas</span>
              </label>
            )}
          </div>

          {/* Estadísticas */}
          <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
            <span>Total de salas: <strong>{filteredSalas.length}</strong></span>
            <span>
              Disponibles: <strong className="text-green-600">
                {filteredSalas.filter(s => s.estado === 'Disponible').length}
              </strong>
            </span>
            <span>
              Ocupadas: <strong className="text-red-600">
                {filteredSalas.filter(s => s.estado === 'Ocupada').length}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Salas */}
      {filteredSalas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay salas</h3>
          <p className="text-gray-500">
            {searchTerm || filterTipo || filterEstado
              ? 'No se encontraron salas con los filtros aplicados'
              : 'Comienza creando tu primera sala'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSalas.map((sala) => {
            const EstadoIcon = getEstadoBadge(sala.estado).icon;
            return (
              <div
                key={sala.id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                  !sala.activo ? 'opacity-60' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{sala.nombre}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoBadge(sala.tipo)}`}>
                          {sala.tipo}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getEstadoBadge(sala.estado).bg} ${getEstadoBadge(sala.estado).text}`}>
                          <EstadoIcon size={12} className="mr-1" />
                          {sala.estado}
                        </span>
                      </div>
                    </div>
                    {!sala.activo && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        Inactiva
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p className="flex items-center">
                      <Building2 size={16} className="mr-2 text-gray-400" />
                      Capacidad: <strong className="ml-1">{sala.capacidad} persona(s)</strong>
                    </p>
                    {sala.equipamiento && (
                      <p className="text-xs line-clamp-2">{sala.equipamiento}</p>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-4 border-t">
                    <button
                      onClick={() => handleView(sala)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye size={16} className="mr-1" />
                      Ver
                    </button>
                    {isAdmin && sala.activo && (
                      <>
                        <button
                          onClick={() => handleEdit(sala)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                        >
                          <Edit size={16} className="mr-1" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(sala.id)}
                          className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modales */}
      <SalaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        sala={selectedSala}
        isEditing={isEditing}
      />

      <SalaDetalleModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        sala={selectedSala}
      />
    </div>
  );
};

export default Salas;
