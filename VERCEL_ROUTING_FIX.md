# Solución para el Error 404 en /admin/login

## Problema
La ruta `/admin/login` devuelve un error 404 NOT_FOUND en Vercel.

## Solución Implementada

Se ha actualizado el archivo `vercel.json` con la configuración correcta para proyectos Vite:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Pasos para Aplicar la Solución

### 1. Verificar que `vercel.json` esté en el repositorio

Asegúrate de que el archivo `vercel.json` esté en la raíz del proyecto y esté versionado en Git:

```bash
git add vercel.json
git commit -m "Fix: Configurar routing de Vercel para SPA"
git push
```

### 2. Verificar Configuración en Vercel Dashboard

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** → **General**
3. Verifica que:
   - **Framework Preset**: `Vite` (o se detecta automáticamente)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install` (o se detecta automáticamente)

### 3. Forzar un Nuevo Despliegue

Si el problema persiste después del push:

1. Ve a **Deployments** en el dashboard de Vercel
2. Haz clic en los tres puntos (⋯) del último despliegue
3. Selecciona **Redeploy**
4. O simplemente haz un nuevo push para activar un nuevo despliegue

### 4. Verificar que el Archivo se Desplegó

Después del despliegue, verifica que `vercel.json` esté presente:

1. Ve a **Deployments** → Selecciona el último despliegue
2. Ve a la pestaña **Source**
3. Verifica que `vercel.json` esté listado

## Verificación

Una vez desplegado, prueba acceder a:
- ✅ `https://www.hotelsionreal.com/admin/login` - Debe funcionar
- ✅ `https://www.hotelsionreal.com/pqrs` - Debe funcionar
- ✅ `https://www.hotelsionreal.com/checkout` - Debe funcionar

## Si el Problema Persiste

Si después de seguir estos pasos el problema continúa:

1. **Verifica los logs de build en Vercel**:
   - Ve a **Deployments** → Selecciona el despliegue → **Build Logs**
   - Busca errores relacionados con el build

2. **Verifica la configuración del proyecto**:
   - Asegúrate de que `package.json` tenga el script `build` correcto
   - Verifica que `vite.config.ts` esté configurado correctamente

3. **Contacta soporte de Vercel**:
   - Si nada funciona, contacta al soporte de Vercel con el ID del error

## Notas Importantes

- El archivo `vercel.json` debe estar en la **raíz del proyecto**
- No debe estar en `.gitignore`
- Después de hacer cambios, siempre haz commit y push
- Vercel detecta automáticamente cambios en el repositorio y redespliega

