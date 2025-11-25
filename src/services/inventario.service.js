// src/services/inventario.service.js
import axios from "./api.service";

const getInventario = async () => {
  try {
    const response = await axios.get("/items/inventario");
    return response.data;
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    throw error;
  }
};

export default { getInventario };
