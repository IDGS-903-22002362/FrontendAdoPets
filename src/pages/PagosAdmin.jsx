import { useState } from "react";
import { MdAttachMoney, MdSearch } from "react-icons/md";
import usePagos from "../hooks/usePagos";

const estadoStyles = {
  0: { label: "Pendiente", color: "bg-yellow-50 text-yellow-800 border border-yellow-200" },
  1: { label: "En proceso", color: "bg-blue-50 text-blue-800 border border-blue-200" },
  2: { label: "Completado", color: "bg-green-50 text-green-800 border border-green-200" },
  3: { label: "Cancelado", color: "bg-red-50 text-red-800 border border-red-200" },
  4: { label: "Reembolsado", color: "bg-gray-100 text-gray-700 border border-gray-200" },
};

const tipoPagoOptions = {
  1: "Consulta",
  2: "Cirug\u00eda",
  3: "Medicamento",
  4: "Otro",
};

const metodoPagoOptions = {
  1: "Efectivo",
  2: "Tarjeta",
  3: "Transferencia",
  4: "PayPal",
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

const PagosAdmin = () => {
  const { pagos, loading, error, searchPagos } = usePagos();
  const [search, setSearch] = useState({ pagoId: "", orderId: "", usuarioId: "" });
  const [notification, setNotification] = useState(null);

  const handleSearch = async () => {
    const result = await searchPagos(search);
    if (!result.success) {
      setNotification({ type: "error", message: result.message || "No se pudieron cargar los pagos" });
    } else {
      setNotification({ type: "success", message: "B\u00fasqueda actualizada" });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Solo consulta</p>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MdAttachMoney className="text-primary text-3xl" />
              Pagos registrados
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
              Limpiar
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <MdAttachMoney />
            <span>Resumen</span>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Sin resultados. Usa los filtros para buscar un pago.
                    </td>
                  </tr>
                ) : (
                  pagos.map((pago) => {
                    const estadoInfo = estadoStyles[pago.estado] || estadoStyles[0];
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
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagosAdmin;
