'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDeviceTier } from '@/lib/hooks';

/**
 * Two-layer pointer glow: a wide ambient wash plus a tight reticle.
 * Desktop / high-tier only — touch devices get nothing to avoid jank.
 */
export function CursorGlow() {
  const tier = useDeviceTier();
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);

  const washX = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 });
  const washY = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 500, damping: 34, mass: 0.35 });
  const dotY = useSpring(y, { stiffness: 500, damping: 34, mass: 0.35 });

  const washLeft = useTransform(washX, (v) => v - 260);
  const washTop = useTransform(washY, (v) => v - 260);
  const dotLeft = useTransform(dotX, (v) => v - 5);
  const dotTop = useTransform(dotY, (v) => v - 5);

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setEnabled(tier === 'high' && window.matchMedia('(pointer: fine)').matches);
  }, [tier]);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      <motion.div
        style={{ left: washLeft, top: washTop }}
        className="absolute h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(0,245,212,0.10),rgba(123,44,191,0.07)_45%,transparent_70%)] blur-[10px]"
      />
      <motion.div
        style={{ left: dotLeft, top: dotTop }}
        className="absolute h-[10px] w-[10px] rounded-full border border-aqua/70 bg-aqua/25 shadow-[0_0_18px_rgba(0,245,212,0.8)]"
      />
    </div>
  );
}
