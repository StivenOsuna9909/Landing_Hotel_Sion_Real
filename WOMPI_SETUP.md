# Configuración de Wompi para Pagos

Este proyecto está configurado para procesar pagos reales mediante Wompi (PSE y Nequi).

## Pasos para Configurar Wompi

### 1. Registro en Wompi

1. Ve a https://comercios.wompi.co/
2. Regístrate como comercio
3. Completa el proceso de verificación
4. Obtén tus credenciales:
   - **Clave Pública** (Public Key): Puede estar expuesta en el frontend
   - **Clave Privada** (Private Key): DEBE estar solo en el backend
   - **Acceptance Token**: Token de aceptación de términos

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
# Clave pública de Wompi (puede estar en el frontend)
# Producción:
VITE_WOMPI_PUBLIC_KEY=pub_prod_4girIl1kpKyFJpOOPc92grI3hTfO9dje
# Sandbox (para pruebas):
# VITE_WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxxxxxxxxxxxxx

# URL de la API de Wompi
# Producción:
VITE_WOMPI_API_URL=https://production.wompi.co/v1
# Sandbox (para pruebas):
# VITE_WOMPI_API_URL=https://sandbox.wompi.co/v1
```

### 3. Ambiente de Pruebas (Sandbox)

Para probar la integración sin procesar pagos reales:

1. Usa las credenciales del ambiente de sandbox
2. Configura `VITE_WOMPI_API_URL=https://sandbox.wompi.co/v1`
3. Puedes usar números de prueba para Nequi y PSE según la documentación de Wompi

### 4. Configurar Webhooks (Backend)

**IMPORTANTE**: Los webhooks deben estar en tu backend, NO en el frontend.

Wompi enviará notificaciones a tu backend cuando:
- Una transacción sea aprobada
- Una transacción sea rechazada
- Una transacción cambie de estado

**URL del Webhook en Producción:**
```
https://qdahnzvrkqpaphncdvrn.supabase.co/functions/v1/wompi-webhook
```

**Configuración en Wompi:**
1. Ve a https://comercios.wompi.co/
2. Configuración → Webhooks
3. Agrega la URL del webhook
4. Selecciona el evento: `transaction.updated`

Para más detalles, consulta `WOMPI_PRODUCTION_SETUP.md`

### 5. Flujo de Pago

1. El usuario completa el formulario de reserva
2. Se redirige a la página de checkout
3. El usuario ingresa sus datos de contacto
4. Selecciona método de pago (PSE o Nequi)
5. Se crea una transacción en Wompi
6. El usuario es redirigido a la URL de pago de Wompi
7. Completa el pago en la plataforma de Wompi
8. Wompi redirige de vuelta a tu sitio
9. Tu backend recibe el webhook y actualiza el estado de la reserva

## Documentación Oficial

- Documentación de Wompi: https://docs.wompi.co/
- Panel de comercios: https://comercios.wompi.co/
- Soporte: https://wompi.co/contacto

## Notas Importantes

⚠️ **Seguridad**:
- La clave privada NUNCA debe estar en el frontend
- Los webhooks deben validarse usando la firma de Wompi
- Siempre valida las transacciones en tu backend antes de confirmar reservas

⚠️ **Fallback**:
- Si Wompi no está configurado o falla, el sistema redirige automáticamente a WhatsApp
- Esto asegura que los usuarios siempre puedan completar su reserva

## Solución de Problemas

### Error: "No se recibió URL de pago de Wompi"
- Verifica que las credenciales sean correctas
- Asegúrate de estar usando el ambiente correcto (sandbox vs producción)
- Revisa la consola del navegador para ver la respuesta completa de Wompi

### Error: "Configuración de Wompi no encontrada"
- Verifica que el archivo `.env` exista y tenga `VITE_WOMPI_PUBLIC_KEY`
- Reinicia el servidor de desarrollo después de crear/modificar `.env`

### El pago se procesa pero no se confirma la reserva
- Verifica que los webhooks estén configurados correctamente en tu backend
- Revisa los logs de tu servidor para ver si los webhooks están llegando

