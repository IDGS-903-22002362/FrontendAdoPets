import { useState, useEffect, useMemo } from "react";
import {
  MdAttachMoney,
  MdCheckCircle,
  MdAccessTime,
  MdClose,
  MdSearch,
  MdReceipt,
} from "react-icons/md";
import { FaPaypal } from "react-icons/fa";
import usePagos from "../hooks/usePagos";

const estadoStyles = {
  1: {
    label: "Pendiente",
    color: "bg-yellow-50 text-yellow-800 border border-yellow-200",
  },
  2: {
    label: "Procesando",
    color: "bg-blue-50 text-blue-800 border border-blue-200",
  },
  3: {
    label: "Completado",
    color: "bg-green-50 text-green-800 border border-green-200",
  },
  4: {
    label: "Fallido",
    color: "bg-orange-50 text-orange-800 border border-orange-200",
  },
  5: {
    label: "Cancelado",
    color: "bg-red-50 text-red-800 border border-red-200",
  },
  6: {
    label: "Reembolsado",
    color: "bg-gray-100 text-gray-700 border border-gray-200",
  },
};

const formatCurrency = (amount, currency = "MXN") =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(
    amount || 0
  );

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

const CobranzaAdmin = () => {
  const {
    getPagosPendientes,
    getPagosByCita,
    completarPagoPaypal,
    crearPagoCompletoPaypal,
    loading,
  } = usePagos();

  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [pagosDetalle, setPagosDetalle] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [pagoForm, setPagoForm] = useState({
    citaId: "",
    tieneAnticipo: false, // Para saber qué endpoint usar
    monto: 0,
    returnUrl: `${window.location.origin}/cobranza/success`,
    cancelUrl: `${window.location.origin}/cobranza/cancel`,
  });

  useEffect(() => {
    cargarPagosPendientes();
  }, []);

  const cargarPagosPendientes = async () => {
    const result = await getPagosPendientes();
    if (result.success) {
      setPagosPendientes(result.data || []);
    } else {
      showToast("error", result.message || "Error al cargar pagos pendientes");
    }
  };

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleVerDetalle = async (cita) => {
    setSelectedCita(cita);
    const result = await getPagosByCita(cita.citaId);

    if (result.success) {
      setPagosDetalle(result.data || []);

      // Determinar si tiene anticipo pagado
      const tieneAnticipo = cita.tieneAnticipoPagado || false;
      const monto = tieneAnticipo ? cita.montoPendiente : cita.montoTotal || 0;

      setPagoForm({
        citaId: cita.citaId,
        tieneAnticipo: tieneAnticipo,
        monto: monto,
        returnUrl: `${window.location.origin}/cobranza/success`,
        cancelUrl: `${window.location.origin}/cobranza/cancel`,
      });

      setShowModal(true);
    } else {
      showToast("error", "No se pudieron cargar los pagos de la cita");
    }
  };

  const handleCompletarPagoPaypal = async () => {
    let result;

    if (pagoForm.tieneAnticipo) {
      // ✅ Cita con anticipo (50%) - Usar endpoint completar-pago/paypal
      const payload = {
        citaId: pagoForm.citaId,
        returnUrl: pagoForm.returnUrl,
        cancelUrl: pagoForm.cancelUrl,
      };

      console.log("📤 Completando pago con anticipo (50%):", payload);
      result = await completarPagoPaypal(payload);
    } else {
      // ✅ Cita sin anticipo (100%) - Usar endpoint crear-pago-completo/paypal
      const payload = {
        citaId: pagoForm.citaId,
        monto: pagoForm.monto,
        concepto: `Pago completo de ${
          selectedCita?.servicioDescripcion || "cita"
        }`,
        returnUrl: pagoForm.returnUrl,
        cancelUrl: pagoForm.cancelUrl,
      };

      console.log("📤 Creando pago completo (100%):", payload);
      result = await crearPagoCompletoPaypal(payload);
    }

    if (result.success) {
      // El backend devuelve tanto orderId como token, usar ambos para verificar
      const { approvalUrl, orderId, token } = result.data;
      const tokenToUse = token || orderId; // Preferir token si existe

      if (approvalUrl) {
        showToast("success", "✅ Orden PayPal creada. Redirigiendo...");
        console.log("🔗 PayPal URL completa:", approvalUrl);
        console.log("📋 Order ID:", orderId);
        console.log("🎫 Token recibido:", token);
        console.log("✅ Token a usar para captura:", tokenToUse);
        console.log(
          "🎫 Token en URL de PayPal:",
          approvalUrl.match(/token=([^&]+)/)?.[1]
        );
        console.log(
          "🔍 Tipo de pago:",
          pagoForm.tieneAnticipo ? "Con anticipo (50%)" : "Completo (100%)"
        );

        // Abrir PayPal en nueva ventana
        window.open(approvalUrl, "_blank", "width=600,height=800");

        setShowModal(false);
        setSelectedCita(null);

        // Esperar 3 segundos y recargar pagos pendientes
        setTimeout(() => {
          cargarPagosPendientes();
        }, 3000);
      } else {
        showToast("error", "No se recibió URL de aprobación de PayPal");
      }
    } else {
      console.error("❌ Error al completar pago:", result);
      // ✅ Mejorar manejo de errores - mostrar message y errors
      const errorMsg = result.message || "No se pudo crear la orden de PayPal";
      const errors = result.errors?.join(", ") || "";
      showToast("error", errors ? `${errorMsg}: ${errors}` : errorMsg);
    }
  };

  const filteredPagos = useMemo(() => {
    if (!searchQuery.trim()) return pagosPendientes;

    const query = searchQuery.toLowerCase();
    return pagosPendientes.filter(
      (cita) =>
        cita.nombreMascota?.toLowerCase().includes(query) ||
        cita.nombrePropietario?.toLowerCase().includes(query) ||
        cita.numeroCita?.toLowerCase().includes(query) ||
        cita.servicioDescripcion?.toLowerCase().includes(query)
    );
  }, [searchQuery, pagosPendientes]);

  // Calcular estadísticas
const stats = useMemo(() => {
  return {
    total: pagosPendientes.length,
    conAnticipo: pagosPendientes.filter((p) => p.tieneAnticipoPagado).length,
    sinPagar: pagosPendientes.filter((p) => !p.tieneAnticipoPagado).length,
    montoTotal: pagosPendientes.reduce(
      (sum, p) => sum + (p.montoPendiente || 0),
      0
    ),
  };
}, [pagosPendientes]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Gestión de pagos pendientes</p>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MdAttachMoney className="text-primary text-3xl" />
              Cobranza y Pagos Pendientes
            </h1>
          </div>
          <button
            onClick={cargarPagosPendientes}
            className="btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <MdSearch /> Actualizar
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`border px-4 py-3 rounded-lg ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              <MdAccessTime />
              <span>Total Pendientes</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
              <MdCheckCircle />
              <span>Con Anticipo (50%)</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {stats.conAnticipo}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4">
            <div className="flex items-center gap-2 text-orange-600 text-sm mb-2">
              <MdAccessTime />
              <span>Sin Pagar (100%)</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {stats.sinPagar}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4">
            <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
              <MdAttachMoney />
              <span>Monto Pendiente</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.montoTotal)}
            </p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2">
            <MdSearch className="text-gray-400 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por mascota, propietario, número de cita o servicio..."
              className="input-field flex-1"
            />
          </div>
        </div>

        {/* Tabla de pagos pendientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <MdReceipt />
              <span>Citas con Pagos Pendientes ({filteredPagos.length})</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando...</div>
          ) : filteredPagos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? "No se encontraron resultados"
                : "No hay pagos pendientes"}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg w-full max-w-full">
              <table className="table-auto w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cita
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mascota
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Propietario
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Servicio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado Pago
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Monto Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pendiente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPagos.map((cita) => (
                    <tr key={cita.citaId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-normal break-words max-w-[100px]">
                        {cita.numeroCita || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-normal break-words max-w-[140px]">
                        {formatDate(cita.fechaCita)}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 max-w-[160px] whitespace-normal break-words">
                        {cita.nombreMascota}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-[220px] whitespace-normal break-words">
                        {cita.nombrePropietario}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-[200px] whitespace-normal break-words">
                        {cita.servicioDescripcion}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex flex-col items-start gap-1 min-w-[140px]">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              cita.tieneAnticipoPagado
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {cita.estadoPago}
                          </span>
                          <span className="text-xs text-gray-500">
                            {cita.porcentajePagado}% pagado
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(cita.montoTotal)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                        {formatCurrency(cita.montoPendiente)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleVerDetalle(cita)}
                          className="btn-primary btn-sm"
                        >
                          Cobrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cobro */}
      {showModal && selectedCita && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-w-[90vw] border border-gray-200 max-h-[90vh] overflow-y-auto overflow-x-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Completar Pago
                </h2>
                <p className="text-sm text-gray-500">
                  Cita: {selectedCita.numeroCita} - {selectedCita.nombreMascota}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose size={22} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Información de la cita */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Propietario:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {selectedCita.nombrePropietario}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Servicio:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {selectedCita.servicioDescripcion}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monto Total:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(selectedCita.montoTotal)}
                  </span>
                </div>
                {selectedCita.tieneAnticipoPagado && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Anticipo Pagado (50%):</span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(selectedCita.montoAnticipoPagado)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">
                    Monto a Cobrar:
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(selectedCita.montoPendiente)}
                  </span>
                </div>
              </div>

              {/* Historial de pagos */}
              {pagosDetalle.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Historial de Pagos
                  </h3>
                  <div className="space-y-2">
                    {pagosDetalle.map((pago) => (
                      <div
                        key={pago.id}
                        className="flex justify-between items-center bg-gray-50 rounded p-3 text-sm"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {pago.tipoNombre} - {pago.metodoNombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(pago.fechaPago)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatCurrency(pago.monto)}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              estadoStyles[pago.estado]?.color || ""
                            }`}
                          >
                            {estadoStyles[pago.estado]?.label || "Desconocido"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Información de Pago con PayPal */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <FaPaypal className="text-2xl" />
                  <div>
                    <h3 className="font-semibold">Pago Seguro con PayPal</h3>
                    <p className="text-xs text-blue-600">
                      Serás redirigido a PayPal para completar el pago de forma
                      segura
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de pago:</span>
                    <span className="font-semibold text-blue-600">PayPal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monto a pagar:</span>
                    <span className="font-bold text-blue-800">
                      {formatCurrency(selectedCita.montoPendiente)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    ℹ️ Una vez completado el pago en PayPal, el sistema
                    actualizará automáticamente el estado de la cita.
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCompletarPagoPaypal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <FaPaypal className="text-xl" />
                  {loading
                    ? "Procesando..."
                    : `Pagar ${formatCurrency(
                        selectedCita.montoPendiente
                      )} con PayPal`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CobranzaAdmin;
