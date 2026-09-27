import { motion } from 'framer-motion';
import { Database, Brush, Shuffle, Microscope, ChartSpline, Lightbulb, CircleCheckBig } from 'lucide-react';
import { pipeline } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

const icons = [Database, Brush, Shuffle, Microscope, ChartSpline, Lightbulb, CircleCheckBig];

export function Process() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="process" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="09 — Method"
          title="Data Analytics Process"
          subtitle="Every project runs through the same pipeline — the discipline is what makes the insight trustworthy."
        />

        <div className="relative mt-16">
          {/* travelling data particles along the pipeline */}
          <div className="pointer-events-none absolute inset-x-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent xl:block">
            {!reduced &&
              [0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="absolute -top-[3px] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_12px_2px_rgba(34,211,238,0.85)]"
                  initial={{ left: '0%', opacity: 0 }}
                  animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, delay: i * 1.35, ease: 'linear' }}
                />
              ))}
          </div>

          <ol className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            {pipeline.map((step, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={step.step} delay={i * 0.06} as="li" className="h-full">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    className="glass glass-sheen group relative flex h-full flex-col items-center rounded-2xl px-3 py-6 text-center transition-colors duration-500 hover:border-cyan-300/35"
                  >
                    <span className="relative grid h-12 w-12 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
                      <Icon className="h-5 w-5" />
                      <span className="absolute inset-0 rounded-xl border border-cyan-300/30 opacity-0 transition duration-500 group-hover:animate-[pulse-ring_2s_ease-out_infinite] group-hover:opacity-100" />
                    </span>
                    <span className="mt-4 font-mono text-[0.6rem] tracking-[0.3em] text-cyan-300/80">{step.step}</span>
                    <h3 className="mt-1 font-display text-sm font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-[0.7rem] leading-relaxed text-ink-faint">{step.text}</p>

                    {/* connector arrow */}
                    {i < pipeline.length - 1 && (
                      <span className="absolute top-1/2 -right-2.5 hidden h-5 w-5 -translate-y-1/2 items-center justify-center text-cyan-400/45 xl:flex">
                        →
                      </span>
                    )}
                  </motion.div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
