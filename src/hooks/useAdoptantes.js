import { useCallback, useState } from "react";
import adoptantesService from "../services/adoptantes.service";

const useAdoptantes = () => {
  const [adoptantes, setAdoptantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdoptantes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adoptantesService.listarConMascotas();
      const data = response?.data || response || [];
      setAdoptantes(data);
      return { success: true, data };
    } catch (err) {
      const message = err.message || "Error al cargar adoptantes";
      setError(message);
      return { success: false, message, errors: err.errors || [] };
    } finally {
      setLoading(false);
    }
  }, []);

  return { adoptantes, loading, error, fetchAdoptantes, setAdoptantes };
};

export default useAdoptantes;
