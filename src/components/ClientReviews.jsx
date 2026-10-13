import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Wrench } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    tab: 'Ibiza 6J',
    name: 'Karim B.',
    wilaya: 'Alger (16)',
    vehicle: 'Seat Ibiza 6J',
    part: 'Cache Remorquage Avant',
    material: 'PETG-CF Carbone (110°C)',
    quote: 'Clipsage immédiat sans aucun jeu mécanique. Texture de grain identique au pare-choc d’origine.',
    leadTime: 'Livré en 48h',
  },
  {
    id: 2,
    tab: 'Saxo VTS',
    name: 'Yacine M.',
    wilaya: 'Oran (31)',
    vehicle: 'Citroën Saxo VTS',
    part: 'Coques Profil Obus',
    material: 'PETG Fibre Carbone',
    quote: 'Rigide, profilé et zéro vibration à 140 km/h sur autoroute. Encaisse les chaleurs de l’été sans déformation.',
    leadTime: 'Livré en 48h',
  },
  {
    id: 3,
    tab: 'Aveo LS',
    name: 'Sofiane T.',
    wilaya: 'Constantine (25)',
    vehicle: 'Chevrolet Aveo LS',
    part: 'Paire Caches Inférieurs',
    material: 'ABS Renforcé Anti-Gravillon',
    quote: 'Ajustement parfait au millimètre sur le bouclier. Reçu via Yalidine à Constantine, finition très soignée.',
    leadTime: 'Livré en 48h',
  },
  {
    id: 4,
    tab: 'Peugeot 308',
    name: 'Amine D.',
    wilaya: 'Sétif (19)',
    vehicle: 'Peugeot 308',
    part: 'Support Radar de Recul',
    material: 'Polymère Industriel Haute Densité',
    quote: 'Le capteur s’enclenche avec le clic net d’origine. Rien à voir avec les copies d’occasion cassantes.',
    leadTime: 'Livré en 48h',
  },
  {
    id: 5,
    tab: 'Golf 7 GTD',
    name: 'Walid K.',
    wilaya: 'Blida (09)',
    vehicle: 'Volkswagen Golf 7',
    part: 'Écope Guide d’Air',
    material: 'ASA Automobile Anti-UV',
    quote: 'Plastique dense, pattes de fixation incassables sous contrainte mécanique. Rendu atelier irréprochable.',
    leadTime: 'Livré en 24h',
  },
];

export default function ClientReviews() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const touchStartX = useRef(0);
  const cardRef = useRef(null);

  const prevReview = () => {
    setActiveIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const nextReview = () => {
    setActiveIdx((prev) => (prev + 1) % REVIEWS.length);
  };

  // Auto-advance every 5.5s unless paused by user interaction
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % REVIEWS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, activeIdx]);

  const active = REVIEWS[activeIdx];

  const cardRectRef = useRef(null);

  // Mouse 3D tilt tracking (Desktop only - cached rect prevents layout thrashing)
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (cardRef.current) {
      cardRectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 640 || !cardRectRef.current) return;
    const rect = cardRectRef.current;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    cardRectRef.current = null;
    setMousePos({ x: 0, y: 0 });
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextReview();
    } else if (diff < -45) {
      prevReview();
    }
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <section id="avis" className="py-16 sm:py-24 bg-cjerf-black border-b border-white/5 relative overflow-hidden">
      
      {/* Dynamic ambient laser glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cjerf-red/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-[1480px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-6 sm:mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white uppercase tracking-tight">
            Retours d'Atelier.
          </h2>
        </div>

        {/* Central Spotlight Animated Card */}
        <div className="relative flex items-center sm:gap-6 mb-4 sm:mb-6">
          
          {/* Left Arrow Button (Desktop Side Arrow) */}
          <button
            onClick={prevReview}
            className="hidden sm:flex shrink-0 p-3 sm:p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-cjerf-red text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95 z-20 backdrop-blur-md"
            aria-label="Avis précédent"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Main Card */}
          <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => {
              setIsPaused(false);
              handleMouseLeave();
            }}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex-1 w-full min-w-0 perspective-[1000px]"
          >
            <motion.div
              animate={{
                rotateY: mousePos.x * 12,
                rotateX: -mousePos.y * 12,
              }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 bg-gradient-to-b from-zinc-900/80 via-zinc-900/40 to-black/80 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden group hover:border-cjerf-red/50 transition-colors"
            >
              {/* Dynamic Cursor Light Spotlight */}
              <div
                className="absolute pointer-events-none -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${(mousePos.x + 0.5) * 100}% ${(mousePos.y + 0.5) * 100}%, rgba(225, 6, 0, 0.15), transparent 40%)`,
                }}
              />

              {/* Animated Content Transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative z-10 space-y-4 sm:space-y-6"
                >
                  {/* Wilaya & Delivery Pill */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-mono text-[11px] sm:text-xs text-zinc-300 font-semibold uppercase tracking-wider flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-cjerf-red inline mr-0.5 shrink-0" />
                      <span>{active.wilaya}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-emerald-400">{active.leadTime}</span>
                    </span>
                  </div>

                  {/* Big Clean Quote */}
                  <p className="font-display text-lg sm:text-2xl lg:text-3xl text-white font-medium leading-snug sm:leading-relaxed tracking-tight">
                    « {active.quote} »
                  </p>

                  {/* Metadata Details */}
                  <div className="pt-4 sm:pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-white flex flex-wrap items-center gap-1.5">
                        <span>{active.name}</span>
                        <span className="text-zinc-600">—</span>
                        <span className="text-cjerf-red font-semibold">{active.vehicle}</span>
                      </div>
                      <div className="text-[11px] sm:text-xs text-zinc-400 font-mono mt-1 flex flex-wrap items-center gap-1.5">
                        <Wrench className="w-3 h-3 text-zinc-500 shrink-0" />
                        <span>{active.part}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400">{active.material}</span>
                      </div>
                    </div>

                    {/* Step counter for Desktop */}
                    <div className="hidden sm:block font-mono text-xs text-zinc-500 self-end sm:self-center">
                      0{activeIdx + 1} / 0{REVIEWS.length}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Auto-Slide Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                <motion.div
                  key={activeIdx}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5.5, ease: 'linear' }}
                  className="h-full bg-cjerf-red shadow-[0_0_10px_#e10600]"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Arrow Button (Desktop Side Arrow) */}
          <button
            onClick={nextReview}
            className="hidden sm:flex shrink-0 p-3 sm:p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-cjerf-red text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95 z-20 backdrop-blur-md"
            aria-label="Avis suivant"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

        </div>

        {/* Mobile Navigation Controls Bar (Ergonomic for thumb navigation) */}
        <div className="flex sm:hidden items-center justify-between px-2 pt-2">
          
          <button
            onClick={prevReview}
            className="p-3 rounded-xl bg-zinc-900 border border-white/10 active:border-cjerf-red text-zinc-300 active:text-white transition-all cursor-pointer shadow-lg active:scale-95 flex items-center space-x-1"
            aria-label="Avis précédent"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider">Préc.</span>
          </button>

          {/* Pagination Dots & Counter */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              {REVIEWS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeIdx === idx ? 'w-5 bg-cjerf-red' : 'w-1.5 bg-zinc-700'
                  }`}
                  aria-label={`Aller à l'avis ${idx + 1}`}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-zinc-500 ml-1">
              0{activeIdx + 1}/0{REVIEWS.length}
            </span>
          </div>

          <button
            onClick={nextReview}
            className="p-3 rounded-xl bg-zinc-900 border border-white/10 active:border-cjerf-red text-zinc-300 active:text-white transition-all cursor-pointer shadow-lg active:scale-95 flex items-center space-x-1"
            aria-label="Avis suivant"
          >
            <span className="text-xs font-mono uppercase tracking-wider">Suiv.</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </section>
  );
}
