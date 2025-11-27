import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useServices } from "../hooks/useServices";

const HorarioModal = ({ isOpen, onClose, horario = null, onSuccess }) => {
  const { getEmpleados, updateHorario, addHorario } = useServices();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [empleados, setEmpleados] = useState([]);

  const [formData, setFormData] = useState({
    empleadoId: "",
    fecha: "",
    rangoInicio: "",
    rangoFin: "",
    horaEntrada: "",
    horaSalida: "",
    tipo: 1,
    diaSemana: 0,
    notas: "",
  });

  useEffect(() => {
    if (isOpen) {
      cargarEmpleados();
      if (horario) {
        setFormData({
          empleadoId: horario.empleadoId || "",
          fecha: horario.fecha?.split("T")[0] || "",
          rangoInicio: horario.rangoInicio?.split("T")[0] || "",
          rangoFin: horario.rangoFin?.split("T")[0] || "",
          horaEntrada: horario.horaEntrada || "",
          horaSalida: horario.horaSalida || "",
          tipo: horario.tipo || 0,
          diaSemana: horario.diaSemana || 0,
          notas: horario.notas || "",
        });
      } else {
        setFormData({
          empleadoId: "",
          fecha: "",
          rangoInicio: "",
          rangoFin: "",
          horaEntrada: "",
          horaSalida: "",
          tipo: 1,
          diaSemana: 0,
          notas: "",
        });
      }
    }
  }, [isOpen, horario]);

  const cargarEmpleados = async () => {
    try {
      const response = await getEmpleados({ pageNumber: 1, pageSize: 100 });
      if (response.success) {
        setEmpleados(response.data?.items || []);
      }
    } catch (err) {
      console.error("Error al cargar empleados:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (horario) {
        const tipo = parseInt(formData.tipo);
        const updateData = {
          empleadoId: formData.empleadoId,
          fecha: formData.fecha || null,
          rangoInicio: formData.rangoInicio || null,
          rangoFin: formData.rangoFin || null,
          horaEntrada: formData.horaEntrada || null,
          horaSalida: formData.horaSalida || null,
          tipo: tipo,
          diaSemana: [1, 2].includes(tipo) ? parseInt(formData.diaSemana) : null,
          notas: formData.notas || null,
        };
        result = await updateHorario(horario.id, updateData);
      } else {
        const tipo = parseInt(formData.tipo);
        const createData = {
          empleadoId: formData.empleadoId,
          fecha: formData.fecha || null,
          rangoInicio: formData.rangoInicio || null,
          rangoFin: formData.rangoFin || null,
          horaEntrada: formData.horaEntrada || null,
          horaSalida: formData.horaSalida || null,
          tipo: tipo,
          diaSemana: [1, 2].includes(tipo) ? parseInt(formData.diaSemana) : null,
          notas: formData.notas || null,
        };
        result = await addHorario(createData);
      }
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.message || "Error al guardar horario");
      }
    } catch (err) {
      setError("Error al procesar la solicitud");
      console.error("Error completo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      empleadoId: "",
      fecha: "",
      rangoInicio: "",
      rangoFin: "",
      horaEntrada: "",
      horaSalida: "",
      tipo: 1,
      diaSemana: 0,
      notas: "",
    });
    setError(null);
    onClose();
  };

  const diasSemana = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
  ];

  const tiposHorario = [
    { value: 1, label: "Turno" },
    { value: 2, label: "Descanso" },
    { value: 3, label: "Vacaciones" },
    { value: 4, label: "Permiso" },
    { value: 5, label: "Guardia" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {horario ? "Editar Horario" : "Nuevo Horario"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empleado *
              </label>
              <select
                name="empleadoId"
                value={formData.empleadoId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar empleado</option>
                {empleados.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombreCompleto}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Horario *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {tiposHorario.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {parseInt(formData.tipo) === 1 && "Horario recurrente semanal - Se repite cada semana en el día especificado"}
                {parseInt(formData.tipo) === 2 && "Descanso recurrente semanal - Se repite cada semana en el día especificado"}
                {parseInt(formData.tipo) === 3 && "Periodo vacacional continuo - Aplica todos los días del rango"}
                {parseInt(formData.tipo) === 4 && "Periodo de permiso continuo - Aplica todos los días del rango"}
                {parseInt(formData.tipo) === 5 && "Periodo de guardia continuo - Aplica todos los días del rango"}
              </p>
            </div>

            {/* Fechas - Muestra diferentes ayudas según el tipo */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                {[3, 4, 5].includes(parseInt(formData.tipo)) 
                  ? "Periodo Continuo" 
                  : "Horario Recurrente Semanal"}
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                {[1, 2].includes(parseInt(formData.tipo)) && (
                  <span className="font-medium">Defina el día de la semana y el periodo. Puede ser una fecha única o un rango. Ejemplo: "Lunes de 9:00 a 17:00 desde enero hasta marzo"</span>
                )}
                {[3, 4, 5].includes(parseInt(formData.tipo)) && (
                  <span className="font-medium">Para un solo día use solo "Rango Inicio". Para varios días especifique ambas fechas. Ejemplo: "Del 1 al 7 de enero" o "Solo el 15 de enero"</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rango Inicio *
                </label>
                <input
                  type="date"
                  name="rangoInicio"
                  value={formData.rangoInicio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Fecha de inicio del periodo</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rango Fin
                </label>
                <input
                  type="date"
                  name="rangoFin"
                  value={formData.rangoFin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Opcional: dejar vacío para un solo día</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Específica
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={formData.rangoInicio || formData.rangoFin}
                />
                <p className="text-xs text-gray-500 mt-1">Alternativa: fecha única</p>
              </div>
            </div>

            {/* Día de la semana - Solo para Turnos y Descansos (recurrentes semanales) */}
            {[1, 2].includes(parseInt(formData.tipo)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Día de la Semana *
                </label>
                <select
                  name="diaSemana"
                  value={formData.diaSemana}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {diasSemana.map((dia) => (
                    <option key={dia.value} value={dia.value}>
                      {dia.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  El horario se repetirá cada semana en este día, durante el rango de fechas especificado
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Entrada
                </label>
                <input
                  type="time"
                  name="horaEntrada"
                  value={formData.horaEntrada}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Salida
                </label>
                <input
                  type="time"
                  name="horaSalida"
                  value={formData.horaSalida}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Agregar notas adicionales..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading
                ? "Guardando..."
                : horario
                ? "Actualizar"
                : "Crear Horario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HorarioModal;
