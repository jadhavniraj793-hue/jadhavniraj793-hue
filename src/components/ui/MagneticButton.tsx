import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../../lib/utils';
import { usePrefersReducedMotion, useIsTouch } from '../../hooks/useMediaQuery';

type Variant = 'primary' | 'ghost' | 'outline';

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md';
};

type Props = CommonProps &
  (
    | { as?: 'button'; onClick?: () => void; href?: never; download?: never; target?: never }
    | { as: 'a'; href: string; onClick?: () => void; download?: boolean | string; target?: string }
  );

const styles: Record<Variant, string> = {
  primary:
    'text-abyss bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 shadow-[0_10px_40px_-12px_rgba(34,211,238,0.75)] hover:shadow-[0_14px_50px_-10px_rgba(34,211,238,0.95)]',
  outline:
    'text-ink border border-cyan-300/35 bg-cyan-400/5 hover:bg-cyan-400/12 hover:border-cyan-300/60 backdrop-blur-md',
  ghost: 'text-ink-muted border border-white/10 bg-white/[0.03] hover:text-ink hover:border-white/25 backdrop-blur-md',
};

/** Button that leans toward the cursor and carries a soft neon glow. */
export function MagneticButton({ children, variant = 'primary', className, icon, size = 'md', ...rest }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.35 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.35 });

  const handleMove = (e: MouseEvent) => {
    if (reduced || touch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 16);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 12);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-wide transition-colors duration-300 will-change-transform',
    size === 'sm' ? 'px-4 py-2 text-xs' : 'px-6 py-3 text-sm',
    styles[variant],
    className,
  );

  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
      {icon && <span className="relative z-10 flex items-center">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </>
  );

  if (rest.as === 'a') {
    const { href, download, target, onClick } = rest;
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        download={download}
        target={target}
        rel={target === '_blank' ? 'noreferrer noopener' : undefined}
        className={classes}
        style={{ x, y }}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        whileTap={{ scale: 0.97 }}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={rest.onClick}
      className={classes}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.97 }}
    >
      {inner}
    </motion.button>
  );
}
