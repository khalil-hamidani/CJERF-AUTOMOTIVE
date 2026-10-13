import React, { useEffect, useRef } from 'react';

/**
 * Ultra-lightweight Zero-Re-render HUD Cursor
 * Manipulates DOM transforms directly via ref to bypass React render cycle completely.
 * Automatically dormant on touch / mobile devices.
 */
export default function HudCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let isHovering = false;

    const onMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) ${isHovering ? 'scale(1.3)' : 'scale(1)'}`;

      const target = e.target;
      const nextHovering = !!(
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA')
      );

      if (nextHovering !== isHovering) {
        isHovering = nextHovering;
        if (isHovering) {
          ring.classList.add('w-8', 'h-8', 'bg-cjerf-red/10');
          ring.classList.remove('w-4', 'h-4');
        } else {
          ring.classList.add('w-4', 'h-4');
          ring.classList.remove('w-8', 'h-8', 'bg-cjerf-red/10');
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Subtle outer dot / ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-4 h-4 transition-transform duration-75 ease-out rounded-full border border-cjerf-red/80 -translate-x-1/2 -translate-y-1/2"
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-cjerf-red rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />
    </div>
  );
}
