import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Gauge, Clock, CheckCircle2 } from 'lucide-react';
import ModelViewer3D from './ModelViewer3D';

function useCounter(endValue, isVisible, duration = 1800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(easeProgress * endValue));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setValue(endValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, endValue, duration]);

  return value;
}

export default function StatsShowcase() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const partsCount = useCounter(1450, isVisible, 2000);
  const clientsCount = useCounter(980, isVisible, 1900);
  const hoursCount = useCounter(48, isVisible, 1400);

  return (
    <section
      ref={sectionRef}
      id="metriques"
      className="relative bg-cjerf-black border-t border-b border-white/5 overflow-hidden scroll-mt-20"
    >
      {/* Background radial accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cjerf-red/5 blur-[120px] pointer-events-none rounded-full" />

      {/* ========================================================================= */}
      {/* PART 1 : TOP HALF (50vh) - COUNTERS & ATELIER TELEMETRY                   */}
      {/* ========================================================================= */}
      <div className="min-h-[50vh] flex flex-col justify-center px-4 sm:px-8 pt-20 pb-14 sm:pt-24 sm:pb-16 max-w-[1480px] mx-auto w-full relative z-10 border-b border-white/5">
        


        {/* Section Title */}
        <div className="max-w-3xl mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight leading-tight">
            L'Impact de la Précision Additive.
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            Des pièces de carrosserie introuvables au détail, numérisées en CAO et réinjectées sur les routes avec une résistance supérieure aux plastiques d'origine.
          </p>
        </div>

        {/* 4 Interactive Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Stat 1 : Pièces Fabriquées */}
          <div className="group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-cjerf-red/40 hover:bg-zinc-900/70 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                Volume Tirage
              </span>
              <Cpu className="w-4 h-4 text-cjerf-red group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
              +{partsCount.toLocaleString()}
            </div>
            <div className="mt-2 font-mono text-xs text-zinc-300 font-medium uppercase tracking-wider">
              Pièces Imprimées & Livrées
            </div>
            <p className="mt-1 text-xs text-zinc-400 font-light">
              Caches remorquage, coques et pièces rares en polymère technique.
            </p>
          </div>

          {/* Stat 2 : Véhicules & Clients */}
          <div className="group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-cjerf-red/40 hover:bg-zinc-900/70 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                Parc Équipé
              </span>
              <CheckCircle2 className="w-4 h-4 text-cjerf-red group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
              {clientsCount.toLocaleString()}+
            </div>
            <div className="mt-2 font-mono text-xs text-zinc-300 font-medium uppercase tracking-wider">
              Clients Particuliers & Pros
            </div>
            <p className="mt-1 text-xs text-zinc-400 font-light">
              Propriétaires et carrossiers satisfaits dans toute l'Algérie.
            </p>
          </div>

          {/* Stat 3 : Tolérance d'Ajustement */}
          <div className="group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-cjerf-red/40 hover:bg-zinc-900/70 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                Précision Tolérance
              </span>
              <Gauge className="w-4 h-4 text-cjerf-red group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
              ±0.05 <span className="text-xl sm:text-2xl text-cjerf-red font-mono">mm</span>
            </div>
            <div className="mt-2 font-mono text-xs text-zinc-300 font-medium uppercase tracking-wider">
              Ajustement Affleurant Zéro-Jeu
            </div>
            <p className="mt-1 text-xs text-zinc-400 font-light">
              Scan optique 3D haute résolution & contrôle qualité pièce par pièce.
            </p>
          </div>

          {/* Stat 4 : Délai Atelier */}
          <div className="group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-cjerf-red/40 hover:bg-zinc-900/70 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                Délai Réalisation
              </span>
              <Clock className="w-4 h-4 text-cjerf-red group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
              {hoursCount} <span className="text-xl sm:text-2xl text-cjerf-red font-mono">H</span>
            </div>
            <div className="mt-2 font-mono text-xs text-zinc-300 font-medium uppercase tracking-wider">
              Départ Atelier Moyen
            </div>
            <p className="mt-1 text-xs text-zinc-400 font-light">
              Modélisation CAO, fabrication additive FDM et contrôle d'envoi.
            </p>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* PART 2 : BOTTOM HALF (50vh) - INTERACTIVE 3D CAD MODEL VIEWER             */}
      {/* ========================================================================= */}
      <ModelViewer3D />

    </section>
  );
}
