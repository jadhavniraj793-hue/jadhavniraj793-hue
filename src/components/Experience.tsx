import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, Check } from 'lucide-react';
import { useRef } from 'react';
import { experience } from '../data/content';
import { SectionHeading } from './ui/SectionHeading';
import { TiltCard } from './ui/TiltCard';

export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 82%', 'end 55%'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="experience" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[420px] w-[420px] rounded-full bg-cyan-500/8 blur-[150px]" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Journey"
          title={
            <>
              Experience & <span className="text-gradient">Growth</span>
            </>
          }
        />

        <div ref={timelineRef} className="relative mx-auto max-w-3xl">
          {/* rail */}
          <div className="absolute left-[22px] top-2 h-full w-px bg-white/8 sm:left-1/2" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-[22px] top-2 h-full w-px origin-top bg-gradient-to-b from-violet-500 via-sky-400 to-cyan-300 shadow-glow-sm sm:left-1/2"
          />

          {/* node marker */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 240, damping: 16 }}
              className="absolute left-[22px] top-10 z-10 -translate-x-1/2 sm:left-1/2"
            >
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-violet-400/40 bg-void shadow-glow-sm">
                <Briefcase size={17} className="text-violet-300" />
                <span className="absolute inset-0 animate-pulse-ring rounded-full border border-violet-400/50" />
              </span>
            </motion.div>

            {/* entry card — offset right of the rail on mobile, right column on desktop */}
            <div className="pl-16 sm:pl-0 sm:pr-0">
              <div className="sm:ml-[calc(50%+3.5rem)]">
                <motion.div
                  initial={{ opacity: 0, x: 56 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, ease: [0.21, 0.65, 0.35, 1] }}
                >
                  <TiltCard intensity={6} className="rounded-3xl">
                    <div className="glass relative overflow-hidden rounded-3xl p-7 shadow-card transition-all duration-500 hover:border-white/20 hover:shadow-glow sm:p-8">
                      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />

                      <span className="chip font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                        {experience.period}
                      </span>
                      <h3 className="mt-4 font-display text-xl font-semibold text-white sm:text-2xl">
                        {experience.role}
                      </h3>
                      <p className="mt-1.5 text-sm font-medium text-gradient">{experience.org}</p>

                      <ul className="relative mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                        {experience.points.map((p, i) => (
                          <motion.li
                            key={p}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.25 + i * 0.06, duration: 0.45 }}
                            className="flex items-start gap-2.5 text-[13.5px] text-slate-300"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/25 to-cyan-500/25 text-cyan-300">
                              <Check size={11} />
                            </span>
                            {p}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </TiltCard>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
