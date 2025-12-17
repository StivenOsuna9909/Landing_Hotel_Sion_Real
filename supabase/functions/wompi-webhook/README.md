# Webhook de Wompi - Supabase Edge Function

Esta función maneja los webhooks de Wompi para actualizar automáticamente el estado de las reservas cuando se completa un pago.

## Configuración

### 1. Desplegar la función

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Iniciar sesión en Supabase
supabase login

# Vincular tu proyecto
supabase link --project-ref qdahnzvrkqpaphncdvrn

# Desplegar la función
supabase functions deploy wompi-webhook
```

### 2. Configurar variables de entorno

La función necesita acceso a Supabase. Las variables `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` se configuran automáticamente cuando despliegas desde Supabase CLI.

### 3. Configurar el webhook en Wompi

1. Ve a tu panel de Wompi: https://comercios.wompi.co/
2. Ve a **Configuración** > **Webhooks**
3. Agrega una nueva URL de webhook:
   ```
   https://qdahnzvrkqpaphncdvrn.supabase.co/functions/v1/wompi-webhook
   ```
4. Selecciona los eventos:
   - `transaction.updated`
   - `transaction.approved`
   - `transaction.declined`

### 4. Autenticación (Opcional pero recomendado)

Para mayor seguridad, puedes agregar autenticación al webhook:

1. Genera un token secreto
2. Configúralo en Wompi como header de autenticación
3. Valida el token en la función

## Cómo funciona

1. Cliente completa el pago en Wompi
2. Wompi envía un webhook a esta función
3. La función busca la reserva por `transaction_id`
4. Actualiza el estado de la reserva según el estado del pago:
   - `APPROVED` → `paid`
   - `PENDING` → `pending`
   - `DECLINED`/`VOIDED` → `cancelled`

## Estados de pago de Wompi

- `APPROVED`: Pago exitoso → Reserva marcada como `paid`
- `PENDING`: Pago pendiente → Reserva permanece como `pending`
- `DECLINED`: Pago rechazado → Reserva marcada como `cancelled`
- `VOIDED`: Pago anulado → Reserva marcada como `cancelled`

## Testing

Puedes probar el webhook localmente:

```bash
# Iniciar Supabase localmente
supabase start

# Probar la función
curl -X POST http://localhost:54321/functions/v1/wompi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "transaction.updated",
    "data": {
      "transaction": {
        "id": "12345",
        "status": "APPROVED",
        "reference": "HOTEL-SION-2024-1234567890",
        "amount_in_cents": 5000000,
        "currency": "COP",
        "payment_method_type": "NEQUI",
        "created_at": "2024-01-01T00:00:00Z"
      }
    }
  }'
```

## Monitoreo

Puedes ver los logs de la función en:
- Supabase Dashboard > Edge Functions > wompi-webhook > Logs

## Seguridad

⚠️ **Importante**: 
- La función usa `SUPABASE_SERVICE_ROLE_KEY` que tiene acceso completo
- Considera agregar validación de firma del webhook de Wompi
- En producción, agrega autenticación adicional

