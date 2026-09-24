'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'primary' | 'glass' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-tight transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap';

const VARIANTS: Record<Variant, string> = {
  primary:
    'text-space bg-gradient-to-r from-aqua via-plasma to-violet-glow shadow-[0_10px_40px_-12px_rgba(0,245,212,0.75)] hover:shadow-[0_16px_50px_-10px_rgba(139,92,246,0.8)]',
  glass:
    'glass text-mist border-white/12 hover:border-aqua/50 hover:text-aqua shadow-[0_10px_40px_-24px_rgba(0,0,0,0.9)]',
  outline:
    'border border-aqua/45 text-aqua hover:bg-aqua/10 hover:border-aqua shadow-[0_0_28px_-14px_rgba(0,245,212,0.8)]',
  ghost: 'text-ash hover:text-mist',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px] sm:h-14 sm:px-8',
};

type SharedProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  /** Adds the sweeping light streak on hover. */
  shine?: boolean;
};

type ButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof SharedProps> & { as?: 'button' };

type AnchorProps = SharedProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof SharedProps> & { as: 'a' };

export type NeonButtonProps = ButtonProps | AnchorProps;

/** Shared CTA component: gradient, glass, outline and ghost variants. */
export function NeonButton(props: NeonButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon,
    iconRight,
    shine = true,
    ...rest
  } = props;

  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const inner = (
    <>
      {shine && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.45)_50%,transparent_75%)] transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
      {icon && <span className="relative shrink-0">{icon}</span>}
      <span className="relative">{children}</span>
      {iconRight && (
        <span className="relative shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
          {iconRight}
        </span>
      )}
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.035 },
    whileTap: { scale: 0.975 },
    transition: { type: 'spring' as const, stiffness: 420, damping: 24 },
    className: `group ${classes}`,
  };

  if (rest.as === 'a') {
    const { as: _as, ...anchorRest } = rest as AnchorProps;
    return (
      <motion.a
        {...motionProps}
        {...(anchorRest as unknown as HTMLMotionProps<'a'>)}
      >
        {inner}
      </motion.a>
    );
  }

  const { as: _as, ...buttonRest } = rest as ButtonProps;
  return (
    <motion.button
      {...motionProps}
      {...(buttonRest as unknown as HTMLMotionProps<'button'>)}
    >
      {inner}
    </motion.button>
  );
}
