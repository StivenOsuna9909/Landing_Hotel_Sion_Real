# Configuración de Supabase para Hotel Sion Real

## Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota tu **URL del proyecto** y la **API Key anónima (anon key)**

### 2. Crear la Tabla de Reservas

1. En el panel de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido del archivo `supabase/schema.sql`
3. Ejecuta el SQL para crear la tabla y las políticas

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_SUPABASE_URL=https://qdahnzvrkqpaphncdvrn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_V5cU9VGq9e1XIFVsJ3_4uQ_t7CcFmvA
```

**⚠️ IMPORTANTE**: 
- No subas el archivo `.env` a Git (ya está en `.gitignore`)
- La `publishable key` es segura para usar en el frontend (equivalente a la antigua `anon key`)
- Las políticas RLS protegen los datos
- **NUNCA** uses la `secret key` en el frontend

### 4. Verificar la Configuración

1. Reinicia el servidor de desarrollo: `npm run dev`
2. Intenta crear una reserva desde el checkout
3. Verifica en el dashboard que la reserva aparezca

## Estructura de la Base de Datos

### Tabla: `reservations`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | ID único de la reserva (generado automáticamente) |
| `check_in` | DATE | Fecha de entrada |
| `check_out` | DATE | Fecha de salida |
| `guests` | INTEGER | Número de huéspedes |
| `room_type` | TEXT | Tipo de habitación (ID) |
| `room_name` | TEXT | Nombre de la habitación |
| `nights` | INTEGER | Número de noches |
| `price_per_night` | INTEGER | Precio por noche en centavos |
| `total` | INTEGER | Total en centavos |
| `customer_email` | TEXT | Email del cliente |
| `customer_name` | TEXT | Nombre completo del cliente |
| `customer_phone` | TEXT | Teléfono del cliente |
| `customer_legal_id` | TEXT | Cédula del cliente (opcional) |
| `payment_method` | TEXT | Método de pago: PSE, NEQUI, WHATSAPP |
| `status` | TEXT | Estado: pending, confirmed, paid, cancelled |
| `transaction_id` | TEXT | ID de transacción de Wompi (opcional) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

## Políticas de Seguridad (RLS)

Las políticas actuales permiten:
- **Lectura pública**: Cualquiera puede leer las reservas (para el dashboard)
- **Inserción pública**: Cualquiera puede crear reservas
- **Actualización pública**: Cualquiera puede actualizar reservas

⚠️ **Para producción**, deberías:
1. Restringir la lectura solo a administradores autenticados
2. Usar autenticación de Supabase para el dashboard
3. Implementar webhooks de Wompi para actualizar estados automáticamente

## Migración desde localStorage

Si ya tienes reservas en localStorage, puedes migrarlas ejecutando este script en la consola del navegador:

```javascript
// Ejecutar en la consola del navegador en la página del dashboard
const stored = localStorage.getItem('hotel_sion_reservations');
if (stored) {
  const reservations = JSON.parse(stored);
  // Luego importar y usar saveReservation para cada una
  console.log('Reservas a migrar:', reservations);
}
```

## Funciones Disponibles

El servicio `reservations.ts` ahora usa Supabase y proporciona:

- `getReservations()` - Obtiene todas las reservas
- `saveReservation()` - Guarda una nueva reserva
- `updateReservationStatus()` - Actualiza el estado de una reserva
- `getConfirmedReservations()` - Obtiene reservas confirmadas/pagadas
- `getReservationsByDateRange()` - Obtiene reservas por rango de fechas
- `checkAvailability()` - Verifica disponibilidad
- `getReservationStats()` - Obtiene estadísticas
- `getReservationById()` - Obtiene una reserva por ID
- `getReservationByTransactionId()` - Obtiene una reserva por transaction_id

## Solución de Problemas

### Error: "Missing Supabase environment variables"
- Verifica que el archivo `.env` exista y tenga las variables correctas
- Reinicia el servidor de desarrollo después de crear/modificar `.env`

### Error: "relation 'reservations' does not exist"
- Ejecuta el SQL del archivo `supabase/schema.sql` en el SQL Editor de Supabase

### Error: "new row violates row-level security policy"
- Verifica que las políticas RLS estén configuradas correctamente
- Revisa que las políticas permitan las operaciones necesarias

### Las reservas no se guardan
- Verifica la consola del navegador para errores
- Revisa que las variables de entorno estén correctas
- Verifica que la tabla exista en Supabase

## Próximos Pasos

1. **Autenticación de Administradores**: Integrar autenticación de Supabase para el dashboard
2. **Webhooks de Wompi**: Configurar webhooks para actualizar automáticamente el estado de las reservas
3. **Notificaciones por Email**: Usar Supabase Edge Functions para enviar emails de confirmación
4. **Backups Automáticos**: Configurar backups automáticos en Supabase
5. **Analytics**: Usar las funciones de Supabase para generar reportes

