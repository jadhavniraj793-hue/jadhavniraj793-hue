'use client';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, Linkedin, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { heroStats, profile } from '@/lib/data';
import { smoothScrollTo, useDeviceTier, useInViewport, useMounted } from '@/lib/hooks';
import { NeonButton } from '../ui/NeonButton';
import { Reveal, RevealGroup, fadeUp } from '../ui/Reveal';
import { HeroHud } from './HeroHud';

// three.js is code-split out of the initial bundle and never server-rendered.
const HeroScene = dynamic(() => import('../three/HeroScene').then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => null,
});

/** Cycles the professional roles with a blinking terminal caret. */
function RoleRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % profile.roles.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-sm text-aqua sm:text-base">
      <span className="text-ash">role:</span>
      <span className="relative inline-flex h-6 min-w-[11rem] items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={profile.roles[index]}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 whitespace-nowrap"
          >
            {profile.roles[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.span
        aria-hidden
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1.1, repeat: Infinity }}
        className="inline-block h-4 w-[7px] bg-aqua"
      />
    </div>
  );
}

function CssFallback() {
  // Shown instead of WebGL on low-end devices / reduced-motion — still looks alive.
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-aqua/20 animate-spin-slow">
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-aqua shadow-[0_0_20px_6px_rgba(0,245,212,0.6)]" />
      </div>
      <div className="absolute left-1/2 top-1/2 h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-glow/15 animate-spin-slower">
        <span className="absolute top-1/2 -right-1 h-1.5 w-1.5 rounded-full bg-violet-glow shadow-[0_0_18px_5px_rgba(139,92,246,0.55)]" />
      </div>
      <div className="absolute left-1/2 top-1/2 h-[30vmin] w-[30vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,245,212,0.22),transparent_70%)] blur-2xl animate-pulse-glow" />
    </div>
  );
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const mounted = useMounted();
  const inView = useInViewport(section, { rootMargin: '150px' });
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end start'],
  });

  const canvasOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const show3D = tier === 'high' || tier === 'medium';

  return (
    <section
      ref={section}
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32 sm:pt-36 lg:pb-28"
    >
      {/* ---------- 3D cosmos ---------- */}
      <motion.div style={{ opacity: canvasOpacity }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,rgba(0,245,212,0.10),transparent_60%)]" />
        {!mounted ? null : show3D ? (
          <HeroScene quality={tier === 'high' ? 'high' : 'medium'} active={inView} />
        ) : (
          <CssFallback />
        )}
        {/* Legibility scrim so the copy always wins over the scene */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-space via-space/80 to-transparent lg:via-space/55" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-space to-transparent" />
      </motion.div>

      {/* ---------- Floating HUD cards over the scene ---------- */}
      <HeroHud />

      {/* ---------- Copy ---------- */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-7xl px-5 sm:px-8"
      >
        {/* Kept narrower than the globe's left edge so copy and 3D never fight. */}
        <div className="max-w-2xl lg:max-w-[42rem]">
          <Reveal y={16}>
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full glass-soft px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-aqua animate-blip" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-aqua/95">
                {profile.availability}
              </span>
              <span className="hidden h-3 w-px bg-white/15 sm:block" />
              <span className="hidden items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ash sm:inline-flex">
                <MapPin className="h-3 w-3" strokeWidth={2} /> {profile.locationShort}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.6rem]">
              <span className="block text-mist">Niraj Laxman</span>
              <span className="block text-gradient">Jadhav</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12} className="mt-5">
            <RoleRotator />
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ash sm:text-lg">
              {profile.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <NeonButton
                as="a"
                href="#projects"
                size="lg"
                onClick={(event) => {
                  event.preventDefault();
                  smoothScrollTo('#projects', -80);
                }}
                icon={<Sparkles className="h-4 w-4" strokeWidth={2} />}
                iconRight={<ArrowRight className="h-4 w-4" strokeWidth={2} />}
              >
                Explore Projects
              </NeonButton>

              <NeonButton
                as="a"
                href="#contact"
                variant="glass"
                size="lg"
                onClick={(event) => {
                  event.preventDefault();
                  smoothScrollTo('#contact', -80);
                }}
                icon={<Mail className="h-4 w-4" strokeWidth={2} />}
              >
                Get In Touch
              </NeonButton>

              <NeonButton
                as="a"
                href={profile.resumePath}
                download="Niraj-Jadhav-Resume.pdf"
                variant="outline"
                size="lg"
                icon={<Download className="h-4 w-4" strokeWidth={2} />}
              >
                Download Resume
              </NeonButton>
            </div>
          </Reveal>

          {/* Social shortcuts */}
          <Reveal delay={0.3}>
            <div className="mt-7 flex items-center gap-3">
              {[
                { href: profile.linkedin, label: 'LinkedIn', Icon: Linkedin, external: true },
                { href: `mailto:${profile.email}`, label: 'Email', Icon: Mail, external: false },
                { href: `tel:${profile.phoneHref}`, label: 'Phone', Icon: Phone, external: false },
              ].map(({ href, label, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-ash transition-all duration-300 hover:-translate-y-0.5 hover:border-aqua/50 hover:text-aqua hover:shadow-[0_0_26px_-8px_rgba(0,245,212,0.7)]"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.9} />
                </a>
              ))}
              <span className="ml-1 font-mono text-[11px] text-ash-dim">
                {profile.email}
              </span>
            </div>
          </Reveal>

          {/* Stats */}
          <RevealGroup
            as="ul"
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            staggerChildren={0.07}
          >
            {heroStats.map((stat) => (
              <motion.li
                key={stat.label}
                variants={fadeUp}
                className="rounded-2xl glass-soft px-4 py-3 transition-colors duration-300 hover:border-aqua/30"
              >
                <span className="block font-display text-xl font-bold text-mist sm:text-2xl">
                  {stat.value}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-wider text-ash">
                  {stat.label}
                </span>
                <span className="mt-1 block font-mono text-[10px] text-aqua/70">{stat.hint}</span>
              </motion.li>
            ))}
          </RevealGroup>
        </div>
      </motion.div>

      {/* ---------- Scroll cue ---------- */}
      <motion.button
        onClick={() => smoothScrollTo('#about', -80)}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ash transition-colors hover:text-aqua sm:flex"
        aria-label="Scroll to about section"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">scroll</span>
        <span className="relative h-10 w-5 rounded-full border border-white/15">
          <motion.span
            animate={{ y: [3, 18, 3], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-aqua"
          />
        </span>
      </motion.button>
    </section>
  );
}
