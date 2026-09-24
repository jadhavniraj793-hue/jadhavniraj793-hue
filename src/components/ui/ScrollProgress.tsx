'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Neon reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-aqua via-plasma to-violet-glow shadow-[0_0_18px_rgba(0,245,212,0.55)]"
    />
  );
}
