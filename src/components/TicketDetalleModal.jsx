import { MdClose } from 'react-icons/md';

const TicketDetalleModal = ({ isOpen, onClose, ticket }) => {
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

  const getEstadoColor = (estado) => {
    const colores = {
      1: 'bg-yellow-100 text-yellow-800',
      2: 'bg-green-100 text-green-800',
      3: 'bg-red-100 text-red-800',
      4: 'bg-blue-100 text-blue-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Detalle del Ticket</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Número de Ticket</p>
              <p className="text-xl font-bold text-blue-800">{ticket.numeroTicket}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(ticket.estado)}`}>
                {getEstadoLabel(ticket.estado)}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium text-gray-900">{ticket.nombreCliente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mascota</p>
                <p className="font-medium text-gray-900">{ticket.nombreMascota || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Veterinario</p>
                <p className="font-medium text-gray-900">{ticket.nombreVeterinario}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha del Procedimiento</p>
                <p className="font-medium text-gray-900">{formatDate(ticket.fechaProcedimiento)}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Procedimiento</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium text-gray-900">{ticket.nombreProcedimiento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Descripción</p>
                <p className="text-gray-900">{ticket.descripcionProcedimiento || 'Sin descripción'}</p>
              </div>
              {ticket.diagnostico && (
                <div>
                  <p className="text-sm text-gray-600">Diagnóstico</p>
                  <p className="text-gray-900">{ticket.diagnostico}</p>
                </div>
              )}
              {ticket.tratamiento && (
                <div>
                  <p className="text-sm text-gray-600">Tratamiento</p>
                  <p className="text-gray-900">{ticket.tratamiento}</p>
                </div>
              )}
              {ticket.medicacionPrescrita && (
                <div>
                  <p className="text-sm text-gray-600">Medicación Prescrita</p>
                  <p className="text-gray-900">{ticket.medicacionPrescrita}</p>
                </div>
              )}
              {ticket.observaciones && (
                <div>
                  <p className="text-sm text-gray-600">Observaciones</p>
                  <p className="text-gray-900">{ticket.observaciones}</p>
                </div>
              )}
            </div>
          </div>

          {ticket.detalles && ticket.detalles.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Detalles de Insumos/Servicios</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidad</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">P. Unitario</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ticket.detalles.map((detalle) => (
                      <tr key={detalle.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{detalle.descripcion}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{detalle.tipoNombre || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-900">{detalle.cantidad}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{detalle.unidad}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(detalle.precioUnitario)}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(detalle.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Resumen de Costos</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Costo Procedimiento:</span>
                <span className="font-medium text-gray-900">{formatCurrency(ticket.costoProcedimiento)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Costo Insumos:</span>
                <span className="font-medium text-gray-900">{formatCurrency(ticket.costoInsumos)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Costo Adicional:</span>
                <span className="font-medium text-gray-900">{formatCurrency(ticket.costoAdicional)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">{formatCurrency(ticket.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Descuento:</span>
                <span className="font-medium text-red-600">-{formatCurrency(ticket.descuento)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IVA (16%):</span>
                <span className="font-medium text-gray-900">{formatCurrency(ticket.iva)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(ticket.total)}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>Fecha de Creación:</p>
                <p className="font-medium text-gray-900">{formatDate(ticket.createdAt)}</p>
              </div>
              {ticket.fechaEntrega && (
                <div>
                  <p>Fecha de Entrega:</p>
                  <p className="font-medium text-gray-900">{formatDate(ticket.fechaEntrega)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetalleModal;
