# Guía de Configuración en Producción (Vercel)

## ✅ Variables de Entorno REQUERIDAS en Vercel

Ya configuraste estas variables. Verifica que estén así:

### 1. Supabase (REQUERIDO)
```
VITE_SUPABASE_URL=https://qdahnzvrkqpaphncdvrn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkYWhuenZya3FwYXBobmNkdnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3ODY5ODYsImV4cCI6MjA4MDM2Mjk4Nn0.Fd3DvT5NjU7EZIeIZo6Y2wsnUl0pjuLQ7n2NYdxcI9M
```

**Nota**: El código también acepta `VITE_SUPABASE_PUBLISHABLE_KEY`, pero `VITE_SUPABASE_ANON_KEY` funciona perfectamente.

## ⚙️ Variables Opcionales (Solo si las necesitas)

### 2. Wompi (OPCIONAL - Solo si usas pagos)

**✅ DEBE estar en Vercel (Frontend):**
```
VITE_WOMPI_PUBLIC_KEY=pub_prod_4girIl1kpKyFJpOOPc92grI3hTfO9dje
VITE_WOMPI_INTEGRITY_SECRET=prod_integrity_3vRVuKah6yxwUbyZ5hWDmnQTAtKzkWFf
```

**Nota**: `VITE_WOMPI_INTEGRITY_SECRET` es necesario para generar la firma de integridad requerida por el Web Checkout de Wompi.

**✅ También en Vercel (Frontend - para firma de integridad):**
```
VITE_WOMPI_INTEGRITY_SECRET=prod_integrity_3vRVuKah6yxwUbyZ5hWDmnQTAtKzkWFf
```

**❌ NO debe estar en Vercel (Solo Backend/Supabase Edge Functions):**
- `prv_prod_bS9ZNAR9vJZwUt7qYfZrPfqtbeAmWBCd` (Llave privada)
- `prod_events_sXSyd6KBdFytWv9mzco5XKRTR0T6lSSh` (Secreto de eventos)

**Nota**: 
- La llave pública (`pub_prod_...`) es segura para el frontend
- El secreto de integridad (`prod_integrity_...`) también puede estar en el frontend (se usa para generar la firma)
- La llave privada y el secreto de eventos SOLO van en Supabase Edge Functions (webhook)
- Si no usas pagos, no necesitas configurar estas variables

### 3. Admin Dashboard (OPCIONAL)
```
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=admin123
```
**Nota**: Si no configuras estas, usa los valores por defecto (admin/admin123).

## 📋 Pasos Siguientes

### 1. Verificar Variables en Vercel
1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Verifica que todas las variables requeridas estén configuradas
5. **IMPORTANTE**: Asegúrate de que estén configuradas para **Production**, **Preview** y **Development** (o al menos Production)

### 2. Hacer Redeploy
Después de agregar/cambiar variables de entorno, **DEBES hacer un redeploy**:

**Opción A: Desde Vercel Dashboard**
1. Ve a la pestaña **Deployments**
2. Encuentra el último deployment
3. Haz clic en los tres puntos (⋯) → **Redeploy**
4. Selecciona "Use existing Build Cache" o déjalo sin marcar para rebuild completo

**Opción B: Desde Git (Recomendado)**
```bash
# Hacer un pequeño cambio y hacer commit/push
git commit --allow-empty -m "Trigger redeploy for environment variables"
git push
```
Vercel detectará el cambio y hará un nuevo deploy automáticamente.

### 3. Verificar que Funciona
1. Ve a tu sitio en producción: https://www.hotelsionreal.com/
2. Abre la consola del navegador (F12 → Console)
3. Verifica que NO aparezca el error:
   ```
   Missing Supabase environment variables...
   ```
4. Prueba crear una reserva para verificar que Supabase funciona
5. Si tienes admin dashboard, prueba iniciar sesión

### 4. Verificar Base de Datos en Supabase
1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Ve a **Table Editor**
3. Verifica que existan las tablas necesarias (si no, ejecuta el script SQL)
4. Si no has ejecutado el schema, ve a **SQL Editor** y ejecuta `supabase/schema.sql`

## 🔍 Troubleshooting

### Error: "Missing Supabase environment variables"
- ✅ Verifica que las variables estén en Vercel (Settings → Environment Variables)
- ✅ Verifica que estén configuradas para "Production"
- ✅ Haz un redeploy después de agregar las variables
- ✅ Verifica que los nombres sean exactos (case-sensitive):
  - `VITE_SUPABASE_URL` (no `VITE_SUPABASE_URl`)
  - `VITE_SUPABASE_ANON_KEY` (no `VITE_SUPABASE_ANON`)

### Las variables no se aplican
- Las variables de entorno solo se aplican en nuevos deployments
- **DEBES hacer un redeploy** después de cambiar variables
- Si usas Git, haz push de un cambio para trigger un nuevo deploy

### Ver variables en el código compilado
- Las variables `VITE_*` se inyectan en el build
- Puedes verificar en el código fuente (Ctrl+U) que las variables estén presentes
- ⚠️ Las variables `VITE_*` son públicas y visibles en el código del cliente

## ✅ Checklist Final

- [ ] Variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` configuradas en Vercel
- [ ] Variables configuradas para "Production" (y opcionalmente Preview/Development)
- [ ] Redeploy realizado después de configurar variables
- [ ] Sitio funciona sin errores en consola
- [ ] Se pueden crear reservas (conexión a Supabase funciona)
- [ ] Base de datos configurada en Supabase (schema ejecutado)

## 🎉 ¡Listo!

Una vez completados estos pasos, tu sitio debería estar funcionando correctamente en producción.

