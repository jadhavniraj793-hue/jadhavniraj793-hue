'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1 },
};

export const stagger = (delayChildren = 0.05, staggerChildren = 0.09): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variants?: Variants;
  /** Reveal distance override (px). */
  y?: number;
  as?: 'div' | 'li' | 'span' | 'article' | 'section';
  amount?: number;
};

/** Scroll-triggered reveal used by every block on the page. */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.75,
  variants,
  y = 28,
  as = 'div',
  amount = 0.25,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) return <Component className={className}>{children}</Component>;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants ?? { hidden: { opacity: 0, y }, show: { opacity: 1, y: 0 } }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

/** Parent for staggered children — pair with `<Reveal variants={fadeUp} />`. */
export function RevealGroup({
  children,
  className,
  delayChildren = 0.05,
  staggerChildren = 0.09,
  amount = 0.2,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  amount?: number;
  as?: 'div' | 'ul' | 'section';
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  if (reduced) return <Component className={className}>{children}</Component>;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={stagger(delayChildren, staggerChildren)}
    >
      {children}
    </Component>
  );
}
