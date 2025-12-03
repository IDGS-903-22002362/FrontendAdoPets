import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class AdoptantesService {
  async listarConMascotas() {
    try {
      const response = await apiClient.get(ENDPOINTS.USUARIOS.ADOPTANTES_MASCOTAS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(usuarioId) {
    try {
      const response = await apiClient.get(ENDPOINTS.USUARIOS.ADOPTANTE_MASCOTAS(usuarioId));
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

export default new AdoptantesService();
