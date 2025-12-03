import { useState } from 'react';
import {
  X,
  Calendar,
  User,
  PawPrint,
  FileText,
  Pill,
  Stethoscope,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  Paperclip,
  Download,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import expedienteService from '../services/expediente.service';
import { useAuth } from '../hooks/useAuth';

const ExpedienteDetalleModal = ({ expediente, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [showAdjuntoForm, setShowAdjuntoForm] = useState(false);
  const [adjuntoData, setAdjuntoData] = useState({
    url: '',
    fileName: '',
    description: '',
    tipoAdjunto: 'Imagen'
  });
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.roles?.includes('Admin') || user?.roles?.includes('admin');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddAdjunto = async () => {
    if (!adjuntoData.url || !adjuntoData.tipoAdjunto) {
      toast.error('La URL y el tipo son requeridos');
      return;
    }

    setLoading(true);
    try {
      const response = await expedienteService.addAdjunto(expediente.id, adjuntoData);
      if (response?.success) {
        toast.success('Adjunto agregado exitosamente');
        setShowAdjuntoForm(false);
        setAdjuntoData({
          url: '',
          fileName: '',
          description: '',
          tipoAdjunto: 'Imagen'
        });
        onUpdate();
      }
    } catch (error) {
      console.error('Error al agregar adjunto:', error);
      toast.error('Error al agregar el adjunto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdjunto = async (adjuntoId) => {
    if (!window.confirm('¿Estás seguro de eliminar este adjunto?')) {
      return;
    }

    try {
      const response = await expedienteService.deleteAdjunto(adjuntoId);
      if (response?.success) {
        toast.success('Adjunto eliminado exitosamente');
        onUpdate();
      }
    } catch (error) {
      console.error('Error al eliminar adjunto:', error);
      toast.error('Error al eliminar el adjunto');
    }
  };

  const InfoSection = ({ icon: Icon, title, content, color = 'blue' }) => {
    if (!content) return null;

    const IconComponent = Icon;
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      pink: 'bg-pink-50 text-pink-600',
      indigo: 'bg-indigo-50 text-indigo-600'
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-700 pl-11 whitespace-pre-wrap">{content}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Expediente Médico</h2>
              <p className="text-sm text-gray-600 mt-1">
                Fecha: {formatDate(expediente.fecha)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información del paciente y veterinario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <PawPrint className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paciente</p>
                <p className="font-semibold text-gray-900">{expediente.mascotaNombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Veterinario</p>
                <p className="font-semibold text-gray-900">{expediente.veterinarioNombre}</p>
              </div>
            </div>
          </div>

          {/* Motivo de consulta */}
          <InfoSection
            icon={ClipboardList}
            title="Motivo de Consulta"
            content={expediente.motivoConsulta}
            color="blue"
          />

          {/* Anamnesis */}
          <InfoSection
            icon={FileText}
            title="Anamnesis (Historia Clínica)"
            content={expediente.anamnesis}
            color="purple"
          />

          {/* Diagnóstico */}
          <InfoSection
            icon={Stethoscope}
            title="Diagnóstico"
            content={expediente.diagnostico}
            color="green"
          />

          {/* Tratamiento */}
          <InfoSection
            icon={Pill}
            title="Tratamiento"
            content={expediente.tratamiento}
            color="orange"
          />

          {/* Pronóstico */}
          <InfoSection
            icon={TrendingUp}
            title="Pronóstico"
            content={expediente.pronostico}
            color="indigo"
          />

          {/* Notas */}
          <InfoSection
            icon={MessageSquare}
            title="Notas Adicionales"
            content={expediente.notas}
            color="pink"
          />

          {/* Adjuntos */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  Adjuntos ({expediente.adjuntos?.length || 0})
                </h3>
              </div>
              {(isAdmin || user?.id === expediente.veterinarioId) && (
                <button
                  onClick={() => setShowAdjuntoForm(!showAdjuntoForm)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              )}
            </div>

            {/* Formulario para agregar adjunto */}
            {showAdjuntoForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Adjunto
                    </label>
                    <select
                      value={adjuntoData.tipoAdjunto}
                      onChange={(e) => setAdjuntoData({ ...adjuntoData, tipoAdjunto: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Imagen">Imagen</option>
                      <option value="Documento">Documento</option>
                      <option value="Radiografia">Radiografía</option>
                      <option value="Laboratorio">Laboratorio</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Archivo
                    </label>
                    <input
                      type="text"
                      value={adjuntoData.fileName}
                      onChange={(e) => setAdjuntoData({ ...adjuntoData, fileName: e.target.value })}
                      placeholder="Ej: radiografia-torax.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL del Archivo *
                  </label>
                  <input
                    type="url"
                    value={adjuntoData.url}
                    onChange={(e) => setAdjuntoData({ ...adjuntoData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={adjuntoData.description}
                    onChange={(e) => setAdjuntoData({ ...adjuntoData, description: e.target.value })}
                    rows="2"
                    placeholder="Descripción del adjunto..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowAdjuntoForm(false)}
                    className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddAdjunto}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            )}

            {/* Lista de adjuntos */}
            {expediente.adjuntos && expediente.adjuntos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {expediente.adjuntos.map((adjunto) => (
                  <div
                    key={adjunto.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {adjunto.fileName || 'Archivo sin nombre'}
                      </p>
                      <p className="text-sm text-gray-600">{adjunto.tipoAdjunto}</p>
                      {adjunto.description && (
                        <p className="text-xs text-gray-500 mt-1">{adjunto.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(adjunto.uploadedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <a
                        href={adjunto.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteAdjunto(adjunto.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay adjuntos en este expediente
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpedienteDetalleModal;
