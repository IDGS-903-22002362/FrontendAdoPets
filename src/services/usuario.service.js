import apiClient from './api.service';
import { ENDPOINTS } from '../config/api.config';

class UsuarioService {
  /**
   * Obtener lista de usuarios paginada
   * @param {number} pageNumber
   * @param {number} pageSize
   * @returns {Promise<Object>}
   */
  async getUsuarios(pageNumber = 1, pageSize = 10) {
    try {
      const response = await apiClient.get(ENDPOINTS.USUARIOS.BASE, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtener usuario por ID
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getUsuarioById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.USUARIOS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Crear nuevo usuario
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async createUsuario(userData) {
    try {
      const response = await apiClient.post(ENDPOINTS.USUARIOS.BASE, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Actualizar usuario
   * @param {string} id
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async updateUsuario(id, userData) {
    try {
      const response = await apiClient.put(ENDPOINTS.USUARIOS.BY_ID(id), userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Eliminar usuario
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async deleteUsuario(id) {
    try {
      const response = await apiClient.delete(ENDPOINTS.USUARIOS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Activar usuario
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async activateUsuario(id) {
    try {
      const response = await apiClient.patch(ENDPOINTS.USUARIOS.ACTIVATE(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Desactivar usuario
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async deactivateUsuario(id) {
    try {
      const response = await apiClient.patch(ENDPOINTS.USUARIOS.DEACTIVATE(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Asignar roles a usuario
   * @param {string} id
   * @param {Array<string>} rolesIds
   * @returns {Promise<Object>}
   */
  async assignRoles(id, rolesIds) {
    try {
      const response = await apiClient.post(ENDPOINTS.USUARIOS.ROLES(id), rolesIds);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Manejar errores
   * @param {Error} error
   * @returns {Object}
   */
  handleError(error) {
    if (error.response) {
      const { data, status } = error.response;
      return {
        message: data?.message || 'Error en la solicitud',
        errors: data?.errors || [],
        status,
      };
    } else if (error.request) {
      return {
        message: 'No se pudo conectar con el servidor',
        errors: ['Verifica tu conexión a internet'],
        status: 0,
      };
    } else {
      return {
        message: error.message || 'Error desconocido',
        errors: [],
        status: 0,
      };
    }
  }
}

export default new UsuarioService();
