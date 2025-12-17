# Pruebas de Wompi en Modo Sandbox

## Configuración Actual

Ya tienes configuradas las claves de prueba de Wompi en el archivo `.env`:
- ✅ Llave pública: `pub_test_CRKDHY8TJ5Z8qjt6bo2rrYfVv2zegsO6`
- ✅ API URL: `https://sandbox.wompi.co/v1`
- ✅ Eventos: `test_events_t646ZS6k3WnsB92rBWqhBsKGdWsqVG7O`
- ✅ Integridad: `test_integrity_TH0zRagwMzczCMfmXVPC8VWqqNjpevjY`

## Problema: Webhooks en Localhost

Wompi **NO puede** enviar webhooks a `localhost` o `127.0.0.1`. Necesitas exponer tu servidor local a internet.

## Soluciones para Probar Webhooks Localmente

### Opción 1: Usar ngrok (Recomendado para pruebas) ⭐

**ngrok** crea un túnel público hacia tu localhost.

#### 1. Instalar ngrok
```bash
# Descarga desde https://ngrok.com/download
# O con npm:
npm install -g ngrok
```

#### 2. Iniciar tu servidor local
```bash
npm run dev
# Tu servidor corre en http://localhost:8080
```

#### 3. Crear túnel con ngrok
```bash
ngrok http 8080
```

Esto te dará una URL pública como:
```
https://abc123.ngrok.io
```

#### 4. Configurar webhook en Wompi Sandbox
1. Ve a tu panel de Wompi Sandbox
2. Configuración > Webhooks
3. Agrega la URL:
   ```
   https://abc123.ngrok.io/payment/success
   ```
   O si tienes un endpoint específico para webhooks:
   ```
   https://abc123.ngrok.io/api/webhook/wompi
   ```

**⚠️ Nota**: La URL de ngrok cambia cada vez que lo reinicias (en el plan gratuito). Para una URL fija, necesitas el plan de pago.

### Opción 2: Usar Supabase Edge Functions (Mejor para producción)

En lugar de exponer localhost, despliega la Edge Function en Supabase:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Vincular proyecto
supabase link --project-ref qdahnzvrkqpaphncdvrn

# Desplegar función
supabase functions deploy wompi-webhook
```

Luego configura el webhook en Wompi apuntando a:
```
https://qdahnzvrkqpaphncdvrn.supabase.co/functions/v1/wompi-webhook
```

### Opción 3: Usar herramientas de prueba de Wompi

Wompi Sandbox tiene herramientas para simular webhooks sin necesidad de configurar URLs públicas.

1. Ve a tu panel de Wompi Sandbox
2. Busca la sección de "Pruebas" o "Testing"
3. Usa el simulador de webhooks para probar diferentes escenarios

## Configuración para Pruebas Locales

### Crear endpoint de prueba para webhooks

Puedes crear un endpoint temporal en tu aplicación para recibir webhooks durante las pruebas:

```typescript
// src/pages/WebhookTest.tsx (solo para desarrollo)
import { useEffect, useState } from 'react';
import { updateReservationStatus, getReservationByTransactionId } from '@/services/reservations';

const WebhookTest = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Endpoint temporal para recibir webhooks
    const handleWebhook = async (event: MessageEvent) => {
      if (event.data.type === 'wompi-webhook') {
        const { reference, status } = event.data;
        // Procesar webhook...
        setLogs(prev => [...prev, `Webhook recibido: ${reference} - ${status}`]);
      }
    };

    window.addEventListener('message', handleWebhook);
    return () => window.removeEventListener('message', handleWebhook);
  }, []);

  return (
    <div>
      <h1>Webhook Test</h1>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
};
```

## Flujo de Prueba Recomendado

### Para pruebas rápidas (sin webhooks):

1. **Probar el flujo de pago completo**:
   - Completa una reserva
   - Selecciona método de pago (Nequi/PSE)
   - Usa datos de prueba de Wompi Sandbox
   - Verifica que la reserva se guarde en Supabase

2. **Probar actualización manual**:
   - Después del pago, ve a `/payment/success?reference=XXX&status=APPROVED`
   - Verifica que la reserva se actualice correctamente

### Para pruebas con webhooks:

1. **Configura ngrok**:
   ```bash
   ngrok http 8080
   ```

2. **Copia la URL pública** (ej: `https://abc123.ngrok.io`)

3. **Configura webhook en Wompi**:
   - URL: `https://abc123.ngrok.io/api/webhook/wompi`
   - Eventos: `transaction.updated`

4. **Realiza una transacción de prueba**

5. **Verifica los logs** en ngrok y en tu aplicación

## Datos de Prueba de Wompi Sandbox

Wompi Sandbox proporciona datos de prueba específicos. Consulta la documentación de Wompi para:
- Números de tarjeta de prueba
- Números de Nequi de prueba
- Códigos de respuesta de prueba

## Próximos Pasos

1. **Ahora (Sandbox)**: Usa ngrok para probar webhooks localmente
2. **Cuando aprueben tu cuenta**: Configura webhooks en producción apuntando a Supabase Edge Functions
3. **Producción**: Usa las claves de producción y la URL de Supabase

## Notas Importantes

- ⚠️ Las claves de prueba (`pub_test_*`, `prv_test_*`) solo funcionan en sandbox
- ⚠️ Los webhooks de sandbox pueden tener limitaciones
- ✅ Una vez aprobada tu cuenta, recibirás claves de producción
- ✅ En producción, usa Supabase Edge Functions para webhooks (más confiable que ngrok)

## Comandos Útiles

```bash
# Ver variables de entorno actuales
Get-Content .env

# Reiniciar servidor después de cambiar .env
# Ctrl+C para detener, luego:
npm run dev

# Iniciar ngrok (en otra terminal)
ngrok http 8080

# Ver logs de ngrok
# Abre http://localhost:4040 en tu navegador
```

