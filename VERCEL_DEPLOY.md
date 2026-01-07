# 🚀 Guía de Despliegue en Vercel - Brand360

## Opción 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Subir el código a GitHub

1. Inicializa un repositorio Git (si no lo has hecho):
```bash
cd Brand360
git init
git add .
git commit -m "Initial commit - Brand360"
```

2. Crea un repositorio en GitHub y conéctalo:
```bash
git remote add origin https://github.com/tu-usuario/brand360.git
git branch -M main
git push -u origin main
```

### Paso 2: Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en **"Add New Project"**
3. Importa tu repositorio `brand360`
4. Vercel detectará automáticamente que es un proyecto Vite

### Paso 3: Configurar Variables de Entorno (Opcional)

Si quieres usar IA real en producción:

1. En la configuración del proyecto en Vercel, ve a **Settings > Environment Variables**
2. Añade las siguientes variables:
   - `VITE_AI_PROVIDER`: `openai` o `gemini` o `mock`
   - `VITE_AI_API_KEY`: Tu API key (si no usas modo mock)

3. Haz clic en **Save** y **Redeploy**

### Paso 4: Desplegar

1. Vercel desplegará automáticamente
2. Tu aplicación estará disponible en `https://tu-proyecto.vercel.app`
3. Cada push a `main` desplegará automáticamente

---

## Opción 2: Despliegue desde CLI de Vercel

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Iniciar sesión

```bash
vercel login
```

### Paso 3: Desplegar

Desde la carpeta del proyecto:

```bash
cd Brand360
vercel
```

Sigue las instrucciones:
- **Set up and deploy?** → `Y`
- **Which scope?** → Selecciona tu cuenta
- **Link to existing project?** → `N` (primera vez)
- **Project name?** → `brand360` (o el que prefieras)
- **Directory?** → `./` (presiona Enter)
- **Override settings?** → `N`

### Paso 4: Configurar Variables de Entorno (Opcional)

```bash
vercel env add VITE_AI_PROVIDER
# Ingresa: mock (o openai/gemini)

vercel env add VITE_AI_API_KEY
# Ingresa tu API key (si no usas mock)
```

### Paso 5: Desplegar a Producción

```bash
vercel --prod
```

---

## Opción 3: Despliegue desde Vercel Dashboard (Sin Git)

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Add New Project"**
3. Selecciona **"Upload"** en lugar de importar desde Git
4. Comprime la carpeta `Brand360` en un ZIP
5. Sube el ZIP
6. Vercel detectará automáticamente la configuración

---

## ⚙️ Configuración Automática

El archivo `vercel.json` ya está configurado con:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Framework: Vite
- ✅ Rewrites para SPA (Single Page Application)
- ✅ Headers de caché para assets

## 🔧 Variables de Entorno en Vercel

### Para Desarrollo (Preview)
- Ve a **Settings > Environment Variables**
- Añade variables con **Environment** = `Preview`

### Para Producción
- Añade las mismas variables con **Environment** = `Production`

### Variables Disponibles:
```
VITE_AI_PROVIDER=mock|openai|gemini
VITE_AI_API_KEY=tu_api_key_aqui
```

## 📝 Verificación Post-Despliegue

1. ✅ La aplicación carga correctamente
2. ✅ Los estilos de Tailwind se aplican
3. ✅ Las animaciones funcionan
4. ✅ El flujo de 3 pasos funciona
5. ✅ La generación de identidades funciona (mock o IA real)

## 🐛 Troubleshooting

### Error: "Build failed"
- Verifica que `package.json` tenga todos los scripts correctos
- Revisa los logs de build en Vercel Dashboard

### Error: "404 en rutas"
- Verifica que `vercel.json` tenga el rewrite configurado
- Asegúrate de que el `outputDirectory` sea `dist`

### Variables de entorno no funcionan
- Verifica que las variables empiecen con `VITE_`
- Haz un redeploy después de añadir variables
- Verifica que estén en el environment correcto (Production/Preview)

### Assets no cargan
- Verifica que los paths sean relativos
- Revisa la configuración de `base` en `vite.config.js` si es necesario

## 🔗 URLs Útiles

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentación Vercel**: https://vercel.com/docs
- **Documentación Vite**: https://vitejs.dev/guide/static-deploy.html#vercel

## ✨ Características del Despliegue

- ✅ **Deploy automático** en cada push a main
- ✅ **Preview deployments** para cada PR
- ✅ **HTTPS automático**
- ✅ **CDN global** para assets estáticos
- ✅ **Analytics** (opcional, requiere plan Pro)

---

**¡Tu aplicación Brand360 estará en línea en minutos!** 🎉
