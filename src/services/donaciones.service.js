import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class DonacionesService {
  async getDonacionesPublicas(pageNumber = 1, pageSize = 10, filtro = 0) {
    try {
      const response = await apiClient.get(ENDPOINTS.DONACIONES.PUBLICAS, {
        params: { pageNumber, pageSize, filtro }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDonacionesPorUsuario(usuarioId) {
    try {
      const response = await apiClient.get(ENDPOINTS.DONACIONES.POR_USUARIO(usuarioId));
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

export default new DonacionesService();