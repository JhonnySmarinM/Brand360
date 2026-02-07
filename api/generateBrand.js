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

  if (!apiKey) {
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

    const chatResult = await hf.chatCompletion({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.95
    });
    const text = chatResult.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(200).json({
        error: 'No se pudo extraer JSON',
        identities: getFallbackIdentities(plan)
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const identities = parsed.identities;
    if (!Array.isArray(identities) || identities.length === 0) {
      return res.status(200).json({
        identities: getFallbackIdentities(plan)
      });
    }

    const normalized = identities.map((id) => ({
      name: id.name || 'Brand',
      slogan: id.slogan || '',
      concept: id.concept || '',
      tags: Array.isArray(id.tags) ? id.tags : []
    }));

    return res.status(200).json({ identities: normalized });
  } catch (error) {
    console.error('Hugging Face error:', error);
    return res.status(200).json({
      error: error.message || 'Error generando identidades',
      identities: getFallbackIdentities(plan)
    });
  }
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
