// src/components/SurtirModal.jsx
import { useEffect, useState } from "react";
import proveedorService from "../services/proveedor.service";
import comprasService from "../services/compras.service";

export default function SurtirModal({ item, onClose, onSuccess }) {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    proveedorId: "",
    expDate: "",
    cantidad: "",
    precioUnitario: "",
    notasCompra: "",
    notasInsumo: "",
  });

  // Carga lista proveedores
  useEffect(() => {
    const load = async () => {
      try {
        const res = await proveedorService.listar();
        setProveedores(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const payload = {
      proveedorId: form.proveedorId,
      numeroFactura: "AUTO",
      fechaCompra: new Date().toISOString(),
      notas: form.notasCompra,
      detalles: [
        {
          itemId: item.itemId,
          lote: "AUTO",
          expDate: form.expDate,
          cantidad: Number(form.cantidad),
          precioUnitario: Number(form.precioUnitario),
          notas: form.notasInsumo,
        },
      ],
    };

    await comprasService.surtir(payload);
    onSuccess();
  };

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl">
        <h2 className="text-xl font-bold mb-4">Surtir: {item.nombre}</h2>

        <p className="text-sm text-gray-600 mb-4">
          Unidad: <span className="font-bold">{item.unidad}</span>
        </p>

        {loading ? (
          <p>Cargando proveedores...</p>
        ) : (
          <div className="grid gap-3">
            {/* SELECT PROVEEDOR */}
            <select
              name="proveedorId"
              value={form.proveedorId}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Selecciona un proveedor</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre}
                </option>
              ))}
            </select>

            {/* FECHA DE EXPIRACIÓN */}
            <div>
              <label className="text-sm font-semibold">Fecha de expiración:</label>
              <input
                type="date"
                name="expDate"
                min={hoy}
                value={form.expDate}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* CANTIDAD */}
            <div>
              <label className="text-sm font-semibold">Cantidad:</label>
              <input
                type="number"
                name="cantidad"
                min="1"
                value={form.cantidad}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* PRECIO UNITARIO */}
            <div>
              <label className="text-sm font-semibold">Precio unitario:</label>
              <input
                type="number"
                name="precioUnitario"
                step="0.01"
                min="0"
                value={form.precioUnitario}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* NOTAS COMPRA */}
            <textarea
              name="notasCompra"
              placeholder="Notas de la compra"
              value={form.notasCompra}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />

            {/* NOTAS INSUMO */}
            <textarea
              name="notasInsumo"
              placeholder="Notas del insumo"
              value={form.notasInsumo}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2">Cancelar</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Surtir
          </button>
        </div>
      </div>
    </div>
  );
}
