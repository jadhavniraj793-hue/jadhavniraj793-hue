import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BarChart3, Check, PieChart, Table, TrendingUp, X, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { projects, type Project } from '../data/content';
import { Modal } from './ui/Modal';
import { SectionHeading } from './ui/SectionHeading';
import { TiltCard } from './ui/TiltCard';

const iconMap: Record<string, LucideIcon> = { Table, TrendingUp, PieChart, BarChart3 };

function ProjectCard({ project, onOpen, delay }: { project: Project; onOpen: () => void; delay: number }) {
  const Icon = iconMap[project.icon] ?? BarChart3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 52 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.75, delay, ease: [0.21, 0.65, 0.35, 1] }}
    >
      <TiltCard intensity={8} className="rounded-3xl">
        <div className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-glow">
          {/* ghost index + glow */}
          <span className="pointer-events-none absolute -right-3 -top-6 font-display text-[6.5rem] font-bold leading-none text-white/[0.045] transition-colors duration-500 group-hover:text-white/[0.08]">
            {project.index}
          </span>
          <div
            className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
            style={{ background: project.color }}
          />

          <div className="relative flex items-center gap-3.5">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
              style={{ background: `${project.color}14`, color: project.color }}
            >
              <Icon size={21} />
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider"
                  style={{ borderColor: `${project.color}44`, color: project.color, background: `${project.color}0d` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <h3 className="relative mt-5 font-display text-xl font-semibold text-white">{project.title}</h3>
          <p className="relative mt-3 flex-1 text-sm leading-relaxed text-slate-400">{project.description}</p>

          {/* extra info revealed on hover */}
          <div className="relative grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="border-t border-white/8 pt-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  On hover — quick highlights
                </p>
                <ul className="space-y-1.5">
                  {project.approach.slice(0, 2).map((a) => (
                    <li key={a} className="flex items-start gap-2 text-xs text-slate-400">
                      <Check size={13} className="mt-0.5 shrink-0" style={{ color: project.color }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={onOpen}
            className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-[13px] font-semibold text-slate-200 transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-cyan-200 hover:shadow-glow-cyan"
          >
            View Project
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-32 top-40 h-[420px] w-[420px] rounded-full bg-violet-600/9 blur-[150px]" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Selected Work"
          title={
            <>
              Projects That <span className="text-gradient">Tell a Story</span>
            </>
          }
          description="Independent, end-to-end analytics projects — from raw datasets to clear, decision-ready findings."
        />

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} delay={i * 0.12} onOpen={() => setActive(p)} />
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} maxWidth="max-w-2xl" label={active?.title}>
        {active && (
          <div className="p-8 sm:p-10">
            <span className="chip font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: active.color }}>
              Project {active.index}
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">{active.title}</h3>

            <div className="mt-5 flex flex-wrap gap-2">
              {active.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold"
                  style={{ borderColor: `${active.color}44`, color: active.color, background: `${active.color}0d` }}
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="mt-6 text-[15px] leading-relaxed text-slate-300">{active.description}</p>

            <div className="mt-7 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                What the project involved
              </p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {active.approach.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                      style={{ background: `${active.color}1f`, color: active.color }}
                    >
                      <Check size={12} />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {active.toolCategories.map((c) => (
                <span key={c} className="chip text-[10px] text-slate-400">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
