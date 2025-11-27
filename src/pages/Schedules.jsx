import React, { useEffect, useState } from "react";
import { useServices } from "../hooks/useServices";
import { MdAdd, MdEdit, MdDelete, MdClose } from "react-icons/md";
import HorarioDetalleModal from "../components/HorarioDetalleModal";
import HorarioModal from "../components/HorarioModal";

const Schedules = () => {
  const { getHorarios, getEmpleados } = useServices();

  const [horarios, setHorarios] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [page, setPage] = useState(0);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [horarioParaEditar, setHorarioParaEditar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const pageSize = 7;

  useEffect(() => {
    const cargarEmpleados = async () => {
      const response = await getEmpleados({ pageNumber: 1, pageSize: 100 });
      if (response.success) {
        setEmpleados(response.data?.items || []);
      }
    };
    cargarEmpleados();
  }, []);

  useEffect(() => {
    if (!fechaInicio || !fechaFin) return;

    const fetchHorarios = async () => {
      setLoading(true);
      try {
        const response = await getHorarios(
          fechaInicio,
          fechaFin,
          empleadoSeleccionado
        );

        if (response.success) {
        const data = response.data;
        if (empleadoSeleccionado && data.length > 0) {
          const diaConNombre = data.find((d) => d.nombreCompletoEmpleado);
          const nombreEmpleado =
            diaConNombre?.nombreCompletoEmpleado ||
            empleados.find((e) => e.id === empleadoSeleccionado)
              ?.nombreCompleto ||
            "Empleado";

          const empleadoData = {
            empleadoId: data[0].empleadoId,
            nombreCompleto: nombreEmpleado,
            dias: data,
          };
          setHorarios([empleadoData]);
        } else {
          setHorarios(data);
        }
      } else {
        setNotification({ type: 'error', message: response.message || 'Error al cargar horarios' });
        setTimeout(() => setNotification(null), 3000);
      }
      } catch (error) {
        setNotification({ type: 'error', message: 'Error al conectar con el servidor' });
        setTimeout(() => setNotification(null), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchHorarios();
  }, [fechaInicio, fechaFin, empleadoSeleccionado, empleados]);

  const allDays = horarios[0]?.dias || [];
  const totalPages = Math.ceil(allDays.length / pageSize);

  const visibleDays = allDays.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  const formatDay = (fecha) =>
    new Date(fecha).toLocaleDateString("es-MX", { day: "numeric" });

  const formatMonth = (fecha) =>
    new Date(fecha).toLocaleDateString("es-MX", { month: "short" });

  const coloresTurno = {
    Turno: "bg-blue-200 border-blue-500 text-blue-900",
    Descanso: "bg-green-200 border-green-500 text-green-900",
    Vacaciones: "bg-yellow-200 border-yellow-500 text-yellow-900",
    Permiso: "bg-purple-200 border-purple-500 text-purple-900",
    Guardia: "bg-red-200 border-red-500 text-red-900",
  };

  const handleHorarioClick = (horarioId) => {
    setHorarioSeleccionado(horarioId);
    setShowDetalleModal(true);
  };

  const handleNuevoHorario = () => {
    setHorarioParaEditar(null);
    setShowCrearModal(true);
  };

  const handleEdit = (horario) => {
    setHorarioParaEditar(horario);
    setShowEditarModal(true);
  };

  const handleModalSuccess = () => {
    setNotification({ type: 'success', message: 'Horario guardado exitosamente' });
    setTimeout(() => setNotification(null), 3000);
    
    if (fechaInicio && fechaFin) {
      const fetchHorarios = async () => {
        setLoading(true);
        try {
          const response = await getHorarios(
            fechaInicio,
            fechaFin,
            empleadoSeleccionado
          );
          if (response.success) {
            setHorarios(response.data);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchHorarios();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">Horarios</h2>
            <button
              onClick={handleNuevoHorario}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
            >
              <MdAdd className="text-sm" />
              Nuevo Horario
            </button>
          </div>

          {notification && (
            <div className={`mb-4 p-4 rounded-lg ${
              notification.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {notification.message}
            </div>
          )}

          {/* Filtros */}
          <div className="flex gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Fecha inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Fecha fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Filtrar por empleado
              </label>
              <select
                value={empleadoSeleccionado}
                onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm min-w-[200px]"
              >
                <option value="">Todos los empleados</option>
                {empleados.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombreCompleto}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && fechaInicio && fechaFin && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Cargando horarios...</p>
            </div>
          )}

          {/* Controles */}
          {!loading && horarios.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  disabled={page === 0}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  ← Semana anterior
                </button>

                <span className="font-semibold text-gray-800 text-lg">
                  Semana {page + 1} de {totalPages || 1}
                </span>

                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Semana siguiente →
                </button>
              </div>

              {/* tabka de horarios */}
              <div className="overflow-x-auto border rounded-xl shadow-sm">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                        Empleado
                      </th>

                      {visibleDays.map((d, index) => (
                        <th key={index} className="p-3 text-center border-l">
                          <div className="text-lg font-bold text-gray-800">
                            {formatDay(d.fecha)}
                          </div>
                          <div className="uppercase text-xs text-gray-500 tracking-wide">
                            {formatMonth(d.fecha)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {horarios.map((empleado, empIndex) => (
                      <tr
                        key={`${empleado.empleadoId}-${empIndex}`}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="p-4 font-medium text-gray-700 sticky left-0 bg-white z-10 border-r">
                          {empleado.nombreCompleto}
                        </td>

                        {visibleDays.map((diaVisible, i) => {
                          const dia = empleado.dias?.find(
                            (d) => d.fecha === diaVisible.fecha
                          );

                          return (
                            <td key={i} className="p-3 border-l align-top">
                              {dia && dia.tieneHorario ? (
                                <div
                                  onClick={() =>
                                    handleHorarioClick(dia.horarioId)
                                  }
                                  className={`
                                    ${
                                      coloresTurno[dia.tipoNombre] ||
                                      "bg-blue-200 border-blue-500"
                                    }
                                    border p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition
                                  `}
                                >
                                  <p className="font-semibold text-sm">
                                    {dia.tipoNombre || "Turno"}
                                  </p>

                                  <p className="text-xs mt-1 opacity-90">
                                    {dia.horaEntrada?.slice(0, 5)} -{" "}
                                    {dia.horaSalida?.slice(0, 5)}
                                  </p>
                                </div>
                              ) : (
                                <div className="text-gray-400 text-center text-xs py-4 italic">
                                  Sin turno
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {!loading && (!fechaInicio || !fechaFin) && (
            <div className="text-center py-12 text-gray-500 text-lg">
              Selecciona un rango de fechas para ver los horarios
            </div>
          )}
          {!loading && fechaInicio && fechaFin && horarios.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-lg">
              No hay horarios registrados para este periodo
            </div>
          )}
        </div>

        <HorarioDetalleModal
          isOpen={showDetalleModal}
          onClose={() => setShowDetalleModal(false)}
          horarioId={horarioSeleccionado}
          onSuccess={handleModalSuccess}
          onEdit={handleEdit}
        />

        <HorarioModal
          isOpen={showCrearModal}
          onClose={() => setShowCrearModal(false)}
          onSuccess={handleModalSuccess}
        />

        <HorarioModal
          isOpen={showEditarModal}
          onClose={() => {
            setShowEditarModal(false);
            setHorarioParaEditar(null);
          }}
          horario={horarioParaEditar}
          onSuccess={handleModalSuccess}
        />
      </div>
    </div>
  );
};

export default Schedules;
