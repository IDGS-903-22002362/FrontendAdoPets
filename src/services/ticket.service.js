import apiClient from './api.service';
import { ENDPOINTS } from '../config/api.config';

const ticketService = {
  // Crear nuevo ticket
  create: async (ticketData) => {
    const response = await apiClient.post(ENDPOINTS.TICKETS.BASE, ticketData);
    return response.data;
  },

  // Obtener ticket por ID
  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.TICKETS.BY_ID(id));
    return response.data;
  },

  // Obtener ticket por número
  getByNumero: async (numeroTicket) => {
    const response = await apiClient.get(ENDPOINTS.TICKETS.BY_NUMERO(numeroTicket));
    return response.data;
  },

  // Obtener tickets por cliente
  getByCliente: async (clienteId) => {
    const response = await apiClient.get(ENDPOINTS.TICKETS.BY_CLIENTE(clienteId));
    return response.data;
  },

  // Obtener tickets por cita
  getByCita: async (citaId) => {
    const response = await apiClient.get(ENDPOINTS.TICKETS.BY_CITA(citaId));
    return response.data;
  },

  // Marcar ticket como entregado
  marcarEntregado: async (id) => {
    const response = await apiClient.put(ENDPOINTS.TICKETS.ENTREGAR(id));
    return response.data;
  },

  // Descargar PDF del ticket
  downloadPdf: async (id) => {
    const response = await apiClient.get(ENDPOINTS.TICKETS.PDF(id), {
      responseType: 'blob'
    });
    
    // Crear enlace de descarga
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ticket-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  }
};

export default ticketService;
