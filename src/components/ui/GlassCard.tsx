import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  strong?: boolean;
  glow?: boolean;
  padded?: boolean;
};

export function GlassCard({ children, className, strong, glow, padded = true, ...rest }: Props) {
  return (
    <div
      className={cn(
        'glass-sheen relative overflow-hidden rounded-2xl',
        strong ? 'glass-strong' : 'glass',
        padded && 'p-5 sm:p-6',
        glow && 'shadow-glow',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
