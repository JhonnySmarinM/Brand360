/**
 * AI service for Brand360
 * Genera solo brand name y slogan (sin logo).
 * Providers: OpenAI, Google Gemini, Hugging Face, o mock
 * Keys centralizadas en config/AiModel.js
 */

import { AI_PROVIDER, API_KEY, API_BASE } from '../../config/AiModel.js';

/**
 * Generates brand identities (name, slogan, concept, tags) - NO logo
 */
export const generateBrandIdentities = async (projectDesc, keywords, plan = 'premium') => {
  if (AI_PROVIDER === 'mock') {
    return generateMockIdentities(plan);
  }

  try {
    const prompt = buildPrompt(projectDesc, keywords, plan);

    switch (AI_PROVIDER) {
      case 'openai':
        return await generateWithOpenAI(prompt, plan);
      case 'gemini':
        return await generateWithGemini(prompt, plan);
      case 'huggingface':
        return await generateWithHuggingFace(prompt, plan);
      default:
        return generateMockIdentities(plan);
    }
  } catch (error) {
    console.error('Error generando identidades:', error);
    return generateMockIdentities(plan);
  }
};

/**
 * Builds the prompt for the AI
 */
const buildPrompt = (projectDesc, keywords, plan) => {
  const keywordList = keywords.join(', ');
  const planContext = {
    free: 'one basic and simple proposal',
    basic: 'two creative and differentiated proposals',
    premium: 'three sophisticated and professional proposals',
    pro: 'three high-end, premium proposals'
  };

  return `You are an expert in branding and brand identity creation. Create ${planContext[plan]} that are DIFFERENT from each other in style, tone, and approach. Each proposal must be unique and surprising—avoid generic or repeated ideas.

Project description: ${projectDesc}
Values/Keywords: ${keywordList}

IMPORTANT: Generate FRESH, ORIGINAL ideas. Vary the style: one proposal could be minimal, another bold, another elegant. Use different languages or tones. Never repeat Zenith, Nexus, Kinetix, Lumina, Vortex, Origen, Aethel, Quark, or Obsidian.

For each identity, provide:
1. Brand name (creative, memorable, unique)
2. Slogan (short and powerful phrase)
3. Visual concept (style, typography, design feelings)
4. Tags (2-3 keywords)

Respond ONLY with valid JSON, no extra text:
{
  "identities": [
    {
      "name": "UniqueName",
      "slogan": "Your slogan",
      "concept": "Visual concept",
      "tags": ["Tag1", "Tag2"]
    }
  ]
}`;
};

/**
 * Generates identities using OpenAI API
 */
const generateWithOpenAI = async (prompt, plan) => {
  if (!API_KEY) {
    throw new Error('VITE_AI_API_KEY no configurada para OpenAI');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a branding expert. Respond ONLY with valid JSON, without any extra text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error.message || 'OpenAI API error');
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Respuesta vacía de OpenAI');
  return parseIdentitiesFromContent(content, plan);
};

/**
 * Generates identities using Google Gemini API
 */
const generateWithGemini = async (prompt, plan) => {
  if (!API_KEY) {
    throw new Error('VITE_AI_API_KEY no configurada para Gemini');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error.message || 'Gemini API error');
  const candidates = data.candidates;
  if (!candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Respuesta vacía de Gemini');
  }
  const content = candidates[0].content.parts[0].text;
  return parseIdentitiesFromContent(content, plan);
};

/**
 * Generates identities using Hugging Face API (via serverless)
 * Solo texto: brand + slogan. Sin logo.
 */
const generateWithHuggingFace = async (prompt, plan) => {
  const base = (API_BASE || '').replace(/\/$/, '');
  const url = base ? `${base}/api/generateBrand` : '/api/generateBrand';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, plan })
  });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('API no disponible. Usa "npm run dev:api" para Hugging Face.');
  }
  const data = await response.json();
  if (!response.ok) {
    if (data.identities?.length) return data.identities;
    throw new Error(data.error || `Hugging Face API: ${response.statusText}`);
  }
  if (data.identities) return data.identities;
  if (data.brandName && data.slogan) {
    return [{
      name: data.brandName,
      slogan: data.slogan,
      concept: data.logoDescription || '',
      tags: data.tags || []
    }];
  }
  return generateMockIdentities(plan);
};

/** Extrae y valida identities desde el texto de respuesta */
const parseIdentitiesFromContent = (content, plan) => {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return generateMockIdentities(plan);
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    const identities = parsed.identities;
    if (!Array.isArray(identities) || identities.length === 0) return generateMockIdentities(plan);
    return identities.map((id) => ({
      name: id.name || 'Brand',
      slogan: id.slogan || '',
      concept: id.concept || '',
      tags: Array.isArray(id.tags) ? id.tags : []
    }));
  } catch {
    return generateMockIdentities(plan);
  }
};

/**
 * Generates mock identities (demo mode)
 */
const generateMockIdentities = (plan) => {
  const mockData = {
    free: [
      { 
        name: "Lumina", 
        slogan: "Brilliance in every step.", 
        concept: "Swiss minimalism, Neo-Grotesk typography.", 
        tags: ["Modern", "Light"] 
      }
    ],
    basic: [
      { 
        name: "Vortex", 
        slogan: "Driving tomorrow forward.", 
        concept: "Cyberpunk style, neon gradients.", 
        tags: ["Energy", "Tech"] 
      },
      { 
        name: "Origen", 
        slogan: "Naturally pure.", 
        concept: "Organic aesthetics, earthy tones.", 
        tags: ["Eco", "Pure"] 
      }
    ],
    premium: [
      { 
        name: "Zenith", 
        slogan: "Reach the unreachable.", 
        concept: "Geometric luxury, midnight blue and gold.", 
        tags: ["Elite", "Pinnacle"] 
      },
      { 
        name: "Nexus", 
        slogan: "Conexiones que importan.", 
        concept: "Redes abstractas, gradientes violetas.", 
        tags: ["Red", "Futuro"] 
      },
      { 
        name: "Kinetix", 
        slogan: "Movement without limits.", 
        concept: "Speed lines, Italic Heavy typography.", 
        tags: ["Agility", "Pro"] 
      }
    ],
    pro: [
      { 
        name: "Aethel", 
        slogan: "Legacy in evolution.", 
        concept: "Modern classic serif, wide spacing.", 
        tags: ["Luxury", "Heritage"] 
      },
      { 
        name: "Quark", 
        slogan: "Small but mighty impact.", 
        concept: "Bauhaus architecture, primary colors.", 
        tags: ["Science", "Pop"] 
      },
      { 
        name: "Obsidian", 
        slogan: "Strength in silence.", 
        concept: "Monochrome, stone textures.", 
        tags: ["Power", "Solid"] 
      }
    ]
  };

  return mockData[plan] || mockData.premium;
};

export default {
  generateBrandIdentities
};
