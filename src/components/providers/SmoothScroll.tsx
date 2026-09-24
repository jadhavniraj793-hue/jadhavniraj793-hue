'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { setScrollState, useDeviceTier } from '@/lib/hooks';

/**
 * Lenis smooth scrolling.
 *
 * The scroll position is published to a module-level object (`scrollState`)
 * instead of React state so that three.js scenes can read it inside
 * `useFrame` without re-rendering a single component per scroll tick.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const tier = useDeviceTier();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || tier === 'none') return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      autoRaf: false,
      // Don't hijack scrolling inside the mobile nav drawer / scrollable panes.
      prevent: (node) => node.hasAttribute?.('data-lenis-prevent') ?? false,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    lenis.on('scroll', (event: { scroll: number; limit: number; velocity: number }) => {
      const progress = event.limit > 0 ? event.scroll / event.limit : 0;
      setScrollState(Math.min(1, Math.max(0, progress)), event.velocity ?? 0);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      setScrollState(0, 0);
    };
  }, [tier]);

  return <>{children}</>;
}
