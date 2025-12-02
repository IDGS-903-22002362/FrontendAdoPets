import { useState } from "react";
import itemsService from "../services/items.service";

const categorias = [
  { id: 1, nombre: "Medicamento" },
  { id: 2, nombre: "Vacuna" },
  { id: 3, nombre: "Alimento" },
  { id: 4, nombre: "Material de Curación" },
  { id: 5, nombre: "Quirúrgico" },
  { id: 6, nombre: "Limpieza" },
  { id: 99, nombre: "Otro" },
];

export default function NuevoInsumoModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    unidad: "",
    categoria: 1,
    minQty: 0,
    notas: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "categoria" || name === "minQty"
          ? Number(value)
          : value
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await itemsService.crear(form);
      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error("Error al crear insumo:", err);
      alert("Error al crear insumo");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[420px]">

        <h2 className="text-xl font-bold mb-4">Agregar Nuevo Insumo</h2>

        <label className="block font-semibold">Nombre</label>
        <input
          className="w-full border rounded p-2 mb-3"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
        />

        <label className="block font-semibold">Unidad</label>
        <input
          className="w-full border rounded p-2 mb-3"
          name="unidad"
          value={form.unidad}
          onChange={handleChange}
        />

        <label className="block font-semibold">Cantidad base (minQty)</label>
        <input
          type="number"
          className="w-full border rounded p-2 mb-3"
          name="minQty"
          value={form.minQty}
          onChange={handleChange}
        />

        <label className="block font-semibold">Categoría</label>
        <select
          className="w-full border rounded p-2 mb-3"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
        >
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <label className="block font-semibold">Notas</label>
        <textarea
          className="w-full border rounded p-2 mb-3"
          name="notas"
          value={form.notas}
          onChange={handleChange}
        />

        <label className="block font-semibold">Descripción</label>
        <textarea
          className="w-full border rounded p-2 mb-3"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
