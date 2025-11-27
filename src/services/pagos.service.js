import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class PagosService {
  async createPago(payload) {
    try {
      const response = await apiClient.post(ENDPOINTS.PAGOS.BASE, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createPaypalOrder(payload) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.PAGOS.PAYPAL_ORDER,
        payload
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async capturePaypal(orderId) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.PAGOS.PAYPAL_CAPTURE,
        { orderId }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPagoById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.PAGOS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPagoByOrderId(orderId) {
    try {
      const response = await apiClient.get(
        ENDPOINTS.PAGOS.PAYPAL_BY_ORDER(orderId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPagosByUsuario(usuarioId) {
    try {
      const response = await apiClient.get(
        ENDPOINTS.PAGOS.POR_USUARIO(usuarioId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelarPago(id, motivo) {
    try {
      const response = await apiClient.put(ENDPOINTS.PAGOS.CANCELAR(id), motivo);
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

export default new PagosService();
