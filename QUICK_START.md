# 🚀 Quick start - Brand360

## Installation

```bash
npm install
```

## Modo Hugging Face (recomendado)

1. Copia `.env.example` a `.env` y añade tu API key:
   ```env
   VITE_AI_PROVIDER=huggingface
   HUGGING_FACE_API_KEY=hf_tu_clave
   ```

2. Ejecuta (usa `vercel dev` para que la API funcione):
   ```bash
   npm run dev:api
   ```

3. Abre `http://localhost:3000`

Ver `HUGGING_FACE.md` para más detalles.

## Modo demo (sin API)

```bash
npm run dev
```

La app usa datos mock por defecto si no configuras `.env`.

## 🔧 Configure real AI (optional)

### To use OpenAI:

1. Create a `.env` file in the project root:
```env
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=sk-tu-api-key-aqui
```

2. Get your API key at: https://platform.openai.com/api-keys

3. Restart the development server

### To use Google Gemini:

1. Create a `.env` file:
```env
VITE_AI_PROVIDER=gemini
VITE_AI_API_KEY=tu-api-key-aqui
```

2. Get your API key at: https://makersuite.google.com/app/apikey

3. Restart the development server

### To use Hugging Face (brand + slogan only, no logo):

1. Create a `.env` file:
```env
VITE_AI_PROVIDER=huggingface
```

2. In Vercel Dashboard → Project → Settings → Environment Variables, add:
   - `HUGGING_FACE_API_KEY` = your key from https://huggingface.co/settings/tokens

3. Run locally with `vercel dev` (not `npm run dev`) so the API works, or deploy to Vercel

## 📝 Basic usage

1. **Step 1**: Write your project description (minimum 5 characters)
2. **Step 2**: Add keywords by pressing Enter (maximum 5)
3. **Step 3**: Click on \"Generate identity\"
4. **Step 4**: Select your favorite identity
5. **Step 5**: View your consolidated brand

## 🐛 Common issues

**Error: "Cannot find module"**
- Run `npm install` again

**The app does not load**
- Check that port 3000 is available
- Check the browser console for errors

**Identities are not being generated**
- If you use mock mode, it should always work
- If you use an API, verify that `.env` is configured correctly
- Check that your API key is valid

## 📚 More information

See `README.md` for full documentation and `DOCUMENTACION_TECNICA.md` for technical details.
