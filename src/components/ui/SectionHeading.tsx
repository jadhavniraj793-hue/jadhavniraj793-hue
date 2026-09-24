import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.21, 0.65, 0.35, 1] }}
      className={cn('mb-14 sm:mb-16', centered ? 'text-center' : 'text-left')}
    >
      <span
        className={cn(
          'chip mb-5 font-mono uppercase tracking-[0.22em] text-violet-300',
          centered && 'mx-auto',
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg',
            centered && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
        className={cn(
          'mt-6 h-px w-28 origin-left bg-gradient-to-r from-violet-500 via-sky-400 to-cyan-300',
          centered && 'mx-auto origin-center',
        )}
      />
    </motion.div>
  );
}
