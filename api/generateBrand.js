/**
 * Vercel Serverless - Hugging Face
 * Genera solo brand name y slogan (sin logo)
 * Key: HUGGING_FACE_API_KEY en .env o Vercel Environment Variables
 */

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, plan = 'premium' } = req.body || {};
  const apiKey = (process.env.HUGGING_FACE_API_KEY || '').trim();

  console.log('[generateBrand] Request recibido:', { plan, promptLength: prompt?.length });

  if (!apiKey) {
    console.log('[generateBrand] FALLO: HUGGING_FACE_API_KEY no configurada → usando fallback');
    return res.status(200).json({
      error: 'HUGGING_FACE_API_KEY no configurada',
      identities: getFallbackIdentities(plan)
    });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'Se requiere prompt' });
  }

  try {
    const { InferenceClient } = await import('@huggingface/inference');
    const hf = new InferenceClient(apiKey);
    const model = process.env.HUGGING_FACE_MODEL || 'meta-llama/Llama-3.1-8B-Instruct';
    console.log('[generateBrand] Llamando a Hugging Face, modelo:', model);

    const chatResult = await hf.chatCompletion({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.95
    });
    const text = chatResult.choices?.[0]?.message?.content || '';
    console.log('[generateBrand] Respuesta Hugging Face OK, longitud texto:', text.length);

    const jsonStr = extractJsonObject(text);
    if (!jsonStr) {
      console.log('[generateBrand] FALLO: No se pudo extraer JSON del modelo → usando fallback. Texto (primeros 200 chars):', text.slice(0, 200));
      return res.status(200).json({
        error: 'No se pudo extraer JSON',
        identities: getFallbackIdentities(plan)
      });
    }

    const parsed = JSON.parse(jsonStr);
    const identities = parsed.identities;
    if (!Array.isArray(identities) || identities.length === 0) {
      console.log('[generateBrand] FALLO: identities vacío o inválido → usando fallback');
      return res.status(200).json({
        identities: getFallbackIdentities(plan)
      });
    }

    console.log('[generateBrand] OK: Modelo generó identidades:', identities.map((i) => i.name));
    const normalized = identities.map((id) => ({
      name: id.name || 'Brand',
      slogan: id.slogan || '',
      concept: id.concept || '',
      tags: Array.isArray(id.tags) ? id.tags : []
    }));

    return res.status(200).json({ identities: normalized });
  } catch (error) {
    console.error('[generateBrand] Error Hugging Face → usando fallback:', error.message, error);
    return res.status(200).json({
      error: error.message || 'Error generando identidades',
      identities: getFallbackIdentities(plan)
    });
  }
}

/**
 * Extrae el primer objeto JSON válido del texto (maneja markdown, texto extra, etc.)
 */
function extractJsonObject(text) {
  if (!text || typeof text !== 'string') return null;

  // 1. Intentar extraer de bloque ```json ... ```
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    const candidate = codeBlock[1].trim();
    const obj = extractFirstJsonObject(candidate);
    if (obj) return obj;
  }

  // 2. Buscar primer objeto JSON completo por coincidencia de llaves
  return extractFirstJsonObject(text);
}

function extractFirstJsonObject(str) {
  const start = str.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;
  let quote = null;

  for (let i = start; i < str.length; i++) {
    const c = str[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (c === '\\') escape = true;
      else if (c === quote) inString = false;
      continue;
    }
    if (c === '"' || c === "'") {
      inString = true;
      quote = c;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        const jsonStr = str.slice(start, i + 1);
        try {
          JSON.parse(jsonStr);
          return jsonStr;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function getFallbackIdentities(plan) {
  const fallback = {
    free: [{ name: 'Lumina', slogan: 'Brilliance in every step.', concept: '', tags: ['Modern'] }],
    basic: [
      { name: 'Vortex', slogan: 'Driving tomorrow forward.', concept: '', tags: ['Energy'] },
      { name: 'Origen', slogan: 'Naturally pure.', concept: '', tags: ['Eco'] }
    ],
    premium: [
      { name: 'Zenith', slogan: 'Reach the unreachable.', concept: '', tags: ['Elite'] },
      { name: 'Nexus', slogan: 'Conexiones que importan.', concept: '', tags: ['Red'] },
      { name: 'Kinetix', slogan: 'Movement without limits.', concept: '', tags: ['Pro'] }
    ],
    pro: [
      { name: 'Aethel', slogan: 'Legacy in evolution.', concept: '', tags: ['Luxury'] },
      { name: 'Quark', slogan: 'Small but mighty impact.', concept: '', tags: ['Science'] },
      { name: 'Obsidian', slogan: 'Strength in silence.', concept: '', tags: ['Power'] }
    ]
  };
  return fallback[plan] || fallback.premium;
}
