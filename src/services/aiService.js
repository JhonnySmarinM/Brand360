/**
 * AI service for Brand360
 * Supports multiple providers: OpenAI, Google Gemini, or mock mode
 */

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'mock'; // 'openai', 'gemini', 'mock'
const API_KEY = import.meta.env.VITE_AI_API_KEY || '';

/**
 * Generates brand identities using AI
 * @param {string} projectDesc - Project description
 * @param {Array<string>} keywords - Keywords/values
 * @param {string} plan - Selected plan (free, basic, premium, pro)
 * @returns {Promise<Array>} Array of generated identities
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
      default:
        return generateMockIdentities(plan);
    }
  } catch (error) {
    console.error('Error generando identidades:', error);
    // Fallback a datos mock en caso de error
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

  return `You are an expert in branding and brand identity creation.
Create ${planContext[plan]} for the following project:

Description: ${projectDesc}
Values/Keywords: ${keywordList}

For each identity, provide:
1. Brand name (creative, memorable, unique)
2. Slogan (short and powerful phrase that communicates the value proposition)
3. Visual concept (description of style, typography, and design feelings)
4. Tags (2-3 keywords that define the identity)

Respond ONLY with valid JSON in this format:
{
  "identities": [
    {
      "name": "Name",
      "slogan": "Slogan here",
      "concept": "Visual concept here",
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
  const content = data.choices[0].message.content;
  
  // Extraer JSON de la respuesta
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.identities || generateMockIdentities(plan);
  }

  return generateMockIdentities(plan);
};

/**
 * Generates identities using Google Gemini API
 */
const generateWithGemini = async (prompt, plan) => {
  if (!API_KEY) {
    throw new Error('VITE_AI_API_KEY no configurada para Gemini');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
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
  const content = data.candidates[0].content.parts[0].text;
  
  // Extraer JSON de la respuesta
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.identities || generateMockIdentities(plan);
  }

  return generateMockIdentities(plan);
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
