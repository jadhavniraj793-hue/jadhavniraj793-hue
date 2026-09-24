'use client';

import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionShellProps = {
  id: string;
  index: string;
  label: string;
  title: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
  /** Renders the heading centered instead of left-aligned. */
  align?: 'left' | 'center';
};

/** Consistent section frame: mono index, glowing title, ambient corner decor. */
export function SectionShell({
  id,
  index,
  label,
  title,
  kicker,
  children,
  className = '',
  align = 'left',
}: SectionShellProps) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 lg:py-32 ${className}`}>
      {/* Section-local ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aqua/25 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal className={align === 'center' ? 'text-center' : ''}>
          <div
            className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}
          >
            <span className="font-mono text-[11px] font-medium tracking-[0.3em] text-aqua/90">
              {index}
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-aqua/70 to-transparent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ash">
              {label}
            </span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] text-mist sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          {kicker && (
            <p className="mt-3 max-w-2xl text-sm text-ash sm:text-base" style={align === 'center' ? { marginInline: 'auto' } : undefined}>
              {kicker}
            </p>
          )}
        </Reveal>

        <div className="mt-10 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}

/** Small labelled pill used across sections. */
export function Chip({
  children,
  tone = 'cyan',
  className = '',
}: {
  children: ReactNode;
  tone?: 'cyan' | 'violet' | 'slate';
  className?: string;
}) {
  const tones = {
    cyan: 'border-aqua/30 bg-aqua/10 text-aqua',
    violet: 'border-violet-glow/30 bg-violet-core/15 text-violet-glow',
    slate: 'border-white/10 bg-white/5 text-ash',
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
