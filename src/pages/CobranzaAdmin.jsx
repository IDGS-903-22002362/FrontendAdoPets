import { useState } from "react";
import {
  MdAdd,
  MdAttachMoney,
  MdCancel,
  MdLink,
  MdOutlineCreditCard,
  MdSearch,
} from "react-icons/md";
import usePagos from "../hooks/usePagos";

const estadoStyles = {
  1: { label: "Pendiente", color: "bg-yellow-50 text-yellow-800 border border-yellow-200" },
  2: { label: "Completado", color: "bg-green-50 text-green-800 border border-green-200" },
  3: { label: "Fallido", color: "bg-orange-50 text-orange-800 border border-orange-200" },
  4: { label: "Cancelado", color: "bg-red-50 text-red-800 border border-red-200" },
  5: { label: "Reembolsado", color: "bg-gray-100 text-gray-700 border border-gray-200" },
};

const tipoPagoOptions = {
  1: "Normal",
  2: "Anticipo",
  3: "Saldo",
};

const metodoPagoOptions = {
  1: "PayPal",
  2: "Efectivo",
  3: "Tarjeta",
  4: "Transferencia",
};

const initialPagoForm = {
  usuarioId: "",
  monto: "",
  moneda: "MXN",
  tipo: "1",
  metodo: "2",
  concepto: "",
  citaId: "",
  esAnticipo: false,
};

const initialPaypalForm = {
  usuarioId: "",
  monto: "",
  conceptoPago: "",
  solicitudCitaId: "",
  citaId: "",
  esAnticipo: false,
  montoTotal: "",
  returnUrl: "",
  cancelUrl: "",
};

const formatCurrency = (amount, currency = "MXN") =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(amount || 0);

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
  const { pagos, loading, error, searchPagos, createPago, createPaypalOrder, capturePaypal, cancelarPago } =
    usePagos();

  const [pagoForm, setPagoForm] = useState(initialPagoForm);
  const [paypalForm, setPaypalForm] = useState(initialPaypalForm);
  const [search, setSearch] = useState({ pagoId: "", orderId: "", usuarioId: "" });
  const [paypalOrderResult, setPaypalOrderResult] = useState(null);
  const [captureOrderId, setCaptureOrderId] = useState("");
  const [notification, setNotification] = useState(null);
  const [cancelInfo, setCancelInfo] = useState({ id: null, motivo: "" });

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3200);
  };

  const handleCreatePago = async () => {
    const tipoValue = pagoForm.esAnticipo ? 2 : Number(pagoForm.tipo);
    const payload = {
      usuarioId: pagoForm.usuarioId.trim(),
      citaId: pagoForm.citaId ? pagoForm.citaId.trim() : undefined,
      monto: Number(pagoForm.monto),
      moneda: pagoForm.moneda || "MXN",
      tipo: tipoValue,
      metodo: Number(pagoForm.metodo),
      concepto: pagoForm.concepto,
      esAnticipo: pagoForm.esAnticipo,
    };
    const result = await createPago(payload);
    if (result.success) {
      showToast("success", "Pago registrado correctamente");
      setPagoForm(initialPagoForm);
    } else {
      showToast("error", result.message || "No se pudo crear el pago");
    }
  };

  const handleSearch = async () => {
    const result = await searchPagos(search);
    if (!result.success) {
      showToast("error", result.message || "No se pudieron cargar los pagos");
    } else {
      showToast("success", "B\u00fasqueda actualizada");
    }
  };

  const handleCreatePaypalOrder = async () => {
    const payload = {
      usuarioId: paypalForm.usuarioId.trim(),
      monto: Number(paypalForm.monto),
      conceptoPago: paypalForm.conceptoPago,
      esAnticipo: paypalForm.esAnticipo,
      montoTotal: paypalForm.montoTotal ? Number(paypalForm.montoTotal) : undefined,
      returnUrl: paypalForm.returnUrl || undefined,
      cancelUrl: paypalForm.cancelUrl || undefined,
    };
    if (paypalForm.solicitudCitaId) {
      payload.solicitudCitaId = paypalForm.solicitudCitaId.trim();
    }
    if (paypalForm.citaId) {
      payload.citaId = paypalForm.citaId.trim();
    }
    const result = await createPaypalOrder(payload);
    if (result.success) {
      setPaypalOrderResult(result.data);
      showToast("success", "Orden PayPal creada");
    } else {
      showToast("error", result.message || "No se pudo crear la orden");
    }
  };

  const handleCapturePaypal = async () => {
    if (!captureOrderId) {
      showToast("error", "Proporciona el Order ID a capturar");
      return;
    }
    const result = await capturePaypal(captureOrderId);
    if (result.success) {
      showToast("success", "Pago capturado");
      setCaptureOrderId("");
    } else {
      showToast("error", result.message || "No se pudo capturar el pago");
    }
  };

  const handleCancelPago = async () => {
    if (!cancelInfo.id) return;
    const result = await cancelarPago(cancelInfo.id, cancelInfo.motivo || "Cancelado por administrador");
    if (result.success) {
      showToast("success", "Pago cancelado");
      setCancelInfo({ id: null, motivo: "" });
    } else {
      showToast("error", result.message || "No se pudo cancelar el pago");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Control de cobranza</p>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MdAttachMoney className="text-primary text-3xl" />
              Cobranza y registros de pago
            </h1>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <MdOutlineCreditCard />
              <span>Registrar pago</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Usuario ID</label>
                <input
                  value={pagoForm.usuarioId}
                  onChange={(e) => setPagoForm({ ...pagoForm, usuarioId: e.target.value })}
                  className="input-field"
                  placeholder="UUID del usuario"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Cita ID</label>
                <input
                  value={pagoForm.citaId}
                  onChange={(e) => setPagoForm({ ...pagoForm, citaId: e.target.value })}
                  className="input-field"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Monto</label>
                <input
                  type="number"
                  value={pagoForm.monto}
                  onChange={(e) => setPagoForm({ ...pagoForm, monto: e.target.value })}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Moneda</label>
                <input
                  value={pagoForm.moneda}
                  onChange={(e) => setPagoForm({ ...pagoForm, moneda: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tipo</label>
                <select
                  value={pagoForm.tipo}
                  onChange={(e) => setPagoForm({ ...pagoForm, tipo: e.target.value })}
                  className="input-field"
                >
                  {Object.entries(tipoPagoOptions).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">M\u00e9todo</label>
                <select
                  value={pagoForm.metodo}
                  onChange={(e) => setPagoForm({ ...pagoForm, metodo: e.target.value })}
                  className="input-field"
                >
                  {Object.entries(metodoPagoOptions).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Concepto</label>
                <input
                  value={pagoForm.concepto}
                  onChange={(e) => setPagoForm({ ...pagoForm, concepto: e.target.value })}
                  className="input-field"
                  placeholder="Detalle breve"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="anticipo"
                  type="checkbox"
                  checked={pagoForm.esAnticipo}
                  onChange={(e) => setPagoForm({ ...pagoForm, esAnticipo: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="anticipo" className="text-sm text-gray-700">
                  Registrar como anticipo
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreatePago}
                className="btn-primary flex items-center gap-2"
                disabled={loading}
              >
                <MdAdd /> Guardar pago
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <MdLink />
              <span>PayPal</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Usuario ID</label>
                <input
                  value={paypalForm.usuarioId}
                  onChange={(e) => setPaypalForm({ ...paypalForm, usuarioId: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Monto</label>
                <input
                  type="number"
                  value={paypalForm.monto}
                  onChange={(e) => setPaypalForm({ ...paypalForm, monto: e.target.value })}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Concepto de pago</label>
                <input
                  value={paypalForm.conceptoPago}
                  onChange={(e) => setPaypalForm({ ...paypalForm, conceptoPago: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Solicitud ID</label>
                <input
                  value={paypalForm.solicitudCitaId}
                  onChange={(e) => setPaypalForm({ ...paypalForm, solicitudCitaId: e.target.value })}
                  className="input-field"
                  placeholder="opcional"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Cita ID</label>
                <input
                  value={paypalForm.citaId}
                  onChange={(e) => setPaypalForm({ ...paypalForm, citaId: e.target.value })}
                  className="input-field"
                  placeholder="opcional"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Monto total (opcional)</label>
                <input
                  type="number"
                  value={paypalForm.montoTotal}
                  onChange={(e) => setPaypalForm({ ...paypalForm, montoTotal: e.target.value })}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Return URL</label>
                <input
                  value={paypalForm.returnUrl}
                  onChange={(e) => setPaypalForm({ ...paypalForm, returnUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Cancel URL</label>
                <input
                  value={paypalForm.cancelUrl}
                  onChange={(e) => setPaypalForm({ ...paypalForm, cancelUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="paypal-anticipo"
                  type="checkbox"
                  checked={paypalForm.esAnticipo}
                  onChange={(e) => setPaypalForm({ ...paypalForm, esAnticipo: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="paypal-anticipo" className="text-sm text-gray-700">
                  Marcar como anticipo
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCreatePaypalOrder}
                className="btn-primary flex items-center gap-2"
                disabled={loading}
              >
                <MdLink /> Crear orden
              </button>
              <div className="flex items-center gap-2">
                <input
                  value={captureOrderId}
                  onChange={(e) => setCaptureOrderId(e.target.value)}
                  className="input-field"
                  placeholder="Order ID para capturar"
                />
                <button
                  onClick={handleCapturePaypal}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Capturar
                </button>
              </div>
            </div>
            {paypalOrderResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 space-y-2">
                <p className="font-semibold">Orden generada</p>
                <p>ID: {paypalOrderResult.orderId}</p>
                <p>Estatus: {paypalOrderResult.status}</p>
                {paypalOrderResult.approvalUrl && (
                  <a
                    href={paypalOrderResult.approvalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    Ir a aprobaci\u00f3n
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <MdSearch />
            <span>Buscar pagos</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">Pago ID</label>
              <input
                value={search.pagoId}
                onChange={(e) => setSearch({ ...search, pagoId: e.target.value })}
                className="input-field"
                placeholder="UUID de pago"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Order ID PayPal</label>
              <input
                value={search.orderId}
                onChange={(e) => setSearch({ ...search, orderId: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Usuario ID</label>
              <input
                value={search.usuarioId}
                onChange={(e) => setSearch({ ...search, usuarioId: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSearch} className="btn-primary flex items-center gap-2" disabled={loading}>
              <MdSearch /> Buscar
            </button>
            <button
              onClick={() => {
                setSearch({ pagoId: "", orderId: "", usuarioId: "" });
                searchPagos({});
              }}
              className="btn-secondary flex items-center gap-2"
              disabled={loading}
            >
              <MdCancel /> Limpiar
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    M\u00e9todo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Sin resultados. Usa los filtros para buscar un pago.
                    </td>
                  </tr>
                ) : (
                  pagos.map((pago) => {
                    const estadoInfo = estadoStyles[pago.estado] || estadoStyles[1];
                    return (
                      <tr key={pago.id || pago.numeroPago} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {pago.numeroPago || pago.id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tipoPagoOptions[pago.tipo] || "Otro"} · {formatCurrency(pago.monto, pago.moneda)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pago.nombreUsuario || pago.usuarioId}</div>
                          <div className="text-xs text-gray-500">Cita: {pago.citaId || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {metodoPagoOptions[pago.metodo] || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${estadoInfo.color}`}>
                            {estadoInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(pago.fechaPago || pago.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            onClick={() => setCancelInfo({ id: pago.id, motivo: "" })}
                            disabled={pago.estado === 4 || loading}
                          >
                            <MdCancel /> Cancelar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {cancelInfo.id && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-800">
              <MdCancel className="text-red-500" />
              <h3 className="text-xl font-bold">Cancelar pago</h3>
            </div>
            <div>
              <label className="text-sm text-gray-600">Motivo</label>
              <textarea
                value={cancelInfo.motivo}
                onChange={(e) => setCancelInfo((prev) => ({ ...prev, motivo: e.target.value }))}
                className="input-field"
                rows={3}
                placeholder="Ej. Solicitud del cliente"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelInfo({ id: null, motivo: "" })}
                className="btn-secondary"
                type="button"
              >
                Regresar
              </button>
              <button
                onClick={handleCancelPago}
                className="btn-primary"
                disabled={loading}
                type="button"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CobranzaAdmin;
