import React, { useState, useEffect, useRef } from 'react';

export default function ScrollWorldChamber() {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      id: 'step-print',
      num: '01',
      tag: '01. FABRICATION ADDITIVE',
      title: 'Extrusion Carbone Précision',
      description: 'Dépôt micrométrique du polymère technique sur plateau thermique. La buse se rétracte après la passe finale.',
      image: '/assets/scroll_f1.jpg',
    },
    {
      id: 'step-lift',
      num: '02',
      tag: '02. LÉVITATION AÉRODYNAMIQUE',
      title: 'Élévation Hors Plateau',
      description: 'La pièce se détache délicatement du plateau et s’élève en apesanteur dans l’atmosphère sombre du studio.',
      image: '/assets/scroll_f2.jpg',
    },
    {
      id: 'step-float',
      num: '03',
      tag: '03. APESANTEUR & SCAN 3D',
      title: 'Vol Orbital en Suspension',
      description: 'Translation aérienne fluide. Les cotes géométriques et la planéité sont contrôlées sous lumière rasante.',
      image: '/assets/scroll_f3.jpg',
    },
    {
      id: 'step-clips',
      num: '04',
      tag: '04. INGÉNIERIE DE FIXATION',
      title: 'Rotation & Ergots CAO',
      description: 'La coque pivote en suspension, révélant ses pattes d’ancrage renforcées en CAO contre les contraintes d’arrachement.',
      image: '/assets/scroll_f4.jpg',
    },
    {
      id: 'step-approach',
      num: '05',
      tag: '05. TRAJECTOIRE CHÂSSIS',
      title: 'Convergence vers le Véhicule',
      description: 'Guidage cinématique vers la calandre avant Peugeot sous l’éclairage studio rouge signature.',
      image: '/assets/scroll_f5.jpg',
    },
    {
      id: 'step-aperture',
      num: '06',
      tag: '06. ALIGNEMENT APERTURE',
      title: 'Approche Coaxiale',
      description: 'Alignement micrométrique strict avec l’axe du logement constructeur sur le pare-choc avant.',
      image: '/assets/scroll_f6.jpg',
    },
    {
      id: 'step-insertion',
      num: '07',
      tag: '07. INSERTION MÉCANIQUE',
      title: 'Guidage dans le Logement',
      description: 'Les ergots de maintien s’engagent dans la cavité du bouclier avec un guidage fluide sans contrainte.',
      image: '/assets/scroll_f7.jpg',
    },
    {
      id: 'step-engagement',
      num: '08',
      tag: '08. ENCLENCHEMENT & CLIPSAGE',
      title: 'Enclenchement & Pré-Verrouillage',
      description: 'Course finale d’engagement. Les ergots flexibles fléchissent pour assurer une tension constante.',
      image: '/assets/scroll_f8.jpg',
    },
    {
      id: 'step-lock',
      num: '09',
      tag: '09. VERROUILLAGE ZÉRO-JEU',
      title: 'Intégration Carrosserie Affleurante',
      description: 'Verrouillage sonore ferme à ±0.05 mm de tolérance. Ajustement invisible et tenue absolue à haute vitesse.',
      image: '/assets/scroll_f9.jpg',
    },
  ];

  // Preload all frames on mount for instantaneous, flicker-free scrubbing
  useEffect(() => {
    steps.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  const jumpToStep = (idx) => {
    setActiveStep(idx);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const total = rect.height - windowHeight;
    const targetRatio = (idx + 0.5) / steps.length;
    const targetScrollY = window.scrollY + rect.top + targetRatio * total;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const total = rect.height - windowHeight;
          if (total > 0) {
            const current = -rect.top;
            const p = Math.min(Math.max(current / total, 0), 1);
            setProgress(p);

            // 9 evenly distributed threshold zones for smooth scroll pacing
            const stepIndex = Math.min(Math.floor(p * steps.length), steps.length - 1);
            setActiveStep(stepIndex);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  const cur = steps[activeStep];

  return (
    <section
      id="scrolly-chamber"
      ref={containerRef}
      className="relative bg-cjerf-black h-[650vh]"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-between p-6 sm:p-12 lg:p-20 overflow-hidden">
        
        {/* Background Visual Layer: Action Framed on the Right Side */}
        <div className="absolute inset-0 z-0 bg-cjerf-black overflow-hidden">
          
          {/* Hardware-accelerated frame crossfade stack */}
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-300 ease-out pointer-events-none ${
                i === activeStep ? 'opacity-100 z-[2]' : 'opacity-0 z-[1]'
              }`}
            >
              <img
                src={s.image}
                alt={s.title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-right"
              />
            </div>
          ))}

          {/* Left-side soft ambient shadow to guarantee effortless reading on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-cjerf-black via-cjerf-black/85 md:via-cjerf-black/60 to-transparent w-full md:w-3/5 pointer-events-none z-[3]" />
          <div className="absolute inset-0 bg-gradient-to-t from-cjerf-black via-transparent to-cjerf-black/40 pointer-events-none z-[3]" />
        </div>

        {/* Content Strictly Positioned on the LEFT Side */}
        <div className="relative z-10 max-w-md lg:max-w-xl space-y-6">
          
          {/* Animated Text Container with zero ghosting */}
          <div className="relative min-h-[220px]">
            <div
              key={cur.id}
              className="space-y-4 animate-fade-in"
            >
              {/* Step Pill */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cjerf-red" />
                <span className="font-mono text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                  {cur.tag}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h2 className="font-display font-bold text-3xl sm:text-5xl text-white uppercase tracking-tight leading-[1.1]">
                  {cur.title}
                </h2>

                <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
                  {cur.description}
                </p>
              </div>
            </div>
          </div>

          {/* 9-Step Navigation Dots & Linear Scrub Bar */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center space-x-2">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => jumpToStep(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeStep ? 'w-7 bg-cjerf-red' : 'w-2 bg-white/20 hover:bg-white/50'
                  }`}
                  title={s.title}
                />
              ))}
              <span className="text-xs font-mono text-zinc-400 pl-2">
                0{activeStep + 1} / 0{steps.length}
              </span>
            </div>

            {/* Subtle Millimeter Scrub Track */}
            <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-cjerf-red transition-all duration-150 ease-out"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
