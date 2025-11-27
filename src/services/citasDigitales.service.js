import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class CitasDigitalesService {
  async getPendientes() {
    try {
      const response = await apiClient.get(ENDPOINTS.CITAS_DIGITALES.PENDIENTES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByUsuario(usuarioId) {
    try {
      const response = await apiClient.get(
        ENDPOINTS.CITAS_DIGITALES.POR_USUARIO(usuarioId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.CITAS_DIGITALES.BY_ID(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async setEnRevision(id, revisadoPorId) {
    try {
      const response = await apiClient.put(
        ENDPOINTS.CITAS_DIGITALES.EN_REVISION(id),
        { revisadoPorId }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verificarDisponibilidad(payload) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.CITAS_DIGITALES.VERIFICAR,
        payload
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async confirmar(payload) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.CITAS_DIGITALES.CONFIRMAR,
        payload
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async rechazar(payload) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.CITAS_DIGITALES.RECHAZAR,
        payload
      );
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
    } else if (error.request) {
      return {
        message: "No se recibi\u00f3 respuesta del servidor",
        errors: ["Verifica tu conexi\u00f3n a internet."],
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

export default new CitasDigitalesService();
