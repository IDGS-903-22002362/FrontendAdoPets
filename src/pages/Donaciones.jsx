import React, { useEffect, useState } from "react";
import { useServices } from "../hooks/useServices";
import { MdRefresh, MdAttachMoney, MdPerson, MdVisibilityOff } from "react-icons/md";

const Donaciones = () => {
  const { getDonacionesPublicas } = useServices();

  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filtro, setFiltro] = useState(0);

  const fetchDonaciones = async () => {
    setLoading(true);
    try {
      const response = await getDonacionesPublicas(currentPage, pageSize, filtro);
      if (response.success) {
        setDonaciones(response.data || []);
        setTotalCount(response.data?.length || 0);
      } else {
        setNotification({ 
          type: "error", 
          message: response.message || "Error al cargar donaciones" 
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      setNotification({ 
        type: "error", 
        message: "Error de conexión" + (error.message ? `: ${error.message}` : "") 
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonaciones();
  }, [currentPage, filtro, getDonacionesPublicas]);

  const formatCurrency = (monto, moneda) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: moneda || 'MXN'
    }).format(monto);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 2: return "bg-green-100 text-green-800"; 
      case 1: return "bg-yellow-100 text-yellow-800"; 
      case 0: return "bg-red-100 text-red-800"; 
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-semibold text-gray-800">
                Donaciones al refugio
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filtro}
                onChange={(e) => setFiltro(Number(e.target.value))}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              >
                <option value={0}>Todas las donaciones</option>
                <option value={1}>Donaciones con usuario</option>
                <option value={2}>Donaciones anonimas</option>
              </select>
            </div>
          </div>

          {notification && (
            <div className={`mb-4 p-4 rounded-lg ${
              notification.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {notification.message}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Cargando donaciones...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800 mb-1">
                    Total Donaciones
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {donaciones.length}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800 mb-1">
                    Monto Total
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      donaciones.reduce((sum, d) => sum + d.monto, 0),
                      'MXN'
                    )}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border rounded-xl shadow-sm">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-3 text-left font-semibold text-gray-700">Fecha</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Donante</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Monto</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Estado</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Fuente</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donaciones.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          No hay donaciones registradas
                        </td>
                      </tr>
                    )}
                    {donaciones.map((donacion) => (
                      <tr key={donacion.id} className="border-t hover:bg-gray-50 transition">
                        <td className="p-3 text-gray-700">
                          {formatDate(donacion.createdAt)}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {donacion.anonima ? (
                              <>
                                <MdVisibilityOff className="text-gray-400" />
                                <span className="text-gray-500 italic">Anónimo</span>
                              </>
                            ) : (
                              <>
                                <MdPerson className="text-gray-500" />
                                <span className="font-medium text-gray-700">
                                  {donacion.nombreUsuario}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-green-700">
                            {formatCurrency(donacion.monto, donacion.moneda)}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donacion.status)}`}>
                            {donacion.statusNombre}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">
                          {donacion.sourceNombre}
                        </td>
                        <td className="p-3">
                          <div className="max-w-xs">
                            <p className="text-gray-600 text-xs truncate" title={donacion.mensaje}>
                              {donacion.mensaje || 'Sin mensaje'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donaciones;