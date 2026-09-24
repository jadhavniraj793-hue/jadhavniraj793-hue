'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useDeviceTier } from '@/lib/hooks';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  intensity?: number;
  /** Colour of the pointer-tracking glare. */
  glare?: string;
  /** Adds a lift + border highlight on hover. */
  hoverLift?: boolean;
};

/**
 * Glassmorphic card with a real 3D tilt: rotation follows the pointer,
 * driven by motion values (no React re-renders) and spring-smoothed.
 * Automatically static on touch devices and for reduced-motion users.
 */
export function TiltCard({
  children,
  className = '',
  intensity = 9,
  glare = 'rgba(0,245,212,0.16)',
  hoverLift = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();

  const rotateX = useSpring(0, { stiffness: 220, damping: 22, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22, mass: 0.5 });
  const lift = useSpring(0, { stiffness: 240, damping: 26 });

  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareBg = useMotionTemplate`radial-gradient(360px circle at ${glareX}% ${glareY}%, ${glare}, transparent 68%)`;

  const interactive = tier === 'high' || tier === 'medium';

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!interactive || event.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    rotateY.set((px - 0.5) * intensity * 2);
    rotateX.set((0.5 - py) * intensity * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function handleEnter() {
    if (interactive) lift.set(hoverLift ? -6 : 0);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
    lift.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        y: lift,
        transformPerspective: 1100,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative rounded-3xl glass neon-ring transition-shadow duration-500 hover:shadow-[0_30px_90px_-40px_rgba(0,245,212,0.45)] ${className}`}
    >
      {/* Pointer glare */}
      <motion.span
        aria-hidden
        style={{ background: glareBg }}
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative h-full" style={{ transform: 'translateZ(28px)' }}>
        {children}
      </div>
    </motion.div>
  );
}
