import { useCallback, useState } from "react";
import pagosService from "../services/pagos.service";

const mapPagosResponse = (response) => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data?.items)) return response.data.items;
  return response.data ? [response.data] : [];
};

const usePagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchPagos = useCallback(async (criteria = {}) => {
    setLoading(true);
    setError(null);
    try {
      let response;

      if (criteria.pagoId) {
        response = await pagosService.getPagoById(criteria.pagoId.trim());
      } else if (criteria.orderId) {
        response = await pagosService.getPagoByOrderId(criteria.orderId.trim());
      } else if (criteria.usuarioId) {
        response = await pagosService.getPagosByUsuario(
          criteria.usuarioId.trim()
        );
      }

      if (!response) {
        setPagos([]);
        return { success: true, data: [] };
      }

      const data = mapPagosResponse(response);
      setPagos(data);
      return { success: true, data };
    } catch (err) {
      const message = err.message || "Error al buscar pagos";
      setError(message);
      return { success: false, message, errors: err.errors || [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const createPago = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pagosService.createPago(payload);
      const data = response?.data || response;
      setPagos((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const message = err.message || "Error al crear el pago";
      setError(message);
      return { success: false, message, errors: err.errors || [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaypalOrder = useCallback(async (payload) => {
    try {
      const response = await pagosService.createPaypalOrder(payload);
      return { success: true, data: response?.data || response };
    } catch (err) {
      const message = err.message || "Error al crear la orden de PayPal";
      return { success: false, message, errors: err.errors || [] };
    }
  }, []);

  const capturePaypal = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pagosService.capturePaypal(orderId);
      const data = response?.data || response;
      setPagos((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const message = err.message || "Error al capturar el pago";
      setError(message);
      return { success: false, message, errors: err.errors || [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelarPago = useCallback(async (id, motivo) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pagosService.cancelarPago(id, motivo);
      setPagos((prev) =>
        prev.map((pago) =>
          pago.id === id
            ? { ...pago, estado: 3, estadoNombre: "Cancelado" }
            : pago
        )
      );
      return { success: true, data: response?.data || response };
    } catch (err) {
      const message = err.message || "Error al cancelar el pago";
      setError(message);
      return { success: false, message, errors: err.errors || [] };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pagos,
    loading,
    error,
    setPagos,
    searchPagos,
    createPago,
    createPaypalOrder,
    capturePaypal,
    cancelarPago,
  };
};

export default usePagos;
