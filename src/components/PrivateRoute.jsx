import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "./Loading";

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, hasRole, user } = useAuth();

  console.log(
    "🛡️ PrivateRoute - isAuthenticated:",
    isAuthenticated,
    "loading:",
    loading,
    "user:",
    user
  );

  if (loading) {
    console.log("⏳ PrivateRoute - Mostrando Loading...");
    return <Loading message="Verificando autenticación..." />;
  }

  if (!isAuthenticated) {
    console.log("❌ PrivateRoute - No autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    console.log(
      "⛔ PrivateRoute - Sin rol requerido, redirigiendo a /unauthorized"
    );
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ PrivateRoute - Autenticado, mostrando contenido");
  return children;
};

export default PrivateRoute;
