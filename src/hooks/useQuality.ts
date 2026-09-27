import { useMemo } from 'react';
import { useIsMobile, useIsTablet, usePrefersReducedMotion } from './useMediaQuery';

export type QualityTier = 'low' | 'medium' | 'high';

export type QualitySettings = {
  tier: QualityTier;
  dpr: [number, number];
  particles: number;
  bars: number;
  nodes: number;
  bloom: boolean;
  shadows: boolean;
  /** Global animation speed multiplier — 0 freezes motion for reduced-motion users. */
  motion: number;
};

/**
 * Central place that decides how heavy a 3D scene is allowed to be.
 * Mobile keeps the visual identity but with far fewer objects and no post FX.
 */
export function useQuality(): QualitySettings {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const reduced = usePrefersReducedMotion();

  return useMemo(() => {
    const tier: QualityTier = isMobile ? 'low' : isTablet ? 'medium' : 'high';
    const base: Record<QualityTier, Omit<QualitySettings, 'tier' | 'motion'>> = {
      low: { dpr: [1, 1.4], particles: 260, bars: 7, nodes: 9, bloom: false, shadows: false },
      medium: { dpr: [1, 1.7], particles: 620, bars: 9, nodes: 14, bloom: true, shadows: false },
      high: { dpr: [1, 2], particles: 1100, bars: 12, nodes: 20, bloom: true, shadows: false },
    };
    return { tier, motion: reduced ? 0 : 1, ...base[tier] };
  }, [isMobile, isTablet, reduced]);
}
