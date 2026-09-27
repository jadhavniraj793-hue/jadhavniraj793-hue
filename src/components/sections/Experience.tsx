import { motion } from 'framer-motion';
import { Briefcase, Sparkles } from 'lucide-react';
import { experience } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { Reveal } from '../ui/Reveal';

export function Experience() {
  return (
    <section id="experience" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="06 — Track Record"
          title="Experience"
          subtitle="Where the practice happens: self-directed analytics work, structured coursework and end-to-end project builds."
        />

        <div className="relative mx-auto mt-14 max-w-3xl">
          {/* animated timeline spine */}
          <div className="absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-transparent via-cyan-400/35 to-transparent sm:left-1/2">
            <motion.span
              className="absolute -left-[3px] h-16 w-[7px] rounded-full bg-gradient-to-b from-cyan-200 to-transparent blur-[1px]"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {experience.map((item, i) => (
            <Reveal key={item.role} delay={i * 0.1}>
              <div className="relative pb-10 pl-12 sm:pl-0">
                {/* node */}
                <span className="absolute top-6 left-4 z-10 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border border-cyan-300/50 bg-abyss shadow-glow-sm sm:left-1/2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  <span className="absolute inset-0 animate-[pulse-ring_2.6s_ease-out_infinite] rounded-full border border-cyan-300/50" />
                </span>

                <div className="sm:grid sm:grid-cols-2 sm:gap-10">
                  <div className="sm:pr-4 sm:text-right">
                    <GlassCard className="rounded-2xl">
                      <div className="flex items-center gap-2 sm:justify-end">
                        <Briefcase className="h-4 w-4 text-cyan-300" />
                        <h3 className="font-display text-lg font-semibold text-ink">{item.role}</h3>
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">{item.org}</p>
                      <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 font-mono text-[0.62rem] tracking-wider text-cyan-100">
                        {item.period}
                      </p>
                    </GlassCard>
                  </div>

                  <div className="mt-4 sm:mt-0 sm:pl-4">
                    <GlassCard className="rounded-2xl">
                      <ul className="space-y-3">
                        {item.points.map((point, j) => (
                          <motion.li
                            key={point}
                            initial={{ opacity: 0, x: 12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 * j, duration: 0.5 }}
                            className="flex gap-3 text-sm leading-relaxed text-ink-muted"
                          >
                            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400/70" />
                            {point}
                          </motion.li>
                        ))}
                      </ul>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-2 max-w-2xl text-center text-[0.7rem] leading-relaxed text-ink-faint">
            This portfolio intentionally lists only independent project and self-learning experience — no company roles or
            internships are claimed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
