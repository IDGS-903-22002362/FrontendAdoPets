import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Receipt } from 'lucide-react';
import PropTypes from 'prop-types';

const TicketModal = ({ isOpen, onClose, onSubmit, ticket }) => {
  const [formData, setFormData] = useState({
    citaId: '',
    mascotaId: '',
    clienteId: '',
    veterinarioId: '',
    fechaProcedimiento: new Date().toISOString().slice(0, 16),
    nombreProcedimiento: '',
    descripcionProcedimiento: '',
    costoProcedimiento: 0,
    costoInsumos: 0,
    costoAdicional: 0,
    descuento: 0,
    observaciones: '',
    diagnostico: '',
    tratamiento: '',
    medicacionPrescrita: '',
    detalles: []
  });

  const [nuevoDetalle, setNuevoDetalle] = useState({
    descripcion: '',
    cantidad: 1,
    unidad: 'pieza',
    precioUnitario: 0,
    itemInventarioId: null,
    tipo: 1 // Procedimiento por defecto
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        ...ticket,
        fechaProcedimiento: new Date(ticket.fechaProcedimiento).toISOString().slice(0, 16)
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleDetalleChange = (e) => {
    const { name, value, type } = e.target;
    setNuevoDetalle(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const agregarDetalle = () => {
    if (!nuevoDetalle.descripcion || nuevoDetalle.precioUnitario <= 0) {
      alert('Por favor completa la descripción y el precio unitario');
      return;
    }

    setFormData(prev => ({
      ...prev,
      detalles: [...prev.detalles, { ...nuevoDetalle }]
    }));

    setNuevoDetalle({
      descripcion: '',
      cantidad: 1,
      unidad: 'pieza',
      precioUnitario: 0,
      itemInventarioId: null,
      tipo: 1
    });
  };

  const eliminarDetalle = (index) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  };

  const calcularSubtotal = (detalle) => {
    return detalle.cantidad * detalle.precioUnitario;
  };

  const calcularTotalDetalles = () => {
    return formData.detalles.reduce((total, detalle) => total + calcularSubtotal(detalle), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.clienteId || !formData.veterinarioId) {
      alert('Por favor selecciona cliente y veterinario');
      return;
    }

    if (formData.detalles.length === 0) {
      alert('Agrega al menos un detalle al ticket');
      return;
    }

    onSubmit(formData);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {ticket ? 'Editar Ticket' : 'Nuevo Ticket'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Información Básica */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente ID *
                  </label>
                  <input
                    type="text"
                    name="clienteId"
                    value={formData.clienteId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="GUID del cliente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Veterinario ID *
                  </label>
                  <input
                    type="text"
                    name="veterinarioId"
                    value={formData.veterinarioId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="GUID del veterinario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cita ID *
                  </label>
                  <input
                    type="text"
                    name="citaId"
                    value={formData.citaId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="GUID de la cita"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mascota ID
                  </label>
                  <input
                    type="text"
                    name="mascotaId"
                    value={formData.mascotaId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="GUID de la mascota (opcional)"
                  />
                </div>
              </div>
            </div>

            {/* Procedimiento */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Procedimiento</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha y Hora del Procedimiento *
                  </label>
                  <input
                    type="datetime-local"
                    name="fechaProcedimiento"
                    value={formData.fechaProcedimiento}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Procedimiento *
                  </label>
                  <input
                    type="text"
                    name="nombreProcedimiento"
                    value={formData.nombreProcedimiento}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Consulta general, Cirugía, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del Procedimiento
                  </label>
                  <textarea
                    name="descripcionProcedimiento"
                    value={formData.descripcionProcedimiento}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Detalles del procedimiento realizado"
                  />
                </div>
              </div>
            </div>

            {/* Costos */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Costos</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo Procedimiento
                  </label>
                  <input
                    type="number"
                    name="costoProcedimiento"
                    value={formData.costoProcedimiento}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo Insumos
                  </label>
                  <input
                    type="number"
                    name="costoInsumos"
                    value={formData.costoInsumos}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo Adicional
                  </label>
                  <input
                    type="number"
                    name="costoAdicional"
                    value={formData.costoAdicional}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descuento
                  </label>
                  <input
                    type="number"
                    name="descuento"
                    value={formData.descuento}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Detalles del Ticket */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Ticket</h4>
              
              {/* Agregar nuevo detalle */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="descripcion"
                      value={nuevoDetalle.descripcion}
                      onChange={handleDetalleChange}
                      placeholder="Descripción"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="cantidad"
                      value={nuevoDetalle.cantidad}
                      onChange={handleDetalleChange}
                      placeholder="Cant."
                      min="0.01"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="unidad"
                      value={nuevoDetalle.unidad}
                      onChange={handleDetalleChange}
                      placeholder="Unidad"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="precioUnitario"
                      value={nuevoDetalle.precioUnitario}
                      onChange={handleDetalleChange}
                      placeholder="Precio"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <select
                      name="tipo"
                      value={nuevoDetalle.tipo}
                      onChange={handleDetalleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="1">Procedimiento</option>
                      <option value="2">Insumo</option>
                      <option value="3">Medicamento</option>
                      <option value="4">Consulta</option>
                      <option value="5">Otro</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={agregarDetalle}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Detalle
                </button>
              </div>

              {/* Lista de detalles */}
              {formData.detalles.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Descripción</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Tipo</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Cantidad</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Unidad</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">P. Unit.</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Subtotal</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.detalles.map((detalle, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">{detalle.descripcion}</td>
                          <td className="px-4 py-2 text-sm">{getTipoLabel(detalle.tipo)}</td>
                          <td className="px-4 py-2 text-sm text-center">{detalle.cantidad}</td>
                          <td className="px-4 py-2 text-sm text-center">{detalle.unidad}</td>
                          <td className="px-4 py-2 text-sm text-right">${detalle.precioUnitario.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-right font-semibold">${calcularSubtotal(detalle).toFixed(2)}</td>
                          <td className="px-4 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => eliminarDetalle(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="5" className="px-4 py-2 text-right font-semibold text-gray-700">Total Detalles:</td>
                        <td className="px-4 py-2 text-right font-bold text-purple-600">${calcularTotalDetalles().toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Información Médica */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Médica</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnóstico
                  </label>
                  <textarea
                    name="diagnostico"
                    value={formData.diagnostico}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Diagnóstico del veterinario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tratamiento
                  </label>
                  <textarea
                    name="tratamiento"
                    value={formData.tratamiento}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tratamiento prescrito"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicación Prescrita
                  </label>
                  <textarea
                    name="medicacionPrescrita"
                    value={formData.medicacionPrescrita}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Medicamentos recetados"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Observaciones adicionales"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                <Save className="h-5 w-5" />
                {ticket ? 'Actualizar' : 'Crear'} Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

TicketModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  ticket: PropTypes.object
};

export default TicketModal;
