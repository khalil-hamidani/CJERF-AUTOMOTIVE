import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const TOTAL_FRAMES = 108;
const getFrameUrl = (idx) => `/assets/scroll-frames/frame_${String(idx + 1).padStart(3, '0')}.webp`;

/**
 * High-performance cinematic scroll chamber.
 * Staged keyframe progressive loading + IntersectionObserver suspension.
 * Completely isolates desktop canvas vs mobile video to guarantee zero memory waste.
 */
export default function PrinterCarVideo({ onOpenCatalogue }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef(new Array(TOTAL_FRAMES).fill(null));

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isReady, setIsReady] = useState(false);
  const isVisibleRef = useRef(false);

  // Responsive device detection
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // 1. Progressive staged frame loading (Desktop only)
  useEffect(() => {
    if (isMobile) return;
    let isMounted = true;

    // A. Priority 1: Load first frame immediately and draw
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      if (!isMounted) return;
      framesRef.current[0] = firstImg;
      setIsReady(true);
      drawFrame(0);
    };

    // B. Priority 2: Staged keyframes (every 3rd frame) for instant smooth scrubbing
    const keyframeIndices = [];
    for (let i = 3; i < TOTAL_FRAMES; i += 3) {
      keyframeIndices.push(i);
    }

    keyframeIndices.forEach((idx) => {
      const img = new Image();
      img.src = getFrameUrl(idx);
      img.onload = () => {
        if (!isMounted) return;
        framesRef.current[idx] = img;
      };
    });

    // C. Priority 3: Fill in remaining intermediate frames progressively during idle time
    const loadRemainingFrames = () => {
      if (!isMounted) return;
      const remainingIndices = [];
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (i % 3 !== 0) remainingIndices.push(i);
      }

      let currentBatch = 0;
      const batchSize = 8;

      const scheduleBatch = () => {
        if (!isMounted || currentBatch >= remainingIndices.length) return;
        const slice = remainingIndices.slice(currentBatch, currentBatch + batchSize);
        slice.forEach((idx) => {
          const img = new Image();
          img.src = getFrameUrl(idx);
          img.onload = () => {
            if (!isMounted) return;
            framesRef.current[idx] = img;
          };
        });
        currentBatch += batchSize;

        if (currentBatch < remainingIndices.length) {
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(scheduleBatch, { timeout: 1000 });
          } else {
            setTimeout(scheduleBatch, 60);
          }
        }
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(scheduleBatch, { timeout: 1200 });
      } else {
        setTimeout(scheduleBatch, 200);
      }
    };

    const timer = setTimeout(loadRemainingFrames, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isMobile]);

  // 2. High-performance canvas draw with nearest available frame fallback
  const drawFrame = (frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let img = framesRef.current[frameIdx];
    if (!img) {
      // Find nearest loaded frame within range
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (frameIdx - offset >= 0 && framesRef.current[frameIdx - offset]) {
          img = framesRef.current[frameIdx - offset];
          break;
        }
        if (frameIdx + offset < TOTAL_FRAMES && framesRef.current[frameIdx + offset]) {
          img = framesRef.current[frameIdx + offset];
          break;
        }
      }
    }

    if (!img || !img.naturalWidth) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;

    let renderW, renderH, offsetX, offsetY;
    if (canvasRatio > imgRatio) {
      renderW = w;
      renderH = w / imgRatio;
      offsetX = 0;
      offsetY = (h - renderH) / 2;
    } else {
      renderW = h * imgRatio;
      renderH = h;
      offsetX = (w - renderW) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  };

  // 3. Scroll tracking with lerping loop suspended when out of viewport
  useEffect(() => {
    if (isMobile) return;

    let animationFrameId;
    let currentFrame = 0;
    let targetFrame = 0;
    let lastDrawnFrame = -1;

    // IntersectionObserver: Pause RAF completely when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animationFrameId) {
          animationFrameId = requestAnimationFrame(renderLoop);
        }
      },
      { threshold: 0.01, rootMargin: '200px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      drawFrame(Math.round(currentFrame));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const updateScrollTarget = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollDistance = rect.height - window.innerHeight;
      if (scrollDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
      targetFrame = progress * (TOTAL_FRAMES - 1);
    };

    const renderLoop = () => {
      if (!isVisibleRef.current) {
        animationFrameId = null;
        return;
      }

      updateScrollTarget();
      currentFrame += (targetFrame - currentFrame) * 0.14;

      const rounded = Math.round(currentFrame);
      if (Math.abs(currentFrame - lastDrawnFrame) > 0.02) {
        drawFrame(rounded);
        lastDrawnFrame = currentFrame;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <section id="fabrication" className="relative scroll-mt-20">
      
      {/* ========================================================= */}
      {/* DESKTOP EXPERIENCE: 108-Frame Canvas Scroll Scrubber       */}
      {/* ========================================================= */}
      {!isMobile && (
        <div
          ref={containerRef}
          className="relative h-[360vh] bg-cjerf-black border-b border-white/5"
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-start">
            {/* Canvas Scrubber */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Cinematic Lighting Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-cjerf-black/90 via-cjerf-black/55 to-transparent w-full md:w-3/5 pointer-events-none z-10" />
            <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-cjerf-black/80 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-cjerf-black/90 to-transparent pointer-events-none z-10" />

            {/* Story & Navigation Overlay */}
            <div className="relative z-20 max-w-[1480px] mx-auto px-4 sm:px-8 w-full pt-28 sm:pt-36 lg:pt-40">
              <div className="max-w-3xl">
                <h2 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight leading-[1.08] uppercase">
                  Du Filament au Pare-Choc.
                </h2>

                <p className="mt-4 text-base sm:text-lg text-zinc-300 font-light max-w-xl">
                  De la bobine de polymère technique jusqu’à l'ajustement millimétrique sur la carrosserie d'origine.
                </p>

                <div className="mt-8">
                  <button
                    onClick={onOpenCatalogue}
                    className="inline-flex items-center space-x-3 px-6 py-3.5 rounded-xl bg-cjerf-red hover:bg-red-600 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-lg shadow-cjerf-red/25 hover:shadow-cjerf-red/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Voir le Catalogue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MOBILE EXPERIENCE: Dedicated High-Impact Mobile Video     */}
      {/* ========================================================= */}
      {isMobile && (
        <div className="relative min-h-[85vh] bg-cjerf-black border-b border-white/5 overflow-hidden flex flex-col justify-end p-6 pb-12">
          {/* Background Mobile Video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover object-center brightness-95 contrast-105"
            >
              <source src="/assets/fabrication-mobile.mp4" type="video/mp4" />
              <source src="/assets/scroll-printer-car.mp4" type="video/mp4" />
            </video>
            {/* Mobile Vignette Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-cjerf-black via-cjerf-black/65 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cjerf-black/80 to-transparent pointer-events-none" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 w-full space-y-4">
            <h2 className="font-display font-bold text-3xl text-white tracking-tight uppercase leading-tight">
              Du Filament au Pare-Choc.
            </h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              De la bobine de polymère technique jusqu’à l'ajustement millimétrique sur la carrosserie d'origine.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenCatalogue}
                className="w-full py-4 rounded-xl bg-cjerf-red text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-2 shadow-xl shadow-cjerf-red/30 cursor-pointer"
              >
                <span>Voir le Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
