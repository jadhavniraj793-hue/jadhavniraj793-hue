import { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, Braces, ChartColumnBig, FlaskConical, Brain, Info } from 'lucide-react';
import { skillGroups, type SkillGroup } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { Reveal } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';
import { SkillCloud } from './SkillCloud';
import { cn } from '../../lib/utils';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

const icons = {
  table: Table,
  code: Braces,
  bi: ChartColumnBig,
  flask: FlaskConical,
  brain: Brain,
} as const;

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const reduced = usePrefersReducedMotion();
  return (
    <li className="group/skill">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-ink-muted transition group-hover/skill:text-ink">{name}</span>
        <span className="font-mono text-[0.6rem] text-ink-faint opacity-0 transition group-hover/skill:opacity-100">
          {level}
        </span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500"
          initial={reduced ? { width: `${level}%` } : { width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </li>
  );
}

function GroupCard({ group, index, active, onHover }: { group: SkillGroup; index: number; active: boolean; onHover: (id: string) => void }) {
  const Icon = icons[group.icon];
  return (
    <Reveal delay={index * 0.06} className="h-full">
      <TiltCard intensity={6} className="h-full">
        <GlassCard
          onMouseEnter={() => onHover(group.id)}
          className={cn(
            'h-full rounded-2xl transition-colors duration-500',
            active ? 'border-cyan-300/40 shadow-glow' : 'hover:border-cyan-300/25',
          )}
        >
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-ink">{group.title}</h3>
              <p className="mt-1 text-[0.72rem] leading-relaxed text-ink-faint">{group.blurb}</p>
            </div>
          </div>

          <ul className="mt-5 space-y-3">
            {group.skills.map((s, i) => (
              <SkillBar key={s.name} name={s.name} level={s.level} delay={0.05 * i} />
            ))}
          </ul>
        </GlassCard>
      </TiltCard>
    </Reveal>
  );
}

export function Skills() {
  const [active, setActive] = useState(skillGroups[0].id);

  return (
    <section id="skills" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="02 — Toolkit"
          title="Technical Skills"
          subtitle="The tools and techniques I use across the analytics workflow — from raw extract to the final dashboard."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12">
          <Reveal>
            <div className="relative">
              <SkillCloud onSelect={setActive} activeGroup={active} />
              <p className="mt-2 text-center font-mono text-[0.62rem] tracking-[0.25em] text-ink-faint uppercase">
                Interactive skill sphere
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {skillGroups.slice(0, 4).map((group, i) => (
              <GroupCard key={group.id} group={group} index={i} active={active === group.id} onHover={setActive} />
            ))}
          </div>
        </div>

        <div className="mt-4 lg:mt-6">
          <GroupCardWide />
        </div>

        <Reveal delay={0.1}>
          <p className="mt-6 flex items-start gap-2 text-[0.7rem] leading-relaxed text-ink-faint">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400/70" />
            Bar lengths are a visual emphasis placeholder for relative comfort with each tool — they are not measured
            proficiency scores or certification results.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** Core competencies get a wider card since they apply across every group. */
function GroupCardWide() {
  const group = skillGroups[4];
  const Icon = icons[group.icon];
  return (
    <Reveal delay={0.12}>
      <GlassCard className="rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/25 bg-violet-400/10 text-violet-200">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-ink">{group.title}</h3>
            <p className="text-[0.72rem] text-ink-faint">{group.blurb}</p>
          </div>
        </div>
        <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {group.skills.map((s, i) => (
            <SkillBar key={s.name} name={s.name} level={s.level} delay={0.04 * i} />
          ))}
        </ul>
      </GlassCard>
    </Reveal>
  );
}
