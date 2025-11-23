import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { usePet } from '../hooks/usePet';

// **********************************************
// Constantes de Estados
// **********************************************
const ESTADOS = {
    Pendiente: 1,
    EnRevision: 2,
    Aprobada: 3,
    Rechazada: 4,
    Cancelada: 5
};

// **********************************************
// Componente de Notificación (Toast)
// **********************************************
const Toast = ({ message, type = 'success', onClose }) => {
    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    const icon = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 ${bgColor[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in z-50 min-w-80`}>
            <span className="text-lg font-bold">{icon[type]}</span>
            <span className="flex-1">{message}</span>
            <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-lg font-bold"
            >
                ×
            </button>
        </div>
    );
};

// **********************************************
// Funciones Auxiliares
// **********************************************
const getEstadoColor = (estado) => {
    switch (estado) {
        case ESTADOS.Pendiente: return "bg-blue-100 text-blue-800 border-blue-200";
        case ESTADOS.EnRevision: return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case ESTADOS.Aprobada: return "bg-green-100 text-green-800 border-green-200";
        case ESTADOS.Rechazada: return "bg-red-100 text-red-800 border-red-200";
        case ESTADOS.Cancelada: return "bg-gray-100 text-gray-800 border-gray-200";
        default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const getEstadoBgColor = (estado) => {
    switch (estado) {
        case ESTADOS.Pendiente: return "bg-blue-500 hover:bg-blue-600";
        case ESTADOS.EnRevision: return "bg-yellow-500 hover:bg-yellow-600";
        case ESTADOS.Aprobada: return "bg-green-500 hover:bg-green-600";
        case ESTADOS.Rechazada: return "bg-red-500 hover:bg-red-600";
        case ESTADOS.Cancelada: return "bg-gray-500 hover:bg-gray-600";
        default: return "bg-gray-500 hover:bg-gray-600";
    }
};

const getEstadoText = (estado) => {
    switch (estado) {
        case ESTADOS.Pendiente: return "Pendiente";
        case ESTADOS.EnRevision: return "En Revisión";
        case ESTADOS.Aprobada: return "Aprobada";
        case ESTADOS.Rechazada: return "Rechazada";
        case ESTADOS.Cancelada: return "Cancelada";
        default: return "Desconocido";
    }
};

const getTipoVivienda = (vivienda) => {
    switch (vivienda) {
        case 1: return "Casa";
        case 2: return "Departamento";
        case 3: return "Otro";
        default: return "No especificado";
    }
};

const formatFechaCorta = (fecha) => {
    if (!fecha) return 'No asignada';
    return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const formatFechaCompleta = (fecha) => {
    if (!fecha) return 'No asignada';
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// **********************************************
// Componente Tarjeta de Solicitud
// **********************************************
const SolicitudCard = ({ solicitud, onSelect, isSelected }) => {
    const estadoText = getEstadoText(solicitud.estado);
    const estadoBgColor = getEstadoBgColor(solicitud.estado);

    const getImageUrl = () => {
        if (solicitud.mascotaFotos && solicitud.mascotaFotos.length > 0) {
            const fotoPrincipal = solicitud.mascotaFotos.find(foto => foto.esPrincipal);
            return fotoPrincipal?.storageKey || solicitud.mascotaFotos[0]?.storageKey;
        }
        return solicitud.mascotaUrlImagen;
    };

    const imageUrl = getImageUrl();

    return (
        <div
            className={`flex items-center p-4 bg-white rounded-lg cursor-pointer transition-all duration-200 border ${
                isSelected 
                    ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onSelect(solicitud)}
        >
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center flex-shrink-0">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={solicitud.mascotaNombre} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400">🐾</span>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{solicitud.mascotaNombre}</h3>
                <p className="text-sm text-gray-600">Por: {solicitud.usuarioNombre}</p>
                <p className="text-xs text-gray-500 mt-1">
                    Solicitud: {formatFechaCorta(solicitud.fechaSolicitud)}
                </p>
            </div>

            <div className={`px-3 py-1 text-xs font-medium text-white rounded-lg ${estadoBgColor}`}>
                {estadoText}
            </div>
        </div>
    );
};

// **********************************************
// Componentes de Campos
// **********************************************
const PanelInfoField = ({ label, value, fullWidth = false }) => (
    <div className={`flex flex-col ${fullWidth ? 'col-span-2' : ''}`}>
        <label className="text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">{label}</label>
        <div className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 text-sm shadow-sm">
            {value || 'No especificado'}
        </div>
    </div>
);

const PanelTextAreaField = ({ label, value }) => (
    <div className="flex flex-col col-span-2">
        <label className="text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">{label}</label>
        <div className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 text-sm min-h-[60px] shadow-sm">
            {value || 'No especificado'}
        </div>
    </div>
);

// **********************************************
// Componente Principal: Adoption
// **********************************************
const Adoption = () => {
    const { getadoption, putSolicitud, putAccepted, putRejected } = usePet();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [showRechazoModal, setShowRechazoModal] = useState(false);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState(null);

    // Verificar si el usuario tiene permisos de administración
    const canManageAdoptions = user?.roles?.includes('Admin') || user?.roles?.includes('Veterinario');

    // Función para mostrar notificaciones
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };

    const fetchSolicitudes = async () => {
        try {
            setLoading(true);
            const result = await getadoption();
            let data = result.data;
            
            if (data.length > 0 && !selectedSolicitud) {
                setSelectedSolicitud(data[0]); 
            }
            setSolicitudes(data);

        } catch (error) {
            console.error('Error:', error);
            showToast('Error al cargar las solicitudes', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleFiltroEstado = (estado) => {
        setFiltroEstado(estado);
    };

    // Función para iniciar revisión
    const handleIniciarRevision = async () => {
        if (!selectedSolicitud) return;
        
        // Verificar permisos
        if (!canManageAdoptions) {
            showToast('No tienes permisos para realizar esta acción', 'error');
            return;
        }
        
        setProcessing(true);
        try {
            const result = await putSolicitud(selectedSolicitud.id);
            if (result.success) {
                // Actualizar la solicitud en el estado local
                const updatedSolicitud = {
                    ...selectedSolicitud,
                    estado: ESTADOS.EnRevision,
                    fechaRevision: new Date().toISOString(),
                    revisadoPor: user?.nombreCompleto || user?.id
                };
                
                setSelectedSolicitud(updatedSolicitud);
                
                // Actualizar la lista de solicitudes
                setSolicitudes(prev => 
                    prev.map(s => 
                        s.id === selectedSolicitud.id ? updatedSolicitud : s
                    )
                );
                
                showToast('Solicitud puesta en revisión exitosamente', 'success');
            } else {
                showToast(`Error al iniciar revisión: ${result.message}`, 'error');
            }
        } catch (error) {
            showToast(`Error al iniciar revisión: ${error.message}`, 'error');
        } finally {
            setProcessing(false);
        }
    };

    // Función para aprobar solicitud
    const handleAprobar = async () => {
        if (!selectedSolicitud) return;
        
        // Verificar permisos
        if (!canManageAdoptions) {
            showToast('No tienes permisos para realizar esta acción', 'error');
            return;
        }
        
        setProcessing(true);
        try {
            const result = await putAccepted(selectedSolicitud.id);
            if (result.success) {
                // Actualizar la solicitud en el estado local
                const updatedSolicitud = {
                    ...selectedSolicitud,
                    estado: ESTADOS.Aprobada,
                    fechaAprobacion: new Date().toISOString()
                };
                
                setSelectedSolicitud(updatedSolicitud);
                
                // Actualizar la lista de solicitudes
                setSolicitudes(prev => 
                    prev.map(s => 
                        s.id === selectedSolicitud.id ? updatedSolicitud : s
                    )
                );
                
                showToast('¡Solicitud aprobada exitosamente!', 'success');
            } else {
                showToast(`Error al aprobar solicitud: ${result.message}`, 'error');
            }
        } catch (error) {
            showToast(`Error al aprobar solicitud: ${error.message}`, 'error');
        } finally {
            setProcessing(false);
        }
    };

    // Función para rechazar solicitud
    const handleRechazar = async () => {
        if (!selectedSolicitud || !motivoRechazo.trim()) {
            showToast('Por favor ingresa el motivo del rechazo', 'warning');
            return;
        }
        
        if (motivoRechazo.trim().length < 10) {
            showToast('El motivo debe tener al menos 10 caracteres', 'warning');
            return;
        }
        
        // Verificar permisos
        if (!canManageAdoptions) {
            showToast('No tienes permisos para realizar esta acción', 'error');
            return;
        }
        
        setProcessing(true);
        try {
            const result = await putRejected(selectedSolicitud.id, motivoRechazo);
            if (result.success) {
                // Actualizar la solicitud en el estado local
                const updatedSolicitud = {
                    ...selectedSolicitud,
                    estado: ESTADOS.Rechazada,
                    motivoRechazo: motivoRechazo,
                    fechaRevision: new Date().toISOString()
                };
                
                setSelectedSolicitud(updatedSolicitud);
                
                // Actualizar la lista de solicitudes
                setSolicitudes(prev => 
                    prev.map(s => 
                        s.id === selectedSolicitud.id ? updatedSolicitud : s
                    )
                );
                
                setShowRechazoModal(false);
                setMotivoRechazo('');
                showToast('Solicitud rechazada exitosamente', 'success');
            } else {
                showToast(`Error al rechazar solicitud: ${result.message}`, 'error');
            }
        } catch (error) {
            showToast(`Error al rechazar solicitud: ${error.message}`, 'error');
        } finally {
            setProcessing(false);
        }
    };

    // Función para abrir modal de rechazo
    const handleAbrirModalRechazo = () => {
        // Verificar permisos
        if (!canManageAdoptions) {
            showToast('No tienes permisos para realizar esta acción', 'error');
            return;
        }
        setShowRechazoModal(true);
        setMotivoRechazo('');
    };

    // Función para cancelar rechazo
    const handleCancelarRechazo = () => {
        setShowRechazoModal(false);
        setMotivoRechazo('');
    };

    const filteredSolicitudes = solicitudes.filter(solicitud => {
        const coincideBusqueda = 
            solicitud.mascotaNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solicitud.usuarioNombre?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const coincideEstado = filtroEstado === 'todos' || solicitud.estado === parseInt(filtroEstado);
        
        return coincideBusqueda && coincideEstado;
    });

    const contarSolicitudesPorEstado = (estado) => {
        return solicitudes.filter(solicitud => solicitud.estado === estado).length;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-600 font-medium">Cargando solicitudes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            
            {/* Header */}
            <header className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center">
                        <Logo height="40px" className="mr-3" />
                        <h1 className="text-xl font-bold text-gray-900">AdoPets - Panel de Adopciones</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.nombreCompleto}</p>
                            <p className="text-xs text-gray-500">
                                {user?.roles?.join(', ')}
                                {!canManageAdoptions && ' (Solo lectura)'}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                
                {/* Barra de Búsqueda y Filtros */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                    <div className="flex items-center p-2 mb-4 border border-gray-300 rounded bg-white">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por mascota o adoptante..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 border-none outline-none text-gray-700"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button 
                            className={`px-3 py-2 text-sm font-medium rounded border ${
                                filtroEstado === 'todos' 
                                ? 'bg-gray-600 text-white border-gray-700' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300'
                            }`}
                            onClick={() => handleFiltroEstado('todos')}
                        >
                            Todos ({solicitudes.length})
                        </button>
                        <button 
                            className={`px-3 py-2 text-sm font-medium rounded border ${
                                filtroEstado === ESTADOS.Pendiente.toString()
                                ? 'bg-blue-600 text-white border-blue-700' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300'
                            }`}
                            onClick={() => handleFiltroEstado(ESTADOS.Pendiente.toString())}
                        >
                            Pendiente ({contarSolicitudesPorEstado(ESTADOS.Pendiente)})
                        </button>
                        <button 
                            className={`px-3 py-2 text-sm font-medium rounded border ${
                                filtroEstado === ESTADOS.EnRevision.toString()
                                ? 'bg-yellow-600 text-white border-yellow-700' 
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300'
                            }`}
                            onClick={() => handleFiltroEstado(ESTADOS.EnRevision.toString())}
                        >
                            En Revisión ({contarSolicitudesPorEstado(ESTADOS.EnRevision)})
                        </button>
                        <button 
                            className={`px-3 py-2 text-sm font-medium rounded border ${
                                filtroEstado === ESTADOS.Aprobada.toString()
                                ? 'bg-green-600 text-white border-green-700' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300'
                            }`}
                            onClick={() => handleFiltroEstado(ESTADOS.Aprobada.toString())}
                        >
                            Aprobada ({contarSolicitudesPorEstado(ESTADOS.Aprobada)})
                        </button>
                        <button 
                            className={`px-3 py-2 text-sm font-medium rounded border ${
                                filtroEstado === ESTADOS.Rechazada.toString()
                                ? 'bg-red-600 text-white border-red-700' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300'
                            }`}
                            onClick={() => handleFiltroEstado(ESTADOS.Rechazada.toString())}
                        >
                            Rechazada ({contarSolicitudesPorEstado(ESTADOS.Rechazada)})
                        </button>
                    </div>
                </div>

                {/* Contador de resultados */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Mostrando {filteredSolicitudes.length} de {solicitudes.length} solicitudes
                        {filtroEstado !== 'todos' && ` - Filtrado por: ${getEstadoText(parseInt(filtroEstado))}`}
                        {!canManageAdoptions && ' (Modo solo lectura)'}
                    </p>
                </div>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Lista de Solicitudes */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                            {filteredSolicitudes.length > 0 ? (
                                filteredSolicitudes.map((solicitud) => (
                                    <SolicitudCard
                                        key={solicitud.id}
                                        solicitud={solicitud}
                                        onSelect={setSelectedSolicitud}
                                        isSelected={selectedSolicitud?.id === solicitud.id}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="font-medium">No se encontraron solicitudes</p>
                                    <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel de Detalles */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:sticky lg:top-4 lg:h-fit max-h-[90vh] overflow-y-auto">
                        {selectedSolicitud ? (
                            <div className="space-y-6">
                                {/* Header Compacto con Foto Redonda y Centrada */}
                                <div className="text-center border-b border-gray-300 pb-4">
                                    <div className="flex flex-col items-center">
                                        {/* Foto redonda y centrada */}
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg mx-auto mb-3">
                                            {selectedSolicitud.mascotaFotos && selectedSolicitud.mascotaFotos.length > 0 ? (
                                                <img 
                                                    src={selectedSolicitud.mascotaFotos[0]?.storageKey} 
                                                    alt={selectedSolicitud.mascotaNombre}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-2xl text-gray-400">🐾</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Información centrada */}
                                        <div className="text-center">
                                            <h2 className="text-xl font-bold text-gray-900">{selectedSolicitud.mascotaNombre}</h2>
                                            <p className="text-sm text-gray-600 mt-1">Por: {selectedSolicitud.usuarioNombre}</p>
                                            
                                            {/* Estado centrado */}
                                            <div className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 border ${getEstadoColor(selectedSolicitud.estado)}`}>
                                                {getEstadoText(selectedSolicitud.estado)}
                                            </div>
                                            
                                            {/* Fechas centradas y compactas */}
                                            <div className="flex justify-center space-x-4 mt-3 text-xs text-gray-500">
                                                <div>
                                                    <span className="font-medium">Solicitud:</span>{' '}
                                                    {formatFechaCorta(selectedSolicitud.fechaSolicitud)}
                                                </div>
                                                {selectedSolicitud.fechaRevision && (
                                                    <div>
                                                        <span className="font-medium">Revisión:</span>{' '}
                                                        {formatFechaCorta(selectedSolicitud.fechaRevision)}
                                                    </div>
                                                )}
                                                {selectedSolicitud.fechaAprobacion && (
                                                    <div>
                                                        <span className="font-medium">Aprobación:</span>{' '}
                                                        {formatFechaCorta(selectedSolicitud.fechaAprobacion)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Información en Grid Organizado */}
                                <div className="space-y-4">
                                    {/* Información de la Mascota */}
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide border-b border-gray-300 pb-2">Información de la Mascota</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <PanelInfoField label="Especie" value={selectedSolicitud.especie} />
                                            <PanelInfoField label="Raza" value={selectedSolicitud.raza} />
                                            <PanelInfoField label="Sexo" value={selectedSolicitud.sexo} />
                                            <PanelInfoField label="Edad" value={selectedSolicitud.edad} />
                                            <PanelInfoField label="Nacimiento" 
                                                value={selectedSolicitud.fechaNacimiento ? 
                                                    formatFechaCorta(selectedSolicitud.fechaNacimiento) : 'N/A'} 
                                            />
                                        </div>
                                    </div>

                                    {/* Información del Adoptante */}
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide border-b border-gray-300 pb-2">Información del Adoptante</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <PanelInfoField label="Nombre" value={selectedSolicitud.usuarioNombre} />
                                            <PanelInfoField label="Email" value={selectedSolicitud.email} />
                                            <PanelInfoField label="Teléfono" value={selectedSolicitud.telefono} />
                                            <PanelInfoField label="Dirección" value={selectedSolicitud.direccion || selectedSolicitud.usuarioDireccion} fullWidth />
                                        </div>
                                    </div>

                                    {/* Situación del Hogar */}
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide border-b border-gray-300 pb-2">Situación del Hogar</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <PanelInfoField label="Tipo de Vivienda" value={getTipoVivienda(selectedSolicitud.vivienda)} />
                                            <PanelInfoField label="Número de Niños" value={selectedSolicitud.numNinios?.toString()} />
                                            <PanelInfoField label="Otras Mascotas" value={selectedSolicitud.otrasMascotas ? 'Sí' : 'No'} />
                                            <PanelInfoField label="Horas Disponibles" value={`${selectedSolicitud.horasDisponibilidad} hrs`} />
                                            <PanelInfoField label="Ingresos Mensuales" 
                                                value={`$${selectedSolicitud.ingresosMensuales?.toLocaleString()}`} 
                                                fullWidth
                                            />
                                        </div>
                                    </div>

                                    {/* Motivos */}
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide border-b border-gray-300 pb-2">Motivos de la Solicitud</h3>
                                        <div className="space-y-3">
                                            <PanelTextAreaField 
                                                label="Motivo de Adopción" 
                                                value={selectedSolicitud.motivoAdopcion} 
                                            />
                                            {selectedSolicitud.motivoRechazo && (
                                                <PanelTextAreaField 
                                                    label="Motivo de Rechazo" 
                                                    value={selectedSolicitud.motivoRechazo} 
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Galería de Fotos */}
                                {selectedSolicitud.mascotaFotos && selectedSolicitud.mascotaFotos.length > 0 && (
                                    <div className="border-t border-gray-300 pt-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Galería de Fotos</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedSolicitud.mascotaFotos.map((foto, index) => (
                                                <div key={index} className="relative border border-gray-300 rounded overflow-hidden">
                                                    <img 
                                                        src={foto.storageKey} 
                                                        alt={`${selectedSolicitud.mascotaNombre} ${index + 1}`}
                                                        className="w-full h-20 object-cover"
                                                    />
                                                    {foto.esPrincipal && (
                                                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                                            Principal
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Acciones */}
                                <div className="border-t border-gray-300 pt-4">
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        <button className="px-3 py-2 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-50 bg-white">
                                            Ver Documentos
                                        </button>
                                        
                                        {/* Estados donde NO se muestran botones de acción */}
                                        {![ESTADOS.Aprobada, ESTADOS.Rechazada, ESTADOS.Cancelada].includes(selectedSolicitud.estado) && (
                                            <>
                                                {/* Estado Pendiente: Solo botón de Iniciar Revisión */}
                                                {selectedSolicitud.estado === ESTADOS.Pendiente && (
                                                    <button 
                                                        onClick={handleIniciarRevision}
                                                        disabled={processing || !canManageAdoptions}
                                                        className={`px-3 py-2 text-xs rounded border ${
                                                            canManageAdoptions 
                                                                ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-700' 
                                                                : 'bg-gray-400 text-gray-200 border-gray-500 cursor-not-allowed'
                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        {processing ? 'Procesando...' : 'Iniciar Revisión'}
                                                    </button>
                                                )}
                                                
                                                {/* Estado En Revisión: Botones de Aprobar y Rechazar */}
                                                {selectedSolicitud.estado === ESTADOS.EnRevision && (
                                                    <>
                                                        <button 
                                                            onClick={handleAbrirModalRechazo}
                                                            disabled={processing || !canManageAdoptions}
                                                            className={`px-3 py-2 text-xs rounded border ${
                                                                canManageAdoptions 
                                                                    ? 'bg-red-600 text-white hover:bg-red-700 border-red-700' 
                                                                    : 'bg-gray-400 text-gray-200 border-gray-500 cursor-not-allowed'
                                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        >
                                                            Rechazar
                                                        </button>
                                                        <button 
                                                            onClick={handleAprobar}
                                                            disabled={processing || !canManageAdoptions}
                                                            className={`px-3 py-2 text-xs rounded border ${
                                                                canManageAdoptions 
                                                                    ? 'bg-green-600 text-white hover:bg-green-700 border-green-700' 
                                                                    : 'bg-gray-400 text-gray-200 border-gray-500 cursor-not-allowed'
                                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        >
                                                            {processing ? 'Procesando...' : 'Aprobar'}
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p className="font-medium">Selecciona una solicitud para ver los detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para motivo de rechazo */}
            {showRechazoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Motivo de Rechazo</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Por favor ingresa el motivo por el cual se rechaza esta solicitud de adopción.
                        </p>
                        <textarea
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            placeholder="Describe el motivo del rechazo..."
                            className="w-full p-3 border border-gray-300 rounded-md resize-none h-32 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={handleCancelarRechazo}
                                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleRechazar}
                                disabled={!motivoRechazo.trim() || processing}
                                className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Procesando...' : 'Confirmar Rechazo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificación Toast */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={closeToast} 
                />
            )}
        </div>
    );
};

export default Adoption;