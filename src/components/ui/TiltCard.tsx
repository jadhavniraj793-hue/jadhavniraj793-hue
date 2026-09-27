import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../../lib/utils';
import { usePrefersReducedMotion, useIsTouch } from '../../hooks/useMediaQuery';

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
  onClick?: () => void;
};

/** 3D tilt + moving glass reflection that follows the cursor. */
export function TiltCard({ children, className, intensity = 8, glare = true, onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();

  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(34,211,238,0.16), transparent 62%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || touch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * intensity * 2);
    rx.set(-(py - 0.5) * intensity * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className={cn('group relative transform-gpu', className)}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          style={{ backgroundImage: glareBg }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
    </motion.div>
  );
}
