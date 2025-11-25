export default function ProveedoresTable({ data, onEdit }) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
            <th className="p-3">Teléfono</th>
            <th className="p-3">RFC</th>
            <th className="p-3">Estatus</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.nombre}</td>
              <td className="p-3">{p.email}</td>
              <td className="p-3">{p.telefono}</td>
              <td className="p-3">{p.rfc}</td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    p.estatus === 1
                      ? "bg-green-500"
                      : p.estatus === 2
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {p.estatus === 1
                    ? "Activo"
                    : p.estatus === 2
                    ? "Inactivo"
                    : "Bloqueado"}
                </span>
              </td>

              <td className="p-3">
                <button
                  onClick={() => onEdit(p)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
