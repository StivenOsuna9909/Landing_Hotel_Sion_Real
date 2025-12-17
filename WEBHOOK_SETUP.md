# Configuración de Webhooks de Wompi

## ¿Qué son los webhooks?

Los webhooks permiten que Wompi notifique automáticamente a tu aplicación cuando cambia el estado de un pago. Esto es mejor que esperar a que el usuario regrese de la página de pago.

## Opciones de Implementación

### Opción 1: Supabase Edge Functions (Recomendado) ⭐

Ya que estás usando Supabase, puedes usar Edge Functions para manejar los webhooks.

**Ventajas:**
- ✅ Integrado con tu stack actual
- ✅ Sin necesidad de servidor propio
- ✅ Escalable automáticamente
- ✅ Gratis hasta cierto límite

**Archivos creados:**
- `supabase/functions/wompi-webhook/index.ts` - Función Edge Function

**Pasos:**
1. Instala Supabase CLI: `npm install -g supabase`
2. Despliega la función: `supabase functions deploy wompi-webhook`
3. Configura el webhook en Wompi apuntando a la URL de la función

### Opción 2: Backend Propio (Node.js/Express)

Si prefieres tener control total, puedes crear un backend propio.

**Ejemplo con Express:**
```javascript
const express = require('express');
const app = express();

app.post('/webhook/wompi', async (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'transaction.updated') {
    // Actualizar reserva en Supabase
    const { transaction } = data;
    // ... lógica de actualización
  }
  
  res.status(200).send('OK');
});
```

### Opción 3: Serverless Functions (Vercel/Netlify)

Puedes usar funciones serverless de Vercel o Netlify.

## Flujo Actual vs Con Webhooks

### Sin Webhooks (Actual):
1. Cliente paga en Wompi
2. Wompi redirige a `/payment/success?reference=XXX&status=APPROVED`
3. El frontend busca y actualiza la reserva

**Problemas:**
- Si el usuario cierra la ventana, la reserva no se actualiza
- Depende de que el usuario regrese a la página

### Con Webhooks:
1. Cliente paga en Wompi
2. Wompi envía webhook al backend automáticamente
3. El backend actualiza la reserva en Supabase
4. El usuario puede regresar o no, la reserva ya está actualizada

**Ventajas:**
- ✅ Actualización automática y confiable
- ✅ No depende del usuario
- ✅ Funciona incluso si el usuario cierra la ventana

## Configuración en Wompi

1. Ve a tu panel de Wompi: https://comercios.wompi.co/
2. Ve a **Configuración** > **Webhooks**
3. Agrega la URL de tu webhook:
   - Supabase Edge Function: `https://qdahnzvrkqpaphncdvrn.supabase.co/functions/v1/wompi-webhook`
   - Backend propio: `https://tu-dominio.com/api/webhook/wompi`
4. Selecciona los eventos a escuchar

## Próximos Pasos

1. **Elige una opción** (recomiendo Supabase Edge Functions)
2. **Despliega la función/backend**
3. **Configura el webhook en Wompi**
4. **Prueba con una transacción de prueba**

¿Quieres que te ayude a desplegar la Edge Function de Supabase?

