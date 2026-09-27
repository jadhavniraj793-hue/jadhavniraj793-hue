import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { cn } from '../../lib/utils';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <Reveal y={16}>
          <span className="eyebrow inline-flex items-center gap-2">
            <span className="inline-block h-1 w-1 rounded-full bg-cyan-glow shadow-glow-sm" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          <span className="text-gradient">{title}</span>
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p className={cn('max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base', align === 'center' && 'mx-auto')}>
            {subtitle}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.16} className={cn('w-full', align === 'center' && 'flex justify-center')}>
        <span className="hairline mt-2 block h-px w-40" />
      </Reveal>
    </div>
  );
}
