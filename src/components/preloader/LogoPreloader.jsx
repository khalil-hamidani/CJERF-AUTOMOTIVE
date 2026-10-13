import React from 'react';

/**
 * Ultra-lightweight, high-performance Logo Preloader
 * Replaces heavy Three.js 3D WebGL context with the crisp white CJERF Automotive logo image.
 * Instantaneous rendering, zero GPU blocking, 100% mobile responsive.
 */
export default function LogoPreloader() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-sm px-4">
      {/* Volumetric red radial ambient glow */}
      <div 
        className="absolute w-44 h-44 sm:w-60 sm:h-60 bg-cjerf-red/20 blur-[50px] sm:blur-[70px] rounded-full pointer-events-none animate-pulse" 
        style={{ animationDuration: '2.5s' }}
      />

      {/* Crisp White Logo Image with subtle breathing motion */}
      <div className="relative z-10 transition-transform duration-700 ease-out transform">
        <img
          src="/assets/cjerf-logo-dark.png"
          alt="CJERF Automotive"
          className="w-48 sm:w-64 md:w-72 h-auto object-contain drop-shadow-[0_4px_24px_rgba(225,6,0,0.3)] select-none pointer-events-none"
          loading="eager"
          decoding="sync"
        />
      </div>

      {/* Micro-telemetry badge beneath the logo */}
      <div className="relative z-10 mt-3 sm:mt-4 flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-cjerf-red animate-ping" />
        <span className="font-mono text-[9px] sm:text-[10px] text-zinc-300 uppercase tracking-widest font-medium">
          Atelier Fabrication Additive
        </span>
      </div>
    </div>
  );
}
