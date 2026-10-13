import React, { useState, useEffect } from 'react';
import LogoPreloader from './LogoPreloader';
import { useAssetLoader } from '../../hooks/useAssetLoader';

/**
 * Mobile-Friendly, High-Performance Loading Overlay
 * Replaces heavy 3D GLB loading with fast, lightweight visual identity and progressive reveal.
 */
export default function LoadingOverlay() {
  const { progress, isRevealed: managerRevealed, statusMessage } = useAssetLoader();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  // Smooth monotonic progress interpolation advancing towards actual asset workload
  useEffect(() => {
    let animId;
    const step = () => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          const diff = progress - prev;
          const increment = Math.max(1, Math.ceil(diff * 0.18));
          return Math.min(progress, prev + increment);
        }
        return prev;
      });
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [progress]);

  // 70% Website Reveal Threshold
  useEffect(() => {
    if ((displayProgress >= 70 || managerRevealed) && !hasRevealed) {
      setHasRevealed(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [displayProgress, managerRevealed, hasRevealed]);

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#070709] flex flex-col justify-between items-center px-4 sm:px-6 py-6 sm:py-10 transition-opacity duration-600 ease-in-out select-none overflow-hidden ${
        hasRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      aria-live="polite"
      aria-busy={!hasRevealed}
    >
      {/* Top Telemetry Header - Responsive for Mobile & Desktop */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-cjerf-red animate-pulse shadow-[0_0_8px_#e10600] shrink-0" />
          <span className="font-bold tracking-widest text-white uppercase text-[10px] sm:text-xs truncate">
            CJERF AUTOMOTIVE
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-400 text-[11px] hidden md:inline truncate">
            INGÉNIERIE & ATELIER NUMÉRIQUE
          </span>
        </div>

        <div className="text-[10px] sm:text-xs text-zinc-400 font-mono tracking-wider shrink-0 pl-2">
          {hasRevealed ? (
            <span className="text-emerald-400 font-semibold">ACCÈS ATELIER AUTORISÉ</span>
          ) : (
            <span className="text-zinc-400">INITIALISATION...</span>
          )}
        </div>
      </div>

      {/* Center White Logo Stage */}
      <div className="relative flex flex-col items-center justify-center my-auto w-full py-4">
        <LogoPreloader />
      </div>

      {/* Bottom Progress Controls & Telemetry - Mobile Optimized */}
      <div className="w-full max-w-xs sm:max-w-md flex flex-col items-center space-y-2.5 z-10 pb-2 sm:pb-4">
        
        {/* Progress Bar Track */}
        <div className="w-full h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cjerf-red via-red-500 to-cjerf-red rounded-full transition-all duration-200 ease-out shadow-[0_0_12px_#e10600]"
            style={{ width: `${Math.min(100, Math.max(8, displayProgress))}%` }}
          />
        </div>

        {/* Status & Numeric Percentage Counter */}
        <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400 pt-0.5">
          <span className="truncate pr-2 uppercase tracking-wider text-zinc-400">
            {hasRevealed ? 'Ouverture de l’atelier...' : statusMessage}
          </span>
          <span className="text-white font-bold tracking-widest shrink-0 font-mono">
            {displayProgress}%
          </span>
        </div>

        {/* Threshold Indicator */}
        <div className="text-[9px] sm:text-[10px] font-mono text-zinc-600 uppercase tracking-widest text-center">
          {displayProgress < 70 ? (
            <span>Chargement optimisé • Révélation dès 70%</span>
          ) : (
            <span className="text-cjerf-red font-semibold animate-pulse">Affichage de l'expérience...</span>
          )}
        </div>

      </div>
    </div>
  );
}
