'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { profile } from '@/lib/data';

const BOOT_LINES = [
  '> initialising analytics engine…',
  '> mounting 3D data cosmos…',
  '> loading datasets: sales · churn · macro…',
  '> compiling dashboards…',
  '> ready. welcome to the hub.',
];

/**
 * Short boot sequence overlay. It never blocks longer than ~1.3s and
 * remembers the visit for the rest of the session.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const alreadyBooted = sessionStorage.getItem('nj-booted') === '1';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (alreadyBooted || reduced) {
      setVisible(false);
      return;
    }

    const total = 1150;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / total);
      setProgress(p);
      setLine(Math.min(BOOT_LINES.length - 1, Math.floor(p * BOOT_LINES.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem('nj-booted', '1');
        setTimeout(() => setVisible(false), 220);
      }
    };
    raf = requestAnimationFrame(tick);

    document.documentElement.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!visible) document.documentElement.style.overflow = '';
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-space"
          aria-hidden={false}
          role="status"
          aria-live="polite"
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.25] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

          <div className="relative flex flex-col items-center gap-5">
            <div className="relative grid h-20 w-20 place-items-center">
              <span className="absolute inset-0 rounded-2xl border border-aqua/30" />
              <motion.span
                className="absolute inset-0 rounded-2xl border border-transparent border-t-aqua"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              />
              <span className="font-display text-2xl font-bold text-gradient">{profile.initials}</span>
            </div>

            <div className="text-center">
              <p className="font-display text-lg font-semibold text-mist">{profile.name}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.35em] text-aqua/80">
                {profile.title}
              </p>
            </div>
          </div>

          <div className="relative w-[min(78vw,420px)]">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-aqua via-plasma to-violet-glow"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
              <span className="text-aqua/90">{BOOT_LINES[line]}</span>
              <span>{String(Math.round(progress * 100)).padStart(3, '0')}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
