import React, { useState, useEffect } from "react";
import { MdClose, MdAdd, MdDelete } from "react-icons/md";
import { useServices } from "../hooks/useServices";

const EmpleadoModal = ({ isOpen, onClose, empleado = null, onSuccess }) => {
  const { registerEmpleado, updateEmpleado, getEspecialidades, getRoles } =
    useServices();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [especialidadesList, setEspecialidadesList] = useState([]);
  const [rolesList, setRolesList] = useState([]);

  const [formData, setFormData] = useState({
    usuario: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      telefono: "",
      password: "",
      rolesIds: [],
    },
    cedula: "",
    disponibilidad: "",
    emailLaboral: "",
    telefonoLaboral: "",
    tipo: 0,
    sueldo: 0,
    especialidades: [],
  });

  const [especialidadTemp, setEspecialidadTemp] = useState({
    especialidadId: "",
    certificacion: "",
  });

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
      if (empleado) {
        setFormData({
          usuario: {
            nombre: empleado.nombre || "",
            apellidoPaterno: empleado.apellidoPaterno || "",
            apellidoMaterno: empleado.apellidoMaterno || "",
            email: empleado.emailLaboral || "",
            telefono: empleado.telefonoLaboral || "",
            password: "",
            rolesIds: [],
          },
          cedula: empleado.cedula || "",
          disponibilidad: empleado.disponibilidad || "",
          emailLaboral: empleado.emailLaboral || "",
          telefonoLaboral: empleado.telefonoLaboral || "",
          tipo: empleado.tipo || 0,
          sueldo: empleado.sueldo || 0,
          especialidades:
            empleado.especialidades?.map((esp) => ({
              especialidadId: esp.especialidadId,
              certificacion: esp.certificacion || "",
            })) || [],
        });
      } else {
        setFormData({
          usuario: {
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            email: "",
            telefono: "",
            password: "",
            rolesIds: [],
          },
          cedula: "",
          disponibilidad: "",
          emailLaboral: "",
          telefonoLaboral: "",
          tipo: 0,
          sueldo: 0,
          especialidades: [],
        });
      }
    }
  }, [isOpen, empleado]);

  const cargarDatos = async () => {
    try {
      const [especialidadesRes, rolesRes] = await Promise.all([
        getEspecialidades(),
        getRoles(),
      ]);

      console.log("Respuesta especialidades:", especialidadesRes);
      console.log("Respuesta roles:", rolesRes);

      if (especialidadesRes.success) {
        const items = especialidadesRes.data?.data || [];
        console.log("Especialidades cargadas:", items);
        setEspecialidadesList(items);
      }

      if (rolesRes.success) {
        const roles = rolesRes.data?.data || [];
        console.log("Roles cargados:", roles);
        const rolesFiltrados = roles
          .filter((role) => role.nombre !== "Adoptante")
          .map((role) => ({
            ...role,
            nombre: role.nombre === "Admin" ? "Administrador" : role.nombre,
          }));
        console.log("Roles filtrados:", rolesFiltrados);
        setRolesList(rolesFiltrados);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("usuario.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        usuario: {
          ...prev.usuario,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRoleChange = (roleId) => {
    setFormData((prev) => {
      const rolesIds = prev.usuario.rolesIds.includes(roleId)
        ? prev.usuario.rolesIds.filter((id) => id !== roleId)
        : [...prev.usuario.rolesIds, roleId];

      return {
        ...prev,
        usuario: {
          ...prev.usuario,
          rolesIds,
        },
      };
    });
  };

  const agregarEspecialidad = () => {
    if (especialidadTemp.especialidadId && especialidadTemp.certificacion) {
      setFormData((prev) => ({
        ...prev,
        especialidades: [...prev.especialidades, { ...especialidadTemp }],
      }));
      setEspecialidadTemp({ especialidadId: "", certificacion: "" });
    }
  };

  const eliminarEspecialidad = (index) => {
    setFormData((prev) => ({
      ...prev,
      especialidades: prev.especialidades.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (empleado) {
        const updateData = {
          cedula: formData.cedula,
          nombre: formData.usuario.nombre,
          apellidoPaterno: formData.usuario.apellidoPaterno,
          apellidoMaterno: formData.usuario.apellidoMaterno || "",
          disponibilidad: formData.disponibilidad,
          emailLaboral: formData.emailLaboral,
          telefonoLaboral: formData.telefonoLaboral,
          tipo: parseInt(formData.tipo),
          sueldo: parseFloat(formData.sueldo),
          especialidades: formData.especialidades,
        };
        console.log("ID del empleado:", empleado.id);
        console.log(
          "Datos para actualizar:",
          JSON.stringify(updateData, null, 2)
        );
        result = await updateEmpleado(empleado.id, updateData);
      } else {
        const createData = {
          usuario: {
            nombre: formData.usuario.nombre,
            apellidoPaterno: formData.usuario.apellidoPaterno,
            apellidoMaterno: formData.usuario.apellidoMaterno || "",
            email: formData.usuario.email,
            telefono: formData.usuario.telefono || "",
            password: formData.usuario.password || "Adopets2025Empleado*",
            rolesIds: formData.usuario.rolesIds,
          },
          cedula: formData.cedula,
          disponibilidad: formData.disponibilidad,
          emailLaboral: formData.emailLaboral,
          telefonoLaboral: formData.telefonoLaboral,
          tipo: parseInt(formData.tipo),
          sueldo: parseFloat(formData.sueldo),
          especialidades: formData.especialidades,
        };
        console.log("Datos para crear:", JSON.stringify(createData, null, 2));
        result = await registerEmpleado(createData);
      }

      console.log("Resultado:", result);

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.message || "Error al guardar empleado");
      }
    } catch (err) {
      setError("Error al procesar la solicitud");
      console.error("Error completo:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold text-gray-800">
            {empleado ? "Editar Empleado" : "Nuevo Empleado"}
          </h2>
          <button
            onClick={onClose}
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

          {/* Datos personales - SIEMPRE VISIBLE */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="usuario.nombre"
                  value={formData.usuario.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Paterno *
                </label>
                <input
                  type="text"
                  name="usuario.apellidoPaterno"
                  value={formData.usuario.apellidoPaterno}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  name="usuario.apellidoMaterno"
                  value={formData.usuario.apellidoMaterno}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Datos de usuario - SOLO AL CREAR */}
          {!empleado && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Datos de Usuario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Personal *
                  </label>
                  <input
                    type="email"
                    name="usuario.email"
                    value={formData.usuario.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono Personal
                  </label>
                  <input
                    type="tel"
                    name="usuario.telefono"
                    value={formData.usuario.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="usuario.password"
                    value={formData.usuario.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dejar vacío para usar: Adopets2025Empleado*"
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Si se deja vacío, se usará la contraseña por defecto
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roles *
                </label>
                <div className="flex flex-wrap gap-3">
                  {rolesList.map((role) => (
                    <label
                      key={role.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.usuario.rolesIds.includes(role.id)}
                        onChange={() => handleRoleChange(role.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {role.nombre}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Datos del Empleado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula *
                </label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Laboral *
                </label>
                <input
                  type="email"
                  name="emailLaboral"
                  value={formData.emailLaboral}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono Laboral *
                </label>
                <input
                  type="tel"
                  name="telefonoLaboral"
                  value={formData.telefonoLaboral}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value={0}>Veterinario</option>
                  <option value={1}>Asistente</option>
                  <option value={2}>Administrativo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sueldo *
                </label>
                <input
                  type="number"
                  name="sueldo"
                  value={formData.sueldo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponibilidad *
                </label>
                <input
                  type="text"
                  name="disponibilidad"
                  value={formData.disponibilidad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Lunes a Viernes 9:00-17:00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Especialidades
            </h3>

            <div className="flex gap-2 mb-4">
              <select
                value={especialidadTemp.especialidadId}
                onChange={(e) =>
                  setEspecialidadTemp({
                    ...especialidadTemp,
                    especialidadId: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar especialidad</option>
                {especialidadesList.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.codigo}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Certificación"
                value={especialidadTemp.certificacion}
                onChange={(e) =>
                  setEspecialidadTemp({
                    ...especialidadTemp,
                    certificacion: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={agregarEspecialidad}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
              >
                <MdAdd />
              </button>
            </div>

            <div className="space-y-2">
              {formData.especialidades.map((esp, index) => {
                const especialidad = especialidadesList.find(
                  (e) => e.id === esp.especialidadId
                );
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200"
                  >
                    <div>
                      <span className="font-medium text-blue-800">
                        {especialidad?.codigo}
                      </span>
                      <span className="text-blue-600 ml-2">
                        - {esp.certificacion}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarEspecialidad(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDelete />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
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
                : empleado
                ? "Actualizar"
                : "Crear Empleado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpleadoModal;
