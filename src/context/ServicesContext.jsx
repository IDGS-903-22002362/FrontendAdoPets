import { useState } from "react";
import serviciosService from "../services/servicios.service";
import donacionesService from "../services/donaciones.service";
import serviciosVeterinariosService from "../services/serviciosVeterinarios.service";
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

    const getHorarios = async (inicio, fin, empleadoId = null) => {
        try{
            const response = await serviciosService.getCalendarioHorarios(inicio, fin, empleadoId);
            if (response.success) {
                return {
                    success: true,
                    data: response.data
                };
            }
            return {
                success: false,
                message: response.message || 'Error al obtener los horarios',
                errors: response.errors || [],
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al obtener los horarios',
                errors: error.errors || [],
            };
        }
    };

    const getHorarioById = async (id) => {
        try {
            const response = await serviciosService.getHorarioById(id);
            if (response.success) {
                return {
                    success: true,
                    data: response.data
                };
            }
            return {
                success: false,
                message: response.message || 'Error al obtener el horario',
                errors: response.errors || [],
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al obtener el horario',
                errors: error.errors || [],
            };
        }
    };

    const deleteHorario = async (id) => {
        try {
            const response = await serviciosService.deleteHorario(id);
            if (response.success) {
                return { success: true };
            }
            return {
                success: false,
                message: response.message || 'Error al eliminar el horario',
                errors: response.errors || [],
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error al eliminar el horario',
                errors: error.errors || [],
            };
        }
    };



    // Agregar horario 
    const addHorario = async (dataHorario) => {
        try {
            const response = await serviciosService.addHorario(dataHorario); 
            if (response.success){
                return {success: true}; 
            }
            return {
                success: false, 
                message: response.message || 'Error al agregar el horario', 
                errors: response.errors || [],
            };
        }catch (error) {
            return {
                success: false, 
                message: error.message || 'Error al agregar el horario', 
                errors: error.errors || [],
            };
        }
    }; 

    // Actualizar horario 
    const updateHorario = async (id, dataHorario) => {
        try {
            const response = await serviciosService.updateHorario(id, dataHorario); 
            if (response.success){
                return {success: true}; 
            }
            return {
                success: false, 
                message: response.message || 'Error al actualizar el horario', 
                errors: response.errors || [],
            };
        }catch (error) {
            return {
                success: false, 
                message: error.message || 'Error al actualizar el horario', 
                errors: error.errors || [],
            };
        }
    }; 

    // Donaciones
    const getDonacionesPublicas = async (pageNumber = 1, pageSize = 10, filtro = 0) => {
        try {
            const response = await donacionesService.getDonacionesPublicas(pageNumber, pageSize, filtro);
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, message: response.message || 'Error al obtener donaciones', errors: response.errors || [] };
        } catch (error) {
            return { success: false, message: error.message || 'Error al obtener donaciones', errors: error.errors || [] };
        }
    };

    const getDonacionesPorUsuario = async (usuarioId) => {
        try {
            const response = await donacionesService.getDonacionesPorUsuario(usuarioId);
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, message: response.message || 'Error al obtener donaciones del usuario', errors: response.errors || [] };
        } catch (error) {
            return { success: false, message: error.message || 'Error al obtener donaciones del usuario', errors: error.errors || [] };
        }
    };

    // Servicios Veterinarios
    const getServiciosVeterinarios = async (incluirInactivos = false) => {
        try {
            const response = await serviciosVeterinariosService.getAll(incluirInactivos);
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, message: response.message || 'Error al obtener servicios', errors: response.errors || [] };
        } catch (error) {
            return { success: false, message: error.message || 'Error al obtener servicios', errors: error.errors || [] };
        }
    };

    const getServicioVeterinarioById = async (id) => {
        try {
            const response = await serviciosVeterinariosService.getById(id);
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, message: response.message || 'Error al obtener servicio', errors: response.errors || [] };
        } catch (error) {
            return { success: false, message: error.message || 'Error al obtener servicio', errors: error.errors || [] };
        }
    };

    const createServicioVeterinario = async (payload) => {
        try {
            const response = await serviciosVeterinariosService.create(payload);
            if (response.success) return { success: true, data: response.data };
            return { success: false, message: response.message, errors: response.errors || [] };
        } catch (error) {
            return { success: false, message: error.message || 'Error al crear servicio', errors: error.errors || [] };
        }
    };

    const updateServicioVeterinario = async (id, payload) => {
        try {
            const response = await serviciosVeterinariosService.update(id, payload);
            if (response.success) return { success: true, data: response.data };
            return { success: false, message: response.message, errors: response.errors || [] };
        } catch (error) {
            return { success: false, message: error.message || 'Error al actualizar servicio', errors: error.errors || [] };
        }
    };

    const deleteServicioVeterinario = async (id) => {
        try {
            const response = await serviciosVeterinariosService.delete(id);
            if (response.success) return { success: true };
            return { success: false, message: response.message, errors: response.errors || [] };
        } catch (error) {
            return { success: false, message: error.message || 'Error al eliminar servicio', errors: error.errors || [] };
        }
    };

    const activarServicioVeterinario = async (id) => {
        try {
            const response = await serviciosVeterinariosService.activar(id);
            if (response.success) return { success: true };
            return { success: false, message: response.message, errors: response.errors || [] };
        } catch (error) {
            return { success: false, message: error.message || 'Error al activar servicio', errors: error.errors || [] };
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
        getRoles, 
        getHorarios,
        getHorarioById,
        deleteHorario,
        addHorario, 
        updateHorario,
        // Donaciones
        getDonacionesPublicas,
        getDonacionesPorUsuario,
        // Servicios Veterinarios
        getServiciosVeterinarios,
        getServicioVeterinarioById,
        createServicioVeterinario,
        updateServicioVeterinario,
        deleteServicioVeterinario,
        activarServicioVeterinario
    };    return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export default ServicesProvider;