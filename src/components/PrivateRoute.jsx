import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return <Loading message="Verificando autenticación..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
