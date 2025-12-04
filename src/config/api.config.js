// Configuración de la API
export const API_CONFIG = {
  BASE_URL:
    //import.meta.env.VITE_API_BASE_URL ||
    //"https://adopetsbkd20251124143834-b0abacgfbsd5fbdz.canadacentral-01.azurewebsites.net/api/v1",
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5151/api/v1",
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
    BASE: "/Pagos",
    BY_ID: (id) => `/Pagos/${id}`,
    POR_USUARIO: (usuarioId) => `/Pagos/usuario/${usuarioId}`,
    POR_CITA: (citaId) => `/Pagos/cita/${citaId}`,
    PENDIENTES: "/Pagos/pendientes",
    PENDIENTES_USUARIO: (usuarioId) => `/Pagos/pendientes/usuario/${usuarioId}`,
    COMPLETAR_PAGO: "/Pagos/completar-pago",
    COMPLETAR_PAGO_PAYPAL: "/Pagos/completar-pago/paypal", // Para citas con anticipo (50%)
    CREAR_PAGO_COMPLETO_PAYPAL: "/Pagos/crear-pago-completo/paypal", // Para citas con deuda completa (100%)
    PAYPAL_ORDER: "/Pagos/paypal/create-order",
    PAYPAL_CAPTURE: (orderId) => `/Pagos/paypal/capture/${orderId}`,
    PAYPAL_BY_ORDER: (orderId) => `/Pagos/paypal/${orderId}`,
    CANCELAR: (id) => `/Pagos/${id}/cancelar`,
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
    PUBLICAS: "/Donaciones/publicas",
    POR_USUARIO: (usuarioId) => `/Donaciones/usuario/${usuarioId}`,
  },
  SERVICIOS_VETERINARIOS: {
    BASE: "/Servicios",
    BY_ID: (id) => `/Servicios/${id}`,
    TODOS: "/Servicios/todos",
    ACTIVAR: (id) => `/Servicios/${id}/activar`,
  },
  TICKETS: {
    BASE: "/Tickets",
    BY_ID: (id) => `/Tickets/${id}`,
  },
  INVENTARIO: {
    ITEMS: "/items/inventario",
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
