import apiClient from "./api.service";
import { ENDPOINTS } from "../config/api.config";

class AuthService {
  /**
   * Iniciar sesión
   * @param {Object} credentials - { email, password, rememberMe }
   * @returns {Promise<Object>} - Datos del usuario y tokens
   */
  async login(credentials) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      console.log("🔍 Respuesta completa del backend:", response);
      console.log("🔍 response.data:", response.data);

      // Normalizar la respuesta (el backend puede usar 'data' o 'Data')
      const responseData = response.data;
      const success = responseData.success || responseData.Success;
      const data = responseData.data || responseData.Data;
      const message = responseData.message || responseData.Message;

      console.log("🔍 Datos normalizados - success:", success, "data:", data);

      if (success && data) {
        const { accessToken, refreshToken, usuario } = data;
        console.log("💾 Guardando en localStorage:", {
          accessToken,
          refreshToken,
          usuario,
        });

        // Guardar tokens y usuario en localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(usuario));

        return { success: true, data: { usuario }, message };
      }

      return { success: false, message };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>}
   */
  async register(userData) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);

      // Normalizar la respuesta
      const responseData = response.data;
      const success = responseData.success || responseData.Success;
      const data = responseData.data || responseData.Data;
      const message = responseData.message || responseData.Message;

      if (success && data) {
        const { accessToken, refreshToken, usuario } = data;

        // Guardar tokens y usuario en localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(usuario));

        return { success: true, data: { usuario }, message };
      }

      return { success: false, message };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cerrar sesión
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // Limpiar localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }

  /**
   * Obtener usuario actual
   * @returns {Promise<Object>}
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get(ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cambiar contraseña
   * @param {Object} passwordData - { currentPassword, newPassword, confirmNewPassword }
   * @returns {Promise<Object>}
   */
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.AUTH.CHANGE_PASSWORD,
        passwordData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem("accessToken");
    return !!token;
  }

  /**
   * Obtener usuario del localStorage
   * @returns {Object|null}
   */
  getStoredUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} role - Nombre del rol
   * @returns {boolean}
   */
  hasRole(role) {
    const user = this.getStoredUser();
    return user?.roles?.includes(role) || false;
  }

  /**
   * Manejar errores de la API
   * @param {Error} error
   * @returns {Object}
   */
  handleError(error) {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const { data, status } = error.response;
      return {
        message: data?.message || "Error en la solicitud",
        errors: data?.errors || [],
        status,
      };
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      return {
        message:
          "No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:5151",
        errors: [
          "Verifica que tu backend .NET Core esté ejecutándose",
          "Verifica que CORS esté configurado correctamente",
        ],
        status: 0,
      };
    } else {
      // Algo sucedió al configurar la solicitud
      return {
        message: error.message || "Error desconocido",
        errors: [],
        status: 0,
      };
    }
  }
}

export default new AuthService();
