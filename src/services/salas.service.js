import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class SalasService {
  async list() {
    try {
      const response = await apiClient.get(ENDPOINTS.SALAS.BASE);
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
        status,
      };
    }
    if (error.request) {
      return {
        message: "No se recibió respuesta del servidor",
        errors: ["Verifica tu conexión a internet."],
        status: 0,
      };
    }
    return {
      message: error.message || "Error desconocido",
      errors: [],
      status: 0,
    };
  }
}

export default new SalasService();
