# 🚀 Inicio Rápido - Módulo de Tickets

## ✅ Archivos Creados

```
src/
  ├── services/
  │   └── ticket.service.js          ✅ NUEVO
  ├── pages/
  │   └── Tickets.jsx                ✅ NUEVO
  ├── components/
  │   ├── TicketModal.jsx            ✅ NUEVO
  │   └── TicketDetalleModal.jsx     ✅ NUEVO
  ├── config/
  │   └── api.config.js              ✏️ MODIFICADO (endpoints agregados)
  └── App.jsx                         ✏️ MODIFICADO (ruta agregada)

documentation/
  ├── MODULO_TICKETS.md              ✅ NUEVO
  └── TICKETS_RESUMEN.md             ✅ NUEVO
```

## 🏃 Cómo Probar el Módulo

### 1. Iniciar el Servidor de Desarrollo
```powershell
# En la terminal de PowerShell
cd c:\Users\cruza\OneDrive\Escritorio\AdoPets\FrontendAdoPets
npm run dev
```

### 2. Acceder al Módulo
```
http://localhost:5173/tickets
```

### 3. Navegación desde la UI
```
1. Iniciar sesión
2. Desde el Dashboard, click en "Tickets" en el sidebar
3. O navegar directamente a /tickets
```

## 🧪 Datos de Prueba

### Para Crear un Ticket (Ejemplo)

```javascript
// Información Básica
Cliente ID:      "12345678-1234-1234-1234-123456789012"
Veterinario ID:  "87654321-4321-4321-4321-210987654321"
Cita ID:         "11111111-1111-1111-1111-111111111111"
Mascota ID:      "22222222-2222-2222-2222-222222222222" (opcional)

// Procedimiento
Nombre:          "Consulta General"
Descripción:     "Revisión de rutina y vacunación"
Fecha:           2025-12-03T10:00

// Costos
Costo Procedimiento: 500.00
Costo Insumos:       150.00
Costo Adicional:     50.00
Descuento:          0.00

// Detalle 1
Descripción:    "Consulta veterinaria"
Cantidad:       1
Unidad:         "sesión"
Precio:         500.00
Tipo:           Consulta (4)

// Detalle 2
Descripción:    "Vacuna triple felina"
Cantidad:       1
Unidad:         "dosis"
Precio:         350.00
Tipo:           Medicamento (3)

// Información Médica (opcional)
Diagnóstico:         "Animal en buen estado de salud general"
Tratamiento:         "Vacunación de rutina completada"
Medicación:          "Vacuna triple felina - próxima dosis en 30 días"
Observaciones:       "Cliente solicita recordatorio para siguiente cita"
```

## 🔍 Funcionalidades a Probar

### ✅ Checklist de Pruebas

- [ ] **Crear Ticket**
  - [ ] Con todos los campos
  - [ ] Con campos mínimos requeridos
  - [ ] Agregar múltiples detalles
  - [ ] Validar cálculo de totales

- [ ] **Listar Tickets**
  - [ ] Ver tabla de tickets
  - [ ] Ver estados con colores
  - [ ] Ver totales formateados

- [ ] **Buscar**
  - [ ] Por número de ticket
  - [ ] Por nombre de cliente
  - [ ] Por nombre de mascota

- [ ] **Filtrar**
  - [ ] Todos los estados
  - [ ] Solo Generados
  - [ ] Solo Entregados
  - [ ] Solo Cancelados

- [ ] **Ver Detalles**
  - [ ] Abrir modal de detalles
  - [ ] Ver información completa
  - [ ] Ver desglose de costos

- [ ] **Descargar PDF**
  - [ ] Desde la tabla
  - [ ] Desde el modal de detalles
  - [ ] Verificar descarga

- [ ] **Marcar como Entregado**
  - [ ] Cambiar estado a entregado
  - [ ] Verificar confirmación
  - [ ] Ver cambio en la tabla

## 🐛 Si Hay Errores

### Error: "Cannot find module"
```powershell
# Reinstalar dependencias
npm install
```

### Error: "Failed to fetch"
```
1. Verificar que el backend esté corriendo
2. Verificar URL del backend en src/config/api.config.js
3. Verificar que los endpoints existan en el backend
```

### Error: "Token inválido"
```
1. Cerrar sesión
2. Iniciar sesión nuevamente
3. Verificar que el token se esté enviando en las peticiones
```

### Error al Crear Ticket
```
1. Verificar que los GUIDs sean válidos (formato UUID)
2. Verificar que existan en la base de datos
3. Revisar consola del navegador (F12)
4. Revisar logs del backend
```

## 📚 Documentación Completa

Para información detallada, consultar:

- **MODULO_TICKETS.md** - Documentación completa del módulo
- **TICKETS_RESUMEN.md** - Resumen de implementación
- **Backend Docs** - Documentación de la API (si está disponible)

## 🎨 Personalización

### Cambiar Colores
```javascript
// src/pages/Tickets.jsx
// Buscar clases de Tailwind y modificar:

from-purple-600 to-pink-600  // Gradiente principal
bg-purple-50                  // Fondos
text-purple-600               // Textos de acento
```

### Agregar Campos
```javascript
// 1. Modificar formData en src/components/TicketModal.jsx
// 2. Agregar input en el formulario
// 3. Actualizar handleChange
// 4. Verificar que el backend acepte el nuevo campo
```

## 🔐 Permisos

### Por Rol

**Cliente**
- ✅ Ver sus tickets
- ❌ Crear tickets
- ❌ Marcar como entregado

**Veterinario / Admin / Recepcionista**
- ✅ Ver todos los tickets
- ✅ Crear tickets
- ✅ Marcar como entregado
- ✅ Descargar PDFs

Para modificar permisos, editar:
```javascript
// src/pages/Tickets.jsx
const isCliente = user?.roles?.includes('Cliente');
```

## 📞 Ayuda

Si encuentras problemas:

1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend
3. Verifica la documentación en `/documentation`
4. Verifica que todos los servicios estén corriendo

## 🎉 ¡Listo!

El módulo está completamente implementado y listo para usar. 

**Siguiente paso**: Iniciar el servidor de desarrollo y probar las funcionalidades.

```powershell
npm run dev
```

Luego navegar a: `http://localhost:5173/tickets`
