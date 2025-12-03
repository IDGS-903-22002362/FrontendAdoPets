# Módulo de Tickets - Frontend

## 📋 Descripción
El módulo de **Tickets** gestiona los comprobantes de procedimientos médicos y servicios realizados en la clínica veterinaria. Permite crear, visualizar y descargar tickets con información detallada de costos, procedimientos y datos médicos.

---

## 📂 Archivos Creados

### 1. **Servicio**
- `src/services/ticket.service.js` - Servicio para comunicación con el backend

### 2. **Páginas**
- `src/pages/Tickets.jsx` - Página principal con listado de tickets

### 3. **Componentes**
- `src/components/TicketModal.jsx` - Modal para crear/editar tickets
- `src/components/TicketDetalleModal.jsx` - Modal para ver detalles completos del ticket

### 4. **Configuración**
- `src/config/api.config.js` - Endpoints de tickets agregados

### 5. **Rutas**
- `src/App.jsx` - Ruta `/tickets` agregada
- `src/components/Sidebar.jsx` - Enlace en el menú lateral (ya existía)

---

## 🚀 Características Principales

### ✨ Funcionalidades
- ✅ Crear nuevos tickets con información detallada
- ✅ Ver listado de tickets con filtros
- ✅ Buscar por número, cliente o mascota
- ✅ Filtrar por estado (Generado, Entregado, Cancelado, Reimpreso)
- ✅ Ver detalles completos de un ticket
- ✅ Descargar PDF del ticket
- ✅ Marcar tickets como entregados
- ✅ Cálculo automático de totales (Subtotal + IVA - Descuento)

### 📊 Estados de Tickets
1. **Generado** (1) - Ticket creado, pendiente de entrega
2. **Entregado** (2) - Ticket entregado al cliente
3. **Cancelado** (3) - Ticket anulado
4. **Reimpreso** (4) - Ticket reimpreso

### 💰 Cálculos Automáticos
- **Subtotal**: Suma de Costo Procedimiento + Costo Insumos + Costo Adicional
- **IVA**: 16% sobre (Subtotal - Descuento)
- **Total**: Subtotal - Descuento + IVA

---

## 🛠️ Uso del Módulo

### Crear un Nuevo Ticket

1. Hacer clic en el botón **"Nuevo Ticket"**
2. Completar información básica:
   - Cliente ID (GUID)
   - Veterinario ID (GUID)
   - Cita ID (GUID)
   - Mascota ID (opcional)
3. Agregar información del procedimiento:
   - Nombre del procedimiento
   - Descripción
   - Fecha y hora
4. Ingresar costos:
   - Costo del procedimiento
   - Costo de insumos
   - Costos adicionales
   - Descuento (si aplica)
5. Agregar detalles del ticket:
   - Descripción
   - Cantidad
   - Unidad
   - Precio unitario
   - Tipo (Procedimiento, Insumo, Medicamento, Consulta, Otro)
6. Agregar información médica (opcional):
   - Diagnóstico
   - Tratamiento
   - Medicación prescrita
   - Observaciones
7. Hacer clic en **"Crear Ticket"**

### Ver Detalles de un Ticket

1. En la tabla de tickets, hacer clic en el ícono del ojo (👁️)
2. Se abrirá un modal con toda la información:
   - Datos del cliente, veterinario y mascota
   - Procedimiento realizado
   - Detalles itemizados
   - Resumen de costos
   - Información médica
   - Observaciones

### Descargar PDF

1. Hacer clic en el ícono de descarga (⬇️) en la tabla
2. O desde el modal de detalles, hacer clic en el botón de descarga
3. El PDF se descargará automáticamente

### Marcar como Entregado

1. Solo disponible para tickets en estado "Generado"
2. Hacer clic en el ícono de check (✓) en la tabla
3. Confirmar la acción
4. El ticket cambiará a estado "Entregado"

---

## 🔍 Filtros y Búsqueda

### Búsqueda
Busca por:
- Número de ticket
- Nombre del cliente
- Nombre de la mascota

### Filtros
- **Todos los estados**: Ver todos los tickets
- **Generado**: Solo tickets pendientes
- **Entregado**: Solo tickets entregados
- **Cancelado**: Solo tickets cancelados
- **Reimpreso**: Solo tickets reimpresos

---

## 🎨 Interfaz

### Colores y Diseño
- **Gradiente principal**: Purple (600) → Pink (600)
- **Estados**:
  - Generado: Amarillo
  - Entregado: Verde
  - Cancelado: Rojo
  - Reimpreso: Azul

### Iconos
- 🧾 Receipt - Tickets
- 👁️ Eye - Ver detalles
- ⬇️ Download - Descargar PDF
- ✓ CheckCircle - Marcar entregado
- 🔍 Search - Búsqueda
- 🔽 Filter - Filtros

---

## 🔗 Endpoints Utilizados

```javascript
ENDPOINTS.TICKETS = {
  BASE: '/Tickets',                                    // POST: Crear ticket
  BY_ID: (id) => `/Tickets/${id}`,                    // GET: Obtener por ID
  BY_NUMERO: (numero) => `/Tickets/numero/${numero}`, // GET: Obtener por número
  BY_CLIENTE: (id) => `/Tickets/cliente/${id}`,       // GET: Por cliente
  BY_CITA: (id) => `/Tickets/cita/${id}`,             // GET: Por cita
  ENTREGAR: (id) => `/Tickets/${id}/entregar`,        // PUT: Marcar entregado
  PDF: (id) => `/Tickets/${id}/pdf`                   // GET: Descargar PDF
}
```

---

## 📝 Estructura de Datos

### CreateTicketDto (Crear Ticket)
```javascript
{
  citaId: "guid",
  mascotaId: "guid" | null,
  clienteId: "guid",
  veterinarioId: "guid",
  fechaProcedimiento: "2024-01-15T10:30:00",
  nombreProcedimiento: "string",
  descripcionProcedimiento: "string" | null,
  costoProcedimiento: 0.00,
  costoInsumos: 0.00,
  costoAdicional: 0.00,
  descuento: 0.00,
  observaciones: "string" | null,
  diagnostico: "string" | null,
  tratamiento: "string" | null,
  medicacionPrescrita: "string" | null,
  detalles: [
    {
      descripcion: "string",
      cantidad: 0.00,
      unidad: "string" | null,
      precioUnitario: 0.00,
      itemInventarioId: "guid" | null,
      tipo: 1 // TipoDetalleTicket
    }
  ]
}
```

### TipoDetalleTicket (Enum)
```javascript
{
  Procedimiento: 1,
  Insumo: 2,
  Medicamento: 3,
  Consulta: 4,
  Otro: 5
}
```

---

## ⚠️ Consideraciones Importantes

### Permisos
- **Clientes**: Solo pueden ver sus propios tickets
- **Admin/Veterinarios/Recepcionistas**: Pueden ver todos los tickets y crear nuevos

### Validaciones
- **Campos requeridos**:
  - Cliente ID
  - Veterinario ID
  - Cita ID
  - Nombre del procedimiento
  - Fecha del procedimiento
  - Al menos 1 detalle en el ticket

- **Valores numéricos**:
  - Todos los costos deben ser ≥ 0
  - Las cantidades deben ser > 0

### TODO: Mejoras Futuras
1. **Selección de clientes**: Implementar selector con autocompletado en lugar de GUID manual
2. **Selección de veterinarios**: Dropdown con lista de veterinarios disponibles
3. **Selección de citas**: Buscar citas disponibles del cliente
4. **Catálogo de servicios**: Agregar precios predefinidos de procedimientos comunes
5. **Integración con inventario**: Vincular items del inventario en detalles
6. **Vista previa de PDF**: Mostrar preview antes de descargar
7. **Impresión térmica**: Implementar impresión directa para recepción
8. **Notificaciones**: Email/SMS al cliente cuando el ticket esté listo

---

## 🐛 Troubleshooting

### Error: "Ticket no encontrado"
- Verificar que el ID del ticket sea correcto
- Verificar permisos de usuario

### Error al crear ticket: "Datos inválidos"
- Verificar que todos los GUIDs sean válidos
- Asegurar que haya al menos 1 detalle
- Verificar formato de fecha

### PDF no se descarga
- Verificar que el backend tenga QuestPDF instalado
- Verificar permisos de escritura en el servidor
- Revisar logs del backend para errores

---

## 📚 Documentación Adicional

Para más información sobre el backend, consultar:
- `TICKETS_API_DOCUMENTATION.md` (Backend)
- DTOs: `CreateTicketDto`, `TicketDto`, `TicketDetalleDto`
- Entidades: `Ticket`, `TicketDetalle`
- Servicio: `ITicketService`, `TicketService`
- Controlador: `TicketsController`

---

## 👨‍💻 Desarrollador
**Módulo**: Tickets (Clínica)
**Fecha**: Diciembre 2025
**Versión**: 1.0.0

---

## 🎯 Próximos Pasos

1. Probar la creación de tickets con datos reales
2. Implementar mejoras de UX (selectores, autocompletado)
3. Integrar con módulo de pagos
4. Agregar reportes y estadísticas de tickets
5. Implementar sistema de reimpresión
6. Agregar validaciones avanzadas
