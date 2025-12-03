import apiClient from './api.service';

const salaService = {
  // Obtener todas las salas
  getAll: async () => {
    const response = await apiClient.get('/salas');
    return response.data;
  },

  // Obtener salas activas
  getActive: async () => {
    const response = await apiClient.get('/salas/activas');
    return response.data;
  },

  // Obtener sala por ID
  getById: async (id) => {
    const response = await apiClient.get(`/salas/${id}`);
    return response.data;
  },

  // Crear nueva sala
  create: async (salaData) => {
    const response = await apiClient.post('/salas', salaData);
    return response.data;
  },

  // Actualizar sala
  update: async (id, salaData) => {
    const response = await apiClient.put(`/salas/${id}`, salaData);
    return response.data;
  },

  // Eliminar sala (soft delete)
  delete: async (id) => {
    const response = await apiClient.delete(`/salas/${id}`);
    return response.data;
  }
};

export default salaService;
