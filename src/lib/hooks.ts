'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/* ------------------------------------------------------------------ *
 * Device capability tier — drives every 3D performance decision.
 *   high   → full scene (desktop, capable GPU)
 *   medium → scene with reduced particle counts (typical mobile / tablet)
 *   low    → no WebGL scene, animated CSS fallback (weak or reduced-motion)
 *   none   → no WebGL available at all, static CSS fallback
 * ------------------------------------------------------------------ */

export type DeviceTier = 'high' | 'medium' | 'low' | 'none';

function detectTier(): DeviceTier {
  if (typeof window === 'undefined') return 'none';

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;

  // Probe for a real WebGL context once; bail out gracefully if unavailable.
  let webgl = false;
  try {
    const canvas = document.createElement('canvas');
    webgl = Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl')
    );
  } catch {
    webgl = false;
  }

  if (!webgl) return 'none';
  if (reduced) return 'low';
  if (memory <= 4 || cores <= 4) return 'low';
  if (coarse || memory <= 6 || cores <= 6) return 'medium';
  return 'high';
}

const EMPTY_SUBSCRIBE = () => () => {};

let cachedTier: DeviceTier | null = null;

/** SSR-safe device tier. Renders as `none` on the server, resolves on mount. */
export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    () => (cachedTier ??= detectTier()),
    () => 'none' as DeviceTier
  );
}

/** True once the component has mounted on the client. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** `true` when the element is (or recently was) within the viewport. */
export function useInViewport<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { rootMargin = '200px', threshold = 0 }: { rootMargin?: string; threshold?: number } = {}
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return inView;
}

/** Global pointer position normalised to -1…1, updated on a rAF throttle. */
export function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        pointer.current = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -((event.clientY / window.innerHeight) * 2 - 1),
        };
        frame = 0;
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return pointer;
}

/** Latest scroll progress (0…1) of the whole document — no re-render, ref only. */
export function useScrollProgressRef() {
  const progress = useRef(0);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return progress;
}

/** Pauses work while the browser tab is hidden. */
export function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}

/* ------------------------------------------------------------------ *
 * Scroll bridge: Lenis -> module-level state read inside useFrame.
 * Avoids re-rendering React (or the R3F tree) on every scroll tick.
 * ------------------------------------------------------------------ */
export const scrollState = { progress: 0, velocity: 0 };

export function setScrollState(progress: number, velocity = 0) {
  scrollState.progress = progress;
  scrollState.velocity = velocity;
}

/** Tracks which section id currently owns the viewport. */
export function useActiveSection(ids: readonly string[], offset = 0.35) {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: `-${Math.round(offset * 100)}% 0px -${Math.round((1 - offset) * 100) * 0.6}% 0px`, threshold: [0.05, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, offset]);

  return active;
}

/** Imperatively scroll to an element id / selector through Lenis when present. */
export function smoothScrollTo(target: string | HTMLElement, offset = -72) {
  const el =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;

  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } })
    .__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.2 });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
