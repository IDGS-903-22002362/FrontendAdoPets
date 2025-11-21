// Configuración de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5151/api/v1',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  USUARIOS: {
    BASE: '/usuarios',
    BY_ID: (id) => `/usuarios/${id}`,
    ACTIVATE: (id) => `/usuarios/${id}/activate`,
    DEACTIVATE: (id) => `/usuarios/${id}/deactivate`,
    ROLES: (id) => `/usuarios/${id}/roles`,
  },
  MASCOTA: {
    MASCOTA: '/Mascota',
    ADDPET: '/Mascota',
    ADDPHOTOS: (id) =>  `Mascota/${id}/photos`,
    PETBYID : (id) => `Mascota/${id}`,
    UPDATEPET: (id) =>  `Mascota/${id}`,
    DELETEPET: 'Mascota/delete',
    DELETEPHOTOS: (fotoId) => `Mascota/foto/${fotoId}`
  },
  ADOPCION: {
    GETADOPCION: '/Adopcion/solicitud',
    PUTREVIEW: 'Adopcion/solicitudes/EnRevision',
    PUTACCEPTED    : 'Adopcion/solicitudes/Aceptada',
    PUTREJECTED : 'Adopcion/solicitudes/Rechazada'
  }, 
  SERVICIOS: {
    GETEMPLEADOS: '/Empleados',
    ADDEMPLEADO: '/Empleados',
    UPDATEEMPLEADO: (id) => `/Empleados/${id}`,
    DELETEEMPLEADO: (id) => `/Empleados/${id}`,
    GETEMPLEADO: (id) => `/Empleados/${id}`,
    ACTIVATEEMPLEADO: (id) => `/Empleados/${id}/activate`,
    DEACTIVATEEMPLEADO: (id) => `/Empleados/${id}/deactivate`,
    ADDESPECIALIDADEMPLEADO: (id) => `/Empleados/${id}/especialidades`,
    REMOVEESPECIALIDADEMPLEADO: (id, especialidadId) => `/Empleados/${id}/especialidades/${especialidadId}`,
    // Endpoint de roles 
    GETROLES: '/Empleados/roles',
    // Endpoints para especialidades
    GETESPECIALIDADES: '/Especialidad',
    ADDESPECIALIDAD: '/Especialidad',
    GETESPECIALIDAD: (codigo) => `/Especialidad/${codigo}`,
    // Endpoints para horarios
    GETHORARIOS: '/Horario',
    ADDHORARIO: '/Horario',
    GETHORARIO: (id) => `/Horario/${id}`,
    UPDATEHORARIO: (id) => `/Horario/${id}`,
    DELETEHORARIO: (id) => `/Horario/${id}`,
    GETHORARIOSEMPLEADO: (empleadoId) => `/Horario/empleado/${empleadoId}`,
    GETHORARIOSEMPLEADOEFECTIVO: (empleadoId) => `/Horario/empleado/${empleadoId}/efectivo`,
    GETHORARIOSEMPLEADOAPLICABLE: (empleadoId) => `/Horario/empleado/${empleadoId}/aplicable`,
    GETHORARIOCALENDARIO: '/Horario/calendario',
    GETHORARIOCALENDARIOEMPLEADO: (empleadoId) => `/Horario/empleado/${empleadoId}/calendario`,
  }
};
