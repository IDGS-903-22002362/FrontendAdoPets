import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import ParticleBackground from "../components/ParticleBackground";

const Home = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <ParticleBackground />
      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Logo o Icono */}
        <div className="mb-8">
          <div className="mb-6 flex justify-center">
            <Logo height="120px" className="drop-shadow-2xl" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            AdoPets
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-2">
            Encuentra tu compañero ideal
          </p>
          <p className="text-lg text-gray-600">
            Dale un hogar a una mascota que lo necesita
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-primary text-white hover:bg-primary-dark font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto bg-white text-primary border-2 border-primary hover:bg-gray-50 font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Registrarse
          </Link>
        </div>

        {/* Características */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="text-primary mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-gray-900 font-semibold text-lg mb-2">
              Adopción Responsable
            </h3>
            <p className="text-gray-600 text-sm">
              Conectamos mascotas con familias amorosas
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="text-primary mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-gray-900 font-semibold text-lg mb-2">
              Proceso Seguro
            </h3>
            <p className="text-gray-600 text-sm">
              Verificación y seguimiento de cada adopción
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="text-primary mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-gray-900 font-semibold text-lg mb-2">
              Comunidad Activa
            </h3>
            <p className="text-gray-600 text-sm">
              Únete a miles de personas que aman a los animales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
