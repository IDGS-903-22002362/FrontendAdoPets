// Configuración de la API
export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://192.168.100.5:5151/api/v1",
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  USUARIOS: {
    BASE: "/usuarios",
    BY_ID: (id) => `/usuarios/${id}`,
    ACTIVATE: (id) => `/usuarios/${id}/activate`,
    DEACTIVATE: (id) => `/usuarios/${id}/deactivate`,
    ROLES: (id) => `/usuarios/${id}/roles`,
    ADOPTANTES_MASCOTAS: "/usuarios/adoptantes/mascotas",
    ADOPTANTE_MASCOTAS: (usuarioId) =>
      `/usuarios/adoptantes/${usuarioId}/mascotas`,
  },
  SALAS: {
    BASE: "/salas",
  },
  MASCOTA: {
    MASCOTA: "/Mascota",
    ADDPET: "/Mascota",
    ADDPHOTOS: (id) => `Mascota/${id}/photos`,
    PETBYID: (id) => `Mascota/${id}`,
    UPDATEPET: (id) => `Mascota/${id}`,
    DELETEPET: "Mascota/delete",
    DELETEPHOTOS: (fotoId) => `Mascota/foto/${fotoId}`,
  },
  ADOPCION: {
    GETADOPCION: "/Adopcion/solicitud",
    PUTREVIEW: "Adopcion/solicitudes/EnRevision",
    PUTACCEPTED: "Adopcion/solicitudes/Aceptada",
    PUTREJECTED: "Adopcion/solicitudes/Rechazada",
  },
  CITAS: {
    BASE: "/citas",
    BY_ID: (id) => `/citas/${id}`,
    POR_VETERINARIO: (id) => `/citas/veterinario/${id}`,
    POR_ESTADO: (status) => `/citas/estado/${status}`,
    POR_PROPIETARIO: (id) => `/citas/propietario/${id}`,
    DISPONIBILIDAD: "/citas/disponibilidad",
    CANCELAR: (id) => `/citas/${id}/cancelar`,
    COMPLETAR: (id) => `/citas/${id}/completar`,
    DELETE: (id) => `/citas/${id}`,
    POR_SOLICITUD: (id) => `/citas/solicitud/${id}`,
  },
  PAGOS: {
    BASE: "/pagos",
    BY_ID: (id) => `/pagos/${id}`,
    POR_USUARIO: (usuarioId) => `/pagos/usuario/${usuarioId}`,
    PAYPAL_ORDER: "/pagos/paypal/create-order",
    PAYPAL_CAPTURE: "/pagos/paypal/capture",
    PAYPAL_BY_ORDER: (orderId) => `/pagos/paypal/${orderId}`,
    CANCELAR: (id) => `/pagos/${id}/cancelar`,
  },
  CITAS_DIGITALES: {
    BASE: "/solicitudescitasdigitales",
    BY_ID: (id) => `/solicitudescitasdigitales/${id}`,
    POR_USUARIO: (usuarioId) =>
      `/solicitudescitasdigitales/usuario/${usuarioId}`,
    PENDIENTES: "/solicitudescitasdigitales/pendientes",
    EN_REVISION: (id) => `/solicitudescitasdigitales/${id}/en-revision`,
    VERIFICAR: "/solicitudescitasdigitales/verificar-disponibilidad",
    CONFIRMAR: "/solicitudescitasdigitales/confirmar",
    RECHAZAR: "/solicitudescitasdigitales/rechazar",
  },
  DONACIONES: {
    PUBLICAS: '/Donaciones/publicas',
    POR_USUARIO: (usuarioId) => `/Donaciones/usuario/${usuarioId}`
  },
  SERVICIOS_VETERINARIOS: {
    BASE: '/Servicios',
    BY_ID: (id) => `/Servicios/${id}`,
    TODOS: '/Servicios/todos',
    ACTIVAR: (id) => `/Servicios/${id}/activar`
  },
  SERVICIOS: {
    GETEMPLEADOS: "/Empleados",
    ADDEMPLEADO: "/Empleados",
    UPDATEEMPLEADO: (id) => `/Empleados/${id}`,
    DELETEEMPLEADO: (id) => `/Empleados/${id}`,
    GETEMPLEADO: (id) => `/Empleados/${id}`,
    ACTIVATEEMPLEADO: (id) => `/Empleados/${id}/activate`,
    DEACTIVATEEMPLEADO: (id) => `/Empleados/${id}/deactivate`,
    ADDESPECIALIDADEMPLEADO: (id) => `/Empleados/${id}/especialidades`,
    REMOVEESPECIALIDADEMPLEADO: (id, especialidadId) =>
      `/Empleados/${id}/especialidades/${especialidadId}`,
    // Endpoint de roles
    GETROLES: "/Empleados/roles",
    // Endpoints para especialidades
    GETESPECIALIDADES: "/Especialidad",
    ADDESPECIALIDAD: "/Especialidad",
    GETESPECIALIDAD: (codigo) => `/Especialidad/${codigo}`,
    // Endpoints para horarios
    GETHORARIOS: "/Horario",
    ADDHORARIO: "/Horario",
    GETHORARIO: (id) => `/Horario/${id}`,
    UPDATEHORARIO: (id) => `/Horario/${id}`,
    DELETEHORARIO: (id) => `/Horario/${id}`,
    GETHORARIOSEMPLEADO: (empleadoId) => `/Horario/empleado/${empleadoId}`,
    GETHORARIOSEMPLEADOEFECTIVO: (empleadoId) =>
      `/Horario/empleado/${empleadoId}/efectivo`,
    GETHORARIOSEMPLEADOAPLICABLE: (empleadoId) =>
      `/Horario/empleado/${empleadoId}/aplicable`,
    GETHORARIOCALENDARIO: "/Horario/calendario",
    GETHORARIOCALENDARIOEMPLEADO: (empleadoId) =>
      `/Horario/empleado/${empleadoId}/calendario`,
  },
};
