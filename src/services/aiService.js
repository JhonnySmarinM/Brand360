/**
 * Servicio de IA para Brand360
 * Soporta múltiples proveedores: OpenAI, Google Gemini, o modo mock
 */

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'mock'; // 'openai', 'gemini', 'mock'
const API_KEY = import.meta.env.VITE_AI_API_KEY || '';

/**
 * Genera identidades de marca usando IA
 * @param {string} projectDesc - Descripción del proyecto
 * @param {Array<string>} keywords - Palabras clave/valores
 * @param {string} plan - Plan seleccionado (free, basic, premium, pro)
 * @returns {Promise<Array>} Array de identidades generadas
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
 * Construye el prompt para la IA
 */
const buildPrompt = (projectDesc, keywords, plan) => {
  const keywordList = keywords.join(', ');
  const planContext = {
    free: 'una propuesta básica y simple',
    basic: 'dos propuestas creativas y diferenciadas',
    premium: 'tres propuestas sofisticadas y profesionales',
    pro: 'tres propuestas de lujo y alta gama'
  };

  return `Eres un experto en branding y creación de identidades de marca. 
Crea ${planContext[plan]} para el siguiente proyecto:

Descripción: ${projectDesc}
Valores/Keywords: ${keywordList}

Para cada identidad, proporciona:
1. Nombre comercial (creativo, memorable, único)
2. Slogan (frase corta y poderosa que comunique la propuesta de valor)
3. Concepto Visual (descripción del estilo, tipografía, sensaciones de diseño)
4. Tags (2-3 palabras clave que definan la identidad)

Responde SOLO con un JSON válido en este formato:
{
  "identities": [
    {
      "name": "Nombre",
      "slogan": "Slogan aquí",
      "concept": "Concepto visual aquí",
      "tags": ["Tag1", "Tag2"]
    }
  ]
}`;
};

/**
 * Genera identidades usando OpenAI API
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
          content: 'Eres un experto en branding. Responde SOLO con JSON válido, sin texto adicional.'
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
 * Genera identidades usando Google Gemini API
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
 * Genera identidades mock (modo demo)
 */
const generateMockIdentities = (plan) => {
  const mockData = {
    free: [
      { 
        name: "Lumina", 
        slogan: "Brillantez en cada paso.", 
        concept: "Minimalismo suizo, tipografía Neo-Grotesk.", 
        tags: ["Moderno", "Luz"] 
      }
    ],
    basic: [
      { 
        name: "Vortex", 
        slogan: "Impulsando el mañana.", 
        concept: "Estilo Cyberpunk, degradados neón.", 
        tags: ["Energía", "Tech"] 
      },
      { 
        name: "Origen", 
        slogan: "Naturalmente puro.", 
        concept: "Estética orgánica, tonos tierra.", 
        tags: ["Eco", "Puro"] 
      }
    ],
    premium: [
      { 
        name: "Zenith", 
        slogan: "Alcanza lo inalcanzable.", 
        concept: "Lujo geométrico, azul medianoche y oro.", 
        tags: ["Elite", "Cúspide"] 
      },
      { 
        name: "Nexus", 
        slogan: "Conexiones que importan.", 
        concept: "Redes abstractas, gradientes violetas.", 
        tags: ["Red", "Futuro"] 
      },
      { 
        name: "Kinetix", 
        slogan: "Movimiento sin límites.", 
        concept: "Líneas de velocidad, tipografía Italic Heavy.", 
        tags: ["Agilidad", "Pro"] 
      }
    ],
    pro: [
      { 
        name: "Aethel", 
        slogan: "Legado en evolución.", 
        concept: "Serif clásica moderna, espaciado amplio.", 
        tags: ["Lujo", "Historia"] 
      },
      { 
        name: "Quark", 
        slogan: "Pequeño gran impacto.", 
        concept: "Arquitectura Bauhaus, colores primarios.", 
        tags: ["Ciencia", "Pop"] 
      },
      { 
        name: "Obsidian", 
        slogan: "Fuerza en el silencio.", 
        concept: "Monocromático, texturas de piedra.", 
        tags: ["Poder", "Sólido"] 
      }
    ]
  };

  return mockData[plan] || mockData.premium;
};

export default {
  generateBrandIdentities
};
