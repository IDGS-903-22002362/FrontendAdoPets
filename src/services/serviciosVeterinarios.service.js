import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class ServiciosVeterinariosService {
  async getAll(incluirInactivos = false) {
    try {
      const response = await apiClient.get(ENDPOINTS.SERVICIOS_VETERINARIOS.TODOS, {
        params: { incluirInactivos }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.SERVICIOS_VETERINARIOS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(payload) {
    try {
      const response = await apiClient.post(ENDPOINTS.SERVICIOS_VETERINARIOS.BASE, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id, payload) {
    try {
      const response = await apiClient.put(ENDPOINTS.SERVICIOS_VETERINARIOS.BY_ID(id), payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id) {
    try {
      const response = await apiClient.delete(ENDPOINTS.SERVICIOS_VETERINARIOS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async activar(id) {
    try {
      const response = await apiClient.patch(ENDPOINTS.SERVICIOS_VETERINARIOS.ACTIVAR(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const { data, status } = error.response;
      return {
        message: data?.message || "Error en la solicitud",
        errors: data?.errors || [],
        status: status,
      };
    } else if (error.request) {
      return {
        message: "No se recibió respuesta del servidor",
        errors: ["Verifica tu conexión a internet."],
        status: 0,
      };
    } else {
      return {
        message: error.message || "Error desconocido",
        errors: [],
        status: 0,
      };
    }
  }
}

export default new ServiciosVeterinariosService();
