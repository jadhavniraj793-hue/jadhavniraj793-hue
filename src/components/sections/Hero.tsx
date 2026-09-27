import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileDown, Sparkles, MapPin } from 'lucide-react';
import { GithubIcon } from '../ui/BrandIcons';
import { profile } from '../../data/portfolio';
import { MagneticButton } from '../ui/MagneticButton';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { scrollToId } from '../../lib/scroll';

const HeroScene = lazy(() => import('../three/HeroScene'));

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};
const item = {
  hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

const marquee = ['Excel', 'SQL', 'Python', 'Pandas', 'Power BI', 'Tableau', 'EDA', 'Dashboards'];

export function Hero() {
  const reduced = usePrefersReducedMotion();

  const scrollTo = (id: string) => scrollToId(id);

  return (
    <section id="home" className="relative flex min-h-[100svh] w-full items-center overflow-hidden pt-24 pb-16">
      {/* 3D environment */}
      <div className="absolute inset-0 -z-10">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-abyss via-abyss/70 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 lg:bg-[radial-gradient(60%_75%_at_18%_50%,rgba(5,7,15,0.88),rgba(5,7,15,0.35)_55%,transparent_80%)]"
          aria-hidden
        />
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="section-shell relative z-10">
        <div className="max-w-3xl">
          <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/8 px-3.5 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
            </span>
            <span className="font-mono text-[0.65rem] tracking-[0.22em] text-cyan-100 uppercase">
              Available for Data Analyst roles
            </span>
          </motion.div>

          <motion.p variants={item} className="eyebrow mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{profile.fullName}</span>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
              <MapPin className="h-3 w-3" /> {profile.location}
            </span>
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(2.6rem,9vw,7rem)] leading-[0.92] font-bold tracking-tighter"
          >
            <span className="sr-only">{profile.fullName} — Data Analyst. </span>
            <span className="text-gradient block" aria-hidden>
              DATA
            </span>
            <span className="block text-ink" aria-hidden>
              ANALYST
              <span className="ml-3 inline-block h-3 w-3 translate-y-[-0.35em] rounded-full bg-cyan-300 align-middle shadow-glow" />
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 font-display text-xl font-medium text-ink sm:text-2xl lg:text-3xl">
            <span className="text-accent-gradient">{profile.tagline}</span>
          </motion.p>

          <motion.p variants={item} className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            {profile.intro}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton onClick={() => scrollTo('projects')} icon={<Sparkles className="h-4 w-4" />}>
              Explore My Work
            </MagneticButton>
            <MagneticButton as="a" href={profile.github} target="_blank" variant="outline" icon={<GithubIcon className="h-4 w-4" />}>
              View GitHub
            </MagneticButton>
            <MagneticButton as="a" href={profile.resume} download variant="ghost" icon={<FileDown className="h-4 w-4" />}>
              Download Resume
            </MagneticButton>
          </motion.div>

          {/* tool marquee */}
          <motion.div variants={item} className="mt-12 max-w-xl">
            <div className="mask-fade-b relative overflow-hidden">
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {marquee.map((t) => (
                  <span
                    key={t}
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[0.68rem] tracking-wider text-ink-muted backdrop-blur-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        onClick={() => scrollTo('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ink-faint transition hover:text-cyan-200"
        aria-label="Scroll to about section"
      >
        <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase">Scroll</span>
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/20">
          <motion.span
            className="mt-2 h-1.5 w-1 rounded-full bg-cyan-300"
            animate={reduced ? {} : { y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
        <ArrowDown className="h-3.5 w-3.5" />
      </motion.button>
    </section>
  );
}
