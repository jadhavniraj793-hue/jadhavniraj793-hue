import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Download, MapPin, Sparkles } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { profile, stats } from '../data/content';
import { useIsMobile } from '../hooks/useMediaQuery';
import { resumePdfUrl } from '../utils/cn';
import { Counter } from './ui/Counter';

const LazyScene = lazy(() =>
  import('../three/LazyScene').then((m) => ({ default: m.LazyScene })),
);
const HeroScene = lazy(() =>
  import('../three/HeroScene').then((m) => ({ default: m.HeroScene })),
);
const HeroLights = lazy(() =>
  import('../three/HeroScene').then((m) => ({ default: m.HeroLights })),
);

const name = profile.displayName;

export function Hero() {
  const isMobile = useIsMobile();

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-violet-600/14 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-cyan-500/12 blur-[140px]" />

      {/* 3D data universe behind hero content */}
      <Suspense fallback={null}>
        <LazyScene className="absolute inset-0" cameraPosition={[0, 0, 9.2]} fov={40} dprMax={isMobile ? 1.3 : 1.75}>
          <HeroLights />
          <HeroScene mobile={isMobile} />
        </LazyScene>
      </Suspense>

      {/* soft vignette to keep text legible */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_46%,rgba(4,6,13,0.72),transparent_75%)]" />

      <div className="section-shell relative z-10 pb-28 pt-32 sm:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="chip mb-7 font-mono uppercase tracking-[0.2em] text-cyan-200"
        >
          <Sparkles size={13} className="text-cyan-300" />
          {profile.role} <span className="text-slate-500">•</span> <MapPin size={12} className="text-violet-300" />{' '}
          {profile.location}
        </motion.div>

        <h1
          aria-label={name}
          className="font-display text-[13.5vw] font-bold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl xl:text-[6.5rem]"
        >
          <motion.span
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.28 } } }}
            className="inline-flex flex-wrap"
          >
            {name.split('').map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden
                variants={{
                  hidden: { opacity: 0, y: 40, rotateX: 70, filter: 'blur(8px)' },
                  show: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    filter: 'blur(0px)',
                    transition: { type: 'spring', stiffness: 110, damping: 16 },
                  },
                }}
                className="inline-block bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent"
              >
                {ch === ' ' ? '\u00A0\u00A0' : ch}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-5 font-display text-xl font-medium tracking-wide text-gradient-animated sm:text-2xl lg:text-3xl"
        >
          “{profile.headline}”
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-400 sm:text-lg"
        >
          {profile.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15 }}
          className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4"
        >
          <a href="#projects" className="btn-primary">
            View My Projects
            <ArrowRight size={16} />
          </a>
          <a href={resumePdfUrl} download="Niraj_Jadhav_Resume.pdf" className="btn-ghost">
            <Download size={16} className="text-cyan-300" />
            Download Resume
          </a>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-14 flex max-w-2xl flex-wrap gap-x-10 gap-y-6"
        >
          {stats.map((s) => (
            <div key={s.label} className="min-w-[92px]">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-bold text-white sm:text-4xl">
                <Counter to={s.value} suffix={s.suffix} />
              </dd>
              <dd className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-500 transition-colors hover:text-cyan-300 md:flex"
        aria-label="Scroll to About"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1 rounded-full bg-gradient-to-b from-violet-400 to-cyan-300"
          />
        </span>
        <ChevronDown size={13} className="animate-bounce-soft" />
      </motion.a>
    </section>
  );
}
