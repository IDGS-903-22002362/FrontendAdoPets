import api from "./api.service";

const itemsService = {
  crear: (data) => api.post("/items", data),
};

export default itemsService;
