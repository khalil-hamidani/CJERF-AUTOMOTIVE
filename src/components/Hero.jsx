import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import Logo3DFlying from './Logo3DFlying';

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-start pt-20 sm:pt-24 lg:pt-28 pb-14 overflow-hidden">
      
      {/* Background Video / Cinematic - Single Responsive Stream */}
      <div className="absolute inset-0 z-0">
        <video
          key={isMobile ? 'mobile' : 'desktop'}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/assets/hero_poster.jpg"
          className="w-full h-full object-cover object-center brightness-105 contrast-105"
        >
          <source
            src={isMobile ? '/assets/hero-mobile.mp4' : '/assets/hero-cinematic.mp4'}
            type="video/mp4"
          />
          <img
            src="/assets/hero_poster.jpg"
            alt="CJERF Automotive"
            className="w-full h-full object-cover object-center"
          />
        </video>

        {/* General dark tint overlay over the entire video for superior text readability */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />

        {/* Soft left & top gradient for effortless text legibility on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-cjerf-black/90 via-cjerf-black/60 to-transparent w-full md:w-3/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-cjerf-black/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-cjerf-black to-transparent pointer-events-none" />
      </div>

      {/* Hero Content shifted to the left with 50% reduced margins */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 w-full">
        <div className="max-w-2xl text-left -ml-1 sm:-ml-2">
          
          {/* 3D Flying Logo placed directly above title, covering the whole width of the text section */}
          <Logo3DFlying variant="hero" align="left" className="mb-0 sm:mb-1" />

          {/* Main Title positioned right under 3D logo */}
          <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] uppercase">
            L’Ingénierie Inverse Automobile.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-zinc-200 font-light max-w-lg leading-relaxed">
            Caches disparus, pièces introuvables et accessoires carrosserie conçus en CAO et fabriqués en Algérie.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            <a
              href="#/catalogue"
              className="px-6 py-3.5 rounded-xl bg-cjerf-red hover:bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cjerf-red/25 hover:shadow-cjerf-red/40 cursor-pointer"
            >
              Voir le Catalogue
            </a>

            <a
              href="#/sur-mesure"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer border border-white/10"
            >
              Demander du Sur-Mesure
            </a>
          </div>

        </div>

        {/* Minimal indicator to scroll */}
        <div className="mt-12 flex items-center space-x-2 text-zinc-400 font-mono text-[11px] tracking-widest uppercase -ml-1 sm:-ml-2">
          <ArrowDown className="w-3.5 h-3.5 text-cjerf-red animate-bounce" />
          <span>Défiler pour voir la fabrication</span>
        </div>
      </div>

    </section>
  );
}
