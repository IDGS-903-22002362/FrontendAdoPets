import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ onClose }) => {
  return (
    <div className="bg-white shadow-xl rounded-xl p-6 w-64 h-full relative">
      {/* Botón Cerrar en móvil */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-600 hover:bg-gray-100 rounded-full md:hidden"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Menú */}
      <nav className="space-y-4 mt-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m0 0H5m4 0h4"
            />
          </svg>
          Inicio
        </Link>
        <Link
          to="/inventario"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5L12 3l9 4.5M3 7.5v9L12 21m9-13.5v9L12 21m0-9l9-4.5m-9 4.5L3 12"
            />
          </svg>
          Inventario
        </Link>

        <Link
          to="/ListPet"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Mascotas
        </Link>

        <Link
          to="/citas"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Citas
        </Link>

        <Link
          to="/solicitud- Adopcione"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5h6M9 9h6m-6 4h6m-6 4h6"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h2v12H4z"
            />
          </svg>
          Solicitudes
        </Link>

        <Link
          to="/pagos"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-3a2 2 0 00-2 2v0a2 2 0 002 2h3m0-4h2a2 2 0 012 2v0a2 2 0 01-2 2h-2m0-4v4m-7 6h8m-6-4h4" />
          </svg>
          Pagos
        </Link>

        <Link
          to="/cobranza"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.12-3 2.5S10.343 13 12 13s3 1.12 3 2.5S13.657 18 12 18m0-10c1.03 0 1.93.39 2.536 1M12 8c-1.03 0-1.93.39-2.536 1M12 6v2m0 10v-2m8-5a8 8 0 11-16 0 8 8 0 0116 0z" />
          </svg>
          Cobranza
        </Link>

        <Link
          to="/perfil"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Mi Perfil
        </Link>

        <Link
          to="/configuracion"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
          </svg>
          Configuración
        </Link>
        <Link
          to="/proveedores"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 17l-3.5-3.5a2.1 2.1 0 010-3L8 7m8 10l3.5-3.5a2.1 2.1 0 000-3L16 7m-8 10l4 2 4-2m-8-10l4-2 4 2m-8 0l4 4 4-4"
            />
          </svg>
          Proveedores
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
