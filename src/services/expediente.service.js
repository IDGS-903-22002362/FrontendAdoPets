import apiClient from './api.service';

const expedienteService = {
  // Obtener todos los expedientes (si el backend lo soporta)
  getAll: async () => {
    try {
      const response = await apiClient.get('/expedientes');
      return response.data;
    } catch (error) {
      console.warn('Endpoint /expedientes no disponible');
      return { success: false, data: [] };
    }
  },

  // Obtener expediente por ID
  getById: async (id) => {
    const response = await apiClient.get(`/expedientes/${id}`);
    return response.data;
  },

  // Obtener expedientes por mascota
  getByMascota: async (mascotaId) => {
    const response = await apiClient.get(`/expedientes/mascota/${mascotaId}`);
    return response.data;
  },

  // Obtener expedientes por veterinario
  getByVeterinario: async (veterinarioId) => {
    const response = await apiClient.get(`/expedientes/veterinario/${veterinarioId}`);
    return response.data;
  },

  // Crear expediente
  create: async (expedienteData) => {
    const response = await apiClient.post('/expedientes', expedienteData);
    return response.data;
  },

  // Eliminar expediente
  delete: async (id) => {
    const response = await apiClient.delete(`/expedientes/${id}`);
    return response.data;
  },

  // Agregar adjunto
  addAdjunto: async (expedienteId, adjuntoData) => {
    const response = await apiClient.post(`/expedientes/${expedienteId}/adjuntos`, adjuntoData);
    return response.data;
  },

  // Eliminar adjunto
  deleteAdjunto: async (adjuntoId) => {
    const response = await apiClient.delete(`/expedientes/adjuntos/${adjuntoId}`);
    return response.data;
  }
};

export default expedienteService;
