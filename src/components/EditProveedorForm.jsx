import { useState } from "react";
import  proveedorService  from "../services/proveedor.service";

export default function EditProveedorForm({ proveedor, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre: proveedor.nombre,
    email: proveedor.email,
    telefono: proveedor.telefono,
    direccion: proveedor.direccion,
    rfc: proveedor.rfc,
    contacto: proveedor.contacto,
    notas: proveedor.notas,
    estatus: proveedor.estatus,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await proveedorService.actualizar(proveedor.id, form);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[450px]">
        <h2 className="text-xl font-bold mb-4">Editar Proveedor</h2>
<div className="grid gap-3">
  <label className="flex flex-col text-sm font-medium">
    Nombre
    <input
      name="nombre"
      value={form.nombre}
      onChange={handleChange}
      className="border p-2 rounded"
    />
  </label>

  <label className="flex flex-col text-sm font-medium">
    Email
    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      className="border p-2 rounded"
    />
  </label>

  <label className="flex flex-col text-sm font-medium">
    Teléfono
    <input
      name="telefono"
      value={form.telefono}
      onChange={handleChange}
      className="border p-2 rounded"
    />
  </label>

  <label className="flex flex-col text-sm font-medium">
    Dirección
    <input
      name="direccion"
      value={form.direccion}
      onChange={handleChange}
      className="border p-2 rounded"
    />
  </label>

  <label className="flex flex-col text-sm font-medium">
    RFC
    <input
      name="rfc"
      value={form.rfc}
      onChange={handleChange}
      className="border p-2 rounded"
    />
  </label>

  <label className="flex flex-col text-sm font-medium">
    Contacto
    <input
      name="contacto"
      value={form.contacto}
      onChange={handleChange}
      className="border p-2 rounded"
    />
  </label>

  <label className="flex flex-col text-sm font-medium">
    Notas
    <input
      name="notas"
      value={form.notas}
      onChange={handleChange}
      className="border p-2 rounded"
    />
  </label>

  <label className="flex flex-col text-sm font-medium">
    Estatus
    <select
      name="estatus"
      value={form.estatus}
      onChange={handleChange}
      className="border p-2 rounded"
    >
      <option value={1}>Activo</option>
      <option value={2}>Inactivo</option>
      <option value={3}>Bloqueado</option>
    </select>
  </label>
</div>

        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2" onClick={onClose}>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
