import { X, MapPin, Users, Package, Info, Calendar, User } from 'lucide-react';

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  
  const date = new Date(fecha);
  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('es-ES', opciones);
};

const SalaDetalleModal = ({ isOpen, onClose, sala }) => {
  if (!isOpen || !sala) return null;

  const getEstadoBadge = (estado) => {
    const badges = {
      'Disponible': 'bg-green-100 text-green-800',
      'Ocupada': 'bg-red-100 text-red-800',
      'Mantenimiento': 'bg-yellow-100 text-yellow-800',
      'Reservada': 'bg-blue-100 text-blue-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Detalle de Sala</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información Principal */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{sala.nombre}</h3>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoBadge(sala.tipo)}`}>
                {sala.tipo}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadge(sala.estado)}`}>
                {sala.estado}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                sala.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {sala.activo ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>

          {/* Características */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Users className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Capacidad</p>
                <p className="font-semibold text-gray-800">{sala.capacidad} persona(s)</p>
              </div>
            </div>

            {sala.ubicacion && (
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Ubicación</p>
                  <p className="font-semibold text-gray-800">{sala.ubicacion}</p>
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          {sala.descripcion && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="text-blue-600" size={20} />
                <h4 className="font-semibold text-gray-800">Descripción</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">{sala.descripcion}</p>
            </div>
          )}

          {/* Equipamiento */}
          {sala.equipamiento && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="text-blue-600" size={20} />
                <h4 className="font-semibold text-gray-800">Equipamiento</h4>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{sala.equipamiento}</p>
            </div>
          )}

          {/* Información de Auditoría */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Calendar className="mr-2" size={18} />
              Información de Registro
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <User className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-gray-600">Creado por</p>
                  <p className="font-medium text-gray-800">{sala.creadoPor || 'N/A'}</p>
                  <p className="text-gray-500 text-xs">
                    {sala.fechaCreacion ? formatearFecha(sala.fechaCreacion) : 'N/A'}
                  </p>
                </div>
              </div>
              {sala.modificadoPor && (
                <div className="flex items-start space-x-2">
                  <User className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-gray-600">Última modificación</p>
                    <p className="font-medium text-gray-800">{sala.modificadoPor}</p>
                    <p className="text-gray-500 text-xs">
                      {sala.fechaModificacion ? formatearFecha(sala.fechaModificacion) : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaDetalleModal;
