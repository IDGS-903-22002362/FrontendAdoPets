import React, { useState} from 'react';
import mascotaService from '../services/mascota.service';
import { PetContext } from './PetContextValue';
import AdoptionService from '../services/Adoption.service';


export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState(null);

const getMascota = async (filters = {}) => {
  try {
    const mascotas = await mascotaService.getMascotas(filters);
    setPets(mascotas);
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al obtener las mascotas',
      errors: error.errors || [],
    };
  }
};


const getRegister = async (pet) => {
  try {
    // Preparar los datos con las claves exactas que espera el backend
    const petData = {
      nombre: pet.nombre,
      especie: pet.especie,
      raza: pet.raza,
      fechaNacimiento: pet.fechaNacimiento 
        ? new Date(pet.fechaNacimiento).toISOString() 
        : new Date().toISOString(),
      sexo: parseInt(pet.sexo),
      personalidad: pet.personalidad,
      estadoSalud: pet.estadoSalud,
      requisitoAdopcion: pet.requisitoAdopcion,
      origen: pet.origen, 
      notas: pet.notas
    };

    console.log(' DATOS CORREGIDOS (CON MAYÚSCULAS):');
    console.log('   - Origen:', petData.Origen);
    console.log('   - Datos completos:', petData);

    const response = await mascotaService.postRegister(petData);
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.log(' ERROR EN PET PROVIDER:');
    console.log('   - Error response:', error.response?.data);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al registrar mascota',
      errors: error.response?.data?.errors || [],
    };
  }
};

 const addPhotos = async (id, fotos) => {
  try {
    console.log(' Provider: Enviando fotos para mascota', id);
    console.log(' Datos de fotos:', fotos);
    
    const response = await mascotaService.postPhotos(id, fotos);
    
    console.log(' Provider: Respuesta de fotos:', response);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error(' Provider: Error en addPhotos:', error);
    return {
      success: false,
      message: error.message || 'Error al agregar fotos',
      errors: error.errors || [],
    };
  }
}

const getPetById = async (id) =>{
  try {
          const response = await mascotaService.GetPetbyId(id);
          return {
            success: true,
            data: response
          }
  } catch (error){
    return {
      success: false,
      message: error.message || 'Error al obtener a la  mascota',
      errors: error.errors || [],
    };
  }
}


const updatepet = async (id, petData) =>{
  try {
    const response = await mascotaService.updatePet(id, petData);
    return {
      success: true,
      data: response
    };
  } catch (error){
    return {
      success: false,
      message: error.message || 'Error al actualizar la mascota',
      errors: error.errors || [],
    };
  }
};

const deletepet = async (id) => {
  try {
    const response = await mascotaService.deletePet(id);
    return {
      success: true,
      data: response
    };
  } catch (error){
    return {
      success: false,
      message: error.message || 'Error al eliminar a la mascota',
      errors: error.errors || [],
    };
  }
}

const deletePhotoPet = async (id) => {
  try {
    const response = await mascotaService.photoDelete(id);
    return {
      success: true,
      data: response
    };
  } catch (error){
    return {
      success: false,
      message: error.message || 'Error al eliminar foto',
      errors: error.errors || [],
    };
  }
}



// METODOS PARA PROCESO DE ADOPCION
const getadoption = async () => {
  try {
      const response = await AdoptionService.getAdoption();
      return {
        success: true,
        data: response
      }
  }catch (error) {
    return {
      success: false,
      message: error.message || 'Error al obtener solicitudes de adopción',
      errors: error.errors || [],
    };
  }
}


const putSolicitud = async (solicitudId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    const payload = {
      id: solicitudId,
      estado: 2,          
      revisadoPor: userId  
    };

    console.log("Payload enviado:", payload);

    const response = await AdoptionService.PutReview(payload);

    return {
      success: true,
      data: response
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || "Error al actualizar estado de solicitud",
      errors: error.errors || []
    };
  }
};


const putAccepted = async (solicitudId) => {
  try {
   

    const payload = {
      id: solicitudId,
      estado: 3,          
    };

    console.log("Payload enviado:", payload);

    const response = await AdoptionService.PutAccepted(payload);

    return {
      success: true,
      data: response
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || "Error al actualizar estado de solicitud",
      errors: error.errors || []
    };
  }
};


const putRejected = async (solicitudId, motivo) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    const payload = {
      id: solicitudId,
      usuarioId: userId,
      estado: 4,
      motivoRechazo: motivo         
      
    };

    console.log("Payload enviado:", payload);

    const response = await AdoptionService.PutRejected(payload);

    return {
      success: true,
      data: response
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || "Error al actualizar estado de solicitud",
      errors: error.errors || []
    };
  }
};
  const value = {
    pets,
    getMascota,
    getRegister,
    addPhotos,
    getPetById,
    updatepet,
    deletepet,
    deletePhotoPet,
    getadoption,
    putSolicitud,
    putAccepted,
    putRejected
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};

export default PetProvider;
