import { ENDPOINTS } from "../config/api.config";
import apiClient from "./api.service";

class MascotaService {
    pet = {
    nombre: '',
    especie: '',
    raza: '',
    fechaNacimiento: '',
    sexo: 0,
    personalidad: '',
    estadoSalud: '',
    requisitoAdopcion: '',
    origen: '',
    notas: '',
  
  }

  
  async getMascotas(filters = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.MASCOTA.MASCOTA, {
        params: filters 
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

 

async postRegister(pet){
  try{
    console.log( 'ENVIANDO PET A LA API:');
    console.log(' Datos:', JSON.stringify(pet, null, 2));
    
    const response = await apiClient.post(ENDPOINTS.MASCOTA.MASCOTA, pet);
    
    console.log('✅ REGISTRO EXITOSO:', response.data);
    return response.data;
  } catch (error){
    
    console.log('   - Error completo:', error);
    
    throw this.handleError(error);
  }
}

  async postPhotos(id, fotos) {
    try {
      const response = await apiClient.post(
        ENDPOINTS.MASCOTA.ADDPHOTOS(id),
        fotos
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async GetPetbyId(id){
    try {
      const response = await apiClient.get(ENDPOINTS.MASCOTA.PETBYID(id));
      return response.data;

    }catch (error){
      throw this.handleError(error);
    }
  }

  async updatePet(id, dto) {
  try {
    const response = await apiClient.put(
      ENDPOINTS.MASCOTA.UPDATEPET(id),
      dto
    );
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async deletePet (id){
  try {
    const response = await apiClient.patch(ENDPOINTS.MASCOTA.DELETEPET, {id})

    return response.data
  } catch (error) {
    throw this.handleError(error);
  }
}

async photoDelete(fotoId) { 
  try {
    const response = await apiClient.delete(
      ENDPOINTS.MASCOTA.DELETEPHOTOS(fotoId)
    );
    return response.data;
  } catch (error) {
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


export default new MascotaService();
