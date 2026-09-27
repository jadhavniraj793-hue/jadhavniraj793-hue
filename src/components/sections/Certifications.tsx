import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Award } from 'lucide-react';
import { certifications } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { cn } from '../../lib/utils';

export function Certifications() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="certifications" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="08 — Credentials"
          title="Certifications"
          subtitle="Structured coursework across the analytics and business intelligence toolchain."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: '1400px' }}>
          {certifications.map((cert, i) => {
            const active = open === cert.name;
            return (
              <Reveal key={cert.name} delay={i * 0.07} className="h-full">
                <motion.button
                  onClick={() => setOpen(active ? null : cert.name)}
                  whileHover={{ rotateX: -6, rotateY: 5, y: -6 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                  style={{ transformPerspective: 1200 }}
                  className={cn(
                    'glass glass-sheen group relative flex h-full w-full flex-col overflow-hidden rounded-2xl p-6 text-left transition-colors duration-500',
                    active ? 'border-cyan-300/50' : 'hover:border-cyan-300/30',
                  )}
                  aria-expanded={active}
                >
                  {/* certificate glow */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-cyan-400/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  {/* holographic scan line */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cyan-300/12 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-[scan_2.4s_ease-in-out_infinite]"
                  />

                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
                      <Award className="h-5 w-5" />
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[0.6rem] tracking-wider text-ink-muted uppercase">
                      {cert.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-base leading-snug font-semibold text-ink">{cert.name}</h3>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-cyan-200/90">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {cert.issuer}
                  </p>

                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 border-t border-white/8 pt-4 text-xs leading-relaxed text-ink-muted">{cert.focus}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <span className="mt-4 font-mono text-[0.6rem] tracking-[0.2em] text-ink-faint uppercase">
                    {active ? 'Tap to collapse' : 'Tap for details'}
                  </span>
                </motion.button>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-[0.7rem] text-ink-faint">
            Certificate verification links are available on request — none are linked here to avoid publishing
            unverified URLs.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
