import { useCallback, useState } from "react";
import citasService from "../services/citas.service";

const mapCitasResponse = (response) => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data?.items)) return response.data.items;
  return response.data ? [response.data] : [];
};

const useCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCitas = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      let response;

      if (filters.veterinarioId) {
        response = await citasService.getByVeterinario(filters.veterinarioId, {
          startDate: filters.startDate,
          endDate: filters.endDate,
        });
      } else if (filters.status !== undefined && filters.status !== "") {
        response = await citasService.getByEstado(filters.status);
      } else if (filters.startDate && filters.endDate) {
        response = await citasService.getByRango(
          filters.startDate,
          filters.endDate
        );
      } else {
        response = await citasService.list();
      }

      const data = mapCitasResponse(response);
      setCitas(data);
      return { success: true, data };
    } catch (err) {
      const message = err.message || "Error al cargar citas";
      setError(message);
      return { success: false, message, errors: err.errors || [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const createCita = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);
      try {
        const response = await citasService.create(payload);
        await fetchCitas();
        return { success: true, data: response?.data || response };
      } catch (err) {
        const message = err.message || "Error al crear la cita";
        setError(message);
        return { success: false, message, errors: err.errors || [] };
      } finally {
        setLoading(false);
      }
    },
    [fetchCitas]
  );

  const updateCita = useCallback(
    async (id, payload) => {
      setLoading(true);
      setError(null);
      try {
        const response = await citasService.update(id, payload);
        await fetchCitas();
        return { success: true, data: response?.data || response };
      } catch (err) {
        const message = err.message || "Error al actualizar la cita";
        setError(message);
        return { success: false, message, errors: err.errors || [] };
      } finally {
        setLoading(false);
      }
    },
    [fetchCitas]
  );

  const cancelCita = useCallback(
    async (id, motivoRechazo) => {
      setLoading(true);
      setError(null);
      try {
        const response = await citasService.cancelar(id, motivoRechazo);
        await fetchCitas();
        return { success: true, data: response?.data || response };
      } catch (err) {
        const message = err.message || "Error al cancelar la cita";
        setError(message);
        return { success: false, message, errors: err.errors || [] };
      } finally {
        setLoading(false);
      }
    },
    [fetchCitas]
  );

  const completarCita = useCallback(
    async (id, notas) => {
      setLoading(true);
      setError(null);
      try {
        const response = await citasService.completar(id, notas);
        await fetchCitas();
        return { success: true, data: response?.data || response };
      } catch (err) {
        const message = err.message || "Error al completar la cita";
        setError(message);
        return { success: false, message, errors: err.errors || [] };
      } finally {
        setLoading(false);
      }
    },
    [fetchCitas]
  );

  const deleteCita = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await citasService.delete(id);
        await fetchCitas();
        return { success: true, data: response?.data || response };
      } catch (err) {
        const message = err.message || "Error al eliminar la cita";
        setError(message);
        return { success: false, message, errors: err.errors || [] };
      } finally {
        setLoading(false);
      }
    },
    [fetchCitas]
  );

  const checkDisponibilidad = useCallback(async (params) => {
    try {
      const response = await citasService.verificarDisponibilidad(params);
      return { success: true, data: response?.data || response };
    } catch (err) {
      const message = err.message || "No se pudo verificar la disponibilidad";
      return { success: false, message, errors: err.errors || [] };
    }
  }, []);

  return {
    citas,
    loading,
    error,
    fetchCitas,
    createCita,
    updateCita,
    cancelCita,
    completarCita,
    deleteCita,
    checkDisponibilidad,
    setCitas,
  };
};

export default useCitas;
