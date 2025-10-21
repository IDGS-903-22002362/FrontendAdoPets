import React from 'react';

const Loading = ({ message = 'Cargando...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary-light">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        {/* Logo animado */}
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
            </svg>
          </div>
        </div>
        
        {/* Mensaje */}
        <p className="text-lg font-semibold text-gray-800">{message}</p>
        <p className="text-sm text-gray-500 mt-2">Por favor espera...</p>
      </div>
    </div>
  );
};

export default Loading;
