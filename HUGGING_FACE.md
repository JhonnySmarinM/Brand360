# Brand360 con Hugging Face

## 1. Configuración

1. Copia el ejemplo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

2. Edita `.env` y añade tu API key de Hugging Face:
   ```env
   VITE_AI_PROVIDER=huggingface
   HUGGING_FACE_API_KEY=hf_tu_clave_aqui
   ```

3. Obtén tu API key en: https://huggingface.co/settings/tokens  
   (Necesitas una cuenta gratuita)

## 2. Ejecutar en local

**Importante:** Hugging Face usa una API serverless. Debes usar `vercel dev` (no `npm run dev`):

```bash
npm run dev:api
```

O directamente:

```bash
vercel dev
```

Si no tienes Vercel CLI:
```bash
npm i -g vercel
```

La app se abrirá en `http://localhost:3000` y la ruta `/api/generateBrand` funcionará.

## 3. Uso

1. Escribe la descripción de tu proyecto (mín. 5 caracteres)
2. Añade keywords con Enter (máx. 5)
3. Pulsa **Generate identity**
4. La IA de Hugging Face (Mistral) generará nombres y slogans de marca

## 4. Despliegue en Vercel

1. Sube el proyecto a Vercel
2. En **Settings → Environment Variables** añade:
   - `VITE_AI_PROVIDER` = `huggingface`
   - `HUGGING_FACE_API_KEY` = tu clave
3. Redeploy
