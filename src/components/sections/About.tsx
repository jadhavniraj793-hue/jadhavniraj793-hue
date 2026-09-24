'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, GraduationCap, MapPin, Quote, Target } from 'lucide-react';
import { aboutBadges, profile, sectionMeta } from '@/lib/data';
import { Chip, SectionShell } from '../ui/SectionShell';
import { Reveal, RevealGroup, fadeUp } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';

const TOOLBELT = ['Excel', 'SQL', 'Python', 'Power BI', 'Tableau', 'Pandas', 'NumPy', 'DAX'];

/** Holographic "analyst ID" panel with a scanning highlight. */
function IdCard() {
  return (
    <TiltCard intensity={7} className="overflow-hidden p-6">
      <div className="relative overflow-hidden">
        {/* scanline */}
        <motion.span
          aria-hidden
          animate={{ y: ['-30%', '640%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-transparent via-aqua/12 to-transparent"
        />

        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
          <span>analyst_id.json</span>
          <span className="flex items-center gap-1.5 text-aqua/80">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua animate-pulse-glow" /> live
          </span>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-aqua/25 bg-gradient-to-br from-aqua/18 via-plasma/10 to-violet-core/25">
            <span className="font-display text-2xl font-bold text-gradient">{profile.initials}</span>
            <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full border border-aqua/40 bg-space text-aqua">
              <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold leading-tight text-mist">
              {profile.name}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-aqua/90">
              {profile.title}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-ash">
              <MapPin className="h-3.5 w-3.5 text-aqua/70" strokeWidth={1.9} />
              {profile.location}
            </p>
          </div>
        </div>

        <dl className="mt-6 space-y-3 border-t border-white/8 pt-5">
          {[
            { term: 'Focus', Icon: Target, value: 'Analytics · BI · Visual storytelling' },
            { term: 'Foundation', Icon: GraduationCap, value: 'B.A. Economics · statistics' },
            { term: 'Status', Icon: BadgeCheck, value: profile.availability },
          ].map(({ term, Icon, value }) => (
            <div key={term} className="flex items-start gap-3">
              <dt className="flex w-24 shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ash-dim">
                <Icon className="h-3.5 w-3.5 text-aqua/60" strokeWidth={1.8} />
                {term}
              </dt>
              <dd className="text-[13px] leading-snug text-mist/90">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </TiltCard>
  );
}

export function About() {
  const meta = sectionMeta.about;

  return (
    <SectionShell
      id="about"
      index={meta.index}
      label={meta.label}
      title={meta.title}
      kicker={meta.kicker}
    >
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
        <Reveal>
          <IdCard />
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={0.08}>
            <div className="rounded-3xl glass p-6 sm:p-7">
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-aqua/60" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-aqua/90">
                  career summary
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-[1.85] text-ash sm:text-base">
                {profile.about}
              </p>

              <figure className="mt-6 flex gap-3 rounded-2xl border-l-2 border-aqua/60 bg-aqua/[0.04] p-4">
                <Quote className="h-4 w-4 shrink-0 text-aqua/80" strokeWidth={2} />
                <figcaption className="text-sm italic leading-relaxed text-mist/85">
                  I don&apos;t just report numbers — I explain what changed, why it changed, and what
                  to do next.
                </figcaption>
              </figure>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-white/8 pt-5">
                {TOOLBELT.map((tool) => (
                  <Chip key={tool} tone="slate">
                    {tool}
                  </Chip>
                ))}
              </div>
            </div>
          </Reveal>

          <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-3" staggerChildren={0.09}>
            {aboutBadges.map((badge) => (
              <motion.li key={badge.title} variants={fadeUp}>
                <TiltCard
                  intensity={8}
                  glare={
                    badge.accent === 'cyan' ? 'rgba(0,245,212,0.16)' : 'rgba(139,92,246,0.18)'
                  }
                  className="h-full p-5"
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl border text-lg ${
                      badge.accent === 'cyan'
                        ? 'border-aqua/25 bg-aqua/10'
                        : 'border-violet-glow/25 bg-violet-core/15'
                    }`}
                  >
                    {badge.icon}
                  </span>
                  <h3 className="mt-4 font-display text-[15px] font-semibold leading-snug text-mist">
                    {badge.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ash">{badge.subtitle}</p>
                </TiltCard>
              </motion.li>
            ))}
          </RevealGroup>
        </div>
      </div>
    </SectionShell>
  );
}
