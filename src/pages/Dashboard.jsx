import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { canAccessPage } from "../config/roles.config";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Accesos rápidos basados en roles
  const quickActions = [
    {
      title: "Mascotas",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      route: "/ListPet",
      color: "blue",
    },
    {
      title: "Citas",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      route: "/citas",
      color: "green",
    },
    {
      title: "Mis Citas",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      route: "/mis-citas",
      color: "purple",
    },
    {
      title: "Tickets",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      route: "/tickets",
      color: "indigo",
    },
    {
      title: "Inventario",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      route: "/inventario",
      color: "yellow",
    },
    {
      title: "Empleados",
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      route: "/empleados",
      color: "red",
    },
    {
      title: "Solicitudes de Adopción",
      icon: "M9 5h6M9 9h6m-6 4h6m-6 4h6",
      route: "/solicitud- Adopcione",
      color: "teal",
    },
  ];

  // Filtrar acciones según permisos del usuario
  const availableActions = quickActions.filter((action) =>
    canAccessPage(user?.roles || [], action.route)
  );

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
      green: "bg-green-100 text-green-600 hover:bg-green-200",
      purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
      indigo: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
      yellow: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
      red: "bg-red-100 text-red-600 hover:bg-red-200",
      teal: "bg-teal-100 text-teal-600 hover:bg-teal-200",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Dashboard"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-lg p-8 mb-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              ¡Bienvenido, {user?.nombreCompleto || user?.nombre}!
            </h2>
            <p className="text-lg opacity-90">Sistema de Gestión AdoPets</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Mascotas Disponibles
                </p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Adopciones Exitosas
                </p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Usuarios Activos
                </p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Información de Cuenta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Nombre Completo
                </p>
                <p className="text-lg text-gray-900">
                  {user?.nombreCompleto || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Correo Electrónico
                </p>
                <p className="text-lg text-gray-900">
                  {user?.email || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Teléfono
                </p>
                <p className="text-lg text-gray-900">
                  {user?.telefono || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Roles</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user?.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">Sin roles asignados</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {availableActions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Accesos Rápidos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableActions.map((action) => (
                  <button
                    key={action.route}
                    onClick={() => navigate(action.route)}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all text-center group`}
                  >
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-full ${getColorClasses(
                        action.color
                      )} flex items-center justify-center`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={action.icon}
                        />
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-900 group-hover:text-gray-700">
                      {action.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
