import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class TicketsService {
  async list(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.TICKETS.BASE, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.TICKETS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(payload) {
    try {
      const response = await apiClient.post(ENDPOINTS.TICKETS.BASE, payload);
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
        backendError: data
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

export default new TicketsService();
