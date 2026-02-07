/**
 * Brand360 - Configuración centralizada de modelos de IA
 * Las keys se leen de variables de entorno (.env)
 *
 * DÓNDE PONER LAS KEYS:
 * - Crea un archivo .env en la raíz del proyecto
 * - NUNCA subas .env a git (ya está en .gitignore)
 *
 * Variables usadas:
 * - VITE_AI_PROVIDER, VITE_AI_API_KEY, VITE_API_URL (frontend)
 * - HUGGING_FACE_API_KEY, GEMINI_API_KEY (API serverless)
 */

const getEnv = (key, def = '') => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env?.[key]) {
      return import.meta.env[key];
    }
  } catch (_) {}
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }
  return def;
};

/** Provider: 'mock' | 'openai' | 'gemini' | 'huggingface' */
export const AI_PROVIDER = getEnv('VITE_AI_PROVIDER', 'mock');

/** API Key para OpenAI o Gemini (frontend) */
export const API_KEY = getEnv('VITE_AI_API_KEY', '');

/** URL base para API. Vacío = rutas relativas /api/... */
export const API_BASE = getEnv('VITE_API_URL', '');
