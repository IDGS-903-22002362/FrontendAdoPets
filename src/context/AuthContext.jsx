import React, { useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';
import { AuthContext } from './AuthContextValue';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const token = localStorage.getItem('accessToken');

    if (storedUser && token) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser(response.data.usuario);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión',
        errors: error.errors || []
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        setUser(response.data.usuario);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error al registrarse',
        errors: error.errors || []
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      updateUser,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ⭐ AGREGA ESTO
export const useAuth = () => {
  return useContext(AuthContext);
};
