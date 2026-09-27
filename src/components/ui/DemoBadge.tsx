import { FlaskConical } from 'lucide-react';
import { cn } from '../../lib/utils';

/** Explicit, always-visible marker so nobody mistakes sample data for real data. */
export function DemoBadge({ label = 'Interactive Portfolio Demo', className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[0.65rem] font-medium tracking-wider text-amber-200 uppercase',
        className,
      )}
    >
      <FlaskConical className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}
