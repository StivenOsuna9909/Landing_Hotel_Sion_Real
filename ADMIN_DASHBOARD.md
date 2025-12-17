# Dashboard de Administración - Hotel Sion Real

## Acceso al Dashboard

El dashboard de administración está disponible en: `/admin/dashboard`

### Credenciales por Defecto

- **Usuario**: `admin`
- **Contraseña**: `admin123`

⚠️ **IMPORTANTE**: Cambia estas credenciales en producción configurando las variables de entorno:
- `VITE_ADMIN_USERNAME` - Usuario del administrador
- `VITE_ADMIN_PASSWORD` - Contraseña del administrador

## Características del Dashboard

### 1. Estadísticas Generales
- **Total de Reservas**: Muestra el número total de reservas y cuántas están confirmadas
- **Ingresos Totales**: Suma de todas las reservas confirmadas y pagadas
- **Reservas Pendientes**: Reservas que requieren atención
- **Reservas Canceladas**: Total de reservas canceladas

### 2. Calendario de Reservas
- Visualización mensual de todas las reservas activas
- **Colores en el calendario**:
  - 🟢 Verde: Fecha de entrada
  - 🔵 Azul: Período ocupado
  - 🔴 Rojo: Fecha de salida
- Al seleccionar un mes, se muestran las reservas de ese período en el panel lateral

### 3. Tabla de Reservas
- Lista completa de todas las reservas confirmadas y pagadas
- Información mostrada:
  - Datos del cliente (nombre y email)
  - Tipo de habitación
  - Fechas de entrada y salida
  - Número de huéspedes
  - Monto total
  - Método de pago (PSE, Nequi, WhatsApp)
  - Estado de la reserva

## Gestión de Reservas

### Estados de Reserva

- **pending**: Reserva pendiente de confirmación o pago
- **confirmed**: Reserva confirmada
- **paid**: Reserva pagada
- **cancelled**: Reserva cancelada

### Almacenamiento

Las reservas se almacenan en `localStorage` del navegador. En producción, deberías migrar esto a un backend con base de datos.

## Flujo de Reserva

1. Cliente completa el formulario de reserva
2. Se redirige a la página de checkout
3. Cliente ingresa sus datos y selecciona método de pago
4. Se crea una reserva con estado `pending`
5. Si el pago es exitoso (Wompi), se actualiza a `paid`
6. Si se usa WhatsApp como fallback, queda como `pending` hasta confirmación manual

## Página de Éxito de Pago

Cuando un pago se completa exitosamente, el usuario es redirigido a `/payment/success` donde:
- Se muestra confirmación del pago
- Se actualiza el estado de la reserva a `paid`
- Se muestran los detalles de la reserva
- El cliente puede imprimir su confirmación

## Seguridad

- Las rutas del dashboard están protegidas con autenticación
- Solo usuarios autenticados pueden acceder al dashboard
- La sesión se mantiene en `localStorage` (en producción, usa tokens JWT)

## Próximos Pasos para Producción

1. **Backend API**: Migrar el almacenamiento de reservas a un backend con base de datos
2. **Webhooks de Wompi**: Configurar webhooks para actualizar automáticamente el estado de las reservas
3. **Autenticación Mejorada**: Implementar JWT tokens y refresh tokens
4. **Notificaciones**: Enviar emails de confirmación automáticos
5. **Exportación**: Permitir exportar reservas a Excel/PDF
6. **Filtros Avanzados**: Agregar filtros por fecha, estado, método de pago, etc.

## Solución de Problemas

### No puedo iniciar sesión
- Verifica que las credenciales sean correctas
- Revisa la consola del navegador para errores
- Asegúrate de que las variables de entorno estén configuradas correctamente

### No se muestran reservas en el calendario
- Verifica que haya reservas con estado `confirmed` o `paid`
- Revisa la consola del navegador para errores
- Asegúrate de que las fechas de las reservas sean válidas

### Las reservas no se guardan
- Verifica que el checkout esté guardando correctamente
- Revisa la consola del navegador
- Verifica que `localStorage` esté habilitado en el navegador

