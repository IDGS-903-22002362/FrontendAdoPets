import { useState, useEffect } from 'react';
import { MdClose, MdAdd, MdDelete } from 'react-icons/md';

const AtenderCitaModal = ({ isOpen, onClose, cita, onGuardar, getInventario }) => {
  const [formData, setFormData] = useState({
    nombreProcedimiento: '',
    descripcionProcedimiento: '',
    costoProcedimiento: 0,
    costoAdicional: 0,
    descuento: 0,
    observaciones: '',
    diagnostico: '',
    tratamiento: '',
    medicacionPrescrita: '',
  });

  const [detalles, setDetalles] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [loadingInventario, setLoadingInventario] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarInventario();
      resetForm();
    }
  }, [isOpen]);

  const cargarInventario = async () => {
    setLoadingInventario(true);
    try {
      const result = await getInventario();
      if (result.success) {
        setInventario(result.data || []);
      }
    } catch (error) {
      console.error('Error al cargar inventario:', error);
    } finally {
      setLoadingInventario(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombreProcedimiento: '',
      descripcionProcedimiento: '',
      costoProcedimiento: 0,
      costoAdicional: 0,
      descuento: 0,
      observaciones: '',
      diagnostico: '',
      tratamiento: '',
      medicacionPrescrita: '',
    });
    setDetalles([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarDetalle = () => {
    setDetalles(prev => [...prev, {
      itemInventarioId: '',
      descripcion: '',
      cantidad: 1,
      unidad: '',
      precioUnitario: 0,
      tipo: 0
    }]);
  };

  const eliminarDetalle = (index) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDetalleChange = (index, field, value) => {
    setDetalles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      if (field === 'itemInventarioId' && value) {
        const item = inventario.find(i => i.itemId === value);
        if (item) {
          updated[index].descripcion = item.nombre;
          updated[index].unidad = item.unidad;
          updated[index].precioUnitario = item.precioUnitario || 0;
        }
      }
      
      return updated;
    });
  };

  const calcularCostoInsumos = () => {
    return detalles.reduce((total, detalle) => {
      return total + (detalle.cantidad * detalle.precioUnitario);
    }, 0);
  };

  const handleSubmit = () => {
    const costoInsumos = calcularCostoInsumos();
    
    const payload = {
      citaId: cita.id,
      mascotaId: cita.mascotaId,
      clienteId: cita.propietarioId,
      veterinarioId: cita.veterinarioId,
      fechaProcedimiento: new Date().toISOString(),
      nombreProcedimiento: formData.nombreProcedimiento.trim(),
      descripcionProcedimiento: formData.descripcionProcedimiento.trim(),
      costoProcedimiento: parseFloat(formData.costoProcedimiento) || 0,
      costoInsumos: costoInsumos,
      costoAdicional: parseFloat(formData.costoAdicional) || 0,
      descuento: parseFloat(formData.descuento) || 0,
      observaciones: formData.observaciones.trim() || "",
      diagnostico: formData.diagnostico.trim() || "",
      tratamiento: formData.tratamiento.trim() || "",
      medicacionPrescrita: formData.medicacionPrescrita.trim() || "",
      detalles: detalles.map(d => ({
        descripcion: d.descripcion.trim(),
        cantidad: parseInt(d.cantidad) || 0,
        unidad: d.unidad.trim(),
        precioUnitario: parseFloat(d.precioUnitario) || 0,
        itemInventarioId: d.itemInventarioId || null,
        tipo: parseInt(d.tipo) || 0
      }))
    };
    
    onGuardar(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Atender Cita</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose size={24} />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700"><strong>Mascota:</strong> {cita?.mascotaNombre}</p>
          <p className="text-sm text-gray-700"><strong>Propietario:</strong> {cita?.propietarioNombre}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Procedimiento *
            </label>
            <input
              type="text"
              name="nombreProcedimiento"
              value={formData.nombreProcedimiento}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Consulta general"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo Procedimiento
            </label>
            <input
              type="number"
              name="costoProcedimiento"
              value={formData.costoProcedimiento}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Procedimiento
          </label>
          <textarea
            name="descripcionProcedimiento"
            value={formData.descripcionProcedimiento}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción detallada..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnóstico
          </label>
          <textarea
            name="diagnostico"
            value={formData.diagnostico}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Diagnóstico..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tratamiento
          </label>
          <textarea
            name="tratamiento"
            value={formData.tratamiento}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tratamiento recomendado..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medicación Prescrita
          </label>
          <textarea
            name="medicacionPrescrita"
            value={formData.medicacionPrescrita}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Medicamentos prescritos..."
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Medicamento Usado</h3>
            <button
              onClick={agregarDetalle}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MdAdd size={20} /> Agregar
            </button>
          </div>

          {loadingInventario ? (
            <p className="text-gray-600">Cargando inventario...</p>
          ) : (
            <div className="space-y-3">
              {detalles.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay insumos agregados. Haz clic en "Agregar" para comenzar.
                </p>
              ) : (
                detalles.map((detalle, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Medicina/Insumo
                        </label>
                        <select
                          value={detalle.itemInventarioId}
                          onChange={(e) => handleDetalleChange(index, 'itemInventarioId', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Seleccionar...</option>
                          {inventario.map(item => (
                            <option key={item.itemId} value={item.itemId}>
                              {item.nombre} ({item.totalDisponible} {item.unidad})
                            </option>
                          ))}
                        </select>
                      </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cantidad usada
                      </label>
                      <input
                        type="number"
                        value={detalle.cantidad}
                        onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Unidad
                      </label>
                      <input
                        type="text"
                        value={detalle.unidad}
                        onChange={(e) => handleDetalleChange(index, 'unidad', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Unidad"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Precio Unit.
                      </label>
                      <input
                        type="number"
                        value={detalle.precioUnitario}
                        onChange={(e) => handleDetalleChange(index, 'precioUnitario', e.target.value)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        value={detalle.tipo}
                        onChange={(e) => handleDetalleChange(index, 'tipo', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="0">Insumo</option>
                        <option value="1">Servicio</option>
                        <option value="2">Medicamento</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => eliminarDetalle(index)}
                        className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <MdDelete size={18} /> Eliminar
                      </button>
                    </div>
                  </div>

                    <div className="text-sm text-gray-700">
                      <strong>Costo/Unidad:</strong> ${detalle.precioUnitario.toFixed(2)} | 
                      <strong> Subtotal:</strong> ${(detalle.cantidad * detalle.precioUnitario).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Desglose de Costo</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo Adicional
                </label>
                <input
                  type="number"
                  name="costoAdicional"
                  value={formData.costoAdicional}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descuento
                </label>
                <input
                  type="number"
                  name="descuento"
                  value={formData.descuento}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="border-t pt-2 mt-2">
              <p className="text-gray-700"><strong>Costo Procedimiento:</strong> ${parseFloat(formData.costoProcedimiento || 0).toFixed(2)}</p>
              <p className="text-gray-700"><strong>Costo Insumos:</strong> ${calcularCostoInsumos().toFixed(2)}</p>
              <p className="text-gray-700"><strong>Costo Adicional:</strong> ${parseFloat(formData.costoAdicional || 0).toFixed(2)}</p>
              <p className="text-gray-700"><strong>Descuento:</strong> -${parseFloat(formData.descuento || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Observaciones generales..."
          />
        </div>

        <div className="flex gap-3 justify-end sticky bottom-0 bg-white pt-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default AtenderCitaModal;
