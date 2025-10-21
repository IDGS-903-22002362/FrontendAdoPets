# 🚀 Inicio Rápido - AdoPets Frontend

## ✅ Todo está listo!

El servidor de desarrollo ya está corriendo en: **http://localhost:5173**

## 🎯 Accede a la aplicación:

### 1. Página de Inicio
```
http://localhost:5173/
```

### 2. Iniciar Sesión
```
http://localhost:5173/login
```

### 3. Registrarse
```
http://localhost:5173/register
```

### 4. Dashboard (requiere login)
```
http://localhost:5173/dashboard
```

## 🔧 Configuración del Backend

### Asegúrate de que tu backend .NET Core esté corriendo:
- **URL**: `https://localhost:5001`
- **Swagger**: `https://localhost:5001/swagger`

### Configura CORS en tu backend:

En `Program.cs` o `Startup.cs`:

```csharp
// Agregar servicio CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AdoPetsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Usar CORS (antes de UseAuthorization)
app.UseCors("AdoPetsPolicy");
```

## 🧪 Prueba la Aplicación

### Opción 1: Registrar un nuevo usuario

1. Ve a http://localhost:5173/register
2. Completa el formulario:
   ```
   Nombre: Juan
   Apellido Paterno: Pérez
   Apellido Materno: García (opcional)
   Email: juan.perez@ejemplo.com
   Teléfono: 5551234567 (opcional)
   Contraseña: Password123!
   Confirmar Contraseña: Password123!
   ✓ Acepto las políticas
   ```
3. Haz clic en "Registrarse"
4. Serás redirigido al Dashboard automáticamente

### Opción 2: Iniciar sesión

1. Ve a http://localhost:5173/login
2. Ingresa credenciales:
   ```
   Email: juan.perez@ejemplo.com
   Contraseña: Password123!
   ```
3. Haz clic en "Iniciar Sesión"
4. Serás redirigido al Dashboard

## 📋 Requisitos de Contraseña

La contraseña debe tener:
- ✅ Mínimo 8 caracteres
- ✅ Al menos una letra mayúscula (A-Z)
- ✅ Al menos una letra minúscula (a-z)
- ✅ Al menos un número (0-9)
- ✅ Al menos un carácter especial (@$!%*?&#)

**Ejemplos válidos:**
- `Password123!`
- `MySecure@Pass1`
- `Admin#2024Pass`

## 🐛 Solución de Problemas

### Error: "No se pudo conectar con el servidor"
**Solución:** Asegúrate de que el backend esté corriendo en `https://localhost:5001`

### Error de CORS
**Solución:** Configura CORS en el backend como se muestra arriba

### Error de certificado SSL
**Solución:** 
1. Abre `https://localhost:5001` en tu navegador
2. Acepta el certificado autofirmado
3. Recarga la aplicación React

### Los tokens expiraron
**Solución:**
1. Abre DevTools (F12)
2. Ve a Application > Local Storage
3. Elimina todos los items
4. Recarga la página
5. Vuelve a iniciar sesión

## 🎨 Tecnologías

- ⚛️ React 18
- ⚡ Vite
- 🎨 Tailwind CSS
- 🔀 React Router DOM
- 📡 Axios

## 📱 Responsive

La aplicación funciona perfectamente en:
- 📱 Móviles
- 📱 Tablets  
- 💻 Desktop

## 🔐 Características de Seguridad

- ✅ Autenticación JWT
- ✅ Refresh token automático
- ✅ Rutas protegidas
- ✅ Validación de roles
- ✅ Almacenamiento seguro de tokens

## 📚 Documentación

- **Frontend**: `FRONTEND_README.md`
- **Backend Auth**: `AUTHENTICATION_README.md`
- **API Examples**: `API_EXAMPLES.md`
- **Implementación**: `IMPLEMENTACION.md`

## 🎊 ¡Listo para Usar!

Tu aplicación está completamente configurada. Solo asegúrate de:
1. ✅ Backend corriendo en `https://localhost:5001`
2. ✅ CORS configurado
3. ✅ Certificado SSL aceptado

**¡Disfruta AdoPets!** 🐾

---

Para más información, consulta los archivos de documentación en la raíz del proyecto.
