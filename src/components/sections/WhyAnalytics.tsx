import { Sparkles, Search, ChartNoAxesCombined, Lightbulb } from 'lucide-react';
import { approach } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { TiltCard } from '../ui/TiltCard';
import { Reveal } from '../ui/Reveal';

const icons = {
  sparkles: Sparkles,
  search: Search,
  chart: ChartNoAxesCombined,
  lightbulb: Lightbulb,
} as const;

export function WhyAnalytics() {
  return (
    <section id="approach" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="10 — Approach"
          title="Why Data Analytics"
          subtitle="Analytics is only useful when it changes a decision. This is how I get there."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {approach.map((card, i) => {
            const Icon = icons[card.icon];
            return (
              <Reveal key={card.title} delay={i * 0.08} className="h-full">
                <TiltCard intensity={7} className="h-full">
                  <GlassCard className="relative h-full overflow-hidden rounded-2xl transition-colors duration-500 hover:border-cyan-300/30">
                    <span className="pointer-events-none absolute -top-14 -left-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
                    <span className="font-mono text-[0.6rem] tracking-[0.3em] text-ink-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-4 grid h-12 w-12 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold text-ink">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{card.text}</p>
                  </GlassCard>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
