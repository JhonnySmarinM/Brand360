# Documentación Técnica: Brand360™

## 1. Visión General del Proyecto

Brand360 es una aplicación web interactiva diseñada para emprendedores y creativos. Utiliza un flujo de trabajo de tres pasos para transformar conceptos abstractos en identidades de marca tangibles, proporcionando:

- **Naming**: Sugerencias de nombres comerciales basados en el sector
- **Slogans**: Frases de impacto que comunican la propuesta de valor
- **Concepto Visual**: Directrices sobre estilo, tipografía y sensaciones de diseño

## 2. Arquitectura del Sistema

La aplicación está construida como una aplicación React moderna utilizando Vite como build tool, con un modelo de "Máquina de Estados" para gestionar la navegación entre las fases del proceso.

### Requisitos Previos

- **React.js 18+**: Framework base
- **Vite 5+**: Build tool y dev server
- **Tailwind CSS 3+**: Para el diseño visual y animaciones
- **Lucide React**: Biblioteca de iconos vectoriales
- **Google Fonts**: Inter y Noto Sans (recomendadas)

## 3. Desglose de Fases (User Flow)

### Paso 1: Configuración de la Idea (Idea Step)

El usuario ingresa la descripción del negocio y etiquetas de valor.

- **Validación**: Se requiere un mínimo de 5 caracteres en la descripción para habilitar la generación
- **Keywords**: Sistema de entrada dinámica que añade etiquetas al presionar Enter
- **Límite**: Máximo 5 keywords por proyecto

### Paso 2: Generación e Identidad (Identity Step)

Se presentan múltiples opciones de marca generadas por IA.

- **Segmentación por Planes**: Los resultados cambian dinámicamente según el nivel seleccionado (Free, Basic, Premium, Pro)
- **Interfaz de Selección**: Tarjetas con estados activos/inactivos para elegir la identidad favorita
- **Regeneración**: Cambiar de plan regenera las identidades automáticamente

### Paso 3: Lanzamiento y Board (Launch Step)

Visualización final del ADN de la marca.

- **Visualizador Hero**: Panel oscuro con efectos de iluminación (blur) para resaltar la marca
- **Meta-información**: Muestra el puntaje de coincidencia y etiquetas SEO
- **Acciones**: Opción para descargar Brand Kit y reiniciar el proceso

## 4. Guía de Estilos (Design Tokens)

| Elemento | Token / Valor |
|----------|---------------|
| Color Primario | Yellow-400 (#FACC15) |
| Color Acento | Fuchsia-500 (#D946EF) |
| Fondo | Gradient from-white to yellow-50 |
| Bordes | 3xl (24px) para suavidad visual |
| Animación | fade-in, slide-in-from-bottom |

## 5. Implementación de API

### Servicio de IA (`src/services/aiService.js`)

El servicio soporta tres modos de operación:

1. **Modo Mock** (por defecto): Usa datos predefinidos, no requiere API keys
2. **OpenAI**: Integración con GPT-4 Turbo
3. **Google Gemini**: Integración con Gemini Pro

### Configuración

Las variables de entorno se configuran en `.env`:

```env
VITE_AI_PROVIDER=mock|openai|gemini
VITE_AI_API_KEY=tu_api_key_aqui
```

### Estructura de Respuesta

El servicio espera que la IA responda con JSON en este formato:

```json
{
  "identities": [
    {
      "name": "Nombre de la marca",
      "slogan": "Slogan aquí",
      "concept": "Concepto visual aquí",
      "tags": ["Tag1", "Tag2", "Tag3"]
    }
  ]
}
```

### Manejo de Errores

- Si la API falla, el sistema automáticamente usa datos mock como fallback
- Los errores se registran en la consola para debugging
- La experiencia del usuario no se interrumpe

## 6. Componentes Principales

### BrandAIModule (`src/components/BrandAIModule.jsx`)

Componente principal que gestiona todo el flujo de la aplicación.

**Estados principales:**
- `step`: Controla la fase actual (1, 2, o 3)
- `projectDesc`: Descripción del proyecto
- `keywords`: Array de palabras clave
- `selectedPlan`: Plan seleccionado (free, basic, premium, pro)
- `selectedIdentity`: Identidad seleccionada por el usuario
- `identities`: Array de identidades generadas
- `loading`: Estado de carga

**Métodos principales:**
- `handleGenerate()`: Inicia la generación de identidades
- `handlePlanChange()`: Cambia el plan y regenera identidades
- `handleKeywordAdd()`: Añade keywords al array
- `removeKeyword()`: Elimina un keyword específico

## 7. Instrucciones de Despliegue

### Desarrollo Local

```bash
npm install
npm run dev
```

### Producción

```bash
npm run build
npm run preview
```

### Variables de Entorno

1. Copia `.env.example` a `.env`
2. Configura `VITE_AI_PROVIDER` y `VITE_AI_API_KEY`
3. Reinicia el servidor de desarrollo

## 8. Extensibilidad

### Añadir Nuevo Proveedor de IA

1. Añade el caso en `aiService.js`:

```javascript
case 'nuevo_proveedor':
  return await generateWithNuevoProveedor(prompt, plan);
```

2. Implementa la función:

```javascript
const generateWithNuevoProveedor = async (prompt, plan) => {
  // Lógica de integración
  const response = await fetch('...');
  // Procesar respuesta
  return parsed.identities;
};
```

3. Actualiza la documentación

### Personalizar Estilos

Los estilos se pueden personalizar en:
- `tailwind.config.js`: Configuración de Tailwind
- `src/index.css`: Estilos globales
- Componentes: Clases de Tailwind inline

## 9. Optimizaciones

- **Lazy Loading**: Los componentes se cargan bajo demanda
- **Memoización**: Los datos mock se generan una sola vez
- **Error Boundaries**: Manejo robusto de errores
- **Responsive Design**: Diseño adaptativo para móviles y desktop

## 10. Testing (Futuro)

Estructura recomendada para tests:

```
src/
├── components/
│   └── __tests__/
│       └── BrandAIModule.test.jsx
└── services/
    └── __tests__/
        └── aiService.test.js
```

## 11. Roadmap

- [ ] Integración con más proveedores de IA
- [ ] Exportación de Brand Kit (PDF, SVG)
- [ ] Historial de identidades generadas
- [ ] Sistema de favoritos
- [ ] Compartir identidades en redes sociales
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)

---

**Documento de Referencia Técnica - Brand360 System v1.0**
