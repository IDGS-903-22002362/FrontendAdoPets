import { useState, useEffect } from "react";
import {
  MdClose,
  MdEdit,
  MdEmail,
  MdPhone,
  MdWork,
  MdCalendarToday,
  MdAttachMoney,
  MdCalendarViewWeek,
} from "react-icons/md";
import { useServices } from "../hooks/useServices";
import Loading from "./Loading";

const EmpleadoDetalleModal = ({ isOpen, onClose, empleadoId, onEdit }) => {
  const { getEmpleadoById } = useServices();
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && empleadoId) {
      cargarEmpleado();
    }
  }, [isOpen, empleadoId]);

  const cargarEmpleado = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEmpleadoById(empleadoId);
      if (result.success) {
        setEmpleado(result.data?.data);
      } else {
        setError(result.message || "Error al cargar empleado");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold text-gray-800">
            Detalle del Empleado
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <Loading message="Cargando información..." />
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : empleado ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Nombre Completo
                    </label>
                    <p className="text-gray-900 font-medium">
                      {empleado.nombreCompleto}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Cédula
                    </label>
                    <p className="text-gray-900 font-medium">
                      {empleado.cedula}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  Información de Contacto
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MdEmail className="text-gray-400 text-xl" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email Laboral
                      </label>
                      <p className="text-gray-900">{empleado.emailLaboral}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdPhone className="text-gray-400 text-xl" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Teléfono Laboral
                      </label>
                      <p className="text-gray-900">
                        {empleado.telefonoLaboral}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  Información Laboral
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MdWork className="text-gray-400 text-xl" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Tipo de Empleado
                      </label>
                      <p className="text-gray-900">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {empleado.tipoEmpleado}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdAttachMoney className="text-gray-400 text-xl" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Sueldo
                      </label>
                      <p className="text-gray-900 font-semibold">
                        $
                        {empleado.sueldo?.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdCalendarToday className="text-gray-400 text-xl" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Fecha de Contratación
                      </label>
                      <p className="text-gray-900">
                        {new Date(
                          empleado.fechaContratacion
                        ).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdCalendarViewWeek className="text-gray-400 text-xl" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Disponibilidad
                      </label>
                      <p className="text-gray-900">{empleado.disponibilidad}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  Especialidades
                </h3>
                {empleado.especialidades &&
                empleado.especialidades.length > 0 ? (
                  <div className="space-y-3">
                    {empleado.especialidades.map((esp) => (
                      <div
                        key={esp.especialidadId}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-blue-800 text-lg">
                              {esp.codigo}
                            </p>
                            <p className="text-gray-700 mt-1">
                              {esp.descripcion}
                            </p>
                            {esp.certificacion && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">
                                  Certificación:
                                </span>{" "}
                                {esp.certificacion}
                              </p>
                            )}
                          </div>
                          {esp.obtainedAt && (
                            <span className="text-xs text-gray-500">
                              {new Date(esp.obtainedAt).toLocaleDateString(
                                "es-MX"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No tiene especialidades registradas
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    onEdit(empleado);
                    onClose();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <MdEdit />
                  Editar
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EmpleadoDetalleModal;
