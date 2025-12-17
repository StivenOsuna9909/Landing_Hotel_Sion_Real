# Configuración Completa de Wompi en Producción

## 📋 Resumen de Variables

### Variables para Vercel (Frontend)
Estas variables van en **Vercel → Settings → Environment Variables**:

```
VITE_WOMPI_PUBLIC_KEY=pub_prod_4girIl1kpKyFJpOOPc92grI3hTfO9dje
VITE_WOMPI_API_URL=https://production.wompi.co/v1
```

### Variables para Supabase Edge Functions (Backend)
Estas variables van en **Supabase → Edge Functions → wompi-webhook → Settings → Secrets**:

```
WOMPI_PRIVATE_KEY=prv_prod_bS9ZNAR9vJZwUt7qYfZrPfqtbeAmWBCd
WOMPI_EVENTS_SECRET=prod_events_sXSyd6KBdFytWv9mzco5XKRTR0T6lSSh
WOMPI_INTEGRITY_SECRET=prod_integrity_3vRVuKah6yxwUbyZ5hWDmnQTAtKzkWFf
```

## 🚀 Paso 1: Configurar Variables en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega estas variables (marcar para **Production** y **Preview**):

| Variable | Valor | Entornos |
|----------|-------|----------|
| `VITE_WOMPI_PUBLIC_KEY` | `pub_prod_4girIl1kpKyFJpOOPc92grI3hTfO9dje` | Production, Preview |
| `VITE_WOMPI_API_URL` | `https://production.wompi.co/v1` | Production, Preview |

5. **Haz un redeploy** después de agregar las variables

## 🔐 Paso 2: Configurar Variables en Supabase Edge Functions

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Edge Functions** en el menú lateral
4. Encuentra la función `wompi-webhook` (o créala si no existe)
5. Ve a **Settings** → **Secrets** (o **Environment Variables**)
6. Agrega estos secrets:

| Secret | Valor |
|--------|-------|
| `WOMPI_PRIVATE_KEY` | `prv_prod_bS9ZNAR9vJZwUt7qYfZrPfqtbeAmWBCd` |
| `WOMPI_EVENTS_SECRET` | `prod_events_sXSyd6KBdFytWv9mzco5XKRTR0T6lSSh` |
| `WOMPI_INTEGRITY_SECRET` | `prod_integrity_3vRVuKah6yxwUbyZ5hWDmnQTAtKzkWFf` |

**Nota**: Las variables `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` ya están disponibles automáticamente en las Edge Functions.

## 🌐 Paso 3: Configurar Webhook en Wompi

**⚠️ IMPORTANTE**: NO uses la sección "SFTPS / FTPS" - esa es para transferencias de archivos, no para webhooks.

### Ubicación correcta del Webhook:

1. Ve a tu panel de comercios de Wompi: https://comercios.wompi.co/
2. Inicia sesión
3. En el menú lateral izquierdo, busca y haz clic en **"Desarrollo"** (Development)
4. Luego haz clic en **"Programadores"** (Developers)
5. En la sección principal, busca la sección **"Configuraciones avanzadas para programadores"**
6. Dentro de esa sección, encuentra **"Seguimiento de transacciones"** (Transaction Tracking)
7. En el campo **"URL de Eventos"** (Events URL), ingresa la siguiente URL:

```
https://qdahnzvrkqpaphncdvrn.supabase.co/functions/v1/wompi-webhook
```

8. Haz clic en el botón verde **"Guardar"** (Save) que está debajo del campo

**Nota**: Esta URL es donde Wompi enviará las notificaciones cuando una transacción cambie de estado (como cuando se aprueba un pago).

## 🔄 Paso 3.5: Configurar URL de Redirección (Si es necesario)

Algunas configuraciones de Wompi requieren configurar la URL de redirección en el panel:

1. Ve a **Configuración** → **Integraciones** o **URLs de Redirección**
2. Configura la URL de éxito:
   ```
   https://www.hotelsionreal.com/payment/success
   ```
3. Configura la URL de error (si aplica):
   ```
   https://www.hotelsionreal.com/payment/error
   ```

**Nota**: Si Wompi devuelve la URL de redirección automáticamente en la respuesta de la transacción (como está implementado actualmente), este paso puede no ser necesario. Verifica en el panel de Wompi si hay una opción para configurar URLs de redirección.

## ✅ Paso 4: Verificar Configuración

### Verificar Variables en Vercel
1. Ve a **Settings** → **Environment Variables**
2. Verifica que las variables estén configuradas
3. Asegúrate de que estén marcadas para **Production**

### Verificar Edge Function en Supabase
1. Ve a **Edge Functions** → `wompi-webhook`
2. Verifica que los secrets estén configurados
3. Prueba la función ejecutando:
   ```bash
   curl -X POST https://qdahnzvrkqpaphncdvrn.supabase.co/functions/v1/wompi-webhook \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"event":"transaction.updated","data":{"transaction":{"id":"test","status":"APPROVED","reference":"TEST123","amount_in_cents":100000,"currency":"COP","payment_method_type":"NEQUI","created_at":"2024-01-01T00:00:00Z"}}}'
   ```

### Verificar Webhook en Wompi
1. Ve a **Configuración** → **Webhooks** en el panel de Wompi
2. Verifica que la URL del webhook sea correcta
3. Puedes probar el webhook desde el panel de Wompi si tienen esa opción

## 🧪 Paso 5: Probar en Producción

1. Ve a tu sitio: https://www.hotelsionreal.com/
2. Crea una reserva de prueba
3. Intenta procesar un pago real (o de prueba si Wompi lo permite)
4. Verifica que:
   - El pago se procesa correctamente
   - El webhook se recibe en Supabase
   - El estado de la reserva se actualiza correctamente
   - El usuario es redirigido a la página de éxito

## 📝 Variables de Entorno Resumen

### Frontend (Vercel) ✅ Públicas
```env
VITE_WOMPI_PUBLIC_KEY=pub_prod_4girIl1kpKyFJpOOPc92grI3hTfO9dje
VITE_WOMPI_API_URL=https://production.wompi.co/v1
```

### Backend (Supabase Edge Functions) 🔐 Privadas
```env
WOMPI_PRIVATE_KEY=prv_prod_bS9ZNAR9vJZwUt7qYfZrPfqtbeAmWBCd
WOMPI_EVENTS_SECRET=prod_events_sXSyd6KBdFytWv9mzco5XKRTR0T6lSSh
WOMPI_INTEGRITY_SECRET=prod_integrity_3vRVuKah6yxwUbyZ5hWDmnQTAtKzkWFf
```

## 🔗 URLs Importantes

- **Tu sitio web**: https://www.hotelsionreal.com/
- **API de Wompi Producción**: https://production.wompi.co/v1
- **Webhook URL (Supabase)**: https://qdahnzvrkqpaphncdvrn.supabase.co/functions/v1/wompi-webhook
- **Panel de Comercios Wompi**: https://comercios.wompi.co/
- **Documentación Wompi**: https://docs.wompi.co/

## ⚠️ Importante

1. **Nunca expongas las claves privadas** (`prv_prod_*`) en el frontend
2. **Siempre haz redeploy** después de cambiar variables de entorno
3. **Verifica que el webhook URL** apunte a Supabase, NO a tu dominio del frontend
4. **Las variables `VITE_*` son públicas** y aparecerán en el código del cliente

## 🐛 Troubleshooting

### El pago se procesa pero no se actualiza la reserva
- Verifica que el webhook esté configurado correctamente en Wompi
- Revisa los logs de la Edge Function en Supabase
- Verifica que los secrets estén configurados en Supabase

### Error: "Configuración de Wompi no encontrada"
- Verifica que `VITE_WOMPI_PUBLIC_KEY` esté en Vercel
- Haz un redeploy después de agregar las variables
- Verifica que las variables estén marcadas para Production

### El webhook no llega a Supabase
- Verifica que la URL del webhook en Wompi sea correcta
- Asegúrate de que la Edge Function esté desplegada
- Revisa los logs de la Edge Function en Supabase

## ✅ Checklist Final

- [ ] Variables `VITE_WOMPI_PUBLIC_KEY` y `VITE_WOMPI_API_URL` configuradas en Vercel
- [ ] Secrets configurados en Supabase Edge Functions
- [ ] Webhook configurado en Wompi con la URL correcta
- [ ] Redeploy realizado en Vercel
- [ ] Edge Function desplegada en Supabase
- [ ] Prueba de pago realizada exitosamente
- [ ] Webhook recibido y procesado correctamente

