// src/services/compras.service.js
import axios from "./api.service";

const comprasService = {
  surtir: (data) => axios.post("/Compras/surtir", data),
};


export default comprasService;
