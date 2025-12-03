import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

// Mapeo de rutas a títulos y menú activo (fuera del componente para evitar recreación)
const routeConfig = {
  '/dashboard': { title: 'Dashboard', menu: 'dashboard' },
  '/ListPet': { title: 'Gestión de Mascotas', menu: 'mascotas' },
  '/solicitud- Adopcione': { title: 'Solicitudes de Adopción', menu: 'adopciones' },
  '/empleados': { title: 'Gestión de Empleados', menu: 'empleados' },
  '/especialidades': { title: 'Especialidades', menu: 'especialidades' },
  '/horarios': { title: 'Gestión de Horarios', menu: 'horarios' },
  '/salas': { title: 'Gestión de Salas', menu: 'salas' },
  '/citas': { title: 'Administración de Citas', menu: 'citas' },
  '/proveedores': { title: 'Gestión de Proveedores', menu: 'proveedores' },
  '/inventario': { title: 'Control de Inventario', menu: 'inventario' },
  '/pagos': { title: 'Gestión de Pagos', menu: 'pagos' },
  '/cobranza': { title: 'Control de Cobranza', menu: 'cobranza' },
  '/tickets': { title: 'Gestión de Tickets', menu: 'tickets' },
  '/expedientes': { title: 'Expedientes', menu: 'expedientes' },
  '/perfil': { title: 'Mi Perfil', menu: 'perfil' },
  '/configuracion': { title: 'Configuración', menu: 'configuracion' },
};

const DashboardLayout = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('AdoPets');
  const location = useLocation();

  // Actualizar título y menú activo basado en la ruta actual
  useEffect(() => {
    const config = routeConfig[location.pathname];
    if (config) {
      setPageTitle(config.title);
      setActiveMenu(config.menu);
    } else {
      setPageTitle('AdoPets');
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header 
          title={pageTitle} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
