import { motion } from 'framer-motion';
import { Calendar, GraduationCap, MapPin } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { education } from '../data/content';
import { useIsMobile } from '../hooks/useMediaQuery';
import { TiltCard } from './ui/TiltCard';

const LazyScene = lazy(() => import('../three/LazyScene').then((m) => ({ default: m.LazyScene })));
const CapScene = lazy(() => import('../three/CapScene').then((m) => ({ default: m.CapScene })));
const CapLights = lazy(() => import('../three/CapScene').then((m) => ({ default: m.CapLights })));

export function Education() {
  const isMobile = useIsMobile();

  return (
    <section id="education" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/9 blur-[150px]" />
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.8, ease: [0.21, 0.65, 0.35, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="chip mb-5 font-mono uppercase tracking-[0.22em] text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
            Education
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Academic <span className="text-gradient">Foundation</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 52, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.21, 0.65, 0.35, 1] }}
          className="mx-auto mt-14 max-w-4xl"
        >
          <TiltCard intensity={6} className="rounded-[32px]">
            <div className="glass relative grid overflow-hidden rounded-[32px] shadow-card transition-all duration-500 hover:border-white/20 hover:shadow-glow sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
              {/* 3D graduation cap */}
              <div className="relative min-h-[280px] overflow-hidden border-b border-white/6 sm:min-h-[340px] sm:border-b-0 sm:border-r">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,0.13),transparent_65%)]" />
                <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
                <Suspense fallback={<div className="flex h-full items-center justify-center text-5xl">🎓</div>}>
                  <LazyScene className="absolute inset-0" cameraPosition={[0, 0.3, 4.4]} fov={42} dprMax={isMobile ? 1.25 : 1.6}>
                    <CapLights />
                    <CapScene />
                  </LazyScene>
                </Suspense>
              </div>

              {/* details */}
              <div className="relative flex flex-col justify-center p-8 sm:p-10">
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-500/12 blur-3xl" />
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/12 text-violet-300">
                  <GraduationCap size={22} />
                </span>
                <h3 className="relative mt-5 font-display text-2xl font-semibold text-white">{education.degree}</h3>
                <p className="relative mt-2 text-[15px] font-medium text-slate-300">{education.institution}</p>

                <div className="relative mt-6 flex flex-wrap gap-2.5">
                  <span className="chip">
                    <Calendar size={12} className="text-cyan-300" />
                    {education.period}
                  </span>
                  <span className="chip">
                    <MapPin size={12} className="text-violet-300" />
                    {education.location}
                  </span>
                </div>

                <p className="relative mt-6 border-t border-white/8 pt-5 text-sm leading-relaxed text-slate-400">
                  An economics foundation that sharpens the way I read markets, indicators and human
                  behaviour — the perfect base for a career in data analytics.
                </p>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
