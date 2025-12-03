// Definición de roles del sistema (deben coincidir con los nombres del backend)
export const ROLES = {
  ADMIN: 'Admin',
  VETERINARIO: 'Veterinario',
  RECEPCIONISTA: 'Recepcionista',
  ALMACENISTA: 'Almacenista',
  CLIENTE: 'Cliente',
};

// Configuración de permisos por página
export const PAGE_PERMISSIONS = {
  // Páginas administrativas
  '/empleados': [ROLES.ADMIN],
  '/especialidades': [ROLES.ADMIN],
  '/horarios': [ROLES.ADMIN],
  '/salas': [ROLES.ADMIN],
  '/proveedores': [ROLES.ADMIN, ROLES.ALMACENISTA],
  '/inventario': [ROLES.ADMIN, ROLES.ALMACENISTA, ROLES.VETERINARIO],
  '/cobranza': [ROLES.ADMIN, ROLES.RECEPCIONISTA],
  '/pagos': [ROLES.ADMIN, ROLES.RECEPCIONISTA],
  
  // Páginas veterinarias
  '/mis-citas': [ROLES.VETERINARIO],
  '/tickets': [ROLES.ADMIN, ROLES.VETERINARIO, ROLES.RECEPCIONISTA],
  '/expedientes': [ROLES.ADMIN, ROLES.VETERINARIO],
  '/servicios-veterinarios': [ROLES.ADMIN, ROLES.VETERINARIO],
  
  // Páginas de gestión de citas
  '/citas': [ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.VETERINARIO],
  
  // Páginas de adopciones y mascotas
  '/ListPet': [ROLES.ADMIN, ROLES.VETERINARIO, ROLES.RECEPCIONISTA, ROLES.CLIENTE],
  '/solicitud- Adopcione': [ROLES.ADMIN, ROLES.RECEPCIONISTA],
  '/donaciones': [ROLES.ADMIN, ROLES.RECEPCIONISTA],
  
  // Páginas comunes
  '/dashboard': [], // Todos los usuarios autenticados
};

// Función helper para verificar permisos
export const canAccessPage = (userRoles = [], pagePath) => {
  const requiredRoles = PAGE_PERMISSIONS[pagePath];
  
  // Si no hay roles requeridos, todos pueden acceder
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  // Verificar si el usuario tiene al menos uno de los roles requeridos
  return userRoles.some(role => requiredRoles.includes(role));
};
