'use client';

import { BarChart3, Database, LineChart, PieChart, Sparkles, Workflow, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Database,
  BarChart3,
  LineChart,
  PieChart,
  Workflow,
  Sparkles,
};

/** Name → lucide icon resolver so data files can stay plain strings. */
export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = ICONS[name] ?? Sparkles;
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden />;
}
