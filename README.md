# Brand360™ - Identity Engine Pro

> Transforma conceptos abstractos en identidades de marca tangibles con IA

Brand360 es una aplicación web interactiva diseñada para emprendedores y creativos. Utiliza un flujo de trabajo de tres pasos para generar identidades de marca completas mediante inteligencia artificial.

## 🚀 Características

- **Naming**: Sugerencias de nombres comerciales basados en el sector
- **Slogans**: Frases de impacto que comunican la propuesta de valor
- **Concepto Visual**: Directrices sobre estilo, tipografía y sensaciones de diseño
- **Integración con IA**: Soporte para OpenAI GPT-4 y Google Gemini
- **Modo Demo**: Funciona sin API keys usando datos mock

## 📋 Requisitos Previos

- Node.js 18+ y npm/yarn/pnpm
- Cuenta de OpenAI o Google Gemini (opcional, para usar IA real)

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**

```bash
cd Brand360
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno (Opcional)**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Para usar OpenAI
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=tu_api_key_aqui

# O para usar Gemini
VITE_AI_PROVIDER=gemini
VITE_AI_API_KEY=tu_api_key_aqui

# O modo demo (sin API) - Por defecto
VITE_AI_PROVIDER=mock
```

## 🎯 Uso

### Modo Desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### Modo Producción Local

```bash
npm run build
npm run preview
```

## 🚀 Despliegue en Vercel

El proyecto está configurado para desplegarse fácilmente en Vercel. Consulta **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** para instrucciones detalladas.

### Despliegue Rápido:

1. **Desde GitHub** (Recomendado):
   - Sube tu código a GitHub
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio
   - Vercel detectará automáticamente la configuración

2. **Desde CLI**:
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. **Configurar Variables de Entorno en Vercel**:
   - Ve a Settings > Environment Variables
   - Añade `VITE_AI_PROVIDER` y `VITE_AI_API_KEY` (si usas IA real)

## 📖 Guía de Uso

### Paso 1: Configuración de la Idea

1. Ingresa la descripción de tu negocio/proyecto (mínimo 5 caracteres)
2. Añade keywords/valores presionando Enter (máximo 5)
3. Haz clic en "Generar Identidad"

### Paso 2: Selección de Identidad

1. Revisa las propuestas generadas por la IA
2. Cambia entre planes (Free, Basic, Premium, Pro) para ver diferentes opciones
3. Selecciona tu identidad favorita haciendo clic en la tarjeta
4. Haz clic en "Finalizar Branding"

### Paso 3: Lanzamiento

1. Visualiza tu identidad consolidada
2. Revisa el SEO Score y los assets generados
3. Descarga el Brand Kit completo (funcionalidad futura)
4. Reinicia el proceso si deseas crear otra marca

## 🔧 Configuración de APIs de IA

### OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea una nueva API key
3. Configura en `.env`:
   ```env
   VITE_AI_PROVIDER=openai
   VITE_AI_API_KEY=sk-...
   ```

### Google Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Configura en `.env`:
   ```env
   VITE_AI_PROVIDER=gemini
   VITE_AI_API_KEY=tu_api_key
   ```

## 🎨 Tecnologías Utilizadas

- **React 18**: Framework base
- **Vite**: Build tool y dev server
- **Tailwind CSS**: Estilos y diseño
- **Lucide React**: Iconos vectoriales
- **Google Fonts**: Inter y Noto Sans

## 📁 Estructura del Proyecto

```
Brand360/
├── src/
│   ├── components/
│   │   └── BrandAIModule.jsx    # Componente principal
│   ├── services/
│   │   └── aiService.js         # Servicio de integración con IA
│   ├── App.jsx                  # Componente raíz
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── index.html                   # HTML principal
├── package.json                 # Dependencias
├── vite.config.js              # Configuración de Vite
├── tailwind.config.js          # Configuración de Tailwind
└── README.md                   # Este archivo
```

## 🎨 Design Tokens

| Elemento | Token / Valor |
|----------|---------------|
| Color Primario | Yellow-400 (#FACC15) |
| Color Acento | Fuchsia-500 (#D946EF) |
| Fondo | Gradient from-white to yellow-50 |
| Bordes | 3xl (24px) para suavidad visual |
| Animación | fade-in, slide-in-from-bottom |

## 🔒 Seguridad

- **Nunca** subas tu archivo `.env` al repositorio
- Las API keys deben mantenerse privadas
- El proyecto incluye `.gitignore` para proteger archivos sensibles

## 📝 Notas Técnicas

- El componente utiliza un modelo de "Máquina de Estados" para gestionar la navegación
- Los datos mock se usan como fallback si la API falla o no está configurada
- El servicio de IA está diseñado para ser fácilmente extensible a otros proveedores

## 🐛 Troubleshooting

### La aplicación no genera identidades

1. Verifica que `.env` esté configurado correctamente
2. Si usas modo `mock`, debería funcionar sin API keys
3. Revisa la consola del navegador para errores

### Errores de CORS con APIs

- OpenAI y Gemini deberían funcionar desde el navegador
- Si tienes problemas, considera usar un proxy o backend intermedio

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o soporte, abre un issue en el repositorio.

---

**Brand360™** - Donde las ideas se vuelven marcas. ✨
