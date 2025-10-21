import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <div className="mb-6 flex justify-center">
            <Logo height="100px" className="drop-shadow-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Página no encontrada
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Lo sentimos, la página que buscas no existe
          </p>
        </div>

        <Link
          to="/"
          className="inline-block bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
