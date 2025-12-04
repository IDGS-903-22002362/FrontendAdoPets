import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";
import axios from "axios";

// Cache para evitar capturas duplicadas del mismo orderId
const pendingCaptures = new Map(); // orderId -> Promise
const completedCaptures = new Map(); // orderId -> resultado

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
    if (!orderId) {
      throw {
        success: false,
        message: "Falta el orderId para capturar el pago",
      };
    }

    // Evita lanzar otra peticion si ya hay una en curso para el mismo orderId
    if (pendingCaptures.has(orderId)) {
      console.log("[payPal] Captura ya en curso, reutilizando promesa:", orderId);
      return pendingCaptures.get(orderId);
    }

    // Si ya se capturo exitosamente, no volver a golpear el backend
    if (completedCaptures.has(orderId)) {
      console.log("[payPal] Order ID ya capturado, devolviendo cache:", orderId);
      return completedCaptures.get(orderId);
    }

    const capturePromise = (async () => {
      try {
        const endpoint = ENDPOINTS.PAGOS.PAYPAL_CAPTURE(orderId);
        console.log("[payPal] Capturando pago con Order ID:", orderId);
        console.log("[payPal] Endpoint:", endpoint);

        const token = localStorage.getItem("accessToken");
        const fullUrl = `${apiClient.defaults.baseURL}${endpoint}`;

        console.log("[payPal] Full URL:", fullUrl);
        console.log("[payPal] Token:", token ? "Present" : "Missing");

        const response = await fetch(fullUrl, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log(
          "[payPal] Response status:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("[payPal] Error response:", errorData);
          throw new Error(`HTTP ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        console.log("[payPal] Pago capturado exitosamente:", data);
        completedCaptures.set(orderId, data);
        return data;
      } catch (error) {
        console.error("[payPal] Error al capturar pago:", {
          message: error.message,
          orderId: orderId,
        });

        throw {
          success: false,
          message: error.message || "Error al capturar el pago",
          details: error.response?.data,
          status: error.response?.status,
        };
      } finally {
        pendingCaptures.delete(orderId);
      }
    })();

    pendingCaptures.set(orderId, capturePromise);
    return capturePromise;
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

  async getPagosByCita(citaId) {
    try {
      const response = await apiClient.get(ENDPOINTS.PAGOS.POR_CITA(citaId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPagosPendientes() {
    try {
      const response = await apiClient.get(ENDPOINTS.PAGOS.PENDIENTES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPagosPendientesByUsuario(usuarioId) {
    try {
      const response = await apiClient.get(
        ENDPOINTS.PAGOS.PENDIENTES_USUARIO(usuarioId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async completarPago(payload) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.PAGOS.COMPLETAR_PAGO,
        payload
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async completarPagoPaypal(payload) {
    try {
      console.log("[payPal] Completar pago PayPal (anticipo 50%)");
      console.log("[payPal] Endpoint:", ENDPOINTS.PAGOS.COMPLETAR_PAGO_PAYPAL);
      console.log("[payPal] Payload:", payload);

      const response = await apiClient.post(
        ENDPOINTS.PAGOS.COMPLETAR_PAGO_PAYPAL,
        payload
      );

      console.log("[payPal] Respuesta backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("[payPal] Error completar pago PayPal:", error);
      throw this.handleError(error);
    }
  }

  async crearPagoCompletoPaypal(payload) {
    try {
      console.log("[payPal] Crear pago completo PayPal (100%)");
      console.log(
        "[payPal] Endpoint:",
        ENDPOINTS.PAGOS.CREAR_PAGO_COMPLETO_PAYPAL
      );
      console.log("[payPal] Payload:", payload);

      const response = await apiClient.post(
        ENDPOINTS.PAGOS.CREAR_PAGO_COMPLETO_PAYPAL,
        payload
      );

      console.log("[payPal] Respuesta backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("[payPal] Error crear pago completo PayPal:", error);
      throw this.handleError(error);
    }
  }

  async cancelarPago(id, motivo) {
    try {
      const response = await apiClient.put(ENDPOINTS.PAGOS.CANCELAR(id), {
        motivo,
      });
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
        message: "No se recibio respuesta del servidor",
        errors: ["Verifica tu conexion a internet."],
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
