import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Tag({ children, className, tone = 'default' }: { children: ReactNode; className?: string; tone?: 'default' | 'cyan' | 'violet' }) {
  const tones = {
    default: 'border-slate-400/20 bg-white/5 text-ink-muted',
    cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
    violet: 'border-violet-400/30 bg-violet-400/10 text-violet-200',
  } as const;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.65rem] tracking-wider uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
