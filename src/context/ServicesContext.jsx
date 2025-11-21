import { useState } from "react";
import serviciosService from "../services/servicios.service";
import { ServicesContext } from "./ServicesContextValue";

export const ServicesProvider = ({children}) => {
    const [services, setServices] = useState(null);

    // Función para obtener empleados
    const getEmpleados = async (filters = {}) => {
        try{
            const response = await serviciosService.getEmpleados(
                filters.pageNumber || 1, 
                filters.pageSize || 10
            );
            if (response.success) {
                setServices(response);
                return { success: true, data: response.data };
            }
            return {
                success: false, 
                message: response.message || 'Error al obtener a los empleados',
                errors: response.errors || [],
            };
        } catch (error){
            return {
                success: false, 
                message: error.message || 'Error al obtener a los empleados',
                errors: error.errors || [],
            };
        }
    }; 

    // Función para obtener a un empleado en particular
    const getEmpleadoById = async (id) => {
        try{
            const empleado = await serviciosService.getEmpleadoById(id);
            return {
                success: true,
                data: empleado
            };
        } catch (error){
            return {
                success: false, 
                message: error.message || 'Error al obtener al empleado',
                errors: error.errors || [],
            };
        }
    }; 

    // Función para registrar un nuevo empleado 
    const registerEmpleado = async (empleadoData) => {
        try {
            const response = await serviciosService.createEmpleado(empleadoData);
            if (response.success) {
                setServices(response.data.empleado); 
                return { success: true };
            }       
            return { success: false, message: response.message };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al registrar al empleado',
                errors: error.errors || [],
            };
        }
    };

    // Función para actualizar un empleado
    const updateEmpleado = async (id, empleadoData) => {
        try {
            const response = await serviciosService.updateEmpleado(id, empleadoData);
            if (response.success) {
                setServices(response.data.empleado); 
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al actualizar al empleado',
                errors: error.errors || [],
            };
        }
    };

    // Función para eliminar un empleado
    const deleteEmpleado = async (id) => {
        try {
            const response = await serviciosService.deleteEmpleado(id);
            if (response.success) {
                // Actualizar el estado eliminando el empleado de la lista
                setServices((prevServices) => {
                    if (!prevServices || !prevServices.data || !prevServices.data.items) {
                        return prevServices;
                    }
                    return {
                        ...prevServices,
                        data: {
                            ...prevServices.data,
                            items: prevServices.data.items.filter((emp) => emp.id !== id),
                            totalCount: prevServices.data.totalCount - 1
                        }
                    };
                });
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al eliminar al empleado',
                errors: error.errors || [],
            };
        }
    };

    // Función para activar un empleado
    const activateEmpleado = async (id) => {
        try {
            const response = await serviciosService.activateEmpleado(id);
            if (response.success) {
                await getEmpleados(); 
                return { success: true };
            }
        } catch (error) {
            return {
                success: false, 
                message: error.message || 'Error al activar al empleado',
                errors: error.errors || [],
            };
        }
    };

    // Función para desactivar un empleado
    const deactivateEmpleado = async (id) => {
        try {
            const response = await serviciosService.deactivateEmpleado(id);
            if (response.success) {
                await getEmpleados(); 
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al desactivar al empleado',
                errors: error.errors || [],
            };
        }
    };

    // Función para asignar especialidad a un empleado
    const addEspecialidadEmpleado = async (id, especialidadData) => {
        try {
            const response = await serviciosService.addEspecialidadEmpleado(id, especialidadData);
            if (response.success) {
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al asignar especialidad',
                errors: error.errors || [],
            };
        }
    };

    const removeEspecialidadEmpleado = async (id, especialidadId) => {
        try {
            const response = await serviciosService.removeEspecialidadEmpleado(id, especialidadId); 
            if (response.success) {
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al remover especialidad',
                errors: error.errors || [],
            };
        }
    };

    const getEspecialidadByCodigo = async (codigo) => {
        try {
            const especialidad = await serviciosService.getEspecialidadByCodigo(codigo);
            return {
                success: true,
                data: especialidad
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Error al obtener la especialidad',
                errors: error.errors || [],
            };
        }   
    };

    const getEspecialidades = async () => {
        try {
            const especialidades = await serviciosService.getEspecialidades();
            return {
                success: true,
                data: especialidades
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al obtener las especialidades',
                errors: error.errors || [],
            };
        }
    };  

    const getRoles = async () => {
        try {
            const roles = await serviciosService.getRoles();
            return {
                success: true,
                data: roles
            };
        } catch (error) {
            return {
                success: false, 
                message: error.message || 'Error al obtener los roles',
                errors: error.errors || [],
            };
        }
    };

    const addEspecialidad = async (especialidadData) => {
        try {
            const response = await serviciosService.createEspecialidad(especialidadData);   
            if (response.success) {
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al crear la especialidad',
                errors: error.errors || [],
            };
        }   
    };

    const value = {
        services,
        getEmpleados,
        getEmpleadoById,
        registerEmpleado,
        updateEmpleado,
        deleteEmpleado,
        activateEmpleado,
        deactivateEmpleado,
        addEspecialidadEmpleado,
        removeEspecialidadEmpleado, 
        getEspecialidadByCodigo,
        getEspecialidades,
        addEspecialidad,
        getRoles
    }; 

    return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export default ServicesProvider;