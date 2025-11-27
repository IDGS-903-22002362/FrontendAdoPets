import { useCallback, useState } from "react";
import citasDigitalesService from "../services/citasDigitales.service";

const useCitasDigitales = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPendientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await citasDigitalesService.getPendientes();
      const data = response?.data || response || [];
      setSolicitudes(data);
      return { success: true, data };
    } catch (err) {
      const message = err.message || "Error al cargar solicitudes";
      setError(message);
      return { success: false, message, errors: err.errors || [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarEnRevision = useCallback(async (id, revisadoPorId) => {
    try {
      const response = await citasDigitalesService.setEnRevision(id, revisadoPorId);
      return { success: true, data: response?.data || response };
    } catch (err) {
      return { success: false, message: err.message, errors: err.errors || [] };
    }
  }, []);

  const verificarDisponibilidad = useCallback(async (payload) => {
    try {
      const response = await citasDigitalesService.verificarDisponibilidad(payload);
      return { success: true, data: response?.data || response };
    } catch (err) {
      return { success: false, message: err.message, errors: err.errors || [] };
    }
  }, []);

  const confirmarSolicitud = useCallback(async (payload) => {
    try {
      const response = await citasDigitalesService.confirmar(payload);
      return { success: true, data: response?.data || response };
    } catch (err) {
      return { success: false, message: err.message, errors: err.errors || [] };
    }
  }, []);

  const rechazarSolicitud = useCallback(async (payload) => {
    try {
      const response = await citasDigitalesService.rechazar(payload);
      return { success: true, data: response?.data || response };
    } catch (err) {
      return { success: false, message: err.message, errors: err.errors || [] };
    }
  }, []);

  return {
    solicitudes,
    loading,
    error,
    fetchPendientes,
    marcarEnRevision,
    verificarDisponibilidad,
    confirmarSolicitud,
    rechazarSolicitud,
    setSolicitudes,
  };
};

export default useCitasDigitales;
