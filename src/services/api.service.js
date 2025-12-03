import axios from "axios";
import { API_CONFIG } from "../config/api.config";

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    ...API_CONFIG.HEADERS,
    Accept: "application/json",
  },
  withCredentials: false, // Deshabilitado - no enviar cookies ni credenciales
});

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    // Solo loguear en desarrollo
    if (import.meta.env.DEV) {
      console.log('Request:', config.method.toUpperCase(), config.url);
    }
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    // Solo loguear en desarrollo
    if (import.meta.env.DEV) {
      console.log('Response:', response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    // Solo loguear errores detallados en desarrollo
    if (import.meta.env.DEV) {
      console.error('Response Error:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Request URL:', error.config?.url);
    }
    
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.error('🔌 No se puede conectar al backend en:', API_CONFIG.BASE_URL);
    }

    const originalRequest = error.config;

    // Si el token expiró (401) y no estamos ya reintentando
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          // Intentar refrescar el token
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );

          const { accessToken } = response.data.data;
          localStorage.setItem("accessToken", accessToken);

          // Reintentar la petición original
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir al login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
