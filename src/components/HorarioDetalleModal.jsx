import React, { useState, useEffect } from "react";
import {
  MdClose,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { useServices } from "../hooks/useServices";
import Loading from "./Loading";

const HorarioDetalleModal = ({ isOpen, onClose, horarioId, onSuccess, onEdit }) => {
  const { getHorarioById, deleteHorario } = useServices();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [horario, setHorario] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && horarioId) {
      cargarHorario();
    }
  }, [isOpen, horarioId]);

  const cargarHorario = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHorarioById(horarioId);
      if (result && result.success) {
        setHorario(result.data);
      } else {
        setError(result?.message || "Error al cargar el horario");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error("Error al cargar horario:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    setLoading(true);
    try {
      const result = await deleteHorario(horarioId);
      if (result && result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result?.message || "Error al eliminar el horario");
      }
    } catch (err) {
      setError("Error al eliminar el horario");
      console.error("Error:", err);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const tiposHorario = {
    1: "Turno",
    2: "Descanso",
    3: "Vacaciones",
    4: "Permiso",
    5: "Guardia",
  };

  const coloresTurno = {
    1: "bg-blue-200 border-blue-500 text-blue-900 p-1 rounded-lg",
    2: "bg-green-200 border-green-500 text-green-900 p-1 rounded-lg",
    3: "bg-yellow-200 border-yellow-500 text-yellow-900 p-1 rounded-lg",
    4: "bg-purple-200 border-purple-500 text-purple-900 p-1 rounded-lg",
    5: "bg-red-200 border-red-500 text-red-900 p-1 rounded-lg",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pt-6 px-6 border-b">
          <h2 className="text-2xl font-bold">Detalle del Horario</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <Loading message="Cargando horario..." />
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : horario ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Información del Empleado
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="text-sm font-medium text-gray-800">
                      {horario.nombreCompletoEmpleado}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cédula</p>
                    <p className="text-sm font-medium text-gray-800">
                      {horario.cedulaEmpleado}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tipo</p>
                    <p className="text-sm font-medium text-gray-800">
                      {horario.tipoEmpleado}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800">
                      {horario.emailLaboralEmpleado}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Fecha
                    </label>
                  </div>
                  <p className="text-gray-800">{formatDate(horario.fecha)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Tipo
                    </label>
                  </div>
                  <span
                    className={`${coloresTurno[horario.tipo] || "bg-blue-200 border-blue-500"}`}
                  >
                    {tiposHorario[horario.tipo] || "Turno"}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Hora Entrada
                    </label>
                  </div>
                  <p className="text-lg text-gray-800">
                    {horario.horaEntrada?.slice(0, 5) || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Hora Salida
                    </label>
                  </div>
                  <p className="text-lg text-gray-800">
                    {horario.horaSalida?.slice(0, 5) || "N/A"}
                  </p>
                </div>
              </div>

              {horario.rangoInicio && horario.rangoFin && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Rango de aplicación del horario
                  </label>
                  <p className="text-sm text-gray-800">
                    {formatDate(horario.rangoInicio)} -{" "}
                    {formatDate(horario.rangoFin)}
                  </p>
                </div>
              )}

              {horario.notas && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Notas
                    </label>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    {horario.notas}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontró información</p>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              disabled={loading}
            >
              <MdDelete className="text-lg" />
              Eliminar
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              onClick={() => {
                if (onEdit && horario) {
                  onEdit(horario);
                }
                onClose();
              }}
            >
              <MdEdit className="text-lg" />
              Editar
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar este horario? Esta acción no
              se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorarioDetalleModal;
