import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class CitasService {
  async list(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.CITAS.BASE, { params });
      console.log("📋 Citas recibidas del backend:", response.data?.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.CITAS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByVeterinario(veterinarioId, params = {}) {
    try {
      const response = await apiClient.get(
        ENDPOINTS.CITAS.POR_VETERINARIO(veterinarioId),
        { params }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByEstado(status) {
    try {
      const response = await apiClient.get(ENDPOINTS.CITAS.POR_ESTADO(status));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByPropietario(propietarioId) {
    try {
      const response = await apiClient.get(
        ENDPOINTS.CITAS.POR_PROPIETARIO(propietarioId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBySolicitud(solicitudId) {
    try {
      const response = await apiClient.get(
        ENDPOINTS.CITAS.POR_SOLICITUD(solicitudId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verificarDisponibilidad({ veterinarioId, fecha, salaId }) {
    try {
      const response = await apiClient.get(ENDPOINTS.CITAS.DISPONIBILIDAD, {
        params: { veterinarioId, fecha, salaId },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(payload) {
    try {
      const response = await apiClient.post(ENDPOINTS.CITAS.BASE, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id, payload) {
    try {
      const response = await apiClient.put(ENDPOINTS.CITAS.BY_ID(id), payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelar(id, motivoRechazo) {
    try {
      console.log("🔵 Cancelando cita:", { id, motivoRechazo });
      const response = await apiClient.put(ENDPOINTS.CITAS.CANCELAR(id), {
        motivoRechazo: motivoRechazo || "Cancelada por el usuario",
      });
      console.log("✅ Respuesta de cancelación:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al cancelar cita:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw this.handleError(error);
    }
  }

  async completar(id, notas) {
    try {
      const response = await apiClient.put(ENDPOINTS.CITAS.COMPLETAR(id), {
        notas: notas || "",
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id) {
    try {
      const response = await apiClient.delete(ENDPOINTS.CITAS.DELETE(id));
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
        message: "No se recibi\u00f3 respuesta del servidor",
        errors: ["Verifica tu conexi\u00f3n a internet."],
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

export default new CitasService();
