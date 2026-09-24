'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Calendar, Layers } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { projects, sectionMeta, type Project } from '@/lib/data';
import { useDeviceTier, useInViewport } from '@/lib/hooks';
import { Chip, SectionShell } from '../ui/SectionShell';
import { RevealGroup, fadeUp } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';

const ProjectChart = dynamic(
  () => import('../three/ProjectChart').then((mod) => mod.ProjectChart),
  { ssr: false, loading: () => null }
);

const ACCENT_HEX: Record<Project['accent'], string> = {
  cyan: '#00f5d4',
  violet: '#8b5cf6',
  mixed: '#22d3ee',
};

function ProjectVisual({ project, index }: { project: Project; index: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const inView = useInViewport(frame, { rootMargin: '120px' });
  const show3D = tier === 'high' || tier === 'medium';
  const accent = ACCENT_HEX[project.accent];

  return (
    <div
      ref={frame}
      className="relative h-[220px] w-full overflow-hidden rounded-2xl border border-white/8 bg-[radial-gradient(ellipse_at_center,rgba(10,15,29,0.9),rgba(5,8,17,1))] sm:h-[260px]"
    >
      {/* corner brackets */}
      {[
        'left-2 top-2 border-l border-t',
        'right-2 top-2 border-r border-t',
        'left-2 bottom-2 border-b border-l',
        'right-2 bottom-2 border-b border-r',
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`pointer-events-none absolute h-4 w-4 border-white/20 ${pos}`}
        />
      ))}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${accent}22, transparent 65%)`,
        }}
      />

      {show3D ? (
        <ProjectChart variant={project.visual} accent={accent} active={inView} />
      ) : (
        <div className="grid h-full place-items-center">
          <div className="flex h-24 items-end gap-2">
            {[0.4, 0.72, 0.35, 0.9, 0.6].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h * 100}%` }}
                className="w-3 rounded-sm bg-gradient-to-t from-aqua-deep to-aqua opacity-70"
              />
            ))}
          </div>
        </div>
      )}

      <span className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
        fig. {String(index + 1).padStart(2, '0')} · {project.visual}
      </span>
      <span
        className="pointer-events-none absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        interactive 3D
      </span>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  const accent = ACCENT_HEX[project.accent];

  return (
    <motion.article variants={fadeUp}>
      <TiltCard intensity={4} glare={`${accent}1f`} className="p-5 sm:p-7">
        <div
          className={`grid items-start gap-6 lg:grid-cols-[1.02fr_1fr] lg:gap-8 ${
            flip ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          <ProjectVisual project={project} index={index} />

          <div>
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[11px] tracking-[0.28em]"
                style={{ color: accent }}
              >
                {project.index}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-ash">
                <Calendar className="h-3 w-3" strokeWidth={2} />
                {project.year}
              </span>
            </div>

            <h3 className="mt-3 font-display text-xl font-bold text-mist sm:text-2xl">
              {project.title}
            </h3>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ash">
              {project.category}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-ash">{project.summary}</p>

            <ul className="mt-5 space-y-2.5">
              {project.highlights.map((point) => (
                <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-mist/85">
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    style={{ color: accent }}
                    strokeWidth={2}
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-white/8 pt-4">
              {project.tags.map((tag) => (
                <Chip key={tag} tone={project.accent === 'violet' ? 'violet' : 'cyan'}>
                  {tag}
                </Chip>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash-dim">
                <Layers className="h-3.5 w-3.5 text-aqua/70" strokeWidth={1.9} />
                {project.tech.join(' · ')}
              </span>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-aqua transition-transform duration-300 group-hover:translate-x-0.5">
                Case highlights
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

export function Projects() {
  const meta = sectionMeta.projects;

  return (
    <SectionShell
      id="projects"
      index={meta.index}
      label={meta.label}
      title={meta.title}
      kicker={meta.kicker}
    >
      <RevealGroup as="div" className="space-y-6 sm:space-y-8" staggerChildren={0.12} amount={0.08}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </RevealGroup>
    </SectionShell>
  );
}
