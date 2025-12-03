import React from "react";
import { useAuth } from "../hooks/useAuth";

const Header = ({ title, setIsSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm h-20 flex items-center px-4 lg:px-8">
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="md:hidden mr-4 p-2 rounded-lg hover:bg-gray-100"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      
      <div className="ml-auto flex items-center mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold">
            {user?.nombre?.charAt(0)}
            {user?.apellidoPaterno?.charAt(0)}
          </span>
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.nombre} {user?.apellidoPaterno}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
