import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { type ReactNode, useRef } from 'react';
import { useHasHover } from '../../hooks/useMediaQuery';
import { cn } from '../../utils/cn';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  intensity?: number;
  glare?: boolean;
}

/** Glass card that tilts toward the cursor with a moving specular highlight. */
export function TiltCard({ children, className, intensity = 9, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const canHover = useHasHover();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 170, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 170, damping: 20, mass: 0.4 });

  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);
  const glareX = useTransform(sx, [0, 1], ['15%', '85%']);
  const glareY = useTransform(sy, [0, 1], ['15%', '85%']);
  const glareBg = useMotionTemplate`radial-gradient(480px circle at ${glareX} ${glareY}, rgba(139, 92, 246, 0.13), rgba(34, 211, 238, 0.06) 42%, transparent 68%)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div style={{ perspective: 1100 }} className={cn('h-full', className)}>
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative h-full will-change-transform"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            style={{ background: glareBg }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </motion.div>
    </div>
  );
}
