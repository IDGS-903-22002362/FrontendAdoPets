import axios from "./api.service";

const proveedorService = {
  listar: () => axios.get("/Proveedor/listar"),

  crear: (data) => axios.post("/Proveedor/crear", data),

  obtenerPorId: (id) => axios.get(`/Proveedor/${id}`),

  actualizar: (id, data) => axios.put(`/Proveedor/actualizar/${id}`, data),

  cambiarEstatus: (id, nuevoEstatus) =>
    axios.put(`/Proveedor/estatus/${id}?nuevoEstatus=${nuevoEstatus}`),
};

export default proveedorService;
