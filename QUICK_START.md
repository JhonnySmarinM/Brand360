# 🚀 Inicio Rápido - Brand360

## Instalación en 3 Pasos

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

### 3. Abrir en el Navegador
La aplicación se abrirá automáticamente en `http://localhost:3000`

## ✅ ¡Listo!

La aplicación funciona en **modo demo** por defecto (sin necesidad de API keys).

## 🔧 Configurar IA Real (Opcional)

### Para usar OpenAI:

1. Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=sk-tu-api-key-aqui
```

2. Obtén tu API key en: https://platform.openai.com/api-keys

3. Reinicia el servidor de desarrollo

### Para usar Google Gemini:

1. Crea un archivo `.env`:
```env
VITE_AI_PROVIDER=gemini
VITE_AI_API_KEY=tu-api-key-aqui
```

2. Obtén tu API key en: https://makersuite.google.com/app/apikey

3. Reinicia el servidor de desarrollo

## 📝 Uso Básico

1. **Paso 1**: Escribe la descripción de tu proyecto (mínimo 5 caracteres)
2. **Paso 2**: Añade keywords presionando Enter (máximo 5)
3. **Paso 3**: Haz clic en "Generar Identidad"
4. **Paso 4**: Selecciona tu identidad favorita
5. **Paso 5**: Visualiza tu marca consolidada

## 🐛 Problemas Comunes

**Error: "Cannot find module"**
- Ejecuta `npm install` nuevamente

**La aplicación no carga**
- Verifica que el puerto 3000 esté disponible
- Revisa la consola del navegador para errores

**Las identidades no se generan**
- Si usas modo mock, debería funcionar siempre
- Si usas API, verifica que `.env` esté configurado correctamente
- Revisa que tu API key sea válida

## 📚 Más Información

Consulta `README.md` para documentación completa y `DOCUMENTACION_TECNICA.md` para detalles técnicos.
