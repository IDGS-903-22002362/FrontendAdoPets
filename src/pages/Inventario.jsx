// src/pages/Inventario.jsx

import { useEffect, useState } from "react";
import inventarioService from "../services/inventario.service";

export default function Inventario() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await inventarioService.getInventario();
        setItems(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el inventario");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-4">Cargando inventario...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventario</h1>

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Unidad</th>
            <th className="p-3 text-left">Total Disponible</th>
            <th className="p-3 text-left">Lote Próximo a Vencer</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const lote = item.loteMasProximo;

            return (
              <tr key={item.itemId} className="border-t hover:bg-gray-50">
                <td className="p-3">{item.nombre}</td>
                <td className="p-3">{item.unidad}</td>
                <td className="p-3 font-semibold">{item.totalDisponible}</td>

                <td className="p-3">
                  {lote ? (
                    <span className="text-red-600 font-semibold">
                      Lote {lote.lote} expira el{" "}
                      {new Date(lote.expDate).toLocaleDateString("es-MX")}{" "}
                      (qty: {lote.qtyDisponible})
                    </span>
                  ) : (
                    <span className="text-gray-400">Sin lotes próximos</span>
                  )}
                </td>

                <td className="p-3">
                  <button
                    className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700"
                  >
                    +
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
