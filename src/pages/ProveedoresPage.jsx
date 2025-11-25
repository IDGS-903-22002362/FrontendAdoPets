import { useEffect, useState } from "react";
import  proveedorService  from "../services/proveedor.service";
import ProveedoresTable from "../components/ProveedoresTable";
import ProveedorForm from "../components/ProveedorForm";
import EditProveedorForm from "../components/EditProveedorForm";

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editData, setEditData] = useState(null);

  const cargarProveedores = async () => {
    const res = await proveedorService.listar();
    setProveedores(res.data);
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Proveedores</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700"
        >
          Agregar Proveedor
        </button>
      </div>

      <ProveedoresTable
        data={proveedores}
        onEdit={(prov) => setEditData(prov)}
      />

      {/* Modal Crear */}
      {showCreate && (
        <ProveedorForm
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            cargarProveedores();
            setShowCreate(false);
          }}
        />
      )}

      {/* Modal Editar */}
      {editData && (
        <EditProveedorForm
          proveedor={editData}
          onClose={() => setEditData(null)}
          onSuccess={() => {
            cargarProveedores();
            setEditData(null);
          }}
        />
      )}
    </div>
  );
}
