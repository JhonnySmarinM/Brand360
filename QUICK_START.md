# 🚀 Quick start - Brand360

## Installation in 3 steps

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

### 3. Open in the browser
The app will automatically open at `http://localhost:3000`

## ✅ All set!

The app runs in **demo mode** by default (no API keys required).

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
