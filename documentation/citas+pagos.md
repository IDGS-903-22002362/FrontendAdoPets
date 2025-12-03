# 📋 Flujos de Citas y Pagos - Documentación de Endpoints

## 📑 Índice

1. [Flujo 1: Cita desde Solicitud Digital (App Móvil)](#flujo-1-cita-desde-solicitud-digital-app-móvil)
2. [Flujo 2: Cita Presencial (Walk-in)](#flujo-2-cita-presencial-walk-in)
3. [Endpoints de Pagos](#endpoints-de-pagos)
4. [Estados y Validaciones](#estados-y-validaciones)

---

## Flujo 1: Cita desde Solicitud Digital (App Móvil)

### 🎯 Descripción

El usuario crea una solicitud desde la app móvil, paga el 50% de anticipo por PayPal, el personal administrativo confirma la solicitud creando la cita oficial, y posteriormente se cobra el 50% restante el día de la cita.

### 📊 Diagrama de Flujo

```
Usuario Móvil → Solicitud → Pago 50% → Admin Confirma → Cita Creada → Día de Cita → Pago 50% → Completar
```

### 🔗 Endpoints del Flujo

#### **1.1. Usuario: Crear Solicitud de Cita**

```http
POST /api/v1/solicitudescitasdigitales
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "mascotaId": "guid",
  "nombreMascota": "Max",
  "especieMascota": "Perro",
  "razaMascota": "Labrador",
  "servicioId": "guid",
  "descripcionServicio": "Esterilización",
  "motivoConsulta": "Esterilización programada",
  "fechaHoraSolicitada": "2024-12-25T10:00:00",
  "duracionEstimadaMin": 120,
  "veterinarioPreferidoId": "guid (opcional)",
  "salaPreferidaId": "guid (opcional)",
  "costoEstimado": 1218.0
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Solicitud creada exitosamente",
  "data": {
    "id": "solicitud-guid",
    "numeroSolicitud": "SOL-20241225-0001",
    "estado": 3,
    "estadoNombre": "PendientePago",
    "costoEstimado": 1218.0,
    "montoAnticipo": 609.0,
    "fechaSolicitud": "2024-12-25T08:00:00Z",
    "pagoAnticipoId": null,
    "citaId": null
  }
}
```

**Importante:**

- El `solicitanteId` se obtiene automáticamente del token JWT
- El sistema calcula automáticamente el `montoAnticipo` (50% del `costoEstimado`)
- Estado inicial: `PendientePago` (3)

---

#### **1.2. Usuario: Pagar Anticipo (50%) con PayPal**

**Paso A: Crear Orden de PayPal**

```http
POST /api/v1/pagos/paypal/create-order
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "solicitudCitaId": "solicitud-guid",
  "usuarioId": "usuario-guid",
  "monto": 609.0,
  "conceptoPago": "Anticipo 50% - Esterilización para Max",
  "esAnticipo": true,
  "montoTotal": 1218.0,
  "returnUrl": "adopets://payment/success",
  "cancelUrl": "adopets://payment/cancel"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Orden de PayPal creada exitosamente",
  "data": {
    "orderId": "8VF91827TN047864P",
    "approvalUrl": "https://www.paypal.com/checkoutnow?token=EC-8VF91827TN047864P",
    "status": "CREATED"
  }
}
```

**Paso B: Capturar Pago (después de que usuario aprueba en PayPal)**

```http
POST /api/v1/pagos/paypal/capture
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "orderId": "8VF91827TN047864P"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Pago capturado exitosamente",
  "data": {
    "id": "pago-guid",
    "numeroPago": "PAGO-20241225-0001",
    "monto": 609.0,
    "estado": 2,
    "estadoNombre": "Completado",
    "esAnticipo": true,
    "montoTotal": 1218.0,
    "montoRestante": 609.0,
    "payPalOrderId": "8VF91827TN047864P",
    "payPalCaptureId": "3C679366E0199954L"
  }
}
```

**Importante:**

- El sistema automáticamente actualiza la solicitud a estado `PagadaPendienteConfirmacion` (4)
- El `pagoAnticipoId` de la solicitud se vincula con el pago creado

---

#### **1.3. Admin: Consultar Solicitudes Pendientes**

```http
GET /api/v1/solicitudescitasdigitales/pendientes
Authorization: Bearer {admin-token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "solicitud-guid",
      "numeroSolicitud": "SOL-20241225-0001",
      "nombreSolicitante": "Juan Pérez",
      "nombreMascota": "Max",
      "descripcionServicio": "Esterilización",
      "fechaHoraSolicitada": "2024-12-25T10:00:00Z",
      "costoEstimado": 1218.0,
      "montoAnticipo": 609.0,
      "estado": 4,
      "estadoNombre": "PagadaPendienteConfirmacion",
      "pagoAnticipoId": "pago-guid"
    }
  ]
}
```

**Estados incluidos:**

- `PendientePago` (3)
- `PagadaPendienteConfirmacion` (4)
- `EnRevision` (2)

---

#### **1.4. Admin: Verificar Pago del Anticipo**

```http
GET /api/v1/pagos/{pagoAnticipoId}
Authorization: Bearer {admin-token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "pago-guid",
    "numeroPago": "PAGO-20241225-0001",
    "monto": 609.0,
    "estado": 2,
    "estadoNombre": "Completado",
    "esAnticipo": true,
    "montoTotal": 1218.0,
    "montoRestante": 609.0,
    "fechaPago": "2024-12-25T08:30:00Z",
    "payPalOrderId": "8VF91827TN047864P"
  }
}
```

**Validaciones requeridas antes de confirmar:**

- ✅ `estado === 2` (Completado)
- ✅ `monto >= solicitud.montoAnticipo`
- ✅ `esAnticipo === true`

---

#### **1.5. Admin: Confirmar Solicitud y Crear Cita**

```http
POST /api/v1/solicitudescitasdigitales/confirmar
Authorization: Bearer {admin-token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "solicitudId": "solicitud-guid",
  "confirmadoPorId": "admin-guid",
  "veterinarioId": "veterinario-guid",
  "salaId": "sala-guid",
  "fechaHoraConfirmada": "2024-12-25T10:00:00",
  "duracionMin": 120
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Solicitud confirmada y cita creada",
  "data": {
    "id": "solicitud-guid",
    "numeroSolicitud": "SOL-20241225-0001",
    "estado": 5,
    "estadoNombre": "Confirmada",
    "citaId": "cita-guid",
    "pagoAnticipoId": "pago-guid"
  }
}
```

**Importante:**

- Internamente llama a `POST /api/v1/citas` con `solicitudCitaDigitalId`
- Valida automáticamente el pago del 50%
- La cita creada tiene `pagoId` vinculado al anticipo
- La solicitud cambia a estado `Confirmada` (5)

---

#### **1.6. Admin: Consultar Detalle de Cita Creada**

```http
GET /api/v1/citas/{citaId}
Authorization: Bearer {admin-token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "cita-guid",
    "mascotaId": "mascota-guid",
    "mascotaNombre": "Max",
    "propietarioId": "propietario-guid",
    "propietarioNombre": "Juan Pérez",
    "veterinarioId": "veterinario-guid",
    "veterinarioNombre": "Dr. García",
    "salaId": "sala-guid",
    "salaNombre": "Sala 1",
    "tipo": 3,
    "status": 1,
    "startAt": "2024-12-25T10:00:00Z",
    "endAt": "2024-12-25T12:00:00Z",
    "duracionMin": 120,
    "motivoConsulta": "Esterilización programada",
    "pagoId": "pago-guid",
    "createdAt": "2024-12-25T09:00:00Z"
  }
}
```

**Campo clave:** `pagoId` contiene el ID del pago de anticipo del 50%

---

#### **1.7. Admin: Cobrar Saldo Restante (50%) el Día de la Cita**

**Opción A: Pago con PayPal**

```http
POST /api/v1/pagos/paypal/create-order
Authorization: Bearer {admin-token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "citaId": "cita-guid",
  "usuarioId": "usuario-guid",
  "monto": 609.0,
  "conceptoPago": "Saldo restante - Cita #cita-guid",
  "esAnticipo": false,
  "montoTotal": 1218.0,
  "returnUrl": "adopets-admin://payment/success",
  "cancelUrl": "adopets-admin://payment/cancel"
}
```

Luego capturar:

```http
POST /api/v1/pagos/paypal/capture
```

**Opción B: Pago Manual (Efectivo/Tarjeta)**

```http
POST /api/v1/pagos
Authorization: Bearer {admin-token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "citaId": "cita-guid",
  "usuarioId": "usuario-guid",
  "monto": 609.0,
  "moneda": "MXN",
  "tipo": 1,
  "metodo": 2,
  "concepto": "Saldo restante - Cita presencial",
  "esAnticipo": false
}
```

**Tipos de Pago:** `1 = Normal, 2 = Anticipo, 3 = Saldo`  
**Métodos de Pago:** `1 = PayPal, 2 = Efectivo, 3 = Tarjeta, 4 = Transferencia`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Pago registrado exitosamente",
  "data": {
    "id": "pago-saldo-guid",
    "numeroPago": "PAGO-20241225-0002",
    "monto": 609.0,
    "estado": 2,
    "estadoNombre": "Completado",
    "esAnticipo": false,
    "citaId": "cita-guid"
  }
}
```

---

#### **1.8. Admin: Completar Cita**

```http
PUT /api/v1/citas/{citaId}/completar
Authorization: Bearer {admin-token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "notas": "Procedimiento exitoso. Mascota en buen estado."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Cita completada",
  "data": {
    "id": "cita-guid",
    "status": 4,
    "motivoConsulta": "Esterilización programada",
    "notas": "Procedimiento exitoso. Mascota en buen estado.",
    "updatedAt": "2024-12-25T12:30:00Z"
  }
}
```

---

## Flujo 2: Cita Presencial (Walk-in)

### 🎯 Descripción

El cliente llega directamente a la clínica sin cita previa. El personal crea la cita en el sistema y el pago se registra durante o después de la consulta (100% del costo).

### 📊 Diagrama de Flujo

```
Cliente Llega → Admin Crea Cita → Consulta Realizada → Registrar Pago 100% → Completar Cita
```

### 🔗 Endpoints del Flujo

#### **2.1. Admin: Crear Cita Presencial**

```http
POST /api/v1/citas
Authorization: Bearer {admin-token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "mascotaId": "mascota-guid",
  "propietarioId": "propietario-guid",
  "veterinarioId": "veterinario-guid",
  "salaId": "sala-guid",
  "tipo": 1,
  "startAt": "2024-12-25T14:00:00",
  "duracionMin": 60,
  "notas": "Consulta general",
  "motivoConsulta": "Revisión de rutina"
}
```

**Importante:**

- ⚠️ **NO incluir** `solicitudCitaDigitalId`
- ⚠️ **NO se valida pago previo**
- El campo `pagoId` de la cita será `null`

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Cita creada exitosamente",
  "data": {
    "id": "cita-guid",
    "mascotaId": "mascota-guid",
    "propietarioId": "propietario-guid",
    "veterinarioId": "veterinario-guid",
    "salaId": "sala-guid",
    "tipo": 1,
    "status": 1,
    "startAt": "2024-12-25T14:00:00Z",
    "endAt": "2024-12-25T15:00:00Z",
    "duracionMin": 60,
    "pagoId": null,
    "createdAt": "2024-12-25T14:00:00Z"
  }
}
```

**Tipos de Cita:**

- `1 = Consulta`
- `2 = Vacunacion`
- `3 = Procedimiento`
- `4 = Cirugia`
- `5 = Emergencia`

**Estados de Cita:**

- `1 = Programada`
- `2 = EnCurso`
- `3 = Cancelada`
- `4 = Completada`
- `5 = NoAsistio`

---

#### **2.2. Admin: Registrar Pago (100%) - Durante o Después de la Cita**

**Opción A: Pago Manual (Efectivo/Tarjeta)**

```http
POST /api/v1/pagos
Authorization: Bearer {admin-token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "citaId": "cita-guid",
  "usuarioId": "usuario-guid",
  "monto": 500.0,
  "moneda": "MXN",
  "tipo": 1,
  "metodo": 2,
  "concepto": "Pago completo - Consulta general",
  "esAnticipo": false
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Pago registrado exitosamente",
  "data": {
    "id": "pago-guid",
    "numeroPago": "PAGO-20241225-0003",
    "citaId": "cita-guid",
    "monto": 500.0,
    "estado": 2,
    "estadoNombre": "Completado",
    "tipo": 1,
    "tipoNombre": "Normal",
    "metodo": 2,
    "metodoNombre": "Efectivo",
    "fechaPago": "2024-12-25T15:00:00Z"
  }
}
```

**Opción B: Pago con PayPal**

```http
POST /api/v1/pagos/paypal/create-order
Authorization: Bearer {admin-token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "citaId": "cita-guid",
  "usuarioId": "usuario-guid",
  "monto": 500.0,
  "conceptoPago": "Pago completo - Consulta general",
  "esAnticipo": false,
  "montoTotal": 500.0,
  "returnUrl": "adopets-admin://payment/success",
  "cancelUrl": "adopets-admin://payment/cancel"
}
```

Luego capturar con:

```http
POST /api/v1/pagos/paypal/capture
```

---

#### **2.3. Admin: Completar Cita**

```http
PUT /api/v1/citas/{citaId}/completar
Authorization: Bearer {admin-token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "notas": "Consulta realizada. Mascota saludable."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Cita completada",
  "data": {
    "id": "cita-guid",
    "status": 4,
    "notas": "Consulta realizada. Mascota saludable.",
    "updatedAt": "2024-12-25T15:30:00Z"
  }
}
```

---

## Endpoints de Pagos

### 📌 Listar Pagos de un Usuario

```http
GET /api/v1/pagos/usuario/{usuarioId}
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "pago-guid",
      "numeroPago": "PAGO-20241225-0001",
      "monto": 609.0,
      "estado": 2,
      "estadoNombre": "Completado",
      "tipo": 2,
      "tipoNombre": "Anticipo",
      "metodo": 1,
      "metodoNombre": "PayPal",
      "fechaPago": "2024-12-25T08:30:00Z",
      "citaId": "cita-guid",
      "esAnticipo": true,
      "montoTotal": 1218.0,
      "montoRestante": 609.0
    }
  ]
}
```

---

### 📌 Consultar Detalle de un Pago

```http
GET /api/v1/pagos/{pagoId}
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "pago-guid",
    "numeroPago": "PAGO-20241225-0001",
    "usuarioId": "usuario-guid",
    "nombreUsuario": "Juan Pérez",
    "monto": 609.0,
    "moneda": "MXN",
    "tipo": 2,
    "tipoNombre": "Anticipo",
    "metodo": 1,
    "metodoNombre": "PayPal",
    "estado": 2,
    "estadoNombre": "Completado",
    "payPalOrderId": "8VF91827TN047864P",
    "payPalCaptureId": "3C679366E0199954L",
    "fechaPago": "2024-12-25T08:30:00Z",
    "fechaConfirmacion": "2024-12-25T08:30:00Z",
    "concepto": "Anticipo 50% - Esterilización para Max",
    "citaId": "cita-guid",
    "esAnticipo": true,
    "montoTotal": 1218.0,
    "montoRestante": 609.0,
    "createdAt": "2024-12-25T08:28:00Z"
  }
}
```

---

### 📌 Consultar Pago por OrderId de PayPal

```http
GET /api/v1/pagos/paypal/{orderId}
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "pago-guid",
    "numeroPago": "PAGO-20241225-0001",
    "monto": 609.0,
    "estado": 2,
    "payPalOrderId": "8VF91827TN047864P",
    "payPalCaptureId": "3C679366E0199954L"
  }
}
```

---

### 📌 Cancelar Pago

```http
PUT /api/v1/pagos/{pagoId}/cancelar
Authorization: Bearer {admin-token}
Content-Type: application/json
```

**Request Body:**

```json
"Motivo de cancelación"
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Pago cancelado",
  "data": {
    "id": "pago-guid",
    "estado": 4,
    "estadoNombre": "Cancelado",
    "fechaCancelacion": "2024-12-25T16:00:00Z"
  }
}
```

---

## Estados y Validaciones

### 📊 Estados de Solicitud Digital

| Código | Estado                      | Descripción                           |
| ------ | --------------------------- | ------------------------------------- |
| 1      | Pendiente                   | Recién creada, esperando revisión     |
| 2      | EnRevision                  | Personal está revisando               |
| 3      | PendientePago               | Requiere pago del anticipo            |
| 4      | PagadaPendienteConfirmacion | Pago recibido, esperando confirmación |
| 5      | Confirmada                  | Cita confirmada y creada              |
| 6      | Rechazada                   | Solicitud rechazada                   |
| 7      | Cancelada                   | Cancelada por el usuario              |
| 8      | Expirada                    | Tiempo de pago expirado               |

---

### 📊 Estados de Pago

| Código | Estado      | Descripción                        |
| ------ | ----------- | ---------------------------------- |
| 1      | Pendiente   | Orden creada, esperando aprobación |
| 2      | Completado  | Pago exitoso y verificado          |
| 3      | Fallido     | Pago rechazado o error             |
| 4      | Cancelado   | Pago anulado por administrador     |
| 5      | Reembolsado | Pago devuelto al cliente           |

---

### 📊 Estados de Cita

| Código | Estado     | Descripción          |
| ------ | ---------- | -------------------- |
| 1      | Programada | Cita agendada        |
| 2      | EnCurso    | Consulta en progreso |
| 3      | Cancelada  | Cita cancelada       |
| 4      | Completada | Consulta finalizada  |
| 5      | NoAsistio  | Cliente no asistió   |

---

### ✅ Validaciones de Flujo 1 (Solicitud Digital)

**Antes de Confirmar Solicitud:**

1. ✅ `solicitud.Estado === 4` (PagadaPendienteConfirmacion) o `2` (EnRevision)
2. ✅ `solicitud.PagoAnticipoId !== null`
3. ✅ `pagoAnticipo.Estado === 2` (Completado)
4. ✅ `pagoAnticipo.Monto >= solicitud.MontoAnticipo`

**Al Crear Cita desde Solicitud:**

- Backend valida automáticamente el pago del 50%
- Vincula `cita.PagoId` con `solicitud.PagoAnticipoId`
- Actualiza solicitud a estado `Confirmada` (5)

---

### ✅ Validaciones de Flujo 2 (Cita Presencial)

**Al Crear Cita:**

- ⚠️ NO requiere `solicitudCitaDigitalId`
- ⚠️ NO valida pago previo
- `cita.PagoId` será `null` inicialmente

**Al Registrar Pago:**

- El pago se vincula con `citaId`
- Se puede registrar en cualquier momento
- Puede ser antes, durante o después de la cita

---

## 🔍 Endpoints Adicionales de Consulta

### Obtener Cita por Solicitud Digital

```http
GET /api/v1/citas/solicitud/{solicitudId}
Authorization: Bearer {token}
```

### Verificar Disponibilidad de Veterinario

```http
POST /api/v1/solicitudescitasdigitales/verificar-disponibilidad
Content-Type: application/json
```

**Request Body:**

```json
{
  "fechaHoraInicio": "2024-12-25T10:00:00",
  "duracionMin": 120,
  "veterinarioId": "veterinario-guid",
  "salaId": "sala-guid"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "disponible": true,
    "mensaje": "Horario disponible para la cita",
    "conflictos": []
  }
}
```

### Obtener Disponibilidad de Veterinario por Día

```http
GET /api/v1/citas/disponibilidad?veterinarioId={guid}&fecha=2024-12-25
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fecha": "2024-12-25",
    "horariosDisponibles": [
      {
        "horaInicio": "08:00:00",
        "horaFin": "08:30:00",
        "disponible": true
      },
      {
        "horaInicio": "08:30:00",
        "horaFin": "09:00:00",
        "disponible": false,
        "motivo": "Ocupado"
      }
    ]
  }
}
```

---

## 📝 Notas Importantes

### Diferencias Clave entre Flujos

| Aspecto                   | Solicitud Digital            | Cita Presencial       |
| ------------------------- | ---------------------------- | --------------------- |
| **Creación**              | Usuario en app móvil         | Admin en sistema      |
| **Pago Previo**           | Obligatorio (50%)            | No requerido          |
| **Endpoint Creación**     | `/solicitudescitasdigitales` | `/citas`              |
| **Validación Pago**       | Automática al confirmar      | Manual                |
| **pagoId en Cita**        | Vinculado a anticipo         | `null` inicialmente   |
| **Flujo de Confirmación** | 2 pasos (solicitud → cita)   | 1 paso (cita directa) |

### Cálculo de Montos

**Solicitud Digital:**

- `montoAnticipo = costoEstimado * 0.5` (50%)
- `montoRestante = costoEstimado - montoAnticipo`

**Cita Presencial:**

- Pago único del 100% del costo

### Seguridad

Todos los endpoints requieren autenticación con Bearer token:

```
Authorization: Bearer {jwt-token}
```

Los endpoints administrativos requieren roles específicos (verificar en el backend).

---

## 🎯 Resumen de Endpoints Principales

### Solicitudes Digitales

- `POST /api/v1/solicitudescitasdigitales` - Crear solicitud
- `GET /api/v1/solicitudescitasdigitales/pendientes` - Listar pendientes
- `GET /api/v1/solicitudescitasdigitales/{id}` - Detalle de solicitud
- `POST /api/v1/solicitudescitasdigitales/confirmar` - Confirmar y crear cita

### Citas

- `POST /api/v1/citas` - Crear cita
- `GET /api/v1/citas/{id}` - Detalle de cita
- `PUT /api/v1/citas/{id}/completar` - Completar cita
- `PUT /api/v1/citas/{id}/cancelar` - Cancelar cita

### Pagos

- `POST /api/v1/pagos/paypal/create-order` - Crear orden PayPal
- `POST /api/v1/pagos/paypal/capture` - Capturar pago PayPal
- `POST /api/v1/pagos` - Registrar pago manual
- `GET /api/v1/pagos/{id}` - Detalle de pago
- `GET /api/v1/pagos/usuario/{usuarioId}` - Listar pagos

---

_Versión del documento: 1.0_  
_Última actualización: Diciembre 2024_  
_Compatible con: .NET 9, PayPal SDK 1.0.4_
