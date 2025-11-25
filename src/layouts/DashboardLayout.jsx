// src/layouts/DashboardLayout.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user, handleLogout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo height="40px" className="mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">AdoPets</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.nombreCompleto}</p>
                <p className="text-xs text-gray-500">{user?.roles?.join(", ")}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn-secondary text-sm">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Layout principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-transparent hidden md:block">
          <Sidebar />
        </aside>

        {/* Contenido dinámico */}
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
