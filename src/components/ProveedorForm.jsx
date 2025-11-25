import { useState } from "react";
import  proveedorService  from "../services/proveedor.service";

export default function ProveedorForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    rfc: "",
    contacto: "",
    notas: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await proveedorService.crear(form);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[450px]">
        <h2 className="text-xl font-bold mb-4">Nuevo Proveedor</h2>

        <div className="grid gap-3">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={key}
              className="border p-2 rounded"
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2" onClick={onClose}>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
