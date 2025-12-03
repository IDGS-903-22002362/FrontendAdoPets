# 📋 Endpoint: Adoptantes con sus Mascotas

## 📝 Descripción

Estos endpoints permiten obtener una lista completa de adoptantes y **TODAS sus mascotas asociadas**, incluyendo:

- ✅ **Mascotas adoptadas del refugio** (a través de solicitudes de adopción aprobadas)
- ✅ **Mascotas registradas directamente** por el usuario

---

## 🔐 Autenticación

Ambos endpoints requieren:

- Token JWT válido
- Rol: **Staff** (Veterinario, Administrador, etc.)

```http
Authorization: Bearer {tu-token-jwt}
```

---

## 📍 Endpoints Disponibles

### 1. Obtener Lista Completa de Adoptantes con sus Mascotas

```http
GET /api/v1/usuarios/adoptantes/mascotas
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Se encontraron 15 adoptantes",
  "data": [
    {
      "usuarioId": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Juan",
      "apellidoPaterno": "Pérez",
      "apellidoMaterno": "García",
      "nombreCompleto": "Juan Pérez García",
      "email": "juan.perez@gmail.com",
      "telefono": "5512345678",
      "ultimoAccesoAt": "2024-01-20T10:30:00Z",
      "createdAt": "2024-01-15T14:30:00Z",
      "totalMascotas": 3,
      "mascotasAdoptadas": 1,
      "mascotasRegistradas": 2,
      "mascotas": [
        {
          "mascotaId": "abc123-...",
          "nombre": "Luna",
          "especie": "Perro",
          "raza": "Golden Retriever",
          "sexo": 2,
          "sexoNombre": "Hembra",
          "fechaNacimiento": "2020-03-15T00:00:00Z",
          "edadEnAnios": 4,
          "personalidad": "Juguetona y cariñosa",
          "estadoSalud": "Excelente, todas las vacunas al día",
          "estatus": 5,
          "estatusNombre": "Adoptada",
          "tipo": 1,
          "origenMascota": "Adoptada del Refugio",
          "fechaAdquisicion": "2024-01-10T00:00:00Z",
          "fechaSolicitudAdopcion": "2024-01-08T00:00:00Z",
          "fechaAprobacionAdopcion": "2024-01-10T00:00:00Z",
          "fotos": [
            {
              "id": "foto-guid-1",
              "storageKey": "https://api.adopets.com/uploads/mascotas/abc123/foto1.jpg",
              "mimeType": "image/jpeg",
              "orden": 1,
              "esPrincipal": true
            }
          ]
        },
        {
          "mascotaId": "def456-...",
          "nombre": "Max",
          "especie": "Perro",
          "raza": "Labrador",
          "sexo": 1,
          "sexoNombre": "Macho",
          "fechaNacimiento": "2021-05-20T00:00:00Z",
          "edadEnAnios": 2,
          "personalidad": "Muy activo, le encanta jugar",
          "estadoSalud": "Saludable",
          "estatus": 1,
          "estatusNombre": "DisponibleAdopcion",
          "tipo": 2,
          "origenMascota": "Registrada por Usuario",
          "fechaAdquisicion": "2024-01-15T14:35:00Z",
          "fechaSolicitudAdopcion": null,
          "fechaAprobacionAdopcion": null,
          "fotos": [
            {
              "id": "foto-guid-2",
              "storageKey": "https://api.adopets.com/uploads/mascotas-usuario/def456/foto1.jpg",
              "mimeType": "image/jpeg",
              "orden": 1,
              "esPrincipal": true
            }
          ]
        }
      ]
    },
    {
      "usuarioId": "789xyz-...",
      "nombre": "María",
      "apellidoPaterno": "López",
      "apellidoMaterno": "Martínez",
      "nombreCompleto": "María López Martínez",
      "email": "maria.lopez@gmail.com",
      "telefono": "5598765432",
      "ultimoAccesoAt": "2024-01-19T15:45:00Z",
      "createdAt": "2024-01-12T09:20:00Z",
      "totalMascotas": 2,
      "mascotasAdoptadas": 2,
      "mascotasRegistradas": 0,
      "mascotas": [...]
    }
  ]
}
```

#### Uso en JavaScript/TypeScript

```typescript
async function getAdoptantesConMascotas() {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
      "https://api.adopets.com/api/v1/usuarios/adoptantes/mascotas",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Error al obtener adoptantes");

    const data = await response.json();

    console.log(`Se encontraron ${data.data.length} adoptantes`);

    // Mostrar estadísticas
    data.data.forEach((adoptante) => {
      console.log(`${adoptante.nombreCompleto}:`);
      console.log(`  - Total: ${adoptante.totalMascotas} mascotas`);
      console.log(`  - Adoptadas: ${adoptante.mascotasAdoptadas}`);
      console.log(`  - Registradas: ${adoptante.mascotasRegistradas}`);
    });

    return data.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
```

---

### 2. Obtener un Adoptante Específico con sus Mascotas

```http
GET /api/v1/usuarios/adoptantes/{usuarioId}/mascotas
```

#### Parámetros

| Parámetro | Tipo | Ubicación | Requerido | Descripción              |
| --------- | ---- | --------- | --------- | ------------------------ |
| usuarioId | GUID | URL Path  | Sí        | ID del usuario adoptante |

#### Ejemplo de Request

```http
GET /api/v1/usuarios/adoptantes/123e4567-e89b-12d3-a456-426614174000/mascotas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Adoptante encontrado con 3 mascotas",
  "data": {
    "usuarioId": "123e4567-e89b-12d3-a456-426614174000",
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "nombreCompleto": "Juan Pérez García",
    "email": "juan.perez@gmail.com",
    "telefono": "5512345678",
    "ultimoAccesoAt": "2024-01-20T10:30:00Z",
    "createdAt": "2024-01-15T14:30:00Z",
    "totalMascotas": 3,
    "mascotasAdoptadas": 1,
    "mascotasRegistradas": 2,
    "mascotas": [
      {
        "mascotaId": "abc123-...",
        "nombre": "Luna",
        "especie": "Perro",
        "raza": "Golden Retriever",
        "sexo": 2,
        "sexoNombre": "Hembra",
        "fechaNacimiento": "2020-03-15T00:00:00Z",
        "edadEnAnios": 4,
        "personalidad": "Juguetona y cariñosa",
        "estadoSalud": "Excelente, todas las vacunas al día",
        "estatus": 5,
        "estatusNombre": "Adoptada",
        "tipo": 1,
        "origenMascota": "Adoptada del Refugio",
        "fechaAdquisicion": "2024-01-10T00:00:00Z",
        "fechaSolicitudAdopcion": "2024-01-08T00:00:00Z",
        "fechaAprobacionAdopcion": "2024-01-10T00:00:00Z",
        "fotos": [...]
      },
      {
        "mascotaId": "def456-...",
        "nombre": "Max",
        "especie": "Perro",
        "raza": "Labrador",
        "sexo": 1,
        "sexoNombre": "Macho",
        "fechaNacimiento": "2021-05-20T00:00:00Z",
        "edadEnAnios": 2,
        "tipo": 2,
        "origenMascota": "Registrada por Usuario",
        "fotos": [...]
      },
      {
        "mascotaId": "ghi789-...",
        "nombre": "Michi",
        "especie": "Gato",
        "raza": "Persa",
        "sexo": 2,
        "sexoNombre": "Hembra",
        "tipo": 2,
        "origenMascota": "Registrada por Usuario",
        "fotos": [...]
      }
    ]
  }
}
```

#### Respuesta de Error (404 Not Found)

```json
{
  "success": false,
  "message": "Adoptante no encontrado",
  "errors": "No se encontró adoptante con ID 123e4567-e89b-12d3-a456-426614174000"
}
```

#### Uso en JavaScript/TypeScript

```typescript
async function getAdoptanteConMascotas(usuarioId: string) {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
      `https://api.adopets.com/api/v1/usuarios/adoptantes/${usuarioId}/mascotas`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Adoptante no encontrado");
      }
      throw new Error("Error al obtener datos del adoptante");
    }

    const data = await response.json();
    const adoptante = data.data;

    console.log(`${adoptante.nombreCompleto} tiene:`);
    console.log(
      `  - ${adoptante.mascotasAdoptadas} mascotas adoptadas del refugio`
    );
    console.log(
      `  - ${adoptante.mascotasRegistradas} mascotas registradas por él`
    );
    console.log(`  - Total: ${adoptante.totalMascotas} mascotas`);

    return adoptante;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
```

---

## 📊 Estructura de Datos

### AdoptanteConMascotasDto

| Campo                   | Tipo                        | Descripción                                     |
| ----------------------- | --------------------------- | ----------------------------------------------- |
| usuarioId               | GUID                        | ID único del usuario adoptante                  |
| nombre                  | string                      | Nombre del adoptante                            |
| apellidoPaterno         | string                      | Apellido paterno                                |
| apellidoMaterno         | string                      | Apellido materno                                |
| nombreCompleto          | string                      | Nombre completo concatenado                     |
| email                   | string                      | Correo electrónico                              |
| telefono                | string?                     | Teléfono (opcional)                             |
| ultimoAccesoAt          | DateTime?                   | Última vez que accedió al sistema               |
| createdAt               | DateTime                    | Fecha de registro en el sistema                 |
| **totalMascotas**       | int                         | Total de mascotas (adoptadas + registradas)     |
| **mascotasAdoptadas**   | int                         | Cantidad de mascotas adoptadas del refugio      |
| **mascotasRegistradas** | int                         | Cantidad de mascotas registradas por el usuario |
| mascotas                | List\<MascotaAdoptanteDto\> | Lista de todas las mascotas                     |

### MascotaAdoptanteDto

| Campo                   | Tipo                      | Descripción                                           |
| ----------------------- | ------------------------- | ----------------------------------------------------- |
| mascotaId               | GUID                      | ID único de la mascota                                |
| nombre                  | string                    | Nombre de la mascota                                  |
| especie                 | string                    | Especie (Perro, Gato, etc.)                           |
| raza                    | string?                   | Raza (opcional)                                       |
| sexo                    | int                       | 1=Macho, 2=Hembra                                     |
| sexoNombre              | string                    | "Macho" o "Hembra"                                    |
| fechaNacimiento         | DateTime?                 | Fecha de nacimiento                                   |
| edadEnAnios             | int?                      | Edad calculada en años                                |
| personalidad            | string?                   | Descripción de la personalidad                        |
| estadoSalud             | string?                   | Estado de salud actual                                |
| estatus                 | int                       | Estado de la mascota (1-6)                            |
| estatusNombre           | string                    | Nombre del estado                                     |
| **tipo**                | int                       | **1=Del Refugio, 2=De Usuario**                       |
| **origenMascota**       | string                    | **"Adoptada del Refugio" o "Registrada por Usuario"** |
| **fechaAdquisicion**    | DateTime                  | Fecha en que se adoptó o registró                     |
| fechaSolicitudAdopcion  | DateTime?                 | Fecha de solicitud (solo adoptadas)                   |
| fechaAprobacionAdopcion | DateTime?                 | Fecha de aprobación (solo adoptadas)                  |
| fotos                   | List\<AddMascotaFotoDto\> | Fotos de la mascota                                   |

---

## 🎯 Casos de Uso

### 1. Dashboard Administrativo

Mostrar estadísticas generales de adoptantes:

```typescript
async function mostrarEstadisticasAdoptantes() {
  const adoptantes = await getAdoptantesConMascotas();

  const stats = {
    totalAdoptantes: adoptantes.length,
    totalMascotasAdoptadas: adoptantes.reduce(
      (sum, a) => sum + a.mascotasAdoptadas,
      0
    ),
    totalMascotasRegistradas: adoptantes.reduce(
      (sum, a) => sum + a.mascotasRegistradas,
      0
    ),
    totalMascotas: adoptantes.reduce((sum, a) => sum + a.totalMascotas, 0),
    promedioMascotasPorAdoptante: (
      adoptantes.reduce((sum, a) => sum + a.totalMascotas, 0) /
      adoptantes.length
    ).toFixed(2),
  };

  console.log("Estadísticas de Adoptantes:", stats);
  return stats;
}
```

### 2. Perfil de Adoptante

Ver el perfil completo de un adoptante con su historial de mascotas:

```typescript
async function verPerfilAdoptante(usuarioId: string) {
  const adoptante = await getAdoptanteConMascotas(usuarioId);

  console.log(`\n=== Perfil de ${adoptante.nombreCompleto} ===`);
  console.log(`Email: ${adoptante.email}`);
  console.log(`Teléfono: ${adoptante.telefono || "No registrado"}`);
  console.log(
    `Miembro desde: ${new Date(adoptante.createdAt).toLocaleDateString()}`
  );

  console.log(`\nMascotas (${adoptante.totalMascotas} total):`);

  // Agrupar por origen
  const adoptadas = adoptante.mascotas.filter((m) => m.tipo === 1);
  const registradas = adoptante.mascotas.filter((m) => m.tipo === 2);

  console.log(`\n🏠 Adoptadas del Refugio (${adoptadas.length}):`);
  adoptadas.forEach((m) => {
    console.log(`  - ${m.nombre} (${m.especie} ${m.raza})`);
    console.log(
      `    Adoptado: ${new Date(
        m.fechaAprobacionAdopcion!
      ).toLocaleDateString()}`
    );
  });

  console.log(`\n✍️ Registradas por el Usuario (${registradas.length}):`);
  registradas.forEach((m) => {
    console.log(`  - ${m.nombre} (${m.especie} ${m.raza})`);
    console.log(
      `    Registrado: ${new Date(m.fechaAdquisicion).toLocaleDateString()}`
    );
  });
}
```

### 3. Lista Filtrada de Adoptantes

Filtrar adoptantes por criterios específicos:

```typescript
async function filtrarAdoptantes(criterio: {
  minMascotas?: number;
  maxMascotas?: number;
  soloConAdoptadas?: boolean;
  soloConRegistradas?: boolean;
}) {
  const adoptantes = await getAdoptantesConMascotas();

  return adoptantes.filter((adoptante) => {
    if (
      criterio.minMascotas &&
      adoptante.totalMascotas < criterio.minMascotas
    ) {
      return false;
    }

    if (
      criterio.maxMascotas &&
      adoptante.totalMascotas > criterio.maxMascotas
    ) {
      return false;
    }

    if (criterio.soloConAdoptadas && adoptante.mascotasAdoptadas === 0) {
      return false;
    }

    if (criterio.soloConRegistradas && adoptante.mascotasRegistradas === 0) {
      return false;
    }

    return true;
  });
}

// Ejemplos de uso:
// Adoptantes con al menos 2 mascotas
const adoptantesActivos = await filtrarAdoptantes({ minMascotas: 2 });

// Adoptantes que han adoptado del refugio
const adoptantesRefugio = await filtrarAdoptantes({ soloConAdoptadas: true });

// Adoptantes que solo tienen mascotas registradas
const adoptantesConPropias = await filtrarAdoptantes({
  soloConRegistradas: true,
  minMascotas: 1,
});
```

---

## 🔍 Diferencias Clave entre Mascotas

### Mascota Adoptada (tipo = 1)

- ✅ Proviene del refugio
- ✅ Tiene `fechaSolicitudAdopcion`
- ✅ Tiene `fechaAprobacionAdopcion`
- ✅ `origenMascota` = "Adoptada del Refugio"
- ✅ `estatus` = 5 (Adoptada)

### Mascota Registrada (tipo = 2)

- ✅ Registrada directamente por el usuario
- ✅ NO tiene `fechaSolicitudAdopcion`
- ✅ NO tiene `fechaAprobacionAdopcion`
- ✅ `origenMascota` = "Registrada por Usuario"
- ✅ `estatus` puede variar según el estado de salud

---

## ⚠️ Notas Importantes

1. **Permisos**: Solo usuarios con rol "Staff" pueden acceder a estos endpoints
2. **URLs de Fotos**: Las URLs de las fotos se convierten automáticamente a URLs completas
3. **Ordenamiento**: Las mascotas se ordenan por fecha de adquisición (más recientes primero)
4. **Mascotas Eliminadas**: No se incluyen mascotas con soft delete (`DeletedAt != null`)
5. **Solo Adoptantes**: Solo retorna usuarios con rol "Adoptante"

---

## 🚨 Códigos de Error

| Código | Descripción             | Solución                                                    |
| ------ | ----------------------- | ----------------------------------------------------------- |
| 401    | No autenticado          | Proporcionar token JWT válido                               |
| 403    | Permisos insuficientes  | El usuario debe tener rol "Staff"                           |
| 404    | Adoptante no encontrado | Verificar que el usuarioId sea correcto y que sea adoptante |
| 500    | Error del servidor      | Revisar logs del servidor                                   |

---

## 📞 Soporte

Para más información o soporte técnico, contactar al equipo de desarrollo.
// ==========================================
// SERVICIO DE VETERINARIOS (SIN CITAS)
// ==========================================

interface Veterinario {
id: string;
nombre: string;
apellidoPaterno: string;
apellidoMaterno: string;
nombreCompleto: string;
email: string;
telefono?: string;
puesto: string;
especialidades: Especialidad[];
estatus: number;
estatusNombre: string;
createdAt: string;
}

interface Especialidad {
id: string;
nombre: string;
descripcion?: string;
}

class VeterinarioService {
private apiUrl = 'https://api.adopets.com/api/v1';
private token: string;

constructor(token: string) {
this.token = token;
}

/\*\*

- Obtiene lista de todos los veterinarios
  \*/
  async getVeterinarios(): Promise<Veterinario[]> {
  try {
  // Obtener todos los empleados
  const response = await fetch(`${this.apiUrl}/empleados`, {
  method: 'GET',
  headers: {
  'Authorization': `Bearer ${this.token}`,
  'Content-Type': 'application/json'
  }
  });

      if (!response.ok) {
        throw new Error('Error al obtener empleados');
      }

      const data = await response.json();
      const empleados = data.data || data;

      // Filtrar solo veterinarios
      const veterinarios = empleados
        .filter((emp: any) =>
          // Filtrar por especialidades
          emp.especialidades?.some((esp: any) =>
            esp.nombre?.toLowerCase().includes('veterinari') ||
            esp.descripcion?.toLowerCase().includes('veterinari')
          ) ||
          // O por puesto
          emp.puesto?.toLowerCase().includes('veterinari')
        )
        .map((emp: any) => ({
          id: emp.id,
          nombre: emp.nombre,
          apellidoPaterno: emp.apellidoPaterno,
          apellidoMaterno: emp.apellidoMaterno,
          nombreCompleto: `${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`.trim(),
          email: emp.email,
          telefono: emp.telefono,
          puesto: emp.puesto,
          especialidades: emp.especialidades?.map((e: any) => ({
            id: e.id,
            nombre: e.nombre,
            descripcion: e.descripcion
          })) || [],
          estatus: emp.estatus,
          estatusNombre: this.getEstatusNombre(emp.estatus),
          createdAt: emp.createdAt
        }));

      return veterinarios;

  } catch (error) {
  console.error('Error al obtener veterinarios:', error);
  throw error;
  }

}

/\*\*

- Obtiene un veterinario específico por ID
  \*/
  async getVeterinarioById(veterinarioId: string): Promise<Veterinario | null> {
  try {
  const response = await fetch(
  `${this.apiUrl}/empleados/${veterinarioId}`,
  {
  method: 'GET',
  headers: {
  'Authorization': `Bearer ${this.token}`,
  'Content-Type': 'application/json'
  }
  }
  );

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Error al obtener veterinario');
      }

      const data = await response.json();
      const emp = data.data || data;

      return {
        id: emp.id,
        nombre: emp.nombre,
        apellidoPaterno: emp.apellidoPaterno,
        apellidoMaterno: emp.apellidoMaterno,
        nombreCompleto: `${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`.trim(),
        email: emp.email,
        telefono: emp.telefono,
        puesto: emp.puesto,
        especialidades: emp.especialidades?.map((e: any) => ({
          id: e.id,
          nombre: e.nombre,
          descripcion: e.descripcion
        })) || [],
        estatus: emp.estatus,
        estatusNombre: this.getEstatusNombre(emp.estatus),
        createdAt: emp.createdAt
      };

  } catch (error) {
  console.error('Error al obtener veterinario:', error);
  throw error;
  }

}

/\*\*

- Obtiene veterinarios activos solamente
  \*/
  async getVeterinariosActivos(): Promise<Veterinario[]> {
  const veterinarios = await this.getVeterinarios();
  return veterinarios.filter(vet => vet.estatus === 1);
  }

private getEstatusNombre(estatus: number): string {
const estados: { [key: number]: string } = {
1: 'Activo',
2: 'Inactivo',
3: 'Bloqueado'
};
return estados[estatus] || 'Desconocido';
}
}

// ==========================================
// EJEMPLOS DE USO
// ==========================================

// 1. Obtener todos los veterinarios
async function obtenerTodosLosVeterinarios() {
const token = localStorage.getItem('authToken');
const service = new VeterinarioService(token!);

const veterinarios = await service.getVeterinarios();

console.log(`Total de veterinarios: ${veterinarios.length}`);

veterinarios.forEach(vet => {
console.log(`\n${vet.nombreCompleto}`);
console.log(`  Email: ${vet.email}`);
console.log(`  Teléfono: ${vet.telefono || 'No registrado'}`);
console.log(`  Estado: ${vet.estatusNombre}`);
console.log(`  Especialidades: ${vet.especialidades.map(e => e.nombre).join(', ')}`);
});

return veterinarios;
}

// 2. Obtener solo veterinarios activos
async function obtenerVeterinariosActivos() {
const token = localStorage.getItem('authToken');
const service = new VeterinarioService(token!);

const veterinarios = await service.getVeterinariosActivos();

console.log(`Veterinarios activos: ${veterinarios.length}`);
return veterinarios;
}

// 3. Obtener un veterinario específico
async function obtenerVeterinarioPorId(veterinarioId: string) {
const token = localStorage.getItem('authToken');
const service = new VeterinarioService(token!);

const veterinario = await service.getVeterinarioById(veterinarioId);

if (!veterinario) {
console.log('Veterinario no encontrado');
return null;
}

console.log(`\n=== ${veterinario.nombreCompleto} ===`);
console.log(`Email: ${veterinario.email}`);
console.log(`Puesto: ${veterinario.puesto}`);
console.log(`Especialidades:`);
veterinario.especialidades.forEach(esp => {
console.log(`  - ${esp.nombre}: ${esp.descripcion || 'Sin descripción'}`);
});

return veterinario;
}

// 4. Buscar veterinarios por especialidad
async function buscarVeterinariosPorEspecialidad(especialidadBuscada: string) {
const token = localStorage.getItem('authToken');
const service = new VeterinarioService(token!);

const veterinarios = await service.getVeterinarios();

const veterinariosFiltrados = veterinarios.filter(vet =>
vet.especialidades.some(esp =>
esp.nombre.toLowerCase().includes(especialidadBuscada.toLowerCase())
)
);

console.log(`Veterinarios con especialidad "${especialidadBuscada}": ${veterinariosFiltrados.length}`);
return veterinariosFiltrados;
}
import React, { useEffect, useState } from 'react';

interface Veterinario {
id: string;
nombreCompleto: string;
email: string;
telefono?: string;
puesto: string;
especialidades: { nombre: string }[];
estatusNombre: string;
}

const ListaVeterinarios: React.FC = () => {
const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
cargarVeterinarios();
}, []);

const cargarVeterinarios = async () => {
try {
setLoading(true);
const token = localStorage.getItem('authToken');

      const response = await fetch('https://api.adopets.com/api/v1/empleados', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al cargar datos');

      const data = await response.json();
      const empleados = data.data || data;

      // Filtrar solo veterinarios
      const vets = empleados
        .filter((emp: any) =>
          emp.especialidades?.some((esp: any) =>
            esp.nombre?.toLowerCase().includes('veterinari')
          ) || emp.puesto?.toLowerCase().includes('veterinari')
        )
        .map((emp: any) => ({
          id: emp.id,
          nombreCompleto: `${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`.trim(),
          email: emp.email,
          telefono: emp.telefono,
          puesto: emp.puesto,
          especialidades: emp.especialidades || [],
          estatusNombre: emp.estatus === 1 ? 'Activo' : emp.estatus === 2 ? 'Inactivo' : 'Bloqueado'
        }));

      setVeterinarios(vets);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }

};

if (loading) return <div className="loading">Cargando veterinarios...</div>;
if (error) return <div className="error">Error: {error}</div>;

return (

<div className="veterinarios-container">
<h1>Lista de Veterinarios ({veterinarios.length})</h1>

      <div className="veterinarios-grid">
        {veterinarios.map(vet => (
          <div key={vet.id} className="veterinario-card">
            <div className="vet-header">
              <h2>{vet.nombreCompleto}</h2>
              <span className={`badge badge-${vet.estatusNombre.toLowerCase()}`}>
                {vet.estatusNombre}
              </span>
            </div>

            <div className="vet-info">
              <p><strong>Email:</strong> {vet.email}</p>
              <p><strong>Teléfono:</strong> {vet.telefono || 'No registrado'}</p>
              <p><strong>Puesto:</strong> {vet.puesto}</p>
            </div>

            {vet.especialidades.length > 0 && (
              <div className="vet-especialidades">
                <h3>Especialidades:</h3>
                <ul>
                  {vet.especialidades.map((esp, index) => (
                    <li key={index}>{esp.nombre}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

);
};

export default ListaVeterinarios;

GET /api/v1/salas
/\*\*

- Obtiene todas las salas del sistema
  \*/
  async function getAllSalas() {
  const token = localStorage.getItem('authToken');

const response = await fetch('https://api.adopets.com/api/v1/salas', {
method: 'GET',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json'
}
});

if (!response.ok) {
throw new Error('Error al obtener salas');
}

const data = await response.json();

// Retorna el array de salas
return data.data || data;
}

// Uso:
const salas = await getAllSalas();
console.log(salas);
// Obtener y mostrar todas las salas
async function mostrarSalas() {
try {
const token = localStorage.getItem('authToken');

    const response = await fetch('https://api.adopets.com/api/v1/salas', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const salas = data.data;

    console.log(`Total de salas: ${salas.length}`);

    salas.forEach(sala => {
      console.log(`${sala.nombre} - Capacidad: ${sala.capacidad}`);
    });

    return salas;

} catch (error) {
console.error('Error:', error);
}
}

// Llamar la función
mostrarSalas();
{
"success": true,
"message": "Salas obtenidas exitosamente",
"data": [
{
"id": "guid-sala-1",
"nombre": "Sala 1",
"capacidad": 5,
"tipo": "Consulta",
"disponible": true
},
{
"id": "guid-sala-2",
"nombre": "Quirófano",
"capacidad": 8,
"tipo": "Cirugía",
"disponible": true
}
]
}
