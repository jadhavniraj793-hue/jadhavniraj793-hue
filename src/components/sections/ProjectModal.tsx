import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Database, Target, Workflow, Lightbulb, ClipboardList, Wrench, ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/portfolio';
import { profile } from '../../data/portfolio';
import { datasetPreviews } from '../../data/analytics';
import { ProjectVisuals } from './ProjectCharts';
import { DemoBadge } from '../ui/DemoBadge';
import { GithubIcon } from '../ui/BrandIcons';
import { MagneticButton } from '../ui/MagneticButton';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

const WORKFLOW = ['Raw Data', 'Cleaning', 'Transformation', 'Analysis', 'Visualization', 'Business Insight'];

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
        <span className="text-cyan-300">{icon}</span>
        {title}
      </h3>
      <div className="mt-3 text-sm leading-relaxed text-ink-muted">{children}</div>
    </div>
  );
}

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const reduced = usePrefersReducedMotion();
  useLockBodyScroll(!!project);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const dataset = project ? datasetPreviews[project.id] : undefined;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[90] overflow-y-auto overscroll-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} case study`}
        >
          <div className="fixed inset-0 bg-abyss/85 backdrop-blur-xl" onClick={onClose} />

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60, rotateX: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1400 }}
            className="relative mx-auto my-6 w-[min(92rem,94vw)] pb-10"
          >
            <div className="glass-strong relative overflow-hidden rounded-3xl">
              {/* header */}
              <div className="relative border-b border-white/8 px-5 py-6 sm:px-8 sm:py-8">
                <div
                  className="pointer-events-none absolute inset-0 opacity-50"
                  style={{ background: `radial-gradient(700px 240px at 12% -30%, ${project.accent}33, transparent 70%)` }}
                />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[0.65rem] tracking-[0.3em] text-cyan-300 uppercase">
                        Project {project.index}
                      </span>
                      {project.demo && <DemoBadge label="Portfolio Demo Project" />}
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-4xl">{project.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm text-ink-muted">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-2.5 py-1 font-mono text-[0.62rem] tracking-wider text-cyan-100 uppercase"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/5 text-ink transition hover:border-rose-300/50 hover:text-rose-200"
                    aria-label="Close project"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {project.kpis.map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05 }}
                      className="rounded-xl border border-white/8 bg-white/[0.035] p-3"
                    >
                      <div className="font-mono text-[0.58rem] tracking-[0.18em] text-ink-faint uppercase">{kpi.label}</div>
                      <div className="mt-1 font-display text-base font-bold text-ink sm:text-lg">{kpi.value}</div>
                      {kpi.delta && <div className="mt-0.5 text-[0.62rem] text-emerald-300">{kpi.delta}</div>}
                    </motion.div>
                  ))}
                </div>

                {/* workflow */}
                <div className="glass rounded-2xl p-5">
                  <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
                    <Workflow className="h-4 w-4 text-cyan-300" /> Analysis Workflow
                  </h3>
                  <ol className="mt-4 flex flex-wrap items-center gap-2">
                    {WORKFLOW.map((step, i) => (
                      <motion.li
                        key={step}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.07 }}
                        className="flex items-center gap-2"
                      >
                        <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] text-ink-muted">
                          <span className="mr-1.5 font-mono text-[0.6rem] text-cyan-300">{String(i + 1).padStart(2, '0')}</span>
                          {step}
                        </span>
                        {i < WORKFLOW.length - 1 && <span className="text-cyan-400/50">→</span>}
                      </motion.li>
                    ))}
                  </ol>
                </div>

                {/* visuals */}
                <ProjectVisuals kind={project.chart} />

                {/* narrative */}
                <div className="grid gap-4 lg:grid-cols-2">
                  <Block icon={<Target className="h-4 w-4" />} title="Business Problem">
                    {project.problem}
                  </Block>
                  <Block icon={<Database className="h-4 w-4" />} title="Dataset">
                    {project.dataset}
                  </Block>
                  <Block icon={<ClipboardList className="h-4 w-4" />} title="Methodology">
                    <ol className="space-y-2">
                      {project.methodology.map((m, i) => (
                        <li key={m} className="flex gap-3">
                          <span className="font-mono text-[0.65rem] text-cyan-300">{String(i + 1).padStart(2, '0')}</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ol>
                  </Block>
                  <Block icon={<Wrench className="h-4 w-4" />} title="Key Analysis">
                    <ul className="flex flex-wrap gap-1.5">
                      {project.analysis.map((a) => (
                        <li key={a} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.7rem]">
                          {a}
                        </li>
                      ))}
                    </ul>
                  </Block>
                  <Block icon={<Lightbulb className="h-4 w-4" />} title="Insights">
                    <ul className="space-y-2">
                      {project.insights.map((ins) => (
                        <li key={ins} className="flex gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                          <span>{ins}</span>
                        </li>
                      ))}
                    </ul>
                  </Block>
                  <Block icon={<ArrowUpRight className="h-4 w-4" />} title="Recommendations">
                    <ul className="space-y-2">
                      {project.recommendations.map((rec) => (
                        <li key={rec} className="flex gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </Block>
                </div>

                {/* dataset preview */}
                {dataset && (
                  <div className="glass overflow-hidden rounded-2xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-5 py-3">
                      <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
                        <Database className="h-4 w-4 text-cyan-300" /> Dataset Preview
                      </h3>
                      <span className="font-mono text-[0.6rem] tracking-wider text-ink-faint uppercase">
                        Sample rows — illustrative structure
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[40rem] text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/8 bg-white/[0.02]">
                            {dataset.columns.map((c) => (
                              <th key={c} className="px-4 py-2.5 font-mono text-[0.62rem] tracking-wider text-cyan-200/80 uppercase">
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dataset.rows.map((row, i) => (
                            <tr key={i} className="border-b border-white/5 transition hover:bg-cyan-400/5">
                              {row.map((cell, j) => (
                                <td key={j} className="px-4 py-2.5 font-mono text-[0.7rem] text-ink-muted">
                                  {typeof cell === 'number' ? cell.toLocaleString('en-IN') : cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <MagneticButton as="a" href={profile.github} target="_blank" icon={<GithubIcon className="h-4 w-4" />}>
                    View on GitHub
                  </MagneticButton>
                  <MagneticButton variant="ghost" onClick={onClose}>
                    Close
                  </MagneticButton>
                  {project.demo && (
                    <span className="text-[0.68rem] text-ink-faint">
                      Figures shown are simulated demonstration data, not client or employer data.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
