import React, { useEffect, useState } from 'react';
import { usePet } from '../hooks/usePet';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const ListPet = () => {
  const { pets, getMascota, getRegister, addPhotos, getPetById, updatepet, deletepet, deletePhotoPet } = usePet();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Verificar si el usuario tiene permisos de administración
  const canManagePets = user?.roles?.includes('Admin') || user?.roles?.includes('Veterinario');

  const [filters, setFilters] = useState({
    Especie: "",
    Raza: "",
    Sexo: "",
    Estatus: "",
    EdadEnAnios: "",
  });

  const [nombreFilter, setNombreFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Estado para las alertas
  const [alert, setAlert] = useState({
    show: false,
    type: '', // 'success', 'error', 'warning', 'info'
    title: '',
    message: '',
    duration: 4000 // duración en milisegundos
  });

  // Estado para el formulario de registro
  const [newPet, setNewPet] = useState({
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
  });

  // Estado para el formulario de edición
  const [editPet, setEditPet] = useState({
    nombre: '',
    especie: '',
    raza: '',
    fechaNacimiento: '',
    sexo: 0,
    estatus: 0,
    personalidad: '',
    estadoSalud: '',
    requisitoAdopcion: '',
    origen: '',
    notas: '',
  });

  const [editingPetId, setEditingPetId] = useState(null); // ← ID de la mascota en edición

  // Estado para las fotos
  const [petPhotos, setPetPhotos] = useState([]);
  const [editPetPhotos, setEditPetPhotos] = useState([]); // ← Fotos para edición
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  // Función para mostrar alertas
  const showAlert = (type, title, message, duration = 4000) => {
    setAlert({
      show: true,
      type,
      title,
      message,
      duration
    });
  };

  // Función para ocultar alertas
  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Auto-ocultar alerta después del tiempo especificado
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        hideAlert();
      }, alert.duration);

      return () => clearTimeout(timer);
    }
  }, [alert.show, alert.duration]);

  // Función para eliminar una foto existente
const handleDeletePhoto = async (photoId) => {
  if (!photoId || photoId.toString().startsWith('temp-')) {
    showAlert('error', 'Error', 'No se puede eliminar la foto: ID no válido');
    return;
  }

  try {
    console.log('Eliminando foto con ID:', photoId);
    console.log('Tipo de ID:', typeof photoId);
    
    const result = await deletePhotoPet(photoId);
    
    if (result.success) {
      console.log('Foto eliminada correctamente');
      showAlert('success', 'Éxito', 'Foto eliminada correctamente');
      
      // Remover la foto del estado local
      setEditPetPhotos(prev => {
        const nuevasFotos = prev.filter(photo => photo.id !== photoId);
        console.log('🔄 Fotos después de eliminar:', nuevasFotos);
        return nuevasFotos;
      });
      
    } else {
      console.error('Error en respuesta:', result);
      showAlert('error', 'Error', result.message || 'No se pudo eliminar la foto');
    }
  } catch (error) {
    console.error('💥 Error al eliminar foto:', error);
    console.error('💥 Detalles del error:', error.response?.data);
    showAlert('error', 'Error', 'No se pudo eliminar la foto: ' + (error.message || 'Error desconocido'));
  }
};

  // Función para confirmar eliminación de foto
  // En el botón de eliminar foto, agrega más información:
const confirmDeletePhoto = (photoId, isExisting) => {
  console.log('Click en eliminar foto:', { photoId, isExisting });
  
  if (isExisting) {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta foto permanentemente?')) {
      handleDeletePhoto(photoId);
    }
  } else {
    const photoIndex = editPetPhotos.findIndex(photo => 
      !photo.isExisting && photo.preview && !photo.id
    );
    if (photoIndex !== -1) {
      handleRemoveEditPhoto(photoIndex);
    }
  }
};

  // Función para cargar datos de mascota para editar
 const handleEditPet = async (petId) => {
  try {
    setEditLoading(true);
    const result = await getPetById(petId);
    
    if (result.success) {
      const petData = result.data;
      
      console.log('📸 Fotos recibidas CON ID:', petData.fotos);
      
      // Formatear fecha
      const formattedDate = petData.fechaNacimiento 
        ? new Date(petData.fechaNacimiento).toISOString().split('T')[0]
        : '';
      
      setEditPet({
        nombre: petData.nombre || '',
        especie: petData.especie || '',
        raza: petData.raza || '',
        fechaNacimiento: formattedDate,
        sexo: petData.sexo || 0,
        estatus: petData.estatus || 0,
        personalidad: petData.personalidad || '',
        estadoSalud: petData.estadoSalud || '',
        requisitoAdopcion: petData.requisitoAdopcion || '',
        origen: petData.origen || '',
        notas: petData.notas || '',
      });

      setEditingPetId(petId);
      
      // MAPEO ACTUALIZADO - Usar el ID real del backend
      if (petData.fotos && petData.fotos.length > 0) {
        const existingPhotos = petData.fotos.map((foto) => {
          console.log('📸 Foto con ID real:', {
            id: foto.id,
            storageKey: foto.storageKey,
            esPrincipal: foto.esPrincipal
          });
          
          if (!foto.id) {
            console.error('Foto sin ID:', foto);
            return null;
          }
          
          return {
            id: foto.id, // Usar el ID real del backend
            preview: foto.storageKey,
            isPrincipal: foto.esPrincipal || false,
            isExisting: true,
            storageKey: foto.storageKey // Mantener por si acaso
          };
        }).filter(photo => photo !== null);
        
        console.log('Fotos procesadas con IDs reales:', existingPhotos);
        setEditPetPhotos(existingPhotos);
      } else {
        console.log('📸 No hay fotos existentes');
        setEditPetPhotos([]);
      }
      
      setShowEditModal(true);
      showAlert('success', 'Éxito', 'Datos de la mascota cargados correctamente');
    } else {
      showAlert('error', 'Error', result.message || 'Error al cargar los datos de la mascota');
    }
  } catch (error) {
    console.error('Error al cargar mascota:', error);
    showAlert('error', 'Error', 'Error al cargar los datos de la mascota');
  } finally {
    setEditLoading(false);
  }
};

  // Función para manejar la actualización de mascota
  const handleUpdatePet = async (e) => {
    e.preventDefault();
    if (!editingPetId) return;

    setEditLoading(true);

    try {
      const result = await updatepet(editingPetId, editPet);
      
      if (result.success) {
        // Subir nuevas fotos si hay alguna
        if (editPetPhotos.some(photo => !photo.isExisting)) {
          const newPhotos = editPetPhotos.filter(photo => !photo.isExisting);
          if (newPhotos.length > 0) {
            const photoResult = await uploadEditPetPhotos(editingPetId, newPhotos);
            if (!photoResult.success) {
              showAlert('warning', 'Aviso', 'Mascota actualizada pero hubo un error al subir las nuevas fotos');
            } else {
              showAlert('success', '¡Éxito!', 'Mascota actualizada exitosamente con sus nuevas fotos');
            }
          } else {
            showAlert('success', '¡Éxito!', 'Mascota actualizada exitosamente');
          }
        } else {
          showAlert('success', '¡Éxito!', 'Mascota actualizada exitosamente');
        }
        
        setShowEditModal(false);
        resetEditForm();
        getMascota(); // Recargar la lista
      } else {
        showAlert('error', 'Error', result.message || 'Error al actualizar la mascota');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Error', 'Error al actualizar la mascota');
    } finally {
      setEditLoading(false);
    }
  };

  // Subir fotos para edición
  const uploadEditPetPhotos = async (petId, photos) => {
    if (photos.length === 0) return { success: true };

    setUploadingPhotos(true);
    try {
      console.log('🔄 Convirtiendo fotos a Base64 para edición...');
      
      // Convertir cada foto a Base64
      const fotosParaEnviar = await Promise.all(
        photos.map(async (photo, index) => {
          
          const base64 = await convertFileToBase64(photo.file);
          return {
            storageKey: base64,
            mimeType: photo.file.type,
            uploadedAt: new Date().toISOString(),
            esPrincipal: photo.isPrincipal
          };
        })
      );

      console.log(' Enviando fotos como JSON:', fotosParaEnviar);
      
      const result = await addPhotos(petId, fotosParaEnviar);
      return result;
    } catch (error) {
      console.error(' Error al subir fotos:', error);
      return { 
        success: false, 
        message: 'Error al subir las fotos: ' + (error.message || 'Error desconocido')
      };
    } finally {
      setUploadingPhotos(false);
    }
  };

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convertir a número específicamente para estatus y sexo
    if (name === 'estatus' || name === 'sexo') {
      setEditPet(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setEditPet(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
      }));
    }
  };

  // Manejar selección de fotos para edición
  const handleEditPhotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar tipo de archivo
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      showAlert('warning', 'Formato no válido', 'Solo se permiten archivos de imagen (JPEG, PNG, JPG, WEBP)');
    }

    // Crear previews de las imágenes
    const newPhotos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isPrincipal: editPetPhotos.length === 0, // La primera foto será la principal por defecto
      isExisting: false // Marcar como nueva foto
    }));

    setEditPetPhotos(prev => [...prev, ...newPhotos]);
  };

  // Eliminar foto en edición
  const handleRemoveEditPhoto = (index) => {
    setEditPetPhotos(prev => {
      const newPhotos = prev.filter((_, i) => i !== index);
      // Si eliminamos la foto principal, hacer la primera foto restante como principal
      if (prev[index].isPrincipal && newPhotos.length > 0) {
        newPhotos[0].isPrincipal = true;
      }
      return newPhotos;
    });
  };

  // Marcar foto como principal en edición
  const handleSetEditPrincipal = (index) => {
    setEditPetPhotos(prev => 
      prev.map((photo, i) => ({
        ...photo,
        isPrincipal: i === index
      }))
    );
  };

  // Resetear formulario de edición
  const resetEditForm = () => {
    setEditPet({
      nombre: '',
      especie: '',
      raza: '',
      fechaNacimiento: '',
      sexo: 0,
      estatus: 0,
      personalidad: '',
      estadoSalud: '',
      requisitoAdopcion: '',
      origen: '',
      notas: '',
    });
    setEditPetPhotos([]);
    setEditingPetId(null);
  };

  // Cerrar modal de edición
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetEditForm();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleNombreChange = (e) => {
    setNombreFilter(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    
    const allFilters = {
      ...filters,
      ...(nombreFilter && { Nombre: nombreFilter })
    };
    
    const filtroLimpio = Object.fromEntries(
      Object.entries(allFilters).filter(([k, v]) => v !== "")
    );
    
    await getMascota(filtroLimpio);
    setLoading(false);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      Especie: "",
      Raza: "",
      Sexo: "",
      Estatus: "",
      EdadEnAnios: "",
    });
    setNombreFilter("");
    getMascota();
    setShowFilters(false);
  };

  const handleAddPet = () => {
    setShowRegisterModal(true);
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
      try {
        console.log('Eliminando mascota con ID:', petId);
        
        // Llamar al método deletepet del contexto
        const result = await deletepet(petId);
        
        if (result.success) {
          showAlert('success', 'Éxito', 'Mascota eliminada correctamente');
          getMascota(); // Recargar la lista de mascotas
        } else {
          showAlert('error', 'Error', result.message || 'No se pudo eliminar la mascota');
        }
      } catch (error) {
        console.error('Error al eliminar mascota:', error);
        showAlert('error', 'Error', 'No se pudo eliminar la mascota');
      }
    }
  };

  // Manejar cambios en el formulario de registro (existente)
  const handleRegisterChange = (e) => {
    const { name, value, type } = e.target;
    setNewPet(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  // Manejar selección de fotos (existente)
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar tipo de archivo
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      showAlert('warning', 'Formato no válido', 'Solo se permiten archivos de imagen (JPEG, PNG, JPG, WEBP)');
    }

    // Crear previews de las imágenes
    const newPhotos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isPrincipal: petPhotos.length === 0 // La primera foto será la principal por defecto
    }));

    setPetPhotos(prev => [...prev, ...newPhotos]);
  };

  // Eliminar foto (existente)
  const handleRemovePhoto = (index) => {
    setPetPhotos(prev => {
      const newPhotos = prev.filter((_, i) => i !== index);
      // Si eliminamos la foto principal, hacer la primera foto restante como principal
      if (prev[index].isPrincipal && newPhotos.length > 0) {
        newPhotos[0].isPrincipal = true;
      }
      return newPhotos;
    });
  };

  // Marcar foto como principal (existente)
  const handleSetPrincipal = (index) => {
    setPetPhotos(prev => 
      prev.map((photo, i) => ({
        ...photo,
        isPrincipal: i === index
      }))
    );
  };

  // Subir fotos después de registrar la mascota (existente)
  const uploadPetPhotos = async (petId) => {
    if (petPhotos.length === 0) return { success: true };

    setUploadingPhotos(true);
    try {
      console.log('🔄 Convirtiendo fotos a Base64...');
      
      // Convertir cada foto a Base64
      const fotosParaEnviar = await Promise.all(
        petPhotos.map(async (photo, index) => {
          const base64 = await convertFileToBase64(photo.file);
          return {
            storageKey: base64, // El backend procesará este Base64
            mimeType: photo.file.type,
            uploadedAt: new Date().toISOString(),
            esPrincipal: photo.isPrincipal
          };
        })
      );

      console.log(' Enviando fotos como JSON:', fotosParaEnviar);
      
      // Enviar como JSON, no como FormData
      const result = await addPhotos(petId, fotosParaEnviar);
      return result;
    } catch (error) {
      console.error(' Error al subir fotos:', error);
      return { 
        success: false, 
        message: 'Error al subir las fotos: ' + (error.message || 'Error desconocido')
      };
    } finally {
      setUploadingPhotos(false);
    }
  };

  // Función auxiliar para convertir File a Base64 (existente)
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Esto produce data:image/jpeg;base64,...
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Enviar formulario de registro (existente)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      // 1. Registrar la mascota
      const result = await getRegister(newPet);
      
      if (result.success) {
        const petId = result.data?.id || result.data?.data?.id;
        
        if (petId) {
          // 2. Subir fotos si hay alguna
          if (petPhotos.length > 0) {
            const photoResult = await uploadPetPhotos(petId);
            
            if (!photoResult.success) {
              showAlert('warning', 'Aviso', 'Mascota registrada pero hubo un error al subir las fotos');
            } else {
              showAlert('success', '¡Éxito!', 'Mascota registrada exitosamente con sus fotos');
            }
          } else {
            showAlert('success', '¡Éxito!', 'Mascota registrada exitosamente');
          }
          
          setShowRegisterModal(false);
          resetForm();
          getMascota(); // Recargar la lista
        } else {
          showAlert('error', 'Error', 'No se pudo obtener el ID de la mascota registrada');
        }
      } else {
        showAlert('error', 'Error', result.message || 'Error al registrar la mascota');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Error', 'Error al registrar la mascota');
    } finally {
      setRegisterLoading(false);
    }
  };

  // Resetear formulario (existente)
  const resetForm = () => {
    setNewPet({
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
    });
    setPetPhotos([]);
  };

  // Cerrar modal (existente)
  const handleCloseModal = () => {
    setShowRegisterModal(false);
    resetForm();
  };

  // Búsqueda en tiempo real por nombre (existente)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (nombreFilter !== "") {
        const filtroLimpio = { Nombre: nombreFilter };
        getMascota(filtroLimpio);
      } else if (Object.values(filters).every(val => val === "")) {
        getMascota();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [nombreFilter]);

  useEffect(() => {
    getMascota();
  }, []);

  // Limpiar URLs de preview cuando el componente se desmonte
  useEffect(() => {
    return () => {
      petPhotos.forEach(photo => {
        if (photo.preview && !photo.isExisting) {
          URL.revokeObjectURL(photo.preview);
        }
      });
      editPetPhotos.forEach(photo => {
        if (photo.preview && !photo.isExisting) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, [petPhotos, editPetPhotos]);

  // Componente de Alerta Mejorado - TODAS EN AZUL (existente)
  const AlertComponent = () => {
    if (!alert.show) return null;

    // Configuración para todas las alertas en azul
    const blueAlertConfig = {
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      progressColor: 'bg-blue-400',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className={`max-w-md w-full mx-auto ${blueAlertConfig.bgColor} border rounded-2xl shadow-2xl p-6 pointer-events-auto transform transition-all duration-300 scale-100 opacity-100`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${blueAlertConfig.iconColor} mt-0.5`}>
              {blueAlertConfig.icon}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-lg font-semibold ${blueAlertConfig.textColor}`}>
                {alert.title}
              </h3>
              {alert.message && (
                <p className={`mt-1 text-sm ${blueAlertConfig.textColor} opacity-90`}>
                  {alert.message}
                </p>
              )}
            </div>
            <button
              onClick={hideAlert}
              className={`ml-4 flex-shrink-0 ${blueAlertConfig.textColor} hover:opacity-70 transition-opacity`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-100 ${blueAlertConfig.progressColor}`}
              style={{ 
                width: '100%',
                animation: `progressBar ${alert.duration}ms linear forwards`
              }}
            />
          </div>

          <style jsx>{`
            @keyframes progressBar {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Componente de Alerta */}
      <AlertComponent />

      {/* Header */}
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="w-full sm:max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={nombreFilter}
                onChange={handleNombreChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros
            </button>
            
            {/* Botón Agregar - Solo visible para Admin y Veterinario */}
            {canManagePets && (
              <button
                onClick={handleAddPet}
                className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar
              </button>
            )}
            
            {(nombreFilter || Object.values(filters).some(val => val !== "")) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Modal de Filtros */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-30">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filtros de búsqueda
                  </h2>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Especie</label>
                    <input
                      type="text"
                      name="Especie"
                      placeholder="Perro, Gato, etc."
                      value={filters.Especie}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
                    <input
                      type="text"
                      name="Raza"
                      placeholder="Ej: Labrador, Siames"
                      value={filters.Raza}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                    <select
                      name="Sexo"
                      value={filters.Sexo}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Todos</option>
                      <option value="1">Macho</option>
                      <option value="2">Hembra</option>
                      <option value="3">Desconocido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
                    <select
                      name="Estatus"
                      value={filters.Estatus}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Todos</option>
                      <option value="1">Disponible</option>
                      <option value="2">Reservada</option>
                      <option value="3">Adoptada</option>
                      <option value="4">NoAdoptable</option>
                      <option value="5">EnTratamiento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad (años)</label>
                    <input
                      type="number"
                      name="EdadEnAnios"
                      placeholder="Ej: 2"
                      value={filters.EdadEnAnios}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Buscando...
                      </>
                    ) : (
                      'Aplicar Filtros'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenedor principal con grid para cards y modal */}
        <div className="flex gap-6 relative">
          {/* Lista de Mascotas - Se ajusta cuando el modal está abierto */}
          <div className={`transition-all duration-300 ${showRegisterModal || showEditModal ? 'w-2/5' : 'w-full'}`}>
            {!pets ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600">Cargando mascotas...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {pets.length} {pets.length === 1 ? 'mascota encontrada' : 'mascotas encontradas'}
                  </h2>
                </div>
                
                {pets.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron mascotas</h3>
                    <p className="text-gray-500 max-w-md mx-auto">Intenta ajustar los filtros de búsqueda o limpiarlos para ver todas las mascotas disponibles.</p>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${showRegisterModal || showEditModal ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'}`}>
                    {pets.map((pet) => {
                      const fotoPrincipal =
                        pet.fotos?.find((f) => f.esPrincipal)?.storageKey ||
                        pet.fotos?.[0]?.storageKey;

                      const getStatusColor = (status) => {
                        switch(status) {
                          case 1: return "bg-green-100 text-green-800 border border-green-200";
                          case 2: return "bg-yellow-100 text-yellow-800 border border-yellow-200";
                          case 3: return "bg-blue-100 text-blue-800 border border-blue-200";
                          case 4: return "bg-red-100 text-red-800 border border-red-200";
                          case 5: return "bg-purple-100 text-purple-800 border border-purple-200";
                          default: return "bg-gray-100 text-gray-800 border border-gray-200";
                        }
                      };

                      const getStatusText = (status) => {
                        switch(status) {
                          case 1: return "Disponible";
                          case 2: return "Reservada";
                          case 3: return "Adoptado";
                          case 4: return "No Adoptable";
                          case 5: return "En Tratamiento";
                          default: return "Desconocido";
                        }
                      };

                      return (
                        <div key={pet.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200">
                          <div className="flex p-4 h-full">
                            <div className="flex-shrink-0 my-auto">
                              <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200 mr-4">
                                <img
                                  src={fotoPrincipal || "https://placehold.co/200x200?text=Sin+imagen"}
                                  alt={pet.nombre}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 right-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pet.estatus)}`}>
                                    {getStatusText(pet.estatus)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex-grow flex flex-col justify-between min-w-0 w-full">
                              <div className="min-w-0 w-full">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="min-w-0 flex-1 mr-3">
                                    <h2 className="text-xl font-bold text-gray-900 truncate mb-2">{pet.nombre}</h2>
                                    
                                    <div className="grid grid-cols-1 gap-2">
                                      <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                        <span className="text-sm text-gray-700 font-medium">Especie:</span>
                                        <span className="text-sm text-gray-600 ml-1 truncate">{pet.especie}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-sm text-gray-700 font-medium">Raza:</span>
                                        <span className="text-sm text-gray-600 ml-1 truncate">{pet.raza || 'Sin especificar'}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-700 font-medium">Edad:</span>
                                        <span className="text-sm text-gray-600 ml-1">{pet.edadEnAnio || 'N/A'} años</span>
                                      </div>
                                      <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-sm text-gray-700 font-medium">Sexo:</span>
                                        <span className="text-sm text-gray-600 ml-1">{pet.sexo === 1 ? 'Macho' : 'Hembra'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col space-y-2 flex-shrink-0">
                                    {/* Botones Editar y Eliminar - Solo visibles para Admin y Veterinario */}
                                    {canManagePets && (
                                      <>
                                        <button 
                                          onClick={() => handleEditPet(pet.id)}
                                          className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-500 transition-colors text-xs font-medium whitespace-nowrap"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                          Editar
                                        </button>
                                        <button 
                                          onClick={() => handleDeletePet(pet.id)}
                                          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium whitespace-nowrap"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          Eliminar
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal de Registro de Mascota - Más ancho */}
          {showRegisterModal && (
            <div className="w-3/5 sticky top-8 h-fit bg-white rounded-xl shadow-2xl border border-gray-200">
              <div className="h-full flex flex-col">
                {/* Header del Modal */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Registrar Mascota
                    </h2>
                    <button 
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Formulario - Más espacioso */}
                <div className="flex-1 overflow-y-auto p-6">
                  <form onSubmit={handleRegisterSubmit}>
                    {/* Título mejorado */}
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-sm">
                        🐾 Datos de Mascotas
                      </h1>
                      <p className="text-gray-500 mt-2 text-sm">Completa la información de la nueva mascota</p>
                    </div>

                    {/* Sección de Fotos */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Fotos de la Mascota
                      </h3>
                      
                      {/* Input para subir fotos */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Seleccionar fotos
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          onChange={handlePhotoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Formatos permitidos: JPEG, PNG, JPG, WEBP. Puedes seleccionar múltiples archivos.
                        </p>
                      </div>

                      {/* Preview de fotos */}
                      {petPhotos.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {petPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={photo.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrincipal(index)}
                                    className={`p-1 rounded-full ${
                                      photo.isPrincipal 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                    title={photo.isPrincipal ? 'Foto principal' : 'Marcar como principal'}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    title="Eliminar foto"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {photo.isPrincipal && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  Principal
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Primera sección - Campos básicos mejorados */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                      {/* Nombre */}
                      <div className="col-span-2">
                        <div className="relative">
                          <input
                            type="text"
                            name="nombre"
                            value={newPet.nombre}
                            onChange={handleRegisterChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20"
                            placeholder="Nombre de la mascota"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-red-500 text-sm">*</span>
                          </div>
                        </div>
                      </div>

                      {/* Especie */}
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            name="especie"
                            value={newPet.especie}
                            onChange={handleRegisterChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20"
                            placeholder="Especie"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-red-500 text-sm">*</span>
                          </div>
                        </div>
                      </div>

                      {/* Raza */}
                      <div>
                        <input
                          type="text"
                          name="raza"
                          value={newPet.raza}
                          onChange={handleRegisterChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20"
                          placeholder="Raza"
                        />
                      </div>

                      {/* Fecha Nacimiento */}
                      <div>
                        <input
                          type="date"
                          name="fechaNacimiento"
                          value={newPet.fechaNacimiento}
                          onChange={handleRegisterChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 text-gray-700"
                        />
                      </div>

                      {/* Sexo */}
                      <div>
                        <div className="relative">
                          <select
                            name="sexo"
                            value={newPet.sexo}
                            onChange={handleRegisterChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 appearance-none"
                          >
                            <option value={0}>Sexo</option>
                            <option value={1}>Macho</option>
                            <option value={2}>Hembra</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-red-500 text-sm">*</span>
                            <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Origen */}
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="origen"
                          value={newPet.origen}
                          onChange={handleRegisterChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20"
                          placeholder="Origen de la mascota"
                        />
                      </div>
                    </div>

                    {/* Segunda sección - Campos de texto mejorados */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Personalidad */}
                      <div>
                        <textarea
                          name="personalidad"
                          value={newPet.personalidad}
                          onChange={handleRegisterChange}
                          rows="4"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 resize-none"
                          placeholder="Personalidad y comportamiento..."
                        />
                      </div>

                      {/* Estado de Salud */}
                      <div>
                        <textarea
                          name="estadoSalud"
                          value={newPet.estadoSalud}
                          onChange={handleRegisterChange}
                          rows="4"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 resize-none"
                          placeholder="Estado de salud y cuidados..."
                        />
                      </div>

                      {/* Requisitos de Adopción */}
                      <div>
                        <textarea
                          name="requisitoAdopcion"
                          value={newPet.requisitoAdopcion}
                          onChange={handleRegisterChange}
                          rows="4"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 resize-none"
                          placeholder="Requisitos para la adopción..."
                        />
                      </div>

                      {/* Notas Adicionales */}
                      <div>
                        <textarea
                          name="notas"
                          value={newPet.notas}
                          onChange={handleRegisterChange}
                          rows="4"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 resize-none"
                          placeholder="Notas adicionales importantes..."
                        />
                      </div>
                    </div>

                    {/* Indicador de campos requeridos */}
                    <div className="mt-6 flex justify-center">
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        <span className="text-red-500">*</span>
                        <span>Campos obligatorios</span>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Footer del Modal */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      onClick={handleRegisterSubmit}
                      disabled={registerLoading || uploadingPhotos}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors flex items-center"
                    >
                      {(registerLoading || uploadingPhotos) ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {uploadingPhotos ? 'Subiendo fotos...' : 'Registrando...'}
                        </>
                      ) : (
                        'Registrar Mascota'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Edición de Mascota - Nuevo modal */}
          {showEditModal && (
            <div className="w-3/5 sticky top-8 h-fit bg-white rounded-xl shadow-2xl border border-gray-200">
              <div className="h-full flex flex-col">
                {/* Header del Modal */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar Mascota
                    </h2>
                    <button 
                      onClick={handleCloseEditModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Formulario - Más espacioso */}
                <div className="flex-1 overflow-y-auto p-6">
                  <form onSubmit={handleUpdatePet}>
                    {/* Título mejorado */}
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-sm">
                        🐾 Editar Mascota
                      </h1>
                      <p className="text-gray-500 mt-2 text-sm">Modifica la información de la mascota</p>
                    </div>

                    {/* Sección de Fotos */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Fotos de la Mascota
                      </h3>
                      
                      {/* Input para subir fotos */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Agregar nuevas fotos
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          onChange={handleEditPhotoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Formatos permitidos: JPEG, PNG, JPG, WEBP. Puedes seleccionar múltiples archivos.
                        </p>
                      </div>

                      {/* Preview de fotos */}
                      {editPetPhotos.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {editPetPhotos.map((photo, index) => (
                            <div key={photo.id || index} className="relative group">
                              <img
                                src={photo.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSetEditPrincipal(index)}
                                    className={`p-1 rounded-full ${
                                      photo.isPrincipal 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                    title={photo.isPrincipal ? 'Foto principal' : 'Marcar como principal'}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => confirmDeletePhoto(photo.id, photo.isExisting)}
                                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    title={photo.isExisting ? "Eliminar foto permanentemente" : "Quitar foto"}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {photo.isPrincipal && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  Principal
                                </div>
                              )}
                              {photo.isExisting && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                  Existente
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Primera sección - Campos básicos mejorados */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                      {/* Nombre */}
                      <div className="col-span-2">
                        <div className="relative">
                          <input
                            type="text"
                            name="nombre"
                            value={editPet.nombre}
                            onChange={handleEditChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20"
                            placeholder="Nombre de la mascota"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-red-500 text-sm">*</span>
                          </div>
                        </div>
                      </div>

                      {/* Especie */}
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            name="especie"
                            value={editPet.especie}
                            onChange={handleEditChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20"
                            placeholder="Especie"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-red-500 text-sm">*</span>
                          </div>
                        </div>
                      </div>

                      {/* Raza */}
                      <div>
                        <input
                          type="text"
                          name="raza"
                          value={editPet.raza}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20"
                          placeholder="Raza"
                        />
                      </div>

                      {/* Fecha Nacimiento */}
                      <div>
                        <input
                          type="date"
                          name="fechaNacimiento"
                          value={editPet.fechaNacimiento}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 text-gray-700"
                        />
                      </div>

                      {/* Sexo */}
                      <div>
                        <div className="relative">
                          <select
                            name="sexo"
                            value={editPet.sexo}
                            onChange={handleEditChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 appearance-none"
                          >
                            <option value={0}>Sexo</option>
                            <option value={1}>Macho</option>
                            <option value={2}>Hembra</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-red-500 text-sm">*</span>
                            <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="relative">
                          <select
                            name="estatus"
                            value={editPet.estatus}
                            onChange={handleEditChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 appearance-none"
                          >
                            <option value={0}>Estatus</option>
                            <option value={1}>Disponible</option>
                            <option value={5}>EnTratamiento</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-red-500 text-sm">*</span>
                            <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Origen */}
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="origen"
                          value={editPet.origen}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20"
                          placeholder="Origen de la mascota"
                        />
                      </div>
                    </div>

                    {/* Segunda sección - Campos de texto mejorados */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Personalidad */}
                      <div>
                        <textarea
                          name="personalidad"
                          value={editPet.personalidad}
                          onChange={handleEditChange}
                          rows="4"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 resize-none"
                          placeholder="Personalidad y comportamiento..."
                        />
                      </div>

                      {/* Estado de Salud */}
                      <div>
                        <textarea
                          name="estadoSalud"
                          value={editPet.estadoSalud}
                          onChange={handleEditChange}
                          rows="4"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 resize-none"
                          placeholder="Estado de salud y cuidados..."
                        />
                      </div>

                      {/* Requisitos de Adopción */}
                      <div>
                        <textarea
                          name="requisitoAdopcion"
                          value={editPet.requisitoAdopcion}
                          onChange={handleEditChange}
                          rows="4"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 resize-none"
                          placeholder="Requisitos para la adopción..."
                        />
                      </div>

                      {/* Notas Adicionales */}
                      <div>
                        <textarea
                          name="notas"
                          value={editPet.notas}
                          onChange={handleEditChange}
                          rows="4"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-lg shadow-black/20 resize-none"
                          placeholder="Notas adicionales importantes..."
                        />
                      </div>
                    </div>

                    {/* Indicador de campos requeridos */}
                    <div className="mt-6 flex justify-center">
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        <span className="text-red-500">*</span>
                        <span>Campos obligatorios</span>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Footer del Modal */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseEditModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      onClick={handleUpdatePet}
                      disabled={editLoading || uploadingPhotos}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors flex items-center"
                    >
                      {(editLoading || uploadingPhotos) ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {uploadingPhotos ? 'Subiendo fotos...' : 'Actualizando...'}
                        </>
                      ) : (
                        'Actualizar Mascota'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListPet;