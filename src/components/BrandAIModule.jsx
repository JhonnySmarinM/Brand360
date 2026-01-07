import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Rocket, 
  Check, 
  X, 
  ArrowRight,
  Share2,
  Target,
  RefreshCw,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';

const BrandAIModule = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Estados de datos
  const [projectDesc, setProjectDesc] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [selectedIdentity, setSelectedIdentity] = useState(null);

  // Datos simulados enriquecidos
  const mockIdentities = {
    free: [
      { name: "Lumina", slogan: "Brillantez en cada paso.", concept: "Minimalismo suizo, tipografía Neo-Grotesk.", tags: ["Moderno", "Luz"] }
    ],
    basic: [
      { name: "Vortex", slogan: "Impulsando el mañana.", concept: "Estilo Cyberpunk, degradados neón.", tags: ["Energía", "Tech"] },
      { name: "Origen", slogan: "Naturalmente puro.", concept: "Estética orgánica, tonos tierra.", tags: ["Eco", "Puro"] }
    ],
    premium: [
      { name: "Zenith", slogan: "Alcanza lo inalcanzable.", concept: "Lujo geométrico, azul medianoche y oro.", tags: ["Elite", "Cúspide"] },
      { name: "Nexus", slogan: "Conexiones que importan.", concept: "Redes abstractas, gradientes violetas.", tags: ["Red", "Futuro"] },
      { name: "Kinetix", slogan: "Movimiento sin límites.", concept: "Líneas de velocidad, tipografía Italic Heavy.", tags: ["Agilidad", "Pro"] }
    ],
    pro: [
      { name: "Aethel", slogan: "Legado en evolución.", concept: "Serif clásica moderna, espaciado amplio.", tags: ["Lujo", "Historia"] },
      { name: "Quark", slogan: "Pequeño gran impacto.", concept: "Arquitectura Bauhaus, colores primarios.", tags: ["Ciencia", "Pop"] },
      { name: "Obsidian", slogan: "Fuerza en el silencio.", concept: "Monocromático, texturas de piedra.", tags: ["Poder", "Sólido"] }
    ]
  };

  const handleKeywordAdd = (e) => {
    if (e.key === 'Enter' && currentKeyword.trim() !== '') {
      if (keywords.length < 5) {
        setKeywords([...keywords, currentKeyword.trim()]);
        setCurrentKeyword('');
      }
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    if (projectDesc.length < 5) return;
    setLoading(true);
    setTimeout(() => {
      setIdentities(mockIdentities[selectedPlan]);
      setStep(2);
      setLoading(false);
    }, 1800);
  };

  const [identities, setIdentities] = useState(mockIdentities.premium);

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    setIdentities(mockIdentities[plan]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-yellow-200">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .animate-float { animation: float 4s ease-in-out infinite; }
          .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); }
          .custom-scrollbar::-webkit-scrollbar { width: 5px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        `}
      </style>

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                <Zap size={24} fill="currentColor" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter">
                BRAND<span className="text-yellow-500">360</span>
              </h1>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">Identity Engine Pro</p>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><ShieldCheck size={14}/> Seguro</span>
            <span className="flex items-center gap-1"><Globe size={14}/> Global</span>
          </div>
        </header>

        {/* Navigation Dots */}
        <nav className="flex justify-center gap-4 mb-12">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-500 ${step === i ? 'w-12 bg-slate-950' : 'w-2 bg-slate-200'}`}
            />
          ))}
        </nav>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-slate-100 rounded-full animate-spin border-t-yellow-500" />
                <Sparkles className="absolute inset-0 m-auto text-slate-900 animate-pulse" size={30} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold">Procesando ADN...</h3>
                <p className="text-slate-400 text-sm">Nuestra IA está diseñando tu futuro.</p>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: INPUT */}
              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="space-y-6">
                    <h2 className="text-5xl font-black leading-tight tracking-tight">
                      Donde las ideas se vuelven <span className="text-yellow-500 underline decoration-4 underline-offset-8">marcas.</span>
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      Describe tu proyecto en pocas palabras. Brand360 se encarga de la estética, el nombre y el mensaje.
                    </p>
                    <div className="flex gap-4 pt-4">
                      <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex-1">
                        <p className="text-2xl font-bold">100%</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Originalidad</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex-1">
                        <p className="text-2xl font-bold">Instante</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Velocidad</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">¿Qué vas a crear?</label>
                        <textarea 
                          value={projectDesc}
                          onChange={(e) => setProjectDesc(e.target.value)}
                          className="w-full h-40 bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-6 text-lg focus:border-yellow-400 outline-none transition-all resize-none"
                          placeholder="Ej: Una café que solo abre de noche para escritores nocturnos..."
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Valores (Keywords)</label>
                        <div className="flex flex-wrap gap-2 min-h-[48px] p-2 bg-slate-50/50 rounded-2xl border-2 border-slate-100 focus-within:border-slate-200 transition-all">
                          {keywords.map((k, i) => (
                            <span key={i} className="bg-slate-950 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 animate-in zoom-in">
                              {k} <button onClick={() => removeKeyword(i)}><X size={12}/></button>
                            </span>
                          ))}
                          <input 
                            onKeyDown={handleKeywordAdd}
                            value={currentKeyword}
                            onChange={(e) => setCurrentKeyword(e.target.value)}
                            placeholder={keywords.length < 5 ? "Escribe y Enter..." : ""}
                            className="bg-transparent outline-none text-sm px-2 flex-grow"
                            disabled={keywords.length >= 5}
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleGenerate}
                        disabled={projectDesc.length < 5}
                        className="w-full py-5 bg-slate-950 text-white rounded-3xl font-black text-lg hover:bg-yellow-500 transition-all disabled:opacity-20 flex items-center justify-center gap-3 group"
                      >
                        Generar Identidad <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SELECTION */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black">Propuestas de Marca</h2>
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                      {['free', 'basic', 'premium', 'pro'].map(p => (
                        <button 
                          key={p}
                          onClick={() => handlePlanChange(p)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedPlan === p ? 'bg-white shadow-sm text-slate-950' : 'text-slate-400'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {identities.map((id, i) => (
                      <div 
                        key={i}
                        onClick={() => setSelectedIdentity(id)}
                        className={`group relative p-8 rounded-[32px] border-4 cursor-pointer transition-all min-h-[200px] flex flex-col justify-between ${selectedIdentity === id ? 'border-yellow-400 bg-white shadow-2xl scale-105 z-10' : 'border-white bg-white/50 hover:border-slate-100 hover:bg-white'}`}
                      >
                        <div>
                          <h3 className="text-2xl font-black mb-2">{id.name}</h3>
                          <p className="text-slate-400 text-sm font-medium italic">"{id.slogan}"</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {id.tags.map(t => <span key={t} className="text-[8px] font-black px-2 py-1 bg-slate-100 rounded-md text-slate-500 uppercase">{t}</span>)}
                          </div>
                        </div>
                        
                        {selectedIdentity === id && (
                          <div className="absolute top-6 right-6 text-yellow-500 animate-in zoom-in">
                            <Check size={24} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="px-8 py-5 rounded-3xl font-bold text-slate-400 hover:text-slate-600 transition-colors">Atrás</button>
                    <button 
                      onClick={() => setStep(3)}
                      disabled={!selectedIdentity}
                      className="flex-grow py-5 bg-slate-950 text-white rounded-3xl font-black text-lg hover:shadow-2xl transition-all disabled:opacity-20"
                    >
                      Finalizar Branding
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: RESULT */}
              {step === 3 && (
                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-8 duration-700">
                  <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black">Identidad Consolidada</h2>
                    <p className="text-slate-400">Tu marca está lista para el mercado global.</p>
                  </div>

                  {/* Final Visual Board */}
                  <div className="bg-slate-950 rounded-[48px] overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 blur-[100px]" />
                    
                    <div className="p-16 text-center space-y-10 relative z-10">
                      <div className="space-y-4">
                        <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">Official Naming</span>
                        <h4 className="text-7xl font-black text-white tracking-tighter uppercase">{selectedIdentity?.name}</h4>
                      </div>
                      
                      <div className="h-px w-20 bg-white/20 mx-auto" />
                      
                      <div className="space-y-4">
                        <p className="text-white/60 text-2xl font-medium italic tracking-tight">"{selectedIdentity?.slogan}"</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                        <Target size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEO Score</p>
                        <p className="text-xl font-black">9.8/10</p>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                        <Share2 size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assets</p>
                        <p className="text-xl font-black">Listos</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button className="w-full py-5 bg-yellow-500 text-slate-950 font-black rounded-3xl shadow-xl shadow-yellow-100 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                      Descargar Brand Kit Completo <Share2 size={20}/>
                    </button>
                    <button 
                      onClick={() => { setStep(1); setSelectedIdentity(null); setProjectDesc(''); }}
                      className="w-full py-4 text-slate-400 font-bold hover:text-slate-950 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14}/> Reiniciar Proceso
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandAIModule;
