import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class AdoptionSerice {



    async getAdoption() {
        try{
            const response = await apiClient.get(ENDPOINTS.ADOPCION.GETADOPCION);
              return response.data;
        } catch (error){
             throw this.handleError(error);
        }
    }


    async PutReview(solicitud){
           try {
            const response = await apiClient.put(ENDPOINTS.ADOPCION.PUTREVIEW, solicitud);

            return response.data;
           } catch (error){
            throw this.handleError(error);
           }
    }

    async PutAccepted(solicitud){
      try{
          const response = await apiClient.put(ENDPOINTS.ADOPCION.PUTACCEPTED, solicitud);
          return response.data;
      } catch (error){
        throw this.handleError(error);
      }
    }


      async PutRejected(solicitud){
      try{
          const response = await apiClient.put(ENDPOINTS.ADOPCION.PUTREJECTED, solicitud);
          return response.data;
      } catch (error){
        throw this.handleError(error);
      }
    }

    handleError(error) {
  console.log('DETALLES DEL ERROR:');
  console.log('   - Response data:', error.response?.data);
  console.log('   - Validation errors:', error.response?.data?.errors);
  console.log('   - Title:', error.response?.data?.title);
  
  return {
    success: false,
    message: error.response?.data?.title || error.response?.data?.message || 'Error en la operación',
    errors: error.response?.data?.errors || [],
    status: error.response?.status
  };
}
}

export default new  AdoptionSerice();