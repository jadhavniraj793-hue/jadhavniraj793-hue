'use client';

import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Infinite horizontal ticker. The track is duplicated once and translated by
 * -50%, which makes the loop seamless at any width.
 */
export function Marquee({
  items,
  reverse = false,
  duration = 42,
  className = '',
}: {
  items: readonly string[];
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] ${className}`}
      aria-hidden
    >
      <div
        className="flex w-max shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {[...items, ...items].map((item, i) => (
          <MarqueeChip key={`${item}-${i}`}>{item}</MarqueeChip>
        ))}
      </div>
    </div>
  );
}

function MarqueeChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-ash backdrop-blur-sm">
      <Sparkles className="h-3 w-3 text-aqua/80" strokeWidth={1.75} />
      {children}
    </span>
  );
}
