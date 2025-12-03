import { useCallback, useState } from "react";
import salasService from "../services/salas.service";

const useSalas = () => {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSalas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await salasService.list();
      const data = response?.data || response || [];
      setSalas(data);
      return { success: true, data };
    } catch (err) {
      const message = err.message || "Error al cargar salas";
      setError(message);
      return { success: false, message, errors: err.errors || [] };
    } finally {
      setLoading(false);
    }
  }, []);

  return { salas, loading, error, fetchSalas };
};

export default useSalas;
