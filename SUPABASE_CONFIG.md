# Configuración de Supabase - Hotel Sion Real

## Para el Frontend (React)

El frontend usa la **API REST de Supabase**, no la conexión directa de PostgreSQL.

### Variables de Entorno Necesarias

Crea un archivo `.env` en la raíz del proyecto:

```env
# URL de tu proyecto Supabase (no la conexión directa)
VITE_SUPABASE_URL=https://qdahnzvrkqpaphncdvrn.supabase.co

# API Key Anónima (anon key)
# Encuéntrala en: Settings > API > Project API keys > anon public
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Dónde encontrar la Anon Key

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **Settings** > **API**
3. En **Project API keys**, copia la clave **anon public**

## Conexión Directa de PostgreSQL

La conexión directa que proporcionaste:
```
postgresql://postgres:goril4*.@db.qdahnzvrkqpaphncdvrn.supabase.co:5432/postgres
```

**NO se usa en el frontend**. Esta conexión es para:

- ✅ Scripts de backend
- ✅ Migraciones de base de datos
- ✅ Herramientas de administración (pgAdmin, DBeaver, etc.)
- ✅ Edge Functions de Supabase
- ✅ Servicios backend (Node.js, Python, etc.)

### Uso de la Conexión Directa

Si necesitas usar la conexión directa (por ejemplo, en un backend), puedes hacerlo así:

#### Node.js (con pg)
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:goril4*.@db.qdahnzvrkqpaphncdvrn.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
```

#### Python (con psycopg2)
```python
import psycopg2

conn = psycopg2.connect(
    "postgresql://postgres:goril4*.@db.qdahnzvrkqpaphncdvrn.supabase.co:5432/postgres"
)
```

⚠️ **IMPORTANTE**: 
- **NUNCA** expongas esta conexión en el frontend
- **NUNCA** la subas a Git
- Úsala solo en entornos seguros (backend, scripts locales)

## Configuración Actual del Proyecto

El proyecto ya está configurado para usar la API REST de Supabase:

- ✅ Cliente configurado en `src/lib/supabase.ts`
- ✅ Servicio de reservas usando Supabase en `src/services/reservations.ts`
- ✅ Todas las operaciones son seguras y usan RLS (Row Level Security)

## Pasos para Completar la Configuración

1. **Obtén la Anon Key**:
   - Dashboard de Supabase > Settings > API > anon public key

2. **Crea el archivo `.env`**:
   ```env
   VITE_SUPABASE_URL=https://qdahnzvrkqpaphncdvrn.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

3. **Ejecuta el SQL**:
   - Ve a SQL Editor en Supabase
   - Copia y pega el contenido de `supabase/schema.sql`
   - Ejecuta el script

4. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```

## Verificación

Para verificar que todo funciona:

1. Intenta crear una reserva desde el checkout
2. Verifica en el dashboard que la reserva aparezca
3. Revisa en Supabase Dashboard > Table Editor > reservations que la reserva se haya guardado

## Seguridad

- ✅ El frontend usa la **anon key** que es segura para exponer
- ✅ Las políticas RLS protegen los datos
- ✅ La conexión directa de PostgreSQL NO está expuesta
- ✅ Todas las operaciones pasan por las políticas de seguridad

