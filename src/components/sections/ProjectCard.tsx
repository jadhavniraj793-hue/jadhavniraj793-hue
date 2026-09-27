import { motion } from 'framer-motion';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import type { Project } from '../../data/portfolio';
import { profile } from '../../data/portfolio';
import { ProjectPreview } from './ProjectCharts';
import { GlassCard } from '../ui/GlassCard';
import { TiltCard } from '../ui/TiltCard';
import { Reveal } from '../ui/Reveal';
import { DemoBadge } from '../ui/DemoBadge';
import { GithubIcon } from '../ui/BrandIcons';
import { cn } from '../../lib/utils';

type Props = {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  variant?: 'featured' | 'compact';
};

export function ProjectCard({ project, index, onOpen, variant = 'featured' }: Props) {
  const featured = variant === 'featured';

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <TiltCard intensity={featured ? 5 : 7} className="h-full">
        <GlassCard
          padded={false}
          className={cn(
            'flex h-full flex-col overflow-hidden rounded-3xl transition-colors duration-500 hover:border-cyan-300/35',
          )}
        >
          {/* chart preview */}
          <div className="relative h-44 w-full overflow-hidden border-b border-white/8 bg-[#060c1c]/60 sm:h-52">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{ background: `radial-gradient(520px 200px at 20% -20%, ${project.accent}26, transparent 70%)` }}
            />
            <div className="absolute inset-0 p-3">
              <ProjectPreview kind={project.chart} />
            </div>
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <span className="rounded-md border border-white/10 bg-abyss/70 px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.2em] text-cyan-200 uppercase backdrop-blur">
                {project.index}
              </span>
              {project.demo && <DemoBadge label="Demo Project" className="scale-90" />}
            </div>
            <button
              onClick={() => onOpen(project)}
              className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-abyss/70 text-ink-muted backdrop-blur transition hover:border-cyan-300/50 hover:text-cyan-200"
              aria-label={`Open ${project.title} case study`}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* body */}
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.6rem] tracking-[0.22em] text-cyan-300/90 uppercase">{project.toolLabel}</span>
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold text-ink sm:text-xl">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.description}</p>

            {featured && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {project.kpis.slice(0, 3).map((kpi) => (
                  <div key={kpi.label} className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                    <div className="font-mono text-[0.55rem] tracking-[0.16em] text-ink-faint uppercase">{kpi.label}</div>
                    <div className="mt-0.5 truncate font-display text-sm font-semibold text-ink">{kpi.value}</div>
                  </div>
                ))}
              </div>
            )}

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.analysis.slice(0, featured ? 5 : 4).map((a) => (
                <li key={a} className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[0.66rem] text-ink-muted">
                  {a}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => onOpen(project)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-4 py-2 text-xs font-semibold text-abyss shadow-[0_10px_30px_-14px_rgba(34,211,238,0.9)]"
              >
                {featured ? 'View Project' : 'Explore Project'}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </motion.button>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs text-ink-muted transition hover:border-cyan-300/45 hover:text-cyan-100"
              >
                <GithubIcon className="h-3.5 w-3.5" /> GitHub
              </a>
            </div>
          </div>
        </GlassCard>
      </TiltCard>
    </Reveal>
  );
}
