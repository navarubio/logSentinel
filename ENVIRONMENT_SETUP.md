# Configuración de Variables de Entorno

Este proyecto utiliza la API de Google Gemini AI y requiere configuración de variables de entorno para funcionar correctamente.

## Desarrollo Local

Las variables de entorno para desarrollo local están configuradas en el archivo `.env` (no incluido en el repositorio por seguridad).

Para configurar el desarrollo local:

1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega la siguiente variable:
```
GEMINI_API_KEY=tu_api_key_aqui
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

## Despliegue en Vercel

Para configurar las variables de entorno en Vercel:

### Método 1: Dashboard de Vercel
1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Navega a Settings > Environment Variables
3. Agrega las siguientes variables:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyDraVm9tJXOXmhXDAtz9r-Lr5h7BqlV_fw`
   - **Environments**: Production, Preview, Development

### Método 2: Vercel CLI
```bash
vercel env add GEMINI_API_KEY production
# Pega tu API key cuando se solicite
```

### Método 3: Archivo vercel.json (NO RECOMENDADO para producción)
```json
{
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

## Variables de Entorno Utilizadas

- `GEMINI_API_KEY`: Clave de API para acceder a Google Gemini AI
- `VITE_GEMINI_API_KEY`: Variable alternativa para Vite (desarrollo)

## Seguridad

- ✅ El archivo `.env` está incluido en `.gitignore`
- ✅ Las variables se manejan de forma segura en el código
- ✅ Se incluye manejo de errores cuando la API key no está disponible
- ✅ Las variables son específicas del entorno (desarrollo/producción)

## Troubleshooting

Si ves errores relacionados con la API key:

1. Verifica que la variable esté configurada en Vercel
2. Asegúrate de que el nombre sea exactamente `GEMINI_API_KEY`
3. Redespliega el proyecto después de agregar la variable
4. Revisa los logs de Vercel para errores específicos

## Comandos útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Despliegue con Vercel CLI
vercel --prod
```