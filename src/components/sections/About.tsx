import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, CircleCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import { aboutStats, focusAreas, profile } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { Reveal } from '../ui/Reveal';
import { Counter } from '../ui/Counter';
import { TiltCard } from '../ui/TiltCard';

const AboutScene = lazy(() => import('../three/AboutScene'));

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="01 — Profile"
          title="About Me"
          subtitle="An analyst who cares as much about the cleaning and the question as about the chart at the end."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* 3D profile card */}
          <Reveal>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="pointer-events-none absolute -inset-10 -z-0 opacity-90">
                <Suspense fallback={null}>
                  <AboutScene />
                </Suspense>
              </div>

              <TiltCard intensity={9} className="relative z-10">
                <GlassCard strong className="rounded-3xl p-7 text-center" glow>
                  <div className="relative mx-auto grid h-28 w-28 place-items-center">
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full border border-cyan-300/40"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.span
                      aria-hidden
                      className="absolute inset-3 rounded-full border border-blue-400/35 border-dashed"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="font-display text-3xl font-bold text-gradient">{profile.initials}</span>
                  </div>

                  <h3 className="mt-5 font-display text-xl font-semibold text-ink">{profile.fullName}</h3>
                  <p className="mt-1 font-mono text-[0.68rem] tracking-[0.28em] text-cyan-200 uppercase">{profile.role}</p>
                  <p className="mt-4 text-xs leading-relaxed text-ink-muted">{profile.tagline}</p>

                  <div className="mt-6 space-y-2.5 text-left">
                    {[
                      { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
                      { icon: Phone, label: profile.phone, href: `tel:${profile.phoneHref}` },
                      { icon: MapPin, label: profile.location },
                    ].map(({ icon: Icon, label, href }) => (
                      <div key={label} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
                        {href ? (
                          <a href={href} className="truncate text-xs text-ink-muted transition hover:text-cyan-200">
                            {label}
                          </a>
                        ) : (
                          <span className="truncate text-xs text-ink-muted">{label}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex justify-center gap-2">
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/5 text-ink-muted transition hover:border-cyan-300/50 hover:text-cyan-200"
                      aria-label="GitHub"
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/5 text-ink-muted transition hover:border-cyan-300/50 hover:text-cyan-200"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  </div>
                </GlassCard>
              </TiltCard>
            </div>
          </Reveal>

          {/* copy + stats */}
          <div>
            <Reveal delay={0.08}>
              <p className="font-display text-lg leading-relaxed text-ink sm:text-xl">{profile.summary}</p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">{profile.summaryLong}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-7 flex flex-wrap gap-2">
                {focusAreas.map((area) => (
                  <li
                    key={area}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-ink-muted transition hover:border-cyan-300/40 hover:text-cyan-100"
                  >
                    <CircleCheck className="h-3.5 w-3.5 text-cyan-400/70 transition group-hover:text-cyan-300" />
                    {area}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {aboutStats.map((stat, i) => (
                <Reveal key={stat.label} delay={0.08 * i}>
                  <GlassCard className="h-full rounded-2xl p-4 transition-colors duration-500 hover:border-cyan-300/30">
                    <div className="font-display text-2xl font-bold text-gradient sm:text-3xl">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-1 text-[0.78rem] font-medium text-ink">{stat.label}</div>
                    <div className="mt-1 font-mono text-[0.6rem] leading-relaxed tracking-wide text-ink-faint">{stat.hint}</div>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
