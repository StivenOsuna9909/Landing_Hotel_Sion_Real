# Configuración de Variables de Entorno

## Archivo .env

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://qdahnzvrkqpaphncdvrn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_V5cU9VGq9e1XIFVsJ3_4uQ_t7CcFmvA

# Wompi Configuration (Opcional - para pagos reales)
VITE_WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxxxxxxxxxxxxx
VITE_WOMPI_API_URL=https://sandbox.wompi.co/v1

# Admin Credentials (Opcional)
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=admin123
```

## Claves de Supabase

### Publishable Key (Frontend)
- **Clave proporcionada**: `sb_publishable_V5cU9VGq9e1XIFVsJ3_4uQ_t7CcFmvA`
- **Uso**: Segura para usar en el frontend
- **Variable**: `VITE_SUPABASE_PUBLISHABLE_KEY`
- ✅ **Esta es la clave que debes usar en el frontend**

### Secret Key (Backend - NO usar en frontend)
- **Clave proporcionada**: `sb_secret_ErXunQ-xHHNPgkYqiIMb4Q_NhxaGTxA`
- **Uso**: SOLO para backend, scripts, Edge Functions
- ⚠️ **NUNCA** la uses en el frontend
- ⚠️ **NUNCA** la subas a Git

## Pasos de Configuración

1. **Crea el archivo `.env`** en la raíz del proyecto:
   ```bash
   # En la raíz del proyecto
   touch .env
   ```

2. **Agrega las variables** (copia el contenido de arriba)

3. **Ejecuta el SQL en Supabase**:
   - Ve a SQL Editor en tu proyecto de Supabase
   - Copia y pega el contenido de `supabase/schema.sql`
   - Ejecuta el script

4. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```

## Verificación

Para verificar que todo funciona:

1. Abre la consola del navegador (F12)
2. Intenta crear una reserva desde el checkout
3. Verifica que no haya errores relacionados con Supabase
4. Revisa en el dashboard que las reservas aparezcan

## Seguridad

✅ **Seguro para el frontend**:
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Puede estar expuesta
- `VITE_SUPABASE_URL` - Puede estar expuesta

❌ **NUNCA en el frontend**:
- `sb_secret_*` - Solo para backend
- Contraseñas de base de datos
- Claves privadas de servicios

## Notas

- El archivo `.env` ya está en `.gitignore`, así que no se subirá a Git
- Las variables que empiezan con `VITE_` son expuestas al frontend
- Reinicia el servidor después de cambiar las variables de entorno

