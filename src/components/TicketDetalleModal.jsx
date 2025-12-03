import { X, Download, Receipt, Calendar, User, Stethoscope, PawPrint } from 'lucide-react';
import PropTypes from 'prop-types';

const TicketDetalleModal = ({ isOpen, onClose, ticket, onDownloadPdf }) => {
  if (!isOpen || !ticket) return null;

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

  const getTipoLabel = (tipo) => {
    const tipos = {
      1: 'Procedimiento',
      2: 'Insumo',
      3: 'Medicamento',
      4: 'Consulta',
      5: 'Otro'
    };
    return tipos[tipo] || 'Desconocido';
  };

  const getEstadoLabel = (estado) => {
    const estados = {
      1: 'Generado',
      2: 'Entregado',
      3: 'Cancelado',
      4: 'Reimpreso'
    };
    return estados[estado] || 'Desconocido';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Detalle del Ticket</h3>
                  <p className="text-blue-100 text-sm font-mono">{ticket.numeroTicket}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDownloadPdf(ticket.id)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Descargar PDF"
                >
                  <Download className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Información del Ticket */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Estado</p>
                  <p className="text-sm font-bold text-gray-900">{getEstadoLabel(ticket.estado)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Fecha Procedimiento</p>
                  <p className="text-sm text-gray-900">{formatDate(ticket.fechaProcedimiento)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Fecha Creación</p>
                  <p className="text-sm text-gray-900">{formatDate(ticket.createdAt)}</p>
                </div>
                {ticket.fechaEntrega && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Fecha Entrega</p>
                    <p className="text-sm text-gray-900">{formatDate(ticket.fechaEntrega)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de Participantes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cliente */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Cliente</h4>
                </div>
                <p className="text-sm text-gray-900 font-medium">{ticket.nombreCliente}</p>
              </div>

              {/* Veterinario */}
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Veterinario</h4>
                </div>
                <p className="text-sm text-gray-900 font-medium">{ticket.nombreVeterinario}</p>
              </div>

              {/* Mascota */}
              {ticket.nombreMascota && (
                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <PawPrint className="h-5 w-5 text-pink-600" />
                    <h4 className="font-semibold text-pink-900">Mascota</h4>
                  </div>
                  <p className="text-sm text-gray-900 font-medium">{ticket.nombreMascota}</p>
                </div>
              )}
            </div>

            {/* Procedimiento */}
            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Procedimiento Realizado
              </h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold text-blue-600">Nombre:</p>
                  <p className="text-sm text-gray-900">{ticket.nombreProcedimiento}</p>
                </div>
                {ticket.descripcionProcedimiento && (
                  <div>
                    <p className="text-sm font-semibold text-blue-600">Descripción:</p>
                    <p className="text-sm text-gray-700">{ticket.descripcionProcedimiento}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Detalles del Ticket */}
            {ticket.detalles && ticket.detalles.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">Detalles del Servicio</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Descripción</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Tipo</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Cantidad</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Unidad</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">P. Unitario</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {ticket.detalles.map((detalle) => (
                        <tr key={detalle.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{detalle.descripcion}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {getTipoLabel(detalle.tipo)}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-center">{detalle.cantidad}</td>
                          <td className="px-4 py-2 text-sm text-center">{detalle.unidad || '-'}</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(detalle.precioUnitario)}</td>
                          <td className="px-4 py-2 text-sm text-right font-semibold">{formatCurrency(detalle.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Resumen de Costos */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Resumen de Costos</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Costo del Procedimiento:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(ticket.costoProcedimiento)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Costo de Insumos:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(ticket.costoInsumos)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Costos Adicionales:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(ticket.costoAdicional)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Subtotal:</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(ticket.subtotal)}</span>
                  </div>
                </div>
                {ticket.descuento > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Descuento:</span>
                    <span className="text-sm font-medium text-green-700">-{formatCurrency(ticket.descuento)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">IVA (16%):</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(ticket.iva)}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(ticket.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Médica */}
            {(ticket.diagnostico || ticket.tratamiento || ticket.medicacionPrescrita) && (
              <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                <h4 className="font-semibold text-gray-900">Información Médica</h4>
                {ticket.diagnostico && (
                  <div>
                    <p className="text-sm font-semibold text-blue-600 mb-1">Diagnóstico:</p>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{ticket.diagnostico}</p>
                  </div>
                )}
                {ticket.tratamiento && (
                  <div>
                    <p className="text-sm font-semibold text-blue-600 mb-1">Tratamiento:</p>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{ticket.tratamiento}</p>
                  </div>
                )}
                {ticket.medicacionPrescrita && (
                  <div>
                    <p className="text-sm font-semibold text-blue-600 mb-1">Medicación Prescrita:</p>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{ticket.medicacionPrescrita}</p>
                  </div>
                )}
              </div>
            )}

            {/* Observaciones */}
            {ticket.observaciones && (
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Observaciones</h4>
                <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">{ticket.observaciones}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Ticket generado el {formatDate(ticket.createdAt)}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TicketDetalleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ticket: PropTypes.object,
  onDownloadPdf: PropTypes.func.isRequired
};

export default TicketDetalleModal;
