import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class ServicesService {
  // Obtener lista de empleados
  async getEmpleados(pageNumber = 1, pageSize = 10) {
    try {
      const response = await apiClient.get(ENDPOINTS.SERVICIOS.GETEMPLEADOS, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener empleado por ID
  async getEmpleadoById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.SERVICIOS.GETEMPLEADO(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Crear un nuevo empleado
  async createEmpleado(employeeData) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.SERVICIOS.ADDEMPLEADO,
        employeeData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Actualizar un empleado
  async updateEmpleado(id, employeeData) {
    try {
      const response = await apiClient.put(
        ENDPOINTS.SERVICIOS.UPDATEEMPLEADO(id),
        employeeData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Eliminar un empleado
  async deleteEmpleado(id) {
    try {
      const response = await apiClient.delete(
        ENDPOINTS.SERVICIOS.DELETEEMPLEADO(id)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Activar un empleado
  async activateEmpleado(id) {
    try {
      const response = await apiClient.put(
        ENDPOINTS.SERVICIOS.ACTIVATEEMPLEADO(id)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Desactivar un empleado
  async deactivateEmpleado(id) {
    try {
      const response = await apiClient.put(
        ENDPOINTS.SERVICIOS.DEACTIVATEEMPLEADO(id)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Asignar especialidad a un empleado
  async addEspecialidadEmpleado(id, especialidadData) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.SERVICIOS.ADDESPECIALIDADEMPLEADO(id),
        especialidadData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Remover especialidad de un empleado
  async removeEspecialidadEmpleado(id, especialidadId) {
    try {
      const response = await apiClient.delete(
        ENDPOINTS.SERVICIOS.REMOVEESPECIALIDADEMPLEADO(id, especialidadId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener lista de especialidades
  async getEspecialidades() {
    try {
      const response = await apiClient.get(
        ENDPOINTS.SERVICIOS.GETESPECIALIDADES
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Crear una nueva especialidad
  async createEspecialidad(especialidadData) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.SERVICIOS.ADDESPECIALIDAD,
        especialidadData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener especialidad por código
  async getEspecialidadByCodigo(codigo) {
    try {
      const response = await apiClient.get(
        ENDPOINTS.SERVICIOS.GETESPECIALIDAD(codigo)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener lista de roles
  async getRoles() {
    try {
      const response = await apiClient.get(ENDPOINTS.SERVICIOS.GETROLES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Agregar horario
  async addHorario(dataHorario) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.SERVICIOS.ADDHORARIO,
        dataHorario
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Editar horario
  async updateHorario(id, dataHorario) {
    try {
      const response = await apiClient.put(
        ENDPOINTS.SERVICIOS.UPDATEHORARIO(id),
        dataHorario
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  // Obtener calendario de horarios
  async getCalendarioHorarios(fechaInicio, fechaFin, empleadoId = null) {
    try {
      let url = ENDPOINTS.SERVICIOS.GETHORARIOCALENDARIO;

      if (empleadoId) {
        url = ENDPOINTS.SERVICIOS.GETHORARIOCALENDARIOEMPLEADO(empleadoId);
      }

      const response = await apiClient.get(url, {
        params: { fechaInicio, fechaFin },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener horario por ID
  async getHorarioById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.SERVICIOS.GETHORARIO(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Eliminar horario
  async deleteHorario(id) {
    try {
      const response = await apiClient.delete(
        ENDPOINTS.SERVICIOS.DELETEHORARIO(id)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Manejo de errores
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

export default new ServicesService();
