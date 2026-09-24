import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { pipelineOutcomes } from '../data/content';
import { useIsMobile } from '../hooks/useMediaQuery';
import { SectionHeading } from './ui/SectionHeading';

const LazyScene = lazy(() => import('../three/LazyScene').then((m) => ({ default: m.LazyScene })));
const PipelineScene = lazy(() => import('../three/PipelineScene').then((m) => ({ default: m.PipelineScene })));

export function DataUniverse() {
  const isMobile = useIsMobile();

  return (
    <section id="workflow" className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.09),transparent_70%)]" />

      <div className="section-shell">
        <SectionHeading
          eyebrow="Special Feature"
          title={
            <>
              The <span className="text-gradient">Data Universe</span>
            </>
          }
          description="Follow the journey of raw data as it travels through my analytics stack — gathering structure, meaning and momentum at every stage."
        />
      </div>

      <Suspense fallback={<div className="mx-auto h-[380px] max-w-6xl animate-pulse-soft rounded-[36px] bg-white/[0.02]" />}>
        <LazyScene
          className="mx-auto h-[420px] w-full max-w-6xl sm:h-[460px]"
          cameraPosition={[0, 0.15, 9.6]}
          fov={isMobile ? 55 : 44}
          dprMax={isMobile ? 1.25 : 1.75}
        >
          <PipelineScene mobile={isMobile} />
        </LazyScene>
      </Suspense>

      {/* outcome strip */}
      <div className="section-shell mt-4">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ show: { transition: { staggerChildren: 0.14 } } }}
          className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {pipelineOutcomes.map((o, i) => (
            <motion.div
              key={o}
              variants={{
                hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
                show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55 } },
              }}
              className="flex items-center gap-3 sm:gap-4"
            >
              <span
                className={
                  'rounded-2xl border px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] sm:px-6 sm:py-3 sm:text-sm ' +
                  (i === pipelineOutcomes.length - 1
                    ? 'border-cyan-300/40 bg-cyan-400/10 text-cyan-200 shadow-glow-cyan'
                    : 'border-white/10 bg-white/[0.04] text-slate-300')
                }
              >
                {o}
              </span>
              {i < pipelineOutcomes.length - 1 && (
                <motion.span
                  animate={{ x: [0, 5, 0], opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
                  className="text-violet-300"
                >
                  <ArrowRight size={18} />
                </motion.span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
