# Tutorial: Conectar Frontend con Backend

Este tutorial explica cómo conectar el frontend (React + Vite) con el backend de forma simple y efectiva.

## 📋 Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Crear un Nuevo Servicio](#crear-un-nuevo-servicio)
3. [Usar el Servicio en un Componente](#usar-el-servicio-en-un-componente)
4. [Manejo de Errores](#manejo-de-errores)
5. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Asegúrate de tener tu archivo `.env` configurado con la URL del backend:

```env
VITE_API_URL=http://localhost:3000/api
```

**⚠️ Importante:** Las variables de entorno en Vite deben comenzar con `VITE_`

### 2. Reiniciar el Servidor

Cada vez que modifiques el archivo `.env`, debes reiniciar el servidor de desarrollo:

```bash
# Detener el servidor (Ctrl + C)
# Volver a iniciar
npm run dev
```

---

## 🛠️ Crear un Nuevo Servicio

### Paso 1: Crea un archivo en `src/services/`

Por ejemplo, si quieres manejar **mascotas**, crea `mascota.service.js`:

```javascript
// filepath: src/services/mascota.service.js
import apiClient from './api.service.js';

const mascotaService = {
  // Obtener todas las mascotas
  getAll: async () => {
    try {
      const response = await apiClient.get('/mascotas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener una mascota por ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/mascotas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear una nueva mascota
  create: async (mascotaData) => {
    try {
      const response = await apiClient.post('/mascotas', mascotaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar una mascota
  update: async (id, mascotaData) => {
    try {
      const response = await apiClient.put(`/mascotas/${id}`, mascotaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar una mascota
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/mascotas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default mascotaService;
```

### ¿Qué hace cada método?

- **`getAll()`**: Obtiene todas las mascotas (GET)
- **`getById(id)`**: Obtiene una mascota específica (GET)
- **`create(data)`**: Crea una nueva mascota (POST)
- **`update(id, data)`**: Actualiza una mascota existente (PUT)
- **`delete(id)`**: Elimina una mascota (DELETE)

---

## 🎯 Usar el Servicio en un Componente

### Ejemplo: Lista de Mascotas

```javascript
// filepath: src/pages/Mascotas.jsx
import { useState, useEffect } from 'react';
import mascotaService from '../services/mascota.service';

const Mascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar mascotas al montar el componente
  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    try {
      setLoading(true);
      const data = await mascotaService.getAll();
      setMascotas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las mascotas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>Lista de Mascotas</h1>
      <ul>
        {mascotas.map(mascota => (
          <li key={mascota.id}>{mascota.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Mascotas;
```

### Ejemplo: Crear una Mascota

```javascript
const CrearMascota = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    edad: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const nuevaMascota = await mascotaService.create(formData);
      console.log('Mascota creada:', nuevaMascota);
      alert('¡Mascota creada exitosamente!');
      // Limpiar formulario
      setFormData({ nombre: '', especie: '', edad: '' });
    } catch (error) {
      console.error('Error al crear mascota:', error);
      alert('Error al crear la mascota');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        required
      />
      <input
        type="text"
        name="especie"
        value={formData.especie}
        onChange={handleChange}
        placeholder="Especie"
        required
      />
      <input
        type="number"
        name="edad"
        value={formData.edad}
        onChange={handleChange}
        placeholder="Edad"
        required
      />
      <button type="submit">Crear Mascota</button>
    </form>
  );
};
```

---

## ⚠️ Manejo de Errores

### Errores Comunes y Soluciones

#### 1. **Error de CORS**
```
Access to fetch at 'http://localhost:3000/api/mascotas' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solución:** Configura CORS en el backend:

```javascript
// En tu servidor Express (backend)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend
  credentials: true
}));
```

#### 2. **Error 401 (No autorizado)**

Significa que necesitas estar autenticado. Asegúrate de:
- Estar logueado
- Que el token se esté enviando correctamente (ya configurado en `api.service.js`)

#### 3. **Error 404 (No encontrado)**

Verifica que:
- La URL del endpoint sea correcta
- El backend esté corriendo
- La variable `VITE_API_URL` apunte a la URL correcta

#### 4. **Error de Red**

```javascript
try {
  const data = await mascotaService.getAll();
} catch (error) {
  if (error.response) {
    // El servidor respondió con un error
    console.error('Error del servidor:', error.response.data);
    console.error('Código de estado:', error.response.status);
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta
    console.error('No hay respuesta del servidor');
  } else {
    // Algo pasó al configurar la petición
    console.error('Error:', error.message);
  }
}
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Búsqueda con Filtros

```javascript
const mascotaService = {
  // ... otros métodos ...
  
  buscar: async (filtros) => {
    try {
      // Construir query params: /mascotas?especie=perro&edad=5
      const params = new URLSearchParams(filtros);
      const response = await apiClient.get(`/mascotas?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Uso en componente
const resultados = await mascotaService.buscar({
  especie: 'perro',
  edad: 5
});
```

### Ejemplo 2: Subir Imágenes

```javascript
const mascotaService = {
  // ... otros métodos ...
  
  subirImagen: async (id, imagen) => {
    try {
      const formData = new FormData();
      formData.append('imagen', imagen);
      
      const response = await apiClient.post(
        `/mascotas/${id}/imagen`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Uso en componente
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  await mascotaService.subirImagen(mascotaId, file);
};
```

### Ejemplo 3: Peticiones con Loading State

```javascript
const MascotaDetalle = ({ id }) => {
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(false);

  const eliminarMascota = async () => {
    if (!confirm('¿Estás seguro?')) return;
    
    setLoading(true);
    try {
      await mascotaService.delete(id);
      alert('Mascota eliminada');
      // Redirigir o actualizar lista
    } catch (error) {
      alert('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{mascota?.nombre}</h2>
      <button onClick={eliminarMascota} disabled={loading}>
        {loading ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  );
};
```

---

## 📚 Resumen Rápido

### Pasos para conectar front y back:

1. **Configurar `.env`** con la URL del backend
2. **Crear servicio** en `src/services/nombreServicio.service.js`
3. **Importar servicio** en tu componente
4. **Usar async/await** para las peticiones
5. **Manejar estados**: loading, error, datos
6. **Usar try/catch** para errores

### Estructura básica:

```javascript
// 1. Importar
import miServicio from '../services/miServicio.service';

// 2. En el componente
const [datos, setDatos] = useState([]);
const [loading, setLoading] = useState(false);

// 3. Hacer petición
const cargarDatos = async () => {
  setLoading(true);
  try {
    const resultado = await miServicio.getAll();
    setDatos(resultado);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

// 4. Llamar en useEffect o en un evento
useEffect(() => {
  cargarDatos();
}, []);
```

---

## 🔗 Recursos Adicionales

- **Axios Documentation**: https://axios-http.com/
- **React Hooks**: https://react.dev/reference/react
- **Vite Environment Variables**: https://vitejs.dev/guide/env-and-mode.html

---

## ❓ Preguntas Frecuentes

**P: ¿Debo crear un servicio para cada entidad?**  
R: Sí, es buena práctica. Un servicio por cada recurso del backend (usuarios, mascotas, productos, etc.)

**P: ¿Puedo hacer peticiones directamente sin servicios?**  
R: Técnicamente sí, pero los servicios mantienen el código organizado y reutilizable.

**P: ¿Qué pasa si el backend cambia de URL?**  
R: Solo cambias la variable `VITE_API_URL` en el archivo `.env` y listo.

**P: ¿Cómo pruebo si funciona?**  
R: Abre las DevTools (F12), ve a la pestaña Network, y observa las peticiones HTTP.

---

**¡Listo!** Ahora ya sabes cómo conectar el frontend con el backend. 🚀
