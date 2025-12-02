export default function ProveedoresTable({ data, onEdit }) {
  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
      <table className="w-full text-sm text-gray-700">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-4 font-semibold text-gray-600">Nombre</th>
            <th className="p-4 font-semibold text-gray-600">Email</th>
            <th className="p-4 font-semibold text-gray-600">Teléfono</th>
            <th className="p-4 font-semibold text-gray-600">RFC</th>
            <th className="p-4 font-semibold text-gray-600">Estatus</th>
            <th className="p-4 font-semibold text-gray-600 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr
              key={p.id}
              className="border-b transition-all hover:bg-gray-100 hover:shadow-sm"
            >
              <td className="p-4">{p.nombre}</td>
              <td className="p-4">{p.email}</td>
              <td className="p-4">{p.telefono}</td>
              <td className="p-4">{p.rfc}</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    p.estatus === 1
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : p.estatus === 2
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {p.estatus === 1
                    ? "Activo"
                    : p.estatus === 2
                    ? "Inactivo"
                    : "Bloqueado"}
                </span>
              </td>

              <td className="p-4 text-center">
                <button
                  onClick={() => onEdit(p)}
                  className="px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all"
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
