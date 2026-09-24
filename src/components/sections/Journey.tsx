'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Briefcase, CircleDot, GraduationCap } from 'lucide-react';
import { useRef } from 'react';
import { experience, sectionMeta } from '@/lib/data';
import { Chip, SectionShell } from '../ui/SectionShell';
import { RevealGroup, fadeUp } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';

const TYPE_META = {
  experience: {
    Icon: Briefcase,
    label: 'Experience',
    node: 'border-aqua/50 bg-aqua/15 text-aqua',
    glow: 'shadow-[0_0_30px_-6px_rgba(0,245,212,0.85)]',
  },
  education: {
    Icon: GraduationCap,
    label: 'Education',
    node: 'border-violet-glow/50 bg-violet-core/20 text-violet-glow',
    glow: 'shadow-[0_0_30px_-6px_rgba(139,92,246,0.85)]',
  },
} as const;

export function Journey() {
  const meta = sectionMeta.journey;
  const timeline = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timeline,
    offset: ['start 75%', 'end 65%'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const dotTop = useTransform(fill, (value) => `${Math.min(100, Math.max(0, value * 100))}%`);

  return (
    <SectionShell
      id="journey"
      index={meta.index}
      label={meta.label}
      title={meta.title}
      kicker={meta.kicker}
    >
      <div ref={timeline} className="relative">
        {/* Spine */}
        <div
          aria-hidden
          className="absolute bottom-2 left-[19px] top-2 w-px bg-white/10 sm:left-[23px]"
        />
        <motion.div
          aria-hidden
          style={{ scaleY: fill }}
          className="absolute bottom-2 left-[19px] top-2 w-px origin-top bg-gradient-to-b from-aqua via-plasma to-violet-glow shadow-[0_0_16px_rgba(0,245,212,0.6)] sm:left-[23px]"
        />
        {/* Travelling node */}
        <motion.span
          aria-hidden
          style={{ top: dotTop }}
          className="absolute left-[19px] hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua shadow-[0_0_22px_6px_rgba(0,245,212,0.55)] sm:left-[23px] sm:block"
        />

        <RevealGroup as="ul" className="space-y-6 sm:space-y-8" staggerChildren={0.14} amount={0.1}>
          {experience.map((item, index) => {
            const type = TYPE_META[item.type];
            const isCurrent = index === 0;

            return (
              <motion.li key={item.id} variants={fadeUp} className="relative pl-12 sm:pl-16">
                {/* Node */}
                <span
                  className={`absolute left-0 top-5 grid h-10 w-10 place-items-center rounded-xl border backdrop-blur-sm sm:h-12 sm:w-12 ${
                    type.node
                  } ${type.glow}`}
                >
                  <type.Icon className="h-4.5 w-4.5" strokeWidth={1.9} />
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-xl border border-aqua/40 animate-ping" />
                  )}
                </span>

                <TiltCard intensity={5} className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Chip tone={item.type === 'experience' ? 'cyan' : 'violet'}>
                      <type.Icon className="h-3 w-3" strokeWidth={2} />
                      {type.label}
                    </Chip>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-ash">
                      <CircleDot className="h-3 w-3 text-aqua/70" strokeWidth={2} />
                      {item.period}
                    </span>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-aqua/25 bg-aqua/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-aqua">
                        current
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-mist sm:text-xl">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-sm text-ash">{item.org}</p>

                  <ul className="mt-5 space-y-2.5">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-[13px] leading-relaxed text-mist/85"
                      >
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gradient-to-br from-aqua to-violet-glow" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/8 pt-4">
                    {item.skills.map((skill) => (
                      <Chip key={skill} tone="slate">
                        {skill}
                      </Chip>
                    ))}
                  </div>
                </TiltCard>
              </motion.li>
            );
          })}
        </RevealGroup>
      </div>
    </SectionShell>
  );
}
