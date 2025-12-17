# Registro de Configuración de Wompi - Hotel Sion Real

## 🔑 Credenciales de Producción

### Llaves del API
- **Llave Pública**: `pub_prod_4girIl1kpKyFJpOOPc92grI3hTfO9dje`
- **Llave Privada**: `prv_prod_bS9ZNAR9vJZwUt7qYfZrPfqtbeAmWBCd` ⚠️ SECRETO

### Secretos para Integración Técnica
- **Eventos**: `prod_events_sXSyd6KBdFytWv9mzco5XKRTR0T6lSSh` ⚠️ SECRETO
- **Integridad**: `prod_integrity_3vRVuKah6yxwUbyZ5hWDmnQTAtKzkWFf` ⚠️ SECRETO

## 🌐 URLs Importantes

- **Sitio Web**: https://www.hotelsionreal.com/
- **API Wompi Producción**: https://production.wompi.co/v1
- **Webhook URL (Supabase)**: https://qdahnzvrkqpaphncdvrn.supabase.co/functions/v1/wompi-webhook
- **Panel de Comercios**: https://comercios.wompi.co/

## ✅ Configuración Completada

### Vercel (Frontend)
- [x] `VITE_WOMPI_PUBLIC_KEY` = `pub_prod_4girIl1kpKyFJpOOPc92grI3hTfO9dje`
- [x] `VITE_WOMPI_API_URL` = `https://production.wompi.co/v1`

### Supabase Edge Functions (Backend)
- [ ] `WOMPI_PRIVATE_KEY` = `prv_prod_bS9ZNAR9vJZwUt7qYfZrPfqtbeAmWBCd`
- [ ] `WOMPI_EVENTS_SECRET` = `prod_events_sXSyd6KBdFytWv9mzco5XKRTR0T6lSSh`
- [ ] `WOMPI_INTEGRITY_SECRET` = `prod_integrity_3vRVuKah6yxwUbyZ5hWDmnQTAtKzkWFf`

### Wompi Panel
- [ ] Webhook configurado con URL: `https://qdahnzvrkqpaphncdvrn.supabase.co/functions/v1/wompi-webhook`
- [ ] Evento configurado: `transaction.updated`

## 📝 Notas

- Las claves marcadas con ⚠️ SECRETO nunca deben estar en el frontend
- Consulta `WOMPI_PRODUCTION_SETUP.md` para instrucciones detalladas
- Fecha de configuración: [Fecha actual]

