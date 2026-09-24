'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { orbitSkills, sectionMeta, skillGroups } from '@/lib/data';
import { useDeviceTier, useInViewport } from '@/lib/hooks';
import { Icon } from '../ui/Icon';
import { Marquee } from '../ui/Marquee';
import { RevealGroup, fadeUp } from '../ui/Reveal';
import { SectionShell } from '../ui/SectionShell';
import { TiltCard } from '../ui/TiltCard';

const SkillsOrbScene = dynamic(
  () => import('../three/SkillsOrbScene').then((mod) => mod.SkillsOrbScene),
  { ssr: false, loading: () => null }
);

const ACCENTS = {
  cyan: {
    icon: 'border-aqua/25 bg-aqua/10 text-aqua',
    bar: 'from-aqua to-aqua-deep',
    glow: 'rgba(0,245,212,0.16)',
  },
  violet: {
    icon: 'border-violet-glow/25 bg-violet-core/15 text-violet-glow',
    bar: 'from-violet-glow to-violet-core',
    glow: 'rgba(139,92,246,0.18)',
  },
  mixed: {
    icon: 'border-plasma/25 bg-plasma/10 text-plasma',
    bar: 'from-plasma to-violet-glow',
    glow: 'rgba(34,211,238,0.16)',
  },
} as const;

/** Animated proficiency meter. */
function SkillBar({ name, detail, level, gradient }: { name: string; detail?: string; level: number; gradient: string }) {
  return (
    <li className="group/skill">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-mist">{name}</span>
        <span className="font-mono text-[10px] text-ash-dim">{level}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/6">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className={`block h-full rounded-full bg-gradient-to-r ${gradient} shadow-[0_0_14px_-2px_rgba(0,245,212,0.7)]`}
        />
      </div>
      {detail && (
        <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-ash-dim transition-colors group-hover/skill:text-aqua/80">
          {detail}
        </p>
      )}
    </li>
  );
}

export function Skills() {
  const meta = sectionMeta.skills;
  const section = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const inView = useInViewport(section, { rootMargin: '150px' });
  const show3D = tier === 'high' || tier === 'medium';

  return (
    <div ref={section} className="relative">
      {/* Orbiting analytics core behind the cards */}
      {show3D && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]">
          <SkillsOrbScene quality={tier === 'high' ? 'high' : 'medium'} active={inView} />
        </div>
      )}

      <SectionShell
        id="skills"
        index={meta.index}
        label={meta.label}
        title={meta.title}
        kicker={meta.kicker}
        className="relative"
      >
        <RevealGroup
          as="div"
          className="grid gap-5 sm:grid-cols-2"
          staggerChildren={0.1}
          amount={0.12}
        >
          {skillGroups.map((group) => {
            const accent = ACCENTS[group.accent];
            return (
              <motion.div key={group.id} variants={fadeUp} className="h-full">
                <TiltCard intensity={7} glare={accent.glow} className="h-full p-6">
                  <div className="flex items-start gap-4">
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${accent.icon}`}
                    >
                      <Icon name={group.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-mist sm:text-lg">
                        {group.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-ash">{group.blurb}</p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-4">
                    {group.skills.map((skill) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        detail={skill.detail}
                        level={skill.level}
                        gradient={accent.bar}
                      />
                    ))}
                  </ul>
                </TiltCard>
              </motion.div>
            );
          })}
        </RevealGroup>

        {/* Orbiting skill ticker */}
        <div className="relative mt-12 space-y-2">
          <Marquee items={orbitSkills.slice(0, 9)} duration={46} />
          <Marquee items={[...orbitSkills].reverse().slice(3)} duration={58} reverse />
        </div>
      </SectionShell>
    </div>
  );
}
