// src/pages/Inventario.jsx

import { useEffect, useState } from "react";
import SurtirModal from "../components/SurtirModal";
import NuevoInsumoModal from "../components/NuevoInsumoModal";
import inventarioService from "../services/inventario.service";

export default function Inventario() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mostrarNuevoModal, setMostrarNuevoModal] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  const loadInventario = async () => {
    try {
      const response = await inventarioService.getInventario();
      if (response.success) {
        setItems(response.data || []);
      } else {
        setError("No se pudo cargar el inventario");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventario();
  }, []);

  // ⬅ Agrega insumo nuevo sin refrescar la página
  const handleNuevoInsumoAgregado = (nuevo) => {
    const nuevoItem = {
      itemId: nuevo.id,
      nombre: nuevo.nombre,
      unidad: nuevo.unidad,
      totalDisponible: 0,
      loteMasProximo: null
    };

    setItems((prev) => [...prev, nuevoItem]);
  };

  if (loading) return <p className="p-4">Cargando inventario...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">

      {/* 🟦 MODAL PARA SURTIR */}
      {itemSeleccionado && (
        <SurtirModal
          item={itemSeleccionado}
          onClose={() => setItemSeleccionado(null)}
          onSuccess={() => {
            setItemSeleccionado(null);
            loadInventario();
          }}
        />
      )}

      {/* 🟩 MODAL PARA NUEVO INSUMO */}
      {mostrarNuevoModal && (
        <NuevoInsumoModal
          onClose={() => setMostrarNuevoModal(false)}
          onSuccess={(nuevo) => {
            handleNuevoInsumoAgregado(nuevo);
            setMostrarNuevoModal(false);
          }}
        />
      )}

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Inventario</h1>

      {/* BOTÓN AGREGAR INSUMO */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setMostrarNuevoModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          Agregar insumo nuevo
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 font-semibold text-gray-600 text-left">Nombre</th>
              <th className="p-4 font-semibold text-gray-600 text-left">Unidad</th>
              <th className="p-4 font-semibold text-gray-600 text-left">Total Disponible</th>
              <th className="p-4 font-semibold text-gray-600 text-left">Lote Próximo a Vencer</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const lote = item.loteMasProximo;

              return (
                <tr
                  key={item.itemId}
                  className="border-b transition-all hover:bg-gray-100 hover:shadow-sm"
                >
                  <td className="p-4">{item.nombre}</td>
                  <td className="p-4">{item.unidad}</td>
                  <td className="p-4 font-semibold text-gray-900">
                    {item.totalDisponible}
                  </td>

                  <td className="p-4">
                    {lote ? (
                      <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl text-xs w-fit">
                        <p>
                          <span className="font-semibold">Lote expira el:</span>{" "}
                          {new Date(lote.expDate).toLocaleDateString("es-MX")}
                        </p>
                        <p>
                          <span className="font-semibold">Cantidad disponible del lote:</span>{" "}
                          {lote.qtyDisponible}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Sin lotes próximos
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => setItemSeleccionado(item)}
                      className="bg-blue-600 text-white w-10 h-10 rounded-full shadow hover:bg-blue-700 transition-all flex items-center justify-center text-lg"
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

    </div>
  );
}
