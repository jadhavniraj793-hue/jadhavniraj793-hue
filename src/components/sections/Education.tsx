import { Suspense, lazy } from 'react';
import { GraduationCap, Sigma, BookOpen } from 'lucide-react';
import { education } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { Reveal } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';

const EducationScene = lazy(() => import('../three/EducationScene'));

export function Education() {
  return (
    <section id="education" className="relative scroll-mt-24 overflow-x-clip py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="07 — Foundation"
          title="Education"
          subtitle="The statistical and economic grounding behind the analysis."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative h-72 sm:h-96">
              <Suspense fallback={null}>
                <EducationScene />
              </Suspense>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-abyss to-transparent" />
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute top-2 bottom-2 left-4 w-px bg-gradient-to-b from-cyan-400/40 via-blue-500/25 to-transparent" />
            {education.map((item, i) => (
              <Reveal key={item.degree} delay={i * 0.1}>
                <div className="relative pl-12">
                  <span className="absolute top-6 left-4 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-cyan-300/45 bg-abyss text-cyan-200 shadow-glow-sm">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <TiltCard intensity={6}>
                    <GlassCard className="rounded-2xl">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-display text-xl font-semibold text-ink">{item.degree}</h3>
                        <span className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 font-mono text-[0.62rem] tracking-wider text-cyan-100">
                          {item.period}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-ink-muted">{item.institution}</p>
                      <p className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-100">
                        <Sigma className="h-4 w-4 text-cyan-300" />
                        {item.note}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-1.5">
                        {item.highlights.map((h) => (
                          <li
                            key={h}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.68rem] text-ink-muted"
                          >
                            <BookOpen className="h-3 w-3 text-cyan-400/70" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </TiltCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
