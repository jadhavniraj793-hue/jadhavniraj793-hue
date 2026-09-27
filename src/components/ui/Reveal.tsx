import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article' | 'span';
  once?: boolean;
};

/** Scroll-reveal wrapper. Collapses to a plain element when motion is reduced. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div', once = true }: Props) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
